"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImMap } from "react-icons/im";
import { RiChatSmileAiFill } from "react-icons/ri";
import All from "../../../../assets/icons/all.png";
import tropicalCyclone from "../../../../assets/icons/cyclone1.png";
import droughtIcon from "../../../../assets/icons/drought1.png";
import earthquakeIcon from "../../../../assets/icons/earthquake1.png";
import floodIcon from "../../../../assets/icons/flood1.png";
import naturalIcon from "../../../../assets/icons/natural1.png";
import politicalIcon from "../../../../assets/icons/politic1.png";
import strategicIcon from "../../../../assets/icons/strat1.png";
import technologicalIcon from "../../../../assets/icons/tech1.png";
import wildFire from "../../../../assets/icons/wildfire.png";
import {
  useConflictData,
  useConflictDevelopmentData,
  useDroughtData,
  useEarthquakesData,
  useFloodData,
  useTechnologicalData,
  useTropicalCycloneData,
  useVolcanoesData,
  useWildfiresData,
} from "../../../helpers/mapFooterData";
import useDisasterStore from "../../../zustand/features/disasterDataStore";
import ChatAIFloater from "../../features/ChatFloater";
import MapTypeModal from "../MapTypeModal";
import Translation from "@/components/Translation";

interface Conflict {
  id: string;
  title: string;
  location: {
    lat: number;
    lng: number;
  };
  severity: string;
  type: string;
  affectedArea: string;
  date: string;
  description: string;
}
interface CategorySelectPayload {
  type: string;
  data?: Conflict[];
  categoryId?: string;
}
interface MapFooterProps {
  onMapTypeChange: (mapType: string) => void;
  onCategorySelect: (payload: CategorySelectPayload) => void;
}

