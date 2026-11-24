# DSH 组件样式对齐 skill

仓库：https://github.com/Aliboder/dsh-component-development

让 DSH Client 插件的界面和 DeepSeek Harness 官方界面看起来是同一套东西：控件直接用宿主原语，颜色/圆角/阴影只用官方 token，几何按官方规范，交付前有可执行的检查。

## 它解决什么

插件（尤其由 AI 写的插件）经常自己画按钮、开关、弹窗：颜色写死、圆角随意、发丝线 1px、深色主题白底白字，和同屏官方控件放在一起很明显。

这个 skill 把“对齐”拆成三件可执行的事：

1. **控件来自宿主**：`@deepseek-ai/dsh-client-ui-primitives` 是 Web 外壳的基座模块，插件直接 `require` 即可，不需要自己实现一份。
2. **样式来自 token**：颜色、圆角、阴影、字号只读 `--dsw-*`；不发明白色/十六进制，不写主题分支。
3. **结果可验证**：`scripts/check-ui.mjs` 扫硬编码与违规写法，`templates/gallery.js` 提供组件测试页，按浅色/深色/键盘/状态逐项看。

## 和官方文档的关系

官方文档（`web-styling`、`ui-radius`、`ui-design-review-cases`、`ui-primitives README`）是**规范所有者**；本 skill 不重写它们，而是：

- 把第三方插件作者最需要的部分压缩成决策规则与可复制代码；
- 补上官方文档没覆盖的第三方场景：模块基座加载、内容固定配色、gallery、静态检查、升级复核；
- 明确版本基线，升级时按 `references/06-upgrade.md` 复核。

## 安装

把整个仓库目录放到 DSH 会扫描的 skill 根目录之一：

```text
<项目>/.dsh/skills/dsh-official-ui/       项目级，优先级最高
<项目>/.agents/skills/dsh-official-ui/     项目级（跨工具）
~/.dsh/skills/dsh-official-ui/            用户级
```

Windows 示例：

```powershell
Copy-Item -Recurse .\* "$env:USERPROFILE\.dsh\skills\dsh-official-ui"
```

macOS / Linux：

```bash
mkdir -p ~/.dsh/skills/dsh-official-ui
cp -R . ~/.dsh/skills/dsh-official-ui/
```

DSH 会在下一次模型步骤自动发现，无需重启。

## 使用

- 正常说需求即可：`给插件加一个设置页`、`这个弹窗和 DSH 风格不一致`。
- 需要强制加载时：让 AI 加载 `dsh-official-ui` skill。
- 交付前让 AI 跑：`node scripts/check-ui.mjs`。

## 内容

| 路径 | 作用 |
|---|---|
| `SKILL.md` | 入口：触发、五条硬规则、工作流、选型、高频坑、门禁 |
| `references/00-official-docs.md` | 官方文档入口与阅读顺序 |
| `references/01-primitives.md` | 原语加载、导出目录、核心 props、组合、图标 |
| `references/02-tokens.md` | token 分层、明暗、材质、发丝线、例外 |
| `references/03-geometry.md` | 圆角/尺寸/间距/对齐/字重 |
| `references/04-gallery.md` | 组件测试页协议 |
| `references/05-review.md` | 评审清单与常见失败 |
| `references/06-upgrade.md` | DSH 升级后的复核 |
| `references/07-catalog.md` | 完整导出清单（115 + 214）、覆盖矩阵 |
| `templates/gallery.js` | 可挂载的测试页 |
| `templates/settings-section.js` | 设置卡片/行的标准组合 |
| `scripts/check-ui.mjs` | 扫描插件源码的静态检查 |

## 检查范围

默认扫描 `src/client`（没有则 `src`，再没有则当前目录）。历史大仓先限定范围：

```bash
node scripts/check-ui.mjs --root src/client/settings
node scripts/check-ui.mjs --ignore "styles/theme.js"
```

或在项目根写 `.dsh-ui-check.json`：

```json
{ "ignore": ["styles/theme.js"], "contentFixed": ["styles/art/**"] }
```

## 自检

改这个 skill 本身时跑：

```bash
node test/check-ui.test.mjs
node scripts/check-ui.mjs --root templates
```

## 版本基线

```text
skill        0.1.0
核对 DSH     0.2.3-alpha.2（Windows Desktop）
核对日期     2026-11-24
```

原语列表与 props 按该版本核对；token 以已安装主题包 `src/styles/*.css` 为准。DSH 升级后先读 `references/06-upgrade.md`。

## 边界

- 不修改 DSH 宿主，不新增官方 token 或新的视觉语言。
- 不提供通用 UI 组件库；只负责“和宿主一致”。
- 不替插件作者写业务逻辑。

## 许可

MIT。文中引用的 DSH 文档与组件归其各自所有者。
