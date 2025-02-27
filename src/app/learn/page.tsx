import Link from 'next/link';
import { auth } from '@/server/auth';
import { Header } from '@/components/page/header';
import { Footer } from '@/components/page/footer';

export default async function Home() {
  const session = await auth();
  return (
    <>
      <div className="w-full h-full" theme-mode="light" data-theme="light">
        <div className="w-full h-full flex flex-row">
          <div className="flex-1 h-full overflow-y-auto">
            <Header session={session} />
            <div className="bg-gradient-to-t from-zinc-50 to-white dark:from-zinc-950 dark:to-black relative">
              <div className="absolute bg-[url('/_convertfast/gradient-bg-0.svg')] bg-auto bg-no-repeat z-0 inset-0 top-0 bottom-0 left-0 right-0 grayscale"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-5xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 drop-shadow-md">
                    Learn
                  </h2>
                  <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
                    CCC requires multiple technologies to master. This guide
                    might bring you ideas.
                  </p>
                  <div className="flex flex-row justify-center gap-4">
                    <Link href="https://nextjs.org/">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                        NextJS
                      </button>
                    </Link>
                    <Link href="https://nexusjs.org/">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                        Nexus
                      </button>
                    </Link>
                    <Link href="https://www.typescriptlang.org/">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                        Typescript
                      </button>
                    </Link>
                    <Link href="https://www.keplr.app/">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                        Keplr Wallet
                      </button>
                    </Link>
                    <Link href="https://ui.shadcn.com/">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                        shadcn/ui
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
