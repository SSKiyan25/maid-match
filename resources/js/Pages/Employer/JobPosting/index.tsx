import { Head, Link } from "@inertiajs/react";
import EmployerLayout from "../../../Layouts/EmployerLayout";

export default function JobPostingIndex() {
    // Dummy data for testing
    const jobPostings = [
        {
            id: 1,
            title: "Live-in Maid Needed",
            status: "active",
            created_at: "2025-06-30",
        },
        {
            id: 2,
            title: "Part-time Nanny",
            status: "archived",
            created_at: "2025-06-28",
        },
    ];

    return (
        <>
            <EmployerLayout>
                <Head title="Job Postings" />
                <div className="w-full mx-auto px-16 py-8">
                    <h1 className="text-2xl font-bold mb-6">My Job Postings</h1>
                    <Link
                        href="/employer/job-postings/create"
                        className="mb-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                    >
                        + New Job Posting
                    </Link>
                </div>
            </EmployerLayout>
        </>
    );
}
