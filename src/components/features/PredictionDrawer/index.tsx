import CustomDrawer from "../CustomDrawer";

const PredictionDrawer = ({
  isOpen,
  onClose,
  index,
  eventType,
  title,
  severity,
  region,
  description,
  location,
}: any) => {
  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="PREDICTION ALERTS"
      width="md:w-2/6 w-5/6"
    >
        <div>
          <div className="space-y-4">
            <div
              key={index}
              className="p-4 border border-red-700 bg-red-50 rounded-md shadow-sm"
            >
              <h2 className="ont-bold text-red-700 mb-4 text-xl">
                <span className="text-gray-800 font-extrabold">{title.toUpperCase()}</span>
              </h2>
              <p className="text-gray-700 mt-2 mb-4">
                <span className="font-semibold"></span> {description}
              </p>
              <p className="text-gray-700 mt-2">
                <span className="font-semibold">type:</span> {eventType}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Severity:</span> {severity}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Areas Affected:</span> {region}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">location:</span> {location}
              </p>
            </div>
          </div>
        </div>
    </CustomDrawer>
  );
};

export default PredictionDrawer;
