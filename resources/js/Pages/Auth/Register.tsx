import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
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
    Building2,
    UserCheck,
    Star,
    Shield,
    Clock,
    ArrowRight,
    CheckCircle,
} from "lucide-react";

export default function Register() {
    const registrationOptions = [
        {
            role: "employer",
            title: "Find Household Help",
            subtitle: "Hire trusted maids and helpers",
            description:
                "Post job openings, browse qualified candidates, and find the perfect household help for your family.",
            icon: Users,
            colorClass:
                "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
            features: [
                "Post job listings",
                "Browse verified maid profiles",
                "Direct messaging with candidates",
                "Background check reports",
            ],
            cta: "Find Help Now",
            route: "employer.register",
            popular: false,
        },
        {
            role: "agency",
            title: "Agency Partnership",
            subtitle: "Professional staffing services",
            description:
                "Join our network of trusted agencies. Manage your maid roster and connect with employers.",
            icon: Building2,
            colorClass:
                "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
            features: [
                "Manage your maid portfolio",
                "Receive employer inquiries",
                "Professional verification",
                "Business growth tools",
            ],
            cta: "Join as Agency",
            route: "agency.register",
            popular: true,
        },
        {
            role: "maid",
            title: "Find Employment",
            subtitle: "Start your career journey",
            description:
                "Create your professional profile and connect with families looking for household help.",
            icon: UserCheck,
            colorClass:
                "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
            features: [
                "Create professional profile",
                "Apply to job postings",
                "Build your reputation",
                "Flexible work options",
            ],
            cta: "Start Working",
            route: "register",
            popular: false,
        },
    ];

    return (
        <GuestLayout>
            <Head title="Choose Your Registration Type" />

            <div className="bg-gradient-to-br from-background via-muted/30 to-muted/50 py-12 sm:py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12 lg:mb-16">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6">
                            Join MaidMatch
                        </h1>
                        <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Choose how you'd like to use our platform. We'll
                            create the perfect experience for your needs.
                        </p>
                    </div>

                    {/* Registration Cards */}
                    <div className="grid gap-6 lg:gap-8 xl:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {registrationOptions.map((option) => (
                            <Card
                                key={option.role}
                                className={`relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-primary/30 h-full ${
                                    option.popular
                                        ? "ring-2 ring-purple-500/50 shadow-lg dark:ring-purple-400/50"
                                        : "hover:border-border"
                                }`}
                            >
                                {option.popular && (
                                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white">
                                        <Star className="w-3 h-3 mr-1" />
                                        Most Popular
                                    </Badge>
                                )}

                                <CardHeader className="text-center pb-6">
                                    <div
                                        className={`w-16 h-16 lg:w-20 lg:h-20 ${
                                            option.colorClass.split(" ")[0]
                                        } ${
                                            option.colorClass.split(" ")[2]
                                        } rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                    >
                                        <option.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                                    </div>

                                    <CardTitle className="text-xl lg:text-2xl font-bold text-foreground">
                                        {option.title}
                                    </CardTitle>

                                    <CardDescription className="text-sm lg:text-base font-medium text-muted-foreground">
                                        {option.subtitle}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex flex-col flex-grow">
                                    <div className="flex-grow space-y-6">
                                        <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                                            {option.description}
                                        </p>

                                        {/* Features List */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm lg:text-base">
                                                <Shield className="w-4 h-4 text-green-500 dark:text-green-400" />
                                                What's included:
                                            </h4>
                                            <ul className="space-y-2">
                                                {option.features.map(
                                                    (feature, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-start gap-2 text-sm lg:text-base text-muted-foreground"
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                                            <span>
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="pt-6 mt-auto">
                                        <Button
                                            asChild
                                            className={`w-full ${option.colorClass} text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl`}
                                            size="lg"
                                        >
                                            <Link href={route(option.route)}>
                                                {option.cta}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-16 lg:mt-20 text-center">
                        <div className="pt-8 border-t border-border">
                            <p className="text-muted-foreground mb-4 text-lg">
                                Already have an account?
                            </p>
                            <Button variant="outline" size="lg" asChild>
                                <Link href={route("login")}>
                                    Sign In Instead
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
