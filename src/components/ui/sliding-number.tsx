"use client";
import { useEffect, useId, useRef, useState } from "react";
// --- CHANGE START ---
// Explicitly import 'Transition' type from 'framer-motion'
import { type MotionValue, motion, useSpring, useTransform, motionValue, type Transition } from "framer-motion";
// --- CHANGE END ---

// --- CHANGE START ---
// Apply the imported 'Transition' type to your TRANSITION constant
const TRANSITION: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 18,
  mass: 0.3,
};
// --- CHANGE END ---

function Digit({ value, place }: { value: number; place: number }) {
  const valueRoundedToPlace = Math.floor(value / place) % 10;
  const initial = motionValue(valueRoundedToPlace);
  const animatedValue = useSpring(initial, TRANSITION);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div className="relative inline-block w-[1ch] overflow-x-visible overflow-y-clip leading-none tabular-nums">
      <div className="invisible">0</div>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </div>
  );
}

function Number({ mv, number }: { mv: MotionValue<number>; number: number }) {
  const uniqueId = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  const y = useTransform(mv, (latest) => {
    if (!height) return 0;
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  // don't render the animated number until we know the height
  if (!height) {
    return (
      <span ref={ref} className="invisible absolute">
        {number}
      </span>
    );
  }

  return (
    <motion.span
      style={{ y }}
      layoutId={`${uniqueId}-${number}`}
      className="absolute inset-0 flex items-center justify-center"
      transition={TRANSITION}
      ref={ref}
    >
      {number}
    </motion.span>
  );
}

type SlidingNumberProps = {
  value: number;
  padStart?: boolean;
  decimalSeparator?: string;
  className?: string;
}

export function SlidingNumber({ value, padStart = false, decimalSeparator = ".", className = "" }: SlidingNumberProps) {
  const absValue = Math.abs(value);
  const [integerPart, decimalPart] = absValue.toString().split(".");
  // Fix: Use parseInt instead of Number.parseInt
  const integerValue = parseInt(integerPart, 10);
  const paddedInteger = padStart && integerValue < 10 ? `0${integerPart}` : integerPart;
  const integerDigits = paddedInteger.split("");
  const integerPlaces = integerDigits.map((_, i) => Math.pow(10, integerDigits.length - i - 1));

  return (
    <div className={`flex items-center ${className}`}>
      {value < 0 && "-"}
      {integerDigits.map((_, index) => (
        <Digit key={`pos-${integerPlaces[index]}`} value={integerValue} place={integerPlaces[index]} />
      ))}
      {decimalPart && (
        <>
          <span>{decimalSeparator}</span>
          {decimalPart.split("").map((_, index) => (
            <Digit
              key={`decimal-${index}`}
              // Fix: Use parseInt instead of Number.parseInt
              value={parseInt(decimalPart, 10)}
              place={Math.pow(10, decimalPart.length - index - 1)}
            />
          ))}
        </>
      )}
    </div>
  );
}