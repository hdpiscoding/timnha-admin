import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore.ts";
import type {JSX} from "react";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = useUserStore((s) => s.token);

    if (!token) {
        return <Navigate to="/dang-nhap" replace />;
    }

    return children;
};