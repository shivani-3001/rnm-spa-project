import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { CharacterList } from './components/CharacterList';
import { CharacterDetails } from './components/CharacterDetails';

const rootRoute = createRootRoute({
  component: () => (
    <div className="app">
      <header><h1>Rick & Morty Characters</h1></header>
      <main><Outlet /></main>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CharacterList,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1,
  }),
});

const characterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character/$characterId',
  component: CharacterDetails,
});

const routeTree = rootRoute.addChildren([indexRoute, characterRoute]);
export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router; }
}
