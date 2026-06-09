import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function LegalPage({ title, lastUpdated, children }: { title: string; lastUpdated?: string; children: React.ReactNode }) {
  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-5xl tracking-wide text-foreground">{title}</h1>
        {lastUpdated && <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>}
        <div className="prose prose-invert mt-8 max-w-none space-y-4 text-muted-foreground [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:tracking-wide [&_h2]:text-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_a]:text-primary">
          {children}
        </div>
      </div>
    </PageLayout>
  );
}
