# 01 · 宿主原语

> 事实基线：DSH 0.2.3-alpha.2。原语属于 Web 外壳的共享模块基座，插件直接使用；不需要实现副本。

## 怎么加载

```js
const React = require('react')
const ui = require('@deepseek-ai/dsh-client-ui-primitives')
const h = React.createElement
```

- 该包在 `packages/client/web/src/platform.ts` 的 `PLATFORM_MODULES` 里，是**隐式 external**：插件不需要在 `dsh.client.external` 里声明，也不要把 `react` 或原语包打进自己的 bundle。
- 只在浏览器侧 bundle（`exports["./client"]`）里引用；Host 侧（Node）不要 require。
- 与插件是否安装主题包、slot 包无关；原语只依赖 React 和 `--dsw-*` token。
- 如果构建工具需要标记 external，把它和 `react` 一样处理。

CSS：原语样式由外壳的静态库机制安装，插件**不要**复制或覆盖它的类名。插件自己的样式用 CSS Modules + `clsx`，颜色只读 token。

## 导出目录

> 完整清单（**115 个值导出 + 214 个图标**）见 `07-catalog.md`。本页只展开控件与常用浮层。

| 类别 | 导出 |
|---|---|
| 操作 | `Button` |
| 表单 | `Switch` `Checkbox` `Input` `InlineEditor` |
| 分段 | `SegmentedControl` `SegmentedTabs` `Pill` |
| 徽标/状态 | `Tag` `StateDot` `ConnectionIndicator` |
| 键帽 | `ShortcutKeys` |
| 浮层 | `Tooltip` `HoverCard` `HoverCardGroup` `Menu` `MenuItemButton` `MenuSurface` `MenuGroup` `Modal` `RiskConfirmation` |
| 反馈 | `Toast` |
| 列表/路径 | `DisclosureRow` `PathLabel` `MarqueeText` `AnimatedRows` `TextShimmer` |
| 内容渲染 | `MarkdownText` `MarkdownDelegateProvider` `CodeBlock` `FenceCodeBlock` `FenceMathBlock` `JsonBlock` `JsonTree` `TerminalBlock` `DiffBlock` `ReadBlock` `SearchBlock` `WebBlock` `DetailDocument` `CommandText` |
| 聊天/引用 | `UserMessageBubble` `UserTextRun` `ReferenceChip` `QuotePreview` |
| 设置表单 | `SettingsForm` `SettingsFormModel` `SettingsValueField` `SettingsSecretField` `settingsNumberField` `settingsTextField` |
| 图标 | 214 个 `Icon*`（Regular/Medium）、`ICON_SYMBOLS`、`FileTypeIcon`、`LinkIcon*`、`ReferenceIcon*`、`PermissionIcon*` |
| 图片/缩放 | `ImageLightbox` `DraggableImage` `ZoomControls` |
| 品牌/插图 | `FishLogo` `FISH_LOGO_PATH` `FISH_LOGO_VIEWBOX` `BrandWordmark` `PluginArtwork*` `GuideArtwork*` |
| 工具/hooks | `focusWithoutRing` `useModalLayer` `closeTopModal` `isBehindModal` 等（见 `07-catalog.md`） |

完整导出以 `packages/client/ui-primitives/src/index.ts` 或安装产物的类型声明为准；升级后先核对目标版本。

### 补充组件速查

| 组件 | 关键 props |
|---|---|
| `ShortcutKeys` | `keys`（如 `['Ctrl', '+', 'K']`）、`variant: 'plain' \| 'tooltip'` |
| `FileTypeIcon` | `path` 或 `kind`、`size` |
| `LinkIconRegular` / `LinkIconMedium` | `kind`、可选 `href`、`size` |
| `ReferenceIconRegular` / `ReferenceIconMedium` | `kind: 'session' \| 'file' \| 'folder'`、`size` |
| `PermissionIcon*` | 4 种权限 × Regular/Medium，接 `{ size, className }` |
| `UserMessageBubble` | 原生 div 属性 + children |
| `UserTextRun` | `text` |
| `ReferenceChip` | `appearance`、`label`、`title`、可选 `onActivate` |
| `QuotePreview` | `text`、可选 `summary` / `removal` |
| `ImageLightbox` | `src`、`alt`、`labels`、`onClose` |
| `ZoomControls` | `zoom`、`fit`、`labels`、`visible`、`onZoom`、`onActiveChange` |

### 内容与设置：不要自绘

