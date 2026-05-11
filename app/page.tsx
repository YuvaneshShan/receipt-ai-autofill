"use client";

import { useState } from "react";

type ReceiptData = {
  merchantName: string;
  date: string;
  totalAmount: string;
  currency: string;
};

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<ReceiptData>({
    merchantName: "",
    date: "",
    totalAmount: "",
    currency: "",
  });

  const [submittedData, setSubmittedData] = useState<ReceiptData | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedData(formData);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Receipt-to-Form Auto-Fill Web App
          </h1>
          <p className="mt-2 text-slate-600">
            Upload a receipt image and review the extracted details before submission.
          </p>
        </div>

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
              disabled={!imagePreview}
              className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Extract Receipt Data
            </button>

            <p className="mt-3 text-xs text-slate-500">
              AI extraction will be connected on Day 2.
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
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Submitted Receipt Data
            </h2>

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
          </section>
        )}
      </div>
    </main>
  );
}