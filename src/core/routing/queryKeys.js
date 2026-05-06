export const queryKeys = {
  auth: {
    me: () => ["auth", "me"],
  },

  delivery: {
    all: ["delivery"],

    stats: () => [...queryKeys.delivery.all, "stats"],

    invoice: (qr) => [
      ...queryKeys.delivery.all,
      "invoice",
      qr,
    ],
  },
};
