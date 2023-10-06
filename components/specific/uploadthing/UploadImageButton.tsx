"use client";
 
import "@uploadthing/react/styles.css";
 
import { UploadButton } from "@/helpers/uploadthing";
import toast from "react-hot-toast";
 
export default function UploadImageButton() {
  return (
      <UploadButton
        endpoint="imageUploader"
        className="!m-0"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          toast.success('Upload Completed');
        }}
        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error.message}\nTry again sometime later.`);
        }}
      />
  );
}