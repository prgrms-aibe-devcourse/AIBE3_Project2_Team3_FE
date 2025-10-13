import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import {
  UserDeleteReqBody,
  UserFindPasswordReqBody,
  UserJoinReqBody,
  UserLoginReqBody,
  UserModifyReqBody,
  UserPasswordUpdateReqBody,
} from "../types/auth.types";

const me = async () => unwrap(await client.GET("/api/v1/users/me"));

const login = async (body: UserLoginReqBody) =>
  unwrap(await client.POST("/api/v1/users/login", { body }));

const logout = async () => unwrap(await client.DELETE("/api/v1/users/logout"));

const join = async (body: UserJoinReqBody) =>
  unwrap(await client.POST("/api/v1/users/join", { body }));

const modifyUser = async (body: UserModifyReqBody) =>
  unwrap(await client.PUT("/api/v1/users", { body }));

const findPw = async (body: UserFindPasswordReqBody) =>
  unwrap(await client.POST("/api/v1/users/findPw", { body }));

const updatePassword = async (body: UserPasswordUpdateReqBody) =>
  unwrap(await client.PATCH("/api/v1/users/password", { body }));

const remove = async (body: UserDeleteReqBody) =>
  unwrap(await client.DELETE("/api/v1/users/me", { body }));

export const authQueryKeys = createQueryKeys("auth", {
  me: () => ["me"],
  login: () => ["login"],
  logout: () => ["logout"],
  join: () => ["join"],
  modifyUser: () => ["modifyUser"],
  findPw: () => ["findPw"],
  updatePassword: () => ["updatePassword"],
  remove: () => ["remove"],
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
    mutationFn: login,
    onSuccess: (res) => {
      qc.setQueryData(authQueryKeys.me().queryKey, res);
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
    mutationFn: join,
    onSuccess: () => {},
  });
};

export const useModifyUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: authQueryKeys.modifyUser().queryKey,
    mutationFn: modifyUser,
    onSuccess: (res) => {
      qc.setQueryData(authQueryKeys.me().queryKey, res);
    },
  });
};

export const useFindPw = () => {
  return useMutation({
    mutationKey: authQueryKeys.findPw().queryKey,
    mutationFn: findPw,
    onSuccess: () => {},
  });
};

export const useUpdatePassword = () =>
  useMutation({
    mutationKey: authQueryKeys.updatePassword().queryKey,
    mutationFn: updatePassword,
  });

export const useRemoveUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: authQueryKeys.remove().queryKey,
    mutationFn: remove,
    onSuccess: () => {
      qc.setQueryData(authQueryKeys.me().queryKey, null);
    },
  });
};
