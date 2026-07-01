import { HeadContent, Outlet, Scripts, createRootRouteWithContext, useRouter } from '@tanstack/react-router';
import { HeroUIProvider } from '@heroui/system';
import { ToastProvider } from '@heroui/toast';
import appCss from '../styles.css?url';
import type { NavigateOptions, ToOptions } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AppBar } from '@/common/app-bar';
import { Footer } from '@/common/footer';
import { getCurrentUserFn } from '@/auth/get-current-user.fn';
import { GoogleAnalytics } from '@/analytics/google-analytics';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async () => {
    const usuario = await getCurrentUserFn();
    return { usuario };
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'simlar' },
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
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();

  return (
    <html lang="es">
      <head>
        <HeadContent />
        <GoogleAnalytics />
      </head>
      <body>
        <HeroUIProvider
          locale="es-ES"
          navigate={(to, options) => router.navigate({ to, ...(options as unknown as Record<string, unknown>) })}
          useHref={(to) => router.buildLocation({ to }).href}
        >
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9)), url('/branding/fondo.jpg')",
            }}
          />
          <ToastProvider placement="top-center" />
          <main className="relative z-10 min-h-screen flex flex-col items-center">
            <AppBar />
            <div className="flex-1 bg-white md:w-full lg:max-w-4xl xl:max-w-6xl px-6 my-3">{children}</div>
            <Footer />
          </main>
        </HeroUIProvider>
        <Scripts />
      </body>
    </html>
  );
}
