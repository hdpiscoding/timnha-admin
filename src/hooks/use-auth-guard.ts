import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore.ts";
import { decodeJwt } from "../utils/jwtHelper.ts";
import { useNavigate, useLocation } from "react-router-dom";

export function useAuthGuard() {
    const token = useUserStore((s) => s.token);
    const clearToken = useUserStore((s) => s.clearToken);
    const navigate = useNavigate();
    const location = useLocation();
    const [showExpiredDialog, setShowExpiredDialog] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!token) return;

        const payload = decodeJwt(token);
        if (!payload?.exp) return;

        const now = Date.now() / 1000;
        const isExpired = payload.exp < now;

        if (isExpired && !showExpiredDialog) {
            setShowExpiredDialog(true);
        }
    }, [token, location.pathname, showExpiredDialog]);

    const handleLoginRedirect = () => {
        clearToken();
        setShowExpiredDialog(false);
        navigate("/dang-nhap", { replace: true });
    };

    return {
        showExpiredDialog,
        handleLoginRedirect,
    };
}