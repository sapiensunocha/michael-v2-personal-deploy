"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillApple } from "react-icons/ai";
import { TiVendorAndroid } from "react-icons/ti";
import bgImage from "../../../assets/images/welcomeImg.jpeg";
import Navbar1 from "@/components/Navbar/Navbar1";
import Link from "next/link";

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section>
      <div
        className="relative bg-cover bg-center h-[100vh]"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <div className="absolute inset-0 bg-michael_dark_red_50">
          <Navbar1 />
          <div className="max-w-[90rem] w-full mx-auto">
            <div className="flex flex-col justify-center text-center items-center h-[80vh] lg:h-[100vh] gap-6 lg:gap-8">
              <h1 className="font-black text-white text-4xl lg:text-6xl">
                Your Trusted Disaster Companion
              </h1>
              <p className="w-[90%] lg:w-[60%] text-white text-[12px] lg:text-[17px]">
                Our mission is to save lives, minimize losses, and foster
                resilience by connecting you with cutting-edge tools and
                reliable support during life&apos;s most challenging moments.
              </p>
              <hr className="border border-white/50 w-[70%] lg:w-[40%]" />
              <button
                onClick={() => navigate.push("/signin")}
                className=" text-michael_black_2 bg-michael_gray_2 rounded-3xl py-2 px-3 font-semibold hover:text-michael_gray_3 text-[12px] lg:text-[15px]"
              >
                Try it Now
              </button>
              <div className="flex gap-4">
                <Link
                  href="https://github.com/pwa-builder/CloudAPK/blob/master/Next-steps-unsigned.md"
                  target="_blank"
                  className="bg-white py-2 px-3 flex items-center text-michael_black_1 gap-1 font-semibold rounded-3xl text-[12px] lg:text-[13px] hover:text-michael_red_50"
                >
                  <TiVendorAndroid className="text-xl" />
                  Download App
                </Link>
                <Link
                  href="https://docs.pwabuilder.com/#/builder/app-store?id=building-your-app"
                  target="_blank"
                  className="bg-michael_red_100 py-2 px-3 flex items-center text-white gap-1 font-semibold rounded-3xl text-[12px] lg:text-[13px] hover:text-michael_gray_2"
                >
                  <AiFillApple className="text-xl" />
                  Download iOS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-michael_dark_red_75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md lg:w-[50%] lg:max-w-lg">
            <h2 className="text-xl lg:text-2xl font-bold text-center mb-4">
              Coming Soon
            </h2>
            <p className="text-center text-gray-600 text-sm lg:text-base">
              This is not yet available. Stay tuned!
            </p>
            <div className="flex justify-center mt-6">
              <button
                className="bg-michael_red_100 hover:bg-michael_red_200 text-white py-2 px-4 rounded-md lg:py-3 lg:px-6"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
