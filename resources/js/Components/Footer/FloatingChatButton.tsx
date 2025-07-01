import { MessageCircle } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function FloatingChatButton() {
    return (
        <Link
            href="/employer/chat"
            className="fixed z-50 right-4 bottom-20 md:right-8 md:bottom-8 bg-primary text-primary-foreground rounded-full shadow-lg p-3 md:p-4 flex items-center justify-center hover:bg-primary/90 transition"
            aria-label="Chat"
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
        >
            <MessageCircle className="w-7 h-7" />
        </Link>
    );
}
