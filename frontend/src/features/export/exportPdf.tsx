import { pdf } from "@react-pdf/renderer";
import { ExportReportDocument } from "./ExportReportDocument";
import type { ExportResultData } from "./types";

interface ExportReportPdfParams {
  result: ExportResultData;
  capturedImage: string | null;
}

export const exportReportToPdf = async ({ result, capturedImage }: ExportReportPdfParams) => {
  const blob = await pdf(<ExportReportDocument result={result} capturedImage={capturedImage} generatedAt={new Date()} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `EcoSort-${result.item}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

