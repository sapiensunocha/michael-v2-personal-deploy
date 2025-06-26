"use client";

import { AnalyserModal } from "@/components/ui/analyser-modal";
import { cn } from "@/lib/utils";
import ApiService from "@/services/api.service";
import { convertToCSV } from "@/utils/convert-json-to-csv";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Container from "../../components/ui/container";
import ExcelUploadForm from "./components/ExcelUploadForm";
import FormUploadForm from "./components/FormUploadForm";
import LinkApiUploadForm from "./components/LinkApiUploadForm";
import PDFUploadForm from "./components/PDFUploadForm";
import TextUploadForm from "./components/TextUploadForm";
import VideoUploadForm from "./components/VideoUploadForm";

type DisasterFormData = {
  date: string;
  time: string;
  location: string;
  stateEvent: "continuous" | "punctual";
  disasterType: string;
  impact: {
    killed: number;
    peopleAffected: number;
    lengthAffected: number;
  };
  description: string;
  metadata: string;
  file: FileList;
  videoFile?: FileList;
  pdfFile?: FileList;
  excelFile?: FileList;
  dataType: "new" | "historical";
  textContent: string;
  eventCategory: string;
};

enum FileType {
  VIDEO = "video",
  PDF = "pdf",
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  DATASET = "dataset",
  DOCUMENT = "document",
  SPREADSHEET = "spreadsheet",
}

enum Category {
  NATURAL = "natural_disaster",
  HUMAN = "humand_induced_disaster",
  CONFLICT = "conflict_related_disaster",
  ECONOMIC = "economic_disaster",
}

enum DataType {
  HISTORICAL = "historical",
  NEW = "new",
}

