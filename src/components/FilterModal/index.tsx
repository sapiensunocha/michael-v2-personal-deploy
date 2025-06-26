"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { fetchDisasters } from "../../redux/services/disasters";

const FilterModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: any;
}) => {
  const dispatch = useDispatch<any>();
  const [limit, setLimit] = useState(300);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedFilter, setSelectedFilter] = useState("Today");

  const quickFilters = [
    { label: "Today", value: "Today" },
    { label: "Yesterday", value: "Yesterday" },
    { label: "This Week", value: "This Week" },
    { label: "Last Week", value: "Last Week" },
    { label: "This Month", value: "This Month" },
    { label: "Last Month", value: "Last Month" },
  ];

  const handleQuickFilter = (filter: string) => {
    setSelectedFilter(filter);
    const today = new Date();

    switch (filter) {
      case "Today":
        setStartDate(today);
        setEndDate(today);
        break;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case "This Week":
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        setStartDate(thisWeekStart);
        setEndDate(today);
        break;
      case "Last Week":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        setStartDate(lastWeekStart);
        setEndDate(lastWeekEnd);
        break;
      case "This Month":
        const thisMonthStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        );
        setStartDate(thisMonthStart);
        setEndDate(today);
        break;
      case "Last Month":
        const lastMonthStart = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
        );
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        setStartDate(lastMonthStart);
        setEndDate(lastMonthEnd);
        break;
      default:
        break;
    }
  };

  const handleApply = () => {
    const params:
      | {
          limit: number;
          start: string;
          end: string;
        }
      | any = {
      limit,
      start: startDate?.toISOString() || new Date().toISOString(),
      end: endDate?.toISOString() || new Date().toISOString() + 1,
    };
    dispatch(fetchDisasters());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg p-6 z-10 w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter Disasters</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Limit
          </label>
          <input
            type="number"
            placeholder="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded-md w-24"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleQuickFilter(filter.value)}
              className={`px-3 py-2 rounded-full text-sm ${
                selectedFilter === filter.value
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              maxDate={new Date()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              maxDate={new Date()}
              minDate={startDate || new Date()}
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleApply}
            className="flex bg-red-500 text-white py-2 px-6 rounded-3xl hover:bg-red-600 transition-colors"
          >
            Apply
            <span className="ml-1 mt-1">
              <FaCheckCircle />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
