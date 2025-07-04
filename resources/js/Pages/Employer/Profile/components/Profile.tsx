import { useState } from "react";
import { router } from "@inertiajs/react";
import { Edit, Loader2, User as UserIcon } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Profile, ProfileAddress } from "../utils/types";
import {
    useProfileValidation,
    ProfileFormData,
} from "../utils/useProfileValidation";
import ErrorDisplay from "./ErrorDisplay";
import { toast } from "sonner";

interface ProfileComponentProps {
    profile: Profile;
}

export default function ProfileComponent({ profile }: ProfileComponentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number || "",
        is_phone_private: profile.is_phone_private,
        birth_date: profile.birth_date || "",
        address: profile.address || {
            street: "",
            barangay: "",
            city: "",
            province: "",
        },
        is_address_private: profile.is_address_private,
        preferred_language: profile.preferred_language || "",
        preferred_contact_methods: profile.preferred_contact_methods || [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const { clientErrors, isValid, sanitizedData } =
        useProfileValidation(formData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check validation before submitting
        if (!isValid) {
            return;
        }

        setIsLoading(true);

        const dataToSubmit = sanitizedData || formData;
        const { address, ...rest } = dataToSubmit;
        const payload = {
            ...rest,
            "address[street]": address.street,
            "address[barangay]": address.barangay,
            "address[city]": address.city,
            "address[province]": address.province,
        };

        router.patch(route("employer.profile.profile.update"), payload, {
            onSuccess: () => {
                setIsEditing(false);
                toast.success("Profile information updated successfully!");
            },
            onError: (errors) => {
                console.error("Server validation errors:", errors);
                toast.error("There was a problem updating your profile.");
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone_number: profile.phone_number || "",
            is_phone_private: profile.is_phone_private,
            birth_date: profile.birth_date || "",
            address: profile.address || {
                street: "",
                barangay: "",
                city: "",
                province: "",
            },
            is_address_private: profile.is_address_private,
            preferred_language: profile.preferred_language || "",
            preferred_contact_methods: profile.preferred_contact_methods || [],
        });
    };

    const formatAddress = (address: ProfileAddress | null) => {
        if (!address) return "Not provided";
        const parts = [
            address.street,
            address.barangay,
            address.city,
            address.province,
        ].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : "Not provided";
    };

    function formatDateForInput(dateString?: string) {
        if (!dateString) return "";
        return new Date(dateString).toISOString().slice(0, 10);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription className="text-xs text-center sm:text-left pt-2">
                            Update your personal details and contact information
                        </CardDescription>
                    </div>
                    {!isEditing && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="self-start sm:self-auto"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {!isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">
                                First Name
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {profile.first_name}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">
                                Last Name
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {profile.last_name}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">
                                Phone Number
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {profile.phone_number || "Not provided"}
                                {profile.is_phone_private && " (Private)"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                    Birth Date
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {profile.birth_date
                                        ? new Date(
                                              profile.birth_date
                                          ).toLocaleDateString(undefined, {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "Not provided"}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <Label className="text-sm font-medium">
                                Address
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {formatAddress(profile.address ?? null)}
                                {profile.is_address_private && " (Private)"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">
                                Preferred Language
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {profile.preferred_language || "Not specified"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name *</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            first_name: e.target.value,
                                        }))
                                    }
                                    disabled={isLoading}
                                    required
                                />
                                <ErrorDisplay
                                    errors={clientErrors}
                                    fieldName="first_name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name *</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            last_name: e.target.value,
                                        }))
                                    }
                                    disabled={isLoading}
                                    required
                                />
                                <ErrorDisplay
                                    errors={clientErrors}
                                    fieldName="last_name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone_number">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    value={formData.phone_number}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            phone_number: e.target.value,
                                        }))
                                    }
                                    disabled={isLoading}
                                />
                                <ErrorDisplay
                                    errors={clientErrors}
                                    fieldName="phone_number"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birth_date">Birth Date</Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={formatDateForInput(
                                        formData.birth_date
                                    )}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            birth_date: e.target.value,
                                        }))
                                    }
                                    disabled={isLoading}
                                />
                                <ErrorDisplay
                                    errors={clientErrors}
                                    fieldName="birth_date"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base font-medium">
                                Address
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="street">Street</Label>
                                    <Input
                                        id="street"
                                        value={formData.address?.street || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                address: {
                                                    ...prev.address,
                                                    street: e.target.value,
                                                },
                                            }))
                                        }
                                        disabled={isLoading}
                                    />
                                    <ErrorDisplay
                                        errors={clientErrors}
                                        fieldName="address_street"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="barangay">Barangay</Label>
                                    <Input
                                        id="barangay"
                                        value={formData.address?.barangay || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                address: {
                                                    ...prev.address,
                                                    barangay: e.target.value,
                                                },
                                            }))
                                        }
                                        disabled={isLoading}
                                    />
                                    <ErrorDisplay
                                        errors={clientErrors}
                                        fieldName="address_barangay"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.address?.city || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                address: {
                                                    ...prev.address,
                                                    city: e.target.value,
                                                },
                                            }))
                                        }
                                        disabled={isLoading}
                                    />
                                    <ErrorDisplay
                                        errors={clientErrors}
                                        fieldName="address_city"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="province">Province</Label>
                                    <Input
                                        id="province"
                                        value={formData.address?.province || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                address: {
                                                    ...prev.address,
                                                    province: e.target.value,
                                                },
                                            }))
                                        }
                                        disabled={isLoading}
                                    />
                                    <ErrorDisplay
                                        errors={clientErrors}
                                        fieldName="address_province"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="preferred_language">
                                Preferred Language
                            </Label>
                            <Input
                                id="preferred_language"
                                value={formData.preferred_language}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        preferred_language: e.target.value,
                                    }))
                                }
                                disabled={isLoading}
                                placeholder="e.g., English, Filipino, etc."
                            />
                            <ErrorDisplay
                                errors={clientErrors}
                                fieldName="preferred_language"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-medium">
                                Privacy Settings
                            </Label>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_phone_private"
                                        checked={formData.is_phone_private}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                is_phone_private: !!checked,
                                            }))
                                        }
                                        disabled={isLoading}
                                    />
                                    <Label
                                        htmlFor="is_phone_private"
                                        className="text-sm"
                                    >
                                        Keep phone number private
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_address_private"
                                        checked={formData.is_address_private}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                is_address_private: !!checked,
                                            }))
                                        }
                                        disabled={isLoading}
                                    />
                                    <Label
                                        htmlFor="is_address_private"
                                        className="text-sm"
                                    >
                                        Keep address private
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                type="submit"
                                disabled={isLoading || !isValid}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
