/* ============================================================
   CINEVAULT — API
   Camada única de acesso a dados. Hoje devolve dados mock;
   quando a chave do TMDB entrar, só o corpo das funções muda —
   quem consome (home.js, ui.js) não precisa saber a diferença.
   ============================================================ */

const CineVaultAPI = (() => {
  // Preencha com sua chave em https://www.themoviedb.org/settings/api
  // e troque USE_MOCK para false quando estiver pronto.
  const TMDB_KEY = "";
  const TMDB_BASE = "https://api.themoviedb.org/3";
  const USE_MOCK = true;

  /* ---------- Dados mock (placeholders visuais, sem pôster real) ---------- */
  const MOCK = {
    hero: {
      title: "Interstellar",
      year: 2014,
      rating: 9.5,
      description:
        "Um grupo de exploradores usa uma passagem recém-descoberta pelo espaço-tempo para superar os limites da viagem espacial humana e conquistar as distâncias astronômicas em uma jornada interestelar.",
      backdrop: "",
    },
    trending: [
      { id: 1, title: "Duna: Parte Dois", year: 2024, rating: 8.7, type: "filme" },
      { id: 2, title: "Fallout", year: 2024, rating: 8.4, type: "série" },
      { id: 3, title: "Oppenheimer", year: 2023, rating: 8.9, type: "filme" },
      { id: 4, title: "Frieren", year: 2023, rating: 9.1, type: "anime" },
      { id: 5, title: "Shogun", year: 2024, rating: 8.8, type: "série" },
      { id: 6, title: "The Bear", year: 2024, rating: 8.6, type: "série" },
    ],
    topRated: [
      { id: 7, title: "O Poderoso Chefão", year: 1972, rating: 9.2, type: "filme" },
      { id: 8, title: "Breaking Bad", year: 2008, rating: 9.5, type: "série" },
      { id: 9, title: "Attack on Titan", year: 2013, rating: 9.0, type: "anime" },
      { id: 10, title: "Interstellar", year: 2014, rating: 9.5, type: "filme" },
      { id: 11, title: "Chernobyl", year: 2019, rating: 9.4, type: "minissérie" },
      { id: 12, title: "Spirited Away", year: 2001, rating: 8.6, type: "anime" },
    ],
    movies: [
      { id: 13, title: "Poor Things", year: 2023, rating: 8.0, type: "filme" },
      { id: 14, title: "Anatomia de uma Queda", year: 2023, rating: 7.8, type: "filme" },
      { id: 15, title: "Duna", year: 2021, rating: 8.5, type: "filme" },
      { id: 16, title: "Parasita", year: 2019, rating: 8.9, type: "filme" },
      { id: 17, title: "Coringa", year: 2019, rating: 8.4, type: "filme" },
      { id: 18, title: "Whiplash", year: 2014, rating: 8.9, type: "filme" },
    ],
    series: [
      { id: 19, title: "Succession", year: 2018, rating: 9.0, type: "série" },
      { id: 20, title: "The Last of Us", year: 2023, rating: 8.7, type: "série" },
      { id: 21, title: "Dark", year: 2017, rating: 8.8, type: "série" },
      { id: 22, title: "True Detective", year: 2014, rating: 8.9, type: "série" },
      { id: 23, title: "Slow Horses", year: 2022, rating: 8.4, type: "série" },
      { id: 24, title: "Andor", year: 2022, rating: 8.4, type: "série" },
    ],
  };

  const MOCK_PROFILE = {
    name: "Pedro",
    handle: "@pedro",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=cinevault",
    level: 27,
    xp: 6400,
    xpNext: 8000,
    stats: { movies: 347, series: 42, hours: 921, achievements: 18 },
    watched: [
      { id: 13, title: "Poor Things", year: 2023, rating: 8.0, type: "filme" },
      { id: 15, title: "Duna", year: 2021, rating: 8.5, type: "filme" },
      { id: 16, title: "Parasita", year: 2019, rating: 8.9, type: "filme" },
      { id: 19, title: "Succession", year: 2018, rating: 9.0, type: "série" },
      { id: 9, title: "Attack on Titan", year: 2013, rating: 9.0, type: "anime" },
      { id: 11, title: "Chernobyl", year: 2019, rating: 9.4, type: "minissérie" },
      { id: 20, title: "The Last of Us", year: 2023, rating: 8.7, type: "série" },
      { id: 12, title: "Spirited Away", year: 2001, rating: 8.6, type: "anime" },
    ],
    favorites: [
      { id: 10, title: "Interstellar", year: 2014, rating: 9.5, type: "filme" },
      { id: 7, title: "O Poderoso Chefão", year: 1972, rating: 9.2, type: "filme" },
      { id: 8, title: "Breaking Bad", year: 2008, rating: 9.5, type: "série" },
    ],
    watchlist: [
      { id: 1, title: "Duna: Parte Dois", year: 2024, rating: 8.7, type: "filme" },
      { id: 5, title: "Shogun", year: 2024, rating: 8.8, type: "série" },
    ],
    achievements: [
      { title: "Maratonista", desc: "Assistiu 5 episódios em um dia", icon: "flame", unlocked: true },
      { title: "Cinéfilo", desc: "Registrou 100 filmes", icon: "clapperboard", unlocked: true },
      { title: "Crítico", desc: "Avaliou 50 títulos", icon: "star", unlocked: true },
      { title: "Explorador de Gêneros", desc: "Assistiu 10 gêneros diferentes", icon: "compass", unlocked: true },
      { title: "Noturno", desc: "Assistiu algo depois da meia-noite 20 vezes", icon: "moon", unlocked: false },
      { title: "Lenda", desc: "Alcançou o nível 50", icon: "trophy", unlocked: false },
    ],
  };

  const MOCK_MOVIE_DETAILS = {
    10: {
      id: 10,
      title: "Interstellar",
      tagline: "A humanidade nasceu na Terra. Nunca foi para morrer aqui.",
      year: 2014,
      type: "filme",
      rating: 9.5,
      runtime: "2h 49min",
      genres: ["Ficção científica", "Drama", "Aventura"],
      description:
        "Um grupo de exploradores usa uma passagem recém-descoberta pelo espaço-tempo para superar os limites da viagem espacial humana e conquistar as distâncias astronômicas em uma jornada interestelar. Enquanto o tempo na Terra se esgota, a tripulação enfrenta os limites da física e da própria natureza humana.",
      backdrop: "",
      poster: "",
      cast: [
        { name: "Matthew McConaughey", role: "Cooper" },
        { name: "Anne Hathaway", role: "Brand" },
        { name: "Jessica Chastain", role: "Murph" },
        { name: "Michael Caine", role: "Professor Brand" },
        { name: "Matt Damon", role: "Dr. Mann" },
        { name: "Mackenzie Foy", role: "Murph (jovem)" },
      ],
      similar: [7, 8, 9, 11],
    },
  };

  const DEFAULT_MOVIE = {
    id: 0,
    title: "Título não encontrado",
    tagline: "",
    year: "—",
    type: "filme",
    rating: 0,
    runtime: "—",
    genres: [],
    description: "Não encontramos detalhes para este título nos dados de exemplo.",
    backdrop: "",
    poster: "",
    cast: [],
    similar: [],
  };

  /* ---------- Gêneros por id (para filtros da busca) ---------- */
  const GENRES_BY_ID = {
    1: ["Ficção científica", "Aventura"],
    2: ["Ficção científica", "Ação"],
    3: ["Drama", "História"],
    4: ["Fantasia", "Aventura"],
    5: ["Drama", "História"],
    6: ["Drama", "Comédia"],
    7: ["Drama", "Crime"],
    8: ["Drama", "Crime"],
    9: ["Ação", "Fantasia"],
    10: ["Ficção científica", "Drama"],
    11: ["Drama", "História"],
    12: ["Fantasia", "Animação"],
    13: ["Drama", "Comédia"],
    14: ["Drama", "Suspense"],
    15: ["Ficção científica", "Aventura"],
    16: ["Drama", "Suspense"],
    17: ["Drama", "Crime"],
    18: ["Drama", "Música"],
    19: ["Drama"],
    20: ["Ficção científica", "Drama"],
    21: ["Ficção científica", "Suspense"],
    22: ["Crime", "Suspense"],
    23: ["Suspense", "Comédia"],
    24: ["Ficção científica", "Ação"],
  };

  function buildCatalog() {
    const pool = [...MOCK.trending, ...MOCK.topRated, ...MOCK.movies, ...MOCK.series];
    const seen = new Map();
    pool.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.set(item.id, { ...item, genres: GENRES_BY_ID[item.id] || [] });
      }
    });
    return [...seen.values()];
  }

  const MOCK_LISTS = [
    {
      id: "favoritos-de-todos-os-tempos",
      name: "Favoritos de todos os tempos",
      description: "Os títulos que eu revejo sempre que preciso de conforto.",
      icon: "heart",
      itemIds: [10, 7, 8, 17],
    },
    {
      id: "para-noite-de-suspense",
      name: "Para noite de suspense",
      description: "Quando bate vontade de roer unha até o final.",
      icon: "eye",
      itemIds: [16, 14, 21, 22],
    },
    {
      id: "melhores-de-2024",
      name: "Melhores de 2024",
      description: "O que mais me marcou este ano.",
      icon: "sparkles",
      itemIds: [1, 2, 5, 6],
    },
    {
      id: "maratona-de-ficcao-cientifica",
      name: "Maratona de ficção científica",
      description: "Fila pronta pro fim de semana chuvoso.",
      icon: "rocket",
      itemIds: [15, 20, 24, 9],
    },
  ];

  async function getLists() {
    if (USE_MOCK) {
      const catalog = buildCatalog();
      const withItems = MOCK_LISTS.map((list) => ({
        ...list,
        items: list.itemIds.map((id) => catalog.find((i) => i.id === id)).filter(Boolean),
      }));
      return Promise.resolve(withItems);
    }
    // Listas reais viriam do Firebase, por conta (coleção "lists" do usuário).
    throw new Error("Listas reais ainda não configuradas — defina USE_MOCK=false só após ligar o Firebase.");
  }

  async function getListById(id) {
    const lists = await getLists();
    return lists.find((l) => l.id === id) || null;
  }

  async function getHome() {
    if (USE_MOCK) {
      return Promise.resolve(MOCK);
    }
    // Exemplo de integração futura com TMDB:
    // const res = await fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}&language=pt-BR`);
    // const data = await res.json();
    // return mapTmdbResponseToHome(data);
    throw new Error("Integração TMDB ainda não configurada — defina TMDB_KEY e USE_MOCK=false.");
  }

  async function getProfile() {
    if (USE_MOCK) {
      return Promise.resolve(MOCK_PROFILE);
    }
    // Quando houver conta real, isto virá do Firebase (ex: getDoc(doc(db, "users", uid))).
    throw new Error("Perfil real ainda não configurado — defina USE_MOCK=false só após ligar o Firebase.");
  }

  async function getMovie(id) {
    if (USE_MOCK) {
      const numericId = Number(id);
      return Promise.resolve(MOCK_MOVIE_DETAILS[numericId] || { ...DEFAULT_MOVIE, id: numericId });
    }
    // const res = await fetch(`${TMDB_BASE}/movie/${id}?api_key=${TMDB_KEY}&language=pt-BR&append_to_response=credits`);
    // return mapTmdbResponseToMovie(await res.json());
    throw new Error("Integração TMDB ainda não configurada — defina TMDB_KEY e USE_MOCK=false.");
  }

  async function getCatalog() {
    if (USE_MOCK) {
      return Promise.resolve(buildCatalog());
    }
    // Combinação futura de endpoints TMDB (discover/movie, discover/tv) paginados.
    throw new Error("Integração TMDB ainda não configurada — defina TMDB_KEY e USE_MOCK=false.");
  }

  function findAllById(ids) {
    const pool = [...MOCK.trending, ...MOCK.topRated, ...MOCK.movies, ...MOCK.series];
    return ids.map((id) => pool.find((item) => item.id === id)).filter(Boolean);
  }

  return { getHome, getProfile, getMovie, getCatalog, getLists, getListById, findAllById };
})();
