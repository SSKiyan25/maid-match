import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Badge } from "@/Components/ui/badge";
import { Baby, Cat, Dog, Home, Info } from "lucide-react";

export default function HouseholdDetails({ employer }: any) {
    const { children, pets, household_description, family_size } = employer;

    return (
        <div className="space-y-6">
            {/* Household Description */}
            {household_description && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            About the Household
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{household_description}</p>
                    </CardContent>
                </Card>
            )}

            {/* Children */}
            {children?.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Baby className="h-4 w-4" />
                            Children
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {children.map((child: any, index: any) => (
                            <div key={child.id} className="pb-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {Math.floor(child.age)}{" "}
                                            {Math.floor(child.age) === 1
                                                ? "year"
                                                : "years"}{" "}
                                            old
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {child.gender || "Not specified"}
                                        </span>
                                    </div>
                                </div>
                                {child.notes && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {child.notes}
                                    </p>
                                )}
                                {index < children.length - 1 && (
                                    <Separator className="mt-2" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Pets */}
            {pets?.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            {pets.some((pet: any) => pet.type === "cat") &&
                            pets.some((pet: any) => pet.type === "dog") ? (
                                <span className="flex">
                                    <Cat className="h-4 w-4 mr-1" />
                                    <Dog className="h-4 w-4" />
                                </span>
                            ) : pets.some((pet: any) => pet.type === "cat") ? (
                                <Cat className="h-4 w-4" />
                            ) : (
                                <Dog className="h-4 w-4" />
                            )}
                            Pets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {pets.map((pet: any, index: number) => (
                            <div key={pet.id} className="pb-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="capitalize"
                                        >
                                            {pet.type}
                                        </Badge>
                                        <span className="text-sm">
                                            {pet.display_name ||
                                                pet.name ||
                                                pet.type_label}
                                        </span>
                                    </div>
                                    {pet.care_complexity && (
                                        <Badge
                                            variant={
                                                pet.care_complexity === "high"
                                                    ? "destructive"
                                                    : pet.care_complexity ===
                                                      "medium"
                                                    ? "secondary"
                                                    : "outline"
                                            }
                                        >
                                            {pet.care_complexity} care
                                        </Badge>
                                    )}
                                </div>
                                {pet.notes && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {pet.notes}
                                    </p>
                                )}
                                {index < pets.length - 1 && (
                                    <Separator className="mt-2" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* If no data is available */}
            {!household_description && !children?.length && !pets?.length && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">
                        No additional information
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-1">
                        This employer hasn't provided detailed information about
                        their household yet.
                    </p>
                </div>
            )}
        </div>
    );
}
