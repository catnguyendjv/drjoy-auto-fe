# Environment Variables Configuration

This project uses environment variables to configure the Redmine integration.

## Required Environment Variables

Create a file named `env.local` in the root directory with the following variables:

```env
# Redmine Configuration
NEXT_PUBLIC_REDMINE_BASE_URL=https://redmine.famishare.jp
NEXT_PUBLIC_REDMINE_API_KEY=your_api_key_here
```

## Variables Description

- **NEXT_PUBLIC_REDMINE_BASE_URL**: The base URL of your Redmine instance
  - Example: `https://redmine.famishare.jp`
  - Default fallback: `https://redmine.famishare.jp`

- **NEXT_PUBLIC_REDMINE_API_KEY**: Your Redmine API key for authentication
  - You can find your API key in Redmine under: My account → API access key
  - Default fallback: (empty string)

## Important Notes

1. **NEXT_PUBLIC_ prefix**: These variables are prefixed with `NEXT_PUBLIC_` because they need to be accessible in the browser (client-side). Next.js only exposes environment variables with this prefix to the client.

2. **Security**: Never commit your `env.local` file to version control. It's already included in `.gitignore`.

3. **Restart required**: After changing environment variables, you need to restart the development server for changes to take effect.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Production

For production deployment, make sure to set these environment variables in your hosting platform (Vercel, Netlify, etc.).
