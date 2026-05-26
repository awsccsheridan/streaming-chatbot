import { BedrockRuntimeClient, ConverseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import type { LambdaFunctionUrlEvent } from "aws-lambda";

declare const awslambda: {
  streamifyResponse: (
    handler: (event: LambdaFunctionUrlEvent, responseStream: NodeJS.WritableStream) => Promise<void>
  ) => unknown;
  HttpResponseStream: {
    from: (
      responseStream: NodeJS.WritableStream,
      metadata: { statusCode: number; headers: Record<string, string> }
    ) => NodeJS.WritableStream;
  };
};

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "us-east-1" });
const MODEL_ID = process.env.MODEL_ID ?? "amazon.nova-2-lite-v1:0";

function parseMessage(event: LambdaFunctionUrlEvent): string {
  if (!event.body) return "";

  const body = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf-8")
    : event.body;

  const parsed = JSON.parse(body) as { message?: string };
  return parsed.message?.trim() ?? "";
}

export const handler = awslambda.streamifyResponse(
  async (event: LambdaFunctionUrlEvent, rawResponseStream: NodeJS.WritableStream): Promise<void> => {
    const responseStream = awslambda.HttpResponseStream.from(rawResponseStream, {
      statusCode: 200,
      headers: {
         "Content-Type": "text/plain; charset=utf-8",
      },
    });

    try {
      if (event.requestContext.http.method === "OPTIONS") {
        responseStream.end();
        return;
      }

      const userMessage = parseMessage(event);

      if (!userMessage) {
        responseStream.write("Please send a message to start the conversation.");
        responseStream.end();
        return;
      }

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
        responseStream.end();
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
      const message = error instanceof Error ? error.message : "Unknown error";
      responseStream.write(`Something went wrong while streaming from Bedrock: ${message}`);
    } finally {
      responseStream.end();
    }
  }
);
