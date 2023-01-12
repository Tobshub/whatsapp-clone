import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import trpc from "@utils/trpc";
import env from "@data/env.json";

const appQueryClient = new QueryClient();

appQueryClient.setDefaultOptions({
  queries: {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  },
});

const appTrpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${env.SERVER_URL}/api`,
    }),
  ],
});

export { appQueryClient, appTrpcClient };
