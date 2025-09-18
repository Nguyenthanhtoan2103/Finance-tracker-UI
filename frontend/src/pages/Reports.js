import React, { useEffect, useState } from "react";
import {
  getReportSummary,
  downloadReportPDF,
  downloadReportExcel,
} from "../services/api";

export default function Reports() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getReportSummary();
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const downloadFile = async (type) => {
    try {
      const res =
        type === "pdf" ? await downloadReportPDF() : await downloadReportExcel();
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "pdf" ? "report.pdf" : "report.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          📑 Reports
        </h1>

        <div className="bg-white p-6 rounded-lg shadow">
          {summary ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="text-lg font-medium text-green-700">
                  Total Income
                </h3>
                <p className="text-2xl font-bold text-green-800">
                  ${summary.income}
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="text-lg font-medium text-red-700">
                  Total Expense
                </h3>
                <p className="text-2xl font-bold text-red-800">
                  ${summary.expense}
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="text-lg font-medium text-blue-700">Balance</h3>
                <p className="text-2xl font-bold text-blue-800">
                  ${summary.balance}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => downloadFile("pdf")}
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Download PDF
            </button>
            <button
              onClick={() => downloadFile("excel")}
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
