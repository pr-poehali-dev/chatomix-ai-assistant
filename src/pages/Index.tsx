import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "hero", label: "Главная" },
  { id: "audience", label: "Для кого" },
  { id: "workspace", label: "Рабочее пространство" },
  { id: "projects", label: "Настройка проектов" },
];

const DEMO_MESSAGES = [
  { role: "client", text: "Здравствуйте, я уже третий раз звоню по поводу возврата товара, никто не может помочь..." },
  { role: "operator", text: "Добрый день! Я понимаю вашу ситуацию. Давайте я сразу посмотрю ваш заказ." },
  { role: "client", text: "Заказ номер 48271, оформлен 12 марта. Товар пришёл с браком." },
  { role: "operator", text: "Вижу ваш заказ. Позвольте уточнить — вы хотите возврат денег или замену товара?" },
  { role: "client", text: "Мне нужен возврат денег, и побыстрее. Я уже устал ждать." },
];

const AI_HINTS = [
  { delay: 1200, text: "Клиент эмоционально напряжён. Используйте эмпатию в начале ответа.", tag: "Тон", color: "#f59e0b" },
  { delay: 3500, text: "Запросите данные заказа — уточните номер и дату оформления.", tag: "Действие", color: "#1a8cff" },
  { delay: 6000, text: "Уточните предпочтения: возврат средств или обмен товара.", tag: "Уточнение", color: "#1a8cff" },
  { delay: 8800, text: "Готовый ответ: «Понимаю вашу ситуацию. Оформляю возврат прямо сейчас — средства поступят в течение 3–5 рабочих дней.»", tag: "Подсказка AI", color: "#22c55e" },
];

const AUDIENCE = [
  {
    icon: "Headphones",
    title: "Call-центры",
    desc: "Снижение времени обработки обращений и повышение качества ответов операторов с первого звонка.",
    stats: "−35% времени на обращение",
  },
  {
    icon: "LifeBuoy",
    title: "Службы поддержки",
    desc: "Единая база знаний и мгновенные подсказки для решения нестандартных ситуаций без escalation.",
    stats: "×2.4 скорость решения",
  },
  {
    icon: "Building2",
    title: "Корпоративные отделы",
    desc: "HR, юридические и финансовые отделы — автоматические подсказки по регламентам и процедурам.",
    stats: "97% соблюдение регламентов",
  },
  {
    icon: "ShoppingCart",
    title: "Розничные сети",
    desc: "Операторы интернет-магазинов получают подсказки по ассортименту, доставке и политике возвратов.",
    stats: "NPS +18 пунктов",
  },
];

const FEATURES = [
  { icon: "Zap", label: "Анализ в реальном времени", desc: "Транскрибация и анализ диалога без задержек" },
  { icon: "Brain", label: "AI-подсказки", desc: "Готовые фразы на основе базы знаний проекта" },
  { icon: "Database", label: "База знаний", desc: "Загружайте документы, FAQ, скрипты продаж" },
  { icon: "BarChart3", label: "Аналитика", desc: "Статистика по операторам, темам и качеству" },
  { icon: "Shield", label: "Контроль качества", desc: "Мониторинг соблюдения стандартов обслуживания" },
  { icon: "Users", label: "Команды", desc: "Разные проекты и роли для каждого отдела" },
];

