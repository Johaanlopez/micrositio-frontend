Test credentials and how to run the frontend locally

This project includes a lightweight axios mock adapter for local development. To use the mock API and test the UI, set VITE_MOCKS to true before starting the dev server.

Run dev server with mocks (cmd.exe):

```cmd
cd /d C:\Users\johan\Desktop\Micrositio\frontend
set VITE_MOCKS=true
npm run dev
```

Or on PowerShell:

```powershell
$env:VITE_MOCKS = 'true'
npm run dev
```

Mock user accounts (defined in `src/mocks/axiosMock.ts`):

- user@example.com / password123  — Not verified (the mock will return requiresEmailVerification = true). Use this to test the email verification and 2FA flows.
- verified@micrositio.com / password123 — Verified user (logs in directly).

Notes:
- The mock returns a short-lived demo access token and user object. No real authentication is performed.
- If you want to test against a real backend, unset VITE_MOCKS and set VITE_API_URL in `.env` to point to your API.

If you want, I can also create a simple script that sets the environment variable and launches the dev server for convenience.