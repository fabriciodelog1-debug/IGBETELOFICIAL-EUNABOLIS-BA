import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { ChurchDatabase, Devocional } from "./src/types";
import { Firestore } from "@google-cloud/firestore";

// Initialize Express app
const app = express();
const PORT = 3000;

app.use(express.json());

// Path to JSON file database
const DB_FILE = path.join(process.cwd(), "server_db.json");

// Load Firebase Config
const CONFIG_FILE = path.join(process.cwd(), "firebase-applet-config.json");
let firestore: Firestore | null = null;

try {
  if (fs.existsSync(CONFIG_FILE)) {
    const configData = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    firestore = new Firestore({
      projectId: configData.projectId,
      databaseId: configData.firestoreDatabaseId || undefined
    });
    console.log("Google Cloud Firestore configurado com sucesso para persistência global!");
  } else {
    console.warn("firebase-applet-config.json não encontrado. Usando banco local offline.");
  }
} catch (error) {
  console.error("Erro ao configurar Firebase Firestore, usando fallback local:", error);
}


// Initial mock devocionais to fallback or pre-populate
const INITIAL_DEVOCIONAIS: Devocional[] = [
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
  },
  {
    id: "dev-3",
    title: "O Poder da Comunhão",
    verse: "Salmos 133:1 - 'Oh! quão bom e quão suave é que os irmãos habitem em união!'",
    content: "Como Igreja Betel, somos chamados a viver em família. A comunhão nos fortalece, nos cura e atrai as bênçãos dos céus. Os Grupos de Pastoreio são ambientes fundamentais para esse cultivo espiritual. Não caminhe sozinho; compartilhe suas cargas, celebre as vitórias dos seus irmãos e cresçam juntos na fé.",
    date: "2026-06-29"
  }
];

// Helper to get default database
function getDefaultDb(): ChurchDatabase {
  return {
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
      ministroResponsavel: "",
      dancers: []
    },
    louvorScale: {
      id: "current",
      teclado: "",
      violao: "",
      bateria: "",
      guitarra: "",
      instrumentoAdicional1: "",
      instrumentoAdicional2: "",
      instrumentoAdicional3: "",
      vozPrincipal: "",
      primeiraVoz: "",
      segundaVoz: "",
      terceiraVoz: "",
      quartaVoz: "",
      songLinks: ["", "", "", "", ""]
    },
    midiaScale: {
      id: "current",
      camarim: "",
      movel: "",
      mesaDeCorte: "",
      cadaShow: "",
      iluminacao: "",
      futuro1: "",
      futuro2: "",
      futuro3: ""
    },
    liveSettings: {
      isLive: true,
      title: "Culto Ao Vivo",
      description: "Culto Ao Vivo direto da Igreja Betel Eunápolis - BA. Todos os domingos às 18h30 e quartas às 19h30.",
      youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Template video
      radioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo audio stream
      tvUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" // Demo video stream
    },
    devocionais: INITIAL_DEVOCIONAIS,
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
}

function cleanMockScales(db: ChurchDatabase): { db: ChurchDatabase; modified: boolean } {
  let modified = false;

  // Dança Scale cleanup
  if (db.dancaScale) {
    if (db.dancaScale.ministroResponsavel === "Ana Paula") {
      db.dancaScale.ministroResponsavel = "";
      modified = true;
    }
    if (JSON.stringify(db.dancaScale.dancers) === JSON.stringify(["Isabela", "Beatriz", "Mariana", "Gabriele", "Juliana", "Patricia", "Camila", "Carla", "Ester"])) {
      db.dancaScale.dancers = [];
      modified = true;
    }
  }

  // Louvor Scale cleanup
  if (db.louvorScale) {
    const mockLouvor = {
      teclado: "Samuel Keys",
      violao: "Daniel Strings",
      bateria: "Filipe Drum",
      guitarra: "Thiago Rock",
      vozPrincipal: "Marcos Silva",
      primeiraVoz: "Jéssica Souza",
      segundaVoz: "Letícia Neves"
    };

    (Object.keys(mockLouvor) as Array<keyof typeof mockLouvor>).forEach(key => {
      if (db.louvorScale[key] === mockLouvor[key]) {
        db.louvorScale[key] = "";
        modified = true;
      }
    });
  }

  // Mídia Scale cleanup
  if (db.midiaScale) {
    const mockMidia = {
      camarim: "Renata Santos",
      movel: "Mateus Castro",
      mesaDeCorte: "André Lima",
      cadaShow: "Igor Neves",
      iluminacao: "Darlan Luz",
      futuro1: "Equipamento Projetor",
      futuro2: "Transmissão Externa",
      futuro3: "Câmera 4"
    };

    (Object.keys(mockMidia) as Array<keyof typeof mockMidia>).forEach(key => {
      if (db.midiaScale[key] === mockMidia[key]) {
        db.midiaScale[key] = "";
        modified = true;
      }
    });
  }

  return { db, modified };
}

