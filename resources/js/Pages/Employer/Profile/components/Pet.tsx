import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Loader2, Heart } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { EmployerPet } from "../utils/types";
import { usePetValidation, PetFormData } from "../utils/usePetValidation";
import ErrorDisplay from "./ErrorDisplay";
import ConfirmDelete from "./ConfirmDelete";

import { toast } from "sonner";

interface PetComponentProps {
    pets: EmployerPet[];
}

export default function PetComponent({ pets }: PetComponentProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPet, setEditingPet] = useState<EmployerPet | null>(null);
    const [formData, setFormData] = useState<PetFormData>({
        type: "",
        name: "",
        photo_url: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { clientErrors, isValid, sanitizedData } = usePetValidation(formData);

    const resetForm = () => {
        setFormData({
            type: "",
            name: "",
            photo_url: null,
        });
        setEditingPet(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check validation before submitting
        if (!isValid) {
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append("type", sanitizedData?.type || formData.type);
        data.append("name", sanitizedData?.name || formData.name);
        if (sanitizedData?.photo_url) {
            data.append("photo_url", sanitizedData.photo_url);
        }

        if (editingPet) {
            data.append("_method", "PATCH");
        }

        const route_name = editingPet
            ? "employer.profile.pet.update"
            : "employer.profile.pet.store";

        router.post(route(route_name, editingPet?.id), data, {
            forceFormData: true,
            onSuccess: () => {
                setIsDialogOpen(false);
                resetForm();
                toast.success(
                    editingPet
                        ? "Pet updated successfully!"
                        : "Pet added successfully!"
                );
            },
            onError: (errors) => {
                console.error("Server validation errors:", errors);
                toast.error("There was a problem saving your pet.");
            },
            onFinish: () => setIsLoading(false),
        });
    };

    const handleEdit = (pet: EmployerPet) => {
        setEditingPet(pet);
        setFormData({
            type: pet.type,
            name: pet.name || "",
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

    const petTypes = [
        "Dog",
        "Cat",
        "Bird",
        "Fish",
        "Rabbit",
        "Hamster",
        "Guinea Pig",
        "Turtle",
        "Snake",
        "Lizard",
        "Other",
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Pets Information
                        </CardTitle>
                        <CardDescription className="pt-2 text-center sm:text-left">
                            Manage information about your pets
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
                                Add Pet
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingPet ? "Edit Pet" : "Add New Pet"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingPet
                                        ? "Update your pet information below."
                                        : "Add information about your pet below."}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Pet Type *</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                type: value,
                                            }))
                                        }
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select pet type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {petTypes.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type.toLowerCase()}
                                                >
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorDisplay
                                        errors={clientErrors}
                                        fieldName="type"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Pet Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        disabled={isLoading}
                                        placeholder="Enter pet name"
                                    />
                                    <ErrorDisplay
                                        errors={clientErrors}
                                        fieldName="name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="photo_url">Pet Photo</Label>
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
                                        disabled={isLoading}
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
                                        {editingPet ? "Update Pet" : "Add Pet"}
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
                {pets.length === 0 ? (
                    <div className="text-center py-8">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            No pets added yet.
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Click "Add Pet" to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pets.map((pet) => (
                            <Card key={pet.id} className="relative">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={
                                                    pet.photo_url
                                                        ? `/storage/${pet.photo_url}`
                                                        : undefined
                                                }
                                                alt={`${pet.name} photo`}
                                            />
                                            <AvatarFallback>
                                                {pet.name
                                                    ?.charAt(0)
                                                    .toUpperCase() ||
                                                    pet.type
                                                        .charAt(0)
                                                        .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {pet.name || "Unnamed"}
                                            </p>
                                            <p className="text-sm text-muted-foreground capitalize">
                                                {pet.type}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(pet)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <ConfirmDelete
                                                title={`Are you sure to remove ${
                                                    pet.name
                                                        ? pet.name
                                                        : "this pet"
                                                } ${pet.type}?`}
                                                description="This action cannot be undone."
                                                onConfirm={() =>
                                                    router.delete(
                                                        route(
                                                            "employer.profile.pet.destroy",
                                                            pet.id
                                                        ),
                                                        {
                                                            onSuccess: () => {
                                                                toast.success(
                                                                    "Pet removed successfully!"
                                                                );
                                                            },
                                                            onError: (
                                                                errors
                                                            ) => {
                                                                toast.error(
                                                                    "There was a problem deleting this pet."
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
