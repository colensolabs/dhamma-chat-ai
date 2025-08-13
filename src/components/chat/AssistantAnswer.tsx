import { BadgeCheck, BookOpenText, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AssistantContent = {
  steps: string[];
  reflection: string;
  scripture: {
    quote: string;
    explanation: string;
    source: string;
  };
};

const AssistantAnswer = ({ data, onAskTeacher }: { data: AssistantContent; onAskTeacher?: () => void }) => {
  return (
    <article className="rounded-lg border bg-card p-4 md:p-5 space-y-4 animate-enter">
      <section aria-label="Practical Steps" className="space-y-2">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold tracking-wide">Practical Steps</h3>
        </div>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          {data.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      <section aria-label="Short Reflection" className="space-y-2">
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold tracking-wide">Short Reflection</h3>
        </div>
        <p className="text-sm leading-relaxed">{data.reflection}</p>
      </section>

      <section aria-label="Scripture & Explanation" className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpenText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold tracking-wide">Scripture & Explanation</h3>
        </div>
        <blockquote className="text-sm italic border-l-2 pl-3">“{data.scripture.quote}”</blockquote>
        <p className="text-sm">{data.scripture.explanation}</p>
        <p className="text-xs text-muted-foreground">Source: {data.scripture.source}</p>
      </section>

      <div className="pt-1">
        <Button variant="outline" className="w-full" onClick={onAskTeacher} aria-label="Ask a Teacher">
          Ask a Teacher
        </Button>
      </div>
    </article>
  );
};

export default AssistantAnswer;
