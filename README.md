# Advent Calendar Automation 🎄

This repo consists of two main components:

1. **Automated daily advent emails** sent using GitHub Actions
2. **Interactive web calendar** to view and manage advent messages

---

## 🎯 Features

### Email Automation
- Automatically sends a daily advent email during December
- Uses GitHub Actions as a free daily scheduler (no need to keep your laptop on)
- Supports manual triggering and testing with custom dates
- Dry run mode to preview emails without sending

### Web Calendar App
- **Responsive design** - works great on mobile and desktop
- **Swipe navigation** - swipe left/right to navigate between days
- **Calendar picker** - jump to any specific day instantly
- **Today indicator** - shows which day is today
- **Touch-friendly** - optimized for mobile use

---

## 📱 Using the Web App

### Main Calendar View
- Open `index.html` in your browser or visit your GitHub Pages URL
- Swipe left/right to navigate between days
- Tap the "📅 Go to Day" button to jump to a specific day
- The app automatically opens to today's message (if available)

### Navigation Options
- **Swipe**: Touch-drag left or right to change days
- **Arrow buttons**: Click/tap the navigation arrows on desktop
- **Keyboard**: Use left/right arrow keys
- **Calendar picker**: Tap the calendar button to jump to any day
- **Direct URLs**: Bookmark specific days

### Mobile Experience
- Add to home screen for app-like experience
- Full touch gesture support
- Responsive design adapts to screen size

---

## 🛠️ Files Structure

- `index.html` – Main advent calendar web app (viewer)
- `editor.html` – Message editor interface (for content creation)
- `messages.json` – The advent messages data
- `send-email.mjs` – Email sending script
- `package.json` – Project dependencies
- `.github/workflows/send-advent-email.yml` – GitHub Actions automation

---

## ⚡ Manual Testing & Triggering

The GitHub Action can now be triggered manually with options:

1. Go to your repo's **Actions** tab
2. Click "Send Advent Email" workflow  
3. Click "Run workflow"
4. Options available:
   - **Test Date**: Override date (YYYY-MM-DD) for testing specific days
   - **Dry Run**: Preview what would be sent without actually sending email

### Examples:
- Test December 25th message: Set test date to `2025-12-25`
- Preview today's email: Enable "Dry run" checkbox
- Send today's email normally: Leave both empty and run

---

## 🔧 Setup Steps

### For Web Calendar (GitHub Pages)
1. The web calendar works automatically once you push to GitHub
2. Enable GitHub Pages in repo settings (if you want public access)
3. Visit `https://yourusername.github.io/your-repo-name` to view the calendar

### For Email Automation

#### GitHub Secrets Setup
In your GitHub repo settings, add these secrets:

**Required for sending emails:**
- `SMTP_HOST` – e.g. `smtp.gmail.com`
- `SMTP_PORT` – e.g. `587` (STARTTLS) or `465` (SSL)
- `SMTP_USER` – your SMTP username/email
- `SMTP_PASS` – your SMTP password or app password
- `SMTP_SECURE` – `"true"` for port 465, `"false"` for port 587
- `FRIEND_EMAIL` – recipient's email address
- `FROM_EMAIL` – sender email address
- `FROM_NAME` – (optional) sender display name

#### Local Testing
```bash
npm install

# Test sending today's email (dry run)
DRY_RUN=true FRIEND_EMAIL=test@example.com FROM_EMAIL=you@example.com npm run send-today

# Test specific date
TEST_DATE=2025-12-25 DRY_RUN=true FRIEND_EMAIL=test@example.com FROM_EMAIL=you@example.com npm run send-today
```

---

## 📧 Email Provider Setup

### Option 1: Gmail (Personal)
1. Enable 2-factor authentication
2. Generate an app password: Google Account → Security → App passwords
3. Use these settings:
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_SECURE`: `false`
   - `SMTP_USER`: your Gmail address
   - `SMTP_PASS`: the app password (not your regular password)

### Option 2: Email Service Provider
Use services like Brevo, MailerSend, Mailjet (many have free tiers):
- Better deliverability
- More reliable for automation
- Usually provide SMTP credentials directly

---

## ⏰ Scheduling

The workflow runs daily at **7:30 AM Australia/Melbourne time**.

To change the schedule:
1. Edit `.github/workflows/send-advent-email.yml`
2. Update the `cron` expression (remember it uses UTC time)
3. Example for 8:00 AM Melbourne → `0 21 * * *` (21:00 UTC previous day)

---

## 🎨 Customizing Messages

### Using the Web Editor
1. Open `editor.html` in your browser
2. Edit messages directly in the interface
3. Export the JSON and copy to `messages.json` in your repo

### Direct Editing
Edit `messages.json` with your advent messages. Each entry needs:
```json
{
  "date": "2025-12-01",
  "subject": "Day 1 - Welcome!",
  "body": "Your advent message here..."
}
```

---

## 🚀 Deployment Options

### GitHub Pages (Recommended)
- Enable in repo settings → Pages → Source: GitHub Actions or main branch
- Calendar will be available at `https://yourusername.github.io/your-repo-name`

### Local Development
```bash
# Start local server
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Custom Hosting
Upload `index.html`, `messages.json`, and any other assets to any web hosting service.

---

Enjoy creating magical December moments! ✨🎄