# 02 · Token 与材质

> token 值以已安装的 `@deepseek-ai/dsh-client-ui-theme/src/styles/*.css` 为准（本文件按 0.2.3-alpha.2 核对）。这里只写“怎么用”，不复制整份清单。

## 三层 token

| 层 | 例子 | 谁用 |
|---|---|---|
| 静态色板 `--dsw-static-*` | `--dsw-static-neutral-bluish-50` | 只允许主题层与“内容固定配色”例外 |
| 语义别名 `--dsw-alias-*` | `--dsw-alias-label-primary` | 插件功能样式**唯一**颜色来源 |
| 组件/场景 token | `--dsw-elevation-*` `--dsw-focus-ring-*` `--dsw-menu-surface-fill` `--dsw-radius-*` | 对应材质与几何 |

插件 CSS 只读语义别名和场景 token；**不写** `--dsw-static-*`、不写十六进制、`rgb()/rgba()/hsl()`、`white`、`black`。

## 按用途取 token

| 用途 | token |
|---|---|
| 主文字 | `--dsw-alias-label-primary` |
| 次文字 | `--dsw-alias-label-secondary` |
| 弱文字/说明 | `--dsw-alias-label-tertiary` |
| 彩色底上的文字 | `--dsw-alias-label-primary-foreground`、`--dsw-alias-label-on-color` |
| 页面底 | `--dsw-alias-bg-base` |
| 分层底 | `--dsw-alias-bg-layer-1` / `-2` / `-3` |
| 平台模块底 | `--dsw-alias-bg-module-platform` |
| 遮罩 | `--dsw-alias-bg-mask-1` / `-2` / `-3` |
| 普通描边/分割线 | `--dsw-alias-border-l1` ~ `-l4`（按层级） |
| 选中描边 | `--dsw-alias-border-selected` |
| 悬停底 | `--dsw-alias-interactive-bg-hover` |
| 按下/选中底 | `--dsw-alias-interactive-bg-active` |
| 品牌 | `--dsw-alias-brand-primary`、`--dsw-alias-brand-text` |
| 状态 | `--dsw-alias-state-done-primary`、`-error-primary`、`-warn-primary`、`-success-primary`、`-idle-primary` |
| 主按钮 | `--dsw-alias-button-primary-fill` / `-hover` / `-dimmed` |
| 浮起按钮 | `--dsw-alias-button-floating-fill` / `-hover` |
| 工具栏按钮 | `--dsw-alias-button-tool-bar-fill` / `-hover` |
| 卡片 | `--dsw-alias-card-fill`、`--dsw-alias-settings-card-fill` / `-stroke` |
| 提示/浮窗 | `--dsw-alias-tooltip-bg` / `-label`、`--dsw-alias-toast-bg` / `-label` |
| 菜单 | `--dsw-menu-surface-fill`、`--dsw-specific-menu` |
| 阴影 | `--dsw-elevation-panel` / `-prominent` / `-soft` |
| 焦点环 | `--dsw-focus-ring-color`（兜底 `--dsw-alias-state-business-primary`）、`--dsw-focus-ring-width` |
| 发丝线 | `0.5px`，或 `var(--dsh-hairline-width, 0.5px)` |
| 圆角 | `--dsw-radius-xs/sm/md/lg/xl/panel` |

完整列表见主题包 `design-platform.css` 与 `gradient-shadow-text.css`（elevation 在该文件）。

## 六条样式规则

1. **颜色只用别名。** 不在其中写颜色字面量；透明度 0 的 `rgba()` 是唯一例外。
2. **发丝线统一 0.5px。** 中性描边、输入框、卡片、行分割线、菜单分割线都用它；`dashed` 和状态色边框保留 1px。
3. **高表面用 elevation，不再叠边框。** 菜单、浮层、对话框、面板、悬浮按钮、输入框：`border: 0` + `box-shadow: var(--dsw-elevation-panel|prominent|soft)`；阴影已含 0.5px 描边。不要把 `--dsw-alias-border-*` 的 `border` 和 `elevation` 配在一起。
4. **不写主题选择器。** 插件 CSS 不出现 `[data-ds-dark-theme]`、`@media (prefers-color-scheme: dark)`；明暗由别名解析。
5. **hover 只在 hover 设备上生效。** `@media (hover: hover)` 包住 `:hover`；选中、按下、焦点样式放在外面。
6. **字重 ≤500。** 强调用字号或颜色，不用 600/700；字号与行高成对，优先继承界面字号（`--dsh-content-font-size`）。

