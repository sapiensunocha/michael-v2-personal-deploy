import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDrawer from "../CustomDrawer";
// import type AppDispatch from "../../../redux/store";
import { sendWeatherAlertRequest } from "../../../redux/services/prediction";

const AlertDrawer = ({ isOpen, onClose }: any) => {
  const dispatch = useDispatch<any>();
  const { loading, error, data }: any = useSelector(
    (state: any) => state.prediction,
  );

  const [email, setEmail] = useState("");
  const [cities, setCities] = useState("");

  const handleSubmit = () => {
    // const citiesArray = cities.split(",").map((city) => city.trim());
    dispatch(sendWeatherAlertRequest());
  };

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Send Weather Alerts"
      width="w-2/6"
    >
      <div className="p-4 bg-gray-50 rounded-md shadow-md">
        <h2 className="text-red-700 font-semibold mb-4">Enter Alert Details</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Recipient Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient's email"
            className="block w-full bg-red-50 border border-red-700 text-red-700 font-medium rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 hover:bg-red-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Cities (comma-separated)
          </label>
          <input
            type="text"
            value={cities}
            onChange={(e) => setCities(e.target.value)}
            placeholder="Enter cities (e.g., City1, City2)"
            className="block w-full bg-red-50 border border-red-700 text-red-700 font-medium rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 hover:bg-red-100"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-red-700 text-white font-medium rounded-md p-3 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Alert"}
        </button>
      </div>

      <div className="mt-6">
        {data && (
          <div className="bg-green-50 border border-green-500 text-green-700 rounded-md p-4">
            <h3 className="font-bold">Success!</h3>
            <p>Alerts sent successfully!</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-500 text-red-700 rounded-md p-4">
            <h3 className="font-bold">Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </CustomDrawer>
  );
};

export default AlertDrawer;
