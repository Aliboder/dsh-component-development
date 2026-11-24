---
name: dsh-official-ui
description: "在开发或评审 DSH Client 插件界面时使用：控件与内容渲染只用 @deepseek-ai/dsh-client-ui-primitives，样式只用 --dsw-* token 与官方几何，按 gallery 与状态清单验收。触发于新增或修改按钮、开关、输入、页签、弹窗、菜单、提示、面板、设置页、Markdown/代码/JSON 展示，或用户说插件界面不像 DSH 官方、要求对齐样式时。"
---

# 对齐 DSH 官方界面

**官方外观不是一套 CSS，而是宿主原语 + 官方 token + 官方几何。** 插件界面的任务是把它们组装起来，不是画一套像的。

## 何时使用

- 插件里要新增/修改任何可见控件或页面。
- 用户说“和 DSH 风格不一致”“像 AI 画的”“按钮/弹窗/设置页不对”。
- 评审一个插件的 UI。

**不用**：纯 Host 逻辑、无界面的工具、非 DSH 宿主的前端。

## 五条硬规则

1. **控件和内容渲染只用宿主原语。** `require('@deepseek-ai/dsh-client-ui-primitives')`；它在外壳的模块基座里，直接可用，不需要在 `dsh.client.external` 声明。构建时把它保留为 external，不要打进插件包。
2. **不写 fallback 复刻版。** 宿主原语在 DSH 里始终存在；另画一份只会随版本漂移。只有明确支持非 DSH 宿主时才隔离降级实现，且不得进入 DSH 产物。
3. **颜色、圆角、阴影只用 `--dsw-*`。** 不写十六进制、`rgb()/hsl()`、`white/black`；中性发丝线 `0.5px`；有 elevation 的表面不再加边框。
4. **不自造主题分支。** `light` / `dark` / `system` 由宿主解析；插件不读主题、不监听 `matchMedia`、CSS 不写 `[data-ds-dark-theme]` 或 `@media (prefers-color-scheme)`。内容固定配色的例外（视频/音乐/图片）见 `references/02-tokens.md`。
5. **先验证再交付。** 脚本 0 error、gallery 有对应用例、看过浅色/深色/键盘/禁用/加载；没看过的状态不要写“已验证”。

## 先取真值，再动手

按顺序：

1. `dsh --version` 记录宿主版本。
2. 已安装主题 token：`<DSH>/resources/app.asar/dsh/node_modules/@deepseek-ai/dsh-client-ui-theme/src/styles/*.css`（或 profile 的 `node_modules`）。这是**当前版本的 token 真值**。
3. 对应版本的原语 README（npm / GitHub tag）。`references/01-primitives.md` 是 0.2.3-alpha.2 的核对结果；`references/07-catalog.md` 是完整清单（115 个值导出 + 214 个图标）。
4. 官方文档：见 `references/00-official-docs.md`（`web-styling`、`ui-radius`、`ui-design-review-cases`、`ui-primitives README`）。

版本不一致时：**以已安装产物为准**，并在交付说明里写“按 X 版本核对”。

## 工作流

| 步骤 | 做什么 | 交付 |
|---|---|---|
| 1 判断范围 | 只换控件 / 新界面 / 评审 | 一句话范围 |
| 2 选控件 | 查原语目录；缺则组合；再缺停下 | 控件与 props 清单 |
| 3 组装 | 原语 + token 布局；不复制原语样式 | 代码 |
| 4 验证 | gallery 用例 + `node scripts/check-ui.mjs` | 截图/检查结果 |
| 5 交付 | 写清版本、用到的原语、验过的状态 | 变更说明 |

## 选型

| 需求 | 做法 |
|---|---|
| 原语有该控件 | 直接用；视觉差异只能作为原语的新 prop，不能本地改 |
| 原语只有基础件 | 用基础件组合（Tooltip + Button = 图标按钮） |
| 原语没有、纯展示 | 用 token 本地实现，几何对齐最近的原语 |
| 原语没有、交互复杂 | 停下，说明缺口；不要临时自绘 |
| 只是容器/布局 | 不需要控件，直接用 token 排布 |
| 渲染 Markdown / 代码 / 终端 / Diff / 搜索 / 网页 / JSON | `MarkdownText` / `CodeBlock` / `TerminalBlock` / `DiffBlock` / `SearchBlock` / `WebBlock` / `JsonTree`；不要自建 |
| 设置页 | `SettingsForm` + `SettingsValueField` / `SettingsSecretField` |
| 文件 / 链接 / 引用 / 权限图标 | `FileTypeIcon` / `LinkIcon*` / `ReferenceIcon*` / `PermissionIcon*` |
| 快捷键键帽 | `ShortcutKeys` |
| 聊天 / 引用 | `UserMessageBubble` / `ReferenceChip` / `QuotePreview` |

