import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Loader2, Baby } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { EmployerChild } from "../utils/types";
import { useChildValidation, ChildFormData } from "../utils/useChildValidation";
import ErrorDisplay from "./ErrorDisplay";
import ConfirmDelete from "./ConfirmDelete";

import { toast } from "sonner";

interface ChildComponentProps {
    children: EmployerChild[];
}

export default function ChildComponent({ children }: ChildComponentProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingChild, setEditingChild] = useState<EmployerChild | null>(
        null
    );
    const [formData, setFormData] = useState<ChildFormData>({
        name: "",
        birth_date: "",
        photo_url: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { clientErrors, isValid, sanitizedData } =
        useChildValidation(formData);

    const resetForm = () => {
        setFormData({
            name: "",
            birth_date: "",
            photo_url: null,
        });
        setEditingChild(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check validation before submitting
        if (!isValid) {
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append("name", sanitizedData?.name || formData.name);
        data.append(
            "birth_date",
            sanitizedData?.birth_date || formData.birth_date
        );
        if (sanitizedData?.photo_url) {
            data.append("photo_url", sanitizedData.photo_url);
        }

        if (editingChild) {
            data.append("_method", "PATCH");
        }

        const route_name = editingChild
            ? "employer.profile.child.update"
            : "employer.profile.child.store";

        router.post(route(route_name, editingChild?.id), data, {
            forceFormData: true,
            onSuccess: () => {
                setIsDialogOpen(false);
                resetForm();
                toast.success(
                    editingChild
                        ? "Child updated successfully!"
                        : "Child added successfully!"
                );
            },
            onError: (errors) => {
                console.error("Server validation errors:", errors);
                toast.error("There was a problem saving your child.");
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const handleEdit = (child: EmployerChild) => {
        const formattedDate = child.birth_date
            ? new Date(child.birth_date).toISOString().slice(0, 10)
            : "";
        setEditingChild(child);
        setFormData({
            name: child.name || "",
            birth_date: formattedDate,
            photo_url: null,
        });
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        resetForm();
    };

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }

        return age;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Baby className="h-5 w-5" />
                            Children Information
                        </CardTitle>
                        <CardDescription>
                            Manage information about your children
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="self-start sm:self-auto"
                                onClick={() => {
                                    resetForm();
                                    setIsDialogOpen(true);
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Child
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingChild
                                        ? "Edit Child"
                                        : "Add New Child"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingChild
                                        ? "Update your child information below."
                                        : "Add information about your child below."}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Child Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter child name"
                                    />
                                    <ErrorDisplay
                                        errors={clientErrors}
                                        fieldName="name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="birth_date">
                                        Birth Date *
                                    </Label>
                                    <Input
                                        id="birth_date"
                                        type="date"
                                        value={formData.birth_date}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                birth_date: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                    <ErrorDisplay
                                        errors={clientErrors}
                                        fieldName="birth_date"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="photo_url">
                                        Child Photo
                                    </Label>
                                    <Input
                                        id="photo_url"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                photo_url:
                                                    e.target.files?.[0] || null,
                                            }))
                                        }
                                    />
                                    <ErrorDisplay
                                        errors={clientErrors}
                                        fieldName="photo_url"
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
                                        {editingChild
                                            ? "Update Child"
                                            : "Add Child"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleDialogClose}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {children.length === 0 ? (
                    <div className="text-center py-8">
                        <Baby className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            No children added yet.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Click "Add Child" to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {children.map((child) => (
                            <Card key={child.id} className="relative">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={
                                                    child.photo_url
                                                        ? child.photo_url.startsWith(
                                                              "/storage/"
                                                          )
                                                            ? child.photo_url
                                                            : `/storage/${child.photo_url}`
                                                        : undefined
                                                }
                                                alt={`${child.name} photo`}
                                            />
                                            <AvatarFallback>
                                                {child.name
                                                    ?.charAt(0)
                                                    .toUpperCase() || "C"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {child.name || "Unnamed"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {calculateAge(child.birth_date)}{" "}
                                                years old
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Born:{" "}
                                                {new Date(
                                                    child.birth_date
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleEdit(child)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <ConfirmDelete
                                                title={`Are you sure to remove ${
                                                    child.name?.trim()
                                                        ? child.name
                                                        : "this child"
                                                }?`}
                                                description="This action cannot be undone."
                                                onConfirm={() =>
                                                    router.delete(
                                                        route(
                                                            "employer.profile.child.destroy",
                                                            child.id
                                                        ),
                                                        {
                                                            onSuccess: () => {
                                                                toast.success(
                                                                    "Child removed successfully!"
                                                                );
                                                            },
                                                            onError: (
                                                                errors
                                                            ) => {
                                                                toast.error(
                                                                    "There was a problem deleting this child."
                                                                );
                                                                console.error(
                                                                    errors
                                                                );
                                                            },
                                                        }
                                                    )
                                                }
                                                cancelDisabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
