import React, { useState } from "react";
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

const PasteInput = withPasteUpload((props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-[400px] h-[22px] text-xl my-2.5 bg-transparent border border-gray-600 text-white px-2"
  />
));

const UploadStatus = () => {
  const [status, setStatus] = useState<string | null>(null);

  useItemStartListener(() => setStatus("Uploading..."));
  useItemFinalizeListener(() => setStatus("Finished!"));

  return status ? <p className="text-white">{status}</p> : null;
};

export default function App() {
  return (
    <Uploady debug enhancer={mockSenderEnhancer}>
      <div className="font-sans text-center flex flex-col justify-center items-center min-h-screen bg-[#010916] text-white">
        <h2 className="text-2xl mb-4">Hello React Uploady</h2>

        <PasteUploadDropZone
          params={{ test: "paste" }}
          className="w-[400px] h-[200px] border border-gray-200 flex items-center justify-center mb-2.5 cursor-pointer hover:border-gray-400 transition-colors"
        >
          <div className="text-center">
            You can drop a file here
            <br />
            OR
            <br />
            click and paste a file to upload
          </div>
        </PasteUploadDropZone>

        <PasteInput extraProps={{ placeholder: "paste inside to upload" }} />

        <UploadStatus />

        <div className="mt-5 [&_img]:max-w-[400px]">
          <UploadPreview />
        </div>
      </div>
    </Uploady>
  );
}