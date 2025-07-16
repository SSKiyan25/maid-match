import { CardContent } from "@/Components/ui/card";
import MaidCard from "./Card";

export default function MaidSelectionContent({
    processedMaids,
    selectedMaids,
    isMaidSelected,
    onSelectMaid,
    availableCredits,
    jobPost,
    setModalMaid,
}: {
    processedMaids: any[];
    selectedMaids: any[];
    isMaidSelected: (id: any) => boolean;
    onSelectMaid: (maid: any) => void;
    availableCredits: number;
    jobPost: any;
    setModalMaid: (maid: any) => void;
}) {
    return (
        <CardContent>
            {processedMaids.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        No maids match your criteria
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {processedMaids.map((maidRecord) => (
                        <MaidCard
                            key={maidRecord.maid.id}
                            maidRecord={maidRecord}
                            isSelected={isMaidSelected(maidRecord.maid.id)}
                            onSelectMaid={onSelectMaid}
                            availableCredits={availableCredits}
                            selectedMaidsCount={selectedMaids.length}
                            jobPost={jobPost}
                            setModalMaid={setModalMaid}
                        />
                    ))}
                </div>
            )}
        </CardContent>
    );
}
