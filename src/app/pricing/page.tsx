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
              <div className="absolute bg-[url('/_convertfast/gradient-bg-0.svg')] bg-auto bg-no-repeat z-0 inset-0 top-0 bottom-0 left-0 right-0 grayscale"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-5xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 drop-shadow-md">
                    Pricing
                  </h2>
                  <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
                    Experience the freedom of coding, a robust software solution
                    that empowers you to take control of your wallet. With CCC,
                    you can check your own infrastructure, ensuring complete
                    ownership and flexibility.
                  </p>
                  <div className="flex flex-row justify-center gap-4">
                    <Link href="https://github.com/js-0s/ccc">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                        Get The Source
                      </button>
                    </Link>
                    <Link href="#hosted">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8">
                        Hosted
                      </button>
                    </Link>
                  </div>
                </div>
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
                      src="/images/pricing-1.jpg"
                    />
                  </div>
                  <div className="order-2 md:order-2">
                    <a id="hosted">
                      <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Hosted.
                      </h2>
                    </a>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                      Hosted by us, this software solution is available as a
                      service, providing users with seamless access and
                      management while we take care of all the infrastructure,
                      maintenance, and support, allowing you to focus on what
                      matters most to your business.
                    </p>
                    <div className="mt-4">
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Ease of Use
                          </p>
                          <p className="text-md text-muted-foreground">
                            The hosted version of the software eliminates the
                            need for complex installations and maintenance,
                            allowing you to get started quickly and focus on
                            your core business activities without the hassle of
                            managing infrastructure.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Scalability
                          </p>
                          <p className="text-md text-muted-foreground">
                            With the hosted version, you can easily scale your
                            usage as your needs grow, ensuring that you have the
                            resources and support necessary to accommodate
                            increased demand without the burden of managing
                            additional hardware.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Automatic Updates and Security
                          </p>
                          <p className="text-md text-muted-foreground">
                            Choosing the hosted version means you benefit from
                            automatic updates and security patches, ensuring
                            that you always have access to the latest features
                            and protection against vulnerabilities without any
                            manual intervention.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-4 md:my-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-center">
                  <div className="order-2 md:order-1">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                      Plans
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                      CCC offers different plans depending on your usage.
                    </p>
                    <div className="mt-4">
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Free
                          </p>
                          <p className="text-md text-muted-foreground">
                            Read the source and use it for further interviews.
                          </p>
                          <p className="text-md text-muted-foreground">0 USD</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Grow
                          </p>
                          <p className="text-md text-muted-foreground">
                            Request support for your projects on a
                            infrequent/unreliable contract.
                          </p>
                          <p className="text-md text-muted-foreground">
                            100 USD per hour
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
                        <div className="space-y-1">
                          <p className="text-md font-medium leading-none">
                            Permanent
                          </p>
                          <p className="text-md text-muted-foreground">
                            Almost exclusive and longterm engagement.
                          </p>
                          <p className="text-md text-muted-foreground">
                            120.000 USD pa
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
                      src="/images/pricing-2.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <section className="bg-gradient-to-t from-zinc-50 to-white dark:from-zinc-950 relative">
              <div className="absolute bg-[url('/_convertfast/gradient-bg-0.svg')] bg-auto bg-no-repeat inset-0 top-0 bottom-0 left-0 right-0 grayscale bg-center"></div>
              <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 relative z-10">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                    Ready to Start Developing?
                  </h2>
                  <p className="mt-6 text-xl leading-8 opacity-90 text-muted-foreground">
                    Join our community and experience the benefits.
                  </p>
                  <p className="mt-6 text-xl leading-8 opacity-90 text-muted-foreground">
                    Try for free, then decide if you want to self-host or
                    upgrade the plan.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/join">
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
