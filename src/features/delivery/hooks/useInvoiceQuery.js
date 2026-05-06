import { useApiQuery } from "../../../core/api/useApiQuery";

import { queryKeys } from "../../../core/routing/queryKeys";

import { deliveryService } from "../services/deliveryService";

export function useInvoiceQuery(value) {
  return useApiQuery({
    queryKey: queryKeys.delivery.invoice(value),

    queryFn: () =>
      deliveryService.getInvoice(value),

    options: {
      enabled: !!value,
    },
  });
}