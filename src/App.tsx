import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import ThemeRegistry from "@/components/ThemeRegistry";
import HomePage from "@/pages/HomePage";
import LoginForm from "@/pages/LoginForm";
import RegisterForm from "@/pages/RegisterForm";
import AssistantPage from "@/pages/AssistantPage";

export default function App() {
  return (
    <ThemeRegistry>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeRegistry>
  );
}
