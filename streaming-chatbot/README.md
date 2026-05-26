# Build Your First Streaming AI Personal Assistant

This repository is for a beginner-friendly AWS workshop where students build and deploy a real-time streaming AI personal assistant.

The project uses:

- Next.js for the frontend
- TypeScript for frontend and backend code
- AWS CDK for infrastructure as code
- AWS Lambda Function URL for the backend API
- Lambda Response Streaming for real-time output
- Amazon Bedrock with Amazon Nova 2 Lite for AI responses
- AWS Amplify for optional frontend deployment

Repository link:

https://github.com/awsccsheridan/streaming-chatbot

---

## 1. Required Downloads

Install these before the workshop:

VS Code  
https://code.visualstudio.com/

Node.js LTS  
https://nodejs.org/

Git  
https://git-scm.com/downloads

AWS CLI  
https://docs.aws.amazon.com/cli/

AWS CDK  
Install after Node.js using this command:

npm install -g aws-cdk

GitHub Account  
https://github.com/

AWS Account  
https://aws.amazon.com/

---

## 2. Important AWS Region

Use this region for the workshop:

us-east-1

This is important because Amazon Bedrock model access and the Nova model profile are expected to work from this region.

---

## 3. Project Structure

aws-ai-chatbot-workshop/
  src/
    app/
      page.tsx
      layout.tsx
      globals.css

  public/

  .env.example
  .env.local
  package.json
  tsconfig.json

  backend/
    bin/
      backend.ts
    lib/
      chatbot-stack.ts
    lambda/
      index.ts
    cdk.json
    package.json
    tsconfig.json

---

## 4. Clone the Repository

Run this command:

git clone https://github.com/awsccsheridan/streaming-chatbot.git

Then open the folder:

cd streaming-chatbot

---

## 5. Install Frontend Dependencies

From the project root, run:

npm install --legacy-peer-deps

---

## 6. Configure AWS CLI

Run:

aws configure

Enter:

AWS Access Key ID  
AWS Secret Access Key  
Default region name: us-east-1  
Default output format: json

Then verify your AWS account:

aws sts get-caller-identity

---

## 7. Deploy the Backend

Go into the backend folder:

cd backend

Install backend packages:

npm install --legacy-peer-deps

Set the region:

For Mac or Linux:

export AWS_REGION=us-east-1

For Windows PowerShell:

$env:AWS_REGION="us-east-1"

Bootstrap CDK:

npx cdk bootstrap

Deploy:

npx cdk deploy

When asked to approve changes, type:

y

After deployment finishes, copy the output called:

ChatbotApiUrl

It will look like this:

https://example.lambda-url.us-east-1.on.aws/

---

## 8. Connect Frontend to Backend

Go back to the project root:

cd ..

Create a file named:

.env.local

Add this line:

NEXT_PUBLIC_LAMBDA_URL=https://your-lambda-url.lambda-url.us-east-1.on.aws/

Replace the URL with your actual ChatbotApiUrl from CDK.

---

## 9. Run Frontend Locally

From the project root, run:

npm run dev

Open:

http://localhost:3000

Try this prompt:

Explain AWS Lambda like I am new to cloud.

The assistant should respond in real time.

---

## 10. Common Issues and Fixes

Problem: Failed to fetch  
Fix: Check that NEXT_PUBLIC_LAMBDA_URL is correct and restart npm run dev.

Problem: CORS error  
Fix: Confirm Lambda Function URL CORS settings allow http://localhost:3000.

Problem: Model access error  
Fix: Confirm AWS region is us-east-1 and Amazon Bedrock model access is enabled.

Problem: npm install dependency conflict  
Fix: Use npm install --legacy-peer-deps.

Problem: cdk command not found  
Fix: Use npx cdk deploy instead of cdk deploy.

Problem: AWS account not found  
Fix: Run aws configure again or use AWS CloudShell.

---

## 11. Stop or Delete AWS Resources

To delete deployed AWS resources after testing:

cd backend
npx cdk destroy

When asked to confirm, type:

y

This removes the Lambda function, Function URL, IAM role, and CDK-created stack resources.

---

## 12. Workshop Goal

By the end of the workshop, students should understand:

- How a frontend sends a prompt to a backend API
- How AWS Lambda connects to Amazon Bedrock
- How streaming responses improve user experience
- How AWS CDK deploys infrastructure from code
- How to run and deploy a beginner-friendly AI cloud project
