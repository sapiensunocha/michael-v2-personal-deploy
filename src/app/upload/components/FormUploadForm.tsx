"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type DisasterFormData = {
  date: string;
  time: string;
  state_event: "continuous" | "punctual";
  disaster_type: string;
  killed: number;
  people_affected: number;
  length_affected: number;
  description: string;
  metadata?: string;
};

interface FormUploadFormProps {
  register: UseFormRegister<DisasterFormData>;
  errors: FieldErrors<DisasterFormData>;
}

export default function FormUploadForm({
  register,
  errors,
}: FormUploadFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && (
            <p className="text-destructive text-sm">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            {...register("time", { required: "Time is required" })}
          />
          {errors.time && (
            <p className="text-destructive text-sm">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stateEvent">State Event</Label>
        <Select
          onValueChange={(value) => {
            register("state_event").onChange({
              target: { name: "stateEvent", value },
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select state event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="continuous">Continuous</SelectItem>
            <SelectItem value="punctual">Punctual</SelectItem>
          </SelectContent>
        </Select>
        {errors.state_event && (
          <p className="text-destructive text-sm">
            {errors.state_event.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="disasterType">Disaster Type</Label>
        <Input
          id="disasterType"
          placeholder="Enter disaster type"
          {...register("disaster_type", {
            required: "Disaster type is required",
          })}
        />
        {errors.disaster_type && (
          <p className="text-destructive text-sm">
            {errors.disaster_type.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="killed">Killed</Label>
          <Input
            id="killed"
            type="number"
            min="0"
            {...register("killed", {
              required: "Number killed is required",
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
          {errors?.killed && (
            <p className="text-destructive text-sm">{errors.killed.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="peopleAffected">People Affected</Label>
          <Input
            id="peopleAffected"
            type="number"
            min="0"
            {...register("people_affected", {
              required: "People affected is required",
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
          {errors.people_affected && (
            <p className="text-destructive text-sm">
              {errors.people_affected.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lengthAffected">Length Affected</Label>
          <Input
            id="lengthAffected"
            type="number"
            min="0"
            {...register("length_affected", {
              required: "Length affected is required",
              min: { value: 0, message: "Must be 0 or greater" },
            })}
          />
          {errors.length_affected && (
            <p className="text-destructive text-sm">
              {errors.length_affected.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter description"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-destructive text-sm">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="metadata">Metadata (Optional)</Label>
        <Textarea
          id="metadata"
          placeholder="Enter metadata"
          {...register("metadata")}
        />
      </div>
    </div>
  );
}
