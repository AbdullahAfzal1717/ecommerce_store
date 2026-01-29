import { Category } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export function getMenus() {
  const { t } = useTranslation();
  return [
    {
      label: t("sidebar.menu.sample"),
      children: [
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
          path: "/",
          label: "Visit Site",
        },
      ],
    },
  ];
}
