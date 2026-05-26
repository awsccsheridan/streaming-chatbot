import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function cleanAssistantContent(content: string): string {
  return content.replace(/^"""+\s*|\s*"""+\s*$/g, "").trim();
}

export function MessageContent({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) {
  if (!content) {
    return <span className="animate-pulse">Thinking...</span>;
  }

  if (role === "user") {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-3 mt-4 text-xl font-bold first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 mt-4 text-lg font-bold first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-3 text-base font-semibold first:mt-0">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-6">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        hr: () => <hr className="my-4 border-white/10" />,
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-white/20">{children}</thead>
        ),
        th: ({ children }) => <th className="px-3 py-2 font-semibold">{children}</th>,
        td: ({ children }) => (
          <td className="border-t border-white/10 px-3 py-2 align-top">{children}</td>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-aws-orange underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="rounded bg-black/40 px-1.5 py-0.5 text-sm">{children}</code>
        ),
      }}
    >
      {cleanAssistantContent(content)}
    </ReactMarkdown>
  );
}
