import MainForm from "./components/MainForm";
import { usePage } from "@inertiajs/react";

export default function CreateJobPostingPage() {
    const { auth } = usePage().props as {
        auth: { user: { id: number; name: string; email: string } };
    };
    return <MainForm auth={auth} isEdit={false} />;
}
