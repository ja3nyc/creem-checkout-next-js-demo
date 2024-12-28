import { Loader2 } from "lucide-react";

export default function CheckoutCompleteLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Verifying your subscription...</p>
            </div>
        </div>
    );
}
