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
import { Card, CardContent } from "@/Components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    User,
    MapPin,
    Phone,
    Calendar,
    Briefcase,
    FileText,
    Star,
    PhilippinePeso,
    Languages,
    HomeIcon,
    Heart,
    Globe,
    Mail,
    AlertCircle,
    CheckCircle,
    X,
    Clock,
    Wallet,
    Download,
    Eye,
    FileCheck,
    FileBadge,
    Edit,
} from "lucide-react";
import { MaidData } from "@/types";
import { formatDate } from "@/utils/formFunctions";
import { router } from "@inertiajs/react";

interface MaidViewModalProps {
    maid: MaidData;
}

export default function MaidViewModal({ maid }: MaidViewModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Format currency
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(parseFloat(amount));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "bg-green-500/15 text-green-600 border-green-200";
            case "employed":
                return "bg-blue-500/15 text-blue-600 border-blue-200";
            case "unavailable":
                return "bg-red-500/15 text-red-600 border-red-200";
            default:
                return "bg-gray-500/15 text-gray-600 border-gray-200";
        }
    };

    const accommodationLabels: Record<string, string> = {
        live_in: "Live-in",
        live_out: "Live-out",
        either: "Either live-in or live-out",
    };

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
                                    {/* Keep your badges but change from DialogDescription to div */}
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
                            className="p-6 pt-5 focus-visible:outline-none focus-visible:ring-0"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Bio Section */}
                                <div className="md:col-span-2">
                                    <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary/70" />
                                        Bio
                                    </h3>
                                    <Card>
                                        <CardContent className="p-4">
                                            {maidData.bio ? (
                                                <div className="text-sm">
                                                    {maidData.bio}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-muted-foreground italic">
                                                    No bio provided
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary/70" />
                                        Personal Information
                                    </h3>
                                    <Card>
                                        <CardContent className="p-4 space-y-3">
                                            <div className="grid grid-cols-1 gap-3">
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Email
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {maid.maid.user.email}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Phone
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <Phone className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {profile.phone_number ||
                                                            "Not provided"}
                                                        {maid.is_phone_private && (
                                                            <Badge
                                                                variant="outline"
                                                                className="ml-2 text-xs"
                                                            >
                                                                Private
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Nationality
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <Globe className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {maidData.nationality ||
                                                            "Not specified"}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Family Status
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <Heart className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {maidData.marital_status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            maidData.marital_status.slice(
                                                                1
                                                            )}
                                                        {maidData.has_children &&
                                                            ", has children"}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Address
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {profile.address ? (
                                                            <div className="flex items-center flex-wrap">
                                                                {profile.address
                                                                    .street &&
                                                                    `${profile.address.street}, `}
                                                                {profile.address
                                                                    .barangay &&
                                                                    `${profile.address.barangay}, `}
                                                                {
                                                                    profile
                                                                        .address
                                                                        .city
                                                                }
                                                                {profile.address
                                                                    .province &&
                                                                    `, ${profile.address.province}`}
                                                                {maid.is_address_private && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="ml-2 text-xs"
                                                                    >
                                                                        Private
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            "No address provided"
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Emergency Contact
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {maidData.emergency_contact_name ? (
                                                            <span>
                                                                {
                                                                    maidData.emergency_contact_name
                                                                }{" "}
                                                                (
                                                                {
                                                                    maidData.emergency_contact_phone
                                                                }
                                                                )
                                                            </span>
                                                        ) : (
                                                            "Not provided"
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Professional Information */}
                                <div>
                                    <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-primary/70" />
                                        Professional Information
                                    </h3>
                                    <Card>
                                        <CardContent className="p-4 space-y-3">
                                            <div className="grid grid-cols-1 gap-3">
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Experience
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <Briefcase className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {
                                                            maidData.years_experience
                                                        }{" "}
                                                        years
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Expected Salary
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <Wallet className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {formatCurrency(
                                                            maidData.expected_salary
                                                        )}
                                                        /month
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Earliest Start Date
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {formatDate(
                                                            maidData.earliest_start_date
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Accommodation
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <HomeIcon className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {accommodationLabels[
                                                            maidData
                                                                .preferred_accommodation
                                                        ] || "Not specified"}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                        Willing to Relocate
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                        {maidData.is_willing_to_relocate
                                                            ? "Yes"
                                                            : "No"}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Skills & Languages */}
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Skills */}
                                    <div>
                                        <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary/70" />
                                            Skills
                                        </h3>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {maidData.skills &&
                                                    maidData.skills.length >
                                                        0 ? (
                                                        maidData.skills.map(
                                                            (skill, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="secondary"
                                                                    className="text-xs font-normal"
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="text-sm text-muted-foreground italic">
                                                            No skills listed
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Languages */}
                                    <div>
                                        <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                                            <Languages className="h-4 w-4 text-primary/70" />
                                            Languages
                                        </h3>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {maidData.languages &&
                                                    maidData.languages.length >
                                                        0 ? (
                                                        maidData.languages.map(
                                                            (
                                                                language,
                                                                index
                                                            ) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="outline"
                                                                    className="text-xs font-normal capitalize"
                                                                >
                                                                    {language}
                                                                </Badge>
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="text-sm text-muted-foreground italic">
                                                            No languages listed
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Documents Tab */}
                        <TabsContent
                            value="documents"
                            className="p-6 pt-5 focus-visible:outline-none focus-visible:ring-0"
                        >
                            <div className="space-y-4">
                                {maidData.documents.length > 0 ? (
                                    maidData.documents.map((doc, index) => (
                                        <Card key={index}>
                                            <CardContent className="p-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                    <div className="flex items-center gap-2 min-w-[90px]">
                                                        {[
                                                            "id",
                                                            "passport",
                                                            "medical",
                                                            "police",
                                                        ].includes(doc.type) ? (
                                                            <FileCheck className="h-5 w-5 text-green-500" />
                                                        ) : (
                                                            <FileBadge className="h-5 w-5 text-blue-500" />
                                                        )}
                                                        <span className="font-medium capitalize">
                                                            {doc.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold">
                                                            {doc.title}
                                                        </div>
                                                        {doc.description && (
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                {
                                                                    doc.description
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                                        <a
                                                            href={doc.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                            View
                                                        </a>
                                                        <a
                                                            href={doc.url}
                                                            download
                                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                                                        >
                                                            <Download className="h-3.5 w-3.5 mr-1.5" />
                                                            Download
                                                        </a>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                                        <p className="text-muted-foreground">
                                            No documents uploaded
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Agency Details Tab */}
                        <TabsContent
                            value="agency"
                            className="p-6 pt-5 focus-visible:outline-none focus-visible:ring-0"
                        >
                            <div className="space-y-6">
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
                                                        ? formatCurrency(
                                                              maid.agency_fee
                                                          )
                                                        : "Not set"}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                    Agency Status
                                                </span>
                                                <div className="flex items-center text-sm">
                                                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                    <Badge
                                                        variant="outline"
                                                        className="capitalize"
                                                    >
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
                                                    {formatDate(
                                                        maid.maid.assigned_at
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-muted-foreground block mb-1">
                                                    Last Updated
                                                </span>
                                                <div className="flex items-center text-sm">
                                                    <Clock className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                    {formatDate(
                                                        maid.updated_at
                                                    )}
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
