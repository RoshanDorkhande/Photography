import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'src/Images');
const outputDir = path.join(__dirname, 'src/Images/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImage(inputPath, outputPath, quality = 80) {
    try {
        const inputSize = fs.statSync(inputPath).size;

        // Get original metadata
        const metadata = await sharp(inputPath).metadata();

        // Calculate target dimensions based on EXIF orientation
        // Orientation 5-8 means the image is rotated 90° or 270°
        const isRotated = metadata.orientation >= 5 && metadata.orientation <= 8;

        let resizeOptions;
        if (isRotated) {
            // For rotated images (will display as portrait), limit the effective height
            // Since the raw dimensions are swapped, we resize width (which becomes height after rotation)
            resizeOptions = { width: 1200, height: null, withoutEnlargement: true, fit: 'inside' };
        } else {
            // For normal orientation, limit width
            resizeOptions = { width: 1200, height: null, withoutEnlargement: true, fit: 'inside' };
        }

        await sharp(inputPath)
            .rotate() // Apply EXIF rotation properly (bakes it in)
            .resize(resizeOptions.width, resizeOptions.height, {
                withoutEnlargement: resizeOptions.withoutEnlargement,
                fit: resizeOptions.fit
            })
            .webp({ quality })
            .toFile(outputPath);

        const outputSize = fs.statSync(outputPath).size;
        const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

        const outputMeta = await sharp(outputPath).metadata();
        const orientation = isRotated ? 'portrait (rotated)' : 'landscape';

        console.log(`✓ ${path.basename(inputPath)} → ${outputMeta.width}x${outputMeta.height} (${orientation})`);
        console.log(`  ${(inputSize / 1024).toFixed(0)} KB → ${(outputSize / 1024).toFixed(0)} KB (${savings}% savings)`);

        return { inputSize, outputSize };
    } catch (err) {
        console.error(`✗ Error processing ${inputPath}:`, err.message);
        return null;
    }
}

async function main() {
    console.log('🖼️  Image Optimization Script (EXIF Rotation Applied)\n');
    console.log('Input:', inputDir);
    console.log('Output:', outputDir);
    console.log('');

    let totalInputSize = 0;
    let totalOutputSize = 0;

    // Process PhotoStack images
    console.log('--- PhotoStack Images ---');
    for (const file of ['11.jpg', '22.jpg', '33.jpg', '44.jpg']) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

        if (fs.existsSync(inputPath)) {
            const result = await optimizeImage(inputPath, outputPath, 85);
            if (result) {
                totalInputSize += result.inputSize;
                totalOutputSize += result.outputSize;
            }
        }
    }

    // Process Work images
    const workDir = path.join(inputDir, 'Work');
    if (fs.existsSync(workDir)) {
        console.log('\n--- Work Images ---');
        const workOutputDir = path.join(outputDir, 'Work');
        if (!fs.existsSync(workOutputDir)) {
            fs.mkdirSync(workOutputDir, { recursive: true });
        }

        const files = fs.readdirSync(workDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
        for (const file of files) {
            const inputPath = path.join(workDir, file);
            const outputPath = path.join(workOutputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

            const result = await optimizeImage(inputPath, outputPath, 80);
            if (result) {
                totalInputSize += result.inputSize;
                totalOutputSize += result.outputSize;
            }
        }
    }

    // Summary
    console.log('\n==========================================');
    console.log('TOTAL SAVINGS:');
    console.log(`  Before: ${(totalInputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  After:  ${(totalOutputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Saved:  ${((1 - totalOutputSize / totalInputSize) * 100).toFixed(1)}%`);
    console.log('==========================================');
}

main().catch(console.error);
