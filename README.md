# GitHub Developer Analytics Dashboard

## Overview

GitHub Developer Analytics is a responsive React application that looks up a real GitHub username, fetches live data from the GitHub REST API, and turns that data into a developer dashboard.

You can inspect a profile, repository statistics, language distribution, recent public activity, API rate-limit status, and compare two developers side by side. Nothing on the dashboard is hardcoded GitHub data. Every number comes from API responses or from calculations over those responses.

## Features

- Search any public GitHub username and open `/dashboard/:username`
- Profile card: avatar, name, bio, location, website, followers, following, repos, gists, join date
- Overview cards: followers, following, public repository count, account creation date, returned event count, and retrieved stars/forks
- Repository analytics with search, language filter, fork/archive filters, sorting, and expandable metadata
- Donut chart of programming-language distribution from real repository languages
- Activity charts and filterable timeline from recent public GitHub events (not invented contribution counts)
- Honest contribution heatmap fallback when the public REST API cannot provide a calendar
- Developer comparison page with profile/repository metrics and a chart
- Rate-limit card from `GET /rate_limit`
- Loading, empty, error, and cached-data states
- TanStack Query caching, recent username links, and dashboard refresh
- PDF report with loaded profile, repository, chart, and comparison data
- Direct requests for public data; no browser-side GitHub token
- Mobile-friendly layout with a collapsible navbar

## Tech Stack

- HTML5
- CSS3
- JavaScript ES6+
- React.js (functional components and hooks)
- Vite
- Tailwind CSS
- GitHub REST API
- Axios
- React Router DOM
- Recharts
- TanStack Query

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── ProfileCard.jsx
│   ├── StatsCard.jsx
│   ├── RepositoryTable.jsx
│   ├── LanguageChart.jsx
│   ├── ActivityChart.jsx
│   ├── ContributionHeatmap.jsx
│   ├── RateLimitCard.jsx
│   ├── Loading.jsx
│   ├── ErrorMessage.jsx
│   └── EmptyState.jsx
├── pages/
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── Compare.jsx
│   └── NotFound.jsx
├── hooks/
│   ├── useGithubUser.js
│   ├── useGithubRepositories.js
│   ├── useGithubRateLimit.js
│   └── useGithubAnalytics.js
├── services/
│   └── githubApi.js
├── utils/
│   └── dataTransform.js
├── App.jsx
├── main.jsx
└── index.css
```

`App.jsx` only wires layout and routes. Pages compose reusable components. Components render UI. Hooks manage server state. `githubApi.js` is the only place Axios is used.

## GitHub API Integration

All HTTP calls live in `src/services/githubApi.js`. That file creates one Axios instance:

- `baseURL`: `https://api.github.com`
- GitHub JSON accept header
- public, unauthenticated API requests (no GitHub credential is included in the browser)

UI components never import Axios. They call custom hooks, and those hooks call the service functions.

## REST API Endpoints

| Purpose | Method | Endpoint |
| --- | --- | --- |
| Profile | GET | `/users/{username}` |
| Repositories | GET | `/users/{username}/repos` |
| Public events | GET | `/users/{username}/events/public` |
| Rate limit | GET | `/rate_limit` |

Repository results are paginated (100 per page, up to 5 pages). Pagination is sequential because later pages depend on whether the previous page was full. Independent resources (profile + repositories, or two developers) use `Promise.all`.

## Axios

Axios is a promise-based HTTP client. The shared instance attaches the GitHub base URL and headers once. Service functions then do `githubClient.get(...)`, unwrap `data`, and convert failures into student-friendly messages:

- empty search: handled in the form, not Axios
- 404: `GitHub user not found.`
- 403: `GitHub API rate limit exceeded.`
- network: `Unable to connect to GitHub.`
- anything else: `Something went wrong. Please try again.`

## Custom Hooks

