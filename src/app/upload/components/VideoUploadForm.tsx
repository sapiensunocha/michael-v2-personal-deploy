import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type VideoUploadFormProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
};

export const eventCategories = [
  { value: "natural_disaster", label: "Natural Disaster" },
  { value: "humand_induced_disaster", label: "Human-Induced Disaster" },
  { value: "conflict_related_disaster", label: "Conflict-Related Disaster" },
  { value: "economic_disaster", label: "Economic Disaster" },
];

export default function VideoUploadForm({
  register,
  errors,
}: VideoUploadFormProps) {
  const [uploadType, setUploadType] = useState<"file" | "link">("file");
  const [selectedCategory, setSelectedCategory] = useState(
    eventCategories[0].value,
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Event Category
        </label>
        <input
          type="hidden"
          {...register("eventCategory", { required: true })}
          value={selectedCategory}
        />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div className="flex h-10 w-full items-center justify-between rounded-md border px-3 cursor-pointer hover:bg-gray-50">
              <span>
                {
                  eventCategories.find((cat) => cat.value === selectedCategory)
                    ?.label
                }
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
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
              {eventCategories.map((category) => (
                <DropdownMenu.Item
                  key={category.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                    "hover:bg-gray-100 focus:bg-gray-100",
                  )}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <span>{category.label}</span>
                  {selectedCategory === category.value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        {errors.eventCategory && (
          <p className="text-red-500 text-sm mt-1">
            Please select an event category
          </p>
        )}
      </div>
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setUploadType("file")}
          className={`py-2 w-full px-4 text-xs md:text-sm font-medium rounded-md border transition-colors
            ${
              uploadType === "file"
                ? "bg-michael_red_100 text-white border-michael_red_100"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }
          `}
        >
          Upload Video
        </button>
        <button
          type="button"
          onClick={() => setUploadType("link")}
          className={`py-2 w-full px-4 text-xs md:text-sm font-medium rounded-md border transition-colors
            ${
              uploadType === "link"
                ? "bg-michael_red_100 text-white border-michael_red_100"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }
          `}
        >
          Video Link
        </button>
      </div>

      {uploadType === "file" ? (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Video File
          </label>
          <input
            type="file"
            accept="video/*"
            {...register("videoFile", { required: uploadType === "file" })}
            className="mt-1 block border p-2 border-dashed bg-gray-100 rounded-md w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-michael_red_100/10 file:text-gray-700
          hover:file:bg-michael_red_200"
          />
          {errors.videoFile && (
            <p className="text-red-500 text-sm mt-1">
              Please upload a video file
            </p>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Video URL
          </label>
          <input
            type="url"
            {...register("videoUrl", {
              required: uploadType === "link",
              pattern: {
                value:
                  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}(\?.*)?$/,
                message: "Please enter a valid YouTube URL",
              },
            })}
            placeholder="https://example.com/video"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-michael_red_100 focus:outline-none focus:ring-1 focus:ring-michael_red_100"
          />
          {errors.videoUrl && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid video URL
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Video Description
        </label>
        <textarea
          {...register("videoDescription", {
            required: "Please provide a description",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-michael_red_100 focus:outline-none focus:ring-1 focus:ring-michael_red_100"
          placeholder="Provide a brief description of the video content..."
        />
        {errors.videoDescription && (
          <p className="text-red-500 text-sm mt-1">
            {errors.videoDescription.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
