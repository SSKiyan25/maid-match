import React, { useState } from "react";
import { Agency, User } from "@/types";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { router } from "@inertiajs/react";
import { Building2, Edit, Globe, Loader2, Mail, Shield } from "lucide-react";
import { format } from "date-fns";
import { useAgencyValidation } from "../utils/useAgencyValidation";
import { toast } from "sonner";
import { toDateInputValue } from "@/utils/formFunctions";

interface AgencyInformationProps {
    user: User;
    agency: Agency;
}

export default function AgencyInformation({
    user,
    agency,
}: AgencyInformationProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: agency.name,
        license_number: agency.license_number || "",
        license_photo_front: null as File | null,
        license_photo_back: null as File | null,
        description: agency.description || "",
        established_at: agency.established_at || "",
        business_email: agency.business_email || "",
        business_phone: agency.business_phone || "",
        website: agency.website || "",
        facebook_page: agency.facebook_page || "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const { clientErrors, isValid, sanitizedData } =
        useAgencyValidation(formData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setIsLoading(true);

        const data = new FormData();
        data.append("_method", "PATCH");
        data.append("name", sanitizedData?.name || formData.name);
        data.append(
            "license_number",
            sanitizedData?.license_number || formData.license_number
        );
        if (sanitizedData?.license_photo_front) {
            data.append(
                "license_photo_front",
                sanitizedData.license_photo_front
            );
        }
        if (sanitizedData?.license_photo_back) {
            data.append("license_photo_back", sanitizedData.license_photo_back);
        }
        data.append(
            "description",
            sanitizedData?.description || formData.description
        );
        data.append(
            "established_at",
            sanitizedData?.established_at || formData.established_at
        );
        data.append(
            "business_email",
            sanitizedData?.business_email || formData.business_email
        );
        data.append(
            "business_phone",
            sanitizedData?.business_phone || formData.business_phone
        );
        data.append("website", sanitizedData?.website || formData.website);
        data.append(
            "facebook_page",
            sanitizedData?.facebook_page || formData.facebook_page
        );

        // Default to the current user's ID
        data.append("user_id", String(user.id));

        // Only set status to "pending_verification" if license fields are changed
        const licenseChanged =
            !!sanitizedData?.license_photo_front ||
            !!sanitizedData?.license_photo_back ||
            (sanitizedData?.license_number &&
                sanitizedData.license_number !== agency.license_number);

        data.append(
            "status",
            licenseChanged
                ? "pending_verification"
                : agency.status || "pending_verification"
        );

        router.post(route("agency.settings.profile.update", agency.id), data, {
            forceFormData: true,
            onSuccess: () => {
                setIsEditing(false);
                toast.success("Agency information updated successfully!");
            },
            onError: (errors) => {
                console.error("Error updating agency info", errors);
                toast.error(
                    "Failed to update agency information. Please try again."
                );
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: agency.name,
            license_number: agency.license_number || "",
            license_photo_front: null,
            license_photo_back: null,
            description: agency.description || "",
            established_at: agency.established_at || "",
            business_email: agency.business_email || "",
            business_phone: agency.business_phone || "",
            website: agency.website || "",
            facebook_page: agency.facebook_page || "",
        });
    };

    const handleFileChange =
        (field: "license_photo_front" | "license_photo_back") =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({
                ...prev,
                [field]: e.target.files?.[0] || null,
            }));
        };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Not specified";
        return format(new Date(dateString), "MMM dd, yyyy");
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    Agency Information
                </CardTitle>
                <CardDescription>
                    Update your agency details and business information
                </CardDescription>
            </CardHeader>

            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Agency Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className={
                                    clientErrors.name ? "border-red-500" : ""
                                }
                                disabled={isLoading}
                            />
                            {clientErrors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {clientErrors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="license_number">
                                License Number
                            </Label>
                            <Input
                                id="license_number"
                                value={formData.license_number}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        license_number: e.target.value,
                                    }))
                                }
                                className={
                                    clientErrors.license_number
                                        ? "border-red-500"
                                        : ""
                                }
                                disabled={isLoading}
                            />
                            {clientErrors.license_number && (
                                <p className="text-red-500 text-sm mt-1">
                                    {clientErrors.license_number}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="license_photo_front">
                                    License Photo (Front)
                                </Label>
                                <Input
                                    id="license_photo_front"
                                    type="file"
                                    onChange={handleFileChange(
                                        "license_photo_front"
                                    )}
                                    accept="image/*,.pdf"
                                    className={
                                        clientErrors.license_photo_front
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isLoading}
                                />
                                {clientErrors.license_photo_front && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {clientErrors.license_photo_front}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="license_photo_back">
                                    License Photo (Back)
                                </Label>
                                <Input
                                    id="license_photo_back"
                                    type="file"
                                    onChange={handleFileChange(
                                        "license_photo_back"
                                    )}
                                    accept="image/*,.pdf"
                                    className={
                                        clientErrors.license_photo_back
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isLoading}
                                />
                                {clientErrors.license_photo_back && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {clientErrors.license_photo_back}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Agency Description
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                rows={4}
                                className={
                                    clientErrors.description
                                        ? "border-red-500"
                                        : ""
                                }
                                disabled={isLoading}
                            />
                            {clientErrors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {clientErrors.description}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="established_at">
                                    Established Date
                                </Label>
                                <Input
                                    id="established_at"
                                    type="date"
                                    value={toDateInputValue(
                                        formData.established_at
                                    )}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            established_at: e.target.value,
                                        }))
                                    }
                                    className={
                                        clientErrors.established_at
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isLoading}
                                />
                                {clientErrors.established_at && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {clientErrors.established_at}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="business_email">
                                    Business Email
                                </Label>
                                <Input
                                    id="business_email"
                                    type="email"
                                    value={formData.business_email}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            business_email: e.target.value,
                                        }))
                                    }
                                    className={
                                        clientErrors.business_email
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isLoading}
                                />
                                {clientErrors.business_email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {clientErrors.business_email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="business_phone">
                                    Business Phone
                                </Label>
                                <Input
                                    id="business_phone"
                                    value={formData.business_phone}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            business_phone: e.target.value,
                                        }))
                                    }
                                    className={
                                        clientErrors.business_phone
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isLoading}
                                />
                                {clientErrors.business_phone && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {clientErrors.business_phone}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={formData.website}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            website: e.target.value,
                                        }))
                                    }
                                    className={
                                        clientErrors.website
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isLoading}
                                />
                                {clientErrors.website && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {clientErrors.website}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="facebook_page">Facebook Page</Label>
                            <Input
                                id="facebook_page"
                                value={formData.facebook_page}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        facebook_page: e.target.value,
                                    }))
                                }
                                className={
                                    clientErrors.facebook_page
                                        ? "border-red-500"
                                        : ""
                                }
                                disabled={isLoading}
                            />
                            {clientErrors.facebook_page && (
                                <p className="text-red-500 text-sm mt-1">
                                    {clientErrors.facebook_page}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !isValid}>
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            ) : (
                <>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Building2 className="text-muted-foreground h-5 w-5" />
                                <h3 className="font-medium">Agency Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7 pt-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Agency Name
                                    </p>
                                    <p className="font-medium">{agency.name}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        License Number
                                    </p>
                                    <p className="font-medium">
                                        {agency.license_number ||
                                            "Not specified"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Verification Status
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Shield
                                            className={`h-4 w-4 ${
                                                agency.is_verified
                                                    ? "text-green-500"
                                                    : "text-amber-500"
                                            }`}
                                        />
                                        <p className="font-medium">
                                            {agency.is_verified
                                                ? "Verified"
                                                : "Pending Verification"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Established Date
                                    </p>
                                    <p className="font-medium">
                                        {agency.established_at
                                            ? formatDate(agency.established_at)
                                            : "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Mail className="text-muted-foreground h-5 w-5" />
                                <h3 className="font-medium">
                                    Contact Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7 pt-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Business Email
                                    </p>
                                    <p className="font-medium">
                                        {agency.business_email ||
                                            "Not specified"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Business Phone
                                    </p>
                                    <p className="font-medium">
                                        {agency.business_phone ||
                                            "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Globe className="text-muted-foreground h-5 w-5" />
                                <h3 className="font-medium">Online Presence</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7 pt-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Website
                                    </p>
                                    <p className="font-medium text-xs sm:text-sm">
                                        {agency.website ? (
                                            <a
                                                href={agency.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {agency.website}
                                            </a>
                                        ) : (
                                            "Not specified"
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Facebook Page
                                    </p>
                                    <p className="font-medium text-xs sm:text-sm">
                                        {agency.facebook_page ? (
                                            <a
                                                href={agency.facebook_page}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {agency.facebook_page}
                                            </a>
                                        ) : (
                                            "Not specified"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {agency.description && (
                            <div className="space-y-2 pt-4">
                                <h3 className="font-medium">
                                    About the Agency
                                </h3>
                                <p className="text-sm">{agency.description}</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Information
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}
