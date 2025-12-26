import { useState } from "react";
import { useItemStartListener, useItemFinalizeListener } from "@rpldy/uploady";

/**
 * Displays upload status messages
 * Shows "Uploading..." when upload starts, "Finished!" when complete
 */
export default function UploadStatus() {
  const [status, setStatus] = useState<string | null>(null);

  // Listen for upload lifecycle events
  useItemStartListener(() => setStatus("Uploading..."));
  useItemFinalizeListener(() => setStatus("Finished!"));

  return status;
}
