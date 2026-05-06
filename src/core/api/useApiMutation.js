import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useApiMutation = ({
  mutationFn,
  invalidateKeys = [],
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onSuccess: (data, variables, context) => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: key,
        });
      });

      onSuccess?.(data, variables, context);
    },

    onError,
  });
};