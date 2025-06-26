import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { eventCategories } from "./VideoUploadForm";

interface TextUploadFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isValidating?: boolean;
  textError?: {
    message: string;
  } | null;
  validatedData?: any[] | null;
}

export default function TextUploadForm({
  register,
  errors,
  isValidating,
  textError,
  validatedData,
}: TextUploadFormProps) {
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

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Text Description
          </label>
          <textarea
            {...register("textContent", {
              required: "Text description is required",
              minLength: {
                value: 50,
                message: "Description should be at least 50 characters long",
              },
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
              focus:border-michael_red_100 focus:ring-michael_red_100 
              p-2 min-h-[150px] text-sm"
            placeholder="Please provide a detailed description of the event..."
          />
          {errors.textContent && (
            <p className="text-red-500 text-sm mt-1">
              {errors.textContent.message as string}
            </p>
          )}
          {textError && (
            <p className="text-red-500 text-sm mt-1">{textError.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Metadata (Optional)
          </label>
          <textarea
            {...register("metadata")}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
              focus:border-michael_red_100 focus:ring-michael_red_100 
              p-2 h-20 text-sm"
            placeholder="Add any additional information, tags, or context..."
          />
        </div>

        {isValidating && (
          <div className="text-sm text-gray-500">
            Validating text content...
          </div>
        )}

        {validatedData && (
          <div className="text-sm text-green-600">
            Text content validated successfully!
          </div>
        )}
      </div>
    </div>
  );
}
