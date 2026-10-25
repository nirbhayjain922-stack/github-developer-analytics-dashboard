import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Turns a visible page section into a multi-page A4 PDF and downloads it.
 * Charts and cards are captured as they appear on screen.
 */
export async function exportElementToPdf(element, filename) {
  if (!element) {
    throw new Error("Nothing to export yet.");
  }

  const capture = async (ignoreImages) =>
    html2canvas(element, {
      backgroundColor: "#0d1117",
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      windowWidth: Math.max(element.scrollWidth, 1024),
      onclone: (clonedDocument) => {
        const clonedRoot = clonedDocument.querySelector("[data-pdf-root]");
        if (!clonedRoot) {
          return;
        }

        clonedRoot.querySelectorAll(".overflow-x-auto").forEach((node) => {
          node.style.overflow = "visible";
        });

        if (ignoreImages) {
          clonedRoot.querySelectorAll("img").forEach((image) => {
            image.removeAttribute("src");
            image.style.background = "#30363d";
          });
        }
      },
    });

  let canvas;

  try {
    canvas = await capture(false);
  } catch {
    canvas = await capture(true);
  }

  const image = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageHeight = (canvas.height * pageWidth) / canvas.width;

  let remainingHeight = imageHeight;
  let yOffset = 0;

  pdf.addImage(image, "PNG", 0, yOffset, pageWidth, imageHeight);
  remainingHeight -= pageHeight;

  while (remainingHeight > 0) {
    yOffset -= pageHeight;
    pdf.addPage();
    pdf.addImage(image, "PNG", 0, yOffset, pageWidth, imageHeight);
    remainingHeight -= pageHeight;
  }

  pdf.save(filename);
}