// Function to read DB with Firestore persistence & local fallback
async function readDb(): Promise<ChurchDatabase> {
  const defaultDb = getDefaultDb();
  
  if (!firestore) {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(data);
        return {
          ...defaultDb,
          ...parsed,
          louvorScale: {
            ...defaultDb.louvorScale,
            ...(parsed.louvorScale || {})
          },
          photos: parsed.photos || defaultDb.photos || []
        };
      }
    } catch (error) {
      console.error("Erro ao ler banco de dados JSON local", error);
    }
    await writeDb(defaultDb);
    return defaultDb;
  }

  try {
    const keys: (keyof ChurchDatabase)[] = [
      "members",
      "pastoralGroups",
      "visitors",
      "lessons",
      "cultoSchedules",
      "dancaScale",
      "louvorScale",
      "midiaScale",
      "liveSettings",
      "devocionais",
      "photos"
    ];

    const promises = keys.map(key => {
      const docRef = firestore!.collection("church_data").doc(key);
      return docRef.get();
    });

    const snapshots = await Promise.all(promises);
    const db: any = {};

    snapshots.forEach((snap, idx) => {
      const key = keys[idx];
      if (snap.exists) {
        const val = snap.data();
        if (Array.isArray(defaultDb[key])) {
          db[key] = (val && val.data) || [];
        } else {
          db[key] = val || defaultDb[key];
        }
      } else {
        db[key] = defaultDb[key];
      }
    });

    // Handle missing top level arrays cleanly
    let finalDb: ChurchDatabase = {
      ...defaultDb,
      ...db,
      louvorScale: {
        ...defaultDb.louvorScale,
        ...(db.louvorScale || {})
      },
      photos: db.photos || defaultDb.photos || []
    };

    // Clean mock scales if needed, and write back to Firestore to propagate
    const cleaned = cleanMockScales(finalDb);
    if (cleaned.modified) {
      finalDb = cleaned.db;
      // Propagate the change asynchronously so we don't block the read
      writeDb(finalDb).catch(err => console.error("Erro ao gravar dados limpos no Firestore:", err));
    }

    return finalDb;
  } catch (error) {
    console.error("Erro ao ler do Firestore, usando fallback local:", error);
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(data);
      }
    } catch (e) {}
    return defaultDb;
  }
}

