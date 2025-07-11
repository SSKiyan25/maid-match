import { MaidDocumentInput, CreateMaidFormData } from "./types";
import { validateAndSanitizeInput } from "@/utils/securityValidation";

const ALLOWED_TYPES = [
    "id",
    "passport",
    "certificate",
    "resume",
    "reference",
    "medical",
    "other",
];
const REQUIRED_TYPES = ["id", "resume", "medical"];

// Define allowed mime types by document category
const IMAGE_MIMES = ["image/jpeg", "image/png", "image/jpg"];
const DOCUMENT_MIMES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_MIME = [...IMAGE_MIMES, ...DOCUMENT_MIMES];

const MAX_FILE_SIZE_MB = 10;

export interface Step3ValidationResult {
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData?: CreateMaidFormData;
}

function validateDocument(
    doc: MaidDocumentInput,
    index: number,
    allDocs: MaidDocumentInput[]
): string[] {
    const errors: string[] = [];

    // Type
    const typeResult = validateAndSanitizeInput(doc.type, "text", 50);
    if (!typeResult.isValid || !doc.type) {
        errors.push("Document type is required.");
    } else if (!ALLOWED_TYPES.includes(doc.type)) {
        errors.push("Invalid document type.");
    }

    // Title
    const titleResult = validateAndSanitizeInput(doc.title, "text", 255);
    if (!titleResult.isValid || !doc.title) {
        errors.push("Document title is required.");
    }

    // File validation
    if (doc.file) {
        if (typeof File !== "undefined" && doc.file instanceof File) {
            // Size validation
            if (doc.file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                errors.push("File size must not exceed 10MB.");
            }

            // ID or Passport validation
            if (doc.type === "id" || doc.type === "passport") {
                // For ID/Passport, check if it's an image
                if (IMAGE_MIMES.includes(doc.file.type)) {
                    // If it's an image, check for front/back naming convention
                    if (
                        !doc.title.toLowerCase().includes("front") &&
                        !doc.title.toLowerCase().includes("back")
                    ) {
                        errors.push(
                            `${
                                doc.type === "id" ? "ID" : "Passport"
                            } image title must include 'Front' or 'Back'`
                        );
                    }

                    // Verify that both front and back are present
                    const isDocFront = doc.title
                        .toLowerCase()
                        .includes("front");
                    const isDocBack = doc.title.toLowerCase().includes("back");

                    if (isDocFront) {
                        // Check if there's a corresponding back side
                        const hasBackSide = allDocs.some(
                            (otherDoc) =>
                                otherDoc.type === doc.type &&
                                otherDoc.title.toLowerCase().includes("back") &&
                                otherDoc.title.replace(/back/i, "").trim() ===
                                    doc.title.replace(/front/i, "").trim()
                        );

                        if (!hasBackSide) {
                            errors.push(
                                `Missing back side for this ${
                                    doc.type === "id" ? "ID" : "Passport"
                                }`
                            );
                        }
                    } else if (isDocBack) {
                        // Check if there's a corresponding front side
                        const hasFrontSide = allDocs.some(
                            (otherDoc) =>
                                otherDoc.type === doc.type &&
                                otherDoc.title
                                    .toLowerCase()
                                    .includes("front") &&
                                otherDoc.title.replace(/front/i, "").trim() ===
                                    doc.title.replace(/back/i, "").trim()
                        );

                        if (!hasFrontSide) {
                            errors.push(
                                `Missing front side for this ${
                                    doc.type === "id" ? "ID" : "Passport"
                                }`
                            );
                        }
                    }
                } else if (!DOCUMENT_MIMES.includes(doc.file.type)) {
                    errors.push(
                        `${
                            doc.type === "id" ? "ID" : "Passport"
                        } must be an image (JPG/PNG) or document (PDF/Word)`
                    );
                }
            } else {
                // For other document types, allow only PDF/Word
                if (!DOCUMENT_MIMES.includes(doc.file.type)) {
                    errors.push(`${doc.type} must be a document (PDF or Word)`);
                }
            }
        } else {
            errors.push("Invalid file upload.");
        }
    }

    // Description (optional)
    if (doc.description) {
        const descResult = validateAndSanitizeInput(
            doc.description,
            "text",
            500
        );
        if (!descResult.isValid) {
            errors.push("Invalid description.");
        }
    }

    return errors;
}

export function validateStep3(data: CreateMaidFormData): Step3ValidationResult {
    const errors: Record<string, string[]> = {};
    const sanitizedDocuments: MaidDocumentInput[] = [];

    // Validate each document
    if (Array.isArray(data.documents)) {
        data.documents.forEach((doc, idx) => {
            const docErrors = validateDocument(doc, idx, data.documents || []);
            if (docErrors.length > 0) {
                errors[`documents[${idx}]`] = docErrors;
            } else {
                sanitizedDocuments.push({
                    ...doc,
                    type: doc.type.trim(),
                    title: doc.title.trim(),
                    description: doc.description?.trim() || undefined,
                });
            }
        });
    }

    // Check for required document types
    if (sanitizedDocuments.length > 0) {
        for (const requiredType of REQUIRED_TYPES) {
            if (!sanitizedDocuments.some((doc) => doc.type === requiredType)) {
                errors[`required_${requiredType}`] = [
                    `Required document type missing: ${requiredType
                        .replace(/_/g, " ")
                        .toUpperCase()}`,
                ];
            }
        }
    }

    // Additional validation for ID/Passport images to ensure front/back pairs
    const idDocs = sanitizedDocuments.filter((doc) => doc.type === "id");
    const passportDocs = sanitizedDocuments.filter(
        (doc) => doc.type === "passport"
    );

    // Helper function to validate front/back pairs
    const validatePairs = (docs: MaidDocumentInput[], type: string) => {
        // Get only image documents
        const imageDocs = docs.filter(
            (doc) => doc.file && IMAGE_MIMES.includes(doc.file.type)
        );

        if (imageDocs.length > 0) {
            // Group by base title (without front/back)
            const titleGroups: Record<
                string,
                { front: boolean; back: boolean }
            > = {};

            imageDocs.forEach((doc) => {
                const isDocFront = doc.title.toLowerCase().includes("front");
                const isDocBack = doc.title.toLowerCase().includes("back");

                if (isDocFront || isDocBack) {
                    // Get base title by removing front/back
                    const baseTitle = doc.title
                        .replace(/front/i, "")
                        .replace(/back/i, "")
                        .trim();

                    if (!titleGroups[baseTitle]) {
                        titleGroups[baseTitle] = { front: false, back: false };
                    }

                    if (isDocFront) titleGroups[baseTitle].front = true;
                    if (isDocBack) titleGroups[baseTitle].back = true;
                }
            });

            // Check if any group is missing front or back
            Object.entries(titleGroups).forEach(([baseTitle, status]) => {
                if (!status.front) {
                    errors[`${type}_missing_front`] = [
                        `Missing front side for ${type}: ${baseTitle}`,
                    ];
                }
                if (!status.back) {
                    errors[`${type}_missing_back`] = [
                        `Missing back side for ${type}: ${baseTitle}`,
                    ];
                }
            });
        }
    };

    validatePairs(idDocs, "id");
    validatePairs(passportDocs, "passport");

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: {
            user: data.user,
            profile: data.profile,
            maid: data.maid,
            agency_maid: data.agency_maid,
            documents: sanitizedDocuments,
        },
    };
}
