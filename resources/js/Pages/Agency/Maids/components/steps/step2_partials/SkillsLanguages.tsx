import { useState } from "react";
import { AlertCircle, Plus, X, Globe } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { CreateMaidFormData } from "../../../utils/types";

const COMMON_SKILLS = [
    "Housekeeping",
    "Cooking",
    "Childcare",
    "Elderly Care",
    "Pet Care",
    "Laundry",
    "Ironing",
    "Gardening",
    "Driving",
    "Tutoring",
];

const COMMON_LANGUAGES = [
    { value: "english", label: "English" },
    { value: "tagalog", label: "Tagalog" },
    { value: "cebuano", label: "Cebuano" },
    { value: "ilocano", label: "Ilocano" },
    { value: "bisaya", label: "Bisaya" },
    { value: "hiligaynon", label: "Hiligaynon" },
    { value: "bicolano", label: "Bicolano" },
    { value: "waray", label: "Waray" },
    { value: "chavacano", label: "Chavacano" },
    { value: "other", label: "Other" },
];

interface SkillsLanguagesProps {
    data: CreateMaidFormData;
    onChange: (updates: Partial<CreateMaidFormData>) => void;
    errors: Record<string, string>;
}

export default function SkillsLanguages({
    data,
    onChange,
    errors,
}: SkillsLanguagesProps) {
    const [newSkill, setNewSkill] = useState("");
    const [newLanguage, setNewLanguage] = useState("");

    const handleMaidInputChange = (
        field: keyof CreateMaidFormData["maid"],
        value: any
    ) => {
        onChange({
            maid: {
                ...data.maid,
                [field]: value,
            },
        });
    };

    const addSkill = (skill: string) => {
        if (skill && !data.maid.skills?.includes(skill)) {
            handleMaidInputChange("skills", [
                ...(data.maid.skills || []),
                skill,
            ]);
        }
        setNewSkill("");
    };

    const removeSkill = (skillToRemove: string) => {
        handleMaidInputChange(
            "skills",
            data.maid.skills?.filter((skill) => skill !== skillToRemove) || []
        );
    };

    const addLanguage = (language: string) => {
        if (language && !data.maid.languages?.includes(language)) {
            handleMaidInputChange("languages", [
                ...(data.maid.languages || []),
                language,
            ]);
        }
        setNewLanguage("");
    };

    const removeLanguage = (languageToRemove: string) => {
        handleMaidInputChange(
            "languages",
            data.maid.languages?.filter((lang) => lang !== languageToRemove) ||
                []
        );
    };

    return (
        <div className="space-y-6">
            {/* Skills */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {data.maid.skills?.map((skill) => (
                        <Badge
                            key={skill}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {skill}
                            <X
                                className="w-3 h-3 cursor-pointer hover:text-red-500"
                                onClick={() => removeSkill(skill)}
                            />
                        </Badge>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {COMMON_SKILLS.filter(
                        (skill) => !data.maid.skills?.includes(skill)
                    ).map((skill) => (
                        <Button
                            key={skill}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSkill(skill)}
                            className="h-7 text-xs"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            {skill}
                        </Button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Add custom skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addSkill(newSkill);
                            }
                        }}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        onClick={() => addSkill(newSkill)}
                        disabled={!newSkill.trim()}
                    >
                        Add
                    </Button>
                </div>
                {errors.skills && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.skills}
                    </p>
                )}
            </div>

            {/* Languages */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Languages</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {data.maid.languages?.map((language) => (
                        <Badge
                            key={language}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            <Globe className="w-3 h-3" />
                            {language}
                            <X
                                className="w-3 h-3 cursor-pointer hover:text-red-500"
                                onClick={() => removeLanguage(language)}
                            />
                        </Badge>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {COMMON_LANGUAGES.filter(
                        (lang) => !data.maid.languages?.includes(lang.value)
                    ).map((language) => (
                        <Button
                            key={language.value}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addLanguage(language.value)}
                            className="h-7 text-xs"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            {language.label}
                        </Button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Add custom language"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addLanguage(newLanguage);
                            }
                        }}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        onClick={() => addLanguage(newLanguage)}
                        disabled={!newLanguage.trim()}
                    >
                        Add
                    </Button>
                </div>
                {errors.languages && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.languages}
                    </p>
                )}
            </div>
        </div>
    );
}