- **内容**：`MarkdownText`、`CodeBlock` / `FenceCodeBlock` / `FenceMathBlock`、`JsonBlock` / `JsonTree`、`TerminalBlock`、`DiffBlock`、`ReadBlock`、`SearchBlock`、`WebBlock`、`DetailDocument`。不要自己解析 Markdown、写代码高亮、处理 ANSI 或 diff。
- **设置**：`SettingsForm` + `SettingsValueField` / `SettingsSecretField` + `SettingsFormModel`。不要自己拼设置行、草稿和保存逻辑。
- 这些组件都要求调用方提供本地化 labels；字段较多，按 `07-catalog.md` 与 README/类型声明传齐。

## 核心控件

### Button

| prop | 值 |
|---|---|
| `variant` | `primary` \| `ghost`（默认）\| `outline` \| `toolbar` |
| `size` | `md` 36px / `sm` 28px |
| `icon` | 前置 16px 图标节点 |
| 其他 | 原生 `button` 属性；`ref` 指向原生按钮 |

```js
h(ui.Button, { variant: 'primary', onClick: save }, '保存')
h(ui.Button, { variant: 'outline', icon: h(ui.IconChevronDownOutlineRegular, { size: 16 }) }, '更多')
```

主操作必须显式 `variant: 'primary'`。`ghost` 是默认值，不是“所有按钮都长这样”。

### Switch

```js
h(ui.Switch, { checked: enabled, label: '启用同步', onChange: setEnabled, disabled: saving })
```

`checked` / `onChange(next: boolean)` / `label`（必填，作为无障碍名称）/ `disabled` / `title` / `autoFocus` / `describedBy`。几何固定 36×20，不要改尺寸。

### Checkbox

```js
h(ui.Checkbox, { checked: agree, label: '我已了解', onChange: setAgree })
```

`onChange(next: boolean)`；`modalAutofocus` 用于把弹窗初始焦点放在这个复选框上。

### Input

```js
h(ui.Input, {
  value: query,
  placeholder: '搜索',
  icon: h(ui.IconSearchOutlineRegular, { size: 16 }),
  onChange: event => setQuery(event.target.value),
})
```

**这是原生 `input` 的包装**：`onChange` 收 React 事件，取 `event.target.value`；其他 `input` 属性透传，`ref` 指向原生输入框。高 32px，内衬 `0 8px`，圆角 `--dsw-radius-md`。多行草稿用 `InlineEditor`。

### SegmentedControl

```js
h(ui.SegmentedControl, {
  id: 'view-mode',
  value: mode,
  label: '视图模式',
  options: [
    { value: 'list', label: '列表' },
    { value: 'grid', label: '网格' },
  ],
  onChange: setMode,
})
```

- 用于“切换一张卡片/面板的几种模式”，至少两段。
- `id` 必须稳定且唯一：每段 tab 是 `${id}-${value}`，面板是 `${id}-${value}-panel`。调用方渲染面板并用 `aria-labelledby` 指回 tab。
- 几何：外层 R12 + 4px 内衬，段高 28、R8、13/20。

### SegmentedTabs

```js
h(ui.SegmentedTabs, {
  label: '设置分区',
  value: tab,
  items: [
    { value: 'general', label: '通用', id: 'tab-general', panelId: 'panel-general' },
    { value: 'about', label: '关于', id: 'tab-about', panelId: 'panel-about' },
  ],
  onChange: setTab,
})
```

`size: 'md'`（默认，tab 34px、总高 42px）或 `'sm'`（tab 30px、总高 34px）。`items` 非空，id/panelId 由调用方提供。

### Pill / Tag / StateDot

```js
h(ui.Pill, { active: filter === 'all', onClick: () => setFilter('all') }, '全部')
h(ui.Tag, { tone: 'success' }, '已连接')
h(ui.StateDot, { state: 'ongoing' })
```

- `Pill`：24px 胶囊；传 `onClick` 才是按钮，否则是静态 span；`active` 只表示选中。
- `Tag`：只读徽章，`tone` = `outline`（默认）/`solid`/`neutral`/`quiet`/`success`/`info`/`warning`/`danger`。
- `StateDot`：`state` = `done`/`warning`/`ongoing`/`error`/`idle`，`appearance` = `dot`/`step`；`aria-hidden`，旁边必须有文字。

### Tooltip

```js
h(ui.Tooltip, { label: '刷新' },
  h(ui.Button, { variant: 'ghost', 'aria-label': '刷新', icon: h(ui.IconRefreshOutlineRegular, { size: 16 }), onClick: reload }))
```

只接受**单个** anchor 元素；`portal: true` 可逃出裁剪容器；`shortcutKeys` 显示键帽。图标按钮必须有 `aria-label`，`Tooltip` 只是视觉提示，不能代替读屏名称。

### Modal

```js
h(ui.Modal, {
  open: open,
  onClose: close,
  title: '删除对话',
  closeLabel: '关闭',
  description: '删除后无法恢复。',
  footer: [
    h(ui.Button, { key: 'cancel', onClick: close }, '取消'),
    h(ui.Button, { key: 'delete', variant: 'primary', onClick: remove }, '删除'),
  ],
}, h('p', null, '…'))
```

