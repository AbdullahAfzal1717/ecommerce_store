import { Category } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export function getMenus() {
  const { t } = useTranslation();
  return [
    {
      label: "Menu",
      children: [
        {
          path: "/admin",
          label: "Dashboard",
        },
        {
          path: "/admin/categories",
          label: "Category",
        },
        {
          path: "/admin/subcategories",
          label: "SubCategory",
        },
        {
          path: "/admin/products",
          label: "Product",
        },
        {
          path: "/admin/orders",
          label: "Orders",
        },
        {
          path: "/",
          label: "Visit Site",
        },
      ],
    },
  ];
}
