"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type Todo = {
  id: string;
  name: string;z
  status: boolean;
};

const API_URL = "https://6966216af6de16bde44c5161.mockapi.io/students";


export const useGetTodos = () => {
  return useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axios.get(API_URL);
      return res.data;
    },
  });
};


export const useAddTodo = () => {
  const queryClient = useQueryClient();
  return useMutation<Todo, Error, string>({
    mutationFn: async (name) => {
      const res = await axios.post(API_URL, {
        name,
        status: false,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export const useEditTodo = () => {
  const queryClient = useQueryClient();
  return useMutation<Todo, Error, { id: string; name: string; status: boolean }>({
    mutationFn: async ({ id, name, status }) => {
      const res = await axios.put(`${API_URL}/${id}`, {
        name,
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};


export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};