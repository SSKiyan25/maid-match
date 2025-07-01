import { useState, useEffect, useRef } from "react";
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
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Gift,
    Plus,
    Trash2,
    AlertCircle,
    DollarSign,
    PhilippinePeso,
    FileText,
    Star,
} from "lucide-react";

import { JobBonus } from "../../utils/types";
import { validateStep3 } from "../../utils/step3Validation";
import { useStepValidation } from "../../hooks/useStepValidation";

interface Step3BonusProps {
    data: JobBonus[];
    onChange: (updates: JobBonus[]) => void;
    errors: Record<number, Record<string, string>>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
    isEditMode?: boolean;
}

const bonusTypes = [
    { value: "monetary", label: "Monetary Bonus", icon: "💰" },
    { value: "13th_month", label: "13th Month Pay", icon: "📅" },
    { value: "performance", label: "Performance Bonus", icon: "🏆" },
    { value: "holiday", label: "Holiday Bonus", icon: "🎄" },
    { value: "loyalty", label: "Loyalty Bonus", icon: "❤️" },
    { value: "completion", label: "Task Completion Bonus", icon: "✅" },
    { value: "referral", label: "Referral Bonus", icon: "👥" },
    { value: "overtime", label: "Overtime Pay", icon: "⏰" },
    { value: "other", label: "Other", icon: "🎁" },
];

