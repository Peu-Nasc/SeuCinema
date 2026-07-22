# CineVault

**Sua história através do cinema.**

Biblioteca pessoal para registrar tudo que você já assistiu: filmes, séries,
animes, documentários, curtas, especiais, reality shows, shows e minisséries.

## Como abrir

Basta abrir `index.html` no navegador. Não há build step — é HTML, CSS e JS puros.

## Estrutura

```
cinevault/
├── assets/
│   ├── css/
│   │   ├── variables.css   → tokens: cor, tipografia, espaçamento, sombra
│   │   ├── base.css        → reset e regras globais
│   │   ├── components.css  → navbar, card, botões, hero, badges, estados
│   │   └── home.css        → regras só da index.html
│   └── js/
│       ├── api.js          → camada de dados (hoje mock, pronta pra TMDB)
│       ├── ui.js           → funções de renderização (cards, toast, ícones)
│       ├── home.js         → inicializador da página inicial
│       ├── profile.js      → inicializador do perfil
│       ├── movie.js        → inicializador da página de detalhes
│       ├── search.js       → inicializador da busca e filtros
│       ├── lists.js        → inicializador das listas
│       ├── settings.js     → inicializador das configurações
│       └── app.js          → comum a todas as páginas (navbar, busca)
├── pages/
│   ├── profile.html        → perfil, estatísticas, conquistas
│   ├── movie.html           → detalhes de um título, elenco, avaliação
│   ├── search.html          → busca com filtros de tipo/gênero/nota
│   ├── lists.html           → listas personalizadas (visão geral + detalhe)
│   └── settings.html        → conta, preferências, notificações, privacidade
├── index.html
└── README.md
```

## Design System

Cores, fontes e espaçamentos vivem **só** em `variables.css`. Nenhum
componente deve usar um hex ou px solto — sempre `var(--token)`.

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#090B10` | fundo da página |
| `--card` | `#151A22` | fundo de cards |
| `--card-hover` | `#202938` | hover de cards |
| `--accent-yellow` | `#FFD54F` | marca, avaliação, destaque |
| `--accent-blue` | `#5CAEFF` | links, séries |
| `--accent-green` | `#37D67A` | sucesso, "assistido" |
| `--accent-red` | `#F44336` | erro, remover |

Tipografia: **Poppins** para títulos, **Inter** para corpo. Ícones: **Lucide**.

## Ligar dados reais (TMDB)

Em `assets/js/api.js`:

1. Crie uma chave em https://www.themoviedb.org/settings/api
2. Preencha `TMDB_KEY`
3. Troque `USE_MOCK` para `false`
4. Implemente a chamada `fetch` (exemplo já comentado no arquivo)

Nada em `ui.js`, `home.js` ou `index.html` precisa mudar — eles só
conhecem o formato de dados que `CineVaultAPI.getHome()` devolve.

## Próximas etapas sugeridas

Todas as páginas do roteiro original já existem. O que resta é ligar dados reais:

1. Migrar de dados mock → TMDB → Firebase (persistência de conta e autenticação)
2. Formulário real de "criar lista" (hoje o botão só mostra um aviso)
3. Salvar avaliações, anotações e configurações de verdade (hoje só atualizam a UI, sem persistir)
