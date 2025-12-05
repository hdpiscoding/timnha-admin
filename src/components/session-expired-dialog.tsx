import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SessionExpiredDialogProps {
    open: boolean;
    onLoginRedirect: () => void;
}

export function SessionExpiredDialog({ open, onLoginRedirect }: SessionExpiredDialogProps) {
    return (
        <Dialog open={open} onOpenChange={() => {}} modal>
            <DialogContent 
                showCloseButton={false}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-md"
            >
                <DialogHeader>
                    <DialogTitle className="text-center">Phiên đăng nhập hết hạn</DialogTitle>
                    <DialogDescription className="text-center">
                        Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:justify-center">
                    <Button 
                        onClick={onLoginRedirect}
                        className="w-full sm:w-auto bg-[#008DDA] hover:bg-[#0077b6] cursor-pointer"
                    >
                        Đăng nhập
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

