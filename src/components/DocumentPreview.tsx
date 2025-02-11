
import { Card } from "@/components/ui/card";
import { ExtractedData } from "@/types/documents";

interface DocumentPreviewProps {
  data: ExtractedData;
}

const DocumentPreview = ({ data }: DocumentPreviewProps) => {
  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Extracted Information</h3>
      
      <Card className="p-4 bg-white border-sky-200">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">File Details</h4>
            <p className="mt-1 text-sm text-gray-900">
              {data.parsedData.filename} ({(data.parsedData.size / 1024).toFixed(2)} KB)
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Extracted Text</h4>
            <pre className="mt-1 text-sm text-gray-900 whitespace-pre-wrap font-mono bg-sky-50 p-4 rounded-md">
              {data.raw.slice(0, 500)}
              {data.raw.length > 500 ? "..." : ""}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentPreview;
