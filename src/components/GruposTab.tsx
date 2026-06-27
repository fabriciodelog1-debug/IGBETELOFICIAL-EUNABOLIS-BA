import React, { useState } from "react";
import { Users, BookOpen, Plus, UserPlus, FileText, ChevronLeft, Trash2, Calendar, MapPin, Phone, Check, Link } from "lucide-react";
import { PastoralGroup, Visitor, Lesson, ChurchDatabase } from "../types";

interface GruposTabProps {
  db: ChurchDatabase;
  onAddGroup: (group: Partial<PastoralGroup>) => Promise<void>;
  onDeleteGroup: (id: string) => Promise<void>;
  onAddVisitor: (visitor: Partial<Visitor>) => Promise<void>;
  onAddLesson: (lesson: Partial<Lesson>) => Promise<void>;
}

export default function GruposTab({
  db,
  onAddGroup,
  onDeleteGroup,
  onAddVisitor,
  onAddLesson
}: GruposTabProps) {
  // Navigation inside groups tab: "list", "visitors", "lessons"
  const [activeSubView, setActiveSubView] = useState<"list" | "visitors" | "lessons">("list");
  
  // Modals state
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddVisitorModal, setShowAddVisitorModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);

  // Group Form state
  const [groupName, setGroupName] = useState("");
  const [groupAddress, setGroupAddress] = useState("");
  const [groupDay, setGroupDay] = useState("Quinta-feira");
  const [groupTime, setGroupTime] = useState("20:00");
  const [groupLeader, setGroupLeader] = useState("");
  const [groupPhone, setGroupPhone] = useState("");

  // Visitor Form state
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorGroupId, setVisitorGroupId] = useState("");

  // Lesson Form state
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !groupLeader) return;

    await onAddGroup({
      name: groupName,
      address: groupAddress,
      meetingDay: groupDay,
      meetingTime: groupTime,
      leaderName: groupLeader,
      leaderPhone: groupPhone
    });

    // Reset Form
    setGroupName("");
    setGroupAddress("");
    setGroupDay("Quinta-feira");
    setGroupTime("20:00");
    setGroupLeader("");
    setGroupPhone("");
    setShowAddGroupModal(false);
  };

  const handleCreateVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorGroupId) return;

    await onAddVisitor({
      name: visitorName,
      phone: visitorPhone,
      groupId: visitorGroupId
    });

    setVisitorName("");
    setVisitorPhone("");
    setVisitorGroupId("");
    setShowAddVisitorModal(false);
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle || !lessonContent) return;

    await onAddLesson({
      title: lessonTitle,
      content: lessonContent
    });

    setLessonTitle("");
    setLessonContent("");
    setShowAddLessonModal(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in" id="grupos-tab-container">
      
      {/* SUBVIEW PANEL BACK BUTTON */}
      {activeSubView !== "list" && (
        <button
          id="btn-back-to-groups"
          onClick={() => setActiveSubView("list")}
          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para Grupos</span>
        </button>
      )}

      {/* SUB PANES CHIPS */}
      {activeSubView === "list" && (
        <div className="grid grid-cols-2 gap-4" id="groups-subtabs-grid">
          <button
            id="sub-btn-visitors"
            onClick={() => setActiveSubView("visitors")}
            className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 flex items-center space-x-4 hover:border-neutral-200 transition-all text-left"
          >
            <div className="bg-red-600 text-white p-3 rounded-2xl shadow-sm shrink-0">
              <UserPlus className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-neutral-900 tracking-tight">Visitantes</h4>
              <p className="text-[10px] text-neutral-400 font-medium">Controle e cadastro</p>
            </div>
          </button>

          <button
            id="sub-btn-lessons"
            onClick={() => setActiveSubView("lessons")}
            className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 flex items-center space-x-4 hover:border-neutral-200 transition-all text-left"
          >
            <div className="bg-red-600 text-white p-3 rounded-2xl shadow-sm shrink-0">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-neutral-900 tracking-tight">Lições</h4>
              <p className="text-[10px] text-neutral-400 font-medium">Estudos semanais</p>
            </div>
          </button>
        </div>
      )}

      {/* MAIN VIEW: LIST OF GROUPS */}
      {activeSubView === "list" && (
        <div className="space-y-4" id="pastoral-groups-main-view">
          <div className="flex items-center justify-between" id="groups-header-row">
            <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
              Grupos Pastoreio
            </h3>
            
            <button
              id="add-group-btn"
              onClick={() => setShowAddGroupModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center space-x-1 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>

          {db.pastoralGroups.length === 0 ? (
            /* Layout identical to screenshot when empty */
            <div className="border border-dashed border-neutral-300 rounded-3xl p-10 text-center space-y-4 bg-white shadow-inner" id="empty-groups-box">
              <div className="bg-neutral-50 w-14 h-14 mx-auto rounded-full flex items-center justify-center text-neutral-400" id="empty-groups-icon">
                <Users className="w-7 h-7" />
              </div>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed" id="empty-groups-text">
                Nenhum grupo cadastrado ainda. Toque em <strong className="text-red-600">"Adicionar"</strong> para incluir o líder, telefone, endereço e dia da reunião.
              </p>
            </div>
          ) : (
            <div className="space-y-4" id="groups-listing-container">
              {db.pastoralGroups.map((group) => {
                const groupVisitors = db.visitors.filter(v => v.groupId === group.id);
                return (
                  <div 
                    key={group.id} 
                    className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs space-y-4 relative hover:border-neutral-200 transition-all"
                    id={`group-card-${group.id}`}
                  >
                    <button
                      id={`delete-group-btn-${group.id}`}
                      onClick={() => {
                        if (window.confirm(`Excluir o grupo '${group.name}'?`)) {
                          onDeleteGroup(group.id);
                        }
                      }}
                      className="absolute top-4 right-4 text-neutral-400 hover:text-red-600 p-1 rounded-lg hover:bg-neutral-50 transition-colors"
                      title="Excluir grupo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div id={`group-main-info-${group.id}`}>
                      <h4 className="text-base font-black text-neutral-900 tracking-tight">{group.name}</h4>
                      <p className="text-xs text-red-600 font-bold mt-1 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>Reuniões: {group.meetingDay} às {group.meetingTime}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 border-t border-neutral-100 pt-3 text-xs text-neutral-600" id={`group-details-fields-${group.id}`}>
                      <div className="flex items-start space-x-2" id={`group-address-row-${group.id}`}>
                        <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed"><strong className="text-neutral-700">Endereço:</strong> {group.address || "Não informado"}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1" id={`group-leader-row-${group.id}`}>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-red-50 text-red-600 font-bold rounded-full flex items-center justify-center text-[10px]">
                            {group.leaderName.substring(0, 1).toUpperCase()}
                          </div>
                          <p><strong className="text-neutral-700">Líder:</strong> {group.leaderName}</p>
                        </div>
                        {group.leaderPhone && (
                          <a 
                            id={`group-leader-call-${group.id}`}
                            href={`tel:${group.leaderPhone}`} 
                            className="flex items-center space-x-1.5 text-xs text-red-600 font-bold hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{group.leaderPhone}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Visitors stats link */}
                    <div className="bg-neutral-50 px-3 py-2 rounded-xl flex justify-between items-center text-[10px] font-bold" id={`group-stats-row-${group.id}`}>
                      <span className="text-neutral-500 uppercase tracking-wider">Visitantes registrados</span>
                      <button
                        id={`group-visitors-link-${group.id}`}
                        onClick={() => setActiveSubView("visitors")}
                        className="text-red-600 uppercase tracking-wider hover:underline"
                      >
                        {groupVisitors.length} cadastrados • Ver todos
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW: VISITORS CONTROLLER */}
      {activeSubView === "visitors" && (
        <div className="space-y-4 text-neutral-800" id="visitors-view-container">
          <div className="flex items-center justify-between" id="visitors-header-row">
            <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
              Visitantes Registrados
            </h3>

            <button
              id="add-visitor-btn"
              onClick={() => {
                if (db.pastoralGroups.length === 0) {
                  alert("Cadastre pelo menos um Grupo de Pastoreio antes!");
                  return;
                }
                setVisitorGroupId(db.pastoralGroups[0].id);
                setShowAddVisitorModal(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center space-x-1 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Visita</span>
            </button>
          </div>

          <div className="space-y-3" id="visitors-list">
            {db.visitors.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-8">Nenhum visitante registrado ainda.</p>
            ) : (
              db.visitors.map((visitor) => {
                const group = db.pastoralGroups.find(g => g.id === visitor.groupId);
                return (
                  <div key={visitor.id} className="bg-white p-4 rounded-2.5xl border border-neutral-100 shadow-xs flex justify-between items-center" id={`visitor-card-${visitor.id}`}>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-neutral-900">{visitor.name}</h4>
                      <p className="text-[10px] text-neutral-500 font-mono">Grupo: {group ? group.name : "Removido"}</p>
                      <p className="text-[10px] text-red-600 font-bold">Visita em: {visitor.visitDate.split("-").reverse().join("/")}</p>
                    </div>
                    {visitor.phone && (
                      <a 
                        id={`visitor-call-${visitor.id}`}
                        href={`tel:${visitor.phone}`} 
                        className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-100 text-red-600"
                        title="Ligar para visitante"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW: GROUP STUDY LESSONS */}
      {activeSubView === "lessons" && (
        <div className="space-y-4" id="lessons-view-container">
          <div className="flex items-center justify-between" id="lessons-header-row">
            <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
              Lições de Estudo
            </h3>

            <button
              id="add-lesson-btn"
              onClick={() => setShowAddLessonModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center space-x-1 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Estudo</span>
            </button>
          </div>

          <div className="space-y-4" id="lessons-list">
            {db.lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs space-y-3" id={`lesson-card-${lesson.id}`}>
                <div className="flex justify-between items-start" id={`lesson-header-${lesson.id}`}>
                  <h4 className="text-sm font-black text-neutral-900 tracking-tight">{lesson.title}</h4>
                  <span className="text-[9px] bg-red-50 text-red-600 font-black tracking-wide uppercase px-2 py-0.5 rounded-full">
                    {lesson.date.split("-").reverse().join("/")}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 whitespace-pre-wrap leading-relaxed">{lesson.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW GROUP */}
      {showAddGroupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="add-group-modal-backdrop">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-scale-up" id="add-group-modal">
            <div className="flex items-center justify-between" id="add-group-modal-header">
              <h4 className="text-sm font-black text-neutral-900">Novo Grupo de Pastoreio</h4>
              <button 
                id="close-add-group-modal"
                onClick={() => setShowAddGroupModal(false)} 
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                Cancelar
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3 text-neutral-800" id="add-group-form">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Nome do Grupo</label>
                <input
                  id="group-input-name"
                  type="text"
                  required
                  placeholder="Ex: Grupo de Pastoreio Videira"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Endereço da Reunião</label>
                <input
                  id="group-input-address"
                  type="text"
                  placeholder="Rua, Número, Bairro - Eunápolis"
                  value={groupAddress}
                  onChange={(e) => setGroupAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2" id="group-schedule-inputs-grid">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Dia</label>
                  <select
                    id="group-input-day"
                    value={groupDay}
                    onChange={(e) => setGroupDay(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  >
                    <option>Segunda-feira</option>
                    <option>Terça-feira</option>
                    <option>Quarta-feira</option>
                    <option>Quinta-feira</option>
                    <option>Sexta-feira</option>
                    <option>Sábado</option>
                    <option>Domingo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Horário</label>
                  <input
                    id="group-input-time"
                    type="text"
                    placeholder="20:00"
                    value={groupTime}
                    onChange={(e) => setGroupTime(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2" id="group-leader-inputs-grid">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Nome do Líder</label>
                  <input
                    id="group-input-leader"
                    type="text"
                    required
                    placeholder="Líder responsável"
                    value={groupLeader}
                    onChange={(e) => setGroupLeader(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Telefone Líder</label>
                  <input
                    id="group-input-phone"
                    type="tel"
                    placeholder="(73) 98888-8888"
                    value={groupPhone}
                    onChange={(e) => setGroupPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                  />
                </div>
              </div>

              <button
                id="group-submit-btn"
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all mt-2 active:scale-95"
              >
                Cadastrar Grupo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW VISITOR */}
      {showAddVisitorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="add-visitor-modal-backdrop">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-scale-up" id="add-visitor-modal">
            <div className="flex items-center justify-between" id="add-visitor-modal-header">
              <h4 className="text-sm font-black text-neutral-900">Registrar Visitante</h4>
              <button 
                id="close-add-visitor-modal"
                onClick={() => setShowAddVisitorModal(false)} 
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                Cancelar
              </button>
            </div>

            <form onSubmit={handleCreateVisitor} className="space-y-3 text-neutral-800" id="add-visitor-form">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Selecione o Grupo</label>
                <select
                  id="visitor-input-group"
                  value={visitorGroupId}
                  onChange={(e) => setVisitorGroupId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                >
                  {db.pastoralGroups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Nome do Visitante</label>
                <input
                  id="visitor-input-name"
                  type="text"
                  required
                  placeholder="Nome completo do visitante"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Telefone para Contato</label>
                <input
                  id="visitor-input-phone"
                  type="tel"
                  placeholder="(73) 98888-8888"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <button
                id="visitor-submit-btn"
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all mt-2 active:scale-95"
              >
                Salvar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW LESSON */}
      {showAddLessonModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="add-lesson-modal-backdrop">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-scale-up" id="add-lesson-modal">
            <div className="flex items-center justify-between" id="add-lesson-modal-header">
              <h4 className="text-sm font-black text-neutral-900">Nova Lição de Estudo</h4>
              <button 
                id="close-add-lesson-modal"
                onClick={() => setShowAddLessonModal(false)} 
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                Cancelar
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-3 text-neutral-800" id="add-lesson-form">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Título do Estudo</label>
                <input
                  id="lesson-input-title"
                  type="text"
                  required
                  placeholder="Ex: Fortalecendo a Fé em Família"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Conteúdo Completo (Texto)</label>
                <textarea
                  id="lesson-input-content"
                  required
                  rows={6}
                  placeholder="Digite os tópicos, versículos de apoio e orientações práticas..."
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl text-xs focus:ring-1 focus:ring-red-600 focus:border-red-600 outline-none font-sans"
                />
              </div>

              <button
                id="lesson-submit-btn"
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all mt-2 active:scale-95"
              >
                Publicar Lição
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
