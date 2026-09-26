# GitHub Actions CI Pipeline

This repository is equipped with an automated GitHub Actions Continuous Integration (CI) workflow matching modern web application best practices.

---

## 🛠️ Workflow Overview

| Workflow | File | Triggers | What it does |
| :--- | :--- | :--- | :--- |
| **CI - Build & Quality Gate** | [`.github/workflows/ci.yml`](./workflows/ci.yml) | Push to `main`, Pull Requests to `main`, Manual Dispatch | • Automatically caches `npm` packages<br>• Runs TypeScript type check (`tsc --noEmit`)<br>• Builds production Vite SSR and Client bundles (`npm run build`)<br>• Uploads production build artifacts (`dist/`) |

---

## 🚀 Running the Workflow Manually

1. Navigate to the **Actions** tab on your GitHub repository.
2. Select **CI - Build & Quality Gate** on the left sidebar.
3. Click **Run workflow** and select the branch (e.g. `main`).
