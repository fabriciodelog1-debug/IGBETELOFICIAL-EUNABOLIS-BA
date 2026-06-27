import React, { useState } from "react";
import { Camera, MapPin, CheckCircle, Navigation } from "lucide-react";
import { CultoSchedule, ChurchDatabase } from "../types";

interface CultosTabProps {
  db: ChurchDatabase;
  onUpdateCultoSchedule: (id: string, ministerName: string) => Promise<void>;
}

export default function CultosTab({ db, onUpdateCultoSchedule }: CultosTabProps) {
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const startEditing = (culto: CultoSchedule) => {
    setActiveEditingId(culto.id);
    setEditingValue(culto.ministerName);
  };

  const saveMinister = async (id: string) => {
    await onUpdateCultoSchedule(id, editingValue);
    setActiveEditingId(null);
    setStatusMessage("Ministrante atualizado com sucesso!");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const getDayAndHourBadge = (id: string) => {
    switch (id) {
      case "culto-ensino":
        return { day: "Qua", hour: "19h30" };
      case "culto-celebracao":
        return { day: "Sáb", hour: "19h" };
      case "culto-familia":
        return { day: "Dom", hour: "18h30" };
      default:
        return { day: "Cult", hour: "19h" };
    }
  };

  return (
    <div className="space-y-6 pb-24" id="cultos-tab-container">
      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in" id="status-toast-cultos">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* WORSHIP TIMES HEADER */}
      <div className="space-y-4" id="cultos-schedules-section">
        <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
          Horários de Culto
        </h3>

        <div className="space-y-4" id="cultos-list">
          {db.cultoSchedules.map((culto) => {
            const badge = getDayAndHourBadge(culto.id);
            const isEditing = activeEditingId === culto.id;

            return (
              <div 
                key={culto.id} 
                className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs space-y-4 hover:border-neutral-200 transition-all"
                id={`culto-card-${culto.id}`}
              >
                {/* Culto info row */}
                <div className="flex items-center space-x-4" id={`culto-info-row-${culto.id}`}>
                  {/* Black time box as shown in screenshots */}
                  <div className="bg-black text-white w-18 h-18 rounded-2xl flex flex-col items-center justify-center select-none shadow-sm shrink-0" id={`culto-timebox-${culto.id}`}>
                    <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-neutral-300">{badge.day}</span>
                    <span className="text-sm font-black tracking-tighter">{badge.hour}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-neutral-900 tracking-tight">{culto.name}</h4>
                    <p className="text-xs text-neutral-500 font-medium">{culto.dayAndHour}</p>
                  </div>
                </div>

                {/* Minister editing field */}
                <div className="bg-neutral-50 p-3.5 rounded-2.5xl flex flex-col space-y-2" id={`culto-minister-box-${culto.id}`}>
                  <label className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">Quem vai ministrar</label>
                  
                  <div className="flex items-center space-x-2.5" id={`culto-minister-input-row-${culto.id}`}>
                    {/* Simulated Camera picker icon */}
                    <button 
                      id={`culto-camera-btn-${culto.id}`}
                      className="bg-white p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-500 flex items-center justify-center shrink-0 transition-colors"
                      title="Adicionar foto do ministrante"
                      onClick={() => alert("Uploader de foto do ministrante: recurso em breve!")}
                    >
                      <Camera className="w-4 h-4" />
                    </button>

                    {isEditing ? (
                      <div className="flex-1 flex items-center space-x-2" id={`culto-edit-mode-${culto.id}`}>
                        <input
                          id={`culto-input-${culto.id}`}
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          placeholder="Nome de quem vai ministrar"
                          className="flex-1 bg-white px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:border-red-600"
                        />
                        <button
                          id={`culto-save-btn-${culto.id}`}
                          onClick={() => saveMinister(culto.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-red-700 active:scale-95 transition-all"
                        >
                          Salvar
                        </button>
                      </div>
                    ) : (
                      <div 
                        id={`culto-display-mode-${culto.id}`}
                        onClick={() => startEditing(culto)}
                        className="flex-1 bg-white px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs text-neutral-800 cursor-pointer hover:border-neutral-300 flex items-center justify-between"
                        title="Clique para editar"
                      >
                        <span className="font-semibold text-neutral-900">{culto.ministerName || "Toque para definir..."}</span>
                        <span className="text-[10px] text-red-600 font-bold hover:underline">Alterar</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHURCH LOCAL/ADDRESS */}
      <div className="space-y-3" id="cultos-local-section">
        <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
          Local
        </h3>

        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs space-y-4" id="cultos-address-card">
          <div className="flex items-start space-x-3.5" id="cultos-address-row">
            <div className="bg-red-50 text-red-600 p-3 rounded-2xl shadow-inner shrink-0" id="cultos-map-icon">
              <MapPin className="w-5.5 h-5.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Igreja Betel Eunápolis</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Av. Conselheiro Luis Viana, 120, Centro - Eunápolis BA, CEP 45820-000
              </p>
            </div>
          </div>

          <a 
            id="cultos-maps-link"
            href="https://maps.google.com/?q=-16.370636,-39.567028"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-neutral-900 text-white hover:bg-neutral-800 py-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-98"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>Abrir no Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}
