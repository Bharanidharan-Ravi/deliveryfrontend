// import { useApiQuery } from "../../../core/api/useApiQuery";
// import { queryKeys } from "../../../core/routing/queryKeys";
// import { deliveryService } from "../services/deliveryService";
// import { useAuthStore } from "../../../store/useAuthStore";

// export function useDailyStatsQuery() {
//   const { isAuthenticated } = useAuthStore(); // Grab auth status from store

//   return useApiQuery({
//     queryKey: [...queryKeys.delivery.all, 'stats'],
//     queryFn: async () => {
//       const data = await deliveryService.getDailyStats();
//       return {
//         open: data.openCount || 0,
//         closed: data.closedCount || 0,
//         total: data.totalCount || 0,
//       };
//     },
//       options: {

//       enabled:
//         !!isAuthenticated,

//       // Auto refresh every 3 min
//       refetchInterval:
//         3 * 60 * 1000,

//       // Avoid refetch on tab focus
//       refetchOnWindowFocus:
//         false,

//       // Keep data fresh for 2 min
//       staleTime:
//         2 * 60 * 1000,
//     },
//   });
// }