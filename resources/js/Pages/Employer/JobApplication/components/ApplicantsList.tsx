import { Fragment } from "react";
import ApplicantCard from "./ApplicantCard";

export default function ApplicantsList({
    applicants,
    jobPostings,
    documentTypes = {},
    requiredDocuments = {},
}: {
    applicants: any[];
    jobPostings?: any[];
    documentTypes?: Record<string, string>;
    requiredDocuments?: Record<string, string>;
}) {
    // Group applicants by job posting
    const groupedApplicants = applicants.reduce((acc, app) => {
        if (!acc[app.job_title]) {
            acc[app.job_title] = [];
        }
        acc[app.job_title].push(app);
        return acc;
    }, {});

    if (applicants.length === 0) {
        return null; // Empty state handled by parent
    }

    return (
        <div className="space-y-6">
            {Object.entries(groupedApplicants).map(([jobTitle, apps]) => (
                <Fragment key={jobTitle}>
                    {/* Only show job titles if we have multiple jobs */}
                    {Object.keys(groupedApplicants).length > 1 && (
                        <h3 className="text-sm font-medium mb-3 px-4">
                            {jobTitle}
                        </h3>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 px-4">
                        {(apps as any[]).map((applicant: any) => (
                            <ApplicantCard
                                key={applicant.application.id}
                                applicant={applicant}
                                jobPostings={jobPostings}
                                documentTypes={documentTypes}
                                requiredDocuments={requiredDocuments}
                            />
                        ))}
                    </div>
                </Fragment>
            ))}
        </div>
    );
}
