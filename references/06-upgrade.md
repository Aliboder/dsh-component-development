# 06 · DSH 升级后的复核

## 为什么必须复核

原语是活的：导出会增删、props 会改名、CSS Module 类名会变、样式安装方式会变。

真实例子（官方升级记录）：

- 0.2.2-rc.2：`staticLinked` 库（含 ui-primitives）的样式不再进入外壳 CSS，改由 renderer 安装；CSS Module 类名从 `_<local>_<hash>` 变成新的哈希格式。抄类名的插件直接失效。
- 0.2.2-rc.2：`rankByName` 从原语移除；依赖它的代码编译/运行失败。
- 0.2.2-alpha.2：`Menu` 的 `getAnchorRect` 换成 `anchorRef` / `anchorPoint`。

所以：**不抄值、不抄类名；升级后按下面顺序复核。**

## 复核步骤

1. **记录版本**：`dsh --version`，写进变更说明。
2. **读目标版本的原语 README**（npm 包 `@deepseek-ai/dsh-client-ui-primitives`，或 GitHub 对应 tag）。重点看：新增/移除导出、props 变化、已知限制。
3. **读已安装主题样式**：`<DSH>/resources/app.asar/dsh/node_modules/@deepseek-ai/dsh-client-ui-theme/src/styles/*.css`，确认用到的 token 还在、层级没变。
4. **跑静态检查**：`node scripts/check-ui.mjs`。
5. **重开 gallery**：浅色/深色/键盘/禁用/加载，重点看这次版本相关的控件。
6. **更新本 skill 的基线**：`README.md` 的“版本基线”、`references/01-primitives.md` 的 props、`references/07-catalog.md` 的导出清单与数量，必要时 `02-tokens` / `03-geometry`。
7. **写变更说明**：哪些控件受影响、验过什么、没验什么。

## 兼容策略

- 插件面向哪个 DSH 版本，就在 `package.json` / README 写明；不要声称兼容所有版本。
- 只用公开导出与 README 记录的 props；未文档化的内部字段不保证。
- 原语缺失的 API：先查是否有替代（例如 `anchorRef` 替代 `getAnchorRect`），不要自己实现同名补丁。
- 目标宿主较老、没有某组件：用已有原语组合，或明确要求升级宿主；不要引入自绘副本。

## 版本来源

- 已安装桌面版：`<安装目录>/resources/app.asar/dsh/package.json`（本机核对为 0.2.3-alpha.2）。
- npm：`npm view @deepseek-ai/dsh-client-ui-primitives dist-tags`。
- 源码：`github.com/deepseek-ai/deepseek-harness`，按 tag 对照。

## 本 skill 的维护

每次复核后：

- 更新 `README.md` 基线；
- 在 `references/01-primitives.md` 顶部标注核对版本；
- 若官方规则变化（新 token 层、新材质），同步 `02-tokens.md`；
- 把新踩坑补进 `05-review.md`。
