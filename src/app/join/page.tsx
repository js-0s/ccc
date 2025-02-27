import { auth } from '@/server/auth';
import { Header } from '@/components/page/header';
import { Footer } from '@/components/page/footer';
import { SignInButton } from '@/components/page/signin-button';

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
                    Join CCC
                  </h2>
                  <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
                    Create a free account and start interacting with the
                    blockchain.
                  </p>
                  <SignInButton />
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
