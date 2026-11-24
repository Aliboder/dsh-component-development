# 04 · 组件测试页（gallery）

## 为什么需要

代码里用了原语，不代表组装出来就对：内衬、gap、容器底色、圆角嵌套、焦点环、深色对比，都只有在**整页/整个弹窗**里才看得出来。

gallery 是一个**开发专用**页面：把本次用到的控件按状态摆出来，用来看和键测，不进入正式 UI。

## 放哪里

挂到插件已有的可见入口，任选：

- 设置页里一个仅开发环境显示的分区；
- 面板/侧栏里的临时入口；
- 一个由配置开关控制的 dev-only 页面。

提交前二选一：移除入口，或默认隐藏并由开发标记开启。不要让它出现在用户默认视图里。

`templates/gallery.js` 是可直接挂载的最小骨架，复制后改 CSS 前缀即可。完整示例见工作区的 `dsh-ui-gallery` 插件（控件 + 更多原语）。

## 用例契约

每个用例包含：

```js
{
  title: '主按钮 / 次按钮',
  code: "h(ui.Button, { variant: 'primary' }, '保存')",
  render: () => [
    h(ui.Button, { variant: 'primary' }, '保存'),
    h(ui.Button, { variant: 'outline' }, '取消'),
  ],
}
```

- `code` 是给人和 AI 看的**可复制调用**，不是伪代码；
- `render` 返回真实控件；文案用占位符/本地化键，不写死业务文案；
- 每个控件至少：默认态 + 一个非默认态（禁用/选中/错误/加载之一）。

## 必看矩阵

| 控件 | 至少覆盖 |
|---|---|
| Button | primary/outline/ghost/toolbar × md/sm；禁用；图标按钮 |
| Switch | 开/关/禁用；深色 |
| Input | 占位、有值、带图标、禁用、错误 |
| Checkbox | 未选/已选/禁用 |
| SegmentedControl | 2 段、3+ 段、禁用段 |
| SegmentedTabs | md/sm；键盘左右/Home/End |
| Pill | 普通/选中 |
| Tag | 8 个 tone |
| StateDot | done/warning/ongoing/error/idle |
| Tooltip | 键盘聚焦也显示；portal 不被裁剪 |
| Modal | 普通/warning/headless；Esc、焦点归还 |
| Menu | 数据行/分隔线/禁用行/子菜单/长列表 |
| Toast | 成功/普通；`onDone` 后卸载 |
| 内容渲染 | `MarkdownText` / `CodeBlock` / `JsonTree` 等，按需加一例 |
| 设置表单 | `SettingsForm` 或字段控件，按需加一例 |
| 专用图标 / 键帽 | `FileTypeIcon` / `LinkIcon*` / `ShortcutKeys` |

## 检查方法

1. **浅色、深色、system** 各看一遍；`system` 跟随操作系统。切换 DSH 设置里的外观，页面应即时跟随，不要只改 DevTools。
2. **键盘**：Tab 到每个控件，看焦点环；Enter/Space 触发；方向键走页签；Esc 关浮层。
3. **尺寸**：在真实窗口宽度看，再缩窄；长文案/换行/裁剪。
4. **对照**：把原生同类控件放在旁边（例如原生设置页的按钮），比高度、圆角、内衬、字重、图标盒。
5. **状态**：禁用、加载、错误、空、选中；只验与本次改动相关的状态，但不要漏。

## 证据

- 截图可选，但要能说明：宿主版本、主题（浅/深）、状态、窗口宽度。
- 无法打开界面时，明确写“未做渲染验证”，不要用“应该没问题”代替。
- 不要重建旧截图冒充 before；需要对比时保留真实起点。

## 不要做

- 不要在 gallery 里写业务逻辑或真实写操作。
- 不要只测浅色就宣布完成。
- 不要把 gallery 留在生产入口。
