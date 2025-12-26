import { useRef } from "react";
import { useUploady } from "@rpldy/uploady";
import UploadDropZone from "@rpldy/upload-drop-zone";
import withPasteUpload from "@rpldy/upload-paste";

// Enhanced drop zone that supports paste functionality
const PasteUploadDropZone = withPasteUpload(UploadDropZone);

/**
 * Drop zone component with click-to-browse functionality
 * Supports: drag & drop, click to browse files
 */
export default function DropZoneWithBrowse() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload } = useUploady();

  // Handle file selection from file browser
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      upload(files[0]);
      e.target.value = ""; // Reset input for multiple uploads
    }
  };

  // Open file browser when drop zone is clicked
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div onClick={handleClick}>
      {/* Hidden file input triggered by clicking the drop zone */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Visual drop zone area */}
      <PasteUploadDropZone
        params={{ test: "paste" }}
        className="w-full h-52 border-2 border-gray-200 border-dashed rounded-lg flex items-center justify-center mb-4 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
      >
        <div className="text-center text-gray-600">
          You can drop a file here
          <br />
          OR
          <br />
          click to browse and select a file to upload
        </div>
      </PasteUploadDropZone>
    </div>
  );
}
