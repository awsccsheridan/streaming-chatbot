# Build Your First Streaming AI Personal Assistant

Welcome to the **Build Your First Streaming AI Personal Assistant** workshop.

This is a beginner-friendly AWS hands-on workshop where students will build and deploy a real-time AI personal assistant using:

- Next.js frontend
- TypeScript
- AWS CDK
- AWS Lambda Function URL
- Lambda Response Streaming
- Amazon Bedrock with Amazon Nova
- AWS Amplify frontend deployment

By the end of this workshop, you will have a working AI assistant that streams responses in real time.

---

## 1. What You Will Build

The project flow:

```txt
User
↓
Next.js Frontend
↓
Lambda Function URL
↓
AWS Lambda
↓
Amazon Bedrock Nova Model
↓
Streaming Response Back to Browser
```

The user types a message in the frontend.  
The frontend sends the message to AWS Lambda.  
Lambda sends the message to Amazon Bedrock.  
Bedrock generates the AI response.  
Lambda streams the response back to the browser.

---

## 2. Required Accounts

### GitHub Account

Create a GitHub account here:

```txt
https://github.com/
```

You need GitHub to access the project repository and connect the frontend to AWS Amplify.

### AWS Account

Create an AWS account here:

```txt
https://aws.amazon.com/
```

During AWS account setup, AWS may ask for:

- Email address
- Password
- Phone verification
- Payment card
- Support plan

For the support plan, choose the free/basic option.

Important: AWS may ask for a payment method even if you are using free-tier services.

---

## 3. Required Software Downloads

Install these before the workshop.

### 1. Visual Studio Code

Download:

```txt
https://code.visualstudio.com/
```

VS Code is the code editor we will use.

After installing, open VS Code once to make sure it works.

---

### 2. Node.js LTS

Download:

```txt
https://nodejs.org/
```

Choose the **LTS version**.

After installing Node.js, open a terminal and run:

```bash
node -v
```

Then run:

```bash
npm -v
```

If both commands show version numbers, Node.js and npm are installed correctly.

Example:

```txt
node v20.x.x
npm 10.x.x
```

---

### 3. Git

Download:

```txt
https://git-scm.com/downloads
```

After installing Git, open a terminal and run:

```bash
git --version
```

If it shows a version number, Git is installed correctly.

---

### 4. AWS CLI

Download:

```txt
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
```

After installing AWS CLI, open a new terminal and run:

```bash
aws --version
```

If it shows a version number, AWS CLI is installed correctly.

---

### 5. AWS CDK

AWS CDK is used to deploy cloud infrastructure using code.

After Node.js is installed, run:

```bash
npm install -g aws-cdk
```

Then check:

```bash
cdk --version
```

If this does not work, you can also use CDK through:

```bash
npx cdk
```

---

## 4. Create AWS Access Keys

You need access keys so your terminal can deploy resources to AWS.

Important: Do not share your access key or secret key with anyone.

### Steps

1. Log in to AWS Console:

```txt
https://aws.amazon.com/console/
```

2. Search for:

```txt
IAM
```

3. Open **IAM**.

4. In the left sidebar, click:

```txt
Users
```

5. Click your IAM user.

If you do not have an IAM user yet, create one.

For workshop simplicity, your user needs enough permission to deploy:

- Lambda
- IAM roles
- CloudFormation
- Amazon Bedrock
- Amplify

Your instructor may ask you to use an account/user with administrator permissions for the workshop.

6. Open the tab:

```txt
Security credentials
```

7. Scroll to:

```txt
Access keys
```

8. Click:

```txt
Create access key
```

9. Choose:

```txt
Command Line Interface (CLI)
```

10. Create the access key.

AWS will show:

- Access Key ID
- Secret Access Key

Copy both somewhere safe temporarily.

Important: The secret key is shown only once.

---

## 5. Configure AWS CLI

Open your terminal.

Run:

```bash
aws configure
```

