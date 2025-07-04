import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Users,
    Shield,
    Star,
    Clock,
    MapPin,
    Heart,
    Search,
    Home,
} from "lucide-react";
import { ModeToggle } from "@/Components/mode-toggle";

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const getDashboardRoute = () => {
        if (!auth.user) return route("dashboard");

        // Use the single role property
        const role = auth.user.role;

        if (role === "employer") {
            return route("employer.dashboard");
        } else if (role === "maid") {
            return route("maid.dashboard");
        } else if (role === "agency") {
            return route("agency.dashboard");
        } else if (role === "admin") {
            return route("admin.dashboard");
        }

        // Fallback (should not happen if roles are correct)
        return route("dashboard");
    };

    return (
        <>
            <Head title="Maid Match - Find Your Perfect Household Helper" />
            <div className="min-h-screen bg-gradient-to-br from-muted to-secondary/20">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                                <Home className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <h1 className="text-xl font-bold text-foreground">
                                Maid Match
                            </h1>
                        </div>

                        {/* Navigation */}
                        <nav className="flex items-center space-x-2">
                            <ModeToggle />
                            {auth.user ? (
                                <Button asChild variant="default">
                                    <Link href={getDashboardRoute()}>
                                        Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={route("login")}>
                                            Sign In
                                        </Link>
                                    </Button>
                                    <Button asChild variant="default" size="sm">
                                        <Link href={route("register")}>
                                            Get Started
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="container mx-auto px-4 py-12 md:py-20">
                    <div className="text-center">
                        <Badge variant="secondary" className="mb-4">
                            🏠 Trusted by 1000+ families
                        </Badge>
                        <h2 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
                            Find Your Perfect
                            <span className="block text-secondary">
                                Household Helper
                            </span>
                        </h2>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                            Connect with verified, experienced maids in your
                            area. Safe, reliable, and hassle-free domestic help
                            matching.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Button asChild size="lg" className="text-lg">
                                <Link
                                    href={route("employer.register", {
                                        type: "employer",
                                    })}
                                >
                                    <Users className="mr-2 h-5 w-5" />I Need a
                                    Maid
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="secondary"
                                size="lg"
                                className="text-lg"
                            >
                                <Link
                                    href={route("agency.register", {
                                        type: "agency",
                                    })}
                                >
                                    <Shield className="mr-2 h-5 w-5" />
                                    I'm an Agency
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-card py-16">
                    <div className="container mx-auto px-4">
                        <h3 className="mb-12 text-center text-3xl font-bold text-foreground">
                            How Maid Match Works
                        </h3>

                        <div className="grid gap-8 md:grid-cols-3">
                            <Card className="text-center">
                                <CardHeader>
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Search className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle>1. Post Your Needs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        Tell us about your household
                                        requirements, preferred schedule, and
                                        budget.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="text-center">
                                <CardHeader>
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                                        <Users className="h-8 w-8 text-secondary" />
                                    </div>
                                    <CardTitle>2. Get Matched</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        We connect you with verified maids who
                                        match your specific needs and location.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="text-center">
                                <CardHeader>
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                                        <Heart className="h-8 w-8 text-accent-foreground" />
                                    </div>
                                    <CardTitle>3. Start Working</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        Interview, hire, and enjoy reliable
                                        household help with ongoing support.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h3 className="mb-12 text-center text-3xl font-bold text-foreground">
                            Why Choose Maid Match?
                        </h3>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-3">
                                    <Shield className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle className="text-lg">
                                        Verified Maids
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        All our maids undergo background checks
                                        and skill verification.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <Star className="mb-2 h-8 w-8 text-accent-foreground" />
                                    <CardTitle className="text-lg">
                                        Quality Reviews
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        Real reviews from families help you make
                                        the right choice.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <Clock className="mb-2 h-8 w-8 text-secondary" />
                                    <CardTitle className="text-lg">
                                        Flexible Schedule
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        Find maids for part-time, full-time, or
                                        one-time cleaning.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <MapPin className="mb-2 h-8 w-8 text-primary" />
                                    <CardTitle className="text-lg">
                                        Local Match
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        Connect with maids in your neighborhood
                                        for convenience.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section className="bg-primary py-16 text-primary-foreground">
                    <div className="container mx-auto px-4">
                        <div className="grid gap-8 text-center md:grid-cols-4">
                            <div>
                                <div className="mb-2 text-4xl font-bold">
                                    1,000+
                                </div>
                                <div className="text-primary-foreground/80">
                                    Happy Families
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 text-4xl font-bold">
                                    500+
                                </div>
                                <div className="text-primary-foreground/80">
                                    Verified Maids
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 text-4xl font-bold">
                                    98%
                                </div>
                                <div className="text-primary-foreground/80">
                                    Success Rate
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 text-4xl font-bold">
                                    24/7
                                </div>
                                <div className="text-primary-foreground/80">
                                    Support
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h3 className="mb-12 text-center text-3xl font-bold text-foreground">
                            What Our Users Say
                        </h3>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 fill-accent text-accent-foreground"
                                            />
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-muted-foreground">
                                        "Found the perfect maid for our family
                                        through Maid Match. Professional and
                                        reliable!"
                                    </p>
                                    <div className="text-sm font-medium text-foreground">
                                        Anonymous
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 fill-accent text-accent-foreground"
                                            />
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-muted-foreground">
                                        "Great platform! Easy to use and helped
                                        me find work quickly with good
                                        families."
                                    </p>
                                    <div className="text-sm font-medium text-foreground">
                                        Anonymous
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 fill-accent text-accent-foreground"
                                            />
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-muted-foreground">
                                        "The verification process gave us
                                        confidence. Highly recommend Maid
                                        Match!"
                                    </p>
                                    <div className="text-sm font-medium text-foreground">
                                        Anonymous
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-secondary py-16 text-secondary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <h3 className="mb-4 text-3xl font-bold">
                            Ready to Get Started?
                        </h3>
                        <p className="mb-8 text-xl text-secondary-foreground/80">
                            Join thousands of satisfied families, maids, and
                            agencies today.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="bg-secondary-foreground text-secondary border-secondary-foreground hover:bg-secondary-foreground/90"
                            >
                                <Link
                                    href={route("employer.register", {
                                        type: "employer",
                                    })}
                                >
                                    Find a Maid
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="bg-secondary-foreground text-secondary border-secondary-foreground hover:bg-secondary-foreground/90"
                            >
                                <Link
                                    href={route("agency.register", {
                                        type: "agency",
                                    })}
                                >
                                    Join as Agency
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t bg-card py-8">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                        <p>&copy; 2025 Maid Match. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
