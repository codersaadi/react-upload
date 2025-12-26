import Uploady from "@rpldy/uploady";
import { getMockSenderEnhancer } from "@rpldy/mock-sender";
import UploadPreview from "@rpldy/upload-preview";
import DropZoneWithBrowse from "./components/DropZoneWithBrowse";
import SmartUploadInput from "./components/SmartUploadInput";
import UploadStatus from "./components/UploadStatus";

// Mock sender for simulating upload behavior
const mockSenderEnhancer = getMockSenderEnhancer();

/**
 * Main App Component
 * Provides multiple ways to upload images:
 * 1. Drag & drop on drop zone
 * 2. Click drop zone to browse files
 * 3. Paste files (Ctrl+V) in input field
 * 4. Type/paste image URLs
 */
export default function App() {
  return (
    <Uploady debug enhancer={mockSenderEnhancer}>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Hello React Uploady
          </h2>

          {/* Drop zone: drag & drop or click to browse */}
          <DropZoneWithBrowse />

          {/* Smart input: paste files or type URLs */}
          <div className="my-4">
            <SmartUploadInput />
          </div>

          {/* Upload status indicator */}
          <div className="text-center text-lg font-medium text-blue-600 my-4">
            <UploadStatus />
          </div>

          {/* Preview uploaded images */}
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
