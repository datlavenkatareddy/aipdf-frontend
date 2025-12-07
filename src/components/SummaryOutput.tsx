type Props = {
    summary: string;
  };
  
  export default function SummaryOutput({ summary }: Props) {
    const copyText = () => {
      navigator.clipboard.writeText(summary);
      alert("Summary copied to clipboard!");
    };
  
    const downloadText = () => {
      const blob = new Blob([summary], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "summary.txt";
      a.click();
  
      URL.revokeObjectURL(url);
    };
  
    return (
      <div className="summary-box">
        <div className="summary-header">
          <h3>Summary</h3>
          <div className="summary-actions">
            <button className="btn ghost" onClick={copyText}>
              Copy
            </button>
            <button className="btn" onClick={downloadText}>
              Download
            </button>
          </div>
        </div>
        <div className="summary-body">
          <p>{summary}</p>
        </div>
      </div>
    );
  }
  