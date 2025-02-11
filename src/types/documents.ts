
export type ProcessingStatus = "idle" | "processing" | "complete" | "error";

export interface ExtractedData {
  raw: string;
  parsedData: {
    timestamp: string;
    filename: string;
    size: number;
    // Add more specific fields based on your TMS requirements
  };
}