// Function to write DB to Firestore & local fallback
async function writeDb(db: ChurchDatabase) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao salvar backup de banco de dados JSON local", error);
  }

  if (!firestore) return;

  try {
    const keys: (keyof ChurchDatabase)[] = [
      "members",
      "pastoralGroups",
      "visitors",
      "lessons",
      "cultoSchedules",
      "dancaScale",
      "louvorScale",
      "midiaScale",
      "liveSettings",
      "devocionais",
      "photos"
    ];

    const promises = keys.map(key => {
      const docRef = firestore!.collection("church_data").doc(key);
      const data = db[key];
      if (Array.isArray(data)) {
        return docRef.set({ data });
      } else {
        return docRef.set(data);
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Erro ao escrever no Firestore:", error);
  }
}

// Initialize AI SDK
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API Routes
app.get("/api/db", async (req, res) => {
  const db = await readDb();
  res.json(db);
});

// Create or update member
app.post("/api/db/member", async (req, res) => {
  const db = await readDb();
  const memberData = req.body;
  
  if (!memberData.name) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  const existingIdx = db.members.findIndex(m => m.id === memberData.id || (m.email && m.email === memberData.email));
  if (existingIdx >= 0) {
    // Merge
    db.members[existingIdx] = {
      ...db.members[existingIdx],
      ...memberData,
      id: db.members[existingIdx].id // Keep ID
    };
    await writeDb(db);
    return res.json(db.members[existingIdx]);
  } else {
    // Create new
    const newMember = {
      ...memberData,
      id: memberData.id || "member-" + Date.now()
    };
    db.members.push(newMember);
    await writeDb(db);
    return res.json(newMember);
  }
});

app.delete("/api/db/member/:id", async (req, res) => {
  const db = await readDb();
  const id = req.params.id;
  db.members = db.members.filter(m => m.id !== id);
  await writeDb(db);
  res.json({ success: true });
});

// Create or update pastoral group
app.post("/api/db/pastoral-group", async (req, res) => {
  const db = await readDb();
  const groupData = req.body;

  if (!groupData.name) {
    return res.status(400).json({ error: "Nome do grupo é obrigatório" });
  }

  const existingIdx = db.pastoralGroups.findIndex(g => g.id === groupData.id);
  if (existingIdx >= 0) {
    db.pastoralGroups[existingIdx] = {
      ...db.pastoralGroups[existingIdx],
      ...groupData
    };
    await writeDb(db);
    return res.json(db.pastoralGroups[existingIdx]);
  } else {
    const newGroup = {
      ...groupData,
      id: "group-" + Date.now()
    };
    db.pastoralGroups.push(newGroup);
    await writeDb(db);
    return res.json(newGroup);
  }
});

app.delete("/api/db/pastoral-group/:id", async (req, res) => {
  const db = await readDb();
  const id = req.params.id;
  db.pastoralGroups = db.pastoralGroups.filter(g => g.id !== id);
  // Also clean visitors
  db.visitors = db.visitors.filter(v => v.groupId !== id);
  await writeDb(db);
  res.json({ success: true });
});

// Add visitor to pastoral group
app.post("/api/db/visitor", async (req, res) => {
  const db = await readDb();
  const visitorData = req.body;

  if (!visitorData.name || !visitorData.groupId) {
    return res.status(400).json({ error: "Nome e ID do grupo são obrigatórios" });
  }

  const newVisitor = {
    ...visitorData,
    id: "visitor-" + Date.now(),
    visitDate: visitorData.visitDate || new Date().toISOString().split('T')[0]
  };
  db.visitors.push(newVisitor);
  await writeDb(db);
  res.json(newVisitor);
});

// Create or edit group lesson
app.post("/api/db/lesson", async (req, res) => {
  const db = await readDb();
  const lessonData = req.body;

  if (!lessonData.title) {
    return res.status(400).json({ error: "Título da lição é obrigatório" });
  }

  const existingIdx = db.lessons.findIndex(l => l.id === lessonData.id);
  if (existingIdx >= 0) {
    db.lessons[existingIdx] = {
      ...db.lessons[existingIdx],
      ...lessonData
    };
    await writeDb(db);
    return res.json(db.lessons[existingIdx]);
  } else {
    const newLesson = {
      ...lessonData,
      id: "lesson-" + Date.now(),
      date: lessonData.date || new Date().toISOString().split('T')[0]
    };
    db.lessons.push(newLesson);
    await writeDb(db);
    return res.json(newLesson);
  }
});

// Update Minister Schedule for a culto
app.post("/api/db/culto-schedule", async (req, res) => {
  const db = await readDb();
  const { id, ministerName } = req.body;

  const cultoIdx = db.cultoSchedules.findIndex(c => c.id === id);
  if (cultoIdx >= 0) {
    db.cultoSchedules[cultoIdx].ministerName = ministerName;
    await writeDb(db);
    return res.json(db.cultoSchedules[cultoIdx]);
  }
  res.status(404).json({ error: "Culto não encontrado" });
});

// Update Dança Scale
app.post("/api/db/scale/danca", async (req, res) => {
  const db = await readDb();
  const scaleData = req.body;
  
  db.dancaScale = {
    id: "current",
    ministroResponsavel: scaleData.ministroResponsavel || db.dancaScale.ministroResponsavel,
    dancers: Array.isArray(scaleData.dancers) ? scaleData.dancers : db.dancaScale.dancers
  };
  
  await writeDb(db);
  res.json(db.dancaScale);
});

// Update Louvor Scale
app.post("/api/db/scale/louvor", async (req, res) => {
  const db = await readDb();
  const scaleData = req.body;

  db.louvorScale = {
    id: "current",
    teclado: scaleData.teclado !== undefined ? scaleData.teclado : db.louvorScale.teclado,
    violao: scaleData.violao !== undefined ? scaleData.violao : db.louvorScale.violao,
    bateria: scaleData.bateria !== undefined ? scaleData.bateria : db.louvorScale.bateria,
    guitarra: scaleData.guitarra !== undefined ? scaleData.guitarra : db.louvorScale.guitarra,
    instrumentoAdicional1: scaleData.instrumentoAdicional1 !== undefined ? scaleData.instrumentoAdicional1 : db.louvorScale.instrumentoAdicional1,
    instrumentoAdicional2: scaleData.instrumentoAdicional2 !== undefined ? scaleData.instrumentoAdicional2 : db.louvorScale.instrumentoAdicional2,
    instrumentoAdicional3: scaleData.instrumentoAdicional3 !== undefined ? scaleData.instrumentoAdicional3 : db.louvorScale.instrumentoAdicional3,
    vozPrincipal: scaleData.vozPrincipal !== undefined ? scaleData.vozPrincipal : db.louvorScale.vozPrincipal,
    primeiraVoz: scaleData.primeiraVoz !== undefined ? scaleData.primeiraVoz : db.louvorScale.primeiraVoz,
    segundaVoz: scaleData.segundaVoz !== undefined ? scaleData.segundaVoz : db.louvorScale.segundaVoz,
    terceiraVoz: scaleData.terceiraVoz !== undefined ? scaleData.terceiraVoz : db.louvorScale.terceiraVoz,
    quartaVoz: scaleData.quartaVoz !== undefined ? scaleData.quartaVoz : db.louvorScale.quartaVoz,
    songLinks: Array.isArray(scaleData.songLinks) ? scaleData.songLinks : db.louvorScale.songLinks
  };

  await writeDb(db);
  res.json(db.louvorScale);
});

// Update Mídia Scale
app.post("/api/db/scale/midia", async (req, res) => {
  const db = await readDb();
  const scaleData = req.body;

  db.midiaScale = {
    id: "current",
    camarim: scaleData.camarim !== undefined ? scaleData.camarim : db.midiaScale.camarim,
    movel: scaleData.movel !== undefined ? scaleData.movel : db.midiaScale.movel,
    mesaDeCorte: scaleData.mesaDeCorte !== undefined ? scaleData.mesaDeCorte : db.midiaScale.mesaDeCorte,
    cadaShow: scaleData.cadaShow !== undefined ? scaleData.cadaShow : db.midiaScale.cadaShow,
    iluminacao: scaleData.iluminacao !== undefined ? scaleData.iluminacao : db.midiaScale.iluminacao,
    futuro1: scaleData.futuro1 !== undefined ? scaleData.futuro1 : db.midiaScale.futuro1,
    futuro2: scaleData.futuro2 !== undefined ? scaleData.futuro2 : db.midiaScale.futuro2,
    futuro3: scaleData.futuro3 !== undefined ? scaleData.futuro3 : db.midiaScale.futuro3
  };

  await writeDb(db);
  res.json(db.midiaScale);
});

// Update Live Settings
app.post("/api/db/live", async (req, res) => {
  const db = await readDb();
  const liveData = req.body;

  db.liveSettings = {
    ...db.liveSettings,
    ...liveData
  };

  await writeDb(db);
  res.json(db.liveSettings);
});

// Generate Devocional using Gemini AI
app.post("/api/db/devocional/generate", async (req, res) => {
  const { theme } = req.body;
  const promptTheme = theme || "Fé e Esperança";

  try {
    if (!ai) {
      // Offline fallback generator
      const randomTitles = ["Fortalecidos no Senhor", "O Caminho da Paz", "Coração Grato", "Perseverança na Provação"];
      const randomVerses = [
        "Josué 1:9 - 'Não fui eu que ordenei a você? Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.'",
        "Salmos 23:1 - 'O Senhor é o meu pastor; de nada terei falta.'",
        "Romanos 15:13 - 'Que o Deus da esperança os encha de toda alegria e paz, por sua confiança nele, para que vocês transbordem de esperança pelo poder do Espírito Santo.'"
      ];
      const randomContents = [
        "A jornada da via cristã exige que estejamos constantemente sintonizados com a voz de Deus. Seja forte, pois as promessas d'Ele não falham.",
        "A paz de Cristo excede todo entendimento. Quando tudo parecer confuso, feche seus olhos e lembre-se de que Ele é o Bom Pastor que guia suas ovelhas com amor.",
        "Ter esperança não significa ignorar as dificuldades, mas sim saber que Deus está acima delas. Confie que o Senhor está trabalhando no seu amanhã."
      ];

      const rIdx = Math.floor(Math.random() * randomContents.length);
      const offlineDevocional: Devocional = {
        id: "dev-" + Date.now(),
        title: randomTitles[Math.floor(Math.random() * randomTitles.length)] + ` (${promptTheme})`,
        verse: randomVerses[Math.floor(Math.random() * randomVerses.length)],
        content: randomContents[rIdx],
        date: new Date().toISOString().split('T')[0]
      };

      const db = await readDb();
      db.devocionais.unshift(offlineDevocional);
      await writeDb(db);

      return res.json({
        success: true,
        devocional: offlineDevocional,
        warning: "Criado com gerador offline (adicione a chave GEMINI_API_KEY para gerar com inteligência artificial)."
      });
    }

    // Call Gemini API to generate beautiful Devocional
    const systemPrompt = "Você é um pastor sênior muito amoroso e sábio da Igreja Betel. Crie um devocional diário inspirador em português. O formato de resposta deve ser JSON estrito combinando com as propriedades: 'title' (título cativante), 'verse' (versículo bíblico com livro e capítulo), 'content' (texto devocional inspirador de 2 ou 3 parágrafos incentivando a congregação). Não use formatação markdown de blocos de código.";
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Gere um devocional para a igreja sob o tema: "${promptTheme}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            verse: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["title", "verse", "content"]
        }
      }
    });

    const generatedText = response.text || "";
    const parsedData = JSON.parse(generatedText);

    const newDevocional: Devocional = {
      id: "dev-" + Date.now(),
      title: parsedData.title || "Reflexão do Dia",
      verse: parsedData.verse || "Salmos 119:105",
      content: parsedData.content || "Medite na Palavra de Deus.",
      date: new Date().toISOString().split('T')[0]
    };

    const db = await readDb();
    db.devocionais.unshift(newDevocional);
    await writeDb(db);

    res.json({ success: true, devocional: newDevocional });

  } catch (error: any) {
    console.error("Erro ao gerar devocional com Gemini:", error);
    res.status(500).json({ error: "Erro ao gerar devocional: " + error.message });
  }
});

