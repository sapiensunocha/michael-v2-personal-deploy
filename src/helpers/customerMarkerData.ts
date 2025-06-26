import { MdFlood } from "react-icons/md";
import { GiDesert, GiVolcano, GiTwister } from "react-icons/gi";
import { RiEarthquakeFill } from "react-icons/ri";
import { BsFire } from "react-icons/bs";
import { IoIosWarning } from "react-icons/io";

const disasterConfig = {
  volcanoes: {
    icon: GiVolcano,
    color: "#e03e1f",
    label: "Volcano",
  },
  wildfires: {
    icon: BsFire,
    color: "#e06f1f",
    label: "Wildfire",
  },
  floods: {
    icon: MdFlood,
    color: "#57fae4",
    label: "Flood",
  },
  drought: {
    icon: GiDesert,
    color: "#fcff62",
    label: "Drought",
  },
  earthquakes: {
    icon: RiEarthquakeFill,
    color: "#ff7575",
    label: "Earthquake",
  },
  cyclones: {
    icon: GiTwister,
    color: "#a17c4b",
    label: "Cyclone",
  },

  default: {
    icon: IoIosWarning,
    color: "#76ff76",
    label: "Event",
  },
};

export default disasterConfig;
