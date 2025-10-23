"use client";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { AIChatInterface } from "@/components/aichatbot/ai-chat-interface";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ChatHistory } from "@/components/aichatbot/chat-history";
import { ChatSuggestions } from "@/components/aichatbot/chat-suggestions";
import { motion } from "framer-motion";
export default function ChatbotPage() {
  return (
    <ProtectedRoute>
       <div className="min-h-screen bg-black text-white">
      <DashboardNav />

      {/* Main Content with proper spacing from navbar */}
      <main className="pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">


          {/* Flex-based responsive layout */}
          <div className="flex flex-wrap gap-6 lg:gap-8">
            {/* Left Sidebar - Chat History & Suggestions */}
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-6 order-2 lg:order-1">
              <ChatHistory />
            </div>

            {/* Center - Main Chat Interface */}
            <div className="flex-1 min-w-0 order-1 lg:order-2 ">
              <AIChatInterface />
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
