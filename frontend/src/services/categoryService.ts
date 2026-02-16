import api from "./api";
import type { Category } from "@/types/category.types";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>("/categories");
    return res.data;
  },
};
