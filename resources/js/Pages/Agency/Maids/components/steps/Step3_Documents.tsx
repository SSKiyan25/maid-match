import { useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
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
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    AlertCircle,
    File,
    FileBadge,
    FileCheck,
    FilePlus,
    FileX,
    Trash2,
    Upload,
    ShieldCheck,
    FileText,
    FileSpreadsheet,
    FileImage,
    Edit,
    CheckCircle,
    X as XIcon,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";

import { CreateMaidFormData, MaidDocumentInput } from "../../utils/types";
import { useStepValidation } from "../../../../../hooks/useStepValidation";
import { validateStep3 } from "../../utils/step3Validation";

const DOCUMENT_TYPES = [
    { value: "id", label: "Identification", required: true },
    { value: "passport", label: "Passport", required: false },
    { value: "certificate", label: "Certificate", required: false },
    { value: "resume", label: "Resume/CV", required: true },
    { value: "reference", label: "Reference Letter", required: false },
    { value: "medical", label: "Medical Certificate", required: true },
    { value: "other", label: "Other Document", required: false },
];

// File types that need front/back when they are images
const NEEDS_FRONT_BACK = ["id", "passport"];

// Valid image file types
const IMAGE_MIMES = ["image/jpeg", "image/png", "image/jpg"];

function getDocumentTypeLabel(type: string): string {
    return DOCUMENT_TYPES.find((t) => t.value === type)?.label || type;
}

function getDocumentTypeIsRequired(type: string): boolean {
    return DOCUMENT_TYPES.find((t) => t.value === type)?.required || false;
}

function isImageFile(file?: File): boolean {
    if (!file) return false;
    return IMAGE_MIMES.includes(file.type);
}

interface Step3DocumentsProps {
    data: CreateMaidFormData;
    onChange: (updates: Partial<CreateMaidFormData>) => void;
    errors: Record<string, string | string[]>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
    isEdit?: boolean;
}

export default function Step3_Documents({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step3DocumentsProps) {
    const [newDocument, setNewDocument] = useState<Partial<MaidDocumentInput>>({
        type: "",
        title: "",
        description: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showFrontBackDialog, setShowFrontBackDialog] = useState(false);
    const [frontBackSelection, setFrontBackSelection] = useState<
        "front" | "back" | ""
    >("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { clientErrors, isValid } = useStepValidation(
        data,
        validateStep3,
        onValidationChange
    );

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (onValidationChange && isValid !== prevIsValid.current) {
            onValidationChange(isValid);
            prevIsValid.current = isValid;
        }
    }, [isValid, onValidationChange]);

    // Reset form when the document type changes to handle conditional behaviors
    useEffect(() => {
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [newDocument.type]);

    const handleDocumentInputChange = (
        field: keyof MaidDocumentInput,
        value: any
    ) => {
        setNewDocument((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            setNewDocument((prev) => ({
                ...prev,
                file: file,
            }));

            // Check if this is an ID or Passport image that needs front/back selection
            if (
                newDocument.type &&
                NEEDS_FRONT_BACK.includes(newDocument.type) &&
                isImageFile(file)
            ) {
                setShowFrontBackDialog(true);
            }
        }
    };

    const processFrontBackSelection = () => {
        if (!frontBackSelection) {
            // If no selection was made, just close the dialog
            setShowFrontBackDialog(false);
            return;
        }

        // Update the title to include front/back designation
        const baseTitle =
            newDocument.title?.trim() ||
            getDocumentTypeLabel(newDocument.type || "");

        // Remove any existing front/back designation
        const cleanTitle = baseTitle
            .replace(/\s*\(Front\)\s*$/i, "")
            .replace(/\s*\(Back\)\s*$/i, "");

        const updatedTitle = `${cleanTitle} (${
            frontBackSelection.charAt(0).toUpperCase() +
            frontBackSelection.slice(1)
        })`;

        setNewDocument((prev) => ({
            ...prev,
            title: updatedTitle,
        }));

        setShowFrontBackDialog(false);
    };

    const addDocument = () => {
        if (!newDocument.type || !newDocument.title || !newDocument.file)
            return;

        setHasUserInteracted(true);

        if (isEditing && editIndex !== null) {
            // Update existing document
            const updatedDocuments = [...(data.documents || [])];
            updatedDocuments[editIndex] = newDocument as MaidDocumentInput;
            onChange({ documents: updatedDocuments });
        } else {
            // Add new document
            const updatedDocuments = [
                ...(data.documents || []),
                newDocument as MaidDocumentInput,
            ];
            onChange({ documents: updatedDocuments });
        }

        // Reset form
        resetForm();
    };

    const editDocument = (index: number) => {
        if (!data.documents || !data.documents[index]) return;

        setNewDocument({ ...data.documents[index] });
        setIsEditing(true);
        setEditIndex(index);
        setShowForm(true);

        // Note: can't set the file input value for security reasons
        // Will show the current file name in the UI instead
    };

    const removeDocument = (index: number) => {
        setHasUserInteracted(true);
        const updatedDocuments = [...(data.documents || [])];
        updatedDocuments.splice(index, 1);
        onChange({ documents: updatedDocuments });
    };

    const resetForm = () => {
        setNewDocument({ type: "", title: "", description: "" });
        setShowForm(false);
        setIsEditing(false);
        setEditIndex(null);
        setFrontBackSelection("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const getFileIcon = (file?: File) => {
        if (!file) return <File className="h-4 w-4" />;

        if (file.type.includes("pdf")) {
            return <FileText className="h-4 w-4 text-red-500" />;
        } else if (
            file.type.includes("word") ||
            file.type.includes("document")
        ) {
            return <FileText className="h-4 w-4 text-blue-500" />;
        } else if (file.type.includes("sheet") || file.type.includes("excel")) {
            return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
        } else if (file.type.includes("image")) {
            return <FileImage className="h-4 w-4 text-purple-500" />;
        } else {
            return <File className="h-4 w-4" />;
        }
    };

    const getErrorsForDocument = (index: number): string[] => {
        const errorKey = `documents[${index}]`;
        const errors = clientErrors[errorKey];
        return Array.isArray(errors)
            ? errors
            : errors
            ? [errors as string]
            : [];
    };

    const displayErrors =
        showValidation || hasUserInteracted ? clientErrors : {};
    const requiredDocErrors = Object.keys(displayErrors)
        .filter((key) => key.startsWith("required_"))
        .map((key) => displayErrors[key])
        .flat();

    const idImageErrors = Object.keys(displayErrors)
        .filter((key) => key.includes("_missing_"))
        .map((key) => displayErrors[key])
        .flat();

    const missingRequiredDocs = DOCUMENT_TYPES.filter(
        (docType) =>
            docType.required &&
            !data.documents?.some((doc) => doc.type === docType.value)
    );

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Maid Documents
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Upload important documents for verification and
                        credibility
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Warning about document importance */}
                    <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertDescription className="text-amber-800 dark:text-amber-200">
                            <p>
                                Adding official documents increases trust and
                                enables the "Verified" badge on the maid's
                                profile. Required documents include ID, Resume,
                                and Medical Certificate.
                            </p>
                            <p className="mt-1 font-medium">
                                For ID and Passport images, please upload both
                                front and back sides.
                            </p>
                        </AlertDescription>
                    </Alert>

                    {data.documents && data.documents.length > 0 && (
                        <div className="space-y-4">
                            {data.documents.map((doc, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border bg-background/60 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                                >
                                    <div className="flex items-center gap-2 min-w-[90px]">
                                        {getDocumentTypeIsRequired(doc.type) ? (
                                            <FileCheck className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <FileBadge className="h-5 w-5 text-blue-500" />
                                        )}
                                        <span className="font-medium">
                                            {getDocumentTypeLabel(doc.type)}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">
                                            {doc.title}
                                        </div>
                                        {doc.description && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {doc.description}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs font-medium text-secondary">
                                                File:
                                            </span>
                                            {getFileIcon(doc.file)}
                                            {doc.file?.name ? (
                                                <span className="text-xs truncate max-w-[120px]">
                                                    {doc.file.name}
                                                </span>
                                            ) : doc.url ? (
                                                <span className="text-xs">
                                                    Uploaded
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    No file
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 mt-2 sm:mt-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => editDocument(index)}
                                            className="h-8 w-8 text-blue-500 hover:text-blue-700"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeDocument(index)
                                            }
                                            className="h-8 w-8 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Display validation errors for documents */}
                    {data.documents?.map((_, index) => {
                        const docErrors = getErrorsForDocument(index);
                        return docErrors.length > 0 ? (
                            <div
                                key={`error-${index}`}
                                className="text-sm text-red-500 flex flex-col gap-1"
                            >
                                {docErrors.map((err, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        <span>
                                            Document {index + 1}: {err}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : null;
                    })}

                    {/* ID/Passport Front/Back errors */}
                    {idImageErrors.length > 0 && (
                        <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-3">
                            <h4 className="font-medium text-red-800 dark:text-red-200 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                Image document issues:
                            </h4>
                            <ul className="mt-1 text-sm text-red-700 dark:text-red-300 space-y-1 pl-5">
                                {idImageErrors.map((err, i) => (
                                    <li key={i}>
                                        • {Array.isArray(err) ? err[0] : err}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Required document warnings */}
                    {data.documents &&
                        data.documents.length > 0 &&
                        missingRequiredDocs.length > 0 && (
                            <div className="rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-3">
                                <h4 className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    Missing required documents:
                                </h4>
                                <ul className="mt-1 text-sm text-amber-700 dark:text-amber-300 space-y-1 pl-5">
                                    {missingRequiredDocs.map((docType) => (
                                        <li key={docType.value}>
                                            • {docType.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    {/* Required document errors from validation */}
                    {requiredDocErrors.length > 0 && (
                        <div className="space-y-1">
                            {requiredDocErrors.map((err, i) => (
                                <p
                                    key={i}
                                    className="text-sm text-red-500 flex items-center gap-1"
                                >
                                    <AlertCircle className="w-3 h-3" />
                                    {Array.isArray(err) ? err[0] : err}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Add/Edit Document Form */}
                    {showForm ? (
                        <div className="space-y-4 p-4 border rounded-md bg-muted/40">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium">
                                    {isEditing
                                        ? "Edit Document"
                                        : "Add New Document"}
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={resetForm}
                                    className="h-8 w-8"
                                >
                                    <FileX className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="doc_type"
                                        className="text-sm font-medium"
                                    >
                                        Document Type*
                                    </Label>
                                    <Select
                                        value={newDocument.type}
                                        onValueChange={(value) =>
                                            handleDocumentInputChange(
                                                "type",
                                                value
                                            )
                                        }
                                        disabled={isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DOCUMENT_TYPES.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {type.required ? (
                                                            <span className="text-xs font-medium text-red-500">
                                                                REQUIRED
                                                            </span>
                                                        ) : null}
                                                        {type.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {newDocument.type &&
                                        NEEDS_FRONT_BACK.includes(
                                            newDocument.type
                                        ) && (
                                            <p className="text-xs text-amber-600 mt-1">
                                                <AlertCircle className="w-3 h-3 inline mr-1" />
                                                If uploading an image, you'll
                                                need both front and back sides.
                                            </p>
                                        )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="doc_title"
                                        className="text-sm font-medium"
                                    >
                                        Document Title*
                                    </Label>
                                    <Input
                                        id="doc_title"
                                        placeholder="Enter document title"
                                        value={newDocument.title}
                                        onChange={(e) =>
                                            handleDocumentInputChange(
                                                "title",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="doc_file"
                                    className="text-sm font-medium flex items-center"
                                >
                                    Upload File*
                                    {isEditing && newDocument.file && (
                                        <span className="ml-2 text-xs text-blue-600">
                                            (Re-upload to change)
                                        </span>
                                    )}
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="doc_file"
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="flex-1"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    />
                                    {newDocument.file && (
                                        <div className="flex items-center gap-1 text-sm bg-muted p-2 rounded">
                                            {getFileIcon(newDocument.file)}
                                            <span className="truncate max-w-[150px]">
                                                {newDocument.file.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Accepted formats: PDF, Word, JPG, PNG (max
                                    10MB)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="doc_description"
                                    className="text-sm font-medium"
                                >
                                    Description (Optional)
                                </Label>
                                <Textarea
                                    id="doc_description"
                                    placeholder="Enter a description for this document..."
                                    value={newDocument.description || ""}
                                    onChange={(e) =>
                                        handleDocumentInputChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="min-h-[80px]"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={addDocument}
                                    disabled={
                                        !newDocument.type ||
                                        !newDocument.title ||
                                        !newDocument.file
                                    }
                                >
                                    {isEditing ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Update Document
                                        </>
                                    ) : (
                                        <>
                                            <FilePlus className="w-4 h-4 mr-1" />
                                            Add Document
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Button
                                onClick={() => setShowForm(true)}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <FilePlus className="h-4 w-4" />
                                Add Document
                            </Button>
                        </div>
                    )}

                    {/* Info message at the bottom */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            Documents are kept secure and are only accessible to
                            verified employers after receiving permission.
                            Complete verification increases hiring chances by
                            70%.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            {/* Front/Back Selection Dialog */}
            <Dialog
                open={showFrontBackDialog}
                onOpenChange={setShowFrontBackDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Is this the front or back?</DialogTitle>
                        <DialogDescription>
                            For {newDocument.type === "id" ? "ID" : "Passport"}{" "}
                            images, we need to know which side this is.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <RadioGroup
                            value={frontBackSelection}
                            onValueChange={(value) =>
                                setFrontBackSelection(value as "front" | "back")
                            }
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/50">
                                <RadioGroupItem value="front" id="front" />
                                <Label
                                    htmlFor="front"
                                    className="font-medium cursor-pointer"
                                >
                                    Front Side
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/50">
                                <RadioGroupItem value="back" id="back" />
                                <Label
                                    htmlFor="back"
                                    className="font-medium cursor-pointer"
                                >
                                    Back Side
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowFrontBackDialog(false)}
                        >
                            <XIcon className="w-4 h-4 mr-1" />
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={processFrontBackSelection}
                            disabled={!frontBackSelection}
                        >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
