import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { RiDirectionFill } from "react-icons/ri";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useDirectionClickedStore from "@/zustand/features/isDirectionClickedStore";
// import useDestinationLocationStore from "@/zustand/features/destinationDataStore";

const LocationSearch = ({ onSelectLocation, isLoaded }: any) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    initOnMount: isLoaded,
  });
  const { isDirectionClicked, setIsDirectionClicked } =
    useDirectionClickedStore();
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    onSelectLocation({ lat, lng });
  };

  function handleSearchDestination() {
    setIsDirectionClicked(!isDirectionClicked);
  }

  return (
    <div className="relative z-50 flex items-center mt-3 ml-4">
      <div className="flex relative items-center bg-white/30 backdrop-blur-sm rounded-full shadow-lg py-2  pl-2">
        {!isDirectionClicked && (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready || !isLoaded} // Ensure the input is only enabled when the API is loaded
            placeholder="Search for a city or country"
            className="w-64 px-4 py-1 rounded-full focus:outline-hidden focus:ring-2 focus:ring-red-500"
          />
        )}
        <button
          onClick={() => {
            setIsDirectionClicked(false);
          }}
        >
          <BiSearch
            size={32}
            className="p-2 text-white bg-red-700 rounded-full cursor-pointer ml-2 hover:bg-gray-800 transition-colors"
          />
        </button>
        <button onClick={handleSearchDestination}>
          <RiDirectionFill className="text-yellow-500 rounded-full- md:block hidden cursor-pointer mx-2 text-3xl hover:text-yellow-400 transition-colors" />
        </button>
        {isDirectionClicked && (
          <div>
            <input
              type="text"
              placeholder="Search Destination"
              className="w-64 px-4 py-1 rounded-full focus:outline-hidden focus:ring-2 focus:ring-red-500"
              onChange={(e) => setValue(e.target.value)}
              disabled={!ready || !isLoaded}
            />
          </div>
        )}
      </div>

      {status === "OK" && (
        <div className="absolute mt-8 w-full top-4">
          <ul className="py-1 bg-white w-11/12 mx-auto rounded-sm mt-1">
            {data.map(({ description, place_id }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="px-4 py-1 bg-white rounded-sm cursor-pointer hover:bg-gray-100 transition-colors font-semibold-"
              >
                {description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
