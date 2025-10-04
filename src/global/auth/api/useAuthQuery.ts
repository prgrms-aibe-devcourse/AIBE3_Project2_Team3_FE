import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { unwrap } from "../../backend/apiV1/unwrap";
import client from "../../backend/client";
import { UserJoinReqBody, UserLoginReqBody } from "../types";

const me = async () => unwrap(await client.GET("/api/v1/users/me"));
const login = async (param: UserLoginReqBody) =>
  unwrap(await client.POST("/api/v1/users/login", { body: param }));
const logout = async () => unwrap(await client.DELETE("/api/v1/users/logout"));
const join = async (param: UserJoinReqBody) =>
  unwrap(await client.POST("/api/v1/users/join", { body: param }));

export const authQueryKeys = createQueryKeys("auth", {
  me: () => ["me"],
  login: () => ["login"],
  logout: () => ["logout"],
  join: () => ["join"],
});

export const useFetchMe = () => {
  return useQuery({
    queryKey: authQueryKeys.me().queryKey,
    queryFn: me,
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: authQueryKeys.login().queryKey,
    mutationFn: (param: UserLoginReqBody) => login(param),
    onSuccess: (res) => {
      qc.setQueryData(authQueryKeys.me().queryKey, res.data);
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: authQueryKeys.logout().queryKey,
    mutationFn: logout,
    onSuccess: () => {
      qc.setQueryData(authQueryKeys.me().queryKey, null);
    },
  });
};

export const useJoin = () => {
  return useMutation({
    mutationKey: authQueryKeys.join().queryKey,
    mutationFn: (param: UserJoinReqBody) => join(param),
    onSuccess: (res) => {},
  });
};
