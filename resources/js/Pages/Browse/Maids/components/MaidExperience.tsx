import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function MaidExperience({ maid }: any) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Experience</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-4">
                    <p className="text-muted-foreground">
                        {maid.years_experience > 0
                            ? `${maid.full_name} has ${maid.years_experience} years of experience.`
                            : `${maid.full_name} is new to domestic work.`}
                    </p>
                    <p className="mt-4 text-sm">
                        Experience level:{" "}
                        <span className="font-medium">
                            {maid.experience_level?.charAt(0).toUpperCase() +
                                maid.experience_level?.slice(1)}
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
