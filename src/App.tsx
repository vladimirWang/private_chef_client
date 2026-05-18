import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import ThemeRegistry from "@/components/ThemeRegistry";
import {router} from "@/routes";
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <ThemeRegistry>
      <Suspense fallback={<div>Loading...</div>}>
        <Toaster />
				<RouterProvider router={router} />
			</Suspense>
    </ThemeRegistry>
  );
}
