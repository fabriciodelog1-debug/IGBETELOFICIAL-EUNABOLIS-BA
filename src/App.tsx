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

const INITIAL_OFFLINE_DB: ChurchDatabase = {
  members: [
    {
      id: "member-1",
      name: "Fabricio",
      email: "fabriciodelog1@gmail.com",
      phone: "73988199369",
      birthDate: "1984-02-27",
      baptismDate: "2001-06-27",
      pastoralLeader: "Fabricio",
      photoUrl: ""
    },
    {
      id: "member-2",
      name: "Clima frio",
      email: "climafrio@example.com",
      phone: "73982320936",
      birthDate: "2017-06-27",
      baptismDate: "2021-12-25",
      pastoralLeader: "Fabricio",
      photoUrl: ""
    }
  ],
  pastoralGroups: [
    {
      id: "group-1",
      name: "Grupo de Pastoreio Central",
      address: "Av. Conselheiro Luis Viana, 120, Centro - Eunápolis BA",
      meetingDay: "Quinta-feira",
      meetingTime: "20:00",
      leaderName: "Fabricio",
      leaderPhone: "73988199369"
    },
    {
      id: "group-2",
      name: "Grupo Shalon",
      address: "Rua das Palmeiras, 45, Pequi - Eunápolis BA",
      meetingDay: "Terça-feira",
      meetingTime: "19:30",
      leaderName: "Presbítero Lucas",
      leaderPhone: "73999887766"
    }
  ],
  visitors: [
    {
      id: "visitor-1",
      groupId: "group-1",
      name: "Ana Silva",
      phone: "73991234567",
      visitDate: "2026-06-25"
    },
    {
      id: "visitor-2",
      groupId: "group-1",
      name: "Carlos Santos",
      phone: "73981112222",
      visitDate: "2026-06-25"
    }
  ],
  lessons: [
    {
      id: "lesson-1",
      title: "Vivendo como Corpo de Cristo",
      content: "Objetivo: Compreender a importância do compromisso mútuo e do amor fraternal.\n\n1. Introdução: Nós somos membros uns dos outros (1 Co 12).\n2. Estudo Bíblico: Discussão sobre Romanos 12:10 e o dever de honrar uns aos outros.\n3. Aplicação Prática: Identificar uma pessoa nesta semana no grupo para abençoar de forma concreta.\n4. Oração final.",
      date: "2026-06-27"
    },
    {
      id: "lesson-2",
      title: "O Fruto do Espírito na Prática",
      content: "Objetivo: Praticar o amor, alegria e paz no convívio diário.\n\n1. O Fruto do Espírito vs Obras da carne (Gálatas 5).\n2. Como cultivar a paciência e a mansidão em relacionamentos difíceis.\n3. Compartilhamento: Qual área você precisa de maior fruto nesta semana?\n4. Oração coletiva por edificação espiritual.",
      date: "2026-07-04"
    }
  ],
  cultoSchedules: [
    {
      id: "culto-ensino",
      name: "Culto de Ensino",
      dayAndHour: "Quarta-feira às 19h30",
      ministerName: "Apóstolo Ronilto William"
    },
    {
      id: "culto-celebracao",
      name: "Culto de Celebração",
      dayAndHour: "Sábado às 19h",
      ministerName: "Apóstola Simone Rodrigues"
    },
    {
      id: "culto-familia",
      name: "Culto da Família",
      dayAndHour: "Domingo às 18h30",
      ministerName: "Pastor Fabricio"
    }
  ],
  dancaScale: {
    id: "current",
    ministroResponsavel: "Ana Paula",
    dancers: ["Isabela", "Beatriz", "Mariana", "Gabriele", "Juliana", "Patricia", "Camila", "Carla", "Ester"]
  },
  louvorScale: {
    id: "current",
    teclado: "Samuel Keys",
    violao: "Daniel Strings",
    bateria: "Filipe Drum",
    guitarra: "Thiago Rock",
    instrumentoAdicional1: "",
    instrumentoAdicional2: "",
    instrumentoAdicional3: "",
    vozPrincipal: "Marcos Silva",
    primeiraVoz: "Jéssica Souza",
    segundaVoz: "Letícia Neves",
    terceiraVoz: "",
    quartaVoz: "",
    songLinks: ["", "", "", "", ""]
  },
  midiaScale: {
    id: "current",
    camarim: "Renata Santos",
    movel: "Mateus Castro",
    mesaDeCorte: "André Lima",
    cadaShow: "Igor Neves",
    iluminacao: "Darlan Luz",
    futuro1: "Equipamento Projetor",
    futuro2: "Transmissão Externa",
    futuro3: "Câmera 4"
  },
  liveSettings: {
    isLive: true,
    title: "Culto Ao Vivo",
    description: "Culto Ao Vivo direto da Igreja Betel Eunápolis - BA. Todos os domingos às 18h30 e quartas às 19h30.",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    radioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    tvUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  devocionais: [
    {
      id: "dev-1",
      title: "O Cuidado de Deus",
      verse: "Filipenses 4:6 - 'Não andeis ansiosos por coisa alguma; antes em tudo sejam os vossos pedidos conhecidos diante de Deus pela oração e súplica com ações de graças.'",
      content: "Muitas vezes nos deparamos com preocupações que tentam roubar nossa paz. No entanto, o Senhor nos convida a depositar toda nossa ansiedade diante d'Ele. Quando oramos e agradecemos, entregamos o controle das nossas vidas Àquele que tudo pode. Descanse no amor e na provisão de Deus hoje. Ele cuida de você em cada detalhe.",
      date: "2026-06-27"
    },
    {
      id: "dev-2",
      title: "Firmados na Rocha",
      verse: "Mateus 7:24 - 'Todo aquele, pois, que ouve estas minhas palavras e as pratica, será comparado a um homem prudente, que edificou a sua casa sobre a rocha.'",
      content: "Construir nossa vida sobre os ensinamentos de Jesus garante que, mesmo diante das maiores tempestades, permaneceremos inabaláveis. Ouvir a Palavra é importante, mas praticá-la é o que nos dá estrutura e firmeza. Que suas decisões diárias sejam baseadas no caráter e nos princípios de Cristo.",
      date: "2026-06-28"
    }
  ],
  photos: [
    {
      id: "photo-1",
      url: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80",
      description: "Altar e Templo Principal da Igreja Betel",
      createdAt: "2026-06-27"
    },
    {
      id: "photo-2",
      url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1200&q=80",
      description: "Culto de Celebração e Adoração ao Vivo",
      createdAt: "2026-06-27"
    },
    {
      id: "photo-3",
      url: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
      description: "Estudo Bíblico e Comunhão nos Grupos de Pastoreio",
      createdAt: "2026-06-27"
    }
  ]
};

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

  // Helper to save DB to local storage
  const saveLocalDb = (newDb: ChurchDatabase) => {
    setDb(newDb);
    try {
      localStorage.setItem("betel_cached_db", JSON.stringify(newDb));
    } catch (e) {
      console.error("Erro ao salvar db no localStorage", e);
    }
  };

  // Fetch Full Database from Server with local offline fallback
  const fetchDb = async () => {
    try {
      const response = await fetch("/api/db");
      if (response.ok) {
        const data: ChurchDatabase = await response.json();
        setDb(data);
        localStorage.setItem("betel_cached_db", JSON.stringify(data));
      } else {
        throw new Error("Erro de status do servidor");
      }
    } catch (error) {
      console.warn("Sem conexão com o servidor da igreja. Usando banco de dados local offline:", error);
      const saved = localStorage.getItem("betel_cached_db");
      if (saved) {
        try {
          setDb(JSON.parse(saved));
        } catch (e) {
          setDb(INITIAL_OFFLINE_DB);
        }
      } else {
        setDb(INITIAL_OFFLINE_DB);
        localStorage.setItem("betel_cached_db", JSON.stringify(INITIAL_OFFLINE_DB));
      }
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
        return;
      }
    } catch (error) {
      console.error("Erro ao atualizar membro no servidor, salvando localmente:", error);
    }

    if (db) {
      const updatedMembers = [...db.members];
      const existingIdx = updatedMembers.findIndex(m => m.id === member.id);
      if (existingIdx >= 0) {
        updatedMembers[existingIdx] = member;
      } else {
        updatedMembers.push(member);
      }
      saveLocalDb({ ...db, members: updatedMembers });
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
        return;
      }
    } catch (error) {
      console.error("Erro ao excluir membro no servidor, salvando localmente:", error);
    }

    if (db) {
      saveLocalDb({
        ...db,
        members: db.members.filter(m => m.id !== id)
      });
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
        return;
      }
    } catch (error) {
      console.error("Erro ao cadastrar grupo no servidor, salvando localmente:", error);
    }

    if (db) {
      const newGroup: PastoralGroup = {
        id: group.id || "group-" + Date.now(),
        name: group.name || "Novo Grupo",
        address: group.address || "",
        meetingDay: group.meetingDay || "",
        meetingTime: group.meetingTime || "",
        leaderName: group.leaderName || "",
        leaderPhone: group.leaderPhone || ""
      };
      
      const updatedGroups = [...db.pastoralGroups];
      const existingIdx = updatedGroups.findIndex(g => g.id === newGroup.id);
      if (existingIdx >= 0) {
        updatedGroups[existingIdx] = newGroup;
      } else {
        updatedGroups.push(newGroup);
      }
      saveLocalDb({ ...db, pastoralGroups: updatedGroups });
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
        return;
      }
    } catch (error) {
      console.error("Erro ao remover grupo no servidor, salvando localmente:", error);
    }

    if (db) {
      saveLocalDb({
        ...db,
        pastoralGroups: db.pastoralGroups.filter(g => g.id !== id),
        visitors: db.visitors.filter(v => v.groupId !== id)
      });
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
        return;
      }
    } catch (error) {
      console.error("Erro ao cadastrar visitante no servidor, salvando localmente:", error);
    }

    if (db) {
      const newVisitor: Visitor = {
        id: "visitor-" + Date.now(),
        groupId: visitor.groupId || "",
        name: visitor.name || "",
        phone: visitor.phone || "",
        visitDate: visitor.visitDate || new Date().toISOString().split('T')[0]
      };
      saveLocalDb({
        ...db,
        visitors: [...db.visitors, newVisitor]
      });
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
        return;
      }
    } catch (error) {
      console.error("Erro ao publicar lição no servidor, salvando localmente:", error);
    }

    if (db) {
      const newLesson: Lesson = {
        id: lesson.id || "lesson-" + Date.now(),
        title: lesson.title || "Nova Lição",
        content: lesson.content || "",
        date: lesson.date || new Date().toISOString().split('T')[0]
      };
      const updatedLessons = [...db.lessons];
      const existingIdx = updatedLessons.findIndex(l => l.id === newLesson.id);
      if (existingIdx >= 0) {
        updatedLessons[existingIdx] = newLesson;
      } else {
        updatedLessons.push(newLesson);
      }
      saveLocalDb({ ...db, lessons: updatedLessons });
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
        return;
      }
    } catch (error) {
      console.error("Erro ao atualizar culto no servidor, salvando localmente:", error);
    }

    if (db) {
      const updatedSchedules = db.cultoSchedules.map(c => 
        c.id === id ? { ...c, ministerName } : c
      );
      saveLocalDb({ ...db, cultoSchedules: updatedSchedules });
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
        return;
      }
    } catch (error) {
      console.error("Erro ao salvar escala de dança no servidor, salvando localmente:", error);
    }

    if (db) {
      const newScale: DancaScale = {
        id: "current",
        ministroResponsavel: scale.ministroResponsavel || db.dancaScale.ministroResponsavel,
        dancers: Array.isArray(scale.dancers) ? scale.dancers : db.dancaScale.dancers
      };
      saveLocalDb({ ...db, dancaScale: newScale });
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
        return;
      }
    } catch (error) {
      console.error("Erro ao salvar escala de louvor no servidor, salvando localmente:", error);
    }

    if (db) {
      const newScale: LouvorScale = {
        id: "current",
        teclado: scale.teclado !== undefined ? scale.teclado! : db.louvorScale.teclado,
        violao: scale.violao !== undefined ? scale.violao! : db.louvorScale.violao,
        bateria: scale.bateria !== undefined ? scale.bateria! : db.louvorScale.bateria,
        guitarra: scale.guitarra !== undefined ? scale.guitarra! : db.louvorScale.guitarra,
        instrumentoAdicional1: scale.instrumentoAdicional1 !== undefined ? scale.instrumentoAdicional1! : db.louvorScale.instrumentoAdicional1,
        instrumentoAdicional2: scale.instrumentoAdicional2 !== undefined ? scale.instrumentoAdicional2! : db.louvorScale.instrumentoAdicional2,
        instrumentoAdicional3: scale.instrumentoAdicional3 !== undefined ? scale.instrumentoAdicional3! : db.louvorScale.instrumentoAdicional3,
        vozPrincipal: scale.vozPrincipal !== undefined ? scale.vozPrincipal! : db.louvorScale.vozPrincipal,
        primeiraVoz: scale.primeiraVoz !== undefined ? scale.primeiraVoz! : db.louvorScale.primeiraVoz,
        segundaVoz: scale.segundaVoz !== undefined ? scale.segundaVoz! : db.louvorScale.segundaVoz,
        terceiraVoz: scale.terceiraVoz !== undefined ? scale.terceiraVoz! : db.louvorScale.terceiraVoz,
        quartaVoz: scale.quartaVoz !== undefined ? scale.quartaVoz! : db.louvorScale.quartaVoz,
        songLinks: Array.isArray(scale.songLinks) ? scale.songLinks! : db.louvorScale.songLinks
      };
      saveLocalDb({ ...db, louvorScale: newScale });
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
        return;
      }
    } catch (error) {
      console.error("Erro ao salvar escala de mídia no servidor, salvando localmente:", error);
    }

    if (db) {
      const newScale: MidiaScale = {
        id: "current",
        camarim: scale.camarim !== undefined ? scale.camarim! : db.midiaScale.camarim,
        movel: scale.movel !== undefined ? scale.movel! : db.midiaScale.movel,
        mesaDeCorte: scale.mesaDeCorte !== undefined ? scale.mesaDeCorte! : db.midiaScale.mesaDeCorte,
        cadaShow: scale.cadaShow !== undefined ? scale.cadaShow! : db.midiaScale.cadaShow,
        iluminacao: scale.iluminacao !== undefined ? scale.iluminacao! : db.midiaScale.iluminacao,
        futuro1: scale.futuro1 !== undefined ? scale.futuro1! : db.midiaScale.futuro1,
        futuro2: scale.futuro2 !== undefined ? scale.futuro2! : db.midiaScale.futuro2,
        futuro3: scale.futuro3 !== undefined ? scale.futuro3! : db.midiaScale.futuro3
      };
      saveLocalDb({ ...db, midiaScale: newScale });
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
        return;
      }
    } catch (error) {
      console.error("Erro ao salvar transmissão no servidor, salvando localmente:", error);
    }

    if (db) {
      saveLocalDb({
        ...db,
        liveSettings: {
          ...db.liveSettings,
          ...settings
        }
      });
    }
  };

  // Action: Generate Devocional with Gemini AI
  const handleGenerateDevocional = async (theme: string) => {
    try {
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
    } catch (error) {
      console.error("Erro ao gerar devocional com AI, gerando offline:", error);
    }

    const offlineTitles = ["Esperança Renovada", "Fé Inabalável", "A Graça de Deus", "Caminhando com Deus", "Amor Fraternal"];
    const offlineVerses = ["Salmos 23:1", "Isaías 40:31", "João 3:16", "Romanos 8:28", "Filipenses 4:13"];
    const offlineContents = [
      "Que no dia de hoje você possa experimentar o cuidado amoroso e constante de nosso Senhor, que nos guia e sustenta a cada passo do caminho.",
      "Lembre-se de que a força da nossa caminhada vem do Senhor. Esperar n'Ele renovará as suas forças como as asas da águia.",
      "O amor de Deus por nós é incompreensível e maravilhoso. Entregue o seu dia nas mãos d'Ele e descanse em sua promessa fiel.",
      "Não importa a tempestade pela qual você esteja passando, a presença de Cristo no barco traz calmaria e segurança.",
      "Comunhão e amor de uns para com os outros são as marcas de uma comunidade cristã autêntica e saudável."
    ];

    const newDev = {
      id: "dev-" + Date.now(),
      title: offlineTitles[Math.floor(Math.random() * offlineTitles.length)] + ` (${theme})`,
      verse: offlineVerses[Math.floor(Math.random() * offlineVerses.length)],
      content: offlineContents[Math.floor(Math.random() * offlineContents.length)],
      date: new Date().toISOString().split('T')[0]
    };

    if (db) {
      const updatedDevs = [newDev, ...(db.devocionais || [])];
      saveLocalDb({ ...db, devocionais: updatedDevs });
    }

    return {
      success: true,
      devocional: newDev,
      warning: "Gerado offline com sucesso!"
    };
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
        return;
      }
    } catch (error) {
      console.error("Erro ao adicionar devocional no servidor, salvando localmente:", error);
    }

    if (db) {
      const newDev: Devocional = {
        id: "dev-" + Date.now(),
        title: devocional.title || "Reflexão",
        verse: devocional.verse || "Salmo 1",
        content: devocional.content || "",
        date: devocional.date || new Date().toISOString().split('T')[0]
      };
      saveLocalDb({
        ...db,
        devocionais: [newDev, ...(db.devocionais || [])]
      });
    }
  };

  // Action: Add Photo (Offline Resilient)
  const handleAddPhoto = async (url: string, description: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/db/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, description })
      });
      if (response.ok) {
        await fetchDb();
        return true;
      }
    } catch (error) {
      console.error("Erro ao enviar foto para o servidor, salvando localmente:", error);
    }

    if (db) {
      const newPhoto = {
        id: "photo-" + Date.now(),
        url,
        description,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const updatedPhotos = [newPhoto, ...(db.photos || [])];
      saveLocalDb({ ...db, photos: updatedPhotos });
      return true;
    }
    return false;
  };

  // Action: Delete Photo (Offline Resilient)
  const handleDeletePhoto = async (photoId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/db/photo/${photoId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        await fetchDb();
        return true;
      }
    } catch (error) {
      console.error("Erro ao excluir foto no servidor, removendo localmente:", error);
    }

    if (db) {
      const updatedPhotos = (db.photos || []).filter(p => p.id !== photoId);
      saveLocalDb({ ...db, photos: updatedPhotos });
      return true;
    }
    return false;
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
        


        {/* Dynamic header */}
        <Header title={getHeaderTitle()} />

        {/* Tab views content switcher */}
        <main className="flex-1 px-5 pt-5 overflow-y-auto" id="app-main-content">
          {activeTab === "inicio" && db && (
            <InicioTab
              db={db}
              currentUser={currentUser}
              setCurrentUser={handleSetCurrentUser}
              setActiveTab={setActiveTab}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
              setMoreSubtab={setMoreSubtab}
              onRefreshDb={fetchDb}
              onAddPhoto={handleAddPhoto}
              onDeletePhoto={handleDeletePhoto}
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
