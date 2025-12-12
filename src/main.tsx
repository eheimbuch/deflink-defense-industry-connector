import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { App } from '@/App';
import { HomePage } from '@/pages/HomePage';
import { OemLoginPage } from '@/pages/oem/OemLoginPage';
import { OemDashboard } from '@/pages/oem/OemDashboard';
import { OemCreatePage } from '@/pages/oem/OemCreatePage';
import { ProviderListPage } from '@/pages/provider/ProviderListPage';
import { ProviderRegisterPage } from '@/pages/provider/ProviderRegisterPage';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "oem/login", element: <OemLoginPage /> },
      { path: "oem/dashboard", element: <OemDashboard /> },
      { path: "oem/create", element: <OemCreatePage /> },
      { path: "providers", element: <ProviderListPage /> },
      { path: "providers/register", element: <ProviderRegisterPage /> },
    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)