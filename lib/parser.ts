import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts raw text from an uploaded syllabus file (PDF, DOCX, or Image).
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;

  try {
    if (fileType === "application/pdf") {
      return await parsePDF(file);
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await parseDOCX(file);
    } else if (fileType.startsWith("image/")) {
      return await parseImage(file);
    } else {
      throw new Error("Unsupported file format. Please upload PDF, DOCX, or Image.");
    }
  } catch (err) {
    console.error("Text extraction failed:", err);
    return ""; // Fallback to returning empty string, generator will use fallback questions
  }
}

async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: unknown) => (item as { str?: string }).str || "");
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}

async function parseDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function parseImage(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  const result = await Tesseract.recognize(objectUrl, "eng", {
    logger: (m) => console.log(m),
  });
  URL.revokeObjectURL(objectUrl);
  return result.data.text;
}
