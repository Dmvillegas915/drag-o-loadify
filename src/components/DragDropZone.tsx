
import { useDropzone } from "react-dropzone";
import { ProcessingStatus } from "@/types/documents";
import { cn } from "@/lib/utils";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";

interface DragDropZoneProps {
  onDrop: (files: File[]) => void;
  status: ProcessingStatus;
}

const DragDropZone = ({ onDrop, status }: DragDropZoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 transition-all duration-200 ease-in-out cursor-pointer",
        {
          "border-gray-300 bg-gray-50": !isDragActive && status === "idle",
          "border-blue-400 bg-blue-50": isDragActive,
          "border-green-400 bg-green-50": status === "complete",
          "border-yellow-400 bg-yellow-50": status === "processing",
          "border-red-400 bg-red-50": status === "error",
        }
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        {status === "idle" && (
          <>
            <Upload className="w-12 h-12 text-gray-400" />
            <div className="space-y-1">
              <p className="text-gray-600">
                {isDragActive ? "Drop your document here" : "Drag & drop your document here"}
              </p>
              <p className="text-sm text-gray-500">or click to select a file</p>
            </div>
          </>
        )}

        {status === "processing" && (
          <>
            <FileText className="w-12 h-12 text-yellow-500 animate-pulse" />
            <p className="text-yellow-600">Processing your document...</p>
          </>
        )}

        {status === "complete" && (
          <>
            <Check className="w-12 h-12 text-green-500" />
            <p className="text-green-600">Document processed successfully</p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-red-600">Error processing document</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DragDropZone;
