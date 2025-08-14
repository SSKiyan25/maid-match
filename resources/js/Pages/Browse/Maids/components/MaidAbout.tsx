import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

export default function MaidAbout({ maid }: any) {
    // Calculate age from birth_date if available
    const calculateAge = (birthDate: string | null) => {
        if (!birthDate) return null;

        const dob = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        // Adjust age if birthday hasn't occurred yet this year
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        return age;
    };

    const age = calculateAge(maid.user?.profile?.birth_date);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        About {maid.full_name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <p className="whitespace-pre-line">
                        {maid.bio || "No bio provided."}
                    </p>

                    <div className="mt-6 space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="font-medium border-b pb-2 mb-3">
                                Personal Information
                            </h3>
                            <dl className="grid grid-cols-1 gap-y-3">
                                <div>
                                    <dt className="text-muted-foreground mb-1">
                                        Nationality
                                    </dt>
                                    <dd className="font-medium">
                                        {maid.nationality || "Not specified"}
                                    </dd>
                                </div>

                                {/* Age - Add this new field */}
                                <div>
                                    <dt className="text-muted-foreground mb-1">
                                        Age
                                    </dt>
                                    <dd className="font-medium">
                                        {age
                                            ? `${age} years old`
                                            : "Not specified"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground mb-1">
                                        Languages
                                    </dt>
                                    <dd>
                                        {maid.languages &&
                                        maid.languages.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {maid.languages.map(
                                                    (
                                                        language: string,
                                                        index: number
                                                    ) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="capitalize"
                                                        >
                                                            {language}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">
                                                Not specified
                                            </span>
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground mb-1">
                                        Marital Status
                                    </dt>
                                    <dd className="font-medium capitalize">
                                        {maid.marital_status || "Not specified"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground mb-1">
                                        Has Children
                                    </dt>
                                    <dd className="font-medium">
                                        {maid.has_children ? "Yes" : "No"}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Professional Information */}
                        <div>
                            <h3 className="font-medium border-b pb-2 mb-3">
                                Professional Details
                            </h3>
                            <dl className="grid grid-cols-1 gap-y-3">
                                <div>
                                    <dt className="text-muted-foreground mb-1">
                                        Experience Level
                                    </dt>
                                    <dd className="font-medium capitalize">
                                        {maid.experience_level ||
                                            "Not specified"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground mb-1">
                                        Years of Experience
                                    </dt>
                                    <dd className="font-medium">
                                        {maid.years_experience > 0
                                            ? `${maid.years_experience} year${
                                                  maid.years_experience > 1
                                                      ? "s"
                                                      : ""
                                              }`
                                            : "New to domestic work"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground mb-1">
                                        Current Status
                                    </dt>
                                    <dd className="font-medium">
                                        {maid.status === "employed"
                                            ? "Employed"
                                            : maid.status === "available"
                                            ? "Available"
                                            : "Unavailable"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground mb-1">
                                        Willing to Relocate
                                    </dt>
                                    <dd className="font-medium">
                                        {maid.is_willing_to_relocate
                                            ? "Yes"
                                            : "No"}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
