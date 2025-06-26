import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { eventCategories } from "./VideoUploadForm";

interface PDFUploadFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isValidating?: boolean;
  fileError?: {
    message: string;
  } | null;
  validatedData?: any[] | null;
}

export default function PDFUploadForm({
  register,
  errors,
  isValidating,
  fileError,
  validatedData,
}: PDFUploadFormProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    eventCategories[0].value,
  );
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload PDF File
          </label>
          <input
            type="file"
            accept=".pdf"
            {...register("file", { required: "PDF file is required" })}
            className="mt-1 block border p-2 border-dashed bg-gray-100 rounded-md w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-michael_red_100/10 file:text-gray-700
          hover:file:bg-michael_red_200"
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">
              {errors.file.message as string}
            </p>
          )}
          {fileError && (
            <p className="text-red-500 text-sm mt-1">{fileError.message}</p>
          )}
        </div>

        {isValidating && (
          <div className="text-sm text-gray-500">Validating PDF file...</div>
        )}

        {validatedData && (
          <div className="text-sm text-green-600">
            PDF file validated successfully!
          </div>
        )}
      </div>
    </div>
  );
}
