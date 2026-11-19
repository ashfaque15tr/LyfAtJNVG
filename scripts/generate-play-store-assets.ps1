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

        // Feature Graphic 1024x500
        using (Bitmap feat = new Bitmap(1024, 500))
        using (Graphics g = Graphics.FromImage(feat)) {
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;

            // Deep Navy Gradient Background
            Rectangle rect = new Rectangle(0, 0, 1024, 500);
            using (LinearGradientBrush bg = new LinearGradientBrush(rect, ColorTranslator.FromHtml("#050b18"), ColorTranslator.FromHtml("#0d1b38"), 90f)) {
                g.FillRectangle(bg, rect);
            }

            // Subtle decorative top accent line
            using (Pen topGoldPen = new Pen(ColorTranslator.FromHtml("#f59e0b"), 2f)) {
                g.DrawLine(topGoldPen, 0, 0, 1024, 0);
            }

            // Campus Gate Photo on Right Side (X: 520, Y: 45, W: 455, H: 275)
            string gatePath = Path.Combine(rootDir, "assets", "images", "office-gate.png");
            if (File.Exists(gatePath)) {
                using (Image gate = Image.FromFile(gatePath)) {
                    g.DrawImage(gate, 520, 45, 455, 275);
                }
                using (Pen goldPen = new Pen(ColorTranslator.FromHtml("#f59e0b"), 3f)) {
                    g.DrawRectangle(goldPen, 520, 45, 455, 275);
                }

                // Subtitle under the photo
                using (Font capFont = new Font("Arial", 11f, FontStyle.Italic))
                using (SolidBrush capBrush = new SolidBrush(ColorTranslator.FromHtml("#94a3b8")))
                using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center }) {
                    g.DrawString("Campus Main Gate & Vidyalaya Donors Memorial • Est. 1986", capFont, capBrush, 520f + (455f / 2f), 332f, sf);
                }
            }

            // Left Side Typography (X: 45 to ~500) - Guaranteed ZERO OVERLAP
            using (Font brandFont = new Font("Georgia", 24f, FontStyle.Bold))
            using (Font titleFont = new Font("Arial", 13.5f, FontStyle.Bold))
            using (Font subFont = new Font("Arial", 12f, FontStyle.Regular))
            using (Font mottoFont = new Font("Georgia", 13.5f, FontStyle.Italic))
            using (Font badgeFont = new Font("Arial", 12f, FontStyle.Bold))
            using (Font domainFont = new Font("Arial", 13f, FontStyle.Bold))
            using (Font footerFont = new Font("Arial", 11.5f, FontStyle.Regular))
            using (SolidBrush amberBrush = new SolidBrush(ColorTranslator.FromHtml("#f59e0b")))
            using (SolidBrush skyBrush = new SolidBrush(ColorTranslator.FromHtml("#38bdf8")))
            using (SolidBrush mutedBrush = new SolidBrush(ColorTranslator.FromHtml("#94a3b8")))
            using (SolidBrush whiteBrush = new SolidBrush(Color.White))
            using (SolidBrush goldBrush = new SolidBrush(ColorTranslator.FromHtml("#fbbf24")))
            using (SolidBrush darkBarBrush = new SolidBrush(ColorTranslator.FromHtml("#050c1e"))) {
                
                // Brand Header
                g.DrawString("JNV ALUMNI NETWORK", brandFont, amberBrush, 45f, 42f);
                g.DrawString("JAWAHAR NAVODAYA VIDYALAYA", titleFont, whiteBrush, 47f, 90f);
                g.DrawString("Gauriganj, Amethi / Sultanpur (U.P.) • Official App", subFont, mutedBrush, 47f, 116f);
                g.DrawString("\"Never Ending Relations • हमी नवोदय हो\"", mottoFont, skyBrush, 47f, 150f);

                // Divider line
                using (Pen divPen = new Pen(ColorTranslator.FromHtml("#1e293b"), 1.5f)) {
                    g.DrawLine(divPen, 47, 182, 490, 182);
                }

                // Feature Bullet Points
                g.DrawString("✓  Verified Alumni Directory (1993 - 2026 Batches)", badgeFont, whiteBrush, 47f, 198f);
                g.DrawString("✓  Memory Wall & Community Social Broadcast", badgeFont, whiteBrush, 47f, 230f);
                g.DrawString("✓  4th Annual Mega Meet 2026 RSVP & Cultural Acts", badgeFont, whiteBrush, 47f, 262f);
                g.DrawString("✓  4 Houses: Arawali • Nilgiri • Shivalik • Udaigiri", badgeFont, goldBrush, 47f, 294f);
                g.DrawString("✓  Revered Gurujan & Faculty Tribute Register", badgeFont, skyBrush, 47f, 326f);

                // Bottom bar container (Y: 415 to 500)
                g.FillRectangle(darkBarBrush, 0, 420, 1024, 80);
                using (Pen barBorder = new Pen(ColorTranslator.FromHtml("#1e293b"), 1.5f)) {
                    g.DrawLine(barBorder, 0, 420, 1024, 420);
                }

                g.DrawString("Official Website: jnvgfamily.in", domainFont, amberBrush, 47f, 448f);
                
                using (StringFormat rightSf = new StringFormat { Alignment = StringAlignment.Far }) {
                    g.DrawString("Non-Profit Voluntary Educational Alumni Platform • v0.0.1", footerFont, mutedBrush, 975f, 450f, rightSf);
                }
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
Write-Host "SUCCESS: Generated cleanly formatted Feature Graphic in $outDir"
