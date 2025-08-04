import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { AlertCircle, Upload, ImageIcon, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface ReportFormProps {
    reportedUserId: number;
    onSubmit: (data: any) => void;
    disabled?: boolean;
}

export default function ReportForm({
    reportedUserId,
    onSubmit,
    disabled = false,
}: ReportFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, errors } = useForm({
        reported_user_id: reportedUserId,
        report_type: "",
        description: "",
        evidence_photo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData("evidence_photo", file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData("evidence_photo", null);
        setPreviewImage(null);

        // Reset the file input
        const fileInput = document.getElementById(
            "evidence_photo"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const reportTypes = [
        { value: "harassment", label: "Harassment" },
        { value: "spam", label: "Spam or Scam" },
        { value: "inappropriate", label: "Inappropriate Conduct" },
        { value: "fraud", label: "Fraud" },
        { value: "impersonation", label: "Impersonation" },
        { value: "other", label: "Other Issue" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alert */}
            <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Reports are taken seriously. False reports may result in
                    action against your account.
                </AlertDescription>
            </Alert>

            {/* Report type */}
            <div className="space-y-2">
                <Label htmlFor="report_type" className="required">
                    Type of Issue
                </Label>
                <Select
                    value={data.report_type}
                    onValueChange={(value) => setData("report_type", value)}
                    disabled={disabled}
                >
                    <SelectTrigger
                        id="report_type"
                        className={
                            errors.report_type ? "border-destructive" : ""
                        }
                    >
                        <SelectValue placeholder="Select reason for reporting" />
                    </SelectTrigger>
                    <SelectContent>
                        {reportTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.report_type && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.report_type}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description" className="required">
                    Description
                </Label>
                <Textarea
                    id="description"
                    placeholder="Please describe the issue in detail..."
                    className={errors.description ? "border-destructive" : ""}
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    rows={5}
                    disabled={disabled}
                />
                {errors.description && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.description}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    Please provide specific details about what happened and why
                    you're reporting this user.
                </p>
            </div>

            {/* Evidence upload */}
            <div className="space-y-2">
                <Label htmlFor="evidence_photo">Evidence (Optional)</Label>

                {!previewImage ? (
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                        <input
                            type="file"
                            id="evidence_photo"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center">
                            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                                Upload a screenshot or photo as evidence
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    document
                                        .getElementById("evidence_photo")
                                        ?.click()
                                }
                                disabled={disabled}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Choose File
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="relative border rounded-md overflow-hidden">
                        <img
                            src={previewImage}
                            alt="Evidence preview"
                            className="w-full max-h-96 object-contain"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                            disabled={disabled}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {errors.evidence_photo && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.evidence_photo}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    Upload an image if you have visual evidence of the issue
                    (max 5MB).
                </p>
            </div>

            <Button type="submit" className="w-full" disabled={disabled}>
                Submit Report
            </Button>
        </form>
    );
}
