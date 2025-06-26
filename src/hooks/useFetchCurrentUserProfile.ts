import apiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useFetchCurrentUserProfile = () => {
  const { data: user, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: () => apiService.getUser(),
    select: (data) => data[0],
  });
  return {
    user,
    isLoading: isFetching,
  };
};
