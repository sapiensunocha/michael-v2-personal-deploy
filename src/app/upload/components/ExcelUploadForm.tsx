"use client";
import { FieldErrors, UseFormRegister } from "react-hook-form";
interface ExcelUploadFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isValidating: boolean;
  fileError: {
    message: string;
    missingColumns?: string[];
    rowNumber?: number;
    columnName?: string;
  } | null;
  validatedData: any[] | null;
}

export default function ExcelUploadForm({
  register,
  errors,
  isValidating,
  fileError,
  validatedData,
}: ExcelUploadFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Excel File
        </label>
        <input
          type="file"
          accept=".xlsx,.xls"
          {...register("file", { required: "File is required" })}
          className="mt-1 block border p-2 border-dashed bg-gray-100 rounded-md w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-michael_red_100/10 file:text-gray-700
          hover:file:bg-michael_red_200"
        />
        {errors.file && (
          <p className="text-red-500 text-sm">
            {errors.file.message as string}
          </p>
        )}
        {isValidating && (
          <div className="mt-2">
            <p className="text-blue-500 text-sm">Validating Excel file...</p>
          </div>
        )}
        {fileError && (
          <div className="mt-2 text-red-500 text-sm">
            <p>{fileError.message}</p>
            {fileError.missingColumns && (
              <ul className="list-disc list-inside mt-1">
                {fileError.missingColumns.map((column) => (
                  <li key={column}>Missing column: {column}</li>
                ))}
              </ul>
            )}
            {fileError.rowNumber && (
              <p className="mt-1">Row: {fileError.rowNumber}</p>
            )}
            {fileError.columnName && (
              <p className="mt-1">Column: {fileError.columnName}</p>
            )}
          </div>
        )}
        {validatedData && (
          <p className="mt-2 text-green-500 text-sm">
            ✓ Excel file validated successfully ({validatedData.length} rows)
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Accepted formats: .xlsx, .xls
        </p>
      </div>
    </div>
  );
}
