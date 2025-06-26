"use client";
import apiService from "@/services/api.service";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import bgImage from "../../../assets/images/welcomeImg.jpeg";
import { login } from "./action";
// import useUserEmailStore from "@/zustand/features/userEmailStore";

function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const { mutate: googleLogin, isPending } = useMutation({
    mutationFn: () => apiService.googleLogin(),
    onSuccess: (data) => {
      console.log("data", data);
    },
  });
  const [, loginAction] = useActionState(login, undefined);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password, verificationCode);
      setUserEmail(email);
      startTransition(() => {
        const payload = {
          token: response?.accessToken!,
        };
        loginAction(payload);
      });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendVerificationCode = async () => {
    try {
      await apiService.sendVerificationCode(email);
      setCodeSent(true);
    } catch (err: any) {
      setError(err.response.data.message);
      if (err.response.data.message == "Code already sent") {
        setCodeSent(true);
      } else {
        setCodeSent(false);
      }
    }
  };
  useEffect(() => {
    setUserEmail(email);
    localStorage.setItem("userEmail", userEmail);
  }, [email, userEmail]);

  return (
    <div className="h-[100vh] flex flex-col md:flex-row">
      <div
        className="relative bg-cover bg-center w-full h-[30vh] md:h-auto md:w-[50%]"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <div className="absolute flex justify-center items-center inset-0 bg-michael_dark_red_75">
          <p className="uppercase text-2xl md:text-4xl font-bold text-white text-center">
            welcome back!
          </p>
        </div>
      </div>
      <div className="bg-white w-full md:w-[50%] p-6 md:p-28 flex flex-col gap-3 justify-center">
        <h1 className="font-bold text-2xl md:text-3xl text-michael_red_100">
          Login
        </h1>
        <p className="text-michael_gray_5 text-[14px] md:text-[15px]">
          Please enter your details to login
        </p>
        <input
          type="email"
          placeholder="Email"
          required
          className="border border-michael_red_50 placeholder:text-[14px] text-michael_red_50 placeholder:text-michael_gray_4 p-2 rounded-lg outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="border border-michael_red_50 placeholder:text-[14px] text-michael_red_50 placeholder:text-michael_gray_4 p-2 rounded-lg outline-none mt-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-[13px]">{error}</p>}

        <p className="self-end underline text-[13px] text-michael_gray_5 mb-2 -mt-2 cursor-pointer">
          Forgot password?
        </p>

        {codeSent && 
          <>
            <label className="flex items-center font-semibold">Verification Code</label>
            <input
              type="password"
              placeholder="Code"
              maxLength={6}
              required
              className="border border-michael_red_50 placeholder:text-[14px] text-michael_red_50 placeholder:text-michael_gray_4 p-2 rounded-lg outline-none"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              />
          </>
        }

        {!codeSent ? <button
          className="text-white flex items-center justify-center text-[14px] md:text-[15px] font-semibold p-2 rounded-lg bg-michael_red_100 border border-michael_red_100 hover:text-michael_red_100 hover:bg-white"
          onClick={handleSendVerificationCode}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
          {isLoading && (
            <span>
              <Loader2
                size={16}
                className="animate-spin text-michael_red_100"
              />
            </span>
          )}
        </button> :
        <button
          className="text-white flex items-center justify-center text-[14px] md:text-[15px] font-semibold p-2 rounded-lg bg-michael_red_100 border border-michael_red_100 hover:text-michael_red_100 hover:bg-white"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
          {isLoading && (
            <span>
              <Loader2
                size={16}
                className="animate-spin text-michael_red_100"
              />
            </span>
          )}
        </button>}

        <p className="text-[13px] md:text-[14px] text-michael_black_1 text-center">
          Don&apos;t have an account yet?
          <span
            className="text-michael_red_100 cursor-pointer hover:underline ml-1"
            onClick={() => router.push("/register")}
          >
            Create an account
          </span>
        </p>

        <div className="flex justify-center mt-3 items-center gap-4">
          <hr className="border-spacing-0 border-michael_gray_2 w-[20%]" />
          <p className="text-[12px] md:text-[13px] text-michael_gray_1">
            Or continue with
          </p>
          <hr className="border-spacing-0 border-michael_gray_2 w-[20%]" />
        </div>

        <button
          onClick={() => googleLogin()}
          className="flex items-center border border-michael_gray_4 justify-center mt-2 gap-2 p-2 rounded-lg"
        >
          <FcGoogle />
          <span>Google</span>
        </button>
      </div>
    </div>
  );
}

export default SignIn;
