import { ArrowRight, History, Settings, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const examples = [
  "I had an argument with my sibling and feel guilty.",
  "My job is stressful and I'm losing patience.",
  "How do I balance ambition with non-attachment?",
];

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <header className="container py-8 md:py-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Dharma Guide</h1>
            <p className="mt-2 text-muted-foreground max-w-prose">
              Describe your situation in a few sentences. You'll receive practical steps, a short reflection, and a scripture quote with explanation.
            </p>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <User className="mr-2 h-4 w-4" />
                {user.email}
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </header>

      <section className="container pb-4">
        <div className="grid gap-3">
          {examples.map((ex, i) => (
            <Link
              key={i}
              to="/chat"
              className="block rounded-lg border bg-card px-4 py-3 hover-scale"
              aria-label={`Example ${i + 1}: ${ex}`}
            >
              <span className="text-sm text-foreground">{ex}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button asChild size="lg">
            <Link to="/chat" aria-label="Start chat">
              Start Chat <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/history" aria-label="View chat history">
              <History className="mr-2 h-4 w-4" /> History
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/settings" aria-label="Open settings">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Index;