import apiService from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (userData: {
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      location?: {
        latitude: number;
        longitude: number;
        locationType: string;
        label: string;
        address: string;
      };
    }) => apiService.updateUserProfile(userData),
    onSuccess: () => {
      toast.success("User profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return { mutate, isPending };
};
