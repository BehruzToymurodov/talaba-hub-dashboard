import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { QueryProvider } from "@/lib/api/providers";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <QueryProvider>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>
);
