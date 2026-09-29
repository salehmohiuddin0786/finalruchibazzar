import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = 
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";


function PdfViewer({ file }) {
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const pdfUrl = !file
    ? ""
    : file.startsWith("http") || file.startsWith("/")
    ? file
    : "/" + file;

  useEffect(() => {
    if (!pdfUrl) return;

    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        setIsLoaded(false);
        setError(null);
      }
    });

    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);

      loadingTask.promise
        .then((pdf) => {
          if (!isMounted) return;
          setPdfDoc(pdf);
          setTotalPages(pdf.numPages);
          setPageNum(1);
          setIsLoaded(true);
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error("PDF load error:", err);
          setError("Failed to load PDF.");
          setIsLoaded(false);
        });
    } catch (e) {
      queueMicrotask(() => {
        if (isMounted) {
          setError("PDF library unavailable");
          setIsLoaded(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    pdfDoc.getPage(pageNum).then((page) => {
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      page.render(renderContext);
    });
  }, [pdfDoc, pageNum]);

  const prevPage = () => {
  if (pageNum > 1) {
    setPageNum(pageNum - 1);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
  }
};

const nextPage = () => {
  if (pageNum < totalPages) {
    setPageNum(pageNum + 1);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
  }
};

  return (
    <div className="mt-28">
      <div className="pdf-container text-center p-5">
        {/* <h2 className="text-2xl font-semibold text-green-700 mb-4">{pdfName}</h2> */}

        {!isLoaded && !error && (
          <p className="text-gray-600">Loading PDF...</p>
        )}
        {error && <p className="text-red-600 mt-4">{error}</p>}

        <canvas
          id="pdf-canvas"
          ref={canvasRef}
          className="block mx-auto border border-gray-300 shadow-md max-w-[900px] w-full"
        ></canvas>

        {isLoaded && !error && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={prevPage}
                disabled={pageNum <= 1}
                className={`px-4 py-2 rounded text-white transition ${
                  pageNum <= 1
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Previous
              </button>

              <span className="text-gray-700 font-medium">
                Page {pageNum} of {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={pageNum >= totalPages}
                className={`px-4 py-2 rounded text-white transition ${
                  pageNum >= totalPages
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Next
              </button>
            </div>

            <a
              href={pdfUrl}
              download
              className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition"
            >
              Download PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfViewer;
