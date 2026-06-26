import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, 'src', 'assets', 'images');

const imagesToOptimize = [
  'yeru-testimonio.jpg',
  'jazmin-testimonio.jpg',
  'fabian-luna-testimonio.jpg',
  'pdc_hero_pricipal.jpg', // let's also optimize the original hero JPG if needed, but wait, the hero is already .webp in public/dist?
  // Let's optimize the testimonios first!
];

async function optimizeImages() {
  console.log('Iniciando optimización de imágenes...');

  for (const imageName of imagesToOptimize) {
    const inputPath = path.join(IMAGES_DIR, imageName);
    const outputName = imageName.replace(/\.jpg$/, '.webp');
    const outputPath = path.join(IMAGES_DIR, outputName);

    try {
      console.log(`Procesando ${imageName}...`);

      // Para testimonios, redimensionamos a un máximo de 400px de ancho/alto.
      // Si es el hero original, lo redimensionamos a 1600px de ancho para web.
      const isHero = imageName.includes('hero');
      const resizeOptions = isHero
        ? { width: 1600, withoutEnlargement: true }
        : { width: 400, height: 400, fit: 'cover' }; // Recortar centrado a 400x400 para avatares

      const info = await sharp(inputPath)
        .resize(resizeOptions)
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`¡Éxito! ${outputName} creado.`);
      console.log(`  - Tamaño original aproximado: (revisa el archivo original)`);
      console.log(`  - Tamaño optimizado WebP: ${(info.size / 1024).toFixed(2)} KB`);
    } catch (error) {
      console.error(`Error procesando ${imageName}:`, error.message);
    }
  }

  console.log('Optimización finalizada.');
}

optimizeImages();
