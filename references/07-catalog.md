# 07 · 完整导出清单（0.2.3-alpha.2）

> 核对对象：`@deepseek-ai/dsh-client-ui-primitives@0.2.3-alpha.2`。`index.ts` 共 **115 个值导出**（不含类型）与 **214 个图标导出**（`export * from './icons/index.tsx'`）。
> 本页回答“有没有漏”；`01-primitives.md` 只展开常用控件与浮层。

## 分类清单

一个导出只归一类，合计 115。

| 类别 | 数量 | 导出 |
|---|---|---|
| 控件与展示 | 17 | `Button` `Switch` `Checkbox` `Input` `InlineEditor` `SegmentedControl` `SegmentedTabs` `Pill` `Tag` `StateDot` `ConnectionIndicator` `DisclosureRow` `PathLabel` `ShortcutKeys` `AnimatedRows` `MarqueeText` `TextShimmer` |
| 浮层与反馈 | 10 | `Tooltip` `HoverCard` `HoverCardGroup` `Menu` `MenuItemButton` `MenuSurface` `MenuGroup` `Modal` `RiskConfirmation` `Toast` |
| 内容渲染 | 14 | `MarkdownText` `MarkdownDelegateProvider` `CodeBlock` `FenceCodeBlock` `FenceMathBlock` `JsonBlock` `JsonTree` `TerminalBlock` `DiffBlock` `ReadBlock` `SearchBlock` `WebBlock` `DetailDocument` `CommandText` |
| 聊天与引用 | 4 | `UserMessageBubble` `UserTextRun` `ReferenceChip` `QuotePreview` |
| 设置表单 | 6 | `SettingsForm` `SettingsFormModel` `SettingsValueField` `SettingsSecretField` `settingsNumberField` `settingsTextField` |
| 专用图标 | 13 | `FileTypeIcon` `LinkIconRegular` `LinkIconMedium` `ReferenceIconRegular` `ReferenceIconMedium` `PermissionIconReadOnlyRegular` `PermissionIconReadOnlyMedium` `PermissionIconWorkspaceWriteRegular` `PermissionIconWorkspaceWriteMedium` `PermissionIconFullAccessRegular` `PermissionIconFullAccessMedium` `PermissionIconAutoReviewRegular` `PermissionIconAutoReviewMedium` |
| 图片与缩放 | 3 | `ImageLightbox` `DraggableImage` `ZoomControls` |
| 品牌与插图 | 11 | `FishLogo` `FISH_LOGO_PATH` `FISH_LOGO_VIEWBOX` `BrandWordmark` `PluginArtworkDefault` `PluginArtworkLoop` `PluginArtworkSearch` `PluginArtworkSubagent` `PluginArtworkTerminal` `GuideArtworkBrowser` `GuideArtworkFiles` |
| 工具 / hooks | 30 | `classifyFileType` `classifyLinkPath` `closeTopModal` `detailDocumentState` `diffTotals` `extractMarkdownPlainText` `fileExtension` `fileSizeText` `focusWithoutRing` `formatQuoteText` `isBehindModal` `isDarwinDesktop` `isMobileDevice` `languageForPath` `modalSelector` `observeComposition` `observeStickyMenuGroups` `pointerModality` `relativeTime` `useAnchoredMaxHeight` `useClipboardCopy` `useCodeHighlighter` `useDetailDocumentLabels` `useDismissOnOutsidePointer` `useHoverMarquee` `useMarkdownDelegate` `useModalLayer` `usePointerGrace` `useRowDragPreview` `writeClipboard` |
| 常量 | 7 | `CODE_HIGHLIGHT_EXTENSIONS` `DEFAULT_DIFF_MAX_LINES` `DEFAULT_READ_MAX_LINES` `DEFAULT_SEARCH_MAX_LINES` `DEFAULT_TERMINAL_MAX_LINES` `DOCUMENT_ZOOM` `MENU_TRANSITION_MS` |

图标子集共 214 个导出（含 `ICON_SYMBOLS` 与描边常量），见「图标」。

## 覆盖矩阵

| 类别 | 01 详细 | 07 清单 | 测试页 |
|---|---|---|---|
| 控件与展示 | 大部分 | 完整 | 大部分 |
| 浮层与反馈 | 大多数 | 完整 | 基本完整（ImageLightbox 未展开） |
| 内容渲染 | 只列名 | 完整 | 部分（Markdown / Code / Json / JsonTree / CommandText） |
| 聊天与引用 | 无 | 完整 | 基本完整 |
| 设置表单 | 只列名 | 完整 | 部分（ValueField / SecretField；完整 SettingsForm 未展开） |
| 专用图标 | 只列名 | 完整 | 部分 |
| 图片与缩放 | 无 | 完整 | 部分（ImageLightbox；ZoomControls 未展开） |
| 品牌与插图 | 无 | 完整 | 未展开 |
| 工具 / hooks | 无 | 完整 | 不适用 |

## 内容渲染器：不要自绘

插件最容易漏的不是按钮，而是**内容展示**：自己写 Markdown、代码高亮、ANSI、diff、JSON 树。这些都有宿主实现。

