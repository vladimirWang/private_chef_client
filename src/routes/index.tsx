import { lazy } from "react";
import { createHashRouter, type RouteObject } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginForm from "@/pages/LoginForm";
import RegisterPage from "@/pages/register/RegisterPage";
// import ChatPage from "@/pages/ChatPage";
import Layout from "@/Layout";
import NotFound from "@/pages/NotFound";
const yumPageLazy = lazy(() => import("@/pages/YumPage"));
const fileuploadPageLazy = lazy(() => import("@/pages/FileuploadPage"));
const galleryPageLazy = lazy(() => import("@/pages/GalleryPage"));
const messagesPageLazy = lazy(() => import("@/pages/MessagesPage"));

export const routes: RouteObject[] = [
    {
        path: "/",
        Component: Layout,
        children: [
            {
                index: true,
                Component: HomePage
            },
            {
                path: "gallery",
                Component: galleryPageLazy
            },
            {
                path: "fileupload",
                Component: fileuploadPageLazy
            }
        ]
    },
    {
        path: "/yum",
        Component: yumPageLazy
    },    {
        path: "/messages",
        Component: messagesPageLazy
    },
    {
        path: "/landing/login",
        Component: LoginForm
    },
    {
        path: "/landing/register",
        Component: RegisterPage
    },
    {
        path: "*",
        element: <NotFound />
    }
]

export const router = createHashRouter(routes);