$csharp = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.IO;

public class PlayStoreAssetGenerator {
    public static void Generate(string rootDir, string outDir) {
        Directory.CreateDirectory(outDir);

        // 1. App Icon 512x512
        using (Bitmap icon = new Bitmap(512, 512))
        using (Graphics g = Graphics.FromImage(icon)) {
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;

            // Gradient Background
            Rectangle rect = new Rectangle(0, 0, 512, 512);
            using (LinearGradientBrush bg = new LinearGradientBrush(rect, ColorTranslator.FromHtml("#0b1329"), ColorTranslator.FromHtml("#1e293b"), 45f)) {
                g.FillRectangle(bg, rect);
            }

            // Rings
            using (Pen goldPen = new Pen(ColorTranslator.FromHtml("#f59e0b"), 8f))
            using (Pen skyPen = new Pen(ColorTranslator.FromHtml("#38bdf8"), 3f)) {
                g.DrawEllipse(goldPen, 24, 24, 464, 464);
                g.DrawEllipse(skyPen, 36, 36, 440, 440);
            }

            // NVS Logo
            string logoPath = Path.Combine(rootDir, "assets", "images", "nvs-logo.png");
            if (File.Exists(logoPath)) {
                using (Image logo = Image.FromFile(logoPath)) {
                    g.DrawImage(logo, 136, 80, 240, 240);
                }
            }

            // Typography
            using (Font titleFont = new Font("Arial", 26f, FontStyle.Bold))
            using (Font subFont = new Font("Arial", 15f, FontStyle.Bold))
            using (SolidBrush whiteBrush = new SolidBrush(Color.White))
            using (SolidBrush goldBrush = new SolidBrush(ColorTranslator.FromHtml("#fbbf24")))
            using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center }) {
                g.DrawString("JNV ALUMNI", titleFont, whiteBrush, 256f, 345f, sf);
                g.DrawString("GAURIGANJ • AMETHI", subFont, goldBrush, 256f, 395f, sf);
            }

            icon.Save(Path.Combine(outDir, "icon-512x512.png"), ImageFormat.Png);
        }

        // 2. Feature Graphic 1024x500
        using (Bitmap feat = new Bitmap(1024, 500))
        using (Graphics g = Graphics.FromImage(feat)) {
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;

            Rectangle rect = new Rectangle(0, 0, 1024, 500);
            using (LinearGradientBrush bg = new LinearGradientBrush(rect, ColorTranslator.FromHtml("#050b18"), ColorTranslator.FromHtml("#111827"), 90f)) {
                g.FillRectangle(bg, rect);
            }

            // Office Gate Image
            string gatePath = Path.Combine(rootDir, "assets", "images", "office-gate.png");
            if (File.Exists(gatePath)) {
                using (Image gate = Image.FromFile(gatePath)) {
                    g.DrawImage(gate, 490, 40, 490, 275);
                }
                using (Pen goldPen = new Pen(ColorTranslator.FromHtml("#f59e0b"), 3f)) {
                    g.DrawRectangle(goldPen, 490, 40, 490, 275);
                }
            }

            // Text
            using (Font titleFont = new Font("Georgia", 30f, FontStyle.Bold))
            using (Font subFont = new Font("Arial", 15f, FontStyle.Regular))
            using (Font badgeFont = new Font("Arial", 13f, FontStyle.Bold))
            using (Font mottoFont = new Font("Georgia", 16f, FontStyle.Italic))
            using (Font domainFont = new Font("Arial", 14f, FontStyle.Bold))
            using (SolidBrush amberBrush = new SolidBrush(ColorTranslator.FromHtml("#f59e0b")))
            using (SolidBrush skyBrush = new SolidBrush(ColorTranslator.FromHtml("#38bdf8")))
            using (SolidBrush mutedBrush = new SolidBrush(ColorTranslator.FromHtml("#cbd5e1")))
            using (SolidBrush whiteBrush = new SolidBrush(Color.White))
            using (SolidBrush goldBrush = new SolidBrush(ColorTranslator.FromHtml("#fbbf24")))
            using (SolidBrush darkBrush = new SolidBrush(ColorTranslator.FromHtml("#0b1329"))) {
                g.DrawString("JNV ALUMNI NETWORK", titleFont, amberBrush, 50f, 50f);
                g.DrawString("JAWAHAR NAVODAYA VIDYALAYA, GAURIGANJ", subFont, whiteBrush, 54f, 105f);
                g.DrawString("Amethi / Sultanpur (U.P.) • Official Fraternity App", subFont, mutedBrush, 54f, 130f);
                g.DrawString("\"Never Ending Relations • हमी नवोदय हो\"", mottoFont, skyBrush, 54f, 175f);

                g.DrawString("✓ Live Alumni Directory (1993 - 2026 Batches)", badgeFont, whiteBrush, 54f, 225f);
                g.DrawString("✓ Memory Wall & Community Social Broadcast", badgeFont, whiteBrush, 54f, 258f);
                g.DrawString("✓ 4th Annual Mega Meet RSVP & Cultural Acts", badgeFont, whiteBrush, 54f, 291f);
                g.DrawString("✓ 4 Houses: Arawali • Nilgiri • Shivalik • Udaigiri", badgeFont, goldBrush, 54f, 324f);

                // Bottom bar
                g.FillRectangle(darkBrush, 0, 430, 1024, 70);
                g.DrawString("Official Website: jnvgfamily.in", domainFont, amberBrush, 54f, 455f);
                g.DrawString("Version 0.0.1 • Non-Profit Voluntary Educational Alumni Platform", subFont, mutedBrush, 470f, 455f);
            }

            feat.Save(Path.Combine(outDir, "feature-graphic-1024x500.png"), ImageFormat.Png);
        }
    }
}
"@

Add-Type -TypeDefinition $csharp -ReferencedAssemblies System.Drawing
$rootDir = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $rootDir "play_store_assets"
[PlayStoreAssetGenerator]::Generate($rootDir, $outDir)
Write-Host "SUCCESS: Generated Play Store assets in $outDir"