It will ask:

```txt
AWS Access Key ID:
AWS Secret Access Key:
Default region name:
Default output format:
```

Enter:

```txt
AWS Access Key ID: paste your access key
AWS Secret Access Key: paste your secret key
Default region name: us-east-1
Default output format: json
```

Now check if your AWS CLI is connected:

```bash
aws sts get-caller-identity
```

If you see your AWS account information, your CLI is working.

---

## 6. Important AWS Region

Use this region for the entire workshop:

```txt
us-east-1
```

Before deploying, always confirm your AWS Console region is:

```txt
US East (N. Virginia) / us-east-1
```

This is important because Amazon Bedrock and the Nova model are expected to work from this region.

---

## 7. Enable Amazon Bedrock Model Access

Before running the AI assistant, enable model access in Amazon Bedrock.

### Steps

1. Open AWS Console.
2. Search:

```txt
Amazon Bedrock
```

3. Open Amazon Bedrock.
4. Make sure the region is:

```txt
us-east-1
```

5. In the left sidebar, go to:

```txt
Model access
```

6. Click:

```txt
Manage model access
```

7. Enable access for the Amazon Nova model used in this workshop.

Depending on your AWS console, the model name may appear as:

- Amazon Nova Lite
- Amazon Nova 2 Lite

8. Save changes.

If Bedrock model access is not enabled, the chatbot may fail even if deployment succeeds.

---

## 8. Repository Link

Workshop repository:

```txt
https://github.com/awsccsheridan/streaming-chatbot
```

---

## 9. Clone the Repository

Open terminal.

Go to the folder where you want to store the project.

Example:

```bash
cd Desktop
```

Clone the repository:

```bash
git clone https://github.com/awsccsheridan/streaming-chatbot.git
```

Go into the project folder:

```bash
cd streaming-chatbot
```

Open the project in VS Code:

```bash
code .
```

If `code .` does not work, open VS Code manually and open the `streaming-chatbot` folder.

---

## 10. Repository Structure

```txt
streaming-chatbot/
├── src/                       # Next.js frontend code
│   └── app/
│       ├── page.tsx            # Chatbot UI and streaming reader
│       ├── layout.tsx
│       └── globals.css
│
├── public/
├── .env.example
├── package.json                # Frontend dependencies
├── tsconfig.json
│
└── backend/                    # AWS CDK backend project
    ├── bin/
    │   └── backend.ts          # CDK app entry point
    ├── lib/
    │   └── chatbot-stack.ts    # Lambda, Bedrock permissions, Function URL
    ├── lambda/
    │   └── index.ts            # Streaming Lambda handler
    ├── cdk.json
    ├── package.json            # Backend dependencies
    └── tsconfig.json
```

Frontend code is at the root.  
Backend code is inside the `backend` folder.

---

## 11. Install Frontend Dependencies

From the project root, run:

```bash
npm install --legacy-peer-deps
```

This installs the frontend dependencies.

---

## 12. Run Frontend Locally First

Still from the project root, run:

```bash
npm run dev
```

Open this in your browser:

```txt
http://localhost:3000
```

At this point, the frontend may open, but the chatbot will not fully work yet because the backend has not been deployed.

Stop the frontend for now by pressing:

```txt
Ctrl + C
```

---

## 13. Deploy the Backend

