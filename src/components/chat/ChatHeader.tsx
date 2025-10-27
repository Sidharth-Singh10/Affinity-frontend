'use client'
import {  useApp, User } from "@/contexts/app-context";
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
    const { user, images, fetchImages } = useApp();
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    const displayName =
        userInfo?.name || userInfo?.username || "Unknown User";

    if (!displayName) {
        logger.error("Display name could not be determined in ChatHeader");
        return null;
    }

    useEffect(() => {
        let isMounted = true;

        const loadAvatar = async () => {
            try {
                if (user?.id) {
                    if (images.length === 0) {
                        await fetchImages();
                    }

                    const primaryImage = images.find(img => img.is_primary) || images[0];
                    if (isMounted && primaryImage?.image_url) {
                        setAvatarUrl(primaryImage.image_url);
                        return;
                    }
                }

                if (isMounted) {
                    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        displayName || user?.name || 'User'
                    )}&background=ff0059&color=fff&size=64`;
                    setAvatarUrl(fallback);
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
    }, [user?.id, images, displayName, fetchImages]);

    const finalAvatar =
        avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            displayName
        )}&background=ff0059&color=fff&size=64`;

    return (
        <div className="flex items-center p-4 border-b border-gray-700">
            <img
                src={finalAvatar}
                alt={`${displayName}'s avatar`}
                className="w-10 h-10 rounded-full object-cover mr-3"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        displayName
                    )}&background=ff0059&color=fff&size=64`;
                }}
            />
            <div className="text-white font-semibold text-lg truncate">
                {displayName}
            </div>
        </div>
    );
};

export default ChatHeader;

