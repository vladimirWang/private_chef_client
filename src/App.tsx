import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import ThemeRegistry from "@/components/ThemeRegistry";
import {router} from "@/routes";

export default function App() {
  return (
    <ThemeRegistry>
      <Suspense fallback={<div>Loading...</div>}>
				<RouterProvider router={router} />
			</Suspense>
      {/* <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter> */}
    </ThemeRegistry>
  );
}
