import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import MessageBubble from "./MessageBubble";
import AssistantAnswer, { AssistantContent } from "./AssistantAnswer";
import { supabase } from "@/integrations/supabase/client";


type UserMsg = { role: "user"; content: string };
type AssistantMsg = { role: "assistant"; content: AssistantContent };
type Msg = UserMsg | AssistantMsg;
const DharmaChat = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcome: AssistantContent = {
      steps: [
        "Take three slow breaths, allowing the shoulders to soften.",
        "Name what you're feeling without judgment (e.g., 'anger', 'fear', 'sadness').",
        "Set a gentle intention: 'May I meet this wisely and kindly.'",
      ],
      reflection:
        "Sit for one minute, feeling the breath. With each exhale, imagine releasing tension and wishing well for yourself and all involved.",
      scripture: {
        quote: "Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased.",
        explanation: "Begin with the intention of non-harming and goodwill. This steadies the mind so actions arise from clarity rather than reactivity.",
        source: "Dhammapada 5",
      },
    };
    setMessages([{ role: "assistant", content: welcome }]);
  }, []);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");

    try {
      const { data, error } = await supabase.functions.invoke('perplexity-chat', {
        body: { message: text }
      });

      if (error) {
        throw error;
      }

      setMessages((m) => [...m, { role: "assistant", content: data }]);
    } catch (error) {
      console.error('Error calling Perplexity:', error);
      // Fallback response
      const mock: AssistantContent = {
        steps: [
          "Take three deep breaths to center yourself",
          "Acknowledge your feelings without judgment", 
          "Remember that this too shall pass"
        ],
        reflection: "I apologize, but I'm having difficulty connecting to provide guidance right now. Please try again in a moment.",
        scripture: {
          quote: "Patience is the companion of wisdom.",
          explanation: "Sometimes we must wait for the right moment to receive the guidance we seek.",
          source: "Ancient Wisdom"
        }
      };
      setMessages((m) => [...m, { role: "assistant", content: mock }]);
    }
  };

  return (
    <Card className="animate-enter border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-elegant">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl tracking-tight">Dharma Chat</CardTitle>
        <p className="text-sm text-muted-foreground">A calm space to reflect and receive gentle guidance.</p>
      </CardHeader>
      <CardContent>
        <div
          ref={listRef}
          className="h-[48vh] md:h-[56vh] overflow-y-auto space-y-4 pr-1 rounded-xl bg-muted/30 p-3"
          aria-live="polite"
        >
          {messages.map((msg, i) => (
            msg.role === "assistant" ? (
              <AssistantAnswer
                key={i}
                data={(msg as AssistantMsg).content}
              />
            ) : (
              <MessageBubble key={i} role={msg.role} content={(msg as UserMsg).content} />
            )
          ))}
        </div>

        <div className="sticky bottom-0 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 pt-4 -mx-4 px-4">
          <form onSubmit={onSubmit} className="flex items-center gap-2 pb-[max(env(safe-area-inset-bottom),0px)]">
            <Input
              aria-label="Message"
              placeholder="Describe your situation in a few sentences…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="rounded-full h-11 md:h-12 px-5"
            />
            <Button type="submit" className="rounded-full h-11 md:h-12 px-6 min-w-24" aria-label="Send message">
              <SendHorizontal className="mr-1" /> Send
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default DharmaChat;