import Link from 'next/link';
import Image from 'next/image';

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
              <div className="absolute bg-auto bg-no-repeat z-0 inset-0 top-0 bottom-0 left-0 right-0 grayscale"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-5xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 drop-shadow-md">
                    Cosmos Wallet Interaction
                  </h2>
                  <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
                    Join a community of keplr-users that have multiple tokens in
                    their wallet.
                  </p>
                  <div className="flex flex-row justify-center gap-4">
                    <Link href="/join">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                        Join Now
                      </button>
                    </Link>
                    <Link href="/learn">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8">
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>
                <Image
                  alt="ai generated: icon that features web3 smart contract along with a wallet challenge. Feature green as color as its ecologically important, should work as large image as well as a favicon"
                  width={832}
                  height={448}
                  src="/images/home-1.jpg"
                  className="mt-8 max-w-full md:max-w-5xl mx-auto rounded-md shadow-2xl border sm:mt-12 block dark:hidden"
                />
              </div>
            </div>
            <div className="py-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
              <div className="my-4 flex flex-col gap-8">
                <div className="my-4 md:my-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-center">
                  <div className="order-1 md:order-1">
                    <Image
                      alt="ai generated"
                      width={448}
                      height={576}
                      className="w-full max-w-md rounded-xl shadow-xl ring-1 ring-gray-400/10"
                      src="/images/home-2.jpg"
                    />
                  </div>
                  <div className="order-2 md:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                      What is CCC?
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                      CCC was implemented as a job-interview challenge and to
                      learn the interacion with web3-libraries. CCC is short for
                      (3xC) Web<b>3</b> <b>C</b>oding <b>C</b>hallenge.
                    </p>
                    <div className="mt-4">
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            React Powered Framework (Next15)
                          </p>
                          <p className="text-md text-muted-foreground">
                            Uses the latest nextjs with a prisma & graphql
                            integration.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Keplr Wallet Integration
                          </p>
                          <p className="text-md text-muted-foreground">
                            Integrates Keplr wallet sdk to connect to
                            user-wallet when the browser extension is installed
                            and has access to the testnet (redwood) or
                            production network and other tokens as well.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Cosmos Bank Module
                          </p>
                          <p className="text-md text-muted-foreground">
                            Query the on-chain balance for the selected chain.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-4 md:my-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-center">
                  <div className="order-2 md:order-1">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                      Why Choose CCC?
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                      Coding was done without even being asked to and in order
                      to learn the available documentation and terminology.
                    </p>
                    <div className="mt-4">
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Earn Money
                          </p>
                          <p className="text-md text-muted-foreground">
                            Enjoy the benefits of a developer hacking away and
                            pick the pieces that fit your company best.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Pay Money
                          </p>
                          <p className="text-md text-muted-foreground">
                            Make the developer happy with challenging tasks and
                            pay a competitive invoice monthly, preferably
                            monthly.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Convenient Platform
                          </p>
                          <p className="text-md text-muted-foreground">
                            Our user-friendly interface makes organizing chains
                            a breeze.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <Image
                      alt="ai generated"
                      width={448}
                      height={576}
                      className="w-full max-w-md rounded-xl shadow-xl ring-1 ring-gray-400/10"
                      src="/images/home-3.jpg"
                    />
                  </div>
                </div>
                <div className="my-4 md:my-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-center">
                  <div className="order-1 md:order-1">
                    <Image
                      alt="ai generated"
                      width={448}
                      height={576}
                      className="w-full max-w-md rounded-xl shadow-xl ring-1 ring-gray-400/10"
                      src="/images/home-4.jpg"
                    />
                  </div>
                  <div className="order-2 md:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                      How to Use CCC
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                      Follow these simple steps to start evaluating CCC.
                    </p>
                    <div className="mt-4">
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            1. Sign Up
                          </p>
                          <p className="text-md text-muted-foreground">
                            Create your account and join the CCC community.
                            Creating a account is easy: Just enter any email and
                            password and get access to the user-interface. There
                            is no way to recover a lost password.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            2. Check The List
                          </p>
                          <p className="text-md text-muted-foreground">
                            Does the app connect to keplr? Does it display the
                            currency stored in the selected chain (and do the
                            requested conversion)? Can you send Tokens to the
                            given address? Does the app work in mobile and in
                            desktop resolution? Does the app display error
                            messages?
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            3. Send real payment
                          </p>
                          <p className="text-md text-muted-foreground">
                            Connect a real wallet and send real tokens using the
                            suggestions in the UI.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="bg-gradient-to-t from-zinc-50 to-white dark:from-zinc-950 relative">
              <div className="absolute bg-auto bg-no-repeat inset-0 top-0 bottom-0 left-0 right-0 grayscale bg-center"></div>
              <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 relative z-10">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                    Ready to Start Developing?
                  </h2>
                  <p className="mt-6 text-xl leading-8 opacity-90 text-muted-foreground">
                    Meet up using the available contact information, provide a
                    reasonable task along with a guarantee to pay for its
                    fulfilment.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/learn">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full sm:w-auto">
                        Get Started
                      </button>
                    </Link>
                  </div>
                  <p className="mt-6 text-sm opacity-75 text-muted-foreground"></p>
                </div>
              </div>
            </section>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
