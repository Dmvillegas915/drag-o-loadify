
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createWorker } from "tesseract.js";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DragDropZone from "@/components/DragDropZone";
import DocumentPreview from "@/components/DocumentPreview";
import { ProcessingStatus, ExtractedData } from "@/types/documents";

const Index = () => {
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  const processDocument = async (file: File) => {
    try {
      setStatus("processing");
      setProgress(0);
      
      const worker = await createWorker({
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Here you would implement your parsing logic for the TMS application
      // This is a simplified example
      const extractedData: ExtractedData = {
        raw: text,
        parsedData: {
          // Add your specific parsing logic here
          timestamp: new Date().toISOString(),
          filename: file.name,
          size: file.size,
        }
      };

      setExtractedData(extractedData);
      setStatus("complete");
      toast.success("Document processed successfully");
    } catch (error) {
      console.error("Processing error:", error);
      setStatus("error");
      toast.error("Failed to process document");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      toast.error("Please upload a PDF or image file");
      return;
    }

    processDocument(file);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-gray-900">Document Processing Portal</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Drag and drop your emails or documents to automatically create trucking loads
          </p>
        </div>

        <Card className="p-8">
          <DragDropZone 
            onDrop={onDrop} 
            status={status} 
          />

          {status === "processing" && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing document...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {extractedData && status === "complete" && (
            <DocumentPreview data={extractedData} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;
