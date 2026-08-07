// Utility to procedurally generate high-definition interactive catalogue pages (canvas images)
// for laminate brands if PDF worker fails or PDF file is unavailable.

export async function generateInteractiveCataloguePages(
  brandName: string,
  title: string
): Promise<string[]> {
  const pagesCount = 10;
  const canvasWidth = 800;
  const canvasHeight = 1120;
  const pages: string[] = [];

  const brandUpper = brandName.toUpperCase();

  for (let pageNum = 1; pageNum <= pagesCount; pageNum++) {
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) continue;

    // Draw background
    if (pageNum === 1) {
      // PAGE 1: LUXURY COVER
      const bgGrad = ctx.createRadialGradient(
        canvasWidth / 2,
        canvasHeight / 2,
        50,
        canvasWidth / 2,
        canvasHeight / 2,
        600
      );
      bgGrad.addColorStop(0, '#0a1a33');
      bgGrad.addColorStop(1, '#000612');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Gold Outer Frame
      ctx.strokeStyle = '#f2b800';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, canvasWidth - 60, canvasHeight - 60);

      ctx.strokeStyle = '#775a19';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, canvasWidth - 80, canvasHeight - 80);

      // Top Crest Badge
      ctx.fillStyle = '#f2b800';
      ctx.beginPath();
      ctx.arc(canvasWidth / 2, 130, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000d22';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MP', canvasWidth / 2, 139);

      // Category Subtitle
      ctx.fillStyle = '#f2b800';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('OFFICIAL 2026 ARCHITECTURAL COLLECTION', canvasWidth / 2, 220);

      // Main Brand Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'extrabold 48px serif';
      ctx.fillText(brandUpper, canvasWidth / 2, 290);

      // Secondary Title
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 20px sans-serif';
      const subTitleText = title ? title.toUpperCase() : 'OFFICIAL ARCHITECTURAL CATALOGUE';
      ctx.fillText(subTitleText, canvasWidth / 2, 335);

      // Decorative Swatch Visual Preview Block
      ctx.fillStyle = '#102445';
      ctx.fillRect(100, 390, canvasWidth - 200, 400);
      ctx.strokeStyle = '#f2b800';
      ctx.lineWidth = 2;
      ctx.strokeRect(100, 390, canvasWidth - 200, 400);

      // Render 4 Swatch Stripes inside Cover Block
      const stripeWidth = (canvasWidth - 200) / 4;
      // 1: Wood Grain
      const grad1 = ctx.createLinearGradient(100, 390, 100 + stripeWidth, 790);
      grad1.addColorStop(0, '#8B5A2B');
      grad1.addColorStop(1, '#4A2E12');
      ctx.fillStyle = grad1;
      ctx.fillRect(100, 390, stripeWidth, 400);

      // 2: Marble
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(100 + stripeWidth, 390, stripeWidth, 400);
      ctx.strokeStyle = '#9ca3af';
      ctx.beginPath();
      ctx.moveTo(100 + stripeWidth + 10, 420);
      ctx.lineTo(100 + stripeWidth + 80, 580);
      ctx.stroke();

      // 3: Metallic Gold
      const grad3 = ctx.createLinearGradient(
        100 + stripeWidth * 2,
        390,
        100 + stripeWidth * 3,
        790
      );
      grad3.addColorStop(0, '#f2b800');
      grad3.addColorStop(1, '#9a7000');
      ctx.fillStyle = grad3;
      ctx.fillRect(100 + stripeWidth * 2, 390, stripeWidth, 400);

      // 4: Solid Royal Blue
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(100 + stripeWidth * 3, 390, stripeWidth, 400);

      // Center Overlay Badge
      ctx.fillStyle = '#000d22';
      ctx.fillRect(canvasWidth / 2 - 160, 560, 320, 60);
      ctx.strokeStyle = '#f2b800';
      ctx.strokeRect(canvasWidth / 2 - 160, 560, 320, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('SWATCH & CATALOGUE BOOK', canvasWidth / 2, 597);

      // Bottom Dealer Info
      ctx.fillStyle = '#f2b800';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('MAHADEV PLY CENTER', canvasWidth / 2, 880);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px sans-serif';
      ctx.fillText('Authorized Premium Distributor • Lalitpur, Nepal', canvasWidth / 2, 910);
      ctx.fillText('Phone: +977 01-5400921 / +977 9766383188', canvasWidth / 2, 935);

      // Features Pill
      ctx.fillStyle = '#102445';
      ctx.fillRect(120, 970, canvasWidth - 240, 45);
      ctx.fillStyle = '#f2b800';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('100% PHENOLIC CORE  •  ANTI-BACTERIAL  •  SCRATCH RESISTANT', canvasWidth / 2, 998);

    } else if (pageNum === 10) {
      // PAGE 10: BACK COVER & DIRECTORY
      const bgGrad = ctx.createRadialGradient(
        canvasWidth / 2,
        canvasHeight / 2,
        50,
        canvasWidth / 2,
        canvasHeight / 2,
        600
      );
      bgGrad.addColorStop(0, '#0a1a33');
      bgGrad.addColorStop(1, '#000612');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Gold Frame
      ctx.strokeStyle = '#f2b800';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, canvasWidth - 60, canvasHeight - 60);

      ctx.fillStyle = '#f2b800';
      ctx.font = 'bold 28px serif';
      ctx.textAlign = 'center';
      ctx.fillText(brandUpper, canvasWidth / 2, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('MAHADEV PLY CENTER SHOWROOM', canvasWidth / 2, 220);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px sans-serif';
      ctx.fillText('Lagankhel - Patan Hospital Road, Lalitpur, Nepal', canvasWidth / 2, 260);

      // Contact Cards
      const cardY = 340;
      ctx.fillStyle = '#102445';
      ctx.fillRect(100, cardY, canvasWidth - 200, 220);
      ctx.strokeStyle = '#f2b800';
      ctx.lineWidth = 1;
      ctx.strokeRect(100, cardY, canvasWidth - 200, 220);

      ctx.fillStyle = '#f2b800';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('EXECUTIVE INQUIRIES & ORDERS', canvasWidth / 2, cardY + 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('☎ Hotline: +977 01-5400921', canvasWidth / 2, cardY + 95);
      ctx.fillText('📱 Mobile / WhatsApp: +977 9766383188', canvasWidth / 2, cardY + 130);
      ctx.fillText('✉ Email: mahadevplycenter@gmail.com', canvasWidth / 2, cardY + 165);

      // Guarantee Stamp
      ctx.fillStyle = '#f2b800';
      ctx.beginPath();
      ctx.arc(canvasWidth / 2, 680, 55, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000d22';
      ctx.font = 'extrabold 14px sans-serif';
      ctx.fillText('10 YEAR', canvasWidth / 2, 672);
      ctx.fillText('LIMITED', canvasWidth / 2, 688);
      ctx.fillText('WARRANTY', canvasWidth / 2, 704);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('100% Genuine Certified Laminate Products', canvasWidth / 2, 780);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '13px sans-serif';
      ctx.fillText('Thank you for choosing Mahadev Ply Center', canvasWidth / 2, 820);

    } else {
      // PAGES 2 - 9: INTERACTIVE INSIDE PAGES
      ctx.fillStyle = '#fcfbf9';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Header Bar
      ctx.fillStyle = '#000d22';
      ctx.fillRect(0, 0, canvasWidth, 80);

      ctx.fillStyle = '#f2b800';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${brandUpper} CATALOGUE`, 40, 48);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'right';
      let pageCategory = 'WOODGRAIN COLLECTION';
      if (pageNum === 2) pageCategory = 'TABLE OF CONTENTS & TECH SPECS';
      if (pageNum === 4) pageCategory = 'EXOTIC TIMBER & VENEER TOUCH';
      if (pageNum === 5) pageCategory = 'MARBLE & INDUSTRIAL STONE';
      if (pageNum === 6) pageCategory = 'METALLIC & HIGH GLOSS LUXURY';
      if (pageNum === 7) pageCategory = 'SOLID PASTELS & SUPER MATT';
      if (pageNum === 8) pageCategory = 'INTERIOR APPLICATION GALLERY';
      if (pageNum === 9) pageCategory = 'CARE & TECHNICAL DATA';

      ctx.fillText(pageCategory, canvasWidth - 40, 48);

      // Content Header Line
      ctx.fillStyle = '#f2b800';
      ctx.fillRect(0, 80, canvasWidth, 4);

      if (pageNum === 2) {
        // Page 2: Table of contents
        ctx.fillStyle = '#000d22';
        ctx.font = 'extrabold 28px serif';
        ctx.textAlign = 'left';
        ctx.fillText('CATALOGUE DIRECTORY', 50, 140);

        const tocItems = [
          { p: '01', title: 'Executive Brand Cover' },
          { p: '02', title: 'Overview & Certifications' },
          { p: '03', title: 'Royal Teak & Natural Oak Woodgrain' },
          { p: '04', title: 'Exotic Timber & Veneer Touch Finish' },
          { p: '05', title: 'Calacatta Marble & Industrial Stone' },
          { p: '06', title: 'Brushed Metallic & Mirror High Gloss' },
          { p: '07', title: 'Solid Pastels & Super Matt Sheens' },
          { p: '08', title: 'Interior Furniture Application Ideas' },
          { p: '09', title: 'Care, Maintenance & Warranty Specs' },
          { p: '10', title: 'Showroom Contacts & Ordering Guide' },
        ];

        tocItems.forEach((item, idx) => {
          const y = 190 + idx * 45;
          ctx.fillStyle = '#102445';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(`PAGE ${item.p}`, 50, y);

          ctx.fillStyle = '#374151';
          ctx.font = '15px sans-serif';
          ctx.fillText(item.title, 160, y);

          // Dot leader line
          ctx.strokeStyle = '#d1d5db';
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.moveTo(500, y - 5);
          ctx.lineTo(720, y - 5);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Certification Badges Block at Bottom
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(50, 680, canvasWidth - 100, 340);
        ctx.strokeStyle = '#e5e7eb';
        ctx.strokeRect(50, 680, canvasWidth - 100, 340);

        ctx.fillStyle = '#000d22';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('QUALITY & ENVIRONMENTAL STANDARDS', 80, 720);

        const badges = [
          '✔ ISO 9001:2015 Certified Manufacturing',
          '✔ Anti-Bacterial Surface Coating (99.9% Microbial Reduction)',
          '✔ Scratch & Abrasion Resistant High-Density Melamine Overlay',
          '✔ Boiling Water Resistant (BWR) Grade Phenolic Resin Core',
          '✔ FSC Certified Sustainable Wood Sourced Base Paper',
        ];

        badges.forEach((b, i) => {
          ctx.fillStyle = '#1f2937';
          ctx.font = '14px sans-serif';
          ctx.fillText(b, 80, 765 + i * 40);
        });

      } else if (pageNum >= 3 && pageNum <= 7) {
        // SWATCH PAGES (4 Swatch Boxes Per Page)
        const swatchConfigs: Record<number, any[]> = {
          3: [
            { code: `${brandUpper}-101`, name: 'Royal Teak', finish: 'Woodgrain', color1: '#8B5A2B', color2: '#4A2E12', grain: true },
            { code: `${brandUpper}-102`, name: 'European Blonde Oak', finish: 'Suede Finish', color1: '#D2B48C', color2: '#8B7355', grain: true },
            { code: `${brandUpper}-103`, name: 'Smoked Walnut', finish: 'High Gloss', color1: '#3D2314', color2: '#1C0D02', grain: true },
            { code: `${brandUpper}-104`, name: 'American Cherry', finish: 'Textured', color1: '#800000', color2: '#4A0000', grain: true },
          ],
          4: [
            { code: `${brandUpper}-105`, name: 'Ebony Midnight', finish: 'Veneer Touch', color1: '#1C1917', color2: '#0A0A0A', grain: true },
            { code: `${brandUpper}-106`, name: 'Rosewood Crown', finish: 'High Gloss', color1: '#581C87', color2: '#3B0764', grain: true },
            { code: `${brandUpper}-107`, name: 'Natural Ash Touch', finish: 'Matt Texture', color1: '#E5E7EB', color2: '#9CA3AF', grain: true },
            { code: `${brandUpper}-108`, name: 'Wenge Deep Grain', finish: 'Suede Finish', color1: '#26160C', color2: '#120A05', grain: true },
          ],
          5: [
            { code: `${brandUpper}-201`, name: 'Calacatta Gold Marble', finish: 'High Gloss', color1: '#F9FAFB', color2: '#E5E7EB', marble: true },
            { code: `${brandUpper}-202`, name: 'Nero Marquina Black', finish: 'Mirror Gloss', color1: '#111827', color2: '#1F2937', marble: true },
            { code: `${brandUpper}-203`, name: 'Industrial Concrete', finish: 'Matt Texture', color1: '#6B7280', color2: '#4B5563', concrete: true },
            { code: `${brandUpper}-204`, name: 'Terrazzo White', finish: 'Suede Touch', color1: '#F3F4F6', color2: '#D1D5DB', terrazzo: true },
          ],
          6: [
            { code: `${brandUpper}-301`, name: 'Brushed Champagne Gold', finish: 'Metallic Sheen', color1: '#F2B800', color2: '#9A7000', metallic: true },
            { code: `${brandUpper}-302`, name: 'Titanium Copper Rust', finish: 'Metallic Touch', color1: '#B45309', color2: '#78350F', metallic: true },
            { code: `${brandUpper}-303`, name: 'Mirror Gloss Black', finish: 'High Gloss', color1: '#000000', color2: '#18181B', gloss: true },
            { code: `${brandUpper}-304`, name: 'Pearl White High Gloss', finish: 'High Gloss', color1: '#FFFFFF', color2: '#F4F4F5', gloss: true },
          ],
          7: [
            { code: `${brandUpper}-401`, name: 'Royal Navy Blue', finish: 'Super Matt', color1: '#1E3A8A', color2: '#172554', solid: true },
            { code: `${brandUpper}-402`, name: 'Forest Sage Green', finish: 'Super Matt', color1: '#14532D', color2: '#052E16', solid: true },
            { code: `${brandUpper}-403`, name: 'Warm Desert Cream', finish: 'Suede Finish', color1: '#FEF3C7', color2: '#FDE68A', solid: true },
            { code: `${brandUpper}-404`, name: 'Velvet Graphite Grey', finish: 'Anti-Fingerprint', color1: '#374151', color2: '#1F2937', solid: true },
          ],
        };

        const swatches = swatchConfigs[pageNum] || swatchConfigs[3];

        const gridPositions = [
          { x: 50, y: 120 },
          { x: 420, y: 120 },
          { x: 50, y: 580 },
          { x: 420, y: 580 },
        ];

        swatches.forEach((s, idx) => {
          const pos = gridPositions[idx];
          const w = 330;
          const h = 320;

          // Render Swatch Canvas Texture
          const sGrad = ctx.createLinearGradient(pos.x, pos.y, pos.x + w, pos.y + h);
          sGrad.addColorStop(0, s.color1);
          sGrad.addColorStop(1, s.color2);
          ctx.fillStyle = sGrad;
          ctx.fillRect(pos.x, pos.y, w, h);

          // Texture detail simulation
          if (s.grain) {
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 2;
            for (let line = 0; line < 12; line++) {
              ctx.beginPath();
              ctx.moveTo(pos.x, pos.y + line * 26);
              ctx.bezierCurveTo(
                pos.x + 100,
                pos.y + line * 26 + 15,
                pos.x + 200,
                pos.y + line * 26 - 10,
                pos.x + w,
                pos.y + line * 26 + 8
              );
              ctx.stroke();
            }
          }

          if (s.marble) {
            ctx.strokeStyle = s.color1 === '#111827' ? 'rgba(255,255,255,0.4)' : 'rgba(180,140,40,0.4)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(pos.x + 30, pos.y);
            ctx.lineTo(pos.x + 150, pos.y + 120);
            ctx.lineTo(pos.x + 220, pos.y + 320);
            ctx.stroke();
          }

          // Border
          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 2;
          ctx.strokeRect(pos.x, pos.y, w, h);

          // Label Box underneath swatch
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(pos.x, pos.y + h, w, 110);
          ctx.strokeStyle = '#d1d5db';
          ctx.strokeRect(pos.x, pos.y + h, w, 110);

          ctx.fillStyle = '#000d22';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(s.name, pos.x + 15, pos.y + h + 32);

          ctx.fillStyle = '#f2b800';
          ctx.font = 'bold 13px monospace';
          ctx.fillText(`CODE: ${s.code}`, pos.x + 15, pos.y + h + 58);

          ctx.fillStyle = '#4b5563';
          ctx.font = '13px sans-serif';
          ctx.fillText(`Finish: ${s.finish} | Size: 8' x 4'`, pos.x + 15, pos.y + h + 84);
        });

      } else if (pageNum === 8) {
        // Page 8: Application Showcase
        ctx.fillStyle = '#000d22';
        ctx.font = 'extrabold 24px serif';
        ctx.textAlign = 'left';
        ctx.fillText('INTERIOR APPLICATION GALLERY', 50, 130);

        // Box 1: Kitchen
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(50, 160, canvasWidth - 100, 380);
        ctx.strokeStyle = '#f2b800';
        ctx.strokeRect(50, 160, canvasWidth - 100, 380);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('Modular Kitchen Cabinets & Countertops', 80, 205);

        ctx.fillStyle = '#9ca3af';
        ctx.font = '14px sans-serif';
        ctx.fillText('Combines High-Gloss Marble Splashback with Natural Teak Base Units.', 80, 235);

        // Simple vector drawing of kitchen cabinets
        ctx.fillStyle = '#334155';
        ctx.fillRect(80, 270, 640, 220);
        ctx.fillStyle = '#f2b800';
        ctx.fillRect(80, 260, 640, 10); // countertop edge

        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.strokeRect(100, 290, 170, 180);
        ctx.strokeRect(290, 290, 220, 180);
        ctx.strokeRect(530, 290, 170, 180);

        // Box 2: Wardrobe
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(50, 580, canvasWidth - 100, 380);
        ctx.strokeStyle = '#f2b800';
        ctx.strokeRect(50, 580, canvasWidth - 100, 380);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('Full-Height Bedroom Wardrobe & Wall Paneling', 80, 625);

        ctx.fillStyle = '#9ca3af';
        ctx.font = '14px sans-serif';
        ctx.fillText('Super-Matt Solid Pastels featuring Anti-Fingerprint Technology.', 80, 655);

        ctx.fillStyle = '#334155';
        ctx.fillRect(80, 690, 640, 230);
        ctx.strokeStyle = '#f2b800';
        ctx.strokeRect(120, 710, 260, 190);
        ctx.strokeRect(420, 710, 260, 190);

      } else if (pageNum === 9) {
        // Page 9: Technical Data
        ctx.fillStyle = '#000d22';
        ctx.font = 'extrabold 24px serif';
        ctx.textAlign = 'left';
        ctx.fillText('TECHNICAL SPECIFICATIONS & TEST RESULTS', 50, 130);

        // Table
        const specs = [
          { test: 'Thickness Tolerance', standard: 'IS 2046 / EN 438', result: '± 0.05 mm (Grade A)' },
          { test: 'Resistance to Boiling Water', standard: 'EN 438-2:2016', result: 'Mass Increase < 5.0%' },
          { test: 'Resistance to Dry Heat (180°C)', standard: 'ISO 4586-2', result: 'No Gloss Loss / Cracking' },
          { test: 'Dimensional Stability (20°C)', standard: 'EN 438-2:17', result: 'Cumulative Change < 0.35%' },
          { test: 'Surface Abrasion Resistance', standard: 'Taber Abraser Test', result: 'Over 450 Revolutions' },
          { test: 'Resistance to Stains & Acid', standard: 'Class 1 Chemicals', result: '100% Unaffected' },
          { test: 'Microbial & Bacterial Reduction', standard: 'JIS Z 2801', result: '> 99.99% Antimicrobial' },
        ];

        // Table Header
        ctx.fillStyle = '#000d22';
        ctx.fillRect(50, 160, canvasWidth - 100, 45);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('PROPERTY TEST', 70, 188);
        ctx.fillText('STANDARD', 360, 188);
        ctx.fillText('SPECIFICATION RESULT', 540, 188);

        specs.forEach((item, idx) => {
          const y = 205 + (idx + 1) * 55;
          ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
          ctx.fillRect(50, y - 40, canvasWidth - 100, 50);
          ctx.strokeStyle = '#e2e8f0';
          ctx.strokeRect(50, y - 40, canvasWidth - 100, 50);

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(item.test, 70, y - 10);

          ctx.fillStyle = '#475569';
          ctx.font = '13px sans-serif';
          ctx.fillText(item.standard, 360, y - 10);

          ctx.fillStyle = '#15803d';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(`✓ ${item.result}`, 540, y - 10);
        });

        // Maintenance Tips
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(50, 680, canvasWidth - 100, 280);
        ctx.strokeStyle = '#f59e0b';
        ctx.strokeRect(50, 680, canvasWidth - 100, 280);

        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('CARE & MAINTENANCE RECOMMENDATIONS', 80, 720);

        const tips = [
          '• Clean surface using a soft microfiber cloth with mild liquid dish soap.',
          '• Avoid using harsh steel wool, abrasive scouring pads, or concentrated bleach.',
          '• Wipe up accidental liquid spills or moisture pooling promptly.',
          '• Store sheets horizontally in a flat, dry, well-ventilated indoor space.',
        ];

        tips.forEach((tip, idx) => {
          ctx.fillStyle = '#78350f';
          ctx.font = '14px sans-serif';
          ctx.fillText(tip, 80, 765 + idx * 40);
        });
      }

      // Page Number Footer
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`- Page ${pageNum} -`, canvasWidth / 2, canvasHeight - 30);
    }

    pages.push(canvas.toDataURL('image/jpeg', 0.92));
  }

  return pages;
}
