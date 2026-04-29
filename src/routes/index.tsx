import { lazy } from "react";
import { createHashRouter, type RouteObject } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginForm from "@/pages/LoginForm";
import RegisterForm from "@/pages/RegisterForm";
// import ChatPage from "@/pages/ChatPage";
import Layout from "@/Layout";
import NotFound from "@/pages/NotFound";
const chatPageLazy = lazy(() => import("@/pages/ChatPage"));

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
                path: "/chat",
                Component: chatPageLazy
            }
        ]
    },
    {
        path: "/login",
        Component: LoginForm
    },
    {
        path: "/register",
        Component: RegisterForm
    },
    {
        path: "*",
        element: <NotFound />
    }
]

export const router = createHashRouter(routes);