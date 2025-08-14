import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { Toaster } from "@/Components/ui/sonner";
import { ModeToggle } from "@/Components/mode-toggle";
import { Button } from "@/Components/ui/button";

export default function Guest({ children }: PropsWithChildren) {
    const { component } = usePage();
    const isLoginPage = component === "Auth/Login";

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card shadow-sm border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold text-foreground">
                                MaidMatch
                            </span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <ModeToggle />

                            {isLoginPage ? (
                                <Button asChild variant="default" size="sm">
                                    <Link href={route("register")}>
                                        Get Started
                                    </Link>
                                </Button>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            <Toaster />
        </div>
    );
}
