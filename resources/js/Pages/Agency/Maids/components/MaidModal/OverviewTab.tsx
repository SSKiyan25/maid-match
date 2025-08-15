import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    User,
    MapPin,
    Phone,
    Calendar,
    Briefcase,
    CheckCircle,
    Heart,
    Globe,
    Mail,
    AlertCircle,
    Languages,
    HomeIcon,
    Wallet,
    Cake,
} from "lucide-react";
import { formatDate } from "@/utils/formFunctions";
import {
    accommodationLabels,
    formatCurrency,
    getSocialMediaIcon,
} from "./helpers";
import { calculateAge, formatBirthdate } from "@/utils/useGeneralUtils";

interface OverviewTabProps {
    maid: any;
}

export default function OverviewTab({ maid }: OverviewTabProps) {
    const { profile } = maid.maid.user;
    const { maid: maidData } = maid;

    const age = calculateAge(profile.birth_date);

    return (
        <div className="p-6 pt-5">
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
                                <div className="text-sm">{maidData.bio}</div>
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
                                        Birth Date / Age
                                    </span>
                                    <div className="flex items-center text-sm">
                                        <Cake className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                        {formatBirthdate(profile.birth_date)}
                                        {age && (
                                            <span className="ml-1">
                                                ({age} years old)
                                            </span>
                                        )}
                                    </div>
                                </div>
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
                                        {profile.phone_number || "Not provided"}
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
                                            ? maidData.marital_status
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              maidData.marital_status.slice(1)
                                            : "Not specified"}
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
                                                {profile.address.street &&
                                                    `${profile.address.street}, `}
                                                {profile.address.barangay &&
                                                    `${profile.address.barangay}, `}
                                                {profile.address.city}
                                                {profile.address.province &&
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
                                        {maidData.years_experience} years
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
                                            maidData.preferred_accommodation
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
                                    maidData.skills.length > 0 ? (
                                        maidData.skills.map(
                                            (skill: any, index: any) => (
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
                                    maidData.languages.length > 0 ? (
                                        maidData.languages.map(
                                            (language: any, index: any) => (
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

                {/* Social Media Links */}
                <div className="md:col-span-2">
                    <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary/70" />
                        Social Media Profiles
                    </h3>
                    <Card>
                        <CardContent className="p-4">
                            {maidData.social_media_links &&
                            typeof maidData.social_media_links === "object" &&
                            !Array.isArray(maidData.social_media_links) &&
                            Object.keys(maidData.social_media_links).length >
                                0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(
                                        maidData.social_media_links
                                    ).map(([platform, url]) => (
                                        <a
                                            key={platform}
                                            href={url as string}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors text-sm"
                                        >
                                            {getSocialMediaIcon(platform)}
                                            <span className="ml-2 capitalize">
                                                {platform}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground italic">
                                    No social media profiles listed
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
