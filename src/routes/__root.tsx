import { HeadContent, Outlet, Scripts, createRootRouteWithContext, useRouter } from '@tanstack/react-router';
import { HeroUIProvider } from '@heroui/system';
import appCss from '../styles.css?url';
import type { NavigateOptions, ToOptions } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AppBar } from '@/common/app-bar';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'simlar-test' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
});

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

function RootComponent() {
  const router = useRouter();

  return (
    <RootDocument>
      <HeroUIProvider
        locale="es-ES"
        navigate={(to, options) => router.navigate({ to, ...options })}
        useHref={(to) => router.buildLocation({ to }).href}
      >
        <main className="h-screen w-screen flex flex-col items-center gap-2">
          <div className="max-w-6xl w-full">
            <AppBar />
          </div>
          <Outlet />
        </main>
      </HeroUIProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
