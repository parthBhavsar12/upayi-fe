# CI/CD

This project uses GitHub Actions for production-oriented validation and deployment.

## Workflows

- `CI` runs on pull requests and pushes to `main` or `master`.
- `Deploy Pages` builds and deploys the production app from `main` to GitHub Pages.
- `CodeQL` scans JavaScript and TypeScript for security issues on pull requests, pushes, and a weekly schedule.
- `Dependabot` keeps npm packages and GitHub Actions updated with grouped pull requests.

## Required Repository Settings

Enable these settings in GitHub before treating the pipeline as production-ready:

- Protect `main` and require pull requests before merging.
- Require the `Quality Gates` and `Analyze JavaScript and TypeScript` checks.
- Enable GitHub Pages with `GitHub Actions` as the source.
- Require at least one approving review.
- Dismiss stale approvals when new commits are pushed.
- Enable Dependabot alerts and security updates.

## Local Parity

Run the same core validation locally with:

```sh
npm ci
npm run ci
npm run audit:prod
```
