export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
    return (
      <iframe
        src={fileUrl}
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      ></iframe>
    );
  }
  