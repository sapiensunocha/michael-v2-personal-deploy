"use client";
import { FieldErrors, UseFormRegister } from "react-hook-form";
interface LinkApiUploadFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function LinkApiUploadForm({
  register,
  errors,
}: LinkApiUploadFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          API URL / Link
        </label>
        <input
          type="url"
          {...register("apiUrl", { required: "URL is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="https://api.example.com/data"
        />
        {errors.apiUrl && (
          <p className="text-red-500 text-sm">
            {errors.apiUrl.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          API Key (optional)
        </label>
        <input
          type="password"
          {...register("apiKey")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter your API key"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Headers (optional)
        </label>
        <textarea
          {...register("headers")}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter headers in JSON format"
          rows={3}
        />
      </div>
    </div>
  );
}
