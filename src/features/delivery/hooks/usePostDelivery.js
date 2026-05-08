// import { useApiMutation } from "../../../core/api/useApiMutation";

// import { queryKeys } from "../../../core/routing/queryKeys";

// import { deliveryService } from "../services/deliveryService";

// export function usePostDelivery(options = {}) {
//   return useApiMutation({
//     mutationFn: deliveryService.postDelivery,

//     invalidateKeys: [
//       queryKeys.delivery.all,
//     ],

//     ...options,
//   });
// }