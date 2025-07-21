import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Mail, Phone, MapPin, Calendar, Globe } from "lucide-react";
import { format } from "date-fns";

interface ContactInfo {
    email?: string;
    phone?: string;
    isPhonePrivate?: boolean;
    address?: string;
    isAddressPrivate?: boolean;
    birthDate?: string;
    preferredLanguage?: string;
    preferredContactMethods?: string[];
}

interface ProfileContactProps {
    contactInfo: ContactInfo;
    additionalInfo?: React.ReactNode;
}

export default function ProfileContact({
    contactInfo,
    additionalInfo,
}: ProfileContactProps) {
    const {
        email,
        phone,
        isPhonePrivate,
        address,
        isAddressPrivate,
        birthDate,
        preferredLanguage,
        preferredContactMethods = [],
    } = contactInfo;

    const age = birthDate
        ? Math.floor(
              (new Date().getTime() - new Date(birthDate).getTime()) /
                  (365.25 * 24 * 60 * 60 * 1000)
          )
        : null;

    const getLanguageDisplay = (code: string) => {
        const languages: Record<string, string> = {
            en: "English",
            tl: "Tagalog",
            ceb: "Cebuano",
            fil: "Filipino",
        };
        return languages[code] || code;
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    Contact Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Contact methods */}
                {preferredContactMethods.length > 0 && (
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">
                            Preferred Contact
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {preferredContactMethods.map((method) => (
                                <Badge
                                    key={method}
                                    variant="outline"
                                    className="capitalize"
                                >
                                    {method}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact details list */}
                <div className="space-y-3">
                    {/* Email */}
                    {email && (
                        <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-sm">{email}</p>
                                <p className="text-xs text-muted-foreground">
                                    Email
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Phone */}
                    {phone && !isPhonePrivate && (
                        <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-sm">{phone}</p>
                                <p className="text-xs text-muted-foreground">
                                    Phone
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    {address && !isAddressPrivate && (
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-sm">{address}</p>
                                <p className="text-xs text-muted-foreground">
                                    Address
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Age/Birth Date */}
                    {birthDate && (
                        <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-sm">
                                    {age} years old (
                                    {format(new Date(birthDate), "MMM d, yyyy")}
                                    )
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Age
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Language */}
                    {preferredLanguage && (
                        <div className="flex items-start gap-2">
                            <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-sm capitalize">
                                    {getLanguageDisplay(preferredLanguage)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Preferred Language
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Additional custom info */}
                    {additionalInfo}
                </div>
            </CardContent>
        </Card>
    );
}
