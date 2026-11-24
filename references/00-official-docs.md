# 00 · 官方文档索引

> 本 skill 不复制官方规范的所有权：数值、组件规则、评审基准仍以官方文档为准。下面是公开入口，按任务读，不要一次全读。

| 文档 | 解决什么 | 何时读 |
|---|---|---|
| [Web UI 样式参考](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/web-styling.zh.md) | 样式职责、组件规则、发丝线、elevation、菜单材质、链接、hover | 写任何 CSS 前 |
| [统一圆角规范](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/ui-radius.zh.md) | 圆角档位、控件尺寸、嵌套、设置卡片材质 | 选圆角/改控件尺寸时 |
| [UI 设计评审案例](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/ui-design-review-cases.zh.md) | 对齐、分组、密度、层级、整页评审的判断案例 | 评审或拿不准时 |
| [ui-primitives README](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-primitives/README.zh.md) | 组件目录、行为、焦点、菜单、输入法、已知限制 | 选控件/查 props 时 |
| [Web Client 架构](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/web-client) | 分层、slots、Client model | 不确定代码该放哪层时 |
| [Client Modules](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/client-modules) | 模块基座、external、bundle 加载 | 构建/加载原语出问题时 |
| [官方 UI skill（内部）](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/skills/dsh-client-ui-ux/SKILL.md) | 官方自己的 UI 工作流与评审强度分级 | 想看官方怎么要求自己时 |
| [npm 包](https://www.npmjs.com/package/@deepseek-ai/dsh-client-ui-primitives) | 版本、dist-tags、README | 核对目标版本时 |

## 版本说明

- 本 skill 核对基线：DSH **0.2.3-alpha.2**。
- `master` 文档会随版本变化；离线或版本不一致时，以已安装产物为准：
  - 主题 token：`<DSH>/resources/app.asar/dsh/node_modules/@deepseek-ai/dsh-client-ui-theme/src/styles/*.css`
  - 原语：`<DSH>/resources/app.asar/dsh/node_modules/@deepseek-ai/dsh-client-ui-primitives`（若安装产物包含）或 npm 对应版本。
- 找不到文档时：先读本 skill 的 `01-primitives.md` / `02-tokens.md` / `03-geometry.md`，再按 `06-upgrade.md` 补核对。

## 阅读顺序

```text
写界面：00（本文） → 01 原语 → 02 token → 03 几何 → 04 gallery → 05 评审
查全组件：07 完整清单（115 个值导出 + 214 个图标）
升级：06 → 01/02/03/07 中受影响的部分
```
