"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  BiHelpCircle,
  // BiGridAlt, 
  BiMenu,
  BiX,
} from "react-icons/bi";
// import { CiSettings, CiUser } from "react-icons/ci";
import { FiMap } from "react-icons/fi";
import { BsCollectionPlayFill } from "react-icons/bs";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdNotificationsNone } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
// Import the icon image
import michaelicon from "../../../assets/icons/michaelicon.png";
// Import the hook and logout action
import { useFetchCurrentUserProfile } from "@/hooks/useFetchCurrentUserProfile";
import { logout } from "@/lib/session";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState } from "react";
import { Rss } from "lucide-react";

// Main Navigation Items
const mainNavItems = [
  {
    title: "Map",
    url: "/map",
    icon: FiMap,
  },
  {
    title: "Videos",
    url: "/videos",
    icon: BsCollectionPlayFill,
  },
  {
    title: "Upload",
    url: "/upload",
    icon: IoCloudUploadOutline,
  },
  {
    title: " Disaster Trends",
    url: "/feedback",
    icon: Rss,
  },
];

// Interface for AppModals props
interface AppModalsProps {
  isAboutModalOpen: boolean;
  setIsAboutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmAbout: () => void;
  handleConfirmLogout: () => void;
}

// Modals Component
const AppModals = ({ 
  isAboutModalOpen, 
  setIsAboutModalOpen, 
  isLogoutModalOpen, 
  setIsLogoutModalOpen,
  handleConfirmAbout,
  handleConfirmLogout,
}: AppModalsProps) => {
  return (
    <>
      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <FiLogOut size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-4">Logout Confirmation</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <BiHelpCircle size={48} className="mx-auto text-gray-500 mb-4" />
              <h2 className="text-xl font-semibold mb-4">Leave Micheal App?</h2>
              <p className="text-gray-600 mb-6">You are about to visit the World Disaster Center website. Do you wish to continue?</p>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setIsAboutModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Stay on Micheal
                </button>
                <button 
                  onClick={handleConfirmAbout}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Continue to WDC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Sidebar Component
const AppSidebar = () => {
  const path = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useFetchCurrentUserProfile();
  const queryClient = useQueryClient();
  const [, logoutAction] = useActionState(logout, undefined);

  // State for local storage user info
  const [localStorageUser, setLocalStorageUser] = useState({
    firstName: "",
    email: "",
  });

  // Effect to fetch user info from local storage
  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName");
    const storedEmail = localStorage.getItem("email");

    setLocalStorageUser({
      firstName: storedFirstName ? JSON.parse(storedFirstName) : "Michael AI",
      email: storedEmail ? JSON.parse(storedEmail) : "michael@gmail.com",
    });
  }, []);

  const handleAboutClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setIsAboutModalOpen(true);
  };

  const handleConfirmAbout = () => {
    window.open("https://www.worlddisastercenter.org/cases/Michael", "_blank", "noopener,noreferrer");
    setIsAboutModalOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    // Clear local storage user data on logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfilePicture");

    queryClient.removeQueries({ queryKey: ["user"] });
    startTransition(() => {
      logoutAction();
    });
  };

  // Default user information prioritizing API data, then local storage
  const displayName = user?.firstName || localStorageUser.firstName;
  const displayEmail = user?.email || localStorageUser.email;

  // Render Navigation Items
  interface NavItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ size: number }>;
    external?: boolean;
  }

  const renderNavItems = (items: NavItem[], section: string): React.ReactNode => (
    <>
      <div className="text-xs text-gray-500 uppercase font-medium px-3 mb-2">{section}</div>
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          onClick={() => setIsMobileSidebarOpen(false)}
          className={cn(
            "flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg",
            path === item.url ? "bg-gray-200" : "",
          )}
        >
          <item.icon size={20} />
          <span>{item.title}</span>
        </Link>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? <BiX size={24} /> : <BiMenu size={24} />}
      </button>

      {/* Sidebar for Desktop and Mobile */}
      <div 
        className={cn(
          "w-64 bg-white border-r h-screen flex flex-col fixed md:static z-40",
          "transform transition-transform duration-300 ease-in-out",
          isMobileSidebarOpen 
            ? "translate-x-0" 
            : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <Image
              className="h-[47px] w-[47px] flex justify-start cursor-pointer hover:shadow-2xl transition-all duration-500"
              src={michaelicon}
              alt="Michael App Logo"
            />
          </div>

          {/* Main Navigation */}
          <nav className="space-y-2">
            {renderNavItems(mainNavItems, "Features")}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="mt-auto p-4 border-t">
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full flex items-center gap-3 p-3 bg-gray-100 rounded-lg"
          >
            <div className="flex-1 text-left">
              <div className="font-medium">
                {displayName}
              </div>
              <div className="text-xs text-gray-500">
                {displayEmail}
              </div>
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="mt-2 bg-white shadow-lg rounded-lg">
              <ul className="py-1">
                {/* <li>
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-3 p-3 hover:bg-gray-100"
                  >
                    <CiUser size={20} />
                    <span>Profile</span>
                  </Link>
                </li> */}
                {/* <li>
                  <Link 
                    href="/settings" 
                    className="flex items-center gap-3 p-3 hover:bg-gray-100"
                  >
                    <CiSettings size={20} />
                    <span>Settings</span>
                  </Link>
                </li> */}
                <li>
                  <Link 
                    href="/notifications" 
                    className="flex items-center gap-3 p-3 hover:bg-gray-100"
                  >
                    <MdNotificationsNone size={20} />
                    <span>Notification</span>
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleAboutClick}
                    className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-100"
                  >
                    <BiHelpCircle size={20} />
                    <span>About Micheal</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleLogoutClick}
                    className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-100 text-red-600"
                  >
                    <FiLogOut size={20} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Modals */}
      <AppModals 
        isAboutModalOpen={isAboutModalOpen}
        setIsAboutModalOpen={setIsAboutModalOpen}
        isLogoutModalOpen={isLogoutModalOpen}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
        handleConfirmAbout={handleConfirmAbout}
        handleConfirmLogout={handleConfirmLogout}
      />
    </>
  );
};

// Container Component
export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto ml-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}