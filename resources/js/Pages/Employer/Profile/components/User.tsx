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
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { User } from "../utils/types";
import { useUserValidation, UserFormData } from "../utils/useUserValidation";
import ErrorDisplay from "./ErrorDisplay";
import { toast } from "sonner";

interface UserComponentProps {
    user: User;
}

export default function UserComponent({ user }: UserComponentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        email: user.email,
        password: "",
        password_confirmation: "",
        avatar: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { clientErrors, isValid, sanitizedData } =
        useUserValidation(formData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Check validation before submitting
        if (!isValid) {
            return;
        }
        setIsLoading(true);

        const data = new FormData();
        data.append("_method", "PATCH");
        data.append("email", sanitizedData?.email || formData.email);
        if (sanitizedData?.password) {
            data.append("password", sanitizedData.password);
            data.append(
                "password_confirmation",
                sanitizedData.password_confirmation
            );
        }
        if (sanitizedData?.avatar) {
            data.append("avatar", sanitizedData.avatar);
        }

        router.post(route("employer.profile.user.update"), data, {
            forceFormData: true,
            onSuccess: () => {
                setIsEditing(false);
                setFormData((prev) => ({
                    ...prev,
                    password: "",
                    password_confirmation: "",
                    avatar: null,
                }));
                toast.success("Account information updated successfully!");
            },
            onError: (errors) => {
                console.error("Server validation errors:", errors);
                toast.error("There was a problem updating your account.");
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            email: user.email,
            password: "",
            password_confirmation: "",
            avatar: null,
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            Account Information
                        </CardTitle>
                        <CardDescription className="text-xs pt-2">
                            Update your email, password, and profile picture
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
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16 border-2 border-muted shadow-md">
                            <AvatarImage
                                src={
                                    user.avatar
                                        ? `/storage/${user.avatar}`
                                        : undefined
                                }
                                alt="Profile picture"
                            />
                            <AvatarFallback>
                                {user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">
                                Email Address
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }))
                                }
                                disabled={isLoading}
                                required
                            />
                            <ErrorDisplay
                                errors={clientErrors}
                                fieldName="email"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                New Password (optional)
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        password: e.target.value,
                                    }))
                                }
                                placeholder="Leave empty to keep current password"
                                disabled={isLoading}
                            />
                            <ErrorDisplay
                                errors={clientErrors}
                                fieldName="password"
                            />
                        </div>

                        {formData.password && (
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={formData.password_confirmation}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            password_confirmation:
                                                e.target.value,
                                        }))
                                    }
                                    disabled={isLoading}
                                />
                                <ErrorDisplay
                                    errors={clientErrors}
                                    fieldName="password_confirmation"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="avatar">Profile Picture</Label>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        avatar: e.target.files?.[0] || null,
                                    }))
                                }
                                disabled={isLoading}
                            />
                            <ErrorDisplay
                                errors={clientErrors}
                                fieldName="avatar"
                            />
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
