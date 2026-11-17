param(
    [int]$Port = 8080,
    [string]$RootDirectory = $PSScriptRoot
)

Clear-Host
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "   JNV ALUMNI MOBILE APP - TEMPORARY MEETING DEMO LAUNCHER" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# Clean up any dangling background tunnel processes from previous runs
Stop-Process -Name "cloudflared" -Force -ErrorAction SilentlyContinue

Write-Host " [1/3] Starting high-performance multi-threaded web server..." -ForegroundColor White

$code = @"
using System;
using System.IO;
using System.Net;
using System.Threading;

public class MiniWebServer
{
    private HttpListener listener;
    private string rootDir;
    private volatile bool running = false;

    public void Start(int port, string root)
    {
        rootDir = Path.GetFullPath(root);
        listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:" + port + "/");
        listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
        try { listener.Prefixes.Add("http://[::1]:" + port + "/"); } catch {}
        listener.Start();
        running = true;

        new Thread(() =>
        {
            while (running)
            {
                try
                {
                    HttpListenerContext context = listener.GetContext();
                    ThreadPool.QueueUserWorkItem(state => ProcessRequest((HttpListenerContext)state), context);
                }
                catch
                {
                    if (!running) break;
                }
            }
        }) { IsBackground = true }.Start();
    }

    public void Stop()
    {
        running = false;
        try { listener.Stop(); } catch {}
    }

    private void ProcessRequest(HttpListenerContext context)
    {
        var response = context.Response;
        try
        {
            string urlPath = context.Request.Url.AbsolutePath;
            if (urlPath == "/" || string.IsNullOrEmpty(urlPath))
            {
                response.StatusCode = 302;
                response.Headers["Location"] = "/mobile_app/index.html";
                response.Close();
                return;
            }

            if (urlPath.Equals("/mobile_app", StringComparison.OrdinalIgnoreCase) || 
                urlPath.Equals("/mobile_app/", StringComparison.OrdinalIgnoreCase))
            {
                response.StatusCode = 302;
                response.Headers["Location"] = "/mobile_app/index.html";
                response.Close();
                return;
            }

            string unescaped = Uri.UnescapeDataString(urlPath).TrimStart('/', '\\');
            if (unescaped.StartsWith("mobile_app/assets/", StringComparison.OrdinalIgnoreCase))
            {
                unescaped = unescaped.Substring("mobile_app/".Length);
            }

            string filePath = Path.Combine(rootDir, unescaped.Replace('/', Path.DirectorySeparatorChar));

            if (Directory.Exists(filePath))
            {
                filePath = Path.Combine(filePath, "index.html");
            }

            if (File.Exists(filePath))
            {
                string ext = Path.GetExtension(filePath).ToLowerInvariant();
                response.ContentType = GetMimeType(ext);
                response.Headers["Access-Control-Allow-Origin"] = "*";
                response.Headers["Cache-Control"] = "public, max-age=3600";
                response.StatusCode = 200;

                using (var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    response.ContentLength64 = fs.Length;
                    if (!string.Equals(context.Request.HttpMethod, "HEAD", StringComparison.OrdinalIgnoreCase))
                    {
                        fs.CopyTo(response.OutputStream);
                    }
                }
            }
            else
            {
                response.StatusCode = 404;
                byte[] notFound = System.Text.Encoding.UTF8.GetBytes("404 Not Found");
                response.ContentLength64 = notFound.Length;
                if (!string.Equals(context.Request.HttpMethod, "HEAD", StringComparison.OrdinalIgnoreCase))
                {
                    response.OutputStream.Write(notFound, 0, notFound.Length);
                }
            }
        }
        catch
        {
            try { response.StatusCode = 500; } catch {}
        }
        finally
        {
            try { response.OutputStream.Close(); } catch {}
        }
    }

    private string GetMimeType(string ext)
    {
        switch (ext)
        {
            case ".html":
            case ".htm": return "text/html; charset=utf-8";
            case ".css": return "text/css; charset=utf-8";
            case ".js": return "application/javascript; charset=utf-8";
            case ".json": return "application/json; charset=utf-8";
            case ".png": return "image/png";
            case ".jpg":
            case ".jpeg": return "image/jpeg";
            case ".svg": return "image/svg+xml";
            case ".ico": return "image/x-icon";
            case ".webp": return "image/webp";
            default: return "application/octet-stream";
        }
    }
}
"@

try {
    Add-Type -TypeDefinition $code
} catch {}

$server = New-Object MiniWebServer
try {
    $server.Start($Port, $RootDirectory)
} catch {
    Write-Host "Port $Port is already in use. Please close any other running server window and retry." -ForegroundColor Red
    Read-Host "Press [ENTER] to exit"
    exit 1
}

Write-Host " [2/3] Establishing temporary Cloudflare secure HTTPS tunnel (IPv4/HTTP2)..." -ForegroundColor White
$cloudflaredExe = Join-Path $RootDirectory "cloudflared.exe"
$tunnelLog = Join-Path $RootDirectory "meeting_tunnel.log"
if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force -ErrorAction SilentlyContinue }

