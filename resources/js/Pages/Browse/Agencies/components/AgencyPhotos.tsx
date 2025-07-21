import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";

export default function AgencyPhotos({ photos }: any) {
    if (!photos || photos.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Agency Photos</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                        No photos available for this agency.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Agency Photos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo: any) => (
                        <div key={photo.id} className="space-y-2">
                            <div className="aspect-square relative rounded-md overflow-hidden border">
                                <img
                                    src={`/storage/${photo.url}`}
                                    alt={photo.caption || "Agency photo"}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {photo.is_primary && (
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-blue-500">
                                            Primary
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="px-1">
                                {photo.display_caption && (
                                    <p className="text-sm font-medium">
                                        {photo.display_caption}
                                    </p>
                                )}
                                <div className="flex justify-between items-center mt-1">
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {photo.type_label || photo.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {format(
                                            new Date(photo.created_at),
                                            "MMM d, yyyy"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
