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
    </ThemeRegistry>
  );
}
