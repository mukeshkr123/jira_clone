import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MemberAvatarProps {
    name: string;
    className?: string;
    fallbackClassName?: string;
    image?: string;
}

export const MemberAvatar = ({
    name,
    className,
    fallbackClassName,
    image
}: MemberAvatarProps) => {

    if (image) {
        return (
            <div
                className={cn("size-5 relative rounded-md overflow-hidden", className)}
            >
                <Image src={image} alt={name} fill className="object-cover" />
            </div>
        );
    }
    return (
        <Avatar
            className={cn(
                "size-5 transition border border-neutral-300 rounded-full",
                className
            )}
        >
            <AvatarFallback
                className={cn(
                    "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
                    fallbackClassName
                )}
            >
                {name?.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
};