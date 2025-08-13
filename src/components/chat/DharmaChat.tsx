import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import MessageBubble from "./MessageBubble";

interface Msg { role: "user" | "assistant"; content: string }

const DharmaChat = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "Welcome. How can I support your practice today?",
      },
    ]);
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

    // TODO: Replace with your agentic backend API call
    // Example:
    // const res = await fetch("/api/dharma-chat", { method: "POST", body: JSON.stringify({ message: text }) })
    // const data = await res.json()
    // setMessages((m) => [...m, { role: "assistant", content: data.reply }])

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Consider a few calm breaths. What is arising right now—can it be met with kindness?",
        },
      ]);
    }, 800);
  };

  return (
    <Card className="animate-enter">
      <CardHeader>
        <CardTitle className="text-2xl">Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={listRef}
          className="h-[48vh] md:h-[56vh] overflow-y-auto space-y-4 pr-1"
          aria-live="polite"
        >
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-4 flex gap-2">
          <Input
            aria-label="Message"
            placeholder="Ask about meditation, sutras, or daily practice…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" className="min-w-24" aria-label="Send message">
            <SendHorizontal className="mr-1" /> Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DharmaChat;
