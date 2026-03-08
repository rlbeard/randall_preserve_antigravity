# Randall Preserve Watcher Generator

This local script automatically fetches and summarizes new intelligence about the Randall Preserve using Google's Gemini API, formats the output nicely into JSON, and utilizes `git` to commit and push those changes up to the GitHub repository. When pushed, GitHub Pages will automatically reconstruct the static frontend.

## Setup

1. Run `npm install` within this directory.
2. Create a `.env` file in this directory and populate it:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Note: If you omit the key, the script will simply output the fallback existing data.
3. Ensure the project is linked to a remote GitHub repository.

## Automating with Cron (Linux / macOS)

To ensure this dashboard is a true "Daily Intelligence Dashboard", set up a cron job to run this script automatically.

1. Open your terminal.
2. Type `crontab -e` to edit your cron schedule.
3. Add the following line to run the generator every morning at 6:00 AM (replace `/path/to/project` with your actual path):

   ```bash
   0 6 * * * cd /home/rbeard/Projects/randall_preserve_watcher_antigrav/generator && /usr/bin/node generate.js >> /var/log/randall-generator.log 2>&1
   ```

## GitHub Automation (Personal Access Token)

To allow the cron job to automatically `git push` new data to your repository without prompting you for a password every morning, you must configure a Personal Access Token (PAT).

1. Go to Github.com -> **Settings** -> **Developer Settings** -> **Personal access tokens** -> **Tokens (classic)**.
2. Generate a new token with the `repo` scope.
3. On your local machine, configure your repository's remote URL to include the token:
   
   ```bash
   git remote set-url origin https://<YOUR_GITHUB_USERNAME>:<YOUR_NEW_TOKEN>@github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
   ```

Now, the `simple-git` implementation inside `generate.js` will quietly and securely deploy your daily updates.
