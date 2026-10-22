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

The public map is the upstream dashboard built in its existing demo/static mode,
with a relative base URL and the Any Retry graph. Local publication adds a
project title, status/attribution notice and license files. It does not turn the
dashboard into an Any Retry runtime. The graph and tour describe this project's
documents and proposed design; they are not an execution trace.

Bundled dependency license texts are collected into
`docs/map/THIRD_PARTY_LICENSES.txt` during the map build. That file intentionally
includes available licenses from the installed dependency tree, including some
build dependencies; inclusion does not imply that every package ships in the
browser bundle. Upstream's MIT license does not replace those dependencies'
own license terms.

Any Retry's original documents, graph curation and build scripts are covered by
the root [MIT LICENSE](LICENSE). Preserve the upstream and dependency notices
when redistributing the skills or generated map.
