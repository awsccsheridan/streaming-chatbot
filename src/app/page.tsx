"use client";

import { FormEvent, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterPrompts = [
  "Explain AWS Lambda like I am new to cloud.",
  "Give me a 5-step study plan for learning AWS.",
  "What is response streaming and why does it feel faster?",
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m your streaming AI personal assistant. Ask me anything and watch the answer stream in real time.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  async function sendMessage(messageText?: string) {
    const userMessage = (messageText ?? input).trim();
    if (!userMessage || isStreaming) return;

    const lambdaUrl = process.env.NEXT_PUBLIC_LAMBDA_URL;
    if (!lambdaUrl) {
      setMessages((current) => [
        ...current,
        { role: "user", content: userMessage },
        {
          role: "assistant",
          content:
            "Missing NEXT_PUBLIC_LAMBDA_URL. Add your Lambda Function URL to .env.local or Amplify environment variables.",
        },
      ]);
      return;
    }

    setInput("");
    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    setMessages((current) => [
      ...current,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch(lambdaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) => {
          const updated = [...current];
          const lastMessage = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + chunk,
          };
          return updated;
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setMessages((current) => {
        const updated = [...current];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `Error: ${message}`,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  function stopStreaming() {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur">
        <header className="border-b border-white/10 p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-aws-orange">
                AWS Workshop Project
              </p>
              <h1 className="mt-2 text-2xl font-bold md:text-4xl">
                Streaming AI Personal Assistant
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
                Next.js frontend + Lambda Response Streaming + Amazon Bedrock Nova.
              </p>
            </div>
            <div className="rounded-2xl border border-aws-orange/40 bg-aws-orange/10 px-4 py-3 text-sm text-aws-orange">
              {isStreaming ? "Streaming live..." : "Ready"}
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-5 md:p-6">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 md:text-base ${
                  message.role === "user"
                    ? "bg-aws-orange text-black"
                    : "border border-white/10 bg-slate-950/70 text-slate-100"
                }`}
              >
                {message.content || <span className="animate-pulse">Thinking...</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-5 md:p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isStreaming}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask your assistant something..."
              className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none ring-aws-orange/40 transition placeholder:text-slate-500 focus:ring-4 md:text-base"
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                className="rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-slate-200"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-2xl bg-aws-orange px-5 py-3 font-semibold text-black transition hover:brightness-110"
              >
                Send
              </button>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
