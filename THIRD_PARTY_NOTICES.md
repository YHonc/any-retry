# Third-party notices

## Understand Anything

- Source: https://github.com/Egonex-AI/Understand-Anything
- Version in upstream manifests: 2.9.7
- Pinned revision: `b8c807c632743ab695ec43cb654a0f1efe216bc8`
- License: MIT; full upstream text: [third_party/understand-anything/LICENSE](third_party/understand-anything/LICENSE).
- Copyright (c) 2026 Yuxiang Lin
- Copyright (c) 2026 Infinite Universe, Inc.

The project-local `understand` and `understand-dashboard` skills are copied from
this revision. Each skill includes the upstream LICENSE. The two SKILL.md entry
points contain a clearly marked local-installation block; other bundled skill
files retain their upstream content. The upstream runtime lives in ignored
`.tools/understand-anything/` and is restored by `scripts/setup-map.ps1`.

The generated graph, static dashboard bundle and map publication scripts have
been removed at the user's request. No dashboard dependency bundle is currently
distributed by this repository. The retained skills keep their upstream MIT
copyright and license notices.

Any Retry's original documents and setup script are covered by the root
[MIT LICENSE](LICENSE). Preserve upstream notices when redistributing the skills.
