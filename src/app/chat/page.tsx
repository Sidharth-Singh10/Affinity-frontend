'use client'
import { motion } from "framer-motion";
import ChatBox from "@/components/chat/ChatBox";
import UserChat from "@/components/chat/userChat";
import { useApp } from "@/contexts/app-context";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

const Chat = () => {
  const { matches, isLoading, updateCurrentChat, error } = useApp();

  const emptyStateVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sparkleVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: { duration: 2, repeat: Infinity, repeatType: "loop" },
    },
  };

  const loadingVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
  };

  // Show loading state while fetching chats
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <DashboardNav />
        <motion.div
          className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-96px)]"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
        >
          <div className="text-center">
            <motion.div
              className="text-[#ff0059] text-4xl mb-4 inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⏳
            </motion.div>
            <h2 className="text-2xl font-semibold text-[#ff0059] mb-2">
              Loading Your Matches
            </h2>
            <p className="text-gray-600">Finding your conversations...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show error state if there's an error and no fallback data
  if (error && (!matches || matches.length === 0)) {
    return (
      <div className="min-h-screen bg-black text-white">
        <DashboardNav />
        <motion.div
          className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-96px)]"
          variants={emptyStateVariants}
          initial="initial"
          animate="animate"
        >
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-red-500 mb-2">
              Unable to Load Chats
            </h2>
            <p className="text-gray-600 mb-4">
              There was an issue loading your conversations.
            </p>
            <motion.button
              className="bg-[#ff0059] text-white px-6 py-2 rounded-full font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNav />

      {/* Main Content with proper spacing from navbar */}
      <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!matches || matches.length < 1 ? (
            <motion.div
              className="flex items-center justify-center min-h-[calc(100vh-200px)]"
              variants={emptyStateVariants}
              initial="initial"
              animate="animate"
            >
              <div className="text-center">
                <motion.div
                  className="text-[#ff0059] text-6xl mb-4 inline-block"
                  initial="initial"
                  animate="animate"
                >
                  ✨
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 text-[#ff0059]">
                  No Matches Yet
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Your perfect match is just around the corner! Keep exploring and
                  connecting.
                </p>
                <motion.button
                  className="bg-[#ff0059] text-white px-8 py-3 rounded-full font-semibold text-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(255,0,89,0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Navigate to explore page
                    window.location.href = '/explore';
                  }}
                >
                  Start Exploring
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-6 lg:gap-8">
              {/* Left Sidebar - User Chats */}
              <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                <motion.div
                  className="w-full bg-neutral-900 rounded-lg p-4 space-y-3 overflow-y-auto shadow-2xl"
                  style={{ maxHeight: 'calc(100vh - 200px)' }}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
                >
                  <div className="mb-4">
                    <h3 className="text-white text-lg font-semibold mb-2">
                      Your Matches
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {matches.length} conversation
                      {matches.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {matches.map((match, index) => {
                    // Ensure match has required properties
                    if (!match || !match.match_id) {
                      console.warn("Invalid match object at index", index, match);
                      return null;
                    }

                    return (
                      <motion.div
                        key={match.match_id}
                        onClick={() => updateCurrentChat(match)}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="cursor-pointer"
                      >
                        <UserChat match={match} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Center - Main Chat Box */}
              <div className="flex-1 min-w-0">
                <motion.div
                  className="rounded-lg shadow-2xl"
                  style={{ height: 'calc(100vh - 200px)' }}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
                >
                  <ChatBox />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;