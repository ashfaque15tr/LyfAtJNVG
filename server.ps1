param(
    [int]$Port = 8080,
    [string]$RootDirectory = $PSScriptRoot
)

# Detect local LAN / Wi-Fi IP address
$ipList = [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) | 
          Where-Object { 
              $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and 
              $_.ToString() -ne "127.0.0.1" -and 
              -not $_.ToString().StartsWith("169.254.") 
          }

$localIP = if ($ipList) { $ipList[0].ToString() } else { "127.0.0.1" }
$mobileUrl = "http://${localIP}:${Port}/mobile_app/index.html"
$desktopUrl = "http://localhost:${Port}/login.html"

# Try generating / updating local QR code image
$qrFile = Join-Path $RootDirectory "scan_with_mobile.png"
try {
    $qrApiUrl = "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=" + [System.Uri]::EscapeDataString($mobileUrl)
    Invoke-WebRequest -Uri $qrApiUrl -OutFile $qrFile -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue
} catch {}

$code = @"
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;

public class MiniTcpServer
{
    private TcpListener listener;
    private string rootDir;
    private volatile bool running = false;

    public void Start(int port, string root)
    {
        rootDir = Path.GetFullPath(root);
        listener = new TcpListener(IPAddress.Any, port);
        listener.Start();
        running = true;

        new Thread(() =>
        {
            while (running)
            {
                try
                {
                    TcpClient client = listener.AcceptTcpClient();
                    ThreadPool.QueueUserWorkItem(state => ProcessClient((TcpClient)state), client);
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

    private void ProcessClient(TcpClient client)
    {
        try
        {
            client.NoDelay = true;
            using (var stream = client.GetStream())
            using (var reader = new StreamReader(stream))
            {
                string requestLine = reader.ReadLine();
                if (string.IsNullOrEmpty(requestLine)) return;

                // Drain headers
                while (!string.IsNullOrEmpty(reader.ReadLine())) {}

                string[] parts = requestLine.Split(' ');
                if (parts.Length < 2) return;

                string urlPath = parts[1].Split('?')[0];
                if (urlPath == "/" || string.IsNullOrEmpty(urlPath))
                {
                    urlPath = "/mobile_app/index.html";
                }

                string unescaped = Uri.UnescapeDataString(urlPath).TrimStart('/', '\\');
                string filePath = Path.Combine(rootDir, unescaped.Replace('/', Path.DirectorySeparatorChar));

                if (Directory.Exists(filePath))
                {
                    filePath = Path.Combine(filePath, "index.html");
                }

                if (File.Exists(filePath))
                {
                    string ext = Path.GetExtension(filePath).ToLowerInvariant();
                    string contentType = GetMimeType(ext);

                    using (var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        string header = "HTTP/1.1 200 OK\r\n" +
                                        "Content-Type: " + contentType + "\r\n" +
                                        "Content-Length: " + fs.Length + "\r\n" +
                                        "Access-Control-Allow-Origin: *\r\n" +
                                        "Cache-Control: public, max-age=3600\r\n" +
                                        "Connection: close\r\n\r\n";
                        byte[] headerBytes = System.Text.Encoding.ASCII.GetBytes(header);
                        stream.Write(headerBytes, 0, headerBytes.Length);
                        fs.CopyTo(stream);
                    }
                }
                else
                {
                    string notFound = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 9\r\nConnection: close\r\n\r\nNot Found";
                    byte[] notFoundBytes = System.Text.Encoding.ASCII.GetBytes(notFound);
                    stream.Write(notFoundBytes, 0, notFoundBytes.Length);
                }
                stream.Flush();
            }
        }
        catch {}
        finally
        {
            try { client.Close(); } catch {}
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

$server = New-Object MiniTcpServer
try {
    $server.Start($Port, $RootDirectory)
} catch {
    Write-Host "Failed to start server on port $Port : $_" -ForegroundColor Red
    exit 1
}

Clear-Host
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "   JAWAHAR NAVODAYA VIDYALAYA ALUMNI MOBILE APP - LIVE TEST SERVER   " -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  [STATUS] Multi-threaded live server is ACTIVE on your local network!" -ForegroundColor Green
Write-Host ""
Write-Host "  📲 HOW TO TEST ON YOUR PHONE (ANDROID OR iPHONE):" -ForegroundColor Magenta
Write-Host "  -------------------------------------------------------------------" -ForegroundColor Gray
Write-Host "  Option 1: Scan the QR Code" -ForegroundColor White
Write-Host "    A QR code image has been opened on your screen (scan_with_mobile.png)." -ForegroundColor Gray
Write-Host "    Open your phone camera, scan the QR code, and tap the link." -ForegroundColor Gray
Write-Host ""
Write-Host "  Option 2: Open this URL directly on your phone's browser (Chrome/Safari):" -ForegroundColor White
Write-Host "    👉  $mobileUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "  💻 (Optional) Test on your Laptop browser:" -ForegroundColor White
Write-Host "    👉  $desktopUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "  -------------------------------------------------------------------" -ForegroundColor Gray
Write-Host "  📱 HOW TO INSTALL AS A NATIVE MOBILE APP ON YOUR PHONE:" -ForegroundColor Magenta
Write-Host "    • Android (Chrome): Tap menu (⋮) -> Select 'Install App' or 'Add to Home screen'." -ForegroundColor White
Write-Host "    • iPhone (Safari):  Tap Share icon (⎋) -> Select 'Add to Home Screen'." -ForegroundColor White
Write-Host "    Result: An icon with the JNV crest will appear on your phone home screen" -ForegroundColor Gray
Write-Host "    and open in 100% full-screen native mobile mode without any browser URL bar!" -ForegroundColor Gray
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  [Server Log] Ready! Press [ENTER] or Ctrl+C to stop the server." -ForegroundColor DarkGray
Write-Host ""

if ([System.IO.File]::Exists($qrFile)) {
    Start-Process -FilePath $qrFile
}

Read-Host "Press [ENTER] to stop server"
$server.Stop()
Write-Host "Server stopped."
