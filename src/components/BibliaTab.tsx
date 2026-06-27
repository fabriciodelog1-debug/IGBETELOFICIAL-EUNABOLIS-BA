import React, { useState } from "react";
import { BookOpen, Search, Type, ArrowLeft, Bookmark, Sparkles, Send, Trash2, MessageSquare } from "lucide-react";

interface ScriptureChapter {
  book: string;
  chapter: number;
  verses: { number: number; text: string }[];
}

// Pre-loaded famous scriptures for full, zero-latency offline reading
const PRELOADED_BIBLE: ScriptureChapter[] = [
  {
    book: "Salmos",
    chapter: 23,
    verses: [
      { number: 1, text: "O Senhor é o meu pastor, de nada terei falta." },
      { number: 2, text: "Em verdes pastagens me faz repousar e me conduz a águas tranquilas;" },
      { number: 3, text: "restaura-me o vigor. Guia-me nas veredas da justiça por amor do seu nome." },
      { number: 4, text: "Mesmo que eu caminhe por um vale de trevas e morte, não temerei mal algum, porque tu estás comigo; a tua vara e o teu cajado me protegem." },
      { number: 5, text: "Preparas um banquete para mim à vista dos meus inimigos. Unges a minha cabeça com óleo; o meu cálice transborda." },
      { number: 6, text: "Sei que a bondade e a fidelidade me acompanharão todos os dias da minha vida, e voltarei a habitar na casa do Senhor para sempre." }
    ]
  },
  {
    book: "Salmos",
    chapter: 91,
    verses: [
      { number: 1, text: "Aquele que habita no abrigo do Altíssimo e descansa à sombra do Todo-poderoso" },
      { number: 2, text: "pode dizer ao Senhor: Tu és o meu refúgio e a minha fortaleza, o meu Deus, em quem confio." },
      { number: 3, text: "Ele o livrará do laço do caçador e do veneno mortal." },
      { number: 4, text: "Ele o cobrirá com as suas penas, e sob as suas asas você encontrará refúgio; a fidelidade dele será o seu escudo protetor." },
      { number: 5, text: "Você não temerá o pavor da noite, nem a flecha que voa de dia," },
      { number: 6, text: "nem a peste que se move nas trevas, nem a praga que devasta ao meio-dia." },
      { number: 7, text: "Mil poderão cair ao seu lado e dez mil à sua direita, mas nada o atingirá." },
      { number: 8, text: "Você apenas olhará com os seus olhos e verá o castigo dos ímpios." }
    ]
  },
  {
    book: "Mateus",
    chapter: 6,
    verses: [
      { number: 9, text: "Vocês, osempre orem assim: Pai nosso, que estás nos céus! Santificado seja o teu nome." },
      { number: 10, text: "Venha o teu Reino; seja feita a tua vontade, assim na terra como no céu." },
      { number: 11, text: "Dá-nos hoje o nosso pão diário." },
      { number: 12, text: "Perdoa as nossas dívidas, assim como perdoamos aos nossos devedores." },
      { number: 13, text: "E não nos deixes cair em tentação, mas livra-nos do mal, porque teu é o Reino, o poder e a glória para sempre. Amém." },
      { number: 25, text: "Portanto eu lhes digo: Não se preocupem com a sua própria vida, quanto ao que comer ou beber; nem com o seu próprio corpo, quanto ao que vestir. Não é a vida mais importante do que a comida, e o corpo mais importante do que a roupa?" },
      { number: 33, text: "Busquem, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas lhes serão acrescentadas." },
      { number: 34, text: "Portanto, não se preocupem com o amanhã, pois o amanhã trará as suas próprias preocupações. Basta a cada dia o seu próprio mal." }
    ]
  },
  {
    book: "João",
    chapter: 1,
    verses: [
      { number: 1, text: "No princípio era aquele que é a Palavra. Ele estava com Deus, e a Palavra era Deus." },
      { number: 2, text: "Ele estava com Deus no princípio." },
      { number: 3, text: "Todas as coisas foram feitas por intermédio dele; sem ele, nada do que existe teria sido feito." },
      { number: 4, text: "Nele estava a vida, e esta era a luz dos homens." },
      { number: 5, text: "A luz brilha nas trevas, e as trevas não a derrotaram." },
      { number: 12, text: "Contudo, aos que o receberam, aos que creram em seu nome, deu-lhes o direito de se tornarem filhos de Deus." },
      { number: 14, text: "Aquele que é a Palavra tornou-se carne e viveu entre nós. Vimos a sua glória, glória como do Filho Único vindo do Pai, cheio de graça e de verdade." }
    ]
  },
  {
    book: "Romanos",
    chapter: 8,
    verses: [
      { number: 1, text: "Portanto, agora já não há condenação para os que estão em Cristo Jesus," },
      { number: 28, text: "Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito." },
      { number: 31, text: "Que diremos, pois, diante dessas coisas? Se Deus é por nós, quem será contra nós?" },
      { number: 35, text: "Quem nos separará do amor de Cristo? Será tribulação, ou angústia, ou perseguição, ou fome, ou nudez, ou perigo, ou espada?" },
      { number: 37, text: "Mas, em todas estas coisas somos mais que vencedores, por meio daquele que nos amou." },
      { number: 38, text: "Pois estou convencido de que nem morte nem vida, nem anjos nem demônios, nem o presente nem o futuro, nem quaisquer poderes," },
      { number: 39, text: "nem altura nem profundidade, nem qualquer outra coisa na criação será capaz de nos separar do amor de Deus que está em Cristo Jesus, nosso Senhor." }
    ]
  },
  {
    book: "1 Coríntios",
    chapter: 13,
    verses: [
      { number: 1, text: "Ainda que eu fale as línguas dos homens e dos anjos, se não tiver amor, serei como o bronze que soa ou como o címbalo que retine." },
      { number: 2, text: "Ainda que eu tenha o dom de profecia, saiba todos os mistérios e todo o conhecimento, e tenha uma fé capaz de mover montanhas, se não tiver amor, nada serei." },
      { number: 4, text: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha." },
      { number: 5, text: "Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor." },
      { number: 7, text: "Tudo sofre, tudo crê, tudo espera, tudo suporta." },
      { number: 8, text: "O amor nunca perece." },
      { number: 13, text: "Assim, permanecem agora estes três: a fé, a esperança e o amor. O maior deles, porém, é o amor." }
    ]
  }
];

export default function BibliaTab() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [highlightedVerses, setHighlightedVerses] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeSubTab, setActiveSubTab] = useState<"leitura" | "ia">("leitura");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    {
      role: "model",
      text: "Olá, amado(a)! Eu sou o Pastor Virtual Betel. Estou aqui para ajudar você a compreender as Escrituras Sagradas, tirar dúvidas teológicas, contar curiosidades ou trazer fatos extraordinários da Bíblia. Como posso edificar sua vida hoje?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const SUGGESTED_QUESTIONS = [
    "Qual é o menor versículo da Bíblia?",
    "Me conte uma curiosidade sobre o livro de Daniel",
    "O que significa a palavra 'Betel' em hebraico?",
    "Como explicar a graça de Deus?"
  ];

  const handleSendMessage = async (textToSubmit?: string) => {
    const messageToSend = textToSubmit !== undefined ? textToSubmit : chatInput;
    if (!messageToSend.trim() || isLoadingChat) return;

    const userMsg = messageToSend.trim();
    if (textToSubmit === undefined) {
      setChatInput("");
    }

    const updatedMessages = [...chatMessages, { role: "user" as const, text: userMsg }];
    setChatMessages(updatedMessages);
    setIsLoadingChat(true);

    try {
      const apiHistory = updatedMessages.slice(0, -1).map(msg => ({
        role: msg.role,
        message: msg.text
      }));

      const response = await fetch("/api/db/biblia/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: apiHistory
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao obter resposta.");
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: "model" as const, text: data.response }]);
    } catch (error: any) {
      console.error(error);
      setChatMessages(prev => [
        ...prev,
        { 
          role: "model" as const, 
          text: "Ops, tive um probleminha para me conectar aos céus digitais agora. Por favor, tente enviar sua pergunta novamente em instantes!" 
        }
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const renderMessageText = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, partIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={partIdx} className="font-bold text-neutral-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <React.Fragment key={lineIdx}>
          {renderedLine}
          {lineIdx < text.split("\n").length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const books = Array.from(new Set(PRELOADED_BIBLE.map((item) => item.book)));

  const handleBookClick = (book: string) => {
    setSelectedBook(book);
    const chapters = PRELOADED_BIBLE.filter((item) => item.book === book);
    if (chapters.length === 1) {
      setSelectedChapter(chapters[0].chapter);
    } else {
      setSelectedChapter(null);
    }
    setHighlightedVerses([]);
  };

  const currentChapterData = PRELOADED_BIBLE.find(
    (item) => item.book === selectedBook && item.chapter === selectedChapter
  );

  const toggleVerseHighlight = (verseNum: number) => {
    if (highlightedVerses.includes(verseNum)) {
      setHighlightedVerses(highlightedVerses.filter((v) => v !== verseNum));
    } else {
      setHighlightedVerses([...highlightedVerses, verseNum]);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "sm": return "text-xs";
      case "md": return "text-sm";
      case "lg": return "text-base";
      case "xl": return "text-lg";
    }
  };

  const filteredVerses = searchQuery
    ? PRELOADED_BIBLE.flatMap((ch) =>
        ch.verses
          .filter((v) => v.text.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((v) => ({ ...v, book: ch.book, chapter: ch.chapter }))
      )
    : [];

  return (
    <div className="space-y-5 pb-24 text-neutral-800" id="biblia-tab-container">
      
      {/* SUB-TAB NAVIGATOR */}
      <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/50" id="biblia-subtab-nav">
        <button
          id="subtab-leitura-btn"
          onClick={() => setActiveSubTab("leitura")}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
            activeSubTab === "leitura"
              ? "bg-white text-red-600 shadow-sm"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Leitura da Palavra</span>
        </button>
        <button
          id="subtab-ia-btn"
          onClick={() => setActiveSubTab("ia")}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
            activeSubTab === "ia"
              ? "bg-white text-red-600 shadow-sm"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pastor Virtual IA</span>
        </button>
      </div>

      {activeSubTab === "ia" ? (
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs space-y-4" id="bible-ia-chat-container">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3" id="ia-chat-header">
            <div className="flex items-center space-x-2.5">
              <div className="bg-red-50 text-red-600 p-2 rounded-2xl">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-neutral-900 leading-tight">Pastor Virtual Betel</h3>
                <p className="text-[10px] text-neutral-400 font-medium">Sua inteligência para curiosidades e estudos bíblicos</p>
              </div>
            </div>
            {chatMessages.length > 1 && (
              <button
                id="clear-chat-history"
                onClick={() => setChatMessages([
                  {
                    role: "model",
                    text: "Olá, amado(a)! Eu sou o Pastor Virtual Betel. Estou aqui para ajudar você a compreender as Escrituras Sagradas, tirar dúvidas teológicas, contar curiosidades ou trazer fatos extraordinários da Bíblia. Como posso edificar sua vida hoje?"
                  }
                ])}
                className="text-neutral-400 hover:text-red-600 p-1.5 rounded-xl hover:bg-neutral-50 transition-all flex items-center space-x-1"
                title="Limpar Conversa"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">Limpar</span>
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 flex flex-col scroll-smooth" id="ia-chat-messages">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed transition-all ${
                  msg.role === "user"
                    ? "bg-red-600 text-white rounded-tr-none self-end shadow-xs"
                    : "bg-neutral-50 text-neutral-800 border border-neutral-100 rounded-tl-none self-start"
                }`}
              >
                <div className="space-y-1 font-sans">
                  {renderMessageText(msg.text)}
                </div>
              </div>
            ))}

            {isLoadingChat && (
              <div className="bg-neutral-50 border border-neutral-100 text-neutral-800 rounded-2xl rounded-tl-none p-3 text-xs max-w-[85%] self-start flex items-center space-x-2 shadow-xs" id="ia-chat-loading">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">O Pastor está refletindo...</span>
              </div>
            )}
          </div>

          {/* Quick suggestions if only greeting is present */}
          {chatMessages.length === 1 && !isLoadingChat && (
            <div className="space-y-2 pt-2" id="ia-chat-suggestions">
              <span className="text-[9px] uppercase tracking-wider font-black text-neutral-400 block pl-1">Perguntas Sugeridas</span>
              <div className="grid grid-cols-1 gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    id={`suggested-question-btn-${idx}`}
                    onClick={() => handleSendMessage(q)}
                    className="text-left bg-neutral-50 hover:bg-red-50/50 hover:border-red-100 transition-all border border-neutral-200/50 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 flex items-center justify-between"
                  >
                    <span>{q}</span>
                    <Sparkles className="w-3 h-3 text-red-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="pt-2 border-t border-neutral-100 flex items-center space-x-2" id="ia-chat-input-container">
            <input
              id="ia-chat-input"
              type="text"
              placeholder="Digite sua dúvida ou curiosidade da Bíblia..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              disabled={isLoadingChat}
              className="flex-1 bg-neutral-50 px-3.5 py-2.5 rounded-xl text-xs border border-neutral-200 outline-none focus:border-red-600 font-medium placeholder-neutral-400"
            />
            <button
              id="ia-chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!chatInput.trim() || isLoadingChat}
              className={`p-2.5 rounded-xl text-white shadow-xs transition-all active:scale-95 ${
                chatInput.trim() && !isLoadingChat
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* SEARCH BAR */}
          <div className="bg-white p-3.5 rounded-2.5xl border border-neutral-100 flex items-center space-x-2 shadow-xs" id="biblia-search-box">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              id="biblia-search-input"
              type="text"
              placeholder="Pesquisar palavra chave na Bíblia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-neutral-800 placeholder-neutral-400"
            />
            {searchQuery && (
              <button 
                id="clear-biblia-search"
                onClick={() => setSearchQuery("")} 
                className="text-[10px] font-bold text-neutral-400 hover:text-red-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* SEARCH RESULTS */}
          {searchQuery !== "" ? (
            <div className="space-y-3" id="biblia-search-results">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider pl-1">
                Resultados para "{searchQuery}" ({filteredVerses.length})
              </h3>
              <div className="space-y-2.5" id="search-results-list">
                {filteredVerses.length === 0 ? (
                  <p className="text-xs text-neutral-500 text-center py-6">Nenhum versículo encontrado com esse termo.</p>
                ) : (
                  filteredVerses.map((v, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setSelectedBook(v.book);
                        setSelectedChapter(v.chapter);
                        setSearchQuery("");
                        setHighlightedVerses([v.number]);
                      }}
                      className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-xs hover:border-red-200 cursor-pointer space-y-1 transition-all"
                    >
                      <p className="text-xs font-black text-red-600">{v.book} {v.chapter}:{v.number}</p>
                      <p className="text-xs text-neutral-600 italic">"{v.text}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              {/* MAIN BIBLE SELECTOR */}
              {!selectedBook ? (
                <div className="space-y-4" id="bible-books-selector">
                  <h3 className="text-xs font-bold text-neutral-800 tracking-wider uppercase border-l-4 border-red-600 pl-2">
                    Livros Disponíveis
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3" id="books-grid">
                    {books.map((book) => {
                      const items = PRELOADED_BIBLE.filter((ch) => ch.book === book);
                      return (
                        <button
                          key={book}
                          id={`book-btn-${book}`}
                          onClick={() => handleBookClick(book)}
                          className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-xs hover:border-red-200 hover:bg-neutral-50 flex items-center justify-between text-left transition-all active:scale-95"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="bg-red-50 text-red-600 p-2 rounded-xl">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-neutral-900">{book}</h4>
                              <p className="text-[9px] text-neutral-400 font-medium">
                                {items.length} {items.length === 1 ? "Capítulo" : "Capítulos"}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Versículo do dia banner */}
                  <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 text-white p-5 rounded-3xl shadow-sm space-y-3 relative overflow-hidden" id="verse-of-the-day-card">
                    <div className="absolute right-0 top-0 text-red-600 opacity-20 transform translate-x-3 -translate-y-3">
                      <Sparkles className="w-24 h-24" />
                    </div>
                    <div className="flex items-center space-x-2 text-red-500 font-mono text-[9px] uppercase tracking-widest" id="votd-badge">
                      <Bookmark className="w-3 h-3 fill-red-500" />
                      <span>Versículo em Destaque</span>
                    </div>
                    <p className="text-xs italic text-neutral-200 leading-relaxed font-serif">
                      "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho."
                    </p>
                    <p className="text-[10px] font-bold text-red-400 text-right">— Salmos 119:105</p>
                  </div>
                </div>
              ) : (
                /* ACTIVE CHAPTER READING VIEW */
                <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs space-y-4" id="bible-reader-card">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3" id="reader-controls-header">
                    <button
                      id="btn-back-to-books"
                      onClick={() => setSelectedBook(null)}
                      className="text-neutral-500 hover:text-red-600 flex items-center space-x-1 text-xs font-bold"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Todos Livros</span>
                    </button>
                    <div className="flex items-center space-x-3" id="font-size-adjuster">
                      <Type className="w-3.5 h-3.5 text-neutral-400" />
                      <div className="flex bg-neutral-100 rounded-lg p-0.5" id="font-size-pills">
                        {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                          <button
                            key={sz}
                            id={`fontsize-btn-${sz}`}
                            onClick={() => setFontSize(sz)}
                            className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md ${
                              fontSize === sz ? "bg-white text-red-600 shadow-xs" : "text-neutral-400"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chapter title */}
                  <div className="text-center py-1" id="reader-chapter-title-box">
                    <h3 className="text-base font-black text-neutral-900 tracking-tight">{selectedBook} {selectedChapter}</h3>
                    <div className="w-8 h-0.5 bg-red-600 mx-auto mt-1.5 rounded-full"></div>
                  </div>

                  {/* Chapter body */}
                  <div className={`space-y-4 leading-relaxed text-neutral-700 font-serif ${getFontSizeClass()}`} id="reader-scripture-body">
                    {currentChapterData?.verses.map((verse) => {
                      const isHighlighted = highlightedVerses.includes(verse.number);
                      return (
                        <p 
                          key={verse.number} 
                          id={`verse-p-${verse.number}`}
                          onClick={() => toggleVerseHighlight(verse.number)}
                          className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                            isHighlighted 
                              ? "bg-red-50 text-neutral-900 border-l-2 border-red-600 font-medium" 
                              : "hover:bg-neutral-50"
                          }`}
                          title="Clique para destacar"
                        >
                          <sup className="text-[10px] font-black font-sans text-red-600 mr-1.5 select-none">{verse.number}</sup>
                          {verse.text}
                        </p>
                      );
                    })}
                  </div>

                  <div className="text-center pt-4 border-t border-neutral-100 text-[10px] text-neutral-400 font-medium" id="reader-footer-tips">
                    Toque em qualquer versículo para destacá-lo temporariamente.
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
