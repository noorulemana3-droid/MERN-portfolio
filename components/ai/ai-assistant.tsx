"use client";

import { Bot, Loader2, Send, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm Noor-Ul-Eman's portfolio assistant. Ask about skills, projects, experience, or career goals.",
    },
  ]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const payload = await response.json();
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            payload.reply ||
            "I couldn't generate a reply right now. Please try again.",
        },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Network error. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white shadow-lg shadow-[var(--glow)] transition hover:opacity-90 focus-ring dark:text-[#07120e]",
          open && "pointer-events-none opacity-0",
        )}
        aria-label="Open AI portfolio assistant"
      >
        <Bot className="h-4 w-4" />
        Ask AI
      </button>

      {open ? (
        <div className="fixed bottom-6 left-6 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                AI Portfolio Assistant
              </p>
              <p className="text-xs text-muted">Powered by Gemini</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 hover:bg-accent-soft focus-ring"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[90%] rounded-2xl px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-accent text-white dark:text-[#07120e]"
                    : "bg-accent-soft text-foreground",
                )}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <p className="inline-flex items-center gap-2 text-xs text-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking...
              </p>
            ) : null}
          </div>

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects..."
              className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-sm focus-ring"
              aria-label="Chat message"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white disabled:opacity-50 dark:text-[#07120e] focus-ring"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
