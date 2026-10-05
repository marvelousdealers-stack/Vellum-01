import { RouterProvider } from "react-router";
import { ToastProvider } from "@/context/ToastContext";
import { AppProvider } from "@/context/AppContext";
import { router } from "@/routes";

// Providers, outermost first:
//   ToastProvider  — global notifications
//   AppProvider    — app state (role, drafts, courses, modal flags)
//   RouterProvider — URL-driven page rendering (Layout wraps authed pages)
export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ToastProvider>
  );
}
