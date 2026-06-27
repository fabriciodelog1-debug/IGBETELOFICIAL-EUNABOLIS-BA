export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  baptismDate: string;
  pastoralLeader: string;
  photoUrl?: string;
}

export interface PastoralGroup {
  id: string;
  name: string;
  address: string;
  meetingDay: string;
  meetingTime: string;
  leaderName: string;
  leaderPhone: string;
}

export interface Visitor {
  id: string;
  groupId: string;
  name: string;
  phone: string;
  visitDate: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface CultoSchedule {
  id: string;
  name: string;
  dayAndHour: string;
  ministerName: string;
}

export interface DancaScale {
  id: string; // e.g., "current"
  ministroResponsavel: string;
  dancers: string[]; // Up to 9 positions
}

export interface LouvorScale {
  id: string; // e.g., "current"
  teclado: string;
  violao: string;
  bateria: string;
  guitarra: string;
  instrumentoAdicional1: string;
  instrumentoAdicional2: string;
  instrumentoAdicional3: string;
  vozPrincipal: string;
  primeiraVoz: string;
  segundaVoz: string;
  terceiraVoz: string;
  quartaVoz: string;
  songLinks: string[]; // Up to 5 positions
}

export interface MidiaScale {
  id: string; // e.g., "current"
  camarim: string;
  movel: string;
  mesaDeCorte: string;
  cadaShow: string;
  iluminacao: string;
  futuro1: string;
  futuro2: string;
  futuro3: string;
}

export interface LiveSettings {
  isLive: boolean;
  title: string;
  description: string;
  youtubeUrl: string;
  radioUrl: string;
  tvUrl: string;
}

export interface Devocional {
  id: string;
  title: string;
  verse: string;
  content: string;
  date: string;
}

export interface ChurchPhoto {
  id: string;
  url: string; // URL or base64 data URL
  description: string;
  createdAt: string;
}

export interface ChurchDatabase {
  members: Member[];
  pastoralGroups: PastoralGroup[];
  visitors: Visitor[];
  lessons: Lesson[];
  cultoSchedules: CultoSchedule[];
  dancaScale: DancaScale;
  louvorScale: LouvorScale;
  midiaScale: MidiaScale;
  liveSettings: LiveSettings;
  devocionais: Devocional[];
  photos: ChurchPhoto[];
}
