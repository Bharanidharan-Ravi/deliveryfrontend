// import { useApiMutation } from "../../../core/api/useApiMutation";

// import { queryKeys } from "../../../core/routing/queryKeys";

// import { deliveryService } from "../services/deliveryService";

// export function usePostDelivery(options = {}) {
//   return useApiMutation({
//     mutationFn: deliveryService.postDelivery,

//     // 🚀 React Query will automatically refresh these keys on success!
//     invalidateKeys: [
//       queryKeys.delivery.all,
//       queryKeys.delivery.stats(), // Added the stats key here
//     ],

//     ...options,
//   });
// }