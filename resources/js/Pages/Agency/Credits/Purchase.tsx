import { Head } from "@inertiajs/react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { ArrowLeft, Check, Coins } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreditPackage {
    id: number;
    name: string;
    credits: number;
    price: number;
}

export default function CreditsPurchase() {
    const { creditPackages, agencyData } = usePage().props as unknown as {
        creditPackages: CreditPackage[];
        agencyData: {
            id: number;
            name: string;
        };
    };

    const [selectedPackage, setSelectedPackage] =
        useState<CreditPackage | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePurchase = () => {
        if (!selectedPackage) return;

        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            // Submit purchase form
            router.post(
                route("agency.credits.add"),
                {
                    agency_id: agencyData.id,
                    amount: selectedPackage.credits,
                    type: "purchase",
                    description: `Purchased ${selectedPackage.credits} credits (${selectedPackage.name} package)`,
                },
                {
                    onSuccess: () => {
                        toast.success("Credits purchased successfully!");
                    },
                    onError: (errors) => {
                        console.error(errors);
                        toast.error(
                            "Failed to process payment. Please try again."
                        );
                    },
                    onFinish: () => {
                        setIsProcessing(false);
                    },
                }
            );
        }, 1500);
    };

    return (
        <AgencyLayout>
            <Head title="Purchase Credits" />
            <div className="container px-4 py-6 mb-24 sm:mb-0 sm:px-6 max-w-4xl">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <a href={route("agency.credits.index")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Credits
                        </a>
                    </Button>
                    <h1 className="text-2xl font-bold">Purchase Credits</h1>
                    <p className="text-muted-foreground">
                        Buy credits to apply for job postings and access premium
                        features
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {creditPackages.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className={`cursor-pointer transition-all ${
                                selectedPackage?.id === pkg.id
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedPackage(pkg)}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{pkg.name}</CardTitle>
                                        <CardDescription>
                                            Credit Package
                                        </CardDescription>
                                    </div>
                                    {selectedPackage?.id === pkg.id && (
                                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-2 text-2xl font-bold">
                                    <Coins className="h-5 w-5 text-amber-500" />
                                    {pkg.credits} Credits
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    {pkg.credits === 10
                                        ? "Good for occasional job applications"
                                        : pkg.credits === 50
                                        ? "Perfect for regular recruiters"
                                        : "Best value for active agencies"}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <div className="text-lg font-semibold">
                                    ₱{pkg.price.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    ₱{(pkg.price / pkg.credits).toFixed(2)}
                                    /credit
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
                    <Button
                        variant="default"
                        size="lg"
                        disabled={!selectedPackage || isProcessing}
                        onClick={handlePurchase}
                    >
                        {isProcessing ? (
                            <>Processing...</>
                        ) : (
                            <>
                                Purchase {selectedPackage?.credits} Credits for
                                ₱{selectedPackage?.price.toLocaleString()}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </AgencyLayout>
    );
}
