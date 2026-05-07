import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-border/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span className="text-xl font-bold text-gradient-emerald">SpendLens</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://credex.money"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-credex-purple-light hover:text-credex-purple transition-colors"
            >
              Powered by Credex
            </a>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Start Free Audit
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Hero Section */}
        <section className="text-center mb-24 animate-slide-up">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-8 animate-in glow-emerald">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Now analyzing over 15+ top AI tools
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
            Stop Overpaying for <br className="hidden sm:block" />
            <span className="text-gradient-emerald">AI Subscriptions</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Most startups waste $1,000+ every month on redundant AI tools and unoptimized tiers. 
            Get a personalized, data-backed savings report in 60 seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 glow-emerald hover:-translate-y-1"
            >
              Start Your Free Audit →
            </Link>
            <p className="text-sm text-muted-foreground sm:ml-4">
              Takes 60 seconds. <br className="sm:hidden" /> No credit card required.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How SpendLens Works</h2>
            <p className="text-muted-foreground">We reverse-engineer AI pricing so you don't have to.</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="glass glass-hover border-border/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-2xl mb-4 glow-emerald">
                  🕵️‍♂️
                </div>
                <h3 className="text-xl font-bold mb-2">Find Redundancies</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Paying for both GitHub Copilot and Cursor? We'll tell you exactly which one to cut based on your team's size and use-case.
                </p>
              </CardContent>
            </Card>

            <Card className="glass glass-hover border-border/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-2xl mb-4">
                  📊
                </div>
                <h3 className="text-xl font-bold mb-2">Tier Optimization</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Stop paying for Enterprise when Pro is enough. We analyze your headcount to recommend the mathematically cheapest tier.
                </p>
              </CardContent>
            </Card>

            <Card className="glass glass-hover border-border/30 glow-purple">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-2xl mb-4">
                  💎
                </div>
                <h3 className="text-xl font-bold mb-2">Credex Integration</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Discover how many thousands of dollars you could save by switching your API usage to discounted Credex credits.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Proof */}
        <section className="mb-32 text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by Technical Founders</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 glass rounded-2xl border border-border/30 text-left relative">
              <span className="text-4xl absolute top-4 right-4 opacity-20">"</span>
              <p className="text-lg italic mb-6 relative z-10 text-foreground/90">
                SpendLens showed us we were overpaying for Claude Pro when the API via Cursor was actually cheaper for our specific workflow. Saved us $600/mo instantly.
              </p>
              <div>
                <p className="font-bold text-gradient-emerald">Sarah Jenkins</p>
                <p className="text-sm text-muted-foreground">CTO at DataFlow (Seed)</p>
              </div>
            </div>
            
            <div className="p-6 glass rounded-2xl border border-border/30 text-left relative">
              <span className="text-4xl absolute top-4 right-4 opacity-20">"</span>
              <p className="text-lg italic mb-6 relative z-10 text-foreground/90">
                The Credex savings estimate blew my mind. We switched our OpenAI API usage over and cut our infrastructure burn by 35% without changing our code.
              </p>
              <div>
                <p className="font-bold text-gradient-purple">Marcus Chen</p>
                <p className="text-sm text-muted-foreground">Founder at NexusAI (Series A)</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Bottom CTA */}
        <section className="text-center py-16 px-6 glass rounded-3xl border border-primary/20 glow-emerald relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
          <h2 className="text-4xl font-black mb-6 relative z-10">Ready to cut your burn rate?</h2>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl text-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-16 px-10 hover:-translate-y-1 relative z-10 shadow-xl shadow-primary/20"
          >
            Start Free Audit Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/20 text-center glass mt-auto">
        <p className="text-sm text-muted-foreground mb-2">
          Built for the Credex community. Data never shared. Audit runs securely in your browser.
        </p>
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} SpendLens · Prices verified weekly ·{" "}
          <a
            href="https://credex.money"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            credex.money
          </a>
        </p>
      </footer>
    </div>
  );
}
