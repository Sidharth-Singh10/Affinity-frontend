'use client'
import React, { useEffect, useState, memo } from "react";
import { User } from "@/contexts/app-context";
import { logger } from "@/lib/logger";
import { useApp } from "@/contexts/app-context";

interface ChatHeaderProps {
    userInfo?: User;
}

const ChatHeader = ({ userInfo }: ChatHeaderProps) => {
    const { fetchImagesById } = useApp();
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

    const displayName = userInfo?.name || userInfo?.username || "Unknown User";

    // Load avatar whenever userInfo.id changes
    useEffect(() => {
        let isMounted = true;

        const loadAvatar = async () => {
            if (!userInfo?.id) {
                const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    displayName
                )}&background=ff0059&color=fff&size=64`;
                setAvatarUrl(fallback);
                setIsLoadingAvatar(false);
                return;
            }

            setIsLoadingAvatar(true);

            try {
                logger.debug("ChatHeader - Loading avatar for user:", userInfo.id);
                const imageUrl = await fetchImagesById(userInfo.id);

                if (isMounted) {
                    if (imageUrl) {
                        logger.debug("ChatHeader - Avatar loaded:", imageUrl);
                        setAvatarUrl(imageUrl);
                    } else {
                        const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            displayName
                        )}&background=ff0059&color=fff&size=64`;
                        setAvatarUrl(fallback);
                    }
                    setIsLoadingAvatar(false);
                }
            } catch (error) {
                logger.error('Failed to load avatar:', error);
                if (isMounted) {
                    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        displayName
                    )}&background=ff0059&color=fff&size=64`;
                    setAvatarUrl(fallback);
                    setIsLoadingAvatar(false);
                }
            }
        };

        loadAvatar();

        return () => {
            isMounted = false;
        };
    }, [userInfo?.id, displayName, fetchImagesById]);

    if (!displayName) {
        logger.error("Display name could not be determined in ChatHeader");
        return null;
    }

    return (
        <div className="flex items-center p-4 border-b border-gray-700">
            <div className="relative">
                <img
                    src={avatarUrl}
                    alt={`${displayName}'s avatar`}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            displayName
                        )}&background=ff0059&color=fff&size=64`;
                    }}
                />
                {isLoadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full">
                        <div className="w-4 h-4 border-2 border-[#ff0059] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-lg truncate">
                    {displayName}
                </div>
            </div>
        </div>
    );
};

// Only re-render when userInfo.id changes
export default memo(ChatHeader, (prevProps, nextProps) => {
    return prevProps.userInfo?.id === nextProps.userInfo?.id;
});