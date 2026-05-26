"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterPrompts = [
  "Explain Lambda response streaming in simple terms.",
  "What does Amazon Nova 2 Lite do in this workshop?",
  "How does AWS CDK connect the frontend to the backend?",
];

const workshopHighlights = [
  {
    label: "01",
    title: "Next.js frontend",
    description: "A fast browser client with streamed text, starter prompts, and deployment-ready environment config.",
  },
  {
    label: "02",
    title: "AWS CDK infrastructure",
    description: "Infrastructure as Code that creates the Lambda, Function URL, and Bedrock permissions repeatably.",
  },
  {
    label: "03",
    title: "Lambda response streaming",
    description: "Native HTTP streaming so the first words arrive before the full Bedrock answer is finished.",
  },
  {
    label: "04",
    title: "Amazon Nova 2 Lite",
    description: "A current Nova 2 model wired through Amazon Bedrock's ConverseStream API for the real live app.",
  },
];

function removeMarkdown(text: string) {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .trimStart();
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm the live workshop assistant. Ask me about the build and I'll stream the answer in real time.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function appendToLastAssistant(chunk: string) {
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
            "Missing NEXT_PUBLIC_LAMBDA_URL. Copy the CDK ChatbotApiUrl output into .env.local, then restart Next.js.",
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("The browser did not receive a streaming response body.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        appendToLastAssistant(removeMarkdown(decoder.decode(value, { stream: true })));
      }

      const finalText = decoder.decode();
      if (finalText) appendToLastAssistant(removeMarkdown(finalText));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        appendToLastAssistant("\n\n[stopped]");
        return;
      }

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
  }

  function jumpToDemo() {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen bg-[#070b12] px-4 py-6 text-white md:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1420] shadow-2xl shadow-black/40 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="flex flex-col justify-between border-b border-white/10 bg-[linear-gradient(135deg,#172033_0%,#0d1420_46%,#15100a_100%)] p-6 md:p-8 xl:border-b-0 xl:border-r">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-aws-orange">
                AWS GenAI Workshop
              </p>
              <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-6xl">
                Build Your First Streaming AI Personal Assistant
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                A live portfolio project using Next.js, AWS CDK, Lambda Function URLs, response streaming, and Amazon
                Bedrock with Nova 2 Lite.
              </p>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">When</p>
                <p className="mt-1 font-semibold">27 May, 6:00 PM - 8:00 PM</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Where</p>
                <p className="mt-1 font-semibold">B-213 Davis Campus</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Status</p>
                <p className="mt-1 font-semibold text-emerald-300">{isStreaming ? "Streaming live" : "Ready"}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={jumpToDemo}
              className="h-12 rounded-lg bg-aws-orange px-5 text-sm font-bold text-black transition hover:brightness-110"
            >
              Open the live assistant
            </button>
          </div>

          <p className="mt-8 text-sm leading-6 text-slate-400">
            Bring your laptop, an active AWS account, and GitHub. The goal is to leave with a live public URL, not a
            video walkthrough or static mockup.
          </p>
        </aside>

        <div className="grid content-start gap-6 p-6 md:p-8">
          <section className="space-y-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">What you will build</p>
                <h2 className="mt-2 text-2xl font-bold">Production-style architecture in one focused session.</h2>
              </div>
              <span className="w-fit rounded-lg border border-aws-orange/30 bg-aws-orange/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-aws-orange">
                Browser streaming
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {workshopHighlights.map((item) => (
                <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold text-aws-orange">{item.label}</p>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="demo" className="rounded-lg border border-white/10 bg-[#090e17] p-4 shadow-xl shadow-black/30 md:p-5">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Live app</p>
                <h2 className="mt-2 text-2xl font-bold">Ask the workshop assistant</h2>
              </div>
              <span className="w-fit rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                {isStreaming ? "Receiving tokens" : "Ready to send"}
              </span>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={isStreaming}
                  className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-left text-xs text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="h-[360px] space-y-4 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[92%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-6 md:text-base ${
                        message.role === "user"
                          ? "bg-aws-orange text-black"
                          : "border border-white/10 bg-slate-900/90 text-slate-100"
                      }`}
                    >
                      {message.content || <span className="animate-pulse">Thinking...</span>}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about Lambda, Bedrock, CDK, or streaming..."
                  disabled={isStreaming}
                  aria-label="Message for the workshop assistant"
                  className="h-12 rounded-lg border border-white/10 bg-slate-900/80 px-4 text-sm text-white outline-none ring-aws-orange/40 transition placeholder:text-slate-500 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 md:text-base"
                />
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={stopStreaming}
                    className="h-12 rounded-lg bg-white px-5 font-semibold text-black transition hover:bg-slate-200"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="h-12 rounded-lg bg-aws-orange px-5 font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Send
                  </button>
                )}
              </form>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