## 最小代码

```js
const React = require('react')
const ui = require('@deepseek-ai/dsh-client-ui-primitives')
const h = React.createElement

h(ui.Button, { variant: 'primary', onClick: save }, '保存')
h(ui.Switch, { checked: on, label: '启用', onChange: setOn })
h(ui.Input, { value: text, placeholder: '搜索', onChange: e => setText(e.target.value) })
```

注意 `Input` 的 `onChange` 是原生事件（取 `e.target.value`）；`Switch` / `Checkbox` 收布尔值。

## 反例 → 正例

```js
// ✗ 自绘：颜色写死、几何随意、没有可访问名称
h('button', { className: 'btn', onClick: save }, '保存')

// ✓ 宿主原语：视觉、焦点、禁用、深色都由官方实现
h(ui.Button, { variant: 'primary', onClick: save }, '保存')
```

```css
/* ✗ */
.btn { background: #111; border-radius: 10px; border: 1px solid #333; }

/* ✓ 容器可以用 token 排布；控件本身仍然用原语 */
.row { display: flex; gap: 8px; padding: 12px; border-radius: var(--dsw-radius-md); }
```

## 拿不准时

打开 DSH 自己的设置页/原生控件，按真实渲染对照：高度、圆角、内衬、字重、图标盒、焦点环。**不要凭记忆写数值。**

## 高频坑

| 现象 | 原因 |
|---|---|
| 按钮太素/没底色 | `Button` 默认 `variant="ghost"`，主操作要显式 `primary` |
| 输入框取值拿到 event | `Input` 是原生 input 包装，`onChange` 收 event |
| 开关没有名字 | `Switch label` 必填 |
| 弹窗无法关闭/无标题 | `Modal` 需要 `open/onClose/title`，非 headless 还要 `closeLabel` |
| 页签 id 冲突 | `SegmentedControl` 需要稳定 `id` 派生 tab/panel id |
| 提示框点了不消失 | `Toast` 必须在 `onDone` 里卸载 |
| 菜单定位错 | `Menu` 的 `anchor` 传元素（不是 ref），`onSelect` 收 id |
| 抄了类名升级后失效 | 静态库类名是构建哈希，只能抄值/token |
| 深色下白底白字 | 用了写死颜色或主题分支；改用 alias token |
| 切换主题不生效 | JS 里用 `matchMedia` 算了一次颜色；让 token 解析 |
| 自己写 Markdown / 代码高亮 / ANSI / diff | 用 `MarkdownText` / `CodeBlock` / `TerminalBlock` / `DiffBlock` |
| 自己拼设置行与保存流程 | 用 `SettingsForm` 一族 |
| 自绘文件 / 链接 / 权限图标 | 用专用图标组件，或 214 个通用 `Icon*` |

## 验收门禁

```text
[ ] node scripts/check-ui.mjs 0 error（可用 --root 限定本次改动）
[ ] 每个新控件在 gallery 有用例
[ ] 浅色 + 深色 + system + 键盘焦点 + 禁用/加载/错误
[ ] 无 hex / rgb / white / black；无 1px 中性边框
[ ] 无 [data-ds-dark-theme]、无 ::-webkit-scrollbar
[ ] 文案走本地化，不写死中文
[ ] 内容渲染、设置表单、专用图标没有自绘
[ ] 交付说明写了宿主版本与未验证项
```

## 停止条件

- 原语缺组件且组合不出来。
- 需要新 token 或新视觉语言。
- 无法跑 gallery/检查（没有可见入口、无法启动宿主）。
- 规范与现有代码冲突，且改动会波及公共样式。

## 参考

| 文件 | 内容 |
|---|---|
| `references/00-official-docs.md` | 官方文档入口与阅读顺序 |
| `references/01-primitives.md` | 原语目录、核心 props、组合方式、图标 |
| `references/02-tokens.md` | token 分层、明暗、材质、发丝线、例外 |
| `references/03-geometry.md` | 圆角/尺寸/间距/对齐/字重 |
| `references/04-gallery.md` | 组件测试页协议 |
| `references/05-review.md` | 评审清单与常见失败 |
| `references/06-upgrade.md` | DSH 升级后的复核 |
| `references/07-catalog.md` | 完整导出清单：115 个值导出 + 214 个图标、覆盖矩阵 |
| `templates/gallery.js` | 可直接挂载的测试页 |
| `templates/settings-section.js` | 设置卡片/行的标准组合 |
| `scripts/check-ui.mjs` | 静态检查（`--root` 限定范围，`--ignore` 排除历史文件） |
