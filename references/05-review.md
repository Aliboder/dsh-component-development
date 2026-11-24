# 05 · 评审清单

## 交付前逐条过

### 控件

- [ ] 每个控件来自 `@deepseek-ai/dsh-client-ui-primitives`，不是自绘。
- [ ] 没有复制原语样式/哈希类名，没有覆盖原语内部规则。
- [ ] 图标按钮有 `aria-label`；`Switch`/`Checkbox` 有 `label`。
- [ ] 弹窗有标题与关闭名称；菜单用 `Menu`；Toast 在 `onDone` 卸载。
- [ ] Markdown / 代码 / 终端 / Diff / JSON 用原语渲染器，没有自写解析或高亮。
- [ ] 设置页用 `SettingsForm` 一族，没有自拼草稿/保存。
- [ ] 文件 / 链接 / 引用 / 权限图标用专用图标，没有自绘。

### 样式

- [ ] 无 hex/rgb/hsl/white/black；颜色全部来自 `--dsw-alias-*`。
- [ ] 圆角来自 `--dsw-radius-*`；发丝线 0.5px；圆形/胶囊配 `corner-shape: round`。
- [ ] 高表面 `border: 0` + `--dsw-elevation-*`，没有叠加 alias 边框。
- [ ] 无 `[data-ds-dark-theme]`、无 `@media (prefers-color-scheme)`。
- [ ] `:hover` 在 `@media (hover: hover)` 内；字重 ≤500。
- [ ] 无 `::-webkit-scrollbar`；菜单材质未被覆盖。

### 组装

- [ ] 标题离自己的内容比离上一组近；组间 > 组内。
- [ ] 文字起点、图标盒、操作边缘成轴；没有每个组件各自缩进。
- [ ] 圆角嵌套按“外层 − 内缩”或独立档位；贴边处保持直角。
- [ ] 窄容器/长文案不破：不裁切、不重叠、操作可达。

### 状态与主题

- [ ] 浅色、深色、system（跟随 OS）都看过；切换时页面不刷新；禁用/加载/错误/空按需看过。
- [ ] 键盘焦点可见，模态/菜单焦点归还正确。
- [ ] 内容固定深色面只重绑岛根，且两主题都验过。

### 文本与交付

- [ ] 文案走本地化，不把中文写死在组件里。
- [ ] `node scripts/check-ui.mjs` 0 error。
- [ ] 交付说明写了：宿主版本、用到的原语、验过的状态、未验项。

## 常见失败

| 现象 | 根因 | 修正 |
|---|---|---|
| 按钮没底色/太素 | 用了默认 `ghost` | 主操作 `variant: 'primary'` |
| 输入框取值异常 | 把 `onChange` 当 `(value)` | 取 `event.target.value` |
| 开关/复选没有可读名称 | 漏 `label` | 补本地化 `label` |
| 弹窗报错或关不掉 | 漏 `closeLabel` / `onClose` | 按 props 补齐 |
| 页签 id 冲突 | `SegmentedControl` 固定 id | 每实例唯一 id |
| 深色下白底白字 | 写死颜色/主题分支 | 只用别名 token；岛根重绑 |
| 浮层被裁剪 | 未用门户/portal | `Tooltip portal`、`Menu` 自带处理 |
| 菜单和原生不一致 | 自绘下拉 | 用 `Menu` / `MenuSurface` |
| 发丝线粗 | 写了 1px | 0.5px 或 `--dsh-hairline-width` |
| 升级后样式全坏 | 抄了 CSS Module 哈希类名 | 只抄值/token，用组件 |

## 整页评审

组件分别合规，组合起来仍可能双描边、分组不清、焦点被裁。评审时：

1. 按**整页/整个弹窗**看，不孤立看一个组件。
2. 比较同角色元素：所有按钮、所有行、所有标题。
3. 区分「看过的结果」「缺陷」「未看范围」，不要笼统说“没问题”。

## 何时升级给设计决策

- 需要新 token、新视觉语言、新组件形态；
- 原语缺失且组合不出来；
- 现有官方页面之间自相矛盾，无法判断以谁为准。
