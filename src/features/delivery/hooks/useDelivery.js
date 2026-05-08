// src/hooks/useDelivery.js
import { useApiQuery } from "../../../core/api/useApiQuery";
import { useApiMutation } from "../../../core/api/useApiMutation";
import { queryKeys } from "../../../core/routing/queryKeys";
import { deliveryService } from "../services/deliveryService";
import { useAuthStore } from "../../../store/useAuthStore";

// 1. STATS QUERY
export function useDailyStatsQuery() {
  const { isAuthenticated } = useAuthStore();
  return useApiQuery({
    queryKey: [...queryKeys.delivery.all, 'stats'],
    queryFn: async () => {
      const data = await deliveryService.getDailyStats();
      return {
        open: data.openCount || 0,
        closed: data.closedCount || 0,
        total: data.totalCount || 0,
      };
    },
    options: {
      enabled: !!isAuthenticated,
      refetchInterval: 3 * 60 * 1000,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
    },
  });
}

// 2. DOCUMENT QUERY
export function useDocumentQuery(value) {
  return useApiQuery({
    queryKey: queryKeys.delivery.document(value),
    queryFn: () => deliveryService.getDocument(value),
    options: {
      enabled: !!value,
    },
  });
}

// 3. POST DELIVERY MUTATION
export function usePostDelivery(options = {}) {
  return useApiMutation({
    mutationFn: deliveryService.postDelivery,
    // This is the magic! When a delivery succeeds, it forces the Stats query to refresh!
    invalidateKeys: [queryKeys.delivery.all], 
    ...options,
  });
}