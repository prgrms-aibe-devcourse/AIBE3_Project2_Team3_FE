"use client";

import { useFetchMe } from "../api/useAuthQuery";

const useAuth = () => {
  const { data, isLoading, isSuccess } = useFetchMe();

  return {
    data,
    isLoading,
    isSuccess,
  } as const;
};

export default useAuth;
