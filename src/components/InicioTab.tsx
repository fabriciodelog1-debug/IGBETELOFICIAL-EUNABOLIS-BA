import React, { useState } from "react";
import { Tv, Radio, Users, BookOpen, Share2, Play, Calendar, UserPlus, FileText, Trash2, Edit2, ShieldCheck, Mail, Camera, Image, X } from "lucide-react";
import { Member, ChurchDatabase } from "../types";

interface InicioTabProps {
  db: ChurchDatabase;
  currentUser: Member | null;
  setCurrentUser: (member: Member | null) => void;
  setActiveTab: (tab: any) => void;
  onUpdateMember: (member: Member) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
  setMoreSubtab: (subtab: string) => void;
  onRefreshDb?: () => Promise<void>;
}

export default function InicioTab({
  db,
  currentUser,
  setCurrentUser,
  setActiveTab,
  onUpdateMember,
  onDeleteMember,
  setMoreSubtab,
  onRefreshDb
}: InicioTabProps) {
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Gallery Photo states
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoDesc, setNewPhotoDesc] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert("A imagem é muito grande! Escolha uma foto de até 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl || !newPhotoDesc.trim() || isUploading) return;

    setIsUploading(true);
    try {
      const response = await fetch("/api/db/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newPhotoUrl,
          description: newPhotoDesc.trim()
        })
      });

      if (response.ok) {
        setShowPhotoModal(false);
        setNewPhotoUrl("");
        setNewPhotoDesc("");
        if (onRefreshDb) {
          await onRefreshDb();
        }
      } else {
        alert("Erro ao adicionar foto.");
      }
    } catch (error) {
      console.error("Erro ao adicionar foto:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!window.confirm("Deseja realmente excluir esta foto da galeria?")) return;
    try {
      const response = await fetch(`/api/db/photo/${photoId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        if (onRefreshDb) {
          await onRefreshDb();
        }
      } else {
        alert("Erro ao excluir foto.");
      }
    } catch (error) {
      console.error("Erro ao excluir foto:", error);
    }
  };

  // Form states for login/edit
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formBirth, setFormBirth] = useState("");
  const [formBaptism, setFormBaptism] = useState("");
  const [formLeader, setFormLeader] = useState("");

  const handleSimulatedGoogleLogin = () => {
    // Simulated Google Accounts
    const defaultGoogleAccounts = [
      { name: "Fabricio", email: "fabriciodelog1@gmail.com", phone: "73988199369", birth: "1984-02-27", baptism: "2001-06-27", leader: "Fabricio" },
      { name: "Clima frio", email: "climafrio@example.com", phone: "73982320936", birth: "2017-06-27", baptism: "2021-12-25", leader: "Fabricio" }
    ];

    // Pick first or pre-fill
    setGoogleName("Fabricio");
    setGoogleEmail("fabriciodelog1@gmail.com");
    setFormPhone("73988199369");
    setFormBirth("1984-02-27");
    setFormBaptism("2001-06-27");
    setFormLeader("Fabricio");
    
    setIsNewUser(false);
    setShowGoogleModal(true);
  };

  const submitGoogleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleName || !googleEmail) return;

    // Check if member already exists in DB
    const found = db.members.find(m => m.email.toLowerCase() === googleEmail.toLowerCase());
    
    let memberToSave: Member;
    if (found && !isNewUser) {
      memberToSave = {
        ...found,
        name: googleName,
        phone: formPhone || found.phone,
        birthDate: formBirth || found.birthDate,
        baptismDate: formBaptism || found.baptismDate,
        pastoralLeader: formLeader || found.pastoralLeader
      };
    } else {
      memberToSave = {
        id: found?.id || "member-" + Date.now(),
        name: googleName,
        email: googleEmail,
        phone: formPhone,
        birthDate: formBirth,
        baptismDate: formBaptism,
        pastoralLeader: formLeader
      };
    }

    await onUpdateMember(memberToSave);
    setCurrentUser(memberToSave);
    setShowGoogleModal(false);
  };

  const handleOpenEdit = () => {
    if (currentUser) {
      setGoogleName(currentUser.name);
      setGoogleEmail(currentUser.email);
      setFormPhone(currentUser.phone);
      setFormBirth(currentUser.birthDate);
      setFormBaptism(currentUser.baptismDate);
      setFormLeader(currentUser.pastoralLeader);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated: Member = {
      ...currentUser,
      name: googleName,
      phone: formPhone,
      birthDate: formBirth,
      baptismDate: formBaptism,
      pastoralLeader: formLeader
    };

    await onUpdateMember(updated);
    setCurrentUser(updated);
    setShowEditModal(false);
  };

  const handleLogout = async () => {
    if (currentUser) {
      if (window.confirm("Deseja realmente sair e remover esta identificação local?")) {
        // Option to delete from server database or just disconnect
        const removeOption = window.confirm("Deseja excluir permanentemente sua Ficha de Membro do servidor da igreja?");
        if (removeOption) {
          await onDeleteMember(currentUser.id);
        }
        setCurrentUser(null);
      }
    }
  };

  // Find next culto dynamically
  const nextCulto = db.cultoSchedules[0] || { id: "culto-ensino", name: "Culto de Ensino", dayAndHour: "Quarta-feira às 19h30", ministerName: "Pr. Ronilto William" };

  return (
    <div className="space-y-6 pb-24" id="inicio-tab-container">
      
      {/* Church Façade Card Graphic */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-neutral-100" id="church-facade-card">
        <div className="bg-neutral-900 h-48 w-full relative flex items-center justify-center p-4 overflow-hidden" id="facade-illustration">
          {/* Stylized Church Facade SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="200" fill="#171717" />
            <path d="M50 180 H350 V120 H50 Z" fill="#262626" />
            <path d="M120 120 L200 60 L280 120 Z" fill="#dc2626" />
            <rect x="180" y="120" width="40" height="60" rx="4" fill="#171717" />
            <circle cx="200" cy="40" r="15" fill="#e5e5e5" />
            <path d="M195 40 H205 M200 35 V45" stroke="#dc2626" strokeWidth="2" />
          </svg>
          
          <div className="text-center relative z-10" id="facade-text-overlay">
            <h2 className="text-2xl font-black text-white tracking-widest uppercase">Igreja Betel</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto my-2 rounded-full"></div>
            <p className="text-xs font-mono text-red-500 uppercase tracking-widest">Casa de Deus • Lugar de Encontro</p>
            <p className="text-[10px] text-neutral-400 mt-1">Eunápolis - BA</p>
          </div>
        </div>
      </div>

      {/* QUICK ACCESS BUTTONS */}
      <div className="space-y-2" id="quick-access-section">
        <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
          Acesso Rápido
        </h3>
        <div className="grid grid-cols-4 gap-3" id="quick-access-grid">
          <button 
            id="qa-btn-aovivo"
            onClick={() => { setActiveTab("mais"); setMoreSubtab("live"); }}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center space-y-2 hover:bg-neutral-50 active:scale-95 transition-all"
          >
            <div className="bg-red-600 text-white p-2.5 rounded-full shadow-sm">
              <Tv className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-neutral-800 tracking-tight">Ao Vivo</span>
          </button>

          <button 
            id="qa-btn-grupos"
            onClick={() => setActiveTab("grupos")}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center space-y-2 hover:bg-neutral-50 active:scale-95 transition-all"
          >
            <div className="bg-red-600 text-white p-2.5 rounded-full shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-neutral-800 tracking-tight">Grupos</span>
          </button>

          <button 
            id="qa-btn-biblia"
            onClick={() => setActiveTab("biblia")}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center space-y-2 hover:bg-neutral-50 active:scale-95 transition-all"
          >
            <div className="bg-red-600 text-white p-2.5 rounded-full shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-neutral-800 tracking-tight">Bíblia</span>
          </button>

          <button 
            id="qa-btn-social"
            onClick={() => { setActiveTab("mais"); setMoreSubtab("social"); }}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center space-y-2 hover:bg-neutral-50 active:scale-95 transition-all"
          >
            <div className="bg-red-600 text-white p-2.5 rounded-full shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-neutral-800 tracking-tight">Social</span>
          </button>
        </div>
      </div>

      {/* GALLERY OF CHURCH AND SERVICES */}
      <div className="space-y-3" id="church-gallery-section">
        <div className="flex items-center justify-between" id="gallery-header">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
              Fotos da Igreja & Cultos
            </h3>
            <p className="text-[10px] text-neutral-400 pl-3">Nossa história e nossos momentos em comunidade</p>
          </div>
          <button
            id="btn-add-gallery-photo"
            type="button"
            onClick={() => setShowPhotoModal(true)}
            className="text-[10px] font-black text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Adicionar Foto</span>
          </button>
        </div>

        {/* Gallery Slider */}
        <div 
          className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory" 
          id="gallery-photos-slider"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {(!db.photos || db.photos.length === 0) ? (
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 text-center w-full shadow-xs" id="empty-gallery">
              <p className="text-xs text-neutral-400">Nenhuma foto adicionada ainda. Seja o primeiro a registrar um momento!</p>
            </div>
          ) : (
            db.photos.map((photo) => (
              <div 
                key={photo.id}
                className="relative min-w-[260px] w-[260px] h-40 rounded-2.5xl overflow-hidden shadow-sm border border-neutral-100 snap-start shrink-0 group"
                id={`gallery-photo-card-${photo.id}`}
              >
                <img 
                  src={photo.url} 
                  alt={photo.description}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay with description and delete button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-3 flex flex-col justify-between" id={`gallery-overlay-${photo.id}`}>
                  {/* Delete button (floating) */}
                  <div className="flex justify-end">
                    <button
                      id={`delete-photo-${photo.id}`}
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-xl backdrop-blur-xs transition-all opacity-80 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                      title="Excluir Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {/* Photo Description and Date */}
                  <div className="space-y-0.5" id={`photo-info-${photo.id}`}>
                    <p className="text-[11px] font-bold text-white leading-tight drop-shadow-sm line-clamp-2">{photo.description}</p>
                    <p className="text-[9px] font-mono text-neutral-300">{photo.createdAt}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ACTIVE TRANSMISSION BANNER */}
      {db.liveSettings.isLive && (
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-5 rounded-3xl shadow-md relative overflow-hidden" id="live-banner-alert">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-start justify-between" id="live-header-info">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-100">Transmissão Ativa</span>
              </div>
              <h4 className="text-base font-bold tracking-tight">{db.liveSettings.title}</h4>
              <p className="text-xs text-red-100 line-clamp-2">{db.liveSettings.description}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center" id="live-footer-info">
            <span className="text-[10px] font-medium text-red-200">Rádio & TV Web Disponíveis</span>
            <button 
              id="watch-live-btn"
              onClick={() => { setActiveTab("mais"); setMoreSubtab("live"); }}
              className="bg-white text-red-700 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-red-50 flex items-center space-x-1 shadow-sm active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-red-700" />
              <span>Assistir Agora</span>
            </button>
          </div>
        </div>
      )}

      {/* NEXT CULTO */}
      <div className="space-y-2" id="next-culto-section">
        <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
          Próximo Culto
        </h3>
        <div 
          onClick={() => setActiveTab("cultos")}
          className="bg-red-50/70 border border-red-100 p-4 rounded-2.5xl flex items-center justify-between cursor-pointer hover:bg-red-50 transition-all"
          id="next-culto-card"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-red-600 text-white p-3 rounded-2xl shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">{nextCulto.name}</h4>
              <p className="text-xs text-red-700 font-medium">{nextCulto.dayAndHour}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Dirigido por: {nextCulto.ministerName}</p>
            </div>
          </div>
          <div className="text-red-600" id="next-culto-arrow">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* MEMBER REGISTRATION / sim google */}
      <div className="space-y-2" id="member-profile-section">
        <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
          Ficha de Membro Oficial
        </h3>
        
        {!currentUser ? (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 text-center space-y-4" id="google-login-box">
            <div className="bg-neutral-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-red-600" id="profile-icon">
              <UserPlus className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-neutral-800">Acesse sua Ficha Virtual</h4>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Faça login usando o Google para preencher seus dados de membro e sincronizar com toda a igreja ({db.members.length} cadastrados).
              </p>
            </div>
            
            <button
              id="btn-google-signin"
              onClick={handleSimulatedGoogleLogin}
              className="w-full bg-neutral-950 text-white hover:bg-neutral-900 py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2.5 transition-all shadow-sm active:scale-98"
            >
              {/* Simple Google Icon Logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.116C18.252.88 15.49 0 12.24 0 5.58 0 .16 5.37.16 12s5.42 12 12.08 12c6.96 0 11.58-4.89 11.58-11.785 0-.792-.086-1.396-.188-1.93H12.24z"
                />
              </svg>
              <span>Identificar com o Google</span>
            </button>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-red-100 space-y-4 relative" id="member-official-badge">
            <div className="absolute top-4 right-4 flex space-x-1" id="m-badge-actions">
              <button 
                id="edit-ficha-btn"
                onClick={handleOpenEdit} 
                className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-50 transition-colors"
                title="Editar dados"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                id="logout-ficha-btn"
                onClick={handleLogout} 
                className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-50 transition-colors"
                title="Sair / Desconectar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2.5" id="member-badge-header">
              <span className="bg-red-600 text-[9px] text-white font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
                Membro Oficial
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                ID: {currentUser.id.substring(0, 8)}
              </span>
            </div>

            <div className="flex items-center space-x-4 pt-2" id="member-badge-profile">
              <div className="w-16 h-16 bg-red-50 rounded-full border border-red-100 flex items-center justify-center text-red-600 font-bold text-lg shadow-inner">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-base font-black text-neutral-900 tracking-tight">{currentUser.name}</h4>
                <p className="text-xs text-neutral-500 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{currentUser.email}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600" id="member-badge-fields">
              <div className="space-y-0.5">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold">Contato</span>
                <p className="font-semibold text-neutral-900">{currentUser.phone || "Não informado"}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold">Nascimento</span>
                <p className="font-semibold text-neutral-900">
                  {currentUser.birthDate ? currentUser.birthDate.split("-").reverse().join("/") : "Não informado"}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold">Batismo</span>
                <p className="font-semibold text-neutral-900">
                  {currentUser.baptismDate ? currentUser.baptismDate.split("-").reverse().join("/") : "Não batizado"}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold">Líder de Pastoreio</span>
                <p className="font-semibold text-neutral-900">{currentUser.pastoralLeader || "Sem líder"}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CHURCH STATS & BIO */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 space-y-3" id="church-about-section">
        <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
          Sobre a Igreja
        </h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          No ano de 2000 nasceu, em Eunápolis, a comunidade Igreja Betel — inspirada primeiro no coração de Deus, e depois no coração do nosso apóstolo Ronilto William e da apóstola Simone Rodrigues. A Igreja Betel é uma instituição que realiza trabalho de evangelismo e pregação do evangelho de Jesus.
        </p>
        <div className="grid grid-cols-1 gap-4 pt-2 border-t border-neutral-100" id="church-about-metrics">
          <div className="text-center bg-neutral-50 p-3 rounded-2xl" id="church-metric-grupos">
            <span className="block text-xl font-black text-red-600">{db.pastoralGroups.length}</span>
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Grupos Pastoreio</span>
          </div>
        </div>
      </div>

      {/* MEMBERS DIRECTORY SHOWCASE */}
      <div className="space-y-2" id="members-showcase-section">
        <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
          Membros Recém Cadastrados
        </h3>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-neutral-100 divide-y divide-neutral-100" id="members-list">
          {db.members.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-4">Nenhum membro cadastrado.</p>
          ) : (
            db.members.map((member) => (
              <div key={member.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0" id={`member-row-${member.id}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-700 font-bold text-xs border border-neutral-200">
                    {member.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-800">{member.name}</h5>
                    <p className="text-[10px] text-neutral-500">Líder: {member.pastoralLeader || "Não especificado"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    Ativo
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* GOOGLE LOG IN SIMULATED DIALOG */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="google-modal-backdrop">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-scale-up" id="google-login-modal">
            <div className="flex items-center justify-between" id="google-modal-header">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.116C18.252.88 15.49 0 12.24 0 5.58 0 .16 5.37.16 12s5.42 12 12.08 12c6.96 0 11.58-4.89 11.58-11.785 0-.792-.086-1.396-.188-1.93H12.24z" />
                </svg>
                <h4 className="text-sm font-bold text-neutral-800">Identificação Google</h4>
              </div>
              <button 
                id="close-google-modal"
                onClick={() => setShowGoogleModal(false)} 
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                Cancelar
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Escolha uma conta do Google para conectar instantaneamente seu perfil ao banco de dados da igreja.
            </p>

            {/* Account Pickers (simulated) */}
            <div className="space-y-2" id="simulated-accounts-pickers">
              <button
                id="pick-account-fabricio"
                type="button"
                onClick={() => {
                  setGoogleName("Fabricio");
                  setGoogleEmail("fabriciodelog1@gmail.com");
                  setFormPhone("73988199369");
                  setFormBirth("1984-02-27");
                  setFormBaptism("2001-06-27");
                  setFormLeader("Fabricio");
                  setIsNewUser(false);
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  googleEmail === "fabriciodelog1@gmail.com" ? "border-red-600 bg-red-50/40" : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center font-bold text-xs text-red-600">
                    F
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-800">Fabricio</h5>
                    <p className="text-[10px] text-neutral-500">fabriciodelog1@gmail.com</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-neutral-400">Padrão</span>
              </button>

              <button
                id="pick-account-climafrio"
                type="button"
                onClick={() => {
                  setGoogleName("Clima frio");
                  setGoogleEmail("climafrio@example.com");
                  setFormPhone("73982320936");
                  setFormBirth("2017-06-27");
                  setFormBaptism("2021-12-25");
                  setFormLeader("Fabricio");
                  setIsNewUser(false);
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  googleEmail === "climafrio@example.com" ? "border-red-600 bg-red-50/40" : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-xs text-neutral-700">
                    C
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-800">Clima frio</h5>
                    <p className="text-[10px] text-neutral-500">climafrio@example.com</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-neutral-400">Secundário</span>
              </button>

              <button
                id="btn-use-other-google-acc"
                type="button"
                onClick={() => {
                  setGoogleName("");
                  setGoogleEmail("");
                  setFormPhone("");
                  setFormBirth("");
                  setFormBaptism("");
                  setFormLeader("");
                  setIsNewUser(true);
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                  isNewUser ? "border-red-600 bg-red-50/40" : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center font-bold text-xs text-neutral-500">
                  +
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-800">Usar outra conta...</h5>
                  <p className="text-[10px] text-neutral-500">Preencha qualquer e-mail/nome</p>
                </div>
              </button>
            </div>

            <form onSubmit={submitGoogleAuth} className="space-y-3 pt-2" id="google-auth-inputs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Nome Completo</label>
                <input
                  id="google-input-name"
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">E-mail da Conta Google</label>
                <input
                  id="google-input-email"
                  type="email"
                  required
                  placeholder="nome@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  disabled={!isNewUser}
                />
              </div>

              {/* Extra data for church badge on signup */}
              <div className="grid grid-cols-2 gap-2" id="google-signup-extra-grid">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Telefone</label>
                  <input
                    id="google-input-phone"
                    type="tel"
                    placeholder="(73) 98888-8888"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Líder Pastoreio</label>
                  <input
                    id="google-input-leader"
                    type="text"
                    placeholder="Nome do líder"
                    value={formLeader}
                    onChange={(e) => setFormLeader(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Nascimento</label>
                  <input
                    id="google-input-birth"
                    type="date"
                    value={formBirth}
                    onChange={(e) => setFormBirth(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Batismo</label>
                  <input
                    id="google-input-baptism"
                    type="date"
                    value={formBaptism}
                    onChange={(e) => setFormBaptism(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
              </div>

              <button
                id="google-submit-btn"
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all mt-2 active:scale-95"
              >
                Confirmar Login & Sincronizar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER SHEET SIMULATED DIALOG */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="edit-modal-backdrop">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-scale-up" id="edit-member-modal">
            <div className="flex items-center justify-between" id="edit-modal-header">
              <h4 className="text-sm font-bold text-neutral-800">Editar Ficha Oficial</h4>
              <button 
                id="close-edit-modal"
                onClick={() => setShowEditModal(false)} 
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                Cancelar
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3" id="edit-member-form">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Nome Completo</label>
                <input
                  id="edit-input-name"
                  type="text"
                  required
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Telefone Celular</label>
                <input
                  id="edit-input-phone"
                  type="tel"
                  placeholder="(73) 98888-8888"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Líder Pastoreio</label>
                <input
                  id="edit-input-leader"
                  type="text"
                  value={formLeader}
                  onChange={(e) => setFormLeader(e.target.value)}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2" id="edit-dates-grid">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Nascimento</label>
                  <input
                    id="edit-input-birth"
                    type="date"
                    value={formBirth}
                    onChange={(e) => setFormBirth(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Batismo</label>
                  <input
                    id="edit-input-baptism"
                    type="date"
                    value={formBaptism}
                    onChange={(e) => setFormBaptism(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
              </div>

              <button
                id="edit-submit-btn"
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all mt-2 active:scale-95"
              >
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD PHOTO DIALOG */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="add-photo-modal-backdrop">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-scale-up" id="add-photo-modal">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3" id="add-photo-modal-header">
              <div className="flex items-center space-x-2">
                <div className="bg-red-50 text-red-600 p-2 rounded-xl">
                  <Camera className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-neutral-800">Adicionar Foto</h4>
              </div>
              <button 
                id="close-add-photo-modal"
                type="button"
                onClick={() => {
                  setShowPhotoModal(false);
                  setNewPhotoUrl("");
                  setNewPhotoDesc("");
                }} 
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-4" id="add-photo-form">
              {/* Image upload area */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-black tracking-wider text-neutral-400 font-bold">Escolha a Foto da Igreja/Culto</label>
                
                {newPhotoUrl ? (
                  <div className="relative h-40 rounded-2xl overflow-hidden border border-neutral-200" id="photo-preview-box">
                    <img src={newPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      id="remove-preview-btn"
                      onClick={() => setNewPhotoUrl("")}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-xl transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-neutral-200 hover:border-red-400 transition-all rounded-2xl p-6 text-center space-y-2 cursor-pointer relative" id="upload-drag-zone">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="file-input-gallery"
                    />
                    <div className="bg-neutral-50 text-neutral-400 w-10 h-10 rounded-full flex items-center justify-center mx-auto" id="upload-icon">
                      <Image className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-700">Selecione uma imagem</p>
                      <p className="text-[10px] text-neutral-400">Arraste e solte ou toque para escolher</p>
                    </div>
                  </div>
                )}
              </div>

              {/* URL fallback / optional */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-black tracking-wider text-neutral-400 font-bold">Ou digite uma URL de imagem</label>
                <input
                  id="image-url-input"
                  type="url"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={newPhotoUrl.startsWith("data:") ? "" : newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs outline-none focus:border-red-600 font-medium"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-black tracking-wider text-neutral-400 font-bold">Legenda / Descrição</label>
                <input
                  id="image-desc-input"
                  type="text"
                  required
                  placeholder="Ex: Culto de Celebração de Sábado à noite"
                  value={newPhotoDesc}
                  onChange={(e) => setNewPhotoDesc(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs outline-none focus:border-red-600 font-medium"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                id="submit-new-photo-btn"
                disabled={isUploading || !newPhotoUrl || !newPhotoDesc.trim()}
                className={`w-full font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-sm ${
                  newPhotoUrl && newPhotoDesc.trim() && !isUploading
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                }`}
              >
                {isUploading ? "Salvando..." : "Salvar na Galeria"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