const bonusFrequencies = [
    { value: "one_time", label: "One Time" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
    { value: "upon_completion", label: "Upon Completion" },
    { value: "performance_based", label: "Performance Based" },
];

const bonusStatuses = [
    { value: "active", label: "Active" },
    { value: "conditional", label: "Conditional" },
    { value: "pending", label: "Pending" },
];

export default function Step3_Bonus({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
    isEditMode = false,
}: Step3BonusProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

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

    const handleBonusChange = (
        index: number,
        field: keyof JobBonus,
        value: any
    ) => {
        setHasUserInteracted(true);
        const updatedBonuses = data.map((bonus, idx) =>
            idx === index ? { ...bonus, [field]: value } : bonus
        );
        onChange(updatedBonuses);
    };

    const addBonus = () => {
        setHasUserInteracted(true);
        const newBonus: JobBonus = {
            title: "",
            type: "",
            frequency: "",
            amount: null,
            description: "",
            conditions: "",
            status: "active",
        };
        onChange([...data, newBonus]);
    };

    const removeBonus = (index: number) => {
        setHasUserInteracted(true);
        const updatedBonuses = data.filter((_, idx) => idx !== index);
        onChange(updatedBonuses);
    };

    // Use client errors if available and user has interacted, otherwise use server errors
    const displayErrors =
        showValidation &&
        hasUserInteracted &&
        Object.keys(clientErrors).length > 0
            ? clientErrors
            : showValidation
            ? errors
            : {};
    const errorsByIndex = displayErrors as Record<
        number,
        Record<string, string>
    >;

    return (
        <div className="w-full mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                        <Gift className="w-6 h-6 text-primary" />
                        {isEditMode
                            ? "Edit Job Bonuses"
                            : "Job Bonuses & Incentives"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {isEditMode
                            ? "Update the bonus offerings for your job posting"
                            : "Add bonuses and incentives to make your job more attractive (Optional)"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Add Bonus Button */}
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addBonus}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Bonus
                        </Button>
                    </div>

                    {/* Bonuses List */}
                    {data.length === 0 ? (
                        <div className="text-center py-12">
                            <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                No bonuses added yet
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Adding bonuses can make your job posting more
                                attractive to candidates
                            </p>
                            <div className="flex justify-center">
                                <Button
                                    type="button"
                                    onClick={addBonus}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Your First Bonus
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {data.map((bonus, index) => (
                                <Card
                                    key={index}
                                    className="border-2 border-border"
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Star className="w-4 h-4 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-semibold">
                                                Bonus #{index + 1}
                                            </h3>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeBonus(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Basic Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Bonus Title */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`bonus-title-${index}`}
                                                    className="text-sm font-medium"
                                                >
                                                    Bonus Title *
                                                </Label>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id={`bonus-title-${index}`}
                                                        type="text"
                                                        placeholder="e.g., Performance Bonus, Holiday Bonus"
                                                        value={
                                                            bonus.title || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleBonusChange(
                                                                index,
                                                                "title",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`pl-10 h-11 ${
                                                            errorsByIndex[index]
                                                                ?.title
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                    />
                                                </div>
                                                {errorsByIndex[index]
                                                    ?.title && (
                                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {
                                                            errorsByIndex[index]
                                                                .title
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Bonus Type */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`bonus-type-${index}`}
                                                    className="text-sm font-medium"
                                                >
                                                    Bonus Type *
                                                </Label>
                                                <Select
                                                    value={bonus.type || ""}
                                                    onValueChange={(value) =>
                                                        handleBonusChange(
                                                            index,
                                                            "type",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 ${
                                                            errorsByIndex[index]
                                                                ?.type
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                    >
                                                        <SelectValue placeholder="Select bonus type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {bonusTypes.map(
                                                            (type) => (
                                                                <SelectItem
                                                                    key={
                                                                        type.value
                                                                    }
                                                                    value={
                                                                        type.value
                                                                    }
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <span>
                                                                            {
                                                                                type.icon
                                                                            }
                                                                        </span>
                                                                        {
                                                                            type.label
                                                                        }
                                                                    </div>
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errorsByIndex[index]?.type && (
                                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {
                                                            errorsByIndex[index]
                                                                .type
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Bonus Amount */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`bonus-amount-${index}`}
                                                    className="text-sm font-medium"
                                                >
                                                    Amount (₱)
                                                </Label>
                                                <div className="relative">
                                                    <PhilippinePeso className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id={`bonus-amount-${index}`}
                                                        type="number"
                                                        placeholder="1000"
                                                        value={
                                                            bonus.amount || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleBonusChange(
                                                                index,
                                                                "amount",
                                                                e.target.value
                                                                    ? Number(
                                                                          e
                                                                              .target
                                                                              .value
                                                                      )
                                                                    : null
                                                            )
                                                        }
                                                        className={`pl-10 h-11 ${
                                                            errorsByIndex[index]
                                                                ?.amount
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                    />
                                                </div>
                                                {errorsByIndex[index]
                                                    ?.amount && (
                                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {
                                                            errorsByIndex[index]
                                                                .amount
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Frequency */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`bonus-frequency-${index}`}
                                                    className="text-sm font-medium"
                                                >
                                                    Frequency *
                                                </Label>
                                                <Select
                                                    value={
                                                        bonus.frequency || ""
                                                    }
                                                    onValueChange={(value) =>
                                                        handleBonusChange(
                                                            index,
                                                            "frequency",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 ${
                                                            errorsByIndex[index]
                                                                ?.frequency
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                    >
                                                        <SelectValue placeholder="Select frequency" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {bonusFrequencies.map(
                                                            (freq) => (
                                                                <SelectItem
                                                                    key={
                                                                        freq.value
                                                                    }
                                                                    value={
                                                                        freq.value
                                                                    }
                                                                >
                                                                    {freq.label}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errorsByIndex[index]
                                                    ?.frequency && (
                                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {
                                                            errorsByIndex[index]
                                                                .frequency
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`bonus-status-${index}`}
                                                    className="text-sm font-medium"
                                                >
                                                    Status
                                                </Label>
                                                <Select
                                                    value={
                                                        bonus.status || "active"
                                                    }
                                                    onValueChange={(value) =>
                                                        handleBonusChange(
                                                            index,
                                                            "status",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-11">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {bonusStatuses.map(
                                                            (status) => (
                                                                <SelectItem
                                                                    key={
                                                                        status.value
                                                                    }
                                                                    value={
                                                                        status.value
                                                                    }
                                                                >
                                                                    {
                                                                        status.label
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`bonus-description-${index}`}
                                                className="text-sm font-medium"
                                            >
                                                Description
                                            </Label>
                                            <Textarea
                                                id={`bonus-description-${index}`}
                                                placeholder="Describe the bonus details, what it's for, and how it's earned..."
                                                value={bonus.description || ""}
                                                onChange={(e) =>
                                                    handleBonusChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                className={`min-h-[80px] sm:text-sm text-xs ${
                                                    errorsByIndex[index]
                                                        ?.description
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                            />
                                            {errorsByIndex[index]
                                                ?.description && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {
                                                        errorsByIndex[index]
                                                            .description
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Conditions */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`bonus-conditions-${index}`}
                                                className="text-sm font-medium"
                                            >
                                                Conditions & Requirements
                                            </Label>
                                            <Textarea
                                                id={`bonus-conditions-${index}`}
                                                placeholder="Specify any conditions, requirements, or criteria for earning this bonus..."
                                                value={bonus.conditions || ""}
                                                onChange={(e) =>
                                                    handleBonusChange(
                                                        index,
                                                        "conditions",
                                                        e.target.value
                                                    )
                                                }
                                                className={`min-h-[60px] sm:text-sm text-xs ${
                                                    errorsByIndex[index]
                                                        ?.conditions
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Optional - Be clear about what's
                                                needed to qualify for this bonus
                                            </p>
                                            {errorsByIndex[index]
                                                ?.conditions && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {
                                                        errorsByIndex[index]
                                                            .conditions
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Info Alert */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-2">💡 Bonus Tips:</p>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                                <li>
                                    Clear bonus structures attract better
                                    candidates
                                </li>
                                <li>
                                    Performance-based bonuses motivate excellent
                                    work
                                </li>
                                <li>
                                    Consider seasonal bonuses (13th month,
                                    holidays)
                                </li>
                                <li>
                                    Be specific about conditions to avoid
                                    misunderstandings
                                </li>
                                <li>
                                    Bonuses are optional but can make your
                                    posting stand out
                                </li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
