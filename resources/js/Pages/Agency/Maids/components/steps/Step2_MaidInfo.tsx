import { useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Building, User, AlertCircle } from "lucide-react";

import { CreateMaidFormData } from "../../utils/types";
import { useStepValidation } from "../../../../../hooks/useStepValidation";
import { validateStep2 } from "../../utils/step2Validation";

// Import the new components
import MaidPersonalInfo from "./step2_partials/MaidPersonalInfo";
import MaidProfessionalInfo from "./step2_partials/MaidProfessionalInfo";
import SkillsLanguages from "./step2_partials/SkillsLanguages";
import AgencySettings from "./step2_partials/AgencySettings";

interface Step2MaidInfoProps {
    data: CreateMaidFormData;
    onChange: (updates: Partial<CreateMaidFormData>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
    isEdit?: boolean;
}

export default function Step2_MaidInfo({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
    isEdit = false,
}: Step2MaidInfoProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const { clientErrors, isValid } = useStepValidation(
        data,
        validateStep2,
        onValidationChange
    );

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (onValidationChange && isValid !== prevIsValid.current) {
            onValidationChange(isValid);
            prevIsValid.current = isValid;
        }
    }, [isValid, onValidationChange]);

    // Wrap onChange to track user interaction
    const handleChange = (updates: Partial<CreateMaidFormData>) => {
        setHasUserInteracted(true);
        onChange(updates);
    };

    const displayErrors =
        showValidation || hasUserInteracted ? clientErrors : {};

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Maid Information & Agency Settings
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Configure the maid's professional details and agency
                        relationship
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Maid Information Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Professional Information
                            </h3>
                        </div>

                        {/* Bio and basic professional info */}
                        <MaidProfessionalInfo
                            data={data}
                            onChange={handleChange}
                            errors={displayErrors}
                        />

                        {/* Skills and Languages */}
                        <SkillsLanguages
                            data={data}
                            onChange={handleChange}
                            errors={displayErrors}
                        />

                        {/* Personal Details */}
                        <MaidPersonalInfo
                            data={data}
                            onChange={handleChange}
                            errors={displayErrors}
                        />
                    </div>

                    {/* Agency Settings Section */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Building className="w-4 h-4 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Agency Settings
                            </h3>
                        </div>

                        <AgencySettings
                            data={data}
                            onChange={handleChange}
                            errors={displayErrors}
                        />
                    </div>

                    {/* Info Alert */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            This information helps employers find the right maid
                            for their needs. All fields are optional but
                            providing more details increases visibility.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