| 组件 | 用途 | 关键输入 |
|---|---|---|
| `MarkdownText` | 不受信任的 assistant Markdown | `text`、`streaming`、`labels`、`fileMentions` |
| `MarkdownDelegateProvider` / `useMarkdownDelegate` | 让子组件复用 Markdown 的链接/文件提及处理 | 委托函数 |
| `CodeBlock` | 代码块、流式代码、unified diff 行 | `code`、`lang`、`diff`、`streaming`、labels |
| `FenceCodeBlock` / `FenceMathBlock` | Markdown fence 内的代码 / TeX | `code`、`lang`、`streaming`、`labels` |
| `JsonBlock` | 折叠的 JSON fence | `label`、`payload`、`truncatedLabel` |
| `JsonTree` | 可交互 JSON 树 | `data`、`label`、labels |
| `TerminalBlock` | 终端输出、ANSI、退出状态 | 输出、labels、`maxLines` |
| `DiffBlock` | 文件改动卡片 | `diffs`、labels、`maxLines` |
| `ReadBlock` | 文件读取结果 | `lines`、`totalLines`、labels |
| `SearchBlock` | 搜索结果卡片 | 分组/路径、labels、`truncated` |
| `WebBlock` | 网页搜索/抓取卡片 | `kind`、`sources`/`answer`、labels |
| `DetailDocument` | 长 Markdown 详情文档 | `read`、labels、`onRetry` |
| `CommandText` | 命令行文本展示 | 命令行内容 |

共同要求：调用方提供**本地化 labels**（每个组件的字段不同，按 README 或类型声明传齐）；不要自己解析 Markdown、写高亮、处理 ANSI。

## 设置表单

- `SettingsForm`：完整设置表单外壳，负责草稿、保存、覆盖/重置状态。
- `SettingsValueField` / `SettingsSecretField`：单个文本/密文字段控件。
- `SettingsFormModel` + `settingsNumberField` / `settingsTextField`：字段规格与草稿模型。

设置页优先用这套；不要自己拼设置行、自己实现“草稿 → 保存 → 覆盖标记”。

## 聊天与引用

| 组件 | 用途 |
|---|---|
| `UserMessageBubble` | 用户消息的底色、字体与内衬（接受原生 div 属性） |
| `UserTextRun` | 不解释的纯文本 run |
| `ReferenceChip` | 文件/文件夹/session/skill/command 引用 chip；`appearance` + `label` + `title`，可选 `onActivate` |
| `QuotePreview` | 引用摘录；`text`，可选 `summary` / `removal` |
| `formatQuoteText` | 引用文本的格式化工具 |

做聊天式面板时先复用这些，不要自建气泡/引用样式。

## 图标

- 通用图标：214 个，命名 `Icon*OutlineRegular` / `Icon*OutlineMedium`，以及 `Icon*FillRegular` / `Icon*FillMedium`；统一 `{ size, className }`，颜色随 `currentColor`。
- `ICON_SYMBOLS` 供主题替换图标；`ICON_REGULAR_STROKE` / `ICON_MEDIUM_STROKE` 是描边常量。
- 专用图标：`FileTypeIcon`（`path` 或 `kind`）、`LinkIconRegular/Medium`（`kind` + 可选 `href`）、`ReferenceIconRegular/Medium`（`kind`）、`PermissionIcon*`（4 种权限 × 2 种描边）。
- 文件分类工具：`classifyFileType`、`fileExtension`；链接分类：`classifyLinkPath`。

常见含义先找现成图标；不要为文件、链接、权限、目录重画一套。

## 图片与缩放

- `ImageLightbox`：原图预览对话框；`src`、`alt`、`labels`、`onClose`，body portal。
- `DraggableImage`：带原文件拖拽的图片；`fileDrag`、`src`、`name`、可选 `original`。
- `ZoomControls`：文档缩放工具条；`zoom`、`fit`、`labels`、`visible`、`onZoom`、`onActiveChange`；`DOCUMENT_ZOOM` 是共享缩放范围。

## 品牌与插图

`FishLogo`、`FISH_LOGO_PATH`、`FISH_LOGO_VIEWBOX`、`BrandWordmark`、`PluginArtwork*`、`GuideArtwork*` 只用于官方品牌、插件市场/引导等语境；普通插件页面不要拿它们当装饰。

## 工具 / hooks

| 用途 | 导出 |
|---|---|
| 焦点 / 模态 | `focusWithoutRing` `useModalLayer` `closeTopModal` `isBehindModal` `modalSelector` |
| 浮层 | `useAnchoredMaxHeight` `useDismissOnOutsidePointer` `usePointerGrace` `observeStickyMenuGroups` `observeComposition` `pointerModality` |
| 剪贴板 | `useClipboardCopy` `writeClipboard` |
| 文件 / 链接 | `classifyFileType` `fileExtension` `classifyLinkPath` `fileSizeText` |
| 文本 / 时间 | `relativeTime` `formatQuoteText` `extractMarkdownPlainText` |
| Markdown | `useMarkdownDelegate` `useCodeHighlighter` `languageForPath` `detailDocumentState` `useDetailDocumentLabels` |
| 动效 / 列表 | `useHoverMarquee` `useRowDragPreview` |
| 平台 | `isMobileDevice` `isDarwinDesktop` |

常量：`CODE_HIGHLIGHT_EXTENSIONS`、`DEFAULT_{DIFF,READ,SEARCH,TERMINAL}_MAX_LINES`、`DOCUMENT_ZOOM`、`MENU_TRANSITION_MS`。

## 怎么确认没漏

1. 读 `packages/client/ui-primitives/src/index.ts`（或安装产物的 `lib/types/index.d.ts`）。
2. 运行时：`Object.keys(require('@deepseek-ai/dsh-client-ui-primitives'))`。
3. 与本文对照；DSH 升级后按 `06-upgrade.md` 重新核对，并更新本页的数量与清单。
