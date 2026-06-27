import React from "react";
import { Church } from "lucide-react";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-black text-white px-5 pt-6 pb-5 rounded-b-[2rem] shadow-md relative z-10 flex items-center space-x-3" id="app-header">
      <div className="bg-red-600 p-2.5 rounded-full flex items-center justify-center shadow-inner" id="header-icon-container">
        <Church className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-tight" id="header-title">{title}</h1>
        <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase" id="header-subtitle">Betel Eunápolis</p>
      </div>
    </header>
  );
}
