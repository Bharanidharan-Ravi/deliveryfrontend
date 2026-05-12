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

    document: (id) => [
      ...queryKeys.delivery.all,
      "document",
      id,
    ],

    history: () => [...queryKeys.delivery.all, "history"],
  },
};
