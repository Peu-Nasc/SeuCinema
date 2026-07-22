/* ============================================================
   CINEVAULT — API
   Camada única de acesso a dados. Hoje devolve dados mock;
   quando a chave do TMDB entrar, só o corpo das funções muda —
   quem consome (home.js, ui.js) não precisa saber a diferença.
   ============================================================ */

const CineVaultAPI = (() => {
  // Preencha com sua chave em https://www.themoviedb.org/settings/api
  // e troque USE_MOCK para false quando estiver pronto.
  const TMDB_KEY = "5a0c0194577a296c1e73d19010a94903";
  const TMDB_BASE = "https://api.themoviedb.org/3";
  const USE_MOCK = false;

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

  /* ---------- Integração TMDB ---------- */

  // Função auxiliar para simplificar as chamadas à API
  async function fetchTMDB(endpoint, params = {}) {
    const url = new URL(`${TMDB_BASE}${endpoint}`);
    url.searchParams.append("api_key", TMDB_KEY);
    url.searchParams.append("language", "pt-BR"); // Traz sinopses e títulos em português
    
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro na API TMDB: ${response.status}`);
    return response.json();
  }

  // Normaliza os dados do TMDB para o formato do CineVault
  const TMDB_GENRES = {
    28: "Ação", 12: "Aventura", 16: "Animação", 35: "Comédia",
    80: "Crime", 18: "Drama", 14: "Fantasia", 878: "Ficção científica",
    36: "História", 53: "Suspense"
  };

  // Substitua a versão antiga do mapTMDBItem por esta:
  function mapTMDBItem(item, defaultType = "filme") {
    const isTV = item.media_type === "tv" || defaultType === "série";
    
    // O TMDB não tem um tipo específico para "Anime", mas podemos deduzir 
    // se for uma série, tiver o gênero Animação (16) e origem no Japão (JP).
    let type = isTV ? "série" : "filme";
    if (isTV && item.origin_country?.includes("JP") && item.genre_ids?.includes(16)) {
      type = "anime";
    }
    
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? date.split("-")[0] : "N/D";
    
    return {
      id: item.id,
      title: title,
      year: year,
      rating: item.vote_average || 0,
      type: type,
      genres: (item.genre_ids || []).map(id => TMDB_GENRES[id]).filter(Boolean),
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
      backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
    };
  }

  async function getHome() {
    if (USE_MOCK) {
      return Promise.resolve(MOCK);
    }

    try {
      // Promise.all executa as requisições em paralelo, deixando o carregamento muito mais rápido
      const [trendingRes, topRatedRes, moviesRes, seriesRes] = await Promise.all([
        fetchTMDB("/trending/all/week"),
        fetchTMDB("/movie/top_rated"),
        fetchTMDB("/discover/movie", { sort_by: "popularity.desc" }),
        fetchTMDB("/discover/tv", { sort_by: "popularity.desc" })
      ]);

      // Pegamos os 10 primeiros resultados de cada categoria
      const trending = trendingRes.results.map(i => mapTMDBItem(i)).slice(0, 10);
      const topRated = topRatedRes.results.map(i => mapTMDBItem(i, "filme")).slice(0, 10);
      const movies = moviesRes.results.map(i => mapTMDBItem(i, "filme")).slice(0, 10);
      const series = seriesRes.results.map(i => mapTMDBItem(i, "série")).slice(0, 10);

      // O Hero (destaque principal) será o 1º item da lista de Em Alta
      const heroItem = trendingRes.results[0];
      const hero = {
        title: heroItem.title || heroItem.name,
        year: (heroItem.release_date || heroItem.first_air_date || "").split("-")[0],
        rating: heroItem.vote_average || 0,
        description: heroItem.overview || "Sinopse indisponível.",
        backdrop: heroItem.backdrop_path ? `https://image.tmdb.org/t/p/w1280${heroItem.backdrop_path}` : ""
      };

      return { hero, trending, topRated, movies, series };
    } catch (error) {
      console.error("Falha ao montar a Home via TMDB:", error);
      throw error;
    }
  }

  async function getProfile() {
    if (USE_MOCK) {
      return Promise.resolve(MOCK_PROFILE);
    }
    // Quando houver conta real, isto virá do Firebase (ex: getDoc(doc(db, "users", uid))).
    throw new Error("Perfil real ainda não configurado — defina USE_MOCK=false só após ligar o Firebase.");
  }

  async function getMovie(id, mediaType = "movie") {
    if (USE_MOCK) {
      const numericId = Number(id);
      return Promise.resolve(MOCK_MOVIE_DETAILS[numericId] || { ...DEFAULT_MOVIE, id: numericId });
    }

    try {
      // Agora o endpoint muda dinamicamente para /movie ou /tv
      const data = await fetchTMDB(`/${mediaType}/${id}`, {
        append_to_response: "credits,similar"
      });

      return {
        id: data.id,
        title: data.title || data.name, // Séries usam "name", Filmes usam "title"
        tagline: data.tagline || "",
        year: (data.release_date || data.first_air_date || "").split("-")[0],
        type: mediaType === "tv" ? "série" : "filme",
        rating: data.vote_average || 0,
        // Filmes têm 'runtime', séries têm 'episode_run_time'
        runtime: data.runtime 
          ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}min` 
          : (data.episode_run_time && data.episode_run_time[0] ? `${data.episode_run_time[0]}min/ep` : "N/D"),
        genres: (data.genres || []).map(g => g.name),
        description: data.overview || "Sem sinopse disponível.",
        backdrop: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : "",
        poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "",
        
        cast: (data.credits?.cast || []).slice(0, 6).map(person => ({
          name: person.name,
          role: person.character,
          photo: person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : ""
        })),
        
        similar: (data.similar?.results || []).slice(0, 8).map(i => mapTMDBItem(i, mediaType === "tv" ? "série" : "filme"))
      };
    } catch (error) {
      console.error("Falha ao buscar detalhes do título:", error);
      throw error;
    }
  }

  async function getCatalog() {
    if (USE_MOCK) return Promise.resolve(buildCatalog());

    try {
      // Buscamos filmes, séries e animes populares para formar nosso catálogo base da tela de busca
      const [movies, series, animes] = await Promise.all([
        fetchTMDB("/discover/movie", { page: 1, sort_by: "popularity.desc" }),
        fetchTMDB("/discover/tv", { page: 1, sort_by: "popularity.desc" }),
        fetchTMDB("/discover/tv", { page: 1, with_genres: 16, with_origin_country: "JP", sort_by: "popularity.desc" })
      ]);

      const catalog = [
        ...movies.results.map(i => mapTMDBItem(i, "filme")),
        ...series.results.map(i => mapTMDBItem(i, "série")),
        ...animes.results.map(i => mapTMDBItem(i, "série")) // A função mapTMDBItem vai transformá-los em 'anime'
      ];

      // Remove itens duplicados pelo ID (caso um anime venha na lista de séries também)
      return Array.from(new Map(catalog.map(item => [item.id, item])).values());
    } catch (error) {
      console.error("Falha ao carregar catálogo:", error);
      throw error;
    }
  }

  // Faz a busca real nos servidores do TMDB
  async function searchCatalog(query) {
    if (USE_MOCK) return Promise.resolve(buildCatalog());

    try {
      // O endpoint /search/multi procura por filmes e séries ao mesmo tempo
      const data = await fetchTMDB("/search/multi", { query: query });
      
      // Filtramos para remover resultados que sejam "pessoas" (atores) e mapeamos para o nosso formato
      const catalog = data.results
        .filter(i => i.media_type === "movie" || i.media_type === "tv")
        .map(i => mapTMDBItem(i));
        
      return catalog;
    } catch (error) {
      console.error("Falha ao buscar no TMDB:", error);
      throw error;
    }
  }

  function findAllById(ids) {
    const pool = [...MOCK.trending, ...MOCK.topRated, ...MOCK.movies, ...MOCK.series];
    return ids.map((id) => pool.find((item) => item.id === id)).filter(Boolean);
  }

return { getHome, getProfile, getMovie, getCatalog, searchCatalog, getLists, getListById, findAllById };
})();
