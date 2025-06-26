import { motion } from "framer-motion";

const DisasterEmailAlertModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-3 items-start">
        <h2 className="font-bold text-lg">Notifications (1)</h2>
        <div className="p-3 bg-red-100/20 rounded-lg w-full">
          <p className="text-sm text-gray-700">
            Check your email for details on recent disasters in your area—if you
            haven’t already.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DisasterEmailAlertModal;
