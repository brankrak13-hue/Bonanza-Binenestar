/**
 * Filtro de palabras ofensivas para campos de nombre.
 * Lista expandida con insultos, slurs y groserías en español (México) e inglés.
 * Fuentes: búsqueda web + github.com/words/cuss + conocimiento lingüístico.
 * Permite apodos, nombres propios y expresiones cariñosas.
 */

const BLOCKED_WORDS: string[] = [
  // ── ESPAÑOL — Groserías y variantes ──────────────────────────────
  "puto", "puta", "putas", "putos", "putita", "putito", "putona", "puton",
  "pendejo", "pendeja", "pendejos", "pendejas", "pendejito", "pendejada",
  "cabrón", "cabron", "cabrona", "cabrones", "cabroncito", "cabroncita",
  "chingada", "chingado", "chingados", "chinga", "chingadera", "chingadazo",
  "chíngate", "chingon", "chingona",
  "verga", "vergota", "vergazo", "vergon",
  "polla", "pollita",
  "pito", "pitico",
  "pene",
  "culo", "culito", "culazo", "culear",
  "nalgas", "nalgona", "nalgon",
  "mierda", "mierdita", "mierdero",
  "coño", "coñito", "coñazo",
  "joder", "jodido", "jodida", "jodete",
  "perra", "perro", "perrota", "perrita", "perrazo",
  "zorra", "zorrita", "zorron", "zorrón", "zorrera",
  "golfa", "golfita", "golfaza",
  "puta madre", "hijo de puta", "hdp",
  "maricón", "maricon", "maricona", "mariconzón",
  "joto", "jota", "jotito", "jotería",
  "culero", "culera", "culerito", "culerazo",
  "mamón", "mamon", "mamona", "mamoncito", "mamadas", "mamada",
  "ojete", "ojetes", "ojeton",
  "naco", "naca", "nacote", "nacazo",
  "tarado", "tarada", "taradito",
  "retrasado", "retrasada",
  "mongolo", "mongola", "mongolito", "mongoloide",
  "idiota", "idiotas",
  "imbécil", "imbecil",
  "estúpido", "estupido", "estúpida", "estupida",
  "inútil",
  "bastardo", "bastarda", "bastardito",
  "cabrón",
  "cerdo", "cerda", "cerdito", "cerdita",
  "bruto", "bruta", "brutote",
  "bestia", "bestiazo",
  "tonto", "tonta",
  "burro", "burra",
  "animal",
  "huevón", "huevon", "huevona", "huevones",
  "güebon", "güebona",
  "pinche", "pinches",
  "maldito", "maldita", "malditos",
  "desgraciado", "desgraciada",
  "cagante", "cagada", "cagar",
  "culichi",
  "cholo",
  "wey", "guey", "buey",
  "gey",
  "mugre", "mugroso", "mugrosa",
  "asqueroso", "asquerosa",
  "asco",

  // ── INGLÉS — Slurs, insultos y obscenidades ───────────────────────
  "nigger", "nigga", "nigg",
  "faggot", "fag", "fagg",
  "bitch", "bitches", "bitchy",
  "asshole", "assholes",
  "bastard",
  "cunt", "cunts",
  "dick", "dickhead", "dickface",
  "cock", "cockhead", "cocksucker",
  "fuck", "fucker", "fucking", "fucked", "fuckhead", "fuckface",
  "shit", "shithead", "shitface", "bullshit",
  "whore", "whores",
  "slut", "sluts",
  "retard", "retards",
  "moron", "morons",
  "dumbass", "dumbbitch",
  "jackass",
  "idiot",
  "stupid",
  "dumb",
  "loser",
  "asshat",
  "butthead", "buttface",
  "dipshit",
  "douchebag", "douche",
  "prick",
  "twat",
  "skank",
  "ho", "hoe", "hoes",
  "cracker",
  "chink", "chinks",
  "spic", "spics",
  "kike", "kikes",
  "wetback",
  "gook", "gooks",
  "beaner", "beaners",
  "crackwhore",
  "cumslut",
  "motherfucker", "mofo",
  "sonofabitch",

  // ── SÍMBOLOS / BYPASS COMUNES ─────────────────────────────────────
  "p*ta", "p*to", "c*brón", "v*rga", "m*erda",
  "fu*k", "sh*t", "b*tch",
];

/**
 * Normaliza texto: minúsculas + quita acentos
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[*@$0]/g, (c) =>
      ({ "*": "", "@": "a", "$": "s", "0": "o" }[c] ?? c)
    );
}

/**
 * Retorna true si el texto contiene alguna palabra bloqueada (coincidencia de palabra completa).
 */
export function containsOffensiveWord(text: string): boolean {
  const normalized = normalize(text);
  const words = normalized.split(/[\s,.\-_!?¡¿'"()]+/).filter(Boolean);

  const normalizedBlocked = BLOCKED_WORDS.map(normalize);

  return words.some((word) => normalizedBlocked.includes(word));
}

/**
 * Retorna un mensaje de error si hay palabra ofensiva, null si está limpio.
 */
export function validateName(text: string): string | null {
  if (!text.trim()) return null;
  if (containsOffensiveWord(text)) {
    return "Por favor usa un nombre o apodo apropiado para una tarjeta de regalo 🌸";
  }
  return null;
}
