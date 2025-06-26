"use client";
import FilterModal from "@/components/FilterModal";
import LocationSearch from "@/components/Map/MapHeader/LocationSearch";
import NotificationModal from "@/components/notificationModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFetchCurrentUserProfile } from "@/hooks/useFetchCurrentUserProfile";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsCollectionPlayFill, BsSliders } from "react-icons/bs";
import { CiHome } from "react-icons/ci";
import { FaBars, FaGripLinesVertical } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { HiBellAlert } from "react-icons/hi2";
import { IoClose, IoCloudUploadOutline, IoSearch } from "react-icons/io5";
import { PiLineVerticalLight } from "react-icons/pi";
import { TbArrowForwardUp } from "react-icons/tb";
import michaelicon from "../../../../assets/icons/michaelicon.png";


const MapHeader = ({
  mapIsLoading,
  setLocation,
}: {
  mapIsLoading: boolean;
  setLocation: any;
}) => {
  const { user, isLoading } = useFetchCurrentUserProfile();

  console.log("user", user);
  const [showDot, setShowDot] = useState(true);
  const navigate = useRouter();
  const cachedLocation: any = localStorage.getItem("userLocation");
  const parsedLocation = cachedLocation ? JSON.parse(cachedLocation) : null;
  const username: any = localStorage.getItem("user-name");
  const number: any = localStorage.getItem("phone-number");

  const { mutate, isPending } = useUpdateUserProfile();

  const latitude = parsedLocation?.latitude;
  const longitude = parsedLocation?.longitude;

  console.log("user", user?.userLocations);

  // useEffect(() => {
  //   if (user && user.location.latitude !== latitude) {
  //     mutate({
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       location: {
  //         latitude: parsedLocation.latitude,
  //         longitude: parsedLocation.longitude,
  //         locationType: "current location",
  //         label: "current location",
  //         address: "current location",
  //       },
  //     });
  //   }
  // }, [user]);

  const handleSelectLocation = (coordinates: any) => {
    setLocation({ lat: coordinates.lat, lng: coordinates.lng });
    console.log("Selected Location:", coordinates);
  };

  // TODO: we are no longer sending message from the frontend, we are sending it from the backend
  // TODO: remove this function
  const handleSendMessage = () => {
    if (!number || !username) {
      console.warn("⚠️ Missing required user information. Message not sent.");
      return;
    }

    // sendMessage(number, username, latitude, longitude)
    //   .then((response) => {
    //     console.log(
    //       response.success
    //         ? `✅ ${response.message}`
    //         : `❌ ${response.message}`,
    //     );
    //   })
    //   .catch((error) => {
    //     console.error("❌ Failed to send message:", error);
    //   });
  };

  const handleCloseDisasterEmailAlterModal = () => {
    setShowDot(false);
  };
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <>
        <NotificationModal />
        <div className="flex w-[95%] items-center justify-between absolute left-1/2 transform -translate-x-1/2 my-10 z-10 text-black">
          <div className="flex items-center gap-4">
            <Image
              className="h-[47px] w-[47px] cursor-pointer hover:shadow-2xl transition-all duration-500"
              src={michaelicon}
              alt="icon"
            />
            <FaGripLinesVertical />
            <div className="hidden md:flex px-auto backdrop-blur-2xl bg-white/10 rounded-full shadow-xl">
              <button className="flex items-center justify-center w-[40px] h-[40px] m-2 bg-gray-50  rounded-full border shadow-lg cursor-pointer hover:shadow-xl hover:bg-gray-200 transition-all duration-500">
                <CiHome className="h-[20px] w-[20px] hover:h-[23px] hover:w-[23px] transition-all duration-200" />
              </button>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center justify-center w-[40px] h-[40px] m-2 bg-gray-50 rounded-full border shadow-lg cursor-pointer hover:shadow-xl hover:bg-gray-200 transition-all duration-500"
              >
                <BsSliders className="h-[20px] w-[20px] hover:h-[23px] hover:w-[23px] transition-all duration-200" />
              </button>
              <Link
                href="/upload"
                className="flex items-center justify-center w-[40px] h-[40px] m-2 bg-gray-50 rounded-full border shadow-lg cursor-pointer hover:shadow-xl hover:bg-gray-200 transition-all duration-500"
              >
                <IoCloudUploadOutline className="h-[20px] w-[20px] hover:h-[23px] hover:w-[23px] transition-all duration-200" />
              </Link>
              <Link
                href="/videos"
                className="flex items-center justify-center w-[40px] h-[40px] m-2 bg-gray-50 rounded-full border shadow-lg cursor-pointer hover:shadow-xl hover:bg-gray-200 transition-all duration-500"
              >
                <BsCollectionPlayFill className="h-[20px] w-[20px] hover:h-[23px] hover:w-[23px] transition-all duration-200" />
              </Link>
              <Popover onOpenChange={() => setShowDot(false)}>
                <PopoverTrigger asChild>
                  <button className="relative flex items-center justify-center w-[40px] h-[40px] m-2 bg-gray-50 rounded-full border shadow-lg cursor-pointer hover:shadow-xl hover:bg-gray-200 transition-all duration-500">
                    {showDot && (
                      <GoDotFill className="absolute top-1 right-1 text-red-700" />
                    )}
                    <HiBellAlert className="h-[20px] w-[20px] hover:h-[23px] hover:w-[23px] transition-all duration-200 z-20" />
                  </button>
                </PopoverTrigger>
              </Popover>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex- items-center relative">
              <input
                type="text"
                className="w-[316px] h-[38px] rounded-full p-5 text-sm border border-gray-300 shadow-lg focus:outline-none"
                placeholder="Search your location"
              />
              <div className="flex items-center justify-center gap-2 absolute right-4">
                <IoSearch className="w-[20px] h-[20px] text-gray-600 hover:text-gray-800 cursor-pointer" />
                <PiLineVerticalLight className="h-[30px] text-gray-600 hover:text-gray-800" />
                <FaLocationDot className="w-[20px] h-[20px] text-gray-600 cursor-pointer" />
                <TbArrowForwardUp className=" bg-[red] hover:bg-red-500 text-white w-[15px] h-[15px] cursor-pointer transform rotate-45 flex items-center justify-center" />
              </div>
            </div>
            <LocationSearch
              onSelectLocation={handleSelectLocation}
              isLoaded={mapIsLoading}
            />
            <Link href="/u/profile" className="mt-3">
              <Avatar className="hidden md:block h-[40px] w-[40px] bg-white border border-gray-300 shadow-lg hover:bg-gray-100 cursor-pointer rounded-full transition-all duration-300">
                <AvatarImage
                  src="/placeholder-avatar.jpg"
                  alt={user?.firstName}
                />
                <AvatarFallback className="uppercase">
                  {isLoading ? (
                    <Loader2 className="h-[20px] w-[20px] animate-spin" />
                  ) : (
                    user?.firstName.charAt(0)
                  )}
                </AvatarFallback>
              </Avatar>
            </Link>

            <button
              className="md:hidden text-2xl"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              {!isMobileMenuOpen ? <FaBars /> : <IoClose />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="flex flex-col gap-4 items-center w-full h-[100vh] bg-white shadow-lg p-4 md:hidden pt-32">
            <button
              onClick={() => navigate.push("/")}
              className="border bg-red-100 hover:bg-red-500 w-full gap-6 flex items-center justify-center p-2 rounded-lg"
            >
              <CiHome className="text-2xl" />
              <span className="w-4/12 text-start ml-6">Home</span>
            </button>
            <button
              onClick={() => {
                setIsFilterModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="border bg-red-100 hover:bg-red-500 w-full gap-6 flex items-center justify-center p-2 rounded-lg"
            >
              <BsSliders className="text-2xl" />
              <span className="w-4/12 text-start ml-6">Filter</span>
            </button>
            <button
              onClick={() => navigate.push("/videos")}
              className="border bg-red-100 hover:bg-red-500 w-full gap-6 flex items-center justify-center p-2 rounded-lg"
            >
              <BsCollectionPlayFill className="text-2xl" />
              <span className="w-4/12 text-start ml-6">Videos</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
              className="border bg-red-100 hover:bg-red-500 w-full gap-6 flex items-center justify-center p-2 rounded-lg"
            >
              {showDot && (
                <GoDotFill className="absolute top-1 right-1 text-red-700" />
              )}
              <HiBellAlert className="h-[20px] w-[20px] hover:h-[23px] hover:w-[23px] transition-all duration-200 z-20" />
              <span className="w-4/12 text-start ml-6">Enable Alerts</span>
            </button>
          </div>
        )}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
        />
      </>
    </>
  );
};

export default MapHeader;
