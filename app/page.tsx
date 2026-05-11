"use client";

import { useEffect, useState } from "react";

type ReceiptData = {
  merchantName: string;
  date: string;
  totalAmount: string;
  currency: string;
};

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<ReceiptData>({
    merchantName: "",
    date: "",
    totalAmount: "",
    currency: "",
  });

  const [submittedData, setSubmittedData] = useState<ReceiptData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedReceiptData = localStorage.getItem("submittedReceiptData");

    if (savedReceiptData) {
      setSubmittedData(JSON.parse(savedReceiptData));
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorMessage("");
    setSubmittedData(null);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExtractReceipt = async () => {
    if (!selectedImage) {
      setErrorMessage("Please upload a receipt image first.");
      return;
    }

    try {
      setIsExtracting(true);
      setErrorMessage("");

      const uploadData = new FormData();
      uploadData.append("image", selectedImage);

      const response = await fetch("/api/extract-receipt", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract receipt data.");
      }

      setFormData({
        merchantName: data.merchantName || "",
        date: data.date || "",
        totalAmount: data.totalAmount || "",
        currency: data.currency || "",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong during extraction.";

      setErrorMessage(message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmittedData(formData);
    localStorage.setItem("submittedReceiptData", JSON.stringify(formData));
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Receipt-to-Form Auto-Fill Web App
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Upload a receipt image, extract key details using Gemini AI, and review the editable form before submitting.
          </p>
        </div>

        <div className="mb-8 mt-5 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm">
            AI Receipt Extraction
          </span>
          <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm">
            Editable Form Review
          </span>
          <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm">
            Local Submission
          </span>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Upload Receipt
            </h2>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:bg-slate-100">
              <span className="text-sm font-medium text-slate-700">
                Click to upload receipt image
              </span>
              <span className="mt-1 text-xs text-slate-500">
                PNG, JPG, or JPEG
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Receipt Preview
                </p>
                <img
                  src={imagePreview}
                  alt="Receipt preview"
                  className="max-h-96 w-full rounded-xl border object-contain"
                />
              </div>
            )}

            <button
              type="button"
              disabled={!imagePreview || isExtracting}
              onClick={handleExtractReceipt}
              className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isExtracting ? "Extracting..." : "Extract Receipt Data"}
            </button>

            <p className="mt-3 text-xs text-slate-500">
              The uploaded image is sent to the server API route, then processed using Gemini AI.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Review Extracted Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Merchant Name
                </label>
                <input
                  type="text"
                  name="merchantName"
                  value={formData.merchantName}
                  onChange={handleInputChange}
                  placeholder="Example: Lotus's Malaysia"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Date
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="Example: 2026-05-11"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Total Amount
                </label>
                <input
                  type="text"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  placeholder="Example: 25.90"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Currency
                </label>
                <input
                  type="text"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  placeholder="Example: MYR"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Submit Reviewed Data
              </button>
            </form>
          </section>
        </div>

        {submittedData && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Submitted Receipt Data
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Final reviewed data submitted by the user.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-4">
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="font-semibold text-slate-900">Merchant</p>
                <p>{submittedData.merchantName || "-"}</p>
              </div>

              <div className="rounded-xl bg-slate-100 p-4">
                <p className="font-semibold text-slate-900">Date</p>
                <p>{submittedData.date || "-"}</p>
              </div>

              <div className="rounded-xl bg-slate-100 p-4">
                <p className="font-semibold text-slate-900">Total</p>
                <p>{submittedData.totalAmount || "-"}</p>
              </div>

              <div className="rounded-xl bg-slate-100 p-4">
                <p className="font-semibold text-slate-900">Currency</p>
                <p>{submittedData.currency || "-"}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("submittedReceiptData");
                setSubmittedData(null);
              }}
              className="mt-5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Clear Saved Data
            </button>
          </section>
        )}
      </div>
    </main>
  );
}