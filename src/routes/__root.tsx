import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from '@tanstack/react-router'
import { HeroUIProvider } from '@heroui/system'
import { ToastProvider } from '@heroui/toast'
import appCss from '../styles.css?url'
import type { NavigateOptions, ToOptions } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { AppBar } from '@/common/app-bar'
import { Footer } from '@/common/footer'

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
})

declare module '@react-types/shared' {
  interface RouterConfig {
    href: ToOptions['to']
    routerOptions: Omit<NavigateOptions, keyof ToOptions>
  }
}

function RootComponent() {
  const router = useRouter()

  return (
    <RootDocument>
      <HeroUIProvider
        locale="es-ES"
        navigate={(to, options) => router.navigate({ to, ...(options as unknown as Record<string, unknown>) })}
        useHref={(to) => router.buildLocation({ to }).href}
      >
        <main className="min-h-screen w-screen flex flex-col">
          <AppBar />
          <ToastProvider placement="top-center" />
          <div className="w-full max-w-6xl mx-auto px-4 flex-1">
            <Outlet />
          </div>

          <Footer />
        </main>
      </HeroUIProvider>
    </RootDocument>
  )
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
  )
}