## 尺寸与字体

- 正文/控件文字：14/22；细节行 13/20；小号 12/18。不要为单个元素发明新字号。
- 设置卡片：`--dsw-radius-xl` + `0.5px solid var(--dsw-alias-settings-card-stroke)` + `background: var(--dsw-alias-settings-card-fill)`。
- 输入框：高 32，内衬 `0 8px`，`--dsw-radius-md`，阴影用 `--dsw-elevation-soft`。
- 代码/终端：等宽字体走主题的 `--ds-font-family-code`，不要写字体栈。

## 可点击文本（链接）

`color: var(--dsw-alias-link)`；`font-weight: 500`；默认无下划线，hover/focus 用点状下划线、3px offset。不要用默认蓝色或浏览器下划线。

## 菜单与滚动条

- 菜单一律用 `Menu` / `MenuSurface`；不要覆盖 `--dsw-menu-surface-fill` 或 `--dsw-menu-backdrop-filter`。
- 滚动条用共享样式，不写 `::-webkit-scrollbar` 组件规则。

## 主题跟随（浅色 / 深色 / 系统）

DSH 的 `light` / `dark` / `system` 由宿主解析（`system` 跟随操作系统），在 `body` 上设置 `data-ds-dark-theme` 并把别名解析成对应值。插件**不读取主题、不监听 `matchMedia`、不存储偏好**，只读 `--dsw-alias-*`；切换时页面即时变化，不需要刷新。

- 不写 `[data-ds-dark-theme]`、`@media (prefers-color-scheme)`。
- 不在 JS 里用 `matchMedia('(prefers-color-scheme: dark)')` 给 UI 选色；canvas / 图像内容确需例外时，加 `dsh-ui-allow` 并写原因。
- 不缓存颜色值，不在挂载时算一次主题。
- 分层不要只靠 `--dsw-alias-bg-layer-1/2/3` 的色差：当前两个主题里它们可能解析到同一中性底，层级要靠 elevation / 描边区分。
- 验证：设置 → 外观依次切 `light` / `dark` / `system`，保持页面不刷新；看文字对比、禁用、输入、选中、焦点环、图标、图片边框。

## 例外：内容固定配色的深色面

视频、音乐、图片、封面这类内容本身决定配色的面，可以固定为深色，不跟随主题。做法：**只在岛根重绑别名**，子控件继续读别名。

```css
/* dsh-ui file-role: content-fixed — 音乐播放器封面区，固定深色 */
.player-surface {
  --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-50);
  --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-300);
  --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-400);
  --dsw-alias-label-primary-foreground: var(--dsw-static-neutral-bluish-1000);
  --dsw-alias-bg-module-platform: var(--dsw-static-neutral-bluish-800);
  --dsw-alias-brand-primary: var(--dsw-static-neutral-bluish-50);
  --dsw-alias-switch-thumb: var(--dsw-static-neutral-bluish-400);
  --dsw-alias-border-l3: rgba(255, 255, 255, 0.16);
}
```

要求：

- 只在岛根写一次，不在每个控件上重复；
- 文件顶部标记 `dsh-ui file-role: content-fixed`，说明为什么必须固定；
- 浅色/深色两种主题下都看一遍（岛本身不变，但周围与焦点环会变）；
- 不是“我喜欢深色”的理由；普通设置页、弹窗、列表不要用。

## 运行时读值

需要确认当前解析值时：

```js
getComputedStyle(document.body).getPropertyValue('--dsw-alias-label-primary').trim()
```

它用于调试和核对，不要把读到的值写回 CSS。

## 不要做

- 不复制 `--dsw-static-*` 的色值到功能样式。
- 不在插件里定义全局主题或新 token 前缀。
- 不使用 Tailwind 或第三方组件库（官方规范明确禁止）。
- 不覆盖原语的材质/类名/哈希类名。