Go into the backend folder:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install --legacy-peer-deps
```

Set the AWS region.

For Mac or Linux:

```bash
export AWS_REGION=us-east-1
```

For Windows PowerShell:

```powershell
$env:AWS_REGION="us-east-1"
```

Bootstrap CDK:

```bash
npx cdk bootstrap
```

This prepares your AWS account for CDK deployments.

Now deploy the backend:

```bash
npx cdk deploy
```

When it asks:

```txt
Do you wish to deploy these changes?
```

Type:

```txt
y
```

Wait until the deployment finishes.

---

## 14. Copy the Backend URL

After deployment finishes, CDK will print an output like this:

```txt
ChatbotApiUrl = https://example.lambda-url.us-east-1.on.aws/
```

Copy this full URL.

You will use it in the frontend.

---

## 15. Connect Frontend to Backend

Go back to the project root:

```bash
cd ..
```

Create a file named:

```txt
.env.local
```

Inside `.env.local`, add:

```env
NEXT_PUBLIC_LAMBDA_URL=https://your-lambda-url.lambda-url.us-east-1.on.aws/
```

Replace the example URL with your actual `ChatbotApiUrl`.

Important:

- Do not use quotes
- Do not add spaces
- Include `https://`
- Include the full Lambda Function URL

Example:

```env
NEXT_PUBLIC_LAMBDA_URL=https://abc123.lambda-url.us-east-1.on.aws/
```

---

## 16. Run Frontend Again

From the project root, run:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Try this prompt:

```txt
Explain AWS Lambda like I am new to cloud.
```

You should see the response appear gradually in the browser.

---

## 17. Push Your Code to GitHub

If you made changes, push them to GitHub.

Check current status:

```bash
git status
```

Add all changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Update streaming chatbot workshop project"
```

Push:

```bash
git push origin main
```

If this is your first push and Git asks you to log in, sign in with your GitHub account.

---

## 18. Deploy Frontend With AWS Amplify

AWS Amplify will host the frontend online.

### Step 1: Open Amplify

Go to AWS Console.

Search:

```txt
Amplify
```

Open AWS Amplify.

Make sure region is:

```txt
us-east-1
```

---

### Step 2: Create New App

Click:

```txt
Create new app
```

Choose:

```txt
Host web app
```

Choose:

```txt
GitHub
```

Click:

```txt
Next
```

Authorize GitHub if asked.

---

### Step 3: Select Repository

Choose repository:

```txt
awsccsheridan/streaming-chatbot
```

Choose branch:

```txt
main
```

Click:

```txt
Next
```

---

### Step 4: Build Settings

Amplify should detect that this is a Next.js app.

If it asks for build settings, use:

```txt
Install command:
npm install --legacy-peer-deps

Build command:
npm run build

