import { useState } from "react";
import { useUploady } from "@rpldy/uploady";

type FeedbackType = {
  type: "error" | "success" | "info";
  message: string;
};

/**
 * Smart input component that handles multiple upload methods:
 * 1. Paste files directly (Ctrl+V)
 * 2. Type or paste image URLs
 */
export default function SmartUploadInput() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const { upload } = useUploady();

  /**
   * Fetch image from URL and upload it
   * Validates that the URL points to an image
   */
  const handleUrlUpload = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setFeedback({ type: "info", message: "Fetching image from URL..." });

    try {
      // Fetch the image from URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();

      // Validate that it's an image
      if (!blob.type.startsWith('image/')) {
        throw new Error("URL does not point to an image file");
      }

      // Create a file from the blob
      const filename = url.split("/").pop()?.split("?")[0] || "uploaded-file";
      const file = new File([blob], filename, { type: blob.type });

      // Upload the file
      setFeedback({ type: "info", message: "Uploading..." });
      upload(file);
      setUrl("");

      // Show success message
      setTimeout(() => {
        setFeedback({ type: "success", message: "Upload started successfully!" });
        setTimeout(() => setFeedback(null), 2000);
      }, 500);
    } catch (error) {
      console.error("Failed to fetch URL:", error);
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to fetch the URL. Please check and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload when Enter key is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUrlUpload();
    }
  };

  /**
   * Handle paste events - detects if a file or text is being pasted
   * If file: upload it directly
   * If text: let it paste into the input (for URLs)
   */
  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;

    // Check if a file is being pasted
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          setFeedback({ type: "info", message: `Uploading ${file.name}...` });
          upload(file);
          setUrl("");
          setTimeout(() => {
            setFeedback({ type: "success", message: "File uploaded successfully!" });
            setTimeout(() => setFeedback(null), 2000);
          }, 500);
        }
        return;
      }
    }
    // If no file, let the default paste behavior happen (for URLs)
  };

  return (
    <div className="space-y-2">
      {/* URL input with paste support */}
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Paste file (Ctrl+V) or type image URL"
          disabled={isLoading}
          className="flex-1 h-11 text-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleUrlUpload}
          disabled={!url.trim() || isLoading}
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Upload"}
        </button>
      </div>

      {/* Feedback messages (success, error, info) */}
      {feedback && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            feedback.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : feedback.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
