import { createClient } from "@repo/db/server";
import { Button } from "@repo/ui/components/button";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { PricingCard } from "./component/pricing-card";
import styles from "./page.module.css";

const pricingPlans = [
  {
    title: "Basic",
    price: 5,
    description: "Get started with core features",
    productId: "[some_id]", // keeping original ID
    features: [
      "1 user account",
      "Basic features",
      "Email support",
      "2GB storage"
    ]
  },
  {
    title: "Plus",
    price: 12,
    description: "Perfect for growing needs",
    productId: "prod_yc4gKln1Ki43eyL6rzOTf", // keeping original ID
    isPopular: true,
    features: [
      "5 user accounts",
      "Advanced features",
      "Priority support",
      "15GB storage",
      "Analytics dashboard"
    ]
  },
  {
    title: "Premium",
    price: 29,
    description: "For teams and businesses",
    productId: "[some_id_2]", // keeping original ID
    features: [
      "Unlimited users",
      "All features included",
      "24/7 phone support",
      "100GB storage",
      "Custom branding"
    ]
  }
];

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        {user ? (
          <p className="text-lg">Welcome back, {user.email}</p>
        ) : (
          <Link href="/login">
            <Button className="bg-primary w-full mx-auto text-primary-foreground hover:bg-primary/90">
              Login
            </Button>
          </Link>
        )}
        <section id="pricing" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {pricingPlans.map((plan) => (
                <PricingCard
                  key={plan.productId}
                  {...plan}
                />
              ))}
            </div>
          </div>
        </section>
        <ol>
          <li>
            Get started by editing <code>apps/web/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://turbo.build/repo/docs?utm_source"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turbo.build?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turbo.build →
        </a>
      </footer>
    </div>
  );
}
