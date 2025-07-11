import MaidFormPage from "./components/MainForm";
import { usePage } from "@inertiajs/react";

export default function EditMaidPage() {
    const agencyMaid = usePage().props.agencyMaid;
    const user = usePage().props.auth?.user;

    return (
        <MaidFormPage
            auth={{ user }}
            isEdit={true}
            agencyMaid={agencyMaid}
            maid={
                agencyMaid &&
                typeof agencyMaid === "object" &&
                agencyMaid !== null &&
                "maid" in agencyMaid
                    ? (agencyMaid as { maid: any }).maid
                    : undefined
            }
        />
    );
}
