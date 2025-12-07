import React from "react";
import "./UploadBox.css";

export default function UploadBox({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="upload-box">
      <label className="upload-area">
        <input type="file" accept="application/pdf" onChange={handleChange} />
        <p>📄 Drag & Drop PDF or Click to Upload</p>
      </label>
    </div>
  );
}
