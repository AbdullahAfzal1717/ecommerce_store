import { createBrowserRouter } from "react-router-dom";

// Layouts
import { StretchedLayout } from "@app/_layouts/StretchedLayout";
import { SoloLayout } from "@app/_layouts/SoloLayout";
import { StorefrontLayout } from "@app/_layouts/StorefrontLayout";
import { UserAccountLayout } from "@app/_layouts/UserAccountLayout";

// HOCs
import withAuth from "@app/_hoc/withAuth";
import withGuest from "@app/_hoc/withGuest";
import withAdmin from "@app/_hoc/withAdmin";
import { Page, NotFound404 } from "@app/_components/_core";

// Pages - Auth
import Login1 from "@app/pages/auth/login1";
import Signup1 from "@app/pages/auth/signup1";

// Pages - Admin
import CategoryPage from "@app/pages/admin/categories/CategoryPage";
import SubCategoryPage from "@app/pages/admin/subCategories/SubCategoryPage";
import ProductPage from "@app/pages/admin/products/ProductPage";
import ProfilePage from "@app/pages/admin/profile/ProfilePage";
import AdminOrdersPage from "@app/pages/admin/orders/OrdersPage";

// Pages - Storefront
import LandingPage from "@app/pages/storefornt/home/LandingPage";
import ProductsPage from "@app/pages/storefornt/products/ProductsPage";
import CheckoutPage from "@app/pages/storefornt/checkout/CheckoutPage";
import UserOrdersPage from "@app/pages/storefornt/user/UserOrdersPage"; // Create this next
import UserDashboard from "@app/pages/storefornt/user/UserDashboard"; // Create this next
import AdminDashboard from "@app/pages/admin/dashboard/AdminDashboard";

const routes = [
  // 1. STOREFRONT & USER ACCOUNT
  {
    path: "/",
    element: <StorefrontLayout />,
    children: [
      { path: "/", element: <Page Component={LandingPage} /> },
      { path: "/products", element: <Page Component={ProductsPage} /> },
      {
        path: "/checkout",
        element: <Page Component={CheckoutPage} hoc={withAuth} />,
      },

      // USER PANEL (Nested inside Storefront)
    ],
  },
  {
    path: "account",
    element: <Page Component={StretchedLayout} hoc={withAuth} />,
    children: [
      { path: "", element: <UserDashboard /> },
      { path: "orders", element: <UserOrdersPage /> },
      { path: "profile", element: <ProfilePage /> }, // Reusing ProfilePage CRUD
    ],
  },
  // 2. ADMIN DASHBOARD
  {
    path: "/admin",
    element: <Page Component={StretchedLayout} hoc={withAdmin} />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "categories", element: <CategoryPage /> },
      { path: "subcategories", element: <SubCategoryPage /> },
      { path: "products", element: <ProductPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "orders", element: <AdminOrdersPage /> },
    ],
  },

  // 3. AUTH ROUTES
  {
    path: "/auth",
    element: <SoloLayout />,
    children: [
      { path: "login-1", element: <Page Component={Login1} hoc={withGuest} /> },
      {
        path: "signup-1",
        element: <Page Component={Signup1} hoc={withGuest} />,
      },
    ],
  },

  { path: "*", element: <NotFound404 /> },
];

export const router = createBrowserRouter(routes);
