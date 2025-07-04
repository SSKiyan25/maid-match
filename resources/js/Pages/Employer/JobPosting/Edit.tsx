import MainForm from "./components/MainForm";
import { usePage } from "@inertiajs/react";

export default function EditJobPostingPage() {
    const props = usePage().props as {
        auth: { user: { id: number; name: string; email: string } };
        jobPosting?: any; // Make jobPosting optional
    };

    return (
        <MainForm
            auth={props.auth}
            isEdit={true}
            jobPosting={props.jobPosting}
        />
    );
}
