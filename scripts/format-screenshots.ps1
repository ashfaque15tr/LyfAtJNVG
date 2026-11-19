$csharp = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class ScreenshotProcessor {
    public static void Process(string srcDir, string destDir) {
        Directory.CreateDirectory(destDir);

        string[] files = new string[] {
            "step_79_shot_1_final_1080x1920_home.png",
            "step_79_shot_2_final_1080x1920_meet.png",
            "step_79_shot_3_final_1080x1920_feed.png",
            "step_79_shot_4_final_1080x1920_directory.png"
        };

        string[] targets = new string[] {
            "screenshot-1-home.png",
            "screenshot-2-annual-meet.png",
            "screenshot-3-memory-wall.png",
            "screenshot-4-alumni-directory.png"
        };

        for (int i = 0; i < files.Length; i++) {
            string srcFile = Path.Combine(srcDir, files[i]);
            if (!File.Exists(srcFile)) continue;

            using (Image srcImg = Image.FromFile(srcFile)) {
                // Upscale to exact 1080x1920 with HighQualityBicubic interpolation
                using (Bitmap destBmp = new Bitmap(1080, 1920))
                using (Graphics g = Graphics.FromImage(destBmp)) {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.DrawImage(srcImg, new Rectangle(0, 0, 1080, 1920));

                    string outFile = Path.Combine(destDir, targets[i]);
                    destBmp.Save(outFile, ImageFormat.Png);
                    Console.WriteLine("Saved: " + targets[i] + " (1080x1920, 9:16)");
                }
            }
        }
    }
}
"@

Add-Type -TypeDefinition $csharp -ReferencedAssemblies System.Drawing
$srcDir = "C:\Users\ASHFAQ\.gemini\antigravity\brain\b424dfd1-ea3b-40bd-8840-61d5ba439824\browser_sandbox\screenshots"
$destDir = "C:\Users\ASHFAQ\Downloads\JNVAlumini\play_store_assets\screenshots"
[ScreenshotProcessor]::Process($srcDir, $destDir)
