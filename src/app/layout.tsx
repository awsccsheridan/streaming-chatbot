import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streaming AI Personal Assistant",
  description: "AWS Bedrock + Lambda Response Streaming + Next.js workshop project",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
