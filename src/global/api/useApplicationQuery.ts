import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { CreateAppReq } from "../types/application.types";

const create = async (formData: FormData) =>
  unwrap(
    await client.POST("/api/v1/applications", {
      body: formData as unknown as CreateAppReq,
      // openapi-fetch will set content-type for FormData automatically
    }),
  );

export const applicationQueryKeys = createQueryKeys("application", {
  create: () => ["create"],
});

export const useCreateApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: applicationQueryKeys.create().queryKey,
    mutationFn: (fd: FormData) => create(fd),
    onSuccess: (res) => {
      qc.invalidateQueries();
    },
  });
};

export default useCreateApplication;