- `open` / `onClose` / `title` 必填；非 headless 还必须给 `closeLabel`，否则会抛错。
- `tone: 'warning'` 用 Amber 标题图标；`headless` 只保留遮罩、卡片与 Esc 处理。
- 初始焦点：在目标控件上加 `data-modal-autofocus`，不要用 React `autoFocus`（会破坏焦点归还）。

### Menu / MenuItemButton

```js
h(ui.Menu, {
  open: menuOpen,
  anchor: h(ui.Button, { variant: 'outline', onClick: () => setMenuOpen(true) }, '更多'),
  items: [
    { id: 'rename', label: '重命名', shortcut: { keys: ['F2'] } },
    { type: 'separator', id: 'sep-1' },
    { id: 'delete', label: '删除', danger: true },
  ],
  onSelect: id => { setMenuOpen(false); run(id) },
  onClose: () => setMenuOpen(false),
})
```

- `anchor` 是**元素**（渲染在原位），不是 ref；需要坐标打开时用 `anchorPoint`。
- `items` 支持数据行、`{ type: 'separator' }`、`{ type: 'label' }`；`selectedId` 显示勾选。
- 行内需要自定义组件时，用 `children` + `MenuItemButton`（`onSelect`）。
- 不要自己画下拉：定位、翻转、焦点归还、Esc/方向键都由 `Menu` 负责。

### Toast

```js
toast && h(ui.Toast, { text: '已保存', tone: 'success', onDone: () => setToast(null) })
```

`onDone` 里必须卸载；`holdMs` 默认 3000；`actions` 可带行内动作。宿主应在不会被面板关闭带走的容器里持有 Toast。

### DisclosureRow

用于 24px 的紧凑折叠行（思考过程、工具调用）。`icon` / `title` / `open` / `expandable` / `onToggle` 必填；`running` 触发扫光；`expandOnRowClick` 让整行可点。

## 图标

- 从同一个包取：`h(ui.IconSearchOutlineRegular, { size: 16 })`。
- 常规 16px；紧凑场景 12/14px；警告标题 18px。
- 不复制 SVG、不重画已有图标；确需新图标时按官方图形规范绘制，并在交付说明里写原因（见 `references/05-review.md`）。

## 组合，而不是复制

原语没有的组合，用原语拼：

```js
function IconButton({ label, icon, onClick }) {
  return h(ui.Tooltip, { label },
    h(ui.Button, { variant: 'ghost', 'aria-label': label, icon, onClick }))
}
```

组合件要遵守同样的几何与可访问性；不要为了“看起来一样”改原语内部样式。

## 常见错误

| 错误 | 正确 |
|---|---|
| 自己写 `<button class="btn">` | `ui.Button` |
| 把 `Input` 当受控 `(value) => void` | 取 `event.target.value` |
| 用 `<select>` 做下拉 | `ui.Menu` / `SegmentedControl` / `SettingsForm` 的字段 |
| 复制 `Button.module.css` 的值 | 直接用组件，或读 token |
| 覆盖原语类名/哈希类名 | 不改；需要差异就提 prop |
| 图标按钮只给 `title` | `aria-label` + `Tooltip` |
| 自己解析 Markdown / 写代码高亮 / 处理 ANSI / diff | `MarkdownText` / `CodeBlock` / `TerminalBlock` / `DiffBlock` / `JsonTree` |
| 自己拼设置行、草稿与保存 | `SettingsForm` + `SettingsValueField` / `SettingsSecretField` |
| 自己画文件/链接/引用/权限图标 | `FileTypeIcon` / `LinkIcon*` / `ReferenceIcon*` / `PermissionIcon*` |
| 自己画快捷键键帽 | `ShortcutKeys` |
| 自建用户气泡/引用样式 | `UserMessageBubble` / `ReferenceChip` / `QuotePreview` |

## 原语缺失时

1. 先看能不能用两个原语组合。
2. 纯展示且无交互：用 token 本地实现，几何对齐最近的原语。
3. 复杂交互（焦点陷阱、拖拽、虚拟列表）：**停下**，说明缺口，不要临时自绘。

## 不要做

- 不要自己解析 Markdown、写代码高亮、处理 ANSI / diff / JSON 树；用内容渲染器。
- 不要自己拼设置表单、草稿与保存流程；用 `SettingsForm` 一族。
- 不要为文件、链接、引用、权限、快捷键重画图形；先查 214 个通用图标与专用图标。
- 不要拿 `FISH_LOGO_PATH` / `PluginArtwork*` / `GuideArtwork*` 给普通插件页面做装饰。
