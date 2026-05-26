import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodeLambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";

export class ChatbotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const chatbotFunction = new nodeLambda.NodejsFunction(this, "StreamingChatbotFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: "lambda/index.ts",
      handler: "handler",
      timeout: cdk.Duration.seconds(60),
      memorySize: 1024,
      bundling: {
        minify: true,
        sourceMap: true,
        target: "node20",
      },
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
        MODEL_ID: "global.amazon.nova-2-lite-v1:0",
      },
    });

    chatbotFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
        resources: ["*"],
      })
    );

    const functionUrl = chatbotFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["Content-Type"],
        maxAge: cdk.Duration.seconds(300),
      },
    });

    new cdk.CfnOutput(this, "ChatbotApiUrl", {
      value: functionUrl.url,
      description: "Copy this value into NEXT_PUBLIC_LAMBDA_URL for the frontend.",
    });
  }
}
