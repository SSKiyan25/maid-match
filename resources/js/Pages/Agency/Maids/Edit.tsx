import MaidFormPage from "./components/MainForm";
import { usePage } from "@inertiajs/react";

export default function EditMaidPage() {
    // const { auth, agencyMaid } = usePage<EditMaidPageProps>().props;
    const agencyMaid = usePage().props.agencyMaid;
    const user = usePage().props.auth?.user;

    // Pass both agencyMaid and maid to the form
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
