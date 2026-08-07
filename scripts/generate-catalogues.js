import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createCatalog(filename, brandName, tagline, pagesCount) {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Cover Page
  const cover = pdfDoc.addPage([800, 600]);
  cover.drawRectangle({ x: 0, y: 0, width: 800, height: 600, color: rgb(0.02, 0.05, 0.13) });
  cover.drawRectangle({ x: 380, y: 0, width: 40, height: 600, color: rgb(0.95, 0.72, 0.0) });

  cover.drawText(brandName.toUpperCase(), { x: 60, y: 380, size: 36, font: fontBold, color: rgb(1, 1, 1) });
  cover.drawText(tagline, { x: 60, y: 340, size: 16, font: fontRegular, color: rgb(0.95, 0.72, 0.0) });
  cover.drawText('100% PURE PHENOLIC HIGH PRESSURE LAMINATES', { x: 60, y: 300, size: 12, font: fontRegular, color: rgb(0.8, 0.8, 0.8) });
  cover.drawText('BESPOKE DECOR SURFACES - NEXT GENERATION CATALOGUE', { x: 60, y: 100, size: 12, font: fontBold, color: rgb(1, 1, 1) });

  // Inner Pages
  const finishes = ['HIGH GLOSS', 'MUSTANG STONE', 'SILKY MATT', 'CLASSIC ASH', 'LEATHER', 'WRITE ON', 'SCRATCH TOUGH', 'SF SOLIDS', 'NATURAL OAK', 'ABSTRACT ART', 'SUEDE FINISH'];
  const colorsList = [
    [rgb(0.2, 0.15, 0.1), rgb(0.8, 0.6, 0.4)],
    [rgb(0.9, 0.9, 0.85), rgb(0.3, 0.3, 0.35)],
    [rgb(0.4, 0.25, 0.15), rgb(0.7, 0.5, 0.3)],
    [rgb(0.15, 0.15, 0.15), rgb(0.8, 0.2, 0.2)],
    [rgb(0.95, 0.92, 0.85), rgb(0.2, 0.4, 0.3)]
  ];

  for (let i = 2; i <= pagesCount; i++) {
    const page = pdfDoc.addPage([800, 600]);
    const bgCol = (i % 2 === 0) ? rgb(0.96, 0.95, 0.94) : rgb(0.08, 0.08, 0.1);
    const textCol = (i % 2 === 0) ? rgb(0.1, 0.1, 0.1) : rgb(0.95, 0.95, 0.95);
    const accentCol = rgb(0.8, 0.6, 0.1);

    page.drawRectangle({ x: 0, y: 0, width: 800, height: 600, color: bgCol });

    // Header
    page.drawText(brandName + ' | COLLECTION 2026', { x: 40, y: 560, size: 10, font: fontBold, color: accentCol });
    page.drawText('Page ' + i, { x: 720, y: 560, size: 10, font: fontRegular, color: textCol });

    const finishName = finishes[(i - 2) % finishes.length];
    page.drawText(finishName, { x: 40, y: 510, size: 24, font: fontBold, color: textCol });

    // Draw Swatch Boxes
    const colorPair = colorsList[(i - 2) % colorsList.length];
    page.drawRectangle({ x: 40, y: 120, width: 330, height: 350, color: colorPair[0] });
    page.drawRectangle({ x: 410, y: 120, width: 330, height: 350, color: colorPair[1] });

    page.drawText('CODE: ' + (8000 + i) + '-01 HG', { x: 50, y: 140, size: 12, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText('CODE: ' + (8000 + i) + '-02 SF', { x: 420, y: 140, size: 12, font: fontBold, color: rgb(1, 1, 1) });

    page.drawText('MAHADEV PLY CENTER - SATDOBATO LALITPUR', { x: 40, y: 30, size: 9, font: fontRegular, color: rgb(0.5, 0.5, 0.5) });
  }

  const cataloguesDir = path.join(process.cwd(), 'public', 'catalogues');
  if (!fs.existsSync(cataloguesDir)) {
    fs.mkdirSync(cataloguesDir, { recursive: true });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(cataloguesDir, filename), pdfBytes);
  console.log('Created ' + filename + ' successfully');
}

async function run() {
  await createCatalog('futurelam.pdf', 'FutureLam', 'Bespoke Decor Surfaces', 16);
  await createCatalog('greenlam.pdf', 'Greenlam Laminates', 'Safeguard Anti-Bacterial Collection', 12);
  await createCatalog('centurylaminates.pdf', 'CenturyLaminates', 'ViroKill Protected Surfaces', 10);
  await createCatalog('merino.pdf', 'Merino Laminates', 'Luvih & Gloss Meister Collection', 10);
}

run().catch(console.error);
