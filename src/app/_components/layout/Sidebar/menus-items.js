import { useTranslation } from "react-i18next";

export function getMenus(pathname) {
  const { t } = useTranslation();

  const isAdminPath = pathname.startsWith("/admin");

  if (isAdminPath) {
    return [
      {
        label: "Management",
        children: [
          { path: "/admin", label: "Admin Dashboard" },
          {
            path: "/admin/categories",
            label: "Categories",
          },
          {
            path: "/admin/subcategories",
            label: "Sub Categories",
          },
          {
            path: "/admin/products",
            label: "Products",
          },
          {
            path: "/admin/orders",
            label: "Customer Orders",
          },
          { path: "/", label: "Back to Shop" },
        ],
      },
    ];
  }

  // Otherwise, we show the User's Personal Account menus
  return [
    {
      label: "My Account",
      children: [
        {
          path: "/account",
          label: "Overview",
        },
        {
          path: "/account/orders",
          label: "My Orders",
        },
        { path: "/account/profile", label: "My Profile" },
        { path: "/", label: "Continue Shopping" },
      ],
    },
  ];
}
