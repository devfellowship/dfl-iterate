export const routes = {
  login: '/login',
  home: '/',
  settings: '/settings',
  entryDetail: '/entries/:id',
  entry: (id: string) => `/entries/${id}`,
} as const;
