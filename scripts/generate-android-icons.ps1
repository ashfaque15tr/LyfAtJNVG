$csharp = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class AndroidIconGenerator {
    public static void GenerateIcons(string sourceIconPath, string resDirPath) {
        if (!File.Exists(sourceIconPath)) {
            throw new FileNotFoundException("Source icon not found at: " + sourceIconPath);
        }

        using (Bitmap src = new Bitmap(sourceIconPath)) {
            var densities = new[] {
                new { Dir = "mipmap-mdpi", LauncherSize = 48, FgSize = 108, FgLogoSize = 72 },
                new { Dir = "mipmap-hdpi", LauncherSize = 72, FgSize = 162, FgLogoSize = 108 },
                new { Dir = "mipmap-xhdpi", LauncherSize = 96, FgSize = 216, FgLogoSize = 144 },
                new { Dir = "mipmap-xxhdpi", LauncherSize = 144, FgSize = 324, FgLogoSize = 216 },
                new { Dir = "mipmap-xxxhdpi", LauncherSize = 192, FgSize = 432, FgLogoSize = 288 }
            };

            foreach (var d in densities) {
                string targetDir = Path.Combine(resDirPath, d.Dir);
                Directory.CreateDirectory(targetDir);

                // 1. Standard ic_launcher.png
                using (Bitmap bmp = new Bitmap(d.LauncherSize, d.LauncherSize, PixelFormat.Format32bppArgb))
                using (Graphics g = Graphics.FromImage(bmp)) {
                    ConfigureGraphics(g);
                    g.DrawImage(src, 0, 0, d.LauncherSize, d.LauncherSize);
                    bmp.Save(Path.Combine(targetDir, "ic_launcher.png"), ImageFormat.Png);
                }

                // 2. Circular ic_launcher_round.png
                using (Bitmap roundBmp = new Bitmap(d.LauncherSize, d.LauncherSize, PixelFormat.Format32bppArgb))
                using (Graphics g = Graphics.FromImage(roundBmp)) {
                    ConfigureGraphics(g);
                    using (GraphicsPath path = new GraphicsPath()) {
                        path.AddEllipse(0, 0, d.LauncherSize, d.LauncherSize);
                        g.SetClip(path);
                        g.DrawImage(src, 0, 0, d.LauncherSize, d.LauncherSize);
                    }
                    roundBmp.Save(Path.Combine(targetDir, "ic_launcher_round.png"), ImageFormat.Png);
                }

                // 3. Adaptive ic_launcher_foreground.png (Safe zone centered)
                using (Bitmap fgBmp = new Bitmap(d.FgSize, d.FgSize, PixelFormat.Format32bppArgb))
                using (Graphics g = Graphics.FromImage(fgBmp)) {
                    ConfigureGraphics(g);
                    int offset = (d.FgSize - d.FgLogoSize) / 2;
                    g.DrawImage(src, offset, offset, d.FgLogoSize, d.FgLogoSize);
                    fgBmp.Save(Path.Combine(targetDir, "ic_launcher_foreground.png"), ImageFormat.Png);
                }
            }
        }
    }

    private static void ConfigureGraphics(Graphics g) {
        g.SmoothingMode = SmoothingMode.HighQuality;
        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
        g.PixelOffsetMode = PixelOffsetMode.HighQuality;
        g.CompositingQuality = CompositingQuality.HighQuality;
    }
}
"@

Add-Type -TypeDefinition $csharp -ReferencedAssemblies System.Drawing

$rootDir = Split-Path -Parent $PSScriptRoot
$sourceIcon = Join-Path $rootDir "play_store_assets/icon-512x512.png"

$resDirs = @(
    (Join-Path $rootDir "android/app/src/main/res"),
    (Join-Path $rootDir "mobile_app/android/app/src/main/res")
)

foreach ($res in $resDirs) {
    if (Test-Path $res) {
        Write-Host "Generating Android icons in $res..."
        [AndroidIconGenerator]::GenerateIcons($sourceIcon, $res)

        # Update values/ic_launcher_background.xml
        $valFile = Join-Path $res "values/ic_launcher_background.xml"
        if (Test-Path $valFile) {
            $xmlContent = "<?xml version=""1.0"" encoding=""utf-8""?>`n<resources>`n    <color name=""ic_launcher_background"">#050b18</color>`n</resources>"
            Set-Content -Path $valFile -Value $xmlContent -Encoding UTF8
        }

        # Update drawable/ic_launcher_background.xml
        $drawFile = Join-Path $res "drawable/ic_launcher_background.xml"
        if (Test-Path $drawFile) {
            $drawContent = "<?xml version=""1.0"" encoding=""utf-8""?>`n<resources>`n    <color name=""ic_launcher_background"">#050b18</color>`n</resources>"
            Set-Content -Path $drawFile -Value $drawContent -Encoding UTF8
        }

        # Remove drawable-v24/ic_launcher_foreground.xml so Android loads our custom PNGs
        $v24Fg = Join-Path $res "drawable-v24/ic_launcher_foreground.xml"
        if (Test-Path $v24Fg) {
            Remove-Item $v24Fg -Force
            Write-Host "Removed legacy vector $v24Fg"
        }
    }
}

Write-Host "SUCCESS: All Android launcher icons generated and adaptive configurations updated!"
