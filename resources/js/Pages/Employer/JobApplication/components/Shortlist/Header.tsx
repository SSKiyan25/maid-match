import { UserCheck, Briefcase } from "lucide-react";

interface ShortlistHeaderProps {
    totalShortlisted: number;
    totalJobs: number;
}

export default function ShortlistHeader({
    totalShortlisted,
    totalJobs,
}: ShortlistHeaderProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold">
                    Shortlisted Candidates
                </h1>
            </div>

            <p className="text-muted-foreground">
                Manage and rank your shortlisted candidates to help you make the
                best hiring decisions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-primary-50 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-3">
                        <UserCheck className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-muted-foreground text-sm">
                                Total Shortlisted
                            </p>
                            <h2 className="text-2xl font-bold">
                                {totalShortlisted}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-primary-50 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-3">
                        <Briefcase className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-muted-foreground text-sm">
                                Active Job Postings
                            </p>
                            <h2 className="text-2xl font-bold">{totalJobs}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
