import { Button } from "@/Components/ui/button";
import { MaidData } from "@/types";
import { Image, Upload, PlusCircle, Trash2 } from "lucide-react";

interface PhotosTabProps {
    maid: MaidData;
}

export default function PhotosTab({ maid }: PhotosTabProps) {
    return (
        <div className="p-6 pt-5 space-y-6">
            {/* Banner Photo Section */}
            <div>
                <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                    <Image className="h-4 w-4 text-primary/70" />
                    Profile Banner
                </h3>
                <div className="border rounded-lg p-4 bg-muted/30">
                    {maid.maid.banner_photo ? (
                        <div className="relative group">
                            <img
                                src={`/storage/${maid.maid.banner_photo.replace(
                                    /^\/+/,
                                    ""
                                )}`}
                                alt="Profile Banner"
                                className="w-full h-[200px] object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary">
                                        <PlusCircle className="h-3.5 w-3.5 mr-1" />
                                        Change
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed rounded-md p-4 text-center">
                            <Image className="h-10 w-10 text-muted-foreground/50 mb-2" />
                            <p className="text-muted-foreground mb-2">
                                No banner photo uploaded
                            </p>
                            <Button size="sm" variant="secondary">
                                <Upload className="h-3.5 w-3.5 mr-1" />
                                Upload Banner
                            </Button>
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                        Recommended size: 1200 x 400 pixels. Max file size: 2MB
                    </p>
                </div>
            </div>

            {/* Gallery Photos Section */}
            <div>
                <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                    <Image className="h-4 w-4 text-primary/70" />
                    Photo Gallery
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Example photos - replace with actual data */}
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="relative group aspect-square"
                        >
                            <img
                                src={`https://placehold.co/400x400/e2e8f0/475569?text=Photo+${item}`}
                                alt={`Gallery photo ${item}`}
                                className="w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                <Button size="sm" variant="destructive">
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Upload new photo placeholder */}
                    <div className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md p-4 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground text-sm mb-2">
                            Add photo
                        </p>
                        <Button size="sm" variant="outline">
                            Upload
                        </Button>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                    Upload up to 6 photos. Max file size: 2MB per photo.
                </p>
            </div>
        </div>
    );
}
