# 地图验收记录

日期：2026-10-22。范围：Understand-Anything 安装、文档设计图谱、静态地图及公开发布。重试核心尚未实现，以下检查不证明重试能力。

## 已完成的本地验证

- 官方扫描器识别 4 份 Markdown 文档；官方导入解析得到 0 条 imports，结构提取成功，无不可读文件。
- 主代理执行官方扫描、分批、结构提取、合并、校验和指纹脚本；GPT-6 Luna 只读辅助语义提取、合并审查、分层和导览。
- 图谱：14 节点（4 文档、10 概念）、22 关系（12 documents、10 related）、4 层、7 步导览。
- 上游内联校验：issues 0、warnings 0；上游 Schema 校验及本地引用、状态、证据行范围、源文件哈希校验通过。
- 官方指纹基线包含全部 4 份扫描文档；元数据记录基准提交及含工作区修改的事实，不伪称发布提交已被分析。
- `scripts/setup-map.ps1` 执行成功；`scripts/build-map.ps1` 构建成功。使用 Windows、Node.js 24.19.0、pnpm 11.25.0；未修改全局 Node 版本。
- 本地浏览器验证：正确项目名称、4 层、7 步导览；搜索“状态机”、选择节点、摘要与证据行号；导览开始及下一步均正常。
- 初次加载出现浏览器沿用上游示例图缓存，已通过带图谱哈希的资源 URL 修复，并在浏览器确认加载 Any Retry 的 14 个节点。
- 自有 Markdown 的相对链接检查通过；技能内两份 LICENSE 与上游原文逐字一致；发布 JSON 与 `.ua` 图谱一致。
- 静态网页随附上游 MIT 原文及 572 个安装依赖的可获取许可文本/声明；16 个依赖未随包提供顶层 LICENSE，保留其作者、仓库及 README 声明，列表见 `.ua/license-audit.json`。这不是独立法律审计。

## 限制

- 验证仅针对地图辅助工具，不是重试核心的业务测试。
- 上游构建提示主 JS 分块较大；构建成功，但没有据此宣称性能验收通过。
- 静态模式不具备本机源码读取、实时更新或模型对话后端。
- 浏览器验证使用桌面视口，未覆盖全部移动端与无障碍场景。

## 公开发布

- 用户明确授权后，仓库 `YHonc/any-retry` 已由 private 改为 public；未认证 GitHub API 确认 visibility 为 public，许可证识别为 MIT。
- Pages 来源：`main` 分支 `/docs`；首次部署提交 `c30a0a1`，`pages build and deployment` 工作流 completed / success，Pages 状态 built。
- 地图 HTML 与 `knowledge-graph.json` 均通过未认证公网 HTTP 200 检查；返回图谱为 Any Retry，14 节点、22 关系。
- 公开网页已在浏览器加载，显示正确项目名、四层地图、七步导览和“重试引擎尚未实现”状态提示。
- 在线地址：https://yhonc.github.io/any-retry/map/ 。README 已包含直接入口。
