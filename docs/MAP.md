# 项目地图：查看、边界与维护

## 查看地图

公开地址：https://YHonc.github.io/any-retry/map/

这是 Understand-Anything 原版 Dashboard 的静态构建，加载本仓库的
`.ua/knowledge-graph.json`。可浏览节点、关系、分层与导览；无需模型密钥。
仓库内的 HTML 文件本身是源码文件，GitHub 文件页不会直接运行它，在线入口使用 GitHub Pages。

图谱 JSON 和构建产物均保存在仓库中。静态页面不连接本机服务，不提供真实源文件读取、图谱自动更新或模型问答。涉及这些操作的原版界面入口不代表本项目已部署后端。

## 图谱表达的事实

- **已有文档**：README、总体指南、进度记录以及地图说明等真实文件。
- **设计概念**：从总体指南提取的目标、状态机、策略、适配器协议、恢复与验收要求。
- **未实现能力**：所有重试运行模块仍无源码；概念节点在名称、摘要或标签中明确写出状态。
- **关系语义**：文档引用、说明和概念关联；不把设计顺序标为实际函数调用或真实数据流。
- **没有 Trace**：此地图不是重试执行回放，也不证明自动重试功能已可用。

当前扫描范围由 `.ua/.understandignore` 明确限定。第三方技能与运行时、生成地图、辅助构建脚本、第三方许可证不参与业务设计地图的扫描。原版扫描器可能把无扩展名文件归为 `code`；这只是文件分类，不能据此声称本项目已有重试代码。

## 安装与生成

项目技能位于 `.agents/skills/understand/` 和 `.agents/skills/understand-dashboard/`。
在客户端下一轮加载项目技能后可调用 `$understand`；本次已读取技能指令并执行对应流程。
上游固定在 `THIRD_PARTY_NOTICES.md` 中记录的提交，不使用漂移的 latest。

本地运行时不提交；新克隆的项目先准备 Node.js >= 22 和 pnpm，然后从项目根目录执行：

```powershell
pwsh -File scripts/setup-map.ps1
```

生成或更新语义图谱：在支持该技能的客户端调用 `$understand --full --language zh`，检查扫描范围、节点事实与证据。图谱摘要与设计概念需要语义审阅，构建脚本不会代替这个步骤。

现有图谱校验与静态网页构建：

```powershell
node scripts/validate-map.mjs
pwsh -File scripts/build-map.ps1
```

`build-map.ps1` 使用上游 `vite.config.demo.ts`，设置相对资源基路径，然后附加图谱、配置、元数据与许可证。可在根目录运行 `python -m http.server 8099 --bind 127.0.0.1`，打开 `http://127.0.0.1:8099/docs/map/` 预览；不建议直接双击 HTML，因为浏览器会限制本地 JSON 请求。

## 更新顺序与发布

1. 更新真实设计或代码及 STATUS；再生成或审阅对应图谱。
2. 由技能输出 `.ua/knowledge-graph.json`、指纹和元数据；保持 `gitCommitHash` 为实际分析的基准提交，不伪装成未来发布提交。
3. 执行校验和构建；检查节点、导览、搜索、浏览器加载和许可文件。
4. 同时提交图谱、元数据、构建结果和文档。公开前检查本次新增内容，禁止把本地凭据和日志加入地图。
5. GitHub Pages 从 `main` 分支的 `/docs` 发布，地图位于 `/map/`；以实际部署状态和公开 URL 检查为准。

网页中的状态警示始终说明重试引擎尚未实现。未来核心落地后，必须根据源码与测试修改它，不能只删除警示。

## 许可

Any Retry 使用根目录 MIT LICENSE。Understand-Anything 的原始 MIT 版权和完整许可保留在 `third_party/understand-anything/LICENSE` 及两个技能目录中，公开地图也随附。其他前端依赖的声明在公开地图 `THIRD_PARTY_LICENSES.txt` 中保留，详见 `THIRD_PARTY_NOTICES.md`。
