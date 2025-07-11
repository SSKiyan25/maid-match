import MaidFormPage from "./components/MainForm";
import { usePage } from "@inertiajs/react";

export default function CreateMaidPage() {
    const { auth } = usePage().props as {
        auth: { user: { id: number; name: string; email: string } };
    };

    return <MaidFormPage auth={auth} isEdit={false} />;
}
