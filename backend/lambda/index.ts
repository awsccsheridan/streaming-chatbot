import { BedrockRuntimeClient, ConverseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import type { LambdaFunctionURLEvent } from "aws-lambda";

declare const awslambda: {
  streamifyResponse: (
    handler: (event: LambdaFunctionURLEvent, responseStream: NodeJS.WritableStream) => Promise<void>
  ) => unknown;
  HttpResponseStream: {
    from: (
      responseStream: NodeJS.WritableStream,
      metadata: { statusCode: number; headers: Record<string, string> }
    ) => NodeJS.WritableStream;
  };
};

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "us-east-1" });
const MODEL_ID = process.env.MODEL_ID ?? "global.amazon.nova-2-lite-v1:0";

function parseMessage(event: LambdaFunctionURLEvent): string {
  if (!event.body) return "";

  const body = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf-8")
    : event.body;

  const parsed = JSON.parse(body) as { message?: unknown };
  return typeof parsed.message === "string" ? parsed.message.trim() : "";
}

function getHeader(event: LambdaFunctionURLEvent, headerName: string): string | undefined {
  const target = headerName.toLowerCase();
  const match = Object.entries(event.headers ?? {}).find(([key]) => key.toLowerCase() === target);
  return match?.[1] ?? undefined;
}

function createResponseStream(
  event: LambdaFunctionURLEvent,
  rawResponseStream: NodeJS.WritableStream,
  statusCode = 200
): NodeJS.WritableStream {
  const origin = getHeader(event, "origin") ?? "*";

  return awslambda.HttpResponseStream.from(rawResponseStream, {
    statusCode,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      Vary: "Origin",
    },
  });
}

export const handler = awslambda.streamifyResponse(
  async (event: LambdaFunctionURLEvent, rawResponseStream: NodeJS.WritableStream): Promise<void> => {
    let responseStream: NodeJS.WritableStream | undefined;

    try {
      if (event.requestContext.http.method === "OPTIONS") {
        responseStream = createResponseStream(event, rawResponseStream, 204);
        return;
      }

      if (event.requestContext.http.method !== "POST") {
        responseStream = createResponseStream(event, rawResponseStream, 405);
        responseStream.write('Use POST with a JSON body like { "message": "Hello" }.');
        return;
      }

      let userMessage = "";
      try {
        userMessage = parseMessage(event);
      } catch {
        responseStream = createResponseStream(event, rawResponseStream, 400);
        responseStream.write('Invalid JSON. Send a body like { "message": "Hello" }.');
        return;
      }

      if (!userMessage) {
        responseStream = createResponseStream(event, rawResponseStream, 400);
        responseStream.write("Please send a message to start the conversation.");
        return;
      }

      responseStream = createResponseStream(event, rawResponseStream);

      const command = new ConverseStreamCommand({
        modelId: MODEL_ID,
        inferenceConfig: {
          maxTokens: 700,
          temperature: 0.7,
        },
        system: [
          {
            text: "You are a friendly AI personal assistant for an AWS beginner workshop. Explain clearly and keep answers helpful.",
          },
        ],
        messages: [
          {
            role: "user",
            content: [{ text: userMessage }],
          },
        ],
      });

      const bedrockResponse = await client.send(command);

      if (!bedrockResponse.stream) {
        responseStream.write("No streaming response was returned from Amazon Bedrock.");
        return;
      }

      for await (const eventChunk of bedrockResponse.stream) {
        const text = eventChunk.contentBlockDelta?.delta?.text;
        if (text) {
          responseStream.write(text);
        }
      }
    } catch (error) {
      console.error(error);
      responseStream ??= createResponseStream(event, rawResponseStream, 500);
      const message = error instanceof Error ? error.message : "Unknown error";
      responseStream.write(`Something went wrong while streaming from Bedrock: ${message}`);
    } finally {
      responseStream?.end();
    }
  }
);
