import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

export default function MaidSkills({ skills }: { skills: string[] }) {
    if (!skills || skills.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Skills</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No skills listed.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="text-sm py-1"
                        >
                            {skill}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
