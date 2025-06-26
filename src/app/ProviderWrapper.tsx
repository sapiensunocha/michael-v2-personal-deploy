"use client";

import store from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";

type ProviderWrapperProps = {
  children: ReactNode;
};

function ProviderWrapper({ children }: ProviderWrapperProps) {
  return <Provider store={store}>{children}</Provider>;
}

export default ProviderWrapper;