# Note: --no-prechecks, --edge-ip-version 4, --protocol http2 and --http-host-header localhost:$Port
# completely resolve Error 1033 by preventing IPv6 hangs and mapping host headers to HTTP.SYS
$cfArgs = "tunnel --no-prechecks --edge-ip-version 4 --protocol http2 --http-host-header localhost:$Port --url http://127.0.0.1:$Port"
$tunnelProc = Start-Process -FilePath $cloudflaredExe -ArgumentList $cfArgs -PassThru -WindowStyle Hidden -RedirectStandardError $tunnelLog

# Wait for public URL and edge registration
$publicUrl = ""
$timeout = 25
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$isRegistered = $false

while ($sw.Elapsed.TotalSeconds -lt $timeout) {
    Start-Sleep -Milliseconds 600
    if (Test-Path $tunnelLog) {
        $content = Get-Content $tunnelLog -ErrorAction SilentlyContinue | Out-String
        if ($content -match 'https://[a-zA-Z0-9-]+\.trycloudflare\.com') {
            $publicUrl = $matches[0]
        }
        if ($content -match 'Registered tunnel connection') {
            $isRegistered = $true
            break
        }
    }
}

# If URL is found but registration line didn't hit before timeout, give 1 extra second
if ($publicUrl -and (-not $isRegistered)) {
    Start-Sleep -Seconds 1
}

if (-not $publicUrl) {
    Write-Host ""
    Write-Host "Could not automatically establish public tunnel." -ForegroundColor Red
    Write-Host "Make sure your laptop is connected to the internet." -ForegroundColor Yellow
    $server.Stop()
    Stop-Process -Id $tunnelProc.Id -Force -ErrorAction SilentlyContinue
    Read-Host "Press [ENTER] to exit"
    exit 1
}

$mobilePublicUrl = "$publicUrl/mobile_app/index.html"
$qrFile = Join-Path $RootDirectory "meeting_mobile_qr.png"

Write-Host " [3/3] Generating meeting QR Code..." -ForegroundColor White
try {
    $qrApi = "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=" + [System.Uri]::EscapeDataString($mobilePublicUrl)
    Invoke-WebRequest -Uri $qrApi -OutFile $qrFile -TimeoutSec 6 -UseBasicParsing -ErrorAction SilentlyContinue
    if (Test-Path $qrFile) {
        Start-Process -FilePath $qrFile
    }
} catch {}

Clear-Host
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "   LIVE MEETING BROADCAST IS ACTIVE! (DO NOT CLOSE THIS WINDOW)      " -ForegroundColor Yellow -BackgroundColor DarkRed
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Copy and paste this link into your Zoom / Google Meet chat:" -ForegroundColor White
Write-Host ""
Write-Host "     👉  $mobilePublicUrl" -ForegroundColor Yellow -BackgroundColor DarkBlue
Write-Host ""
Write-Host "  -------------------------------------------------------------------" -ForegroundColor Gray
Write-Host "  📱 ATTENDEES MOBILE ACCESS:" -ForegroundColor Cyan
Write-Host "  • Attendees do NOT need your Wi-Fi! They can use their own 4G / 5G" -ForegroundColor White
Write-Host "    mobile data or office Wi-Fi anywhere in the world." -ForegroundColor White
Write-Host "  • They simply click the link (or scan the QR code on your screen)." -ForegroundColor White
Write-Host "  • All images, campus photos, logos, and tabs will load instantly!" -ForegroundColor White
Write-Host ""
Write-Host "  ⚠️  IMPORTANT FOR MEETING HOST:" -ForegroundColor Red
Write-Host "  • KEEP THIS WINDOW OPEN for the entire meeting duration!" -ForegroundColor Yellow
Write-Host "    (This window is hosting the live web server on your laptop)." -ForegroundColor White
Write-Host "  • Ensure your laptop remains awake during the demo." -ForegroundColor White
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host ""

# Safe loop: will never terminate on accidental Enter/space keypresses
while ($true) {
    $inputCmd = Read-Host "Server is LIVE. Type 'STOP' and press [ENTER] when your meeting finishes"
    if ($inputCmd -eq "STOP" -or $inputCmd -eq "stop" -or $inputCmd -eq "exit" -or $inputCmd -eq "quit") {
        break
    } else {
        Write-Host "  [ACTIVE] Demo server is running live for attendees. (Type 'STOP' to finish)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Terminating demo link and shutting down server..." -ForegroundColor DarkYellow
$server.Stop()
Stop-Process -Id $tunnelProc.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Name "cloudflared" -Force -ErrorAction SilentlyContinue
if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force -ErrorAction SilentlyContinue }
if (Test-Path $qrFile) { Remove-Item $qrFile -Force -ErrorAction SilentlyContinue }
Write-Host "[DONE] Demo link destroyed. All public access has been cut off." -ForegroundColor Green
Start-Sleep -Seconds 2