| Hook | Responsibility |
| --- | --- |
| `useGithubUser` | Fetch and cache the profile |
| `useGithubRepositories` | Fetch and cache public repositories |
| `useGithubRateLimit` | Fetch remaining GitHub quota |
| `useGithubAnalytics` | Derive stats from repos and load public events |
| `useGithubCompare` | Fetch two developers in parallel |

This keeps pages readable: a dashboard asks hooks for data, then decides which loading/error/success UI to show.

## TanStack Query and Caching

TanStack Query stores server state in memory using query keys:

- `["githubUser", username]`
- `["githubRepositories", username]`
- `["githubEvents", username]`
- `["githubRateLimit"]`
- `["githubCompare", username1, username2]`

Flow for the same username:

1. First visit: React → query function → Axios → GitHub API → cache
2. Second visit within `staleTime` (5 minutes): React → cache

`staleTime` means the data is treated as fresh, so GitHub is not contacted again. `gcTime` keeps unused cache entries around for 30 minutes. That is why analyzing `octocat`, leaving, and coming back feels instant and spends fewer of the 60 unauthenticated requests.

If a later request fails but cache still exists, the UI can keep showing the last good payload and add `Showing cached data.`

## Promise.all

`Promise.all` starts independent promises together and waits until all of them finish. That is faster than:

```js
const user = await getUser(username);
const repositories = await getRepositories(username);
```

because the second request would otherwise wait for the first. The service uses it when requests do **not** depend on each other:

```js
const [user, repositories] = await Promise.all([
  getUser(username),
  getRepositories(username),
]);
```

Compare uses the same idea for two usernames. Pagination does **not** use `Promise.all`, because you only know whether page 2 is needed after page 1 returns.

## Rate Limit Handling

Unauthenticated GitHub REST access is typically 60 requests per hour per IP. The dashboard:

- reads `GET /rate_limit` and shows Limit / Used / Remaining
- maps HTTP 403 to a clear rate-limit message
- keeps the app running (no crash)
- relies on TanStack Query cache to avoid extra calls
- supports an optional token for a higher quota

## Data Transformation

`src/utils/dataTransform.js` owns analytics math so components stay presentational:

- `calculateTotalStars`
- `calculateTotalForks`
- `calculateTotalIssues`
- `calculateLanguageDistribution`
- `getMostStarredRepository`
- `getMostForkedRepository`
- `sortRepositories`
- `filterRepositories`

Language percents are `count / total repositories`, not guessed values.

## Charts

- `LanguageChart.jsx`: Recharts donut/pie chart from `calculateLanguageDistribution`
- `ActivityChart.jsx`: Recharts bar chart of public events grouped by date
- `ContributionHeatmap.jsx`: does **not** draw fake green squares

## API Limitations

The unauthenticated GitHub REST API does **not** expose the contribution calendar used on github.com profile pages. This app therefore:

- never invents commit or contribution counts
- charts recent **public events** instead
- explains the heatmap limitation in the UI

Public events are also incomplete (privacy, pagination, and delay). They are still real API data.

This frontend does not accept GitHub tokens. Vite exposes `VITE_*` values in the browser bundle; any authenticated GitHub access would need a server-side proxy with credentials stored on the server.

## Installation

```bash
npm install
```

No `.env` file or GitHub token is required for public profile data.

## Run