const MapFooter = ({ onMapTypeChange, onCategorySelect }: MapFooterProps) => {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") ?? "all";

  const [chatOpen, setChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapTypeButtonRef = useRef(null);
  const { setDisasterData } = useDisasterStore();

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const { data: conflictData, isFetching: conflictLoading } = useConflictData();
  const { data: volcanoesData, isFetching: volcanoesLoading } = useVolcanoesData();
  const { data: wildfiresData, isFetching: wildfiresLoading } = useWildfiresData();
  const { data: earthquakesData, isFetching: earthquakesLoading } = useEarthquakesData();
  const { data: droughtData, isFetching: droughtLoading } = useDroughtData();
  const { data: floodData, isFetching: floodLoading } = useFloodData();
  const { data: technologicalData, isFetching: technologicalLoading } = useTechnologicalData();
  const { data: tropicalCycloneData, isFetching: tropicalCycloneLoading } = useTropicalCycloneData();

  const {
    data: conflictDevelopmentData,
    isLoading: conflictDevelopmentLoading,
  } = useConflictDevelopmentData();

  const allData = useMemo(() => {
    const combinedData = [
      conflictData,
      volcanoesData,
      wildfiresData,
      earthquakesData,
      droughtData,
      floodData,
      conflictDevelopmentData,
      technologicalData,
      tropicalCycloneData,
    ]
      .flat()
      .filter(Boolean);

    const uniqueMap = new Map(combinedData.map((item) => [item.id, item]));

    return Array.from(uniqueMap.values());
  }, [
    conflictData,
    volcanoesData,
    wildfiresData,
    earthquakesData,
    droughtData,
    floodData,
    conflictDevelopmentData,
    technologicalData,
    tropicalCycloneData,
  ]);

  const loading =
    conflictLoading ||
    volcanoesLoading ||
    wildfiresLoading ||
    earthquakesLoading ||
    droughtLoading ||
    floodLoading ||
    technologicalLoading ||
    conflictDevelopmentLoading ||
    tropicalCycloneLoading;

  useEffect(() => {
    if (!loading && !category) {
      onCategorySelect({
        type: "all",
        data: allData.flat().filter(Boolean),
      });
    } else {
      const button = buttonDisasters.find((b) => b.id === category);
      onCategorySelect({
        type: category || "all",
        data: button?.transformedData || [],
      });
    }
  }, [loading, category]);

  const buttonDisasters = useMemo(
    () => [
      {
        name: "All",
        img: All,
        id: "all",
        transformedData: allData.flat().filter(Boolean) || [],
      },
      {
        name: "Volcanoes",
        img: naturalIcon,
        id: "VO",
        transformedData: volcanoesData || [],
      },
      {
        name: "Wildfires",
        img: wildFire,
        id: "WF",
        transformedData: wildfiresData || [],
      },
      {
        name: "Drought",
        img: droughtIcon,
        id: "DR",
        transformedData: droughtData || [],
      },
      {
        name: "Earthquake",
        img: earthquakeIcon,
        id: "EQ",
        transformedData: earthquakesData || [],
      },
      {
        name: "Flood",
        img: floodIcon,
        id: "FL",
        transformedData: floodData || [],
      },
      {
        name: "Conflicts",
        img: politicalIcon,
        id: "conflicts",
        transformedData: conflictData || [],
      },
      {
        name: "Development",
        img: strategicIcon,
        id: "developments",
        transformedData: conflictDevelopmentData || [],
      },
      {
        name: "Technological",
        img: technologicalIcon,
        id: "TE",
        transformedData: technologicalData || [],
      },
      {
        name: "Cyclones",
        img: tropicalCyclone,
        id: "TC",
        transformedData: tropicalCycloneData || [],
      },
    ],
    [
      allData,
      volcanoesData,
      wildfiresData,
      droughtData,
      earthquakesData,
      floodData,
      conflictData,
      conflictDevelopmentData,
      technologicalData,
      tropicalCycloneData,
    ],
  );

  const getTransformedDataForCategory = useCallback(
    (button: (typeof buttonDisasters)[0]) => {
      const transformedData = button.transformedData;
      return transformedData;
    },
    [],
  );

  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    const button = buttonDisasters.find((b) => b.id === categoryId);

    router.push(`/map?category=${categoryId}`);

    if (!button) return;

    const transformedData = getTransformedDataForCategory(button);

    if (categoryId === "all") {
      const allTransformedData = allData.flat().filter(Boolean);
      onCategorySelect({ type: "all", data: allTransformedData });
    } else {
      onCategorySelect({ type: categoryId, data: transformedData });
    }
  };

  const handleMapTypeSelect = (mapType: string) => {
    if (onMapTypeChange) onMapTypeChange(mapType);
  };

  return (
    <div className="fixed bottom-0 w-full">
      <div className="w-fit mx-auto md:px-4 flex items-center justify-center">
        <div className="flex md:gap-4 gap-2 mx-2 my-10">
          <button
            onClick={toggleChat}
            className="flex items-center justify-center bg-whitemd:h-[50px] md:w-[50px] h-8 w-8 rounded-full border-gray-300 shadow-lg hover:text-red-700 transition-all duration-400"
          >
            <RiChatSmileAiFill />
          </button>

          <button
            ref={mapTypeButtonRef}
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="flex items-center justify-center bg-whitemd:h-[50px] md:w-[50px] h-8 w-8 rounded-full border-gray-300 shadow-lg hover:text-red-700 transition-all duration-400"
          >
            <ImMap />
          </button>
        </div>

        <div className="flex gap-2 md:my-10 my-0 md:w-full lg:overflow-visible w-4/11 overflow-x-scroll">
          {buttonDisasters.map((button) => (
            <button
              key={button.id}
              disabled={loading}
              onClick={() => handleCategoryClick(button.id)}
              className={cn(
                "flex items-center justify-center py-1 text-sm font-light gap-2 px-2 bg-slate-50 border border-gray-300 rounded-full shadow-lg hover:bg-slate-300 transition-all duration-400",
                button.id === category && "bg-red-400 text-white",
              )}
            >
              <Image
                className="md:h-[1.5rem] md:w-[1.5rem] h-6 w-6"
                src={button.img}
                alt={button.name}
              />
              <span className="flex items-center gap-x-2">
                <span className="text-[12px] font-semibold">{button.name}</span>
                {loading && (
                  <span>
                    <Loader2 size={12} className="animate-spin" />
                  </span>
                )}
              </span>
            </button>
          ))}
          <div className="md:block hidden">
            <Translation />
          </div>
        </div>

        <MapTypeModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onSelectMapType={handleMapTypeSelect}
          buttonRef={mapTypeButtonRef}
        />
        <ChatAIFloater chatOpen={chatOpen} />
      </div>
    </div>
  );
};

export default MapFooter;