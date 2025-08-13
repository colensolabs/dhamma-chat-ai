import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dharma.jpg";
import { Sparkles } from "lucide-react";

const HeroDharma = () => {
  return (
    <header className="container py-14 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-clip-text text-transparent bg-[linear-gradient(135deg,hsl(var(--brand)),hsl(var(--brand-ember)))]">
              Dharma Chat
            </span>
            <span className="block text-foreground">Buddhist AI Companion</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-prose">
            Ask thoughtful questions about Buddhism, meditation, and sutras. A calm, modern chat designed to support your practice.
          </p>
          <div className="flex gap-3">
            <a href="#chat">
              <Button size="lg" variant="hero" className="hover-scale rounded-full px-6">
                <Sparkles className="mr-1" /> Start a Dharma chat
              </Button>
            </a>
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="rounded-2xl overflow-hidden shadow-elegant hover-scale">
            <img
              src={heroImage}
              alt="Minimal zen gradient with subtle lotus lines representing a calm Buddhist tech aesthetic"
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroDharma;
