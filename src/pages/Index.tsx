
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
    let imageUrl: string | null = null;
    
    try {
      setStatus("processing");
      setProgress(0);
      
      // Create URL and load image first
      imageUrl = URL.createObjectURL(file);
      
      // Create a promise to load the image
      const loadImage = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl!;
      });

      // Wait for image to load
      await loadImage;
      console.log('Image loaded successfully');
      
      // Create and initialize worker
      const worker = await createWorker("eng");
      console.log('Worker initialized');
      
      try {
        console.log('Starting OCR process');
        // Perform OCR using the image URL
        const { data } = await worker.recognize(imageUrl);
        console.log('OCR completed', data);

        const extractedData: ExtractedData = {
          raw: data.text,
          parsedData: {
            timestamp: new Date().toISOString(),
            filename: file.name,
            size: file.size,
          }
        };

        setExtractedData(extractedData);
        setStatus("complete");
        toast.success("Document processed successfully");
      } finally {
        // Clean up
        await worker.terminate();
      }
    } catch (error) {
      console.error("Processing error:", error);
      setStatus("error");
      toast.error("Failed to process document");
    } finally {
      // Clean up URL in final finally block
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    console.log('Processing file:', file.name, 'Type:', file.type);
    processDocument(file);
  }, []);

  return (
    <div className="min-h-screen bg-sky-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">Document Processing</h1>
          <button className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600 transition-colors">
            Create Load
          </button>
        </div>

        <Card className="p-8 bg-white shadow-sm border-sky-200">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
              <span className="text-white text-sm">AI</span>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Dispatch Assist</h2>
              <p className="text-sm text-gray-500">Let PCS book your loads</p>
            </div>
          </div>

          <DragDropZone 
            onDrop={onDrop} 
            status={status} 
          />

          {status === "processing" && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Processing document...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
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
