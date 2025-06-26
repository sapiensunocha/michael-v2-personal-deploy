"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import logoMichael from "../../assets/icons/logoMichael.png";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const navigate = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        return Math.min(oldProgress + 10, 100);
      });
    }, 300);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    if (progress === 100) {
      // --- MODIFICATION HERE (Changed from /dashboard to /map) ---
      // Redirect directly to /map after the splash screen.
      navigate.push("/map");
    }
  }, [progress, navigate]);

  return (
    <div className="bg-michael_red_100 h-[100vh] flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center gap-5 lg:gap-10 flex-grow">
        <Image src={logoMichael} alt="Logo Michael" width={100} height={100} />
        <div className="w-[20%] h-2 border border-michael_gray_2 rounded-lg">
          <div
            className="h-full rounded-lg bg-gray-300 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <p className="text-center text-[12px] lg:text-[16px] text-white/50 mb-5">
        Powered by <br /> World Disaster Center
      </p>
    </div>
  );
}