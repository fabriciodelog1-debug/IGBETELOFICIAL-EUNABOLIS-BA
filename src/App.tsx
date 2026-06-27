import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BottomNav, { TabType } from "./components/BottomNav";
import InicioTab from "./components/InicioTab";
import CultosTab from "./components/CultosTab";
import GruposTab from "./components/GruposTab";
import BibliaTab from "./components/BibliaTab";
import MaisTab from "./components/MaisTab";
import { ChurchDatabase, Member, PastoralGroup, Visitor, Lesson, DancaScale, LouvorScale, MidiaScale, Devocional } from "./types";
import { RefreshCw } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("inicio");
  const [moreSubtab, setMoreSubtab] = useState<string>("menu");
  const [db, setDb] = useState<ChurchDatabase | null>(null);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // Load identified member from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem("betel_identified_member");
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage", e);
    }
  }, []);

  // Save/remove identified member to localStorage
  const handleSetCurrentUser = (user: Member | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("betel_identified_member", JSON.stringify(user));
    } else {
      localStorage.removeItem("betel_identified_member");
    }
  };

  // Fetch Full Database from Server
  const fetchDb = async () => {
    try {
      const response = await fetch("/api/db");
      if (response.ok) {
        const data: ChurchDatabase = await response.json();
        setDb(data);
      }
    } catch (error) {
      console.error("Erro ao sincronizar com servidor da igreja:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial and Polling sync loop (every 4 seconds for immediate multi-user coordination)
  useEffect(() => {
    fetchDb();
    const interval = setInterval(fetchDb, 4000);
    return () => clearInterval(interval);
  }, []);

  // Action: Add/Update Member
  const handleUpdateMember = async (member: Member) => {
    try {
      const response = await fetch("/api/db/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member)
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao atualizar ficha de membro:", error);
    }
  };

  // Action: Delete Member
  const handleDeleteMember = async (id: string) => {
    try {
      const response = await fetch(`/api/db/member/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao excluir membro:", error);
    }
  };

  // Action: Add/Update Pastoral Group
  const handleAddGroup = async (group: Partial<PastoralGroup>) => {
    try {
      const response = await fetch("/api/db/pastoral-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group)
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao cadastrar grupo de pastoreio:", error);
    }
  };

  // Action: Delete Pastoral Group
  const handleDeleteGroup = async (id: string) => {
    try {
      const response = await fetch(`/api/db/pastoral-group/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao remover grupo de pastoreio:", error);
    }
  };

  // Action: Add Visitor to Group
  const handleAddVisitor = async (visitor: Partial<Visitor>) => {
    try {
      const response = await fetch("/api/db/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitor)
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao cadastrar visitante:", error);
    }
  };

  // Action: Add Lesson Study
  const handleAddLesson = async (lesson: Partial<Lesson>) => {
    try {
      const response = await fetch("/api/db/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lesson)
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao publicar lição de estudo:", error);
    }
  };

  // Action: Update Culto Schedule Minister
  const handleUpdateCultoSchedule = async (id: string, ministerName: string) => {
    try {
      const response = await fetch("/api/db/culto-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ministerName })
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao atualizar culto:", error);
    }
  };

  // Action: Update Dança Scale
  const handleUpdateScaleDanca = async (scale: Partial<DancaScale>) => {
    try {
      const response = await fetch("/api/db/scale/danca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scale)
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao salvar escala de dança:", error);
    }
  };

  // Action: Update Louvor Scale
  const handleUpdateScaleLouvor = async (scale: Partial<LouvorScale>) => {
    try {
      const response = await fetch("/api/db/scale/louvor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scale)
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao salvar escala de louvor:", error);
    }
  };

  // Action: Update Mídia Scale
  const handleUpdateScaleMidia = async (scale: Partial<MidiaScale>) => {
    try {
      const response = await fetch("/api/db/scale/midia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scale)
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao salvar escala de mídia:", error);
    }
  };

  // Action: Update Live Settings
  const handleUpdateLiveSettings = async (settings: any) => {
    try {
      const response = await fetch("/api/db/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao salvar transmissão ao vivo:", error);
    }
  };

  // Action: Generate Devocional with Gemini AI
  const handleGenerateDevocional = async (theme: string) => {
    const response = await fetch("/api/db/devocional/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme })
    });
    if (response.ok) {
      await fetchDb();
      const resData = await response.json();
      return resData;
    }
    throw new Error("Erro na geração");
  };

  // Action: Add Devocional Manual
  const handleAddDevocionalManual = async (devocional: Partial<Devocional>) => {
    try {
      const response = await fetch("/api/db/devocional/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(devocional)
      });
      if (response.ok) {
        await fetchDb();
      }
    } catch (error) {
      console.error("Erro ao criar devocional:", error);
    }
  };

  // Determine page header title dynamically
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "inicio":
        return "Igreja Betel";
      case "cultos":
        return "Cultos";
      case "grupos":
        return "Grupos Pastoreio";
      case "biblia":
        return "Bíblia Sagrada";
      case "mais":
        return "Mais";
      default:
        return "Igreja Betel";
    }
  };

  if (loading || !db) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6" id="app-loading-screen">
        <div className="text-center space-y-4 animate-pulse">
          <div className="bg-red-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg" id="loading-logo-box">
            <RefreshCw className="w-8 h-8 animate-spin text-white" />
          </div>
          <h2 className="text-lg font-black tracking-widest uppercase">Igreja Betel</h2>
          <p className="text-xs text-neutral-400 font-mono">Conectando ao servidor oficial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen font-sans" id="app-root-container">
      {/* Phone frame wrapper for standard presentation */}
      <div className="max-w-md mx-auto bg-neutral-50 min-h-screen shadow-2xl relative flex flex-col pb-24 border-x border-neutral-200" id="phone-app-wrapper">
        
        {/* Status bar top simulator for UI polish */}
        <div className="bg-black text-white/90 text-[10px] px-5 pt-2 pb-1 flex justify-between items-center font-semibold font-mono" id="simulated-status-bar">
          <span>12:41</span>
          <div className="flex items-center space-x-1.5" id="status-bar-icons">
            {/* Cellular strength dots */}
            <div className="flex items-end space-x-0.5 h-2.5">
              <span className="w-0.5 h-1 bg-white rounded-full" />
              <span className="w-0.5 h-1.5 bg-white rounded-full" />
              <span className="w-0.5 h-2 bg-white rounded-full" />
              <span className="w-0.5 h-2.5 bg-white rounded-full" />
            </div>
            <span>5G</span>
            {/* Battery icon */}
            <div className="border border-white/70 w-5 h-2.5 rounded-sm p-0.5 flex items-center">
              <div className="bg-white h-full w-4 rounded-xs" />
            </div>
            <span>82%</span>
          </div>
        </div>

        {/* Dynamic header */}
        <Header title={getHeaderTitle()} />

        {/* Tab views content switcher */}
        <main className="flex-1 px-5 pt-5 overflow-y-auto" id="app-main-content">
          {activeTab === "inicio" && (
            <InicioTab
              db={db}
              currentUser={currentUser}
              setCurrentUser={handleSetCurrentUser}
              setActiveTab={setActiveTab}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
              setMoreSubtab={setMoreSubtab}
              onRefreshDb={fetchDb}
            />
          )}

          {activeTab === "cultos" && (
            <CultosTab
              db={db}
              onUpdateCultoSchedule={handleUpdateCultoSchedule}
            />
          )}

          {activeTab === "grupos" && (
            <GruposTab
              db={db}
              onAddGroup={handleAddGroup}
              onDeleteGroup={handleDeleteGroup}
              onAddVisitor={handleAddVisitor}
              onAddLesson={handleAddLesson}
            />
          )}

          {activeTab === "biblia" && (
            <BibliaTab />
          )}

          {activeTab === "mais" && (
            <MaisTab
              db={db}
              onUpdateScaleDanca={handleUpdateScaleDanca}
              onUpdateScaleLouvor={handleUpdateScaleLouvor}
              onUpdateScaleMidia={handleUpdateScaleMidia}
              onUpdateLiveSettings={handleUpdateLiveSettings}
              onGenerateDevocional={handleGenerateDevocional}
              onAddDevocionalManual={handleAddDevocionalManual}
              subtab={moreSubtab}
              setSubtab={setMoreSubtab}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setMoreSubtab("menu"); }} />
      </div>
    </div>
  );
}
