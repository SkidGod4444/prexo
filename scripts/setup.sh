touch ./.env
# The following variables are of production.
echo "UPSTASH_VECTOR_REST_URL=ADD_YOUR_KEY" >> ./.env
echo "UPSTASH_VECTOR_REST_TOKEN=ADD_YOUR_KEY" >> ./.env
echo "TOGETHER_API_KEY=ADD_YOUR_KEY" >> ./.env
echo "OPENAI_API_KEY=ADD_YOUR_KEY" >> ./.env
echo "DATABASE_URL=ADD_YOUR_KEY" >> ./.env
echo "DIRECT_DATABASE_URL=ADD_YOUR_KEY" >> ./.env
echo "BETTER_AUTH_SECRET=ADD_YOUR_KEY" >> ./.env
echo "BETTER_AUTH_URL=ADD_YOUR_KEY" >> ./.env
echo "POLAR_ACCESS_TOKEN=ADD_YOUR_KEY" >> ./.env
echo "GITHUB_CLIENT_ID=ADD_YOUR_KEY" >> ./.env
echo "GITHUB_CLIENT_SECRET=ADD_YOUR_KEY" >> ./.env
echo "DISCORD_CLIENT_ID=ADD_YOUR_KEY" >> ./.env
echo "DISCORD_CLIENT_SECRET=ADD_YOUR_KEY" >> ./.env
echo "GOOGLE_CLIENT_ID=ADD_YOUR_KEY" >> ./.env
echo "GOOGLE_CLIENT_SECRET=ADD_YOUR_KEY" >> ./.env
echo "BASE_API_URL=http://localhost:3001/v1" >> ./.env
echo "UNKEY_ROOT_API_KEY=ADD_YOUR_KEY" >> ./.env
echo "UNKEY_API_ID=ADD_YOUR_KEY" >> ./.env
echo "PREXO_API_KEY=ADD_YOUR_KEY" >> ./.env
echo "UPSTASH_REDIS_REST_URL=ADD_YOUR_KEY" >> ./.env
echo "UPSTASH_REDIS_REST_TOKEN=ADD_YOUR_KEY" >> ./.env
echo "TRIGGER_SECRET_KEY=ADD_YOUR_KEY" >> ./.env
echo "OCR_SPACE_API_KEY=ADD_YOUR_KEY" >> ./.env
echo "RESEND_API_KEY=ADD_YOUR_KEY" >> ./.env
echo "NEXT_PUBLIC_POSTHOG_KEY=ADD_YOUR_KEY" >> ./.env
echo "NEXT_PUBLIC_POSTHOG_HOST=ADD_YOUR_KEY" >> ./.env

touch ./apps/www/.env
touch ./apps/api/.env
touch ./apps/console/.env

# Install dependencies using Bun
echo "Installing dependencies..."
if ! command -v bun &> /dev/null
then
    echo "Bun is not installed. Installing Bun using npm..."
    npm install -g bun
fi
# Ensure the bun.lock file is present
if [ ! -f bun.lock ]; then
    echo "bun.lock file not found. Running 'bun install' to create it..."
fi

# Install dependencies
bun install
echo ">> Dependencies installed successfully."
echo ">> Created .env file in the root directory!"
echo ">> Setup complete. Please fill in the .env file with your keys."
echo ">> Note: Please run 'bun envc' to copy all your env keys from root level to app level."
echo ">> To run the application, use 'bun run dev' for development or 'bun run build' followed by 'bun start' for production."
