'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Match } from "@/contexts/app-context";

interface UserChatProps {
    match: Match;
}

const UserChat: React.FC<UserChatProps> = ({ match }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Display information
    const displayName: string = match?.name || "Unknown User";
    const displayLocation: string = match?.location || "Location not provided";
    const displayAge: string | number = match?.age || "N/A";

    useEffect(() => {
        let isMounted = true;

        const fetchAvatar = async () => {
            if (!match?.user_id) return;

            try {
                const response = await api.getUserImages(match.user_id);
                if (!isMounted) return;

                // Safely extract image URL
                const avatar: string | null =
                    (response.data)?.image_url ||
                    (response.data as any)?.image_url ||
                    (response.data as string) ||
                    match?.image ||
                    null;

                setAvatarUrl(avatar);
            } catch (error) {
                console.error("Failed to fetch avatar:", error);
                if (isMounted && match?.image) {
                    setAvatarUrl(match.image);
                }
            }
        };

        fetchAvatar();

        return () => {
            isMounted = false;
        };
    }, [match?.user_id, match?.image]);

    // Use match.image as initial avatar while fetching
    const displayAvatar = avatarUrl || match?.image || "";

    return (
        <motion.div
            whileHover={{ scale: 1.05, backgroundColor: "#1a1a1a" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center p-4 justify-between rounded-lg transition-all h-auto max-h-32 md:max-h-40 w-full cursor-pointer"
        >
            <div className="flex items-center flex-1 min-w-0">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mr-3 flex-shrink-0"
                >
                    <img
                        src={displayAvatar}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover md:w-14 md:h-14"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                displayName
                            )}&background=ff0059&color=fff&size=56`;
                        }}
                    />
                </motion.div>

                <div className="text-content flex-1 min-w-0">
                    <div className="text-white font-semibold text-lg md:text-xl uppercase truncate">
                        {displayName}
                    </div>
                    <div className="text-gray-400 text-sm md:text-base truncate">
                        {displayAge} • {displayLocation}
                    </div>

                    {/* Show compatibility score if available */}
                    {match?.compatibility && (
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-[#ff0059]">
                                {match.compatibility}% Match
                            </span>
                        </div>
                    )}

                    {/* Show unread count if available */}
                    {match?.unread_count > 0 && (
                        <div className="inline-flex items-center justify-center bg-[#ff0059] text-white text-xs font-bold rounded-full w-5 h-5 mt-1">
                            {match.unread_count}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default UserChat;
