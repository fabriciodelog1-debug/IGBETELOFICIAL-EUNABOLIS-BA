import React from "react";
import { Home, Calendar, Users, BookOpen, MoreHorizontal } from "lucide-react";

export type TabType = "inicio" | "cultos" | "grupos" | "biblia" | "mais";

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: "inicio" as TabType, label: "Início", icon: Home },
    { id: "cultos" as TabType, label: "Cultos", icon: Calendar },
    { id: "grupos" as TabType, label: "Grupos", icon: Users },
    { id: "biblia" as TabType, label: "Bíblia", icon: BookOpen },
    { id: "mais" as TabType, label: "Mais", icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 py-2 px-4 flex justify-around items-center z-50 shadow-lg rounded-t-2xl max-w-md mx-auto" id="bottom-navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-btn-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center space-y-0.5 w-16 transition-all duration-200 ${
              isActive ? "text-red-600 scale-105" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Icon className={`w-5.5 h-5.5 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
            <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
