import * as Dialog from "@radix-ui/react-dialog";
import { FaThLarge } from "react-icons/fa";
import Link from "next/link";
import { GiLifeBar } from "react-icons/gi";
import { FaHandHoldingHeart } from "react-icons/fa";

export default function AppsModal({ isOpen, onClose }:any) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed   inset-0 bg-black opacity-30" />
      <Dialog.Content className="fixed z-50 top-0 mt-44  -right-24 transform -translate-x-1/2 -translate-y-1/2 max-w-md p-6 bg-white rounded-lg shadow-xl">
        <Dialog.Title className="text-lg font-bold">Apps</Dialog.Title>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Link href={"/dashboard"} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all">
            <FaThLarge className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href={"https://life-line-green.vercel.app"} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all">
            <GiLifeBar className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium">Life Line</span>
          </Link>
          <Link href={"https://wdc-donation.vercel.app"} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all">
            <FaHandHoldingHeart className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium">Investment</span>
          </Link>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}