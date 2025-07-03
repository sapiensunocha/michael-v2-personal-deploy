"use client";

import store from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import React Query components
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional: for dev tools

// Create a client instance outside the component to prevent re-creation on re-renders
const queryClient = new QueryClient({
  // Optional: default options for all queries
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Data is considered fresh for 1 minute
      // You can add more options here, e.g., retry, refetchOnWindowFocus
    },
  },
});

type ProviderWrapperProps = {
  children: ReactNode;
};

function ProviderWrapper({ children }: ProviderWrapperProps) {
  return (
    <Provider store={store}>
      {/* Wrap your Redux Provider with QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Optional: React Query Devtools for development */}
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  );
}

export default ProviderWrapper;