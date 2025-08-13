import { BadgeCheck, BookOpenText, HeartHandshake } from "lucide-react";


export type AssistantContent = {
  steps: string[];
  reflection: string;
  scripture: {
    quote: string;
    explanation: string;
    source: string;
  };
};

const AssistantAnswer = ({ data }: { data: AssistantContent }) => {
  return (
    <article className="rounded-2xl border bg-card/80 backdrop-blur p-4 md:p-6 space-y-4 md:space-y-5 shadow-elegant animate-enter">
      <section aria-label="Short Reflection" className="space-y-3">
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-5 w-5 text-primary flex-shrink-0" />
          <h3 className="text-base md:text-lg font-semibold tracking-wide">Short Reflection</h3>
        </div>
        <div className="text-base md:text-sm leading-relaxed space-y-3">
          {data.reflection.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section aria-label="Practical Steps" className="space-y-3">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />
          <h3 className="text-base md:text-lg font-semibold tracking-wide">Practical Steps</h3>
        </div>
        <ol className="list-decimal pl-6 space-y-2 text-base md:text-sm">
          {data.steps.map((s, i) => (
            <li key={i} className="leading-relaxed">{s}</li>
          ))}
        </ol>
      </section>

      <section aria-label="Scripture & Explanation" className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpenText className="h-5 w-5 text-primary flex-shrink-0" />
          <h3 className="text-base md:text-lg font-semibold tracking-wide">Scripture & Explanation</h3>
        </div>
        <blockquote className="text-base md:text-sm italic border-l-2 pl-4 py-2 leading-relaxed">"{data.scripture.quote}"</blockquote>
        <div className="text-base md:text-sm leading-relaxed space-y-3">
          {data.scripture.explanation.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Source: {data.scripture.source}</p>
      </section>

    </article>
  );
};

export default AssistantAnswer;