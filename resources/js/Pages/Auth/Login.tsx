import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Facebook,
    UserPlus,
    LogIn,
} from "lucide-react";
import { useState } from "react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const handleFacebookLogin = () => {
        // TODO: Implement Facebook login
        console.log("Facebook login clicked");
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-muted/50 py-12 px-4">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground">
                            Sign in to your MaidMatch account
                        </p>
                    </div>

                    <Card className="shadow-2xl border-2">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-bold text-center">
                                Sign In
                            </CardTitle>
                            <CardDescription className="text-center">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Status Message */}
                            {status && (
                                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                                    <AlertDescription className="text-green-800 dark:text-green-200">
                                        {status}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Facebook Login Button */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 border-blue-600 text-white hover:text-white"
                                onClick={handleFacebookLogin}
                                disabled={processing}
                            >
                                <Facebook className="w-5 h-5 mr-2" />
                                Continue with Facebook
                            </Button>

                            {/* Divider */}
                            <div className="relative">
                                <Separator />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-card px-4 text-sm text-muted-foreground">
                                        or continue with email
                                    </span>
                                </div>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={submit} className="space-y-5">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium"
                                    >
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="pl-10 h-11"
                                            placeholder="Enter your email"
                                            autoComplete="username"
                                            autoFocus
                                            disabled={processing}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium"
                                    >
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            className="pl-10 pr-10 h-11"
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            disabled={processing}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            checked={data.remember}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    "remember",
                                                    checked === true
                                                )
                                            }
                                            disabled={processing}
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="text-sm text-muted-foreground cursor-pointer"
                                        >
                                            Remember me
                                        </Label>
                                    </div>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm text-primary hover:text-primary/80 font-medium"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-primary hover:bg-primary/90"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Signing in...
                                        </div>
                                    ) : (
                                        <>
                                            <LogIn className="w-4 h-4 mr-2" />
                                            Sign In
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Register Link */}
                            <div className="pt-4 border-t border-border">
                                <div className="text-center space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Don't have an account yet?
                                    </p>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full h-11"
                                    >
                                        <Link href={route("register")}>
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Create New Account
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            By signing in, you agree to our{" "}
                            <Link
                                href="/terms"
                                className="text-primary hover:text-primary/80 font-medium"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="text-primary hover:text-primary/80 font-medium"
                            >
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