function WorkspaceDemo() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [visibleHints, setVisibleHints] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startDemo = () => {
    setVisibleMessages(0);
    setVisibleHints([]);
    setRunning(true);
    setStarted(true);
    timers.current.forEach(clearTimeout);
    timers.current = [];

    DEMO_MESSAGES.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleMessages(i + 1);
        if (i === DEMO_MESSAGES.length - 1) setRunning(false);
      }, 800 + i * 1800);
      timers.current.push(t);
    });

    AI_HINTS.forEach((hint, i) => {
      const t = setTimeout(() => {
        setVisibleHints((prev) => [...prev, i]);
      }, hint.delay);
      timers.current.push(t);
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4 w-full">
      <div className="surface-card rounded-lg overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <span className="status-dot" />
          <span className="text-xs font-mono-custom text-muted-foreground">LIVE · Звонок #38421</span>
          <span className="ml-auto text-xs font-mono-custom" style={{ color: "var(--cm-text-dim)" }}>04:23</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {!started && (
            <div className="flex-1 flex items-center justify-center">
              <button
                onClick={startDemo}
                className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-all"
                style={{ background: "var(--cm-blue)", color: "#fff" }}
              >
                <Icon name="Play" size={15} />
                Запустить демо
              </button>
            </div>
          )}
          {DEMO_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
            <div
              key={i}
              className="animate-fade-in flex flex-col gap-1"
              style={{ alignItems: msg.role === "client" ? "flex-start" : "flex-end" }}
            >
              <span className="text-xs" style={{ color: "var(--cm-text-dim)" }}>
                {msg.role === "client" ? "Клиент" : "Оператор"}
              </span>
              <div
                className="px-3 py-2 rounded-lg text-sm max-w-[85%]"
                style={{
                  background: msg.role === "client" ? "rgba(255,255,255,0.05)" : "var(--cm-blue-dim)",
                  border: `1px solid ${msg.role === "client" ? "rgba(255,255,255,0.08)" : "var(--cm-blue-border)"}`,
                  color: "#e2e8f0",
                  lineHeight: "1.5",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {running && visibleMessages > 0 && (
            <div className="flex gap-1 items-center px-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 5, height: 5,
                    background: "var(--cm-text-dim)",
                    animation: `pulse-slow 1.2s ease-in-out ${i * 0.2}s infinite`,
                    display: "inline-block",
                  }}
                />
              ))}
            </div>
          )}
        </div>
        {started && !running && (
          <div className="px-4 py-2 border-t border-border flex justify-end">
            <button
              onClick={startDemo}
              className="text-xs flex items-center gap-1 transition-opacity hover:opacity-80"
              style={{ color: "var(--cm-text-dim)" }}
            >
              <Icon name="RotateCcw" size={12} />
              Повторить
            </button>
          </div>
        )}
      </div>

      <div className="surface-card rounded-lg overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Icon name="Sparkles" size={13} style={{ color: "var(--cm-blue)" }} />
          <span className="text-xs font-mono-custom text-muted-foreground">AI-ПОДСКАЗКИ</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {!started && (
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <p className="text-sm" style={{ color: "var(--cm-text-dim)" }}>
                Запустите демо-разговор — AI начнёт формировать подсказки в реальном времени
              </p>
            </div>
          )}
          {visibleHints.map((hintIdx) => {
            const hint = AI_HINTS[hintIdx];
            return (
              <div
                key={hintIdx}
                className="animate-fade-in rounded-lg p-3 flex flex-col gap-2"
                style={{
                  background: `${hint.color}0d`,
                  border: `1px solid ${hint.color}30`,
                }}
              >
                <span
                  className="text-xs font-medium font-mono-custom px-2 py-0.5 rounded self-start"
                  style={{ background: `${hint.color}20`, color: hint.color }}
                >
                  {hint.tag}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "#c8d4e8" }}>
                  {hint.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProjectSettings() {
  const [activeTab, setActiveTab] = useState("knowledge");
  const files = [
    { name: "FAQ_возврат_товаров.pdf", size: "124 KB", date: "12 мар 2026", status: "indexed" },
    { name: "Скрипт_продаж_v3.docx", size: "87 KB", date: "08 мар 2026", status: "indexed" },
    { name: "Регламент_поддержки.pdf", size: "245 KB", date: "01 мар 2026", status: "indexed" },
    { name: "Прайс-лист_2026.xlsx", size: "56 KB", date: "28 фев 2026", status: "processing" },
  ];

  const tabs = [
    { id: "knowledge", label: "База знаний", icon: "Database" },
    { id: "model", label: "Модель AI", icon: "Brain" },
    { id: "team", label: "Команда", icon: "Users" },
  ];

  return (
    <div className="surface-card rounded-lg overflow-hidden">
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative"
            style={{
              color: activeTab === tab.id ? "var(--cm-blue)" : "var(--cm-text-dim)",
              borderBottom: activeTab === tab.id ? "2px solid var(--cm-blue)" : "2px solid transparent",
              background: "transparent",
            }}
          >
            <Icon name={tab.icon} fallback="Circle" size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "knowledge" && (
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-medium text-foreground">Загруженные документы</h4>
              <p className="text-xs mt-0.5" style={{ color: "var(--cm-text-dim)" }}>
                AI анализирует эти файлы для формирования подсказок
              </p>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all hover:opacity-90"
              style={{ background: "var(--cm-blue)", color: "#fff" }}
            >
              <Icon name="Plus" size={12} />
              Добавить файл
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
              >
                <Icon name="FileText" size={16} style={{ color: "var(--cm-blue)", flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{file.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--cm-text-dim)" }}>
                    {file.size} · {file.date}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded font-mono-custom"
                  style={{
                    background: file.status === "indexed" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                    color: file.status === "indexed" ? "var(--cm-success)" : "var(--cm-warning)",
                  }}
                >
                  {file.status === "indexed" ? "Проиндексирован" : "Обработка..."}
                </span>
                <button style={{ color: "var(--cm-text-dim)" }} className="hover:opacity-60 transition-opacity">
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "model" && (
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "var(--cm-text-dim)" }}>
              МОДЕЛЬ АНАЛИЗА
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["GPT-4o", "Claude 3.5", "Gemini Pro", "Llama 3"].map((model, i) => (
                <button
                  key={model}
                  className="px-3 py-2.5 rounded-lg text-sm text-left transition-all"
                  style={{
                    background: i === 0 ? "var(--cm-blue-dim)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${i === 0 ? "var(--cm-blue-border)" : "var(--border)"}`,
                    color: i === 0 ? "var(--cm-blue)" : "var(--cm-text-dim)",
                  }}
                >
                  {model}
                  {i === 0 && <span className="ml-2 text-xs opacity-60">● Активна</span>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "var(--cm-text-dim)" }}>
              ЯЗЫК ИНТЕРФЕЙСА ОПЕРАТОРА
            </label>
            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
            >
              <span className="text-sm text-foreground">Русский</span>
              <Icon name="ChevronDown" size={14} style={{ color: "var(--cm-text-dim)" }} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "var(--cm-text-dim)" }}>
              СТИЛЬ ПОДСКАЗОК
            </label>
            <div className="flex gap-2">
              {["Краткий", "Подробный", "Только фразы"].map((style, i) => (
                <button
                  key={style}
                  className="px-3 py-1.5 rounded text-xs transition-all"
                  style={{
                    background: i === 0 ? "var(--cm-blue-dim)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${i === 0 ? "var(--cm-blue-border)" : "var(--border)"}`,
                    color: i === 0 ? "var(--cm-blue)" : "var(--cm-text-dim)",
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="p-5 flex flex-col gap-3">
          {[
            { name: "Анна Соколова", role: "Администратор", avatar: "АС", online: true },
            { name: "Дмитрий Орлов", role: "Оператор", avatar: "ДО", online: true },
            { name: "Мария Петрова", role: "Оператор", avatar: "МП", online: false },
            { name: "Сергей Иванов", role: "Оператор", avatar: "СИ", online: true },
          ].map((member, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                style={{ background: "var(--cm-blue-dim)", color: "var(--cm-blue)", border: "1px solid var(--cm-blue-border)" }}
              >
                {member.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{member.name}</p>
                <p className="text-xs" style={{ color: "var(--cm-text-dim)" }}>{member.role}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: member.online ? "var(--cm-success)" : "var(--cm-text-dim)" }}
                />
                <span className="text-xs" style={{ color: "var(--cm-text-dim)" }}>
                  {member.online ? "Онлайн" : "Офлайн"}
                </span>
              </div>
            </div>
          ))}
          <button
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all hover:opacity-80 mt-1"
            style={{ border: "1px dashed var(--cm-blue-border)", color: "var(--cm-blue)", background: "transparent" }}
          >
            <Icon name="UserPlus" size={14} />
            Добавить участника
          </button>
        </div>
      )}
    </div>
  );
}

export default function Index() {
  const [activeNav, setActiveNav] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map((n) => document.getElementById(n.id));
      const scrollY = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveNav(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#0a0d14", color: "#e2e8f0" }}>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(10,13,20,0.92)",
          borderBottom: "1px solid rgba(26,140,255,0.1)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: "var(--cm-blue)", boxShadow: "0 0 12px rgba(26,140,255,0.4)" }}
          >
            <Icon name="MessageSquare" size={14} style={{ color: "#fff" }} />
          </div>
          <span className="font-semibold text-sm tracking-wide text-white">ChatoMix</span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-mono-custom hidden sm:inline"
            style={{ background: "rgba(26,140,255,0.1)", color: "var(--cm-blue)", border: "1px solid var(--cm-blue-border)" }}
          >
            v1.0
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-3 py-1.5 rounded text-xs font-medium transition-all"
              style={{
                color: activeNav === item.id ? "var(--cm-blue)" : "var(--cm-text-dim)",
                background: activeNav === item.id ? "var(--cm-blue-dim)" : "transparent",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-medium transition-all hover:opacity-90"
            style={{ background: "var(--cm-blue)", color: "#fff" }}
          >
            Попробовать бесплатно
          </button>
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "var(--cm-text-dim)" }}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={18} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed top-12 left-0 right-0 z-40 p-4 flex flex-col gap-1"
          style={{ background: "rgba(10,13,20,0.98)", borderBottom: "1px solid var(--border)" }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-4 py-2.5 rounded text-sm text-left transition-all"
              style={{
                color: activeNav === item.id ? "var(--cm-blue)" : "#c8d4e8",
                background: activeNav === item.id ? "var(--cm-blue-dim)" : "transparent",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* HERO */}
      <section
        id="hero"
        className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden grid-bg"
      >
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(26,140,255,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 font-mono-custom"
            style={{
              background: "var(--cm-blue-dim)",
              border: "1px solid var(--cm-blue-border)",
              color: "var(--cm-blue)",
            }}
          >
            <span className="status-dot" style={{ width: 6, height: 6 }} />
            AI-АССИСТЕНТ ДЛЯ ОПЕРАТОРОВ
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            <span className="text-gradient">Правильный ответ</span>
            <br />
            <span className="text-white">в нужный момент</span>
          </h1>

          <p className="text-base md:text-lg mb-8 max-w-xl mx-auto" style={{ color: "#8899bb", lineHeight: "1.7" }}>
            ChatoMix анализирует разговор с клиентом в реальном времени и мгновенно формирует подсказки на основе вашей базы знаний — готовые фразы, которые оператор может озвучить сразу.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => scrollTo("workspace")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-90 glow-blue-sm"
              style={{ background: "var(--cm-blue)", color: "#fff" }}
            >
              <Icon name="Play" size={15} />
              Смотреть демо
            </button>
            <button
              onClick={() => scrollTo("audience")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                background: "var(--cm-surface)",
                border: "1px solid var(--border)",
                color: "#c8d4e8",
              }}
            >
              Узнать подробнее
              <Icon name="ArrowRight" size={14} />
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full">
          {[
            { value: "−35%", label: "Время обработки" },
            { value: "×2.4", label: "Скорость решения" },
            { value: "97%", label: "Соблюдение регламентов" },
            { value: "<2 сек", label: "Время подсказки" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-lg px-4 py-3 text-center"
              style={{ background: "var(--cm-surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-xl font-bold font-mono-custom mb-0.5" style={{ color: "var(--cm-blue)" }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "var(--cm-text-dim)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOR WHO */}
      <section id="audience" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-xs font-mono-custom tracking-widest mb-3 inline-block" style={{ color: "var(--cm-blue)" }}>
            ДЛЯ КОГО
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Для тех, кто работает с клиентами
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#8899bb" }}>
            ChatoMix подходит для любой команды, где качество коммуникации напрямую влияет на результат
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {AUDIENCE.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-5 transition-all"
              style={{ background: "var(--cm-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--cm-blue-dim)", border: "1px solid var(--cm-blue-border)" }}
                >
                  <Icon name={item.icon} fallback="Circle" size={18} style={{ color: "var(--cm-blue)" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#8899bb" }}>{item.desc}</p>
                  <span
                    className="text-xs font-mono-custom px-2 py-1 rounded"
                    style={{ background: "rgba(34,197,94,0.1)", color: "var(--cm-success)", border: "1px solid rgba(34,197,94,0.2)" }}
                  >
                    {item.stats}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-6"
          style={{ background: "var(--cm-surface)", border: "1px solid var(--border)" }}
        >
          <h3 className="text-sm font-medium mb-5 text-center" style={{ color: "var(--cm-text-dim)" }}>
            КЛЮЧЕВЫЕ ВОЗМОЖНОСТИ ПЛАТФОРМЫ
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <Icon name={f.icon} fallback="Circle" size={16} style={{ color: "var(--cm-blue)", flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p className="text-sm font-medium text-white">{f.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--cm-text-dim)" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSPACE */}
      <section
        id="workspace"
        className="px-6 py-20"
        style={{ background: "rgba(26,140,255,0.02)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-xs font-mono-custom tracking-widest mb-3 inline-block" style={{ color: "var(--cm-blue)" }}>
              РАБОЧЕЕ ПРОСТРАНСТВО
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Интерфейс оператора
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#8899bb" }}>
              Слева — диалог с клиентом в реальном времени. Справа — AI формирует подсказки на основе базы знаний.
            </p>
          </div>
          <WorkspaceDemo />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Транскрибация", desc: "Речь клиента и оператора переводится в текст без задержек" },
              { step: "02", title: "Анализ AI", desc: "Модель анализирует контекст и ищет ответы в базе знаний" },
              { step: "03", title: "Подсказка", desc: "Оператор получает готовую фразу и может сразу её озвучить" },
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-xl p-5 flex gap-4"
                style={{ background: "var(--cm-surface)", border: "1px solid var(--border)" }}
              >
                <span className="text-2xl font-bold font-mono-custom flex-shrink-0" style={{ color: "var(--cm-blue-border)" }}>
                  {step.step}
                </span>
                <div>
                  <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                  <p className="text-sm" style={{ color: "#8899bb" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT SETTINGS */}
      <section id="projects" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <span className="text-xs font-mono-custom tracking-widest mb-3 inline-block" style={{ color: "var(--cm-blue)" }}>
            НАСТРОЙКА ПРОЕКТОВ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Гибкая конфигурация под ваш бизнес
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#8899bb" }}>
            Загружайте документы, выбирайте AI-модель, управляйте командой — для каждого отдела свой проект
          </p>
        </div>

        <ProjectSettings />

        <div
          className="mt-8 rounded-xl p-8 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(26,140,255,0.08) 0%, rgba(10,13,20,0) 100%)",
            border: "1px solid var(--cm-blue-border)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(26,140,255,0.08) 0%, transparent 70%)" }}
          />
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">
            Готовы запустить ChatoMix в своём call-центре?
          </h3>
          <p className="text-sm mb-6 relative z-10" style={{ color: "#8899bb" }}>
            Начните с бесплатного проекта — подключите базу знаний и запустите первый диалог за 15 минут
          </p>
          <button
            className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-90 glow-blue-sm"
            style={{ background: "var(--cm-blue)", color: "#fff" }}
          >
            <Icon name="Rocket" size={15} />
            Начать бесплатно
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: "var(--cm-blue)" }}>
            <Icon name="MessageSquare" size={10} style={{ color: "#fff" }} />
          </div>
          <span className="text-sm font-semibold text-white">ChatoMix</span>
        </div>
        <p className="text-xs" style={{ color: "var(--cm-text-dim)" }}>
          © 2026 ChatoMix. AI-ассистент для профессиональной поддержки клиентов.
        </p>
        <div className="flex gap-4 text-xs" style={{ color: "var(--cm-text-dim)" }}>
          <button className="hover:opacity-80 transition-opacity">Документация</button>
          <button className="hover:opacity-80 transition-opacity">Поддержка</button>
          <button className="hover:opacity-80 transition-opacity">Политика</button>
        </div>
      </footer>
    </div>
  );
}