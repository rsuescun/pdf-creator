// https://pdf-lib.js.org
// https://github.com/Hopding/pdf-lib
import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb, RotationTypes, grayscale, degrees, radians } from 'pdf-lib';

import './style.css';

function PdfCreator() {
  const [objectURL, setObjectURL] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [title, setTitle] = useState('');
  const height = 500;
  const width = 500;
  const color1 = rgb(1, 0, 0);
  const color2 = rgb(0, 0, 1);
  const color3 = rgb(0, 1, 0);
  const color4 = rgb(0, 0, 0);
  const margin = 70;

  const createPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    return pdfDoc;
  }

  const loadPdf = async (url) => {
    const arrayBuffer = await fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return pdfDoc;
  }

  const createObjectURL = async (pdfDoc) => {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const objectURL = URL.createObjectURL(blob);
    setObjectURL(objectURL);
  }

  const createDataUri = async (pdfDoc) => {
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    setObjectURL(pdfDataUri);
  }

  const downloadPdf = async (pdfDoc) => {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  const drawTitle = (page, text) => {
    if (page) {
      page.moveTo(margin, height - 80);
      page.drawText(
        title || text,
        {
          size: fontSize * 1.5,
          color: color1
          // font: selectedFont,
        }
      )
    }
  }

  const drawSubtitle = (page, text) => {
    if (page) {
      page.drawText(
        text,
        {
          x: margin,
          y: height - 120,
          size: fontSize * 1.2,
          color: color4
        }
      )
    }
  }

  const drawParagraph = (page, text) => {
    if (page) {
      page.drawText(
        text,
        {
          x: margin,
          y: height - 150,
          size: fontSize,
          color: color4,
          lineHeight: fontSize * 1.1,
          maxWidth: 300
        }
      )
    }
  }

  const drawCircle = (page) => {
    const size = 50;
    if (page) {
      page.drawCircle({
        x: width - size,
        y: size,
        size,
        borderWidth: 5,
        color: color3,
        // opacity: 0.5,
        // borderColor: grayscale(0.5),
        // borderOpacity: 0.75
      });
    }
  }

  const drawSvg = (page) => {
    if (page) {
      const svgPath = 'M0,500L0,0L50,0L50,0L500,0L407.13362,43.21175L49.99999,43.21175L49.99999,500L0,500Z';
      page.drawSvgPath(svgPath, {
        x: 0,
        y: height,
        color: color2,
        // color: grayscale(0.6),
        // opacity: 0.5
        // borderColor: rgb(0.5, 0.5, 0.5),
        // borderWidth: 2,
        // borderOpacity: 0.75
        // rotate: { type: RotationTypes.Degrees, angle: 15 },
        // rotate: { type: RotationTypes.Radians, angle: 2 * Math.PI },
        // rotate: degrees(35),
        // rotate: radians(35),
        // scale: 0.5
      })
    }
  }

  const drawImageJpg = async (page, pdfDoc) => {
    if (page) {
      const jpgUrl = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg';
      const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      const jpgDims = jpgImage.scale(0.2);
      page.drawImage(
        jpgImage,
        {
          x: margin,
          y: 100,
          // width: 100,
          // height: 100,
          width: jpgDims.width,
          height: jpgDims.height,
          // rotate: degrees(30),
          // opacity: 0.75
        }
      )
    }
  }

  const handleClick = async () => {
    // CREATE OR LOAD PDF DOCUMENT
    const pdfDoc = await createPdf();
    // const pdfDoc = await loadPdf('https://pdf-lib.js.org/assets/with_update_sections.pdf');



    // SELECT FONT
    const defaultFont = await pdfDoc.embedFont(StandardFonts.CourierBold);
    // const defaultFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    


    // SETUP PAGE
    pdfDoc.addPage();
    const page = pdfDoc.getPages()[0];
    page.setFont(defaultFont);
    page.setSize(width, height);
    page.setFontSize(fontSize);



    // DRAW
    drawTitle(page, 'Documento PDF');
    drawSubtitle(page, 'Este es el subtitulo del documento');
    drawParagraph(
      page,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada quam vitae elit scelerisque egestas. Integer quis felis fringilla, vestibulum massa ut, dictum est. Nulla nec pretium nunc. Pellentesque nec vulputate odio. Nunc viverra interdum tellus ut condimentum. Mauris ultricies pellentesque augue non varius'
    );
    drawCircle(page);
    drawSvg(page);
    await drawImageJpg(page, pdfDoc);
    // page.translateContent(100, 0);

  

    // DOWNLOAD OR VIEW PDF
    createDataUri(pdfDoc);
    // downloadPdf(pdfDoc);
  
  }

  const handleFontSize = (ev) => {
    setFontSize(Number(ev.target.value));
  }

  const handleTitle = (ev) => {
    setTitle(ev.target.value);
  }

  return (
    <div className="app-creator">
      <div className="pdf-form">
        Tamaño del texto: <input type="text" value={fontSize} onChange={handleFontSize} className="input" />
        Titulo: <input type="text" value={title} onChange={handleTitle} className="input" />
        <button type="button" onClick={handleClick}>Crear PDF</button>
      </div>
      <div className="pdf-viewer">
        <iframe id="iframepdf" title="test" src={objectURL} width="100%" height="795px"></iframe>
      </div>
    </div>
  );
}

export default PdfCreator;