// AI Bible Assistant Chat Endpoint
app.post("/api/db/biblia/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "A mensagem é obrigatória." });
  }

  try {
    if (!ai) {
      // Offline fallback response to guide users
      return res.json({
        response: `Olá! Fico muito feliz com sua curiosidade e interesse pela Palavra de Deus. No momento estou operando em **modo offline** pois a chave do Gemini AI não está configurada nos segredos do sistema.

Para habilitar respostas em tempo real com inteligência artificial, adicione a chave \`GEMINI_API_KEY\` nas configurações da plataforma.

Como incentivo, aqui está uma curiosidade bíblica extraordinária:
**Você sabia que o menor versículo da Bíblia** (na maioria das traduções em português) é Êxodo 20:13 ("Não matarás") ou Jó 3:2 ("Disse ele:"), mas o versículo mais curto em inglês é "Jesus wept" (João 11:35)?`,
        isOffline: true
      });
    }

    const systemInstruction = "Você é o 'Pastor Virtual Betel', um assistente teológico e bíblico inteligente, sábio, amigável e focado exclusivamente em responder dúvidas sobre a Bíblia, teologia, história da igreja, curiosidades bíblicas e fatos extraordinários das escrituras sagradas.\n\nRegras estritas:\n1. Responda sempre em português brasileiro de forma compreensível e pastoral.\n2. Se o usuário fizer uma pergunta que não tem NADA a ver com a Bíblia, fé cristã, Deus, Jesus, religião ou teologia (por exemplo, pedir receitas de comida, códigos de programação, futebol, fofocas de famosos, etc.), recuse educadamente e com amor pastoral, explicando que sua missão é ajudar com dúvidas e curiosidades bíblicas.\n3. Inclua referências bíblicas (Livro, Capítulo, Versículo) sempre que possível para embasar suas respostas.\n4. Mantenha as respostas concisas, inspiradoras e fáceis de ler, usando formatação de parágrafos limpos ou tópicos quando útil. Não use tons excessivamente acadêmicos ou frios.";

    // Map history to Gemini API format if provided
    const formattedContents: any[] = [];
    if (Array.isArray(history)) {
      history.forEach((h: any) => {
        formattedContents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.message }]
        });
      });
    }

    // Append current message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      response: response.text || "Desculpe, não consegui formular uma resposta neste momento.",
      isOffline: false
    });

  } catch (error: any) {
    console.error("Erro no chat da Bíblia:", error);
    res.status(500).json({ error: "Erro ao processar sua pergunta: " + error.message });
  }
});

