import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const Login = lazy(() => import("../views/ui/Login"));
const Validate = lazy(() => import("../views/ui/Validate"));
const PremiumPlan = lazy(() => import("../views/ui/PremiumPlan.js"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/login", exact: true, element: <Login /> },
      { path: "/validate", exact: true, element: <Validate /> },
      { path: "/premium", exact: true, element: <PremiumPlan /> },
    ],
  },
];

export default ThemeRoutes;
