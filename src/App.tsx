import { useState } from "react";
import Uploady, {
  useItemStartListener,
  useItemFinalizeListener
} from "@rpldy/uploady";
import { getMockSenderEnhancer } from "@rpldy/mock-sender";
import UploadDropZone from "@rpldy/upload-drop-zone";
import withPasteUpload from "@rpldy/upload-paste";
import UploadPreview from "@rpldy/upload-preview";

const mockSenderEnhancer = getMockSenderEnhancer();

const PasteUploadDropZone = withPasteUpload(UploadDropZone);

const InputComponent = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} />
);

const PasteInput = withPasteUpload(InputComponent);

const UploadStatus = () => {
  const [status, setStatus] = useState<string | null>(null);

  useItemStartListener(() => setStatus("Uploading..."));
  useItemFinalizeListener(() => setStatus("Finished!"));

  return status;
};

export default function App() {
  return (
    <Uploady debug enhancer={mockSenderEnhancer}>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Hello React Uploady
          </h2>

          <PasteUploadDropZone
            params={{ test: "paste" }}
            className="w-full h-52 border-2 border-gray-200 border-dashed rounded-lg flex items-center justify-center mb-4 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <div className="text-center text-gray-600">
              You can drop a file here
              <br />
              OR
              <br />
              click and paste a file to upload
            </div>
          </PasteUploadDropZone>

          <PasteInput
            extraProps={{ placeholder: "paste inside to upload" }}
            className="w-full h-11 text-lg px-4 py-2 border border-gray-300 rounded-lg my-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="text-center text-lg font-medium text-blue-600 my-4">
            <UploadStatus />
          </div>

          <div className="mt-8">
            <UploadPreview
              previewComponentProps={{
                className: "max-w-md mx-auto"
              }}
            />
          </div>
        </div>
      </div>
    </Uploady>
  );
}