export default function UploadPage() {
  const [selectedFormat, setSelectedFormat] = useState("Excel");
  const [selectedDataType, setSelectedDataType] = useState<
    "new" | "historical"
  >("new");
  const [fileError, setFileError] = useState<{
    message: string;
    missingColumns?: string[];
    rowNumber?: number;
    columnName?: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedData, setValidatedData] = useState<any[] | null>(null);
  const [showAnalyserModal, setShowAnalyserModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DisasterFormData>();

  console.log("errors", errors);

  const fileFormats = [
    { label: "Form", value: "form" },
    { label: "Video", value: "video" },
    { label: "PDF", value: "pdf" },
    { label: "Text", value: "text" },
    { label: "Image", value: "image" },
    { label: "Dataset", value: "dataset" },
    { label: "Link/API", value: "link" },
    { label: "Excel", value: "excel" },
  ];

  const handleVideoUpload = async (file: File, data: DisasterFormData) => {
    setIsValidating(true);
    setFileError(null);
    setValidatedData(null);
    console.log("data", data);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", FileType.VIDEO);
      formData.append("category", data.eventCategory);
      formData.append("dataType", data.dataType);

      const result = await ApiService.uploadFile(formData);
      console.log("result", result);
      return result;
    } catch (error) {
      setFileError({
        message: "An error occurred while processing the video",
      });
      console.error("Processing error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePDFUpload = async (file: File, data: DisasterFormData) => {
    setIsValidating(true);
    setFileError(null);
    setValidatedData(null);

    try {
      const formData = new FormData();
      formData.append("fileToUpload", file);
      formData.append("fileType", FileType.PDF);
      formData.append("category", data.eventCategory);
      formData.append("dataType", data.dataType);

      const response = await fetch("/api/examine-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      const csvData = convertToCSV(result);
      const csvBlob = new Blob([csvData], { type: "text/csv" });

      // Create new FormData for API service call
      const uploadFormData = new FormData();
      uploadFormData.append("file", csvBlob, "extracted_data.csv");
      uploadFormData.append("fileType", FileType.PDF);
      uploadFormData.append("category", data.eventCategory);
      uploadFormData.append("dataType", data.dataType);
      setShowAnalyserModal(true);

      if (!result.success) {
        throw new Error(result.error);
      }

      await ApiService.uploadFile(uploadFormData);
      setValidatedData([result.extractedData]);
      return { ...data, pdfData: result.extractedData };
    } catch (error) {
      setFileError({
        message: "An error occurred while processing the PDF",
      });
      console.error("Processing error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleTextUpload = async (data: DisasterFormData) => {
    setIsValidating(true);
    setFileError(null);
    setValidatedData(null);

    try {
      const response = await fetch("/api/examine-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textContent: data?.textContent,
          eventCategory: data?.eventCategory,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      const csvData = convertToCSV(result);
      const csvBlob = new Blob([csvData], { type: "text/csv" });

      // Create new FormData for API service call
      const uploadFormData = new FormData();
      uploadFormData.append("file", csvBlob, "extracted_data.csv");
      uploadFormData.append("fileType", FileType.TEXT);
      uploadFormData.append("category", data.eventCategory);
      uploadFormData.append("dataType", data.dataType);

      await ApiService.uploadFile(uploadFormData);
      setShowAnalyserModal(true);
      setValidatedData([result.extractedData]);
    } catch (error) {
      setFileError({
        message:
          error instanceof Error
            ? error.message
            : "Failed to process text content",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleFormUpload = async (data: DisasterFormData) => {
    const formData = new FormData();
    formData.append("file", convertToCSV(data));
    formData.append("fileType", FileType.SPREADSHEET);
    formData.append("category", data.eventCategory);
    formData.append("dataType", data.dataType);

    try {
      await ApiService.uploadFile(formData);
    } catch (error) {
      console.error("Upload error:", error);
      setFileError({
        message: "An error occurred while uploading the form data",
      });
    }
  };

  const handleExcelUpload = async (file: File, data: DisasterFormData) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!validTypes.includes(file.type)) {
      setFileError({
        message: "Please upload an Excel file (.xlsx or .xls)",
      });
      return;
    }

    setIsValidating(true);
    setFileError(null);
    setValidatedData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", FileType.SPREADSHEET);
      formData.append("category", data.eventCategory);
      formData.append("dataType", data.dataType);
      await ApiService.uploadFile(formData);
    } catch (error) {
      console.error("Processing error:", error);
      setFileError({
        message: "An error occurred while uploading the file",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (data: DisasterFormData) => {
    console.log("data", data);
    const eventCategory = data.eventCategory || Category.NATURAL;
    const dataType = data.dataType || DataType.NEW;

    let file: File | undefined;

    if (selectedFormat.toLowerCase() === "video") {
      file = data.videoFile?.[0];
    } else if (selectedFormat.toLowerCase() === "pdf") {
      file = data.file?.[0];
    } else if (selectedFormat.toLowerCase() === "excel") {
      file = data.file?.[0];
    }

    if (!file && selectedFormat.toLowerCase() !== "text") {
      return;
    }

    const fileTypeMap: Record<string, FileType> = {
      form: FileType.SPREADSHEET,
      video: FileType.VIDEO,
      pdf: FileType.PDF,
      excel: FileType.SPREADSHEET,
      text: FileType.TEXT,
      image: FileType.IMAGE,
    };

    const fileType = fileTypeMap[selectedFormat.toLowerCase()];
    if (!fileType) {
      console.warn(`Upload handler for ${selectedFormat} not implemented`);
      return;
    }

    const processedData = {
      ...data,
      eventCategory,
      dataType,
    };

    switch (selectedFormat.toLowerCase()) {
      case "form":
        setShowAnalyserModal(true);

        await handleFormUpload(processedData);
        break;
      case "video":
        setShowAnalyserModal(true);

        await handleVideoUpload(file!, processedData);
        break;
      case "pdf":
        await handlePDFUpload(file!, processedData);
        break;
      case "excel":
        setShowAnalyserModal(true);

        await handleExcelUpload(file!, processedData);
        break;
      case "text":
        await handleTextUpload(processedData);
        break;
      default:
        console.warn(`Upload handler for ${selectedFormat} not implemented`);
    }
  };

  const renderUploadForm = () => {
    switch (selectedFormat.toLowerCase()) {
      case "form":
        return <FormUploadForm register={register as any} errors={errors} />;
      case "excel":
        return (
          <ExcelUploadForm
            register={register}
            errors={errors}
            isValidating={isValidating}
            fileError={fileError}
            validatedData={validatedData}
          />
        );
      case "link/api":
        return <LinkApiUploadForm register={register} errors={errors} />;
      case "video":
        return <VideoUploadForm register={register} errors={errors} />;
      case "pdf":
        return (
          <PDFUploadForm
            register={register}
            errors={errors}
            isValidating={isValidating}
            fileError={fileError}
            validatedData={validatedData}
          />
        );
      case "text":
        return (
          <TextUploadForm
            register={register}
            errors={errors}
            isValidating={isValidating}
            textError={fileError}
            validatedData={validatedData}
          />
        );
      default:
        return (
          <p className="text-gray-500 text-sm">
            Upload form for {selectedFormat} format is not implemented yet.
          </p>
        );
    }
  };

  return (
    <Container>
      <div>
        <div className="p-6 border max-w-2xl mx-4 md:mx-auto my-auto backdrop-blur-lg bg-white mt-12 rounded">
          <h1 className="md:text-2xl font-bold mb-6">Upload Data to Michael</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Format
                </label>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <div className="flex h-10 w-full items-center justify-between rounded-md border px-3 cursor-pointer hover:bg-gray-50">
                      <span>{selectedFormat}</span>
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </div>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={5}
                      className={cn(
                        "z-50 min-w-[8rem] w-[var(--radix-popper-anchor-width)] overflow-hidden rounded-md border bg-white p-1 shadow-md",
                        "data-[side=bottom]:animate-slideUpAndFade",
                        "data-[side=top]:animate-slideDownAndFade",
                      )}
                    >
                      {fileFormats.map((format) => (
                        <DropdownMenu.Item
                          key={format.value}
                          className={cn(
                            "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                            "hover:bg-gray-100 focus:bg-gray-100",
                          )}
                          onClick={() => {
                            setSelectedFormat(format.label);
                            setValidatedData(null);
                            setFileError(null);
                            setIsValidating(false);
                            setShowAnalyserModal(false);
                            reset();
                          }}
                        >
                          <span>{format.label}</span>
                          {selectedFormat === format.label && (
                            <CheckIcon className="ml-auto h-4 w-4" />
                          )}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Type
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDataType("new");
                    }}
                    className={`py-2 px-2 truncate text-xs md:text-sm font-medium rounded-md border transition-colors
                  ${
                    selectedDataType === "new"
                      ? "bg-michael_red_100 text-white border-michael_red_100"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }
                `}
                  >
                    New Data
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDataType("historical");
                    }}
                    className={`py-2 px-2 truncate text-xs md:text-sm font-medium rounded-md border transition-colors
                  ${
                    selectedDataType === "historical"
                      ? "bg-michael_red_100 text-white border-michael_red_100"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }
                `}
                  >
                    Historical Data
                  </button>
                </div>
                <input
                  type="hidden"
                  {...register("dataType", { required: true })}
                  value={selectedDataType}
                />
                {errors.dataType && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select a data type
                  </p>
                )}
              </div>
            </div>

            <div className="p-2 border rounded-md border-gray-100">
              {renderUploadForm()}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isValidating}
                className={`w-fit mt-4 bg-michael_red_100 text-white py-2 px-6 rounded-md
            hover:bg-michael_red_100 focus:outline-none focus:ring-2 focus:ring-michael_red_100
            focus:ring-offset-2 ${isValidating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isValidating ? "Validating..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
        {showAnalyserModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <AnalyserModal onClose={() => setShowAnalyserModal(false)} />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
