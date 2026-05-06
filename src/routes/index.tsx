import { lazy } from "react";
import { createHashRouter, type RouteObject } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginForm from "@/pages/LoginForm";
import RegisterForm from "@/pages/RegisterForm";
// import ChatPage from "@/pages/ChatPage";
import Layout from "@/Layout";
import NotFound from "@/pages/NotFound";
const yumPageLazy = lazy(() => import("@/pages/YumPage"));
const fileuploadPageLazy = lazy(() => import("@/pages/FileuploadPage"));

export const routes: RouteObject[] = [
    {
        path: "/",
        Component: Layout,
        children: [
            {
                index: true,
                Component: HomePage
                // path: "/assistant",
                // Component: AssistantPage
            },
            {
                path: "/yum",
                Component: yumPageLazy
            },
            {
                path: "/fileupload",
                Component: fileuploadPageLazy
            }
        ]
    },
    {
        path: "/landing/login",
        Component: LoginForm
    },
    {
        path: "/landing/register",
        Component: RegisterForm
    },
    {
        path: "*",
        element: <NotFound />
    }
]

export const router = createHashRouter(routes);