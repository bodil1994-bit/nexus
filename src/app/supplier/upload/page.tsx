import { submitBatch } from './actions';

export default function SupplierUploadPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Submit Batch Passport</h1>
        <form action={submitBatch} encType="multipart/form-data" className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="orderNumber" className="text-sm font-medium text-zinc-700">
              Order Number
            </label>
            <input
              id="orderNumber"
              name="orderNumber"
              type="text"
              required
              placeholder="e.g. ORD-4491"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="batchNumber" className="text-sm font-medium text-zinc-700">
              Batch Number
            </label>
            <input
              id="batchNumber"
              name="batchNumber"
              type="text"
              required
              placeholder="e.g. BAT-014"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="files" className="text-sm font-medium text-zinc-700">
              Passport Files
            </label>
            <input
              id="files"
              name="files"
              type="file"
              multiple
              accept=".csv,.json,.xlsx,.xml,.pdf,.txt"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium"
            />
            <p className="text-xs text-zinc-400">Accepted: .csv, .json, .xlsx, .xml, .pdf, .txt</p>
          </div>
          <button
            type="submit"
            className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Submit Batch
          </button>
        </form>
      </div>
    </div>
  );
}
