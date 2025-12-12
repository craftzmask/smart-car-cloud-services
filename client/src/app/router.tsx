import { createBrowserRouter } from "react-router";
import App from "@/App";
import { OwnerDashboardPage } from "@/features/owner/pages/OwnerDashboardPage";
import { OwnerOverviewPage } from "@/features/owner/pages/OwnerOverviewPage";
import { OwnerAccountPage } from "@/features/owner/pages/OwnerAccountPage";
import { IoTDevicesOverviewPage } from "@/features/iot/pages/IoTDevicesOverviewPage";
import { IoTCarDevicesPage } from "@/features/iot/pages/IoTCarDevicesPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignupPage } from "@/features/auth/pages/SignupPage";
import { ConfirmSignupPage } from "@/features/auth/pages/ConfirmSignupPage";
import { RequireAuth } from "@/auth/RequireAuth";
import { CloudOverviewPage } from "@/features/cloud/pages/CloudOverviewPage";
import { CloudAlertsPage } from "@/features/cloud/pages/CloudAlertsPage";
import { CloudModelsPage } from "@/features/cloud/pages/CloudModelsPage";
import { CloudAlertTypesPage } from "@/features/cloud/pages/CloudAlertTypesPage";
import { CloudModelDetailPage } from "@/features/cloud/pages/CloudModelDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/confirm",
    element: <ConfirmSignupPage />,
  },
  {
    path: "/owner/dashboard",
    element: (
      <RequireAuth>
        <OwnerDashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "/owner/overview",
    element: (
      <RequireAuth>
        <OwnerOverviewPage />
      </RequireAuth>
    ),
  },
  {
    path: "/owner/account",
    element: (
      <RequireAuth>
        <OwnerAccountPage />
      </RequireAuth>
    ),
  },
  {
    path: "/iot/devices",
    element: (
      <RequireAuth>
        <IoTDevicesOverviewPage />
      </RequireAuth>
    ),
  },
  {
    path: "/iot/car-devices",
    element: (
      <RequireAuth>
        <IoTCarDevicesPage />
      </RequireAuth>
    ),
  },
  {
    path: "/cloud/overview",
    element: (
      <RequireAuth>
        <CloudOverviewPage />
      </RequireAuth>
    ),
  },
  {
    path: "/cloud/alerts",
    element: (
      <RequireAuth>
        <CloudAlertsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/cloud/alert-types",
    element: (
      <RequireAuth>
        <CloudAlertTypesPage />
      </RequireAuth>
    ),
  },
  {
    path: "/cloud/models",
    element: (
      <RequireAuth>
        <CloudModelsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/cloud/models/:modelId",
    element: (
      <RequireAuth>
        <CloudModelDetailPage />
      </RequireAuth>
    ),
  },
]);
