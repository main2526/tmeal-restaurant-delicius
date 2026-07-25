import {
  Leaf,
  Pizza,
  Smile,
  Utensils,
} from "lucide-react";

import type { Category } from "../types";

export const categories: Category[] = [
  { id: "entradas", name: { es: "Entradas", en: "Appetizers" }, icon: Utensils },
  {
    id: "ninos",
    name: { es: "Menú Niños", en: "Kids Menu" },
    icon: Smile,
  },
  {
    id: "pasteles_en_hoja",
    name: { es: "Pasteles en Hoja", en: "Dominican Pasteles" },
    icon: Utensils,
  },
  {
    id: "sandwich",
    name: { es: "Sándwich", en: "Sandwiches" },
    icon: Pizza,
  },
  { id: "ensaladas", name: { es: "Ensaladas", en: "Salads" }, icon: Leaf },
];
