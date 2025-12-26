import { useEffect, useState } from "react";
import UploadBox from "./components/UploadBox";
import PdfViewer from "./components/PdfViewer";
import ReactMarkdown from "react-markdown";
import "./App.css";

/* ---------- Helpers ---------- */
function normalizeBullets(text: string) {
  return text.replace(/•\s*/g, "- ");
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [finalSummary, setFinalSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [summaryLevel, setSummaryLevel] = useState<
    "short" | "medium" | "detailed"
  >("medium");

  const [language, setLanguage] = useState("English");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  /* ---------- DARK MODE ---------- */
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.className = dark ? "dark" : "";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  /* ---------- API Call ---------- */
  const summarize = async (file: File) => {
    setLoading(true);
    setError(null);
    setFinalSummary(null);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("summaryLevel", summaryLevel);
    formData.append("language", language);

    try {
      const res = await fetch("https://aipdf-backend.onrender.com/api/summarize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      if (!data.finalSummary) throw new Error();

      setFinalSummary(data.finalSummary);
    } catch {
      setError("Something went wrong. Please try another PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setPdfUrl(URL.createObjectURL(file));
    summarize(file);
  };

  useEffect(() => {
    if (uploadedFile) summarize(uploadedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaryLevel, language]);

  return (
    <div className="app">
      {/* 🌙 DARK MODE TOGGLE */}
      <div className="theme-toggle">
        <button onClick={() => setDark(!dark)}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <h1 className="title">QuickSum</h1>
      <p className="subtitle">Upload. Read. Done.</p>

      {/* CONTROLS */}
      <div className="controls glass">
        <div className="control">
          <label>📏 Summary length</label>
          <select
            value={summaryLevel}
            onChange={(e) =>
              setSummaryLevel(
                e.target.value as "short" | "medium" | "detailed"
              )
            }
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>

        <div className="control">
          <label>🌐 Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Telugu</option>
          </select>
        </div>
      </div>

      <UploadBox onFileSelect={handleFileUpload} />

      {pdfUrl && (
        <div className="card glass">
          <h2>PDF Preview</h2>
          <PdfViewer fileUrl={pdfUrl} />
        </div>
      )}

      {loading && (
        <div className="card glass loader">
          <p>Summarizing your PDF…</p>
        </div>
      )}

      {error && (
        <div className="card glass error">
          <p>{error}</p>
        </div>
      )}

      {finalSummary && !loading && (
        <div className="card glass summary-box">
          <h2>
            {summaryLevel.charAt(0).toUpperCase() + summaryLevel.slice(1)} Summary
          </h2>

          <div className="markdown">
            <ReactMarkdown>
              {normalizeBullets(finalSummary)}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
