"use client";

import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-michael_red_100 mb-4">
          Success!
        </h1>
        <p className="text-gray-700 mb-8">
          Thank you for contributing to Michael&apos;s effort to save the world!
        </p>
        <button
          onClick={() => router.push("/upload")}
          className="bg-michael_red_100 text-white py-2 px-6 rounded-md
            hover:bg-michael_red_100/90 focus:outline-none focus:ring-2 
            focus:ring-michael_red_100 focus:ring-offset-2 transition-colors"
        >
          Back to Upload
        </button>
      </div>
    </div>
  );
}
