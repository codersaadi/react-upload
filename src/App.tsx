import { useState } from "react";
import Uploady, {
  useItemStartListener,
  useItemFinalizeListener,
  useUploady
} from "@rpldy/uploady";
import { getMockSenderEnhancer } from "@rpldy/mock-sender";
import UploadDropZone from "@rpldy/upload-drop-zone";
import withPasteUpload from "@rpldy/upload-paste";
import UploadPreview from "@rpldy/upload-preview";

const mockSenderEnhancer = getMockSenderEnhancer();

const PasteUploadDropZone = withPasteUpload(UploadDropZone);

const UploadStatus = () => {
  const [status, setStatus] = useState<string | null>(null);

  useItemStartListener(() => setStatus("Uploading..."));
  useItemFinalizeListener(() => setStatus("Finished!"));

  return status;
};

const SmartUploadInput = () => {
  const [url, setUrl] = useState("");
  const { upload } = useUploady();

  const handleUrlUpload = async () => {
    if (!url.trim()) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const filename = url.split("/").pop() || "uploaded-file";
      const file = new File([blob], filename, { type: blob.type });

      upload(file);
      setUrl("");
    } catch (error) {
      console.error("Failed to fetch URL:", error);
      alert("Failed to fetch the URL. Please check the URL and try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUrlUpload();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;

    // Check if a file is being pasted
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          upload(file);
          setUrl("");
        }
        return;
      }
    }
    // If no file, let the default paste behavior happen (for URLs)
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder="Paste a file (Ctrl+V) or type an image URL and press Enter"
        className="flex-1 h-11 text-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={handleUrlUpload}
        disabled={!url.trim()}
        className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Upload
      </button>
    </div>
  );
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

          <div className="my-4">
            <SmartUploadInput />
          </div>

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