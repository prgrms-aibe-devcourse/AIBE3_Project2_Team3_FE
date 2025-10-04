import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClientOption = {
  defaultOptions: { queries: { refetchOnWindowFocus: true } },
};
const queryClient = new QueryClient(queryClientOption);

export const QueryClientCustomProvider = ({
  children,
}: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
