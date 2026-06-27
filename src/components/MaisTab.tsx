import React, { useState } from "react";
import { 
  Tv, Radio, Calendar, Heart, Share2, Users, ClipboardList, BookOpen, Sparkles, Check,
  ChevronRight, ArrowLeft, Save, Edit, RefreshCw, Smartphone, Play, Pause, Plus, Trash2, Mail, Phone, CalendarRange,
  Instagram, Youtube, Facebook
} from "lucide-react";
import { ChurchDatabase, Devocional, DancaScale, LouvorScale, MidiaScale, Member } from "../types";

interface MaisTabProps {
  db: ChurchDatabase;
  onUpdateScaleDanca: (scale: Partial<DancaScale>) => Promise<void>;
  onUpdateScaleLouvor: (scale: Partial<LouvorScale>) => Promise<void>;
  onUpdateScaleMidia: (scale: Partial<MidiaScale>) => Promise<void>;
  onUpdateLiveSettings: (settings: any) => Promise<void>;
  onGenerateDevocional: (theme: string) => Promise<any>;
  onAddDevocionalManual: (devocional: Partial<Devocional>) => Promise<void>;
  subtab: string;
  setSubtab: (subtab: string) => void;
}

export default function MaisTab({
  db,
  onUpdateScaleDanca,
  onUpdateScaleLouvor,
  onUpdateScaleMidia,
  onUpdateLiveSettings,
  onGenerateDevocional,
  onAddDevocionalManual,
  subtab,
  setSubtab
}: MaisTabProps) {
  // Local notification banner
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Live player playback helpers
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const toggleRadio = () => {
    if (!audioRef.current) return;
    if (isRadioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Erro player rádio:", e));
    }
    setIsRadioPlaying(!isRadioPlaying);
  };

  // Edit live form states
  const [isLiveActive, setIsLiveActive] = useState(db.liveSettings.isLive);
  const [liveTitle, setLiveTitle] = useState(db.liveSettings.title);
  const [liveDesc, setLiveDesc] = useState(db.liveSettings.description);
  const [liveYoutube, setLiveYoutube] = useState(db.liveSettings.youtubeUrl);
  const [liveRadio, setLiveRadio] = useState(db.liveSettings.radioUrl);
  const [liveTv, setLiveTv] = useState(db.liveSettings.tvUrl);

  const handleSaveLiveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateLiveSettings({
      isLive: isLiveActive,
      title: liveTitle,
      description: liveDesc,
      youtubeUrl: liveYoutube,
      radioUrl: liveRadio,
      tvUrl: liveTv
    });
    triggerSuccess("Configurações de transmissão atualizadas!");
  };

  // Dança Scale local states
  const [dResponsavel, setDResponsavel] = useState(db.dancaScale.ministroResponsavel);
  const [dDancers, setDDancers] = useState([...db.dancaScale.dancers, "", "", "", "", "", "", "", "", ""].slice(0, 9));

  const handleSaveDancaScale = async () => {
    await onUpdateScaleDanca({
      ministroResponsavel: dResponsavel,
      dancers: dDancers.filter(d => d.trim() !== "")
    });
    triggerSuccess("Escala de Dança salva com sucesso!");
  };

  // Louvor Scale local states
  const [lTeclado, setLTeclado] = useState(db.louvorScale.teclado || "");
  const [lViolao, setLViolao] = useState(db.louvorScale.violao || "");
  const [lBateria, setLBateria] = useState(db.louvorScale.bateria || "");
  const [lGuitarra, setLGuitarra] = useState(db.louvorScale.guitarra || "");
  const [lInstrumentoAdicional1, setLInstrumentoAdicional1] = useState(db.louvorScale.instrumentoAdicional1 || "");
  const [lInstrumentoAdicional2, setLInstrumentoAdicional2] = useState(db.louvorScale.instrumentoAdicional2 || "");
  const [lInstrumentoAdicional3, setLInstrumentoAdicional3] = useState(db.louvorScale.instrumentoAdicional3 || "");
  const [lVozPrincipal, setLVozPrincipal] = useState(db.louvorScale.vozPrincipal || "");
  const [lPrimeiraVoz, setLPrimeiraVoz] = useState(db.louvorScale.primeiraVoz || "");
  const [lSegundaVoz, setLSegundaVoz] = useState(db.louvorScale.segundaVoz || "");
  const [lTerceiraVoz, setLTerceiraVoz] = useState(db.louvorScale.terceiraVoz || "");
  const [lQuartaVoz, setLQuartaVoz] = useState(db.louvorScale.quartaVoz || "");
  const [lSongLinks, setLSongLinks] = useState<string[]>(() => {
    const arr = db.louvorScale.songLinks || [];
    return [...arr, "", "", "", "", ""].slice(0, 5);
  });

  const handleSaveLouvorScale = async () => {
    await onUpdateScaleLouvor({
      teclado: lTeclado,
      violao: lViolao,
      bateria: lBateria,
      guitarra: lGuitarra,
      instrumentoAdicional1: lInstrumentoAdicional1,
      instrumentoAdicional2: lInstrumentoAdicional2,
      instrumentoAdicional3: lInstrumentoAdicional3,
      vozPrincipal: lVozPrincipal,
      primeiraVoz: lPrimeiraVoz,
      segundaVoz: lSegundaVoz,
      terceiraVoz: lTerceiraVoz,
      quartaVoz: lQuartaVoz,
      songLinks: lSongLinks.map(s => s.trim())
    });
    triggerSuccess("Escala de Louvor salva com sucesso!");
  };

  // Mídia Scale local states
  const [mCamarim, setMCamarim] = useState(db.midiaScale.camarim);
  const [mMovel, setMMovel] = useState(db.midiaScale.movel);
  const [mMesaCorte, setMMesaCorte] = useState(db.midiaScale.mesaDeCorte);
  const [mCadaShow, setMCadaShow] = useState(db.midiaScale.cadaShow);
  const [mIluminacao, setMIluminacao] = useState(db.midiaScale.iluminacao);
  const [mFuturo1, setMFuturo1] = useState(db.midiaScale.futuro1);
  const [mFuturo2, setMFuturo2] = useState(db.midiaScale.futuro2);
  const [mFuturo3, setMFuturo3] = useState(db.midiaScale.futuro3);

  const handleSaveMidiaScale = async () => {
    await onUpdateScaleMidia({
      camarim: mCamarim,
      movel: mMovel,
      mesaDeCorte: mMesaCorte,
      cadaShow: mCadaShow,
      iluminacao: mIluminacao,
      futuro1: mFuturo1,
      futuro2: mFuturo2,
      futuro3: mFuturo3
    });
    triggerSuccess("Escala de Mídia salva com sucesso!");
  };

  // Devocional AI generator state
  const [devTheme, setDevTheme] = useState("");
  const [isGeneratingDev, setIsGeneratingDev] = useState(false);

  // Devocional Manual state
  const [showManualDevForm, setShowManualDevForm] = useState(false);
  const [mDevTitle, setMDevTitle] = useState("");
  const [mDevVerse, setMDevVerse] = useState("");
  const [mDevContent, setMDevContent] = useState("");

  const handleAIGenerateDevocional = async () => {
    if (!devTheme) return;
    setIsGeneratingDev(true);
    try {
      await onGenerateDevocional(devTheme);
      triggerSuccess("Devocional gerado e publicado!");
      setDevTheme("");
    } catch (error) {
      alert("Erro ao gerar devocional com AI");
    } finally {
      setIsGeneratingDev(false);
    }
  };

  const handleCreateManualDevocional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mDevTitle || !mDevVerse || !mDevContent) return;

    await onAddDevocionalManual({
      title: mDevTitle,
      verse: mDevVerse,
      content: mDevContent
    });

    triggerSuccess("Devocional manual publicado!");
    setMDevTitle("");
    setMDevVerse("");
    setMDevContent("");
    setShowManualDevForm(false);
  };

  const menuItems = [
    { id: "live", label: "Ao Vivo (Rádio, TV & Live)", desc: "Transmissões e rádio web", icon: Tv },
    { id: "escalas", label: "Escala Ministerial", desc: "Dança, Louvor e Mídia", icon: ClipboardList },
    { id: "devocionais", label: "Devocional Diário", desc: "Reflexões edificantes com IA", icon: Heart },
    { id: "membros", label: "Cadastro de Membros", desc: "Visualizar lista oficial de membros", icon: Users },
    { id: "eventos", label: "Próximos Eventos", desc: "Agenda da Igreja Betel", icon: CalendarRange },
    { id: "social", label: "Redes Sociais", desc: "Instagram e contatos", icon: Share2 }
  ];

  return (
    <div className="space-y-6 pb-24" id="mais-tab-container">
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in fixed top-4 left-4 right-4 z-50 shadow-md max-w-sm mx-auto" id="toast-success-mais">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* RÁDIO PLAYBACK HIDDEN NODE */}
      <audio ref={audioRef} src={db.liveSettings.radioUrl} id="radio-audio-element" />

      {/* HEADER WITH BACK BUTTON FOR SUB-PAGES */}
      {subtab !== "menu" && (
        <button
          id="btn-back-to-more-menu"
          onClick={() => setSubtab("menu")}
          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Menu Principal</span>
        </button>
      )}

      {/* SUBTAB MENU (HOME OF MAIS) */}
      {subtab === "menu" && (
        <div className="space-y-4" id="more-menu-grid">
          <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
            Mais Recursos
          </h3>

          <div className="bg-white rounded-3xl overflow-hidden border border-neutral-100 divide-y divide-neutral-100 shadow-sm" id="more-links-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`more-menu-item-${item.id}`}
                  onClick={() => setSubtab(item.id)}
                  className="w-full p-4.5 flex items-center justify-between hover:bg-neutral-50 active:bg-neutral-100 transition-all text-left"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="bg-red-50 text-red-600 p-2.5 rounded-xl shadow-inner shrink-0">
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-neutral-900 leading-tight">{item.label}</h4>
                      <p className="text-[10px] text-neutral-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB: LIVE (AO VIVO, RÁDIO, TV) */}
      {subtab === "live" && (
        <div className="space-y-6" id="more-sub-live">
          {/* Stream Settings for Admins */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-4 text-neutral-800" id="live-config-panel">
            <h4 className="text-xs font-black uppercase tracking-wider text-red-600 border-b border-neutral-100 pb-2">Controle da Transmissão</h4>
            
            <form onSubmit={handleSaveLiveSettings} className="space-y-3" id="live-settings-form">
              <div className="flex items-center justify-between" id="live-status-toggle">
                <span className="text-xs font-bold text-neutral-700">Ativar Transmissão Ao Vivo</span>
                <input 
                  id="live-toggle-checkbox"
                  type="checkbox" 
                  checked={isLiveActive} 
                  onChange={(e) => setIsLiveActive(e.target.checked)}
                  className="w-4 h-4 accent-red-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Título da Transmissão</label>
                <input 
                  id="live-input-title"
                  type="text" 
                  value={liveTitle} 
                  onChange={(e) => setLiveTitle(e.target.value)} 
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                  placeholder="Ex: Culto da Família Ao Vivo"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Descrição</label>
                <input 
                  id="live-input-desc"
                  type="text" 
                  value={liveDesc} 
                  onChange={(e) => setLiveDesc(e.target.value)} 
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                  placeholder="Ex: Culto de celebração de Domingo"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">URL do Live YouTube (Embed)</label>
                <input 
                  id="live-input-yt"
                  type="text" 
                  value={liveYoutube} 
                  onChange={(e) => setLiveYoutube(e.target.value)} 
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2" id="streams-urls-grid">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-neutral-400">Stream Rádio Web (MP3)</label>
                  <input 
                    id="live-input-radio"
                    type="text" 
                    value={liveRadio} 
                    onChange={(e) => setLiveRadio(e.target.value)} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-neutral-400">Stream TV Web (Video)</label>
                  <input 
                    id="live-input-tv"
                    type="text" 
                    value={liveTv} 
                    onChange={(e) => setLiveTv(e.target.value)} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <button
                id="live-save-btn"
                type="submit"
                className="w-full bg-red-600 text-white font-bold py-2 rounded-xl text-xs shadow-sm hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Salvar & Sincronizar Canais</span>
              </button>
            </form>
          </div>

          {/* PLAYERS SECTION */}
          <div className="space-y-4" id="live-playback-players">
            <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
              Players Ao Vivo
            </h3>

            {/* TV & YouTube Web Player */}
            {db.liveSettings.isLive ? (
              <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs space-y-4" id="video-stream-box">
                <h4 className="text-xs font-black text-neutral-900 tracking-tight uppercase">TV Web & Live YouTube</h4>
                <div className="aspect-video bg-neutral-900 rounded-2xl overflow-hidden relative" id="video-iframe-container">
                  {db.liveSettings.youtubeUrl ? (
                    <iframe
                      id="youtube-live-iframe"
                      src={db.liveSettings.youtubeUrl}
                      title="YouTube Live"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      id="tv-web-video"
                      src={db.liveSettings.tvUrl} 
                      controls 
                      className="w-full h-full"
                    />
                  )}
                </div>
                <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-[10px] text-red-700 font-bold" id="tv-player-info">
                  Culto Ao Vivo direto da betel. Compartilhe com familiares!
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-xs text-center text-neutral-500" id="offline-tv-box">
                <Tv className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
                <p className="text-xs font-bold">Nenhuma transmissão de TV/YouTube ativa no momento.</p>
                <p className="text-[10px] text-neutral-400 mt-1">Inscreva-se nos nossos canais para receber avisos.</p>
              </div>
            )}

            {/* RÁDIO WEB PLAYER */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs text-center space-y-4 text-neutral-800" id="radio-player-box">
              <h4 className="text-xs font-black tracking-tight uppercase text-neutral-800 text-left">Rádio Web Betel FM</h4>
              <div className="bg-neutral-50 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 border border-neutral-200" id="radio-pills">
                <div className={`bg-black text-red-600 p-4 rounded-full shadow-inner ${isRadioPlaying ? "animate-pulse border-2 border-red-600" : ""}`} id="radio-playing-icon">
                  <Radio className="w-10 h-10 text-red-600" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-neutral-900 leading-tight">Louvores & Mensagens 24h</h5>
                  <p className="text-[10px] text-neutral-400 font-mono tracking-wider mt-0.5">
                    {isRadioPlaying ? "Sintonizado • AO VIVO" : "Rádio Desconectada • Ouvir"}
                  </p>
                </div>
                <button
                  id="btn-play-pause-radio"
                  onClick={toggleRadio}
                  className={`px-6 py-2.5 rounded-full text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 ${
                    isRadioPlaying ? "bg-red-600 text-white hover:bg-red-700" : "bg-neutral-900 text-white hover:bg-neutral-800"
                  }`}
                >
                  {isRadioPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isRadioPlaying ? "Pausar Rádio" : "Ouvir Agora"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: ESCALAS MINISTERIAIS (DANÇA, LOUVOR, MÍDIA) */}
      {subtab === "escalas" && (
        <div className="space-y-6 text-neutral-800" id="more-sub-escalas">
          
          {/* DANÇA MINISTRY SCALE */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-4" id="danca-scale-box">
            <h4 className="text-xs font-black uppercase tracking-wider text-red-600 border-b border-neutral-100 pb-2 flex items-center justify-between">
              <span>Ministério de Dança</span>
              <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Dançarinos</span>
            </h4>

            <div className="space-y-3" id="danca-scale-inputs">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Ministro Responsável</label>
                <input 
                  id="danca-input-responsavel"
                  type="text" 
                  value={dResponsavel} 
                  onChange={(e) => setDResponsavel(e.target.value)} 
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Dançarinos Escala (Até 9 Vagas)</label>
                <div className="grid grid-cols-3 gap-2" id="dancers-inputs-grid">
                  {dDancers.map((dancer, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <span className="text-[8px] text-neutral-400 font-mono">Dançarino {idx + 1}</span>
                      <input 
                        id={`danca-input-dancer-${idx}`}
                        type="text" 
                        value={dancer} 
                        onChange={(e) => {
                          const updated = [...dDancers];
                          updated[idx] = e.target.value;
                          setDDancers(updated);
                        }}
                        className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-[10px] outline-none focus:border-red-600"
                        placeholder="Nome"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                id="danca-save-btn"
                onClick={handleSaveDancaScale}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold py-2 rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Escala Dança</span>
              </button>
            </div>
          </div>

          {/* LOUVOR MINISTRY SCALE */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-4" id="louvor-scale-box">
            <h4 className="text-xs font-black uppercase tracking-wider text-red-600 border-b border-neutral-100 pb-2 flex items-center justify-between">
              <span>Ministério de Louvor</span>
              <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">Escala Oficial</span>
            </h4>

            <div className="space-y-4" id="louvor-scale-inputs">
              {/* INSTRUMENTOS */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Instrumentos</span>
                <div className="grid grid-cols-2 gap-2" id="banda-inputs-grid">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-neutral-400">No Teclado</label>
                    <input 
                      id="louvor-input-teclado"
                      type="text" 
                      value={lTeclado} 
                      onChange={(e) => setLTeclado(e.target.value)} 
                      placeholder="Nome do tecladista"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600 font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-neutral-400">No Violão</label>
                    <input 
                      id="louvor-input-violao"
                      type="text" 
                      value={lViolao} 
                      onChange={(e) => setLViolao(e.target.value)} 
                      placeholder="Nome do violonista"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600 font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-neutral-400">Na Bateria</label>
                    <input 
                      id="louvor-input-bateria"
                      type="text" 
                      value={lBateria} 
                      onChange={(e) => setLBateria(e.target.value)} 
                      placeholder="Nome do baterista"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600 font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-neutral-400">Na Guitarra</label>
                    <input 
                      id="louvor-input-guitarra"
                      type="text" 
                      value={lGuitarra} 
                      onChange={(e) => setLGuitarra(e.target.value)} 
                      placeholder="Nome do guitarrista"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600 font-semibold"
                    />
                  </div>
                </div>

                {/* Instrumentos Adicionais */}
                <div className="space-y-1 pt-1">
                  <label className="text-[9px] uppercase font-bold text-neutral-400">Instrumentos Adicionais</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      id="louvor-input-adicional1"
                      type="text" 
                      value={lInstrumentoAdicional1} 
                      onChange={(e) => setLInstrumentoAdicional1(e.target.value)} 
                      placeholder="Inst. Adicional 1"
                      className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-[10px] outline-none focus:border-red-600 font-medium"
                    />
                    <input 
                      id="louvor-input-adicional2"
                      type="text" 
                      value={lInstrumentoAdicional2} 
                      onChange={(e) => setLInstrumentoAdicional2(e.target.value)} 
                      placeholder="Inst. Adicional 2"
                      className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-[10px] outline-none focus:border-red-600 font-medium"
                    />
                    <input 
                      id="louvor-input-adicional3"
                      type="text" 
                      value={lInstrumentoAdicional3} 
                      onChange={(e) => setLInstrumentoAdicional3(e.target.value)} 
                      placeholder="Inst. Adicional 3"
                      className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-[10px] outline-none focus:border-red-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* VOCAIS */}
              <div className="space-y-2 border-t border-neutral-100 pt-3">
                <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Vozes</span>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-neutral-400">Voz Principal</label>
                    <input 
                      id="louvor-input-voz-principal"
                      type="text" 
                      value={lVozPrincipal} 
                      onChange={(e) => setLVozPrincipal(e.target.value)} 
                      placeholder="Nome da voz principal"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600 font-semibold"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-neutral-400">Primeira Voz</label>
                      <input 
                        id="louvor-input-primeira-voz"
                        type="text" 
                        value={lPrimeiraVoz} 
                        onChange={(e) => setLPrimeiraVoz(e.target.value)} 
                        placeholder="Nome"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-neutral-400">Segunda Voz</label>
                      <input 
                        id="louvor-input-segunda-voz"
                        type="text" 
                        value={lSegundaVoz} 
                        onChange={(e) => setLSegundaVoz(e.target.value)} 
                        placeholder="Nome"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-neutral-400">Terceira Voz</label>
                      <input 
                        id="louvor-input-terceira-voz"
                        type="text" 
                        value={lTerceiraVoz} 
                        onChange={(e) => setLTerceiraVoz(e.target.value)} 
                        placeholder="Nome"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-neutral-400">Quarta Voz</label>
                      <input 
                        id="louvor-input-quarta-voz"
                        type="text" 
                        value={lQuartaVoz} 
                        onChange={(e) => setLQuartaVoz(e.target.value)} 
                        placeholder="Nome"
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CANÇÕES E LINKS */}
              <div className="space-y-2 border-t border-neutral-100 pt-3">
                <span className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Links das Canções (Repertório)</span>
                <div className="space-y-2" id="repertorio-inputs">
                  {lSongLinks.map((song, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-[9px] text-neutral-400 font-mono w-5">#{idx + 1}</span>
                      <input 
                        id={`louvor-input-song-${idx}`}
                        type="text" 
                        value={song} 
                        onChange={(e) => {
                          const updated = [...lSongLinks];
                          updated[idx] = e.target.value;
                          setLSongLinks(updated);
                        }}
                        placeholder="Ex: Cifra ou Link do YouTube"
                        className="flex-1 px-3 py-1.5 border border-neutral-200 rounded-xl text-[11px] outline-none focus:border-red-600"
                      />
                      {song.trim() && (
                        <a 
                          href={song.trim().startsWith("http") ? song.trim() : `https://www.google.com/search?q=${encodeURIComponent(song.trim())}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-2 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-[9px] font-bold"
                        >
                          Acessar
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                id="louvor-save-btn"
                onClick={handleSaveLouvorScale}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Escala Louvor</span>
              </button>
            </div>
          </div>

          {/* MÍDIA MINISTRY SCALE */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-4" id="midia-scale-box">
            <h4 className="text-xs font-black uppercase tracking-wider text-red-600 border-b border-neutral-100 pb-2 flex items-center justify-between">
              <span>Ministério de Mídia</span>
              <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Equipe & Câmeras</span>
            </h4>

            <div className="space-y-3" id="midia-scale-inputs">
              <div className="grid grid-cols-2 gap-2" id="midia-equipe-inputs">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-neutral-400">Camarim</label>
                  <input 
                    id="midia-input-camarim"
                    type="text" 
                    value={mCamarim} 
                    onChange={(e) => setMCamarim(e.target.value)} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-neutral-400">Móvel (Câmera Móvel)</label>
                  <input 
                    id="midia-input-movel"
                    type="text" 
                    value={mMovel} 
                    onChange={(e) => setMMovel(e.target.value)} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-neutral-400">Mesa de Corte</label>
                  <input 
                    id="midia-input-mesacorte"
                    type="text" 
                    value={mMesaCorte} 
                    onChange={(e) => setMMesaCorte(e.target.value)} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-neutral-400">Cada Show (Diretor)</label>
                  <input 
                    id="midia-input-cadashow"
                    type="text" 
                    value={mCadaShow} 
                    onChange={(e) => setMCadaShow(e.target.value)} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[9px] uppercase font-bold text-neutral-400">Iluminação</label>
                  <input 
                    id="midia-input-iluminacao"
                    type="text" 
                    value={mIluminacao} 
                    onChange={(e) => setMIluminacao(e.target.value)} 
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="space-y-1 border-t border-neutral-100 pt-2" id="midia-futuros-inputs">
                <label className="text-[9px] uppercase font-bold text-neutral-400">Futuros Equipamentos (3 Vagas Disponíveis)</label>
                <div className="grid grid-cols-3 gap-2" id="futuros-inputs-grid">
                  <div className="space-y-0.5">
                    <span className="text-[8px] text-neutral-400 font-mono">Espaço 1</span>
                    <input 
                      id="midia-input-futuro1"
                      type="text" 
                      value={mFuturo1} 
                      onChange={(e) => setMFuturo1(e.target.value)}
                      className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-[10px] outline-none focus:border-red-600"
                      placeholder="Equipamento"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] text-neutral-400 font-mono">Espaço 2</span>
                    <input 
                      id="midia-input-futuro2"
                      type="text" 
                      value={mFuturo2} 
                      onChange={(e) => setMFuturo2(e.target.value)}
                      className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-[10px] outline-none focus:border-red-600"
                      placeholder="Equipamento"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] text-neutral-400 font-mono">Espaço 3</span>
                    <input 
                      id="midia-input-futuro3"
                      type="text" 
                      value={mFuturo3} 
                      onChange={(e) => setMFuturo3(e.target.value)}
                      className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-[10px] outline-none focus:border-red-600"
                      placeholder="Equipamento"
                    />
                  </div>
                </div>
              </div>

              <button
                id="midia-save-btn"
                onClick={handleSaveMidiaScale}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold py-2 rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Escala Mídia</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: DEVOCIONAIS (DAILY DEVOCIONAL) */}
      {subtab === "devocionais" && (
        <div className="space-y-6 text-neutral-800 animate-fade-in" id="more-sub-devocionais">
          
          {/* AI GEMINI DEVOCIONAL GENERATOR */}
          <div className="bg-gradient-to-br from-neutral-950 to-neutral-800 text-white p-6 rounded-3xl shadow-sm space-y-4" id="ai-devocional-box">
            <div className="flex items-center space-x-2.5 text-red-500" id="ai-dev-header">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-wider text-red-500">Gerador Devocional com IA</h4>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Como ministro da Igreja Betel, insira um tema bíblico e use nossa Inteligência Artificial para gerar um devocional diário edificante para as 700 pessoas da igreja.
            </p>

            <div className="space-y-3" id="ai-dev-form">
              <div className="space-y-1">
                <label className="text-[8px] uppercase tracking-wider font-bold text-neutral-400">Tema do Devocional</label>
                <div className="flex space-x-2" id="ai-dev-input-row">
                  <input
                    id="ai-dev-theme-input"
                    type="text"
                    value={devTheme}
                    onChange={(e) => setDevTheme(e.target.value)}
                    placeholder="Ex: Amor de Deus, Fé, Providência, Família..."
                    className="flex-1 bg-white/10 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-red-500 focus:bg-white/15"
                    disabled={isGeneratingDev}
                  />
                  <button
                    id="ai-dev-submit-btn"
                    onClick={handleAIGenerateDevocional}
                    disabled={!devTheme || isGeneratingDev}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-all flex items-center space-x-1 shadow-sm active:scale-95 shrink-0"
                  >
                    {isGeneratingDev ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{isGeneratingDev ? "Gerdando..." : "Gerar"}</span>
                  </button>
                </div>
              </div>

              <div className="text-right" id="manual-dev-btn-container">
                <button
                  id="toggle-manual-dev-form-btn"
                  onClick={() => setShowManualDevForm(!showManualDevForm)}
                  className="text-[10px] text-red-400 font-bold hover:underline"
                >
                  {showManualDevForm ? "Ocultar Formulário Manual" : "Escrever devocional manualmente"}
                </button>
              </div>
            </div>

            {/* Manual Form Toggle */}
            {showManualDevForm && (
              <form onSubmit={handleCreateManualDevocional} className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3" id="manual-devocional-form">
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider font-bold text-neutral-400">Título</label>
                  <input 
                    id="manual-dev-title"
                    type="text" 
                    required 
                    value={mDevTitle} 
                    onChange={(e) => setMDevTitle(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-xl text-xs focus:border-red-500 outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider font-bold text-neutral-400">Versículo Bíblico</label>
                  <input 
                    id="manual-dev-verse"
                    type="text" 
                    required 
                    placeholder="Ex: João 3:16" 
                    value={mDevVerse} 
                    onChange={(e) => setMDevVerse(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-xl text-xs focus:border-red-500 outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider font-bold text-neutral-400">Mensagem Devocional</label>
                  <textarea 
                    id="manual-dev-content"
                    required 
                    rows={4} 
                    value={mDevContent} 
                    onChange={(e) => setMDevContent(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-xl text-xs focus:border-red-500 outline-none" 
                  />
                </div>
                <button
                  id="manual-dev-submit-btn"
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs shadow-sm transition-all active:scale-95"
                >
                  Publicar Manualmente
                </button>
              </form>
            )}
          </div>

          {/* LIST OF DEVOCIONAIS */}
          <div className="space-y-4" id="devocionais-list-container">
            <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
              Histórico de Devocionais
            </h3>

            <div className="space-y-4" id="devocionais-list">
              {db.devocionais.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-6">Nenhum devocional disponível.</p>
              ) : (
                db.devocionais.map((dev) => (
                  <div key={dev.id} className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-3" id={`dev-card-${dev.id}`}>
                    <div className="flex justify-between items-start" id={`dev-card-header-${dev.id}`}>
                      <h4 className="text-sm font-black text-neutral-900 tracking-tight">{dev.title}</h4>
                      <span className="text-[9px] bg-neutral-100 text-neutral-500 font-bold px-2.5 py-0.5 rounded-full font-mono">
                        {dev.date.split("-").reverse().join("/")}
                      </span>
                    </div>

                    <div className="bg-red-50/70 border-l-2 border-red-600 p-3 rounded-r-xl text-xs font-serif text-neutral-800 italic" id={`dev-card-verse-${dev.id}`}>
                      {dev.verse}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap" id={`dev-card-content-${dev.id}`}>
                      {dev.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: MEMBROS (CHURCH DIRECTORY) */}
      {subtab === "membros" && (
        <div className="space-y-4 text-neutral-800 animate-fade-in" id="more-sub-membros">
          <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
            Membros Identificados ({db.members.length} cadastrados)
          </h3>

          <div className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-sm divide-y divide-neutral-100" id="members-full-list">
            {db.members.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-8">Nenhum membro identificado ainda.</p>
            ) : (
              db.members.map((member) => (
                <div key={member.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5" id={`member-item-${member.id}`}>
                  <div className="flex justify-between items-start" id={`member-item-header-${member.id}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center font-bold text-sm text-red-600 shadow-inner">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">{member.name}</h4>
                        <p className="text-[10px] text-neutral-400 flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{member.email}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 font-black tracking-wide uppercase px-2 py-0.5 rounded-full">
                      Membro
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-2.5 rounded-xl text-[10px] text-neutral-500" id={`member-item-fields-${member.id}`}>
                    <p><strong className="text-neutral-700">Contato:</strong> {member.phone || "Não informado"}</p>
                    <p><strong className="text-neutral-700">Nascimento:</strong> {member.birthDate ? member.birthDate.split("-").reverse().join("/") : "Não informado"}</p>
                    <p><strong className="text-neutral-700">Batismo:</strong> {member.baptismDate ? member.baptismDate.split("-").reverse().join("/") : "Não informado"}</p>
                    <p><strong className="text-neutral-700">Líder Pastoreio:</strong> {member.pastoralLeader || "Não especificado"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB: EVENTOS */}
      {subtab === "eventos" && (
        <div className="space-y-4 text-neutral-800 animate-fade-in" id="more-sub-eventos">
          <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
            Próximos Eventos
          </h3>

          <div className="space-y-4" id="events-cards-list">
            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs flex items-center space-x-4" id="event-card-1">
              <div className="bg-red-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center select-none shrink-0" id="event-datebox-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-200">Jul</span>
                <span className="text-base font-black">12</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-neutral-900 tracking-tight">Seminário Vida Abundante</h4>
                <p className="text-[10px] text-red-600 font-bold">Domingo das 14h às 18h</p>
                <p className="text-[10px] text-neutral-400">Entrada gratuita • Auditório Principal</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs flex items-center space-x-4" id="event-card-2">
              <div className="bg-red-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center select-none shrink-0" id="event-datebox-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-200">Jul</span>
                <span className="text-base font-black">25</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-neutral-900 tracking-tight">Vigília da Unidade Betel</h4>
                <p className="text-[10px] text-red-600 font-bold">Sexta-feira a partir das 22h00</p>
                <p className="text-[10px] text-neutral-400">Toda a comunidade reunida em Eunápolis</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs flex items-center space-x-4" id="event-card-3">
              <div className="bg-red-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center select-none shrink-0" id="event-datebox-3">
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-200">Ago</span>
                <span className="text-base font-black">08</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-neutral-900 tracking-tight">Encontro Geral de Pastoreio</h4>
                <p className="text-[10px] text-red-600 font-bold">Sábado às 19h00</p>
                <p className="text-[10px] text-neutral-400">Confraternização e partilha geral</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: SOCIAL */}
      {subtab === "social" && (
        <div className="space-y-4 text-neutral-800 animate-fade-in" id="more-sub-social">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
              Nossas Redes Sociais
            </h3>
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Conecte-se Conosco</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* INSTAGRAM CARD */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs space-y-4 flex flex-col items-center text-center" id="social-instagram-card">
              <div className="bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shadow-red-500/10" id="social-instagram-icon-bg">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-tight uppercase text-neutral-900">Instagram Oficial</h4>
                <p className="text-xs text-neutral-500 mt-1">Fotos dos cultos, anúncios e novidades em tempo real.</p>
              </div>
              <a
                id="instagram-profile-link"
                href="https://www.instagram.com/igbeteloficial?igsh=NHBkMXl1cjVyOG5s&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-sm"
              >
                <Instagram className="w-4 h-4" />
                <span>Siga @igbeteloficial</span>
              </a>
            </div>

            {/* YOUTUBE CARD */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs space-y-4 flex flex-col items-center text-center" id="social-youtube-card">
              <div className="bg-red-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shadow-red-600/10" id="social-youtube-icon-bg">
                <Youtube className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-tight uppercase text-neutral-900">Canal no YouTube</h4>
                <p className="text-xs text-neutral-500 mt-1">Transmissões ao vivo de cultos, ministrações e pregações gravadas.</p>
              </div>
              <a
                id="youtube-channel-link"
                href="https://youtube.com/@igbetel?si=SYwX2TX3xuFv2Y9z"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-sm"
              >
                <Youtube className="w-4 h-4" />
                <span>Inscreva-se no canal</span>
              </a>
            </div>

            {/* FACEBOOK CARD */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs space-y-4 flex flex-col items-center text-center" id="social-facebook-card">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shadow-blue-600/10" id="social-facebook-icon-bg">
                <Facebook className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-tight uppercase text-neutral-900">Página no Facebook</h4>
                <p className="text-xs text-neutral-500 mt-1">Acompanhe nossas transmissões, fotos de eventos e comunidade online.</p>
              </div>
              <a
                id="facebook-page-link"
                href="https://www.facebook.com/profile.php?id=61551131236765"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-sm"
              >
                <Facebook className="w-4 h-4" />
                <span>Visite nossa página</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
