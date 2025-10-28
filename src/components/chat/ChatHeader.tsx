'use client'
import React from "react";
import { useApp, User } from "@/contexts/app-context";
import { logger } from "@/lib/logger";
import { useEffect, useState } from "react";

interface ChatHeaderProps {
    userInfo?: User; // since you’re passing possibly undefined
    messageCounts: {
        confirmed: number;
        pending: number;
        failed: number;
        total: number;
    };
    isLoading: boolean;
}

/* eslint-disable react/prop-types */
const ChatHeader = ({ userInfo, messageCounts, isLoading }: ChatHeaderProps) => {
    const { user, images, fetchImagesById } = useApp();
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    console.log("ChatHeader - userInfo:", userInfo);


    const displayName =
        userInfo?.name || userInfo?.username || "Unknown User";

    console.log("ChatHeader - displayName:", displayName);

    if (!displayName) {
        logger.error("Display name could not be determined in ChatHeader");
        return null;
    }

    useEffect(() => {
        let isMounted = true;

        const loadAvatar = async () => {
            try {
                if (userInfo?.id) {
                    if (images.length === 0) {
                        let image_url = await fetchImagesById(userInfo?.id);
                        console.log("ChatHeader - fetched image_url:", image_url);
                        setAvatarUrl(image_url);
                    }
                }


            } catch (error) {
                console.error('Failed to load avatar:', error);
                if (isMounted) {
                    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        displayName || user?.name || 'User'
                    )}&background=ff0059&color=fff&size=64`;
                    setAvatarUrl(fallback);
                }
            }
        };

        loadAvatar();

        return () => {
            isMounted = false;
        };
    }, []);



    return (
        <div className="flex items-center p-4 border-b border-gray-700">
            <img
                src={avatarUrl}
                alt={`${displayName}'s avatar`}
                className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div className="text-white font-semibold text-lg truncate">
                {displayName}
            </div>
        </div>
    );
};

export default React.memo(ChatHeader);

