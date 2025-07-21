import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Calendar, Award, Building2, IdCard } from "lucide-react";
import { format } from "date-fns";

export default function AgencyAbout({ agency }: any) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        About {agency.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <p className="whitespace-pre-line">{agency.description}</p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {agency.established_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    Established:{" "}
                                    {format(
                                        new Date(agency.established_at),
                                        "MMMM yyyy"
                                    )}
                                </span>
                            </div>
                        )}

                        {/* Instead of showing the license number, show license status */}
                        <div className="flex items-center gap-2">
                            <IdCard className="h-4 w-4 text-muted-foreground" />
                            <span>
                                License Status:{" "}
                                {agency.is_verified ? (
                                    <span className="text-green-600 font-semibold">
                                        Verified
                                    </span>
                                ) : (
                                    <span className="text-yellow-600 font-semibold">
                                        Pending
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    {agency.placement_fee && agency.show_fee_publicly && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                            <h3 className="font-medium mb-1">
                                Standard Placement Fee
                            </h3>
                            <p>
                                ₱
                                {parseFloat(
                                    agency.placement_fee
                                ).toLocaleString()}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
