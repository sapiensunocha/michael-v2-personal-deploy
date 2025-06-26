import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

type SliderProps = {
  name: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
};

const Slider: React.FC<SliderProps> = ({ name, value, onValueChange, min = 0, max = 100, step = 1 }) => {
  return (
    <SliderPrimitive.Root
      className="relative flex items-center w-full h-5"
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
    >
      <SliderPrimitive.Track className="relative h-1 bg-gray-300 flex-1 rounded-full">
        <SliderPrimitive.Range className="absolute h-full bg-red-600 rounded-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block w-5 h-5 bg-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label={name}
      />
    </SliderPrimitive.Root>
  );
};

export { Slider };