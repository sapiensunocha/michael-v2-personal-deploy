"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const transitionBase = {
  duration: 0.6,
  ease: [0.42, 0, 0.58, 1] as const, // Valid cubic-bezier in TS
};

export default function NotFound() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.8,
        ease: [0.42, 0, 0.58, 1] as const,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: transitionBase,
    },
  };

  const imageVariants = {
    hidden: { scale: 0.85, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        ...transitionBase,
        opacity: { duration: 1 },
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      y: -3,
      transition: { duration: 0.3, ease: [0.42, 0, 0.58, 1] as const },
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.15, ease: [0.42, 0, 0.58, 1] as const },
    },
  };

  const MainContent = () => (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
      <div className="w-full lg:w-1/2 flex justify-center">
        {isClient ? (
          <motion.div
            variants={imageVariants}
            className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[500px]"
          >
            <Image
              src="/icons/notfound.svg"
              alt="Warning - Page Not Found"
              width={500}
              height={500}
              className="w-full h-auto object-contain"
              priority
            />
          </motion.div>
        ) : (
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[500px]">
            <Image
              src="/icons/notfound.svg"
              alt="Warning - Page Not Found"
              width={500}
              height={500}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 md:space-y-6">
        {isClient ? (
          <>
            <motion.div
              variants={itemVariants}
              className="inline-block py-1.5 px-4 text-xs sm:text-sm bg-michael_red_100 text-white font-medium rounded-full"
            >
              Error 404 - Location Not Found
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-michael_black_1 leading-tight"
            >
              Page not found
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-michael_gray_1 max-w-md mx-auto lg:mx-0"
            >
              The requested location or resource cannot be found. Please return to the command center for accurate disaster updates and information.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-2 md:pt-4">
              <motion.div
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-full shadow-lg text-white bg-gray-700 hover:bg-michael_dark_red_75 transition-colors duration-300 ease-in-out w-full sm:w-auto"
                >
                  <span>Return to Command Center</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 ml-2 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </>
        ) : (
          <>
            <div className="inline-block py-1.5 px-4 text-xs sm:text-sm bg-michael_red_100 text-white font-medium rounded-full">
              Error 404 - Location Not Found
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-michael_black_1 leading-tight">
              Area Unavailable
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-michael_gray_1 max-w-md mx-auto lg:mx-0">
              The requested location or resource cannot be found. Please return to the command center for accurate disaster updates and information.
            </p>

            <div className="pt-2 md:pt-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-full shadow-lg text-white bg-gray-700 hover:bg-michael_dark_red_75 transition-colors duration-300 ease-in-out w-full sm:w-auto"
              >
                <span>Return to Command Center</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 ml-2 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-michael_bg flex items-center justify-center p-4 relative overflow-hidden">
      {isClient ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl w-full py-6 md:py-8 lg:py-12 space-y-6 md:space-y-8 z-10 relative"
        >
          <MainContent />
        </motion.div>
      ) : (
        <div className="max-w-7xl w-full py-6 md:py-8 lg:py-12 space-y-6 md:space-y-8 z-10 relative">
          <MainContent />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-michael_red_10 to-white opacity-50 z-0"></div>
    </div>
  );
}