```bash
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Future Improvements

- GitHub GraphQL for fewer round-trips and richer contribution data with authentication
- Server-side token storage so secrets never reach the browser
- Infinite repository virtualization for accounts with thousands of repos
- Dark/light theme toggle
- Export a developer report as PDF
- Save recent searches in `localStorage`

## INTERVIEW EXPLANATION

I built a GitHub Developer Analytics dashboard in React and Vite. A user types a GitHub username, React Router opens `/dashboard/:username`, and custom hooks use TanStack Query plus Axios to load real GitHub REST data. API calls live in a service file so components stay focused on UI. Independent requests run with `Promise.all` to reduce wait time, and TanStack Query caches results by username so repeat visits do not waste the 60 unauthenticated requests GitHub allows each hour. I calculate stars, forks, issues, and language percentages from the actual repository payload, chart public events with Recharts, and I do not fake a contribution heatmap because that calendar is not available on the public REST API. The compare page loads two developers in parallel and highlights the higher metric. Loading, 404, network, and rate-limit errors each have a clear message so the app never crashes on a bad username.

## Interview questions and answers

1. **Why did you use React?**  
   The UI is a tree of reusable views that update when GitHub data arrives. React’s component model and hooks make loading/error/success states straightforward.

2. **Why did you use custom hooks?**  
   Fetching, caching, and error mapping would clutter pages. Hooks like `useGithubUser` give a page `data`, `isLoading`, and `isError` without teaching every page Axios.

3. **Why did you separate API logic from components?**  
   Components should render. If GitHub URLs or headers change, you edit one service. It is also easier to test and to keep Axios out of the UI.

4. **How does Axios work?**  
   Axios sends HTTP requests and returns promises. We configure one instance with `baseURL: https://api.github.com`, then `getUser` calls `githubClient.get('/users/...')` and returns `response.data`.

5. **How does GitHub API fetching work?**  
   Entering `octocat` navigates to `/dashboard/octocat`. Hooks run with `enabled: Boolean(username)`. The service hits `/users/octocat` and `/users/octocat/repos`, then the dashboard maps the JSON into cards and charts.

6. **Why did you use Promise.all?**  
   Profile and repositories do not depend on each other. Starting both at once usually finishes sooner than awaiting them in sequence. Compare does the same for two users.

7. **What is caching?**  
   Caching stores a previous successful response so you can reuse it instead of calling the network again.

8. **How does TanStack Query caching work?**  
   Each query has a key such as `["githubUser", "octocat"]`. The first call fills the cache. Until `staleTime` expires, later components with that key receive cached data.

9. **How did you handle API rate limits?**  
   The rate-limit card reads `/rate_limit`. TanStack Query caching reduces repeat calls. This frontend uses the public unauthenticated quota.

10. **What happens when the username does not exist?**  
    GitHub returns 404. Axios fails, the service throws `GitHub user not found.`, and `ErrorMessage` renders that text.

11. **Why use REST API?**  
    GitHub’s REST endpoints are documented, work without a GraphQL client, and map cleanly to Axios `GET` calls. They are ideal for an intermediate React project.

12. **When would GraphQL be better?**  
    When you need one round-trip for nested fields, or contribution data that REST does not expose well. GraphQL shines with an authenticated GitHub token and a carefully designed query.

13. **How did you calculate language distribution?**  
    `calculateLanguageDistribution` counts `repo.language`, then percent = count / number of repositories.

14. **How did you sort repositories?**  
    `sortRepositories` copies the array and sorts by stars, forks, `updated_at`, or name. The table never mutates the cached query data in place.

15. **How did you filter repositories?**  
    Language options come from unique `repo.language` values. `filterRepositories` keeps matching rows, or all rows when “All Languages” is selected.

16. **How did you handle loading states?**  
    TanStack Query `isLoading` shows `Loading.jsx` with “Loading developer profile...” or “Loading repositories...” so empty cards do not flash.

17. **How did you handle API errors?**  
    Centralized Axios error mapping plus `ErrorMessage`. Empty input is validated before navigation. 404, 403, and network failures each have a specific sentence.

18. **How did you make the application responsive?**  
    Tailwind breakpoints: navbar collapses on mobile, stats become a single column, charts stack, and the repository table scrolls horizontally.

19. **Why did you use Tailwind CSS?**  
    Utility classes keep GitHub-like dark styling in the markup without a large custom CSS file. Spacing, grids, hover, and focus states stay consistent.

20. **What would you improve in the future?**  
    Authenticated GraphQL contributions, a backend proxy for tokens, virtualized tables, saved searches, and a light theme.