Output directory:
.next
```

---

### Step 5: Add Environment Variable

Before deploying, add this environment variable:

```txt
NEXT_PUBLIC_LAMBDA_URL
```

Value:

```txt
your ChatbotApiUrl
```

Example:

```txt
https://abc123.lambda-url.us-east-1.on.aws/
```

This tells the deployed frontend where the backend Lambda API is.

---

### Step 6: Save and Deploy

Click:

```txt
Save and deploy
```

Wait until all steps are complete:

- Provision
- Build
- Deploy
- Verify

When deployment finishes, Amplify gives you a public website URL.

Example:

```txt
https://main.example.amplifyapp.com
```

Open that URL and test the chatbot.

---

## 19. If Amplify Shows Failed to Fetch or CORS Error

If the chatbot works locally but does not work on Amplify, the Lambda backend may need to allow the Amplify domain.

Copy your Amplify URL.

Example:

```txt
https://main.example.amplifyapp.com
```

Open:

```txt
backend/lib/chatbot-stack.ts
```

Find the CORS section for the Lambda Function URL.

Add your Amplify URL to the allowed origins.

Example:

```ts
cors: {
  allowedOrigins: [
    "http://localhost:3000",
    "https://main.example.amplifyapp.com"
  ],
  allowedMethods: [lambda.HttpMethod.GET, lambda.HttpMethod.POST],
  allowedHeaders: ["content-type"],
}
```

Save the file.

Push the change:

```bash
git add .
git commit -m "Add Amplify domain to Lambda CORS"
git push origin main
```

Redeploy backend:

```bash
cd backend
npx cdk deploy
```

Then test Amplify again.

---

## 20. Common Issues and Fixes

### Problem: `aws` command not found

Fix:

- Restart terminal
- Restart VS Code
- Reinstall AWS CLI
- Run:

```bash
aws --version
```

---

### Problem: AWS credentials error

Fix:

Run:

```bash
aws configure
```

Then enter your AWS keys again.

Check:

```bash
aws sts get-caller-identity
```

---

### Problem: Wrong AWS region

Fix:

Use:

```bash
us-east-1
```

For Mac/Linux:

```bash
export AWS_REGION=us-east-1
```

For Windows PowerShell:

```powershell
$env:AWS_REGION="us-east-1"
```

---

### Problem: Bedrock access denied

Fix:

- Go to Amazon Bedrock
- Choose region `us-east-1`
- Enable Nova model access

---

### Problem: npm install error

Fix:

```bash
npm install --legacy-peer-deps
```

---

### Problem: cdk command not found

Fix:

Use:

```bash
npx cdk deploy
```

instead of:

```bash
cdk deploy
```

---

### Problem: CDK bootstrap error

Fix:

```bash
npx cdk bootstrap
```

Then deploy again:

```bash
npx cdk deploy
```

---

### Problem: Frontend says Lambda URL is missing

Fix:

Make sure `.env.local` exists in the project root and contains:

```env
NEXT_PUBLIC_LAMBDA_URL=your ChatbotApiUrl
```

Then restart frontend:

```bash
npm run dev
```

---

### Problem: Failed to fetch

Fix:

- Check `NEXT_PUBLIC_LAMBDA_URL`
- Make sure the backend deployed successfully
- Make sure the Lambda URL is copied exactly
- Restart the frontend
- Check browser console for CORS errors

---

### Problem: CORS error

Fix:

- Add the frontend URL to Lambda Function URL CORS settings
- For local testing, allow:

```txt
http://localhost:3000
```

- For Amplify, allow your Amplify URL:

```txt
https://your-app.amplifyapp.com
```

Then redeploy backend.

---

## 21. Stop Local Frontend

To stop the local frontend server, go to the terminal where `npm run dev` is running and press:

```txt
Ctrl + C
```

If it asks to confirm, type:

```txt
Y
```

---

## 22. Delete AWS Resources After Workshop

To avoid keeping unused AWS resources, destroy the backend stack.

From the backend folder:

```bash
npx cdk destroy
```

When asked:

```txt
Are you sure you want to delete?
```

Type:

```txt
y
```

This removes the CDK-created backend resources.

1. Delete Cloud watch manually of not deleted with cdk destroy : https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups 
2. Also check Role ( Delete manually )  : https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/roles 
3. Make sure to desable your access key and secrete key ( click on your user ) : https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/users
4. Delete Amplify ( check region if you do not see any apps)  : https://us-east-1.console.aws.amazon.com/amplify/apps
---

## 23. Workshop Presenter Flow

Recommended live flow:

1. Explain what we are building.
2. Show the architecture.
3. Confirm everyone has required software installed.
4. Confirm AWS region is `us-east-1`.
5. Clone the repository.
6. Run the frontend locally.
7. Deploy the backend using CDK.
8. Copy `ChatbotApiUrl`.
9. Add it to `.env.local`.
10. Test streaming locally.
11. Push code to GitHub.
12. Deploy frontend with Amplify.
13. Add Amplify URL to CORS if needed.
14. Final public demo.
15. Destroy resources if needed.

---

## 24. Final Test Prompt

Use this prompt:

```txt
Explain AWS Lambda like I am new to cloud.
```

If the assistant streams a response back into the browser, the project is working.

---

## 25. What You Learned

By completing this workshop, you learned:

- How a Next.js frontend sends a prompt to a backend
- How AWS Lambda works as a serverless backend
- How Lambda Function URLs expose a public API
- How Amazon Bedrock generates AI responses
- How response streaming improves user experience
- How AWS CDK deploys infrastructure
- How AWS Amplify hosts a frontend
- How to connect frontend and backend using environment variables
