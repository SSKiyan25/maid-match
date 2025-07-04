import { useState } from "react";
import { router } from "@inertiajs/react";
import { Edit, Loader2, Home } from "lucide-react";
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
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import { Employer } from "../utils/types";
import {
    useEmployerValidation,
    EmployerFormData,
} from "../utils/useEmployerValidation";
import ErrorDisplay from "./ErrorDisplay";
import { toast } from "sonner";
interface EmployerComponentProps {
    employer: Employer;
}

export default function EmployerComponent({
    employer,
}: EmployerComponentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<EmployerFormData>({
        household_description: employer.household_description || "",
        family_size: employer.family_size || 1,
        has_children: employer.has_children,
        has_pets: employer.has_pets,
        status: employer.status,
        maid_preferences: employer.maid_preferences || [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const { clientErrors, isValid, sanitizedData } =
        useEmployerValidation(formData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check validation before submitting
        if (!isValid) {
            return;
        }

        setIsLoading(true);

        const safeData = sanitizedData ?? formData;
        const dataToSubmit = {
            ...safeData,
            maid_preferences: JSON.stringify(safeData.maid_preferences ?? []),
        };

        router.patch(route("employer.profile.employer.update"), dataToSubmit, {
            onSuccess: () => {
                setIsEditing(false);
                toast.success("Household information updated successfully!");
            },
            onError: (errors) => {
                console.error("Server validation errors:", errors);
                toast.error(
                    "There was a problem updating your household information."
                );
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            household_description: employer.household_description || "",
            family_size: employer.family_size || 1,
            has_children: employer.has_children,
            has_pets: employer.has_pets,
            status: employer.status,
            maid_preferences: employer.maid_preferences || [],
        });
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "active":
                return "default";
            case "looking":
                return "secondary";
            case "fulfilled":
                return "outline";
            default:
                return "default";
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Home className="h-5 w-5" />
                            Household Information
                        </CardTitle>
                        <CardDescription className="pt-2 text-xs sm:text-sm text-center sm:text-left">
                            Manage your household details and hiring preferences
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
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                    Family Size
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {employer.family_size
                                        ? `${employer.family_size} members`
                                        : "Not specified"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                    Status
                                </Label>
                                <div>
                                    <Badge
                                        variant={getStatusBadgeVariant(
                                            employer.status
                                        )}
                                    >
                                        {employer.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            employer.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                    Has Children
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {employer.has_children ? "Yes" : "No"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                    Has Pets
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {employer.has_pets ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm font-medium">
                                Household Description
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {employer.household_description ||
                                    "No description provided"}
                            </p>
                        </div>

                        {employer.maid_preferences &&
                            employer.maid_preferences.length > 0 && (
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium">
                                        Maid Preferences
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {employer.maid_preferences.map(
                                            (preference, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                >
                                                    {preference}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="family_size">Family Size</Label>
                                <Input
                                    id="family_size"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={formData.family_size}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            family_size:
                                                parseInt(e.target.value) || 1,
                                        }))
                                    }
                                />
                                <ErrorDisplay
                                    errors={clientErrors}
                                    fieldName="family_size"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(
                                        value:
                                            | "active"
                                            | "looking"
                                            | "fulfilled"
                                    ) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            status: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="looking">
                                            Looking
                                        </SelectItem>
                                        <SelectItem value="fulfilled">
                                            Fulfilled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <ErrorDisplay
                                    errors={clientErrors}
                                    fieldName="status"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="household_description">
                                Household Description
                            </Label>
                            <Textarea
                                id="household_description"
                                value={formData.household_description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        household_description: e.target.value,
                                    }))
                                }
                                placeholder="Describe your household, daily routines, special requirements, etc."
                                rows={4}
                            />
                            <ErrorDisplay
                                errors={clientErrors}
                                fieldName="household_description"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-medium">
                                Household Features
                            </Label>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="has_children"
                                        checked={formData.has_children}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                has_children: !!checked,
                                            }))
                                        }
                                    />
                                    <Label
                                        htmlFor="has_children"
                                        className="text-sm"
                                    >
                                        We have children
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="has_pets"
                                        checked={formData.has_pets}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                has_pets: !!checked,
                                            }))
                                        }
                                    />
                                    <Label
                                        htmlFor="has_pets"
                                        className="text-sm"
                                    >
                                        We have pets
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
