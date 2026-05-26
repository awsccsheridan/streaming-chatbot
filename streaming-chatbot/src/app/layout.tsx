import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Build Your First Streaming AI Personal Assistant",
  description: "A workshop demo using Next.js, AWS CDK, Lambda response streaming, and Amazon Bedrock Nova 2 Lite.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
