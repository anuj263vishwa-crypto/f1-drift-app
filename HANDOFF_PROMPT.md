# Copy-paste prompt for a NEW Claude chat / account

Paste everything between the lines into the new chat (fill in the token). Keep the token private – delete it on GitHub when you are done.

---
You are continuing work on my game **F1 Drift** (three.js racing game packaged as an Android app with Capacitor, plus an Electron desktop app, built on GitHub Actions).

1. Clone the repo first: `git clone --depth 1 https://github.com/anuj263vishwa-crypto/f1-drift-app.git` (public) and **read `HANDOFF.md` completely** – it has the architecture, build/release/OTA flow, the lazy-loading and external-car pipelines, test tools (`tools/`), the current status and known issues. Also look at `README.md`.
2. My GitHub username is `anuj263vishwa-crypto`. My fine-grained token (only this repo; Contents + Workflows read/write) is: `PASTE_TOKEN_HERE`
   – Use it only to `git push` (use `git pull --rebase` first, I sometimes upload images on github.com) and to read the release API. Never write the token into any file, commit, memory or the chat summary.
3. About me: I write in **Hinglish**, I want **short answers**, and I want you to decide and execute on your own with minimal questions. My phone is a **vivo T4 Lite 5G, 4 GB RAM** (weak GPU), so performance matters.
4. How we work: after each change run the checks in HANDOFF.md, push, wait until release `latest` shows the new version (`GET /repos/anuj263vishwa-crypto/f1-drift-app/releases/tags/latest`), then tell me what changed, what you could NOT test (you have no phone), and what I should check. After each milestone update the "Current status" and "Changelog" blocks in `HANDOFF.md`.
5. First thing now: tell me (3–5 lines) what the current state is according to HANDOFF.md, then continue with this task: **WRITE_YOUR_NEXT_TASK_HERE** (if I leave it empty, ask me which open idea from HANDOFF.md to do next).
---
