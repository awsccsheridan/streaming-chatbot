# Build Your First Streaming AI Personal Assistant

This is the starter repository for a beginner-friendly AWS workshop where students build a real-time AI personal assistant using:

- Next.js frontend
- AWS CDK
- AWS Lambda Function URL
- Lambda Response Streaming
- Amazon Bedrock with Amazon Nova 2 Lite
- AWS Amplify frontend deployment

## Repository Structure

```txt
aws-ai-chatbot-workshop/
├── src/                    # Next.js frontend code
│   └── app/
│       ├── page.tsx         # Chatbot UI + streaming reader
│       ├── layout.tsx
│       └── globals.css
├── public/
├── .env.example
├── package.json             # Frontend dependencies
├── tsconfig.json
│
└── backend/                 # AWS CDK backend project
    ├── bin/
    │   └── backend.ts       # CDK app entry point
    ├── lib/
    │   └── chatbot-stack.ts # Lambda + Bedrock + Function URL
    ├── lambda/
    │   └── index.ts         # Streaming Lambda handler
    ├── cdk.json
    ├── package.json
    └── tsconfig.json
```

## Before You Start

🛑 **CHECKPOINT 1: AWS Region**

Make sure your AWS Console and CLI region are set to:

```bash
us-east-1
```

Nova 2 Lite access is expected in `us-east-1` for this workshop.

## Backend Setup

Go into the backend folder:

```bash
cd backend
npm install
```

Bootstrap CDK if this is your first time using CDK in the account:

```bash
npx cdk bootstrap
```

Deploy the backend:

```bash
npx cdk deploy
```

🛑 **CHECKPOINT 2: Copy the Lambda URL**

After deployment, CDK prints an output called:

```txt
ChatbotApiUrl
```

Copy this URL. You will use it in the frontend as `NEXT_PUBLIC_LAMBDA_URL`.

## Frontend Local Setup

Go back to the root folder:

```bash
cd ..
npm install
```

Create your local environment file:

```bash
cp .env.example .env.local
```

Paste your deployed Lambda Function URL:

```env
NEXT_PUBLIC_LAMBDA_URL=https://your-lambda-function-url.lambda-url.us-east-1.on.aws/
```

Start the frontend locally:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

🛑 **CHECKPOINT 3: Test Streaming**

Ask the assistant:

```txt
Explain AWS Lambda like I am new to cloud.
```

You should see the response appear gradually in the browser.

## Deploy Frontend With AWS Amplify

1. Push this repo to GitHub.
2. Open AWS Amplify.
3. Create a new app from GitHub.
4. Select the repo.
5. Add this environment variable:

```env
NEXT_PUBLIC_LAMBDA_URL=your ChatbotApiUrl value
```

6. Deploy the app.

🛑 **CHECKPOINT 4: Final Test**

Open the Amplify public URL and test the chatbot again.

## Common Issues

### Bedrock access denied
Make sure your AWS account has access to Amazon Bedrock and the Nova model in `us-east-1`.

### Frontend says Lambda URL is missing
Make sure `NEXT_PUBLIC_LAMBDA_URL` exists in `.env.local` locally or Amplify environment variables in production.

### CORS error
Make sure the deployed Lambda Function URL is the exact value from the CDK output.

### CDK bootstrap error
Run:

```bash
npx cdk bootstrap
```

Then deploy again.

## Workshop Presenter Notes

Recommended live flow:

1. Explain architecture.
2. Deploy backend using CDK.
3. Copy `ChatbotApiUrl`.
4. Add it to frontend environment variables.
5. Run frontend locally.
6. Show streaming response.
7. Deploy frontend through Amplify.
8. Final public demo.
