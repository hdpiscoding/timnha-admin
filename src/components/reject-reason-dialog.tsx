import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface RejectReasonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => Promise<void>;
    title?: string;
    description?: string;
}

export function RejectReasonDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Xác nhận từ chối",
    description = "Vui lòng nhập lý do từ chối (không bắt buộc)",
}: RejectReasonDialogProps) {
    const [reason, setReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm(reason);
            setReason(""); // Reset reason after confirm
            onOpenChange(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (isLoading) return; // Prevent cancel during loading
        setReason(""); // Reset reason on cancel
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reject-reason">Lý do từ chối (không bắt buộc)</Label>
                        <Input
                            id="reject-reason"
                            type="text"
                            placeholder="Nhập lý do từ chối..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="focus-visible:ring-[#008DDA]"
                            autoFocus={false}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="cursor-pointer bg-red-600 hover:bg-red-700"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

