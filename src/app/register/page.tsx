"use client";
import PhoneInput from "@/components/phoneInput";
import apiService from "@/services/api.service";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
import { useUserLocation } from "@/helpers/useUserLocation";
import bgImage from "../../../assets/images/welcomeImg.jpeg";
import { login } from "./action";

function Register() {
  const navigate = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const userLocation = useUserLocation(); 
  const [, loginAction] = useActionState(login, undefined);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  const handleRegister = async () => {
    if (!userLocation) {
      setError("Unable to fetch location. Please enable location services.");
      return;
    }
    try {
      const response = await apiService.register({
        firstName,
        lastName,
        email,
        password,
        phoneNumber: phone,
        location: userLocation as {
          longitude: number;
          latitude: number;
        },
        verificationCode,
      });
      startTransition(() => {
        const payload: {
          token: string;
          fallbackUrl?: string;
        } = {
          token: response?.accessToken,
        };
        loginAction(payload);
      });
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };
  const handleSendVerificationCode = async () => {
    try {
      await apiService.sendVerificationCode(email);
      setCodeSent(true);
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
      setCodeSent(false);
      console.error(err);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("phone-number", phone);
      localStorage.setItem("user-name", firstName);
      localStorage.getItem("user-location");
    }
  }, [handleRegister]);

  const handlePhoneChange = (fullNumber: any) => {
    setPhone(fullNumber);
  };

  return (
    <div className="h-[100vh] flex">
      <div
        className="relative bg-cover bg-center md:w-[50%] md:flex hidden"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <div className="absolute flex justify-center items-center inset-0 bg-michael_dark_red_75">
          <p className="uppercase text-4xl font-bold text-white text-center">
            welcome to <br />{" "}
            <span className="text-michael_red_100">World Disaster Center!</span>
          </p>
        </div>
      </div>

      <div className="bg-white md:w-[50%] mx-auto md:p-28 p-2 flex flex-col gap-3 justify-center">
        <h1 className="font-bold text-3xl text-michael_red_100">Register</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-michael_gray_5 text-[15px]">
          Please enter your details to register
        </p>
        <div className="flex md:flex-row flex-wrap flex-col gap-2">
          <div className="flex w-full flex-col gap-1">
            <label
              htmlFor="firstName"
              className="text-michael_black_2 text-[15px]"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-michael_red_50 placeholder:text-[13px] text-michael_red_50 placeholder:text-michael_gray_4 p-2 rounded-lg outline-none"
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <label
              htmlFor="lastName"
              className="text-michael_black_2 text-[15px]"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-michael_red_50 placeholder:text-[13px] text-michael_red_50 placeholder:text-michael_gray_4 p-2 rounded-lg outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <label htmlFor="email" className="text-michael_black_2 text-[15px]">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-michael_red_50 placeholder:text-[13px] text-michael_red_50 placeholder:text-michael_gray_4 p-2 rounded-lg outline-none"
          />
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <label
            htmlFor="phone-number"
            className="text-michael_black_2 text-[15px]"
          >
            Phone Number:
          </label>
          <PhoneInput onChange={handlePhoneChange} />
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <label
            htmlFor="password"
            className="text-michael_black_2 text-[15px]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-michael_red_50 placeholder:text-[13px] text-michael_red_50 placeholder:text-michael_gray_4 p-2 rounded-lg outline-none"
          />
        </div>
        {codeSent && <div className="flex flex-col gap-1 mt-2">
          <label
            htmlFor="Verification Code"
            className="text-michael_black_2 text-[15px]"
          >
            Verification Code
          </label>
          <input
            type="password"
            placeholder="Verification Code"
            maxLength={6}
            required
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="border border-michael_red_50 placeholder:text-[13px] text-michael_red_50 placeholder:text-michael_gray_4 p-2 rounded-lg outline-none"
          />
        </div>}
        {codeSent ? <button
          onClick={handleRegister}
          className="text-white text-[15px] font-semibold p-2 rounded-lg bg-michael_red_100 border border-michael_red_100 hover:text-michael_red_100 hover:bg-white"
        >
          Register
        </button> :
        <button
          onClick={handleSendVerificationCode}
          className="text-white text-[15px] font-semibold p-2 rounded-lg bg-michael_red_100 border border-michael_red_100 hover:text-michael_red_100 hover:bg-white"
        >
          Register
        </button>}
        <p className="text-[14px] text-michael_black_1 text-center">
          Already have an account?{" "}
          <span
            className="text-michael_red_100 cursor-pointer hover:underline"
            onClick={() => navigate.push("/signin")}
          >
            Login
          </span>
        </p>
        <div className="flex justify-center mt-3 items-center gap-4">
          <hr className="border-spacing-0 border-michael_gray_2 w-[20%]" />
          <p className="text-[13px] text-michael_gray_1">Or register with</p>
          <hr className="border-spacing-0 border-michael_gray_2 w-[20%]" />
        </div>
        <button className="flex items-center border border-michael_gray_4 justify-center mt-2 gap-2 p-2 rounded-lg">
          <FcGoogle />
          <span className="text-[16px] text-michael_black_2">Google</span>
        </button>
      </div>
    </div>
  );
}

export default Register;
