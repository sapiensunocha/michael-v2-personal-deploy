"use client";

import countryCodes from "@/helpers/countriesCodes";
import { useState } from "react";
import Select from "react-select";

export default function PhoneInput({ onChange }: any) {
  const [selectedCode, setSelectedCode] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCodeChange = (selectedOption: any) => {
    setSelectedCode(selectedOption);
    if (onChange) {
      onChange(`${selectedOption.value}${phoneNumber}`);
    }
  };
  const handlePhoneNumberChange = (e: any) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (onChange) {
      onChange(`${selectedCode.value}${value}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        options={countryCodes}
        value={selectedCode}
        onChange={handleCodeChange}
        className="w-[35%] rounded border border-red-300 outline-0"
        styles={{
          control: (base) => ({
            ...base,
            boxShadow: "none",
            borderColor: "red",
            "&:hover": { borderColor: "red" },
          }),
          input: (base: any) => ({
            ...base,
            boxShadow: "red",
          }),
          dropdownIndicator: (base: any) => ({
            ...base,
            padding: "0px",
          }),
          indicatorSeparator: () => ({
            display: "none",
          }),
        }}
      />
      <input
        type="tel"
        placeholder="Enter phone number"
        className="p-2 border rounded w-full border-red-300"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />
    </div>
  );
}
