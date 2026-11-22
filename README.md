# KCoder Plugins — adapted packages

This branch holds third-party plugins that were adapted for KCoder. The
marketplace itself lives on the [`main` branch](https://github.com/yixuanchen189756-source/kcoder-plugins);
its entries install these packages from a pinned commit of this branch.

They are kept off `main` so that adding the marketplace by URL stays within
KCoder's snapshot size limit.

Every package in `plugins/<name>/`:

- keeps the upstream license file and copyright notices unchanged;
- has `UPSTREAM.md` with the upstream project, the exact source commit, the
  license and every change made for KCoder;
- was installed with a real KCoder CLI and reported as healthy and
  `fully_supported`.

Example or test credentials that the secret scan flags were reviewed and are
listed with reasons in `secret-scan-allowlist.json`.

```bash
node scripts/validate.mjs --packages .
```
