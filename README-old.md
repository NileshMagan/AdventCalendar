# Advent Email Automation 🎄

This repo sends a **daily advent email** to your friend automatically during December, using:

- Node.js + [nodemailer](https://nodemailer.com/)
- Any SMTP-compatible email service (your provider, Brevo, MailerLite SMTP, etc.)
- GitHub Actions as a free daily scheduler

You **don’t** need to keep your laptop on – GitHub runs it in the cloud every day.

---

## 1. Files

- `messages.json` – the list of messages (one per day with `date`, `subject`, and `body`).
- `send-email.mjs` – Node script that:
  - figures out today’s date (using Australia/Melbourne time),
  - finds today’s message,
  - sends it as an email.
- `package.json` – project metadata + nodemailer dependency.
- `.github/workflows/send-advent-email.yml` – GitHub Actions workflow that runs the script every day.

---

## 2. Why an SMTP service?

Email can’t be sent by “just your password” alone – something has to speak the **SMTP or API protocol** to an email server. You have two main options:

1. **Use your own email account’s SMTP server**
   - e.g. Gmail, Outlook, etc.
   - For Gmail you typically need an **app password** (not your real password) and may need to enable 2FA.
   - This is fine for a low-volume project like this.

2. **Use a dedicated email provider’s SMTP**
   - e.g. Brevo, MailerSend, Mailjet, etc. (many have free tiers).
   - They give you an SMTP host, port, username and password (API key) which you plug into this project.
   - Often better deliverability and fewer spam issues.

Either way, from this project’s point of view, it’s just SMTP credentials in environment variables.

> If you run this **locally** with a cron job instead of GitHub Actions, you can still use your normal email provider’s SMTP (e.g. Gmail app password) – the code is exactly the same.

---

## 3. Setup Steps

### 3.1. Create a GitHub repository

1. Create a new repo on GitHub (public or private).
2. Download this project folder and **push it** to that repo:
   - `git init`
   - `git remote add origin <your-repo-url>`
   - `git add .`
   - `git commit -m "Advent email automation"`
   - `git push -u origin main`

GitHub automatically detects the workflow file in `.github/workflows/send-advent-email.yml`.

---

### 3.2. Install dependencies locally (optional but recommended for testing)

If you want to test from your machine first:

```bash
npm install
```

You can then run:

```bash
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
SMTP_SECURE=false FRIEND_EMAIL=friend@example.com FROM_EMAIL=you@example.com FROM_NAME="Advent Calendar" npm run send-today
```

That will send **today’s** email once.

---

### 3.3. Configure messages

Open `messages.json`.

- Each entry has:
  - `date`: `YYYY-MM-DD` (currently set for December 2025 – change the year if needed),
  - `subject`: email subject line,
  - `body`: plain-text content (with `\n` for newlines).

If you want to re-use this in another year:

- Either update all `date` fields to the new year, **or**
- Change them to match the year you want before December starts.

---

### 3.4. Add GitHub Secrets

In your GitHub repo:

1. Go to **Settings → Secrets and variables → Actions → New repository secret**.
2. Add the following secrets:

- `SMTP_HOST` – e.g. `smtp.gmail.com` or your provider’s host.
- `SMTP_PORT` – e.g. `587` (STARTTLS) or `465` (SSL).
- `SMTP_USER` – your SMTP username (email address or API key).
- `SMTP_PASS` – your SMTP password or API key.
- `SMTP_SECURE` – `"true"` if using port 465, otherwise `"false"`.
- `FRIEND_EMAIL` – her email address.
- `FROM_EMAIL` – the email address your emails will come from.
- `FROM_NAME` – (optional) friendly display name, e.g. `Nilesh` or `Advent Calendar`.

> **Note:** You should **not** commit these values into the repo; that’s why they go into “Secrets”.

---

## 4. How the GitHub Action works

The workflow in `.github/workflows/send-advent-email.yml`:

- Runs every day at **7:30 AM Australia/Melbourne time** (cron is `30 20 * * *` in UTC for December).
- Checks out your repo.
- Installs Node.js and dependencies.
- Runs `npm run send-today` with your secrets exposed as environment variables.

You can also trigger it manually from the **Actions** tab via the `workflow_dispatch` event if you want to test it.

---

## 5. Changing the send time

If you want to change the email time:

1. Edit `.github/workflows/send-advent-email.yml`.
2. Adjust the `cron` line under `on.schedule`.

Remember: cron uses **UTC**, so you’ll need to convert from Australia/Melbourne time.

Example:
- Melbourne 8:00 AM in December (UTC+11) → `21:00` (previous day) UTC → `0 21 * * *`.

You can use any online “cron time UTC converter” if you don’t want to do it manually.

---

## 6. Running everything locally instead (no GitHub Actions)

If you’d prefer not to use GitHub at all, you can:

1. Put this folder on a machine that’s always on (e.g. a small VPS or your home server).
2. Install dependencies: `npm install`.
3. Use a system scheduler:
   - Linux/macOS: `cron`
   - Windows: Task Scheduler  
4. Schedule a daily run of:

```bash
cd /path/to/advent-email-automation
# export or set your SMTP + email env vars, then:
npm run send-today
```

In that case, yes – you can use **your own email account’s SMTP credentials** locally (e.g. Gmail app password) and never touch GitHub.

---

Enjoy making her December extra magical ✨
