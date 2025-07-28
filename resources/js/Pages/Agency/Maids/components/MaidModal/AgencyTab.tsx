import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { MaidData } from "@/types";
import {
    Calendar,
    Clock,
    FileText,
    PhilippinePeso,
    CheckCircle,
} from "lucide-react";
import { formatDate } from "@/utils/formFunctions";
import { formatCurrency } from "./helpers";

interface AgencyTabProps {
    maid: MaidData;
}

export default function AgencyTab({ maid }: AgencyTabProps) {
    return (
        <div className="p-6 pt-5 space-y-6">
            <Card>
                <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">
                                Agency Fee
                            </span>
                            <div className="flex items-center text-sm">
                                <PhilippinePeso className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                {maid.agency_fee
                                    ? formatCurrency(maid.agency_fee)
                                    : "Not set"}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">
                                Agency Status
                            </span>
                            <div className="flex items-center text-sm">
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                <Badge variant="outline" className="capitalize">
                                    {maid.maid.status}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">
                                Assigned Date
                            </span>
                            <div className="flex items-center text-sm">
                                <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                {formatDate(maid.maid.assigned_at)}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">
                                Last Updated
                            </span>
                            <div className="flex items-center text-sm">
                                <Clock className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                {formatDate(maid.updated_at)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Agency Notes */}
            <div>
                <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary/70" />
                    Agency Notes
                </h3>
                <Card>
                    <CardContent className="p-4">
                        {maid.maid.agency_notes ? (
                            <div className="text-sm whitespace-pre-line">
                                {maid.maid.agency_notes}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground italic">
                                No agency notes
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
