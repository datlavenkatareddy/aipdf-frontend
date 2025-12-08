import { useState } from "react";
import UploadBox from "./components/UploadBox";
import PdfViewer from "./components/PdfViewer";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  const handleFileUpload = async (file: File) => {
    setSummary("");
    setLoading(true);

    const url = URL.createObjectURL(file);
    setPdfUrl(url);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
        const res = await fetch("https://aipdf-backend.onrender.com/api/summarize", {

        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setSummary(data.summary || "No summary found.");
    } catch (err) {
      console.error(err);
      setSummary("Error summarizing PDF.");
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (summary) navigator.clipboard.writeText(summary);
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <div className="dark-toggle">
        <label className="switch">
          <input type="checkbox" checked={dark} onChange={() => setDark(!dark)} />
          <span className="slider"></span>
        </label>
      </div>

      <h1 className="title">AI PDF Summarizer</h1>

      <UploadBox onFileSelect={handleFileUpload} />

      {pdfUrl && (
        <div className="card glass">
          <h2>PDF Preview</h2>
          <PdfViewer fileUrl={pdfUrl} />
        </div>
      )}

      {loading && (
        <div className="card glass loader">
          <p>Summarizing your PDF...</p>
        </div>
      )}

      {!loading && summary && (
        <div className="card glass summary-box">
          <h2>Summary</h2>
          <p>{summary}</p>

          <div className="actions">
            <button className="btn primary" onClick={copySummary}>📋 Copy</button>
            <button className="btn secondary" onClick={downloadSummary}>⬇️ Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
