import { bunApi } from "@/utils/requestGenerator";
import type { Dish } from "@/types/dish";

export type CreateDishPayload = {
  image_urls: string[];
  title?: string;
  content: string;
};

export const createDish = (data: CreateDishPayload) => {
  return bunApi.post<{ dish: Dish }>("/dish", data);
};

export const getDishList = () => {
  return bunApi.get<{ dishes: Dish[] }>("/dish/list", { showErrorMessage: false });
};
