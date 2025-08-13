import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MessageBubble = ({ role, content }: { role: "user" | "assistant"; content: string }) => {
  const isUser = role === "user";
  return (
    <div className={cn("flex items-start gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-1 text-primary">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-elegant animate-enter",
          isUser
            ? "bg-primary text-primary-foreground ring-1 ring-primary/30"
            : "bg-card text-foreground ring-1 ring-border"
        )}
      >
        {content}
      </div>

      {isUser && (
        <div className="mt-1 text-primary">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
