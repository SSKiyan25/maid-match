import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Eye, Edit, X, Star, CheckCircle } from "lucide-react";
import { MaidData } from "@/types";
import { router } from "@inertiajs/react";
import { getStatusColor } from "./helpers";
import OverviewTab from "./OverviewTab";
import DocumentsTab from "./DocumentsTab";
import AgencyTab from "./AgencyTab";
import PhotosTab from "./PhotosTab";

interface MaidViewModalProps {
    maid: MaidData;
}

export default function MaidViewModal({ maid }: MaidViewModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Destructure for easier access
    const { profile } = maid.maid.user;
    const { maid: maidData } = maid;

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => setIsOpen(true)}
                        >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            View
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View maid details</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
                    <DialogHeader className="p-6 pb-2 sticky top-0 bg-background z-10">
                        {/* Add this hidden description for accessibility */}
                        <DialogDescription className="sr-only">
                            Maid profile details for {profile.first_name}{" "}
                            {profile.last_name}
                        </DialogDescription>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg overflow-hidden">
                                    {maid.maid.user.avatar ? (
                                        <img
                                            src={`/storage/${maid.maid.user.avatar.replace(
                                                /^\/+/,
                                                ""
                                            )}`}
                                            alt={`${profile.first_name} ${profile.last_name}`}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        `${profile.first_name.charAt(
                                            0
                                        )}${profile.last_name.charAt(0)}`
                                    )}
                                </div>
                                <div>
                                    <DialogTitle className="text-xl">
                                        {profile.first_name} {profile.last_name}
                                    </DialogTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                            className={`${getStatusColor(
                                                maidData.status
                                            )} capitalize font-medium`}
                                        >
                                            {maidData.status}
                                        </Badge>
                                        {maid.is_premium && (
                                            <Badge
                                                variant="outline"
                                                className="bg-amber-50 text-amber-600 border-amber-200"
                                            >
                                                <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                                                Premium
                                            </Badge>
                                        )}
                                        {maid.is_trained && (
                                            <Badge
                                                variant="outline"
                                                className="bg-indigo-50 text-indigo-600 border-indigo-200"
                                            >
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Trained
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <Tabs
                        defaultValue="overview"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <div className="px-6 border-b sticky top-[82px] bg-background z-10">
                            <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-4">
                                <TabsTrigger
                                    value="overview"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-1 py-3"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="documents"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-1 py-3"
                                >
                                    Documents ({maidData.documents.length})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="photos"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-1 py-3"
                                >
                                    Photos
                                </TabsTrigger>
                                <TabsTrigger
                                    value="agency"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-1 py-3"
                                >
                                    Agency Details
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Overview Tab */}
                        <TabsContent
                            value="overview"
                            className="focus-visible:outline-none focus-visible:ring-0"
                        >
                            <OverviewTab maid={maid} />
                        </TabsContent>

                        {/* Documents Tab */}
                        <TabsContent
                            value="documents"
                            className="focus-visible:outline-none focus-visible:ring-0"
                        >
                            <DocumentsTab documents={maidData.documents} />
                        </TabsContent>

                        {/* Photos Tab */}
                        <TabsContent
                            value="photos"
                            className="focus-visible:outline-none focus-visible:ring-0"
                        >
                            <PhotosTab maid={maid} />
                        </TabsContent>

                        {/* Agency Details Tab */}
                        <TabsContent
                            value="agency"
                            className="focus-visible:outline-none focus-visible:ring-0"
                        >
                            <AgencyTab maid={maid} />
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="px-6 py-4 border-t flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsOpen(false);
                                router.visit(
                                    route("agency.maids.edit", maid.id)
                                );
                            }}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                        <Button onClick={() => setIsOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
