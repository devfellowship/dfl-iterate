// ─────────────────────────────────────────────────────────────────
// dfl-iterate · i18n dictionary — flat dotted-key strings, PT-first (source
// of truth) with a faithful EN translation and a neutral es-419 (Latin
// American) ES translation. Mirrors apps/revera's src/i18n/dict.ts:
// I18N[locale][key], makeT() falls back to the default locale then the raw
// key.
//
// Only the app's own UI chrome (nav, headings, buttons, labels, empty/error
// states, per-locale <title>/meta) lives here. Lesson/activity CONTENT
// (lessons.dummy, activities.dummy, activity-feedback, preview.mock) is
// data-layer content — in production it is API-driven — and is intentionally
// NOT part of the i18n dictionary.
// ─────────────────────────────────────────────────────────────────
export type Locale = "pt" | "en" | "es";

export const LOCALES: Locale[] = ["pt", "en", "es"];
export const DEFAULT_LOCALE: Locale = "pt";

export const I18N: Record<Locale, Record<string, string>> = {
  pt: {
    // ── Language selector ────────────────────────────────
    "lang.name": "Português",
    "lang.pt": "PT",
    "lang.en": "EN",
    "lang.es": "ES",
    "lang.aria": "Idioma",

    // ── Common ───────────────────────────────────────────
    "common.retry": "Tentar de novo",
    "common.close": "Fechar",
    "common.activities": "atividades",
    "common.min": "min",

    // ── Meta (per-locale <title> / description) ──────────
    "meta.home.title": "Iterate | Microlearning para Desenvolvedores",
    "meta.home.description":
      "Aprenda construindo projetos reais. Microatividades que transformam você em um desenvolvedor melhor.",
    "meta.lesson.title": "Lição · Iterate",
    "meta.lesson.description":
      "Aprenda construindo projetos reais, uma microatividade de cada vez.",

    // ── Home (hero + catalog) ────────────────────────────
    "home.brandBy": "by DevFellowship",
    "home.hero.title1": "Aprenda construindo",
    "home.hero.title2": "projetos reais",
    "home.hero.subtitle":
      "Microatividades que transformam você em um desenvolvedor melhor. Cada decisão importa. Cada linha de código tem propósito.",
    "home.chooseTrack": "Escolha uma trilha para começar",
    "home.loading": "Carregando lições...",
    "home.loadError": "Não foi possível carregar as lições.",
    "home.card.start": "Começar",
    "home.footer.madeWith": "Feito com",
    "home.footer.byCommunity": "pela comunidade DevFellowship",
    "home.slots.announcements": "Avisos",
    "home.slots.recentActivity": "Atividade recente",

    // ── Home header drawers ──────────────────────────────
    "header.achievements": "Conquistas",
    "header.notifications": "Notificações",
    "header.preferences": "Preferências",
    "header.prefsLoading": "Carregando preferências…",
    "header.prefsError": "Não foi possível carregar suas preferências.",

    // ── Progress (shared) ────────────────────────────────
    "progress.label": "Progresso",
    "progress.of": "de",
    "progress.completed": "concluído",

    // ── User stats ───────────────────────────────────────
    "stats.livesRemaining": "Vidas restantes",

    // ── User profile ─────────────────────────────────────
    "profile.years": "anos",

    // ── Appearance settings ──────────────────────────────
    "settings.title": "Preferências",
    "settings.theme": "Tema",
    "settings.sounds": "Sons",
    "settings.language": "Idioma",
    "settings.theme.light": "Claro",
    "settings.theme.dark": "Escuro",
    "settings.theme.system": "Sistema",
    "settings.sounds.on": "Ativados",
    "settings.sounds.off": "Desativados",
    "settings.comingSoon": "Edição de preferências disponível em breve.",

    // ── Announcements ────────────────────────────────────
    "announcements.empty": "Nenhum aviso no momento.",

    // ── Recent activity ──────────────────────────────────
    "recentActivity.empty": "Nenhuma atividade recente.",

    // ── Achievements ─────────────────────────────────────
    "achievements.empty": "Nenhuma conquista cadastrada.",
    "achievements.unlockedOn": "Desbloqueada em",
    "achievements.locked": "Bloqueada",

    // ── Daily challenge ──────────────────────────────────
    "challenge.daily": "Desafio do dia",
    "challenge.expiresToday": "Expira hoje",
    "challenge.expiresOn": "Expira em",
    "challenge.view": "Ver desafio",

    // ── Continue learning ────────────────────────────────
    "resume.continueFrom": "Continue de onde parou",
    "resume.lastVisit": "Última visita:",
    "resume.continueLesson": "Continuar lição",

    // ── Notifications ────────────────────────────────────
    "notifications.empty": "Nenhuma notificação.",
    "notifications.unread": "não lidas",

    // ── Leaderboard ──────────────────────────────────────
    "leaderboard.title": "Ranking",
    "leaderboard.unavailable": "Ranking indisponível.",
    "leaderboard.you": "(você)",
    "leaderboard.col.rank": "Posição",
    "leaderboard.col.player": "Jogador",
    "leaderboard.col.xp": "XP",

    // ── 404 ──────────────────────────────────────────────
    "notFound.message": "Ops! Página não encontrada",
    "notFound.home": "Voltar ao início",

    // ── Lesson page (guards) ─────────────────────────────
    "lesson.notFound.title": "Lição não encontrada",
    "lesson.notFound.body": "Esta lição não existe ou foi removida.",
    "lesson.backHome": "Voltar ao início",
    "lesson.backToLessons": "Voltar para lições",
    "lesson.noActivities": "Esta lição ainda não tem atividades cadastradas.",

    // <<< LESSON_INTERIOR_PT >>>
  },
  en: {
    // ── Language selector ────────────────────────────────
    "lang.name": "English",
    "lang.pt": "PT",
    "lang.en": "EN",
    "lang.es": "ES",
    "lang.aria": "Language",

    // ── Common ───────────────────────────────────────────
    "common.retry": "Try again",
    "common.close": "Close",
    "common.activities": "activities",
    "common.min": "min",

    // ── Meta (per-locale <title> / description) ──────────
    "meta.home.title": "Iterate | Microlearning for Developers",
    "meta.home.description":
      "Learn by building real projects. Microactivities that turn you into a better developer.",
    "meta.lesson.title": "Lesson · Iterate",
    "meta.lesson.description":
      "Learn by building real projects, one microactivity at a time.",

    // ── Home (hero + catalog) ────────────────────────────
    "home.brandBy": "by DevFellowship",
    "home.hero.title1": "Learn by building",
    "home.hero.title2": "real projects",
    "home.hero.subtitle":
      "Microactivities that turn you into a better developer. Every decision matters. Every line of code has a purpose.",
    "home.chooseTrack": "Choose a track to get started",
    "home.loading": "Loading lessons...",
    "home.loadError": "Couldn't load the lessons.",
    "home.card.start": "Start",
    "home.footer.madeWith": "Made with",
    "home.footer.byCommunity": "by the DevFellowship community",
    "home.slots.announcements": "Announcements",
    "home.slots.recentActivity": "Recent activity",

    // ── Home header drawers ──────────────────────────────
    "header.achievements": "Achievements",
    "header.notifications": "Notifications",
    "header.preferences": "Preferences",
    "header.prefsLoading": "Loading preferences…",
    "header.prefsError": "Couldn't load your preferences.",

    // ── Progress (shared) ────────────────────────────────
    "progress.label": "Progress",
    "progress.of": "of",
    "progress.completed": "complete",

    // ── User stats ───────────────────────────────────────
    "stats.livesRemaining": "Lives remaining",

    // ── User profile ─────────────────────────────────────
    "profile.years": "years old",

    // ── Appearance settings ──────────────────────────────
    "settings.title": "Preferences",
    "settings.theme": "Theme",
    "settings.sounds": "Sounds",
    "settings.language": "Language",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "settings.theme.system": "System",
    "settings.sounds.on": "Enabled",
    "settings.sounds.off": "Disabled",
    "settings.comingSoon": "Preference editing coming soon.",

    // ── Announcements ────────────────────────────────────
    "announcements.empty": "No announcements right now.",

    // ── Recent activity ──────────────────────────────────
    "recentActivity.empty": "No recent activity.",

    // ── Achievements ─────────────────────────────────────
    "achievements.empty": "No achievements yet.",
    "achievements.unlockedOn": "Unlocked on",
    "achievements.locked": "Locked",

    // ── Daily challenge ──────────────────────────────────
    "challenge.daily": "Daily challenge",
    "challenge.expiresToday": "Expires today",
    "challenge.expiresOn": "Expires on",
    "challenge.view": "View challenge",

    // ── Continue learning ────────────────────────────────
    "resume.continueFrom": "Continue where you left off",
    "resume.lastVisit": "Last visit:",
    "resume.continueLesson": "Continue lesson",

    // ── Notifications ────────────────────────────────────
    "notifications.empty": "No notifications.",
    "notifications.unread": "unread",

    // ── Leaderboard ──────────────────────────────────────
    "leaderboard.title": "Leaderboard",
    "leaderboard.unavailable": "Leaderboard unavailable.",
    "leaderboard.you": "(you)",
    "leaderboard.col.rank": "Rank",
    "leaderboard.col.player": "Player",
    "leaderboard.col.xp": "XP",

    // ── 404 ──────────────────────────────────────────────
    "notFound.message": "Oops! Page not found",
    "notFound.home": "Return to Home",

    // ── Lesson page (guards) ─────────────────────────────
    "lesson.notFound.title": "Lesson not found",
    "lesson.notFound.body": "This lesson doesn't exist or was removed.",
    "lesson.backHome": "Back to home",
    "lesson.backToLessons": "Back to lessons",
    "lesson.noActivities": "This lesson has no activities yet.",

    // <<< LESSON_INTERIOR_EN >>>
  },
  es: {
    // ── Language selector ────────────────────────────────
    "lang.name": "Español",
    "lang.pt": "PT",
    "lang.en": "EN",
    "lang.es": "ES",
    "lang.aria": "Idioma",

    // ── Common ───────────────────────────────────────────
    "common.retry": "Intentar de nuevo",
    "common.close": "Cerrar",
    "common.activities": "actividades",
    "common.min": "min",

    // ── Meta (per-locale <title> / description) ──────────
    "meta.home.title": "Iterate | Microlearning para Desarrolladores",
    "meta.home.description":
      "Aprende construyendo proyectos reales. Microactividades que te convierten en un mejor desarrollador.",
    "meta.lesson.title": "Lección · Iterate",
    "meta.lesson.description":
      "Aprende construyendo proyectos reales, una microactividad a la vez.",

    // ── Home (hero + catalog) ────────────────────────────
    "home.brandBy": "by DevFellowship",
    "home.hero.title1": "Aprende construyendo",
    "home.hero.title2": "proyectos reales",
    "home.hero.subtitle":
      "Microactividades que te convierten en un mejor desarrollador. Cada decisión importa. Cada línea de código tiene un propósito.",
    "home.chooseTrack": "Elige una ruta para empezar",
    "home.loading": "Cargando lecciones...",
    "home.loadError": "No se pudieron cargar las lecciones.",
    "home.card.start": "Empezar",
    "home.footer.madeWith": "Hecho con",
    "home.footer.byCommunity": "por la comunidad DevFellowship",
    "home.slots.announcements": "Avisos",
    "home.slots.recentActivity": "Actividad reciente",

    // ── Home header drawers ──────────────────────────────
    "header.achievements": "Logros",
    "header.notifications": "Notificaciones",
    "header.preferences": "Preferencias",
    "header.prefsLoading": "Cargando preferencias…",
    "header.prefsError": "No se pudieron cargar tus preferencias.",

    // ── Progress (shared) ────────────────────────────────
    "progress.label": "Progreso",
    "progress.of": "de",
    "progress.completed": "completado",

    // ── User stats ───────────────────────────────────────
    "stats.livesRemaining": "Vidas restantes",

    // ── User profile ─────────────────────────────────────
    "profile.years": "años",

    // ── Appearance settings ──────────────────────────────
    "settings.title": "Preferencias",
    "settings.theme": "Tema",
    "settings.sounds": "Sonidos",
    "settings.language": "Idioma",
    "settings.theme.light": "Claro",
    "settings.theme.dark": "Oscuro",
    "settings.theme.system": "Sistema",
    "settings.sounds.on": "Activados",
    "settings.sounds.off": "Desactivados",
    "settings.comingSoon": "La edición de preferencias estará disponible pronto.",

    // ── Announcements ────────────────────────────────────
    "announcements.empty": "No hay avisos por el momento.",

    // ── Recent activity ──────────────────────────────────
    "recentActivity.empty": "No hay actividad reciente.",

    // ── Achievements ─────────────────────────────────────
    "achievements.empty": "No hay logros registrados.",
    "achievements.unlockedOn": "Desbloqueado el",
    "achievements.locked": "Bloqueado",

    // ── Daily challenge ──────────────────────────────────
    "challenge.daily": "Desafío del día",
    "challenge.expiresToday": "Expira hoy",
    "challenge.expiresOn": "Expira el",
    "challenge.view": "Ver desafío",

    // ── Continue learning ────────────────────────────────
    "resume.continueFrom": "Continúa donde lo dejaste",
    "resume.lastVisit": "Última visita:",
    "resume.continueLesson": "Continuar lección",

    // ── Notifications ────────────────────────────────────
    "notifications.empty": "No hay notificaciones.",
    "notifications.unread": "sin leer",

    // ── Leaderboard ──────────────────────────────────────
    "leaderboard.title": "Clasificación",
    "leaderboard.unavailable": "Clasificación no disponible.",
    "leaderboard.you": "(tú)",
    "leaderboard.col.rank": "Posición",
    "leaderboard.col.player": "Jugador",
    "leaderboard.col.xp": "XP",

    // ── 404 ──────────────────────────────────────────────
    "notFound.message": "¡Ups! Página no encontrada",
    "notFound.home": "Volver al inicio",

    // ── Lesson page (guards) ─────────────────────────────
    "lesson.notFound.title": "Lección no encontrada",
    "lesson.notFound.body": "Esta lección no existe o fue eliminada.",
    "lesson.backHome": "Volver al inicio",
    "lesson.backToLessons": "Volver a las lecciones",
    "lesson.noActivities": "Esta lección aún no tiene actividades.",

    // <<< LESSON_INTERIOR_ES >>>
  },
};