// Add manual devocional
app.post("/api/db/devocional/add", async (req, res) => {
  const db = await readDb();
  const devocionalData = req.body;

  if (!devocionalData.title || !devocionalData.verse || !devocionalData.content) {
    return res.status(400).json({ error: "Título, versículo e conteúdo são obrigatórios." });
  }

  const newDevocional: Devocional = {
    id: "dev-" + Date.now(),
    title: devocionalData.title,
    verse: devocionalData.verse,
    content: devocionalData.content,
    date: devocionalData.date || new Date().toISOString().split('T')[0]
  };

  db.devocionais.unshift(newDevocional);
  await writeDb(db);
  res.json(newDevocional);
});

// Add new church/culto photo
app.post("/api/db/photo", async (req, res) => {
  const db = await readDb();
  const { url, description } = req.body;

  if (!url) {
    return res.status(400).json({ error: "A URL ou arquivo de imagem é obrigatório." });
  }

  const newPhoto = {
    id: "photo-" + Date.now(),
    url: url,
    description: description || "Foto da Igreja Betel",
    createdAt: new Date().toISOString().split('T')[0]
  };

  if (!db.photos) db.photos = [];
  db.photos.unshift(newPhoto);
  await writeDb(db);
  res.json(newPhoto);
});

// Delete church/culto photo
app.delete("/api/db/photo/:id", async (req, res) => {
  const db = await readDb();
  const id = req.params.id;

  if (!db.photos) db.photos = [];
  db.photos = db.photos.filter(p => p.id !== id);
  await writeDb(db);
  res.json({ success: true });
});

// Start server
async function startServer() {
  // Read DB to ensure initialization
  await readDb();

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
