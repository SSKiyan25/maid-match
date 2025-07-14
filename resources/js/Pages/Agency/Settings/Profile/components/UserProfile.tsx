import React, { useState } from "react";
import { User, Agency } from "@/types";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
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
import { router } from "@inertiajs/react";
import { Edit, Loader2 } from "lucide-react";
import { useUserValidation } from "../utils/useUserValidation";
import { toast } from "sonner";

interface UserProfileProps {
    user: User;
    agency?: Agency;
}

export default function UserProfile({ user, agency }: UserProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: user.email,
        password: "",
        password_confirmation: "",
        avatar: null as File | null,
    });
    const [isLoading, setIsLoading] = useState(false);

    const { clientErrors, isValid, sanitizedData } =
        useUserValidation(formData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
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

        router.post(route("agency.settings.profile.user.update"), data, {
            forceFormData: true,
            onSuccess: () => {
                setIsEditing(false);
                setFormData((prev) => ({
                    ...prev,
                    password: "",
                    password_confirmation: "",
                    avatar: null,
                }));
                toast.success("Profile updated successfully!");
            },
            onError: (errors) => {
                console.error("Error updating profile", errors);
                toast.error("Failed to update profile. Please try again.");
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            avatar: e.target.files?.[0] || null,
        }));
    };

    const getInitials = (name: string | undefined) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    User Profile
                </CardTitle>
                <CardDescription>
                    Update your email address, password, and profile picture
                </CardDescription>
            </CardHeader>

            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
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
                                className={
                                    clientErrors.email ? "border-red-500" : ""
                                }
                            />
                            {clientErrors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {clientErrors.email}
                                </p>
                            )}
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
                                className="sm:text-sm text-xs"
                                placeholder="Leave empty to keep current password"
                                disabled={isLoading}
                            />
                            {clientErrors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {clientErrors.password}
                                </p>
                            )}
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
                                    className="sm:text-sm text-xs"
                                    disabled={isLoading}
                                />
                                {clientErrors.password_confirmation && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {clientErrors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="avatar">Profile Picture</Label>
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                    {formData.avatar ? (
                                        <AvatarImage
                                            src={
                                                formData.avatar
                                                    ? URL.createObjectURL(
                                                          formData.avatar
                                                      )
                                                    : user.avatar
                                                    ? `/storage/${user.avatar}`
                                                    : ""
                                            }
                                            alt={agency?.name || "Profile"}
                                        />
                                    ) : (
                                        <>
                                            <AvatarImage
                                                src={
                                                    user.avatar
                                                        ? `/storage/${user.avatar}`
                                                        : ""
                                                }
                                                alt={agency?.name || "Profile"}
                                            />
                                            <AvatarFallback>
                                                {getInitials(agency?.name)}
                                            </AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isLoading}
                                    className={
                                        clientErrors.avatar
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                            </div>
                            {clientErrors.avatar && (
                                <p className="text-red-500 text-sm mt-1">
                                    {clientErrors.avatar}
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
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage
                                    src={
                                        user.avatar
                                            ? `/storage/${user.avatar}`
                                            : ""
                                    }
                                    alt={agency?.name || "Profile"}
                                />
                                <AvatarFallback>
                                    {getInitials(agency?.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-1">
                                <p className="font-medium">
                                    {agency?.name || "No name"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}
