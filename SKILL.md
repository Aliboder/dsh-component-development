---
name: dsh-component-development
description: "当在 DSH Client 插件中开发或修改界面组件时使用：宿主组件优先、fallback 与官方等价、组件测试页为唯一标准、token 与深色岛规则，以及验收与 DSH 升级复核流程。"
---

# DSH 组件开发（对齐官方风格）

## 何时使用

- 在 DSH Client 插件里新增或修改任何界面：按钮、开关、输入框、分段、页签、弹窗、菜单、提示、设置行、工具栏、面板。
- 需要决定「用宿主组件还是自绘」「fallback 怎么写」「深色面板里的控件为什么变色」。
- 需要评审一个 UI 是否符合 DSH 官方风格。

## 第一步：找到规范

优先读仓库里的可移植规范（如果存在）：

```text
A_other/组件开发规范/README.md
A_other/组件开发规范/01-核心原则.md
A_other/组件开发规范/02-宿主组件加载.md
A_other/组件开发规范/03-适配层规范.md
A_other/组件开发规范/04-组件/<对应组件>.md
```

按 README 的「给 AI 的阅读顺序」执行；写某个控件时只读它对应的 04 页。仓库里没有这个文件夹时，先把整套规范拷进来再开发，不要凭记忆自造。

## 不可协商的六条

1. **宿主优先**：`hostComponent('X') !== null` 时必须渲染宿主组件；只有不可用时才用 fallback。
2. **fallback 等价**：props、DOM/aria、几何、交互、颜色五个维度都要与宿主一致，不是「看起来像」。
3. **测试页是唯一标准**：每个控件先在组件测试页立用例（适配层名 + 实际控件 + 可复制调用），业务里只出现验证过的写法。
4. **token 优先**：颜色、圆角、阴影、焦点环只用 `--dsw-*`；禁止写死十六进制。
5. **深色岛固定 token**：浅色主题下的深色面板，必须在岛根固定宿主会读的 token（用 `--dsw-static-*`），否则开关会白底白滑块。
6. **唯一加载入口**：整个插件只有一个文件 `require('@deepseek-ai/dsh-client-ui-primitives')`，业务只通过 `hostComponent(name)` 取组件。

## 标准工作流

```text
1. 读规范（没有就先拷规范文件夹）
2. 在组件测试页加用例：adapter / code / 实际控件
3. 写适配层：宿主分支 + fallback 分支，同一组业务 props
4. 写 fallback CSS：先结构，再几何，再 token，最后交互
5. 深色面板：在岛根固定 token
6. 自检：native / fallback、浅色 / 深色、键盘、重复 id、硬编码颜色
7. 同步文档与 CHANGELOG，再提交
```

## 宿主加载器（模板）

```js
var hostUi = null
try {
  hostUi = require('@deepseek-ai/dsh-client-ui-primitives')
} catch (error) {
  hostUi = null
}

function hostComponent(name) {
  if (!hostUi) return null
  var value = hostUi[name]
  if (typeof value === 'function') return value
  if (value && typeof value === 'object' && value.$$typeof) return value
  return null
}
```

## 适配层骨架

```js
function AdapterName(props) {
  // 1. 归一化业务语义（字符串/布尔/默认值）
  var value = String(props.value === undefined ? '' : props.value)

  // 2. 宿主优先
  var Host = hostComponent('HostName')
  if (Host !== null) {
    return h(Host, {
      value: value,
      onChange: function (next) {
        if (typeof props.onChange === 'function') props.onChange(next)
      },
      label: props.label || '',
      className: props.className,
    }, props.children)
  }

  // 3. fallback 与宿主同 DOM 语义
  return h('div', { className: cx('ui-adapter', props.className) }, props.children)
}
```

onChange 语义：`Switch`/`Checkbox` 收 boolean；`Input` 收 `(value, event)`；`Segmented*`/`Menu` 收 value/id 字符串。

## 几何硬指标（与宿主一致）

| 项目 | 值 |
|---|---|
| 发丝线 | `.5px` |
| 圆角 | sm 8 / md 12 / lg 16 / xl 20 |
| 按钮 | sm 28 / md 36 |
| 输入框 | 32，内衬 `0 8px` |
| 分段控件 tab | 28 |
| 分段页签 tab | 34（sm 30） |
| 开关 | 36×20，滑块 16，内衬 2 |
| Pill | 24 |
| 图标按钮 | 28×28 |

## 组件测试页用例（模板）

```js
function GalleryCase(props) {
  return h('div', {
    className: cx('ui-gallery-case', props.wide === true && 'is-wide'),
    'data-adapter': props.adapter || undefined,
  },
    h('div', { className: 'ui-gallery-case-title' }, props.title,
      props.adapter ? h('span', { className: 'ui-gallery-adapter' }, props.adapter) : null),
    h('div', { className: 'ui-gallery-row' }, props.children),
    props.code ? h('pre', { className: 'ui-gallery-code' }, h('code', null, props.code)) : null)
}

h(GalleryCase, {
  title: t('gallery.caseSwitch'),
  adapter: 'Switch',
  code: "h(Switch, { value, label, onChange })",
}, h(Switch, { value: on, label: label, onChange: setOn }),
   h(Switch, { value: false, label: label, disabled: true }))
```

`code` 里用 `label` / `value` / `onChange` 占位符，不要写文案键。

## 深色岛（最容易踩）

```css
.ui-island{
  --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-50);
  --dsw-alias-label-secondary: var(--dsw-static-neutral-bluish-300);
  --dsw-alias-label-tertiary: var(--dsw-static-neutral-bluish-400);
  --dsw-alias-label-primary-foreground: var(--dsw-static-neutral-bluish-1000);
  --dsw-alias-bg-module-platform: var(--dsw-static-neutral-bluish-800);
  --dsw-alias-brand-primary: var(--dsw-static-neutral-bluish-50);
  --dsw-alias-switch-thumb: var(--dsw-static-neutral-bluish-400);
  --dsw-alias-border-l3: rgba(255, 255, 255, .16);
}
```

只在岛根固定；不要在单个控件上重复。固定后切浅色主题验证开关、分段、输入框、页签。

## 验收清单

```text
[ ] 测试页有用例（adapter + code + 实际控件）
[ ] native 与 fallback 两条路径都跑过
[ ] 浅色 / 深色 / 深色岛都看过
[ ] 键盘：Tab / Enter / Space / 方向键 / Escape
[ ] 同页无重复 DOM id 与 aria-controls
[ ] 颜色无硬编码，发丝线 .5px
[ ] 文档与 CHANGELOG 已同步
```

## 常见坑

| 现象 | 原因 | 修正 |
|---|---|---|
| 开关白底白滑块 | 深色岛没固定 `label-primary-foreground` / `brand-primary` / `switch-thumb` | 按上面的岛根清单固定 |
| 分段选中项没有滑块动画 | fallback 用 `.is-on` 画底色 | 加滑动指示块，选中只改文字色 |
| 同页多个分段冲突 | 固定默认 id | 每实例自增 id |
| 输入框 onChange 拿到 event | 宿主 Input 的 onChange 是原生事件 | 适配层取 `event.target.value` |
| 页签样式像分段控件 | 两者 CSS 不同 | 页签 R16/R12、tab 34/30、14px、选中加粗 |
| 图标按钮没有读屏名 | 缺 `aria-label` | `title` 必填，同时作 Tooltip 与 aria-label |
| 菜单定位错乱 | `anchor` 传了 ref 而不是元素 | 传 React 元素；`onSelect` 收 id |
| Button 外观不对 | 宿主默认 variant 是 ghost | 适配层显式传 variant |

## 需要完整代码时

打开规范文件夹的 `模板/`：

```text
模板/host-ui.js                   加载器
模板/primitives.example.js        适配层全集
模板/component-gallery.example.js 测试页
模板/theme.example.css            fallback 样式
模板/../契约/*.json              机器可读契约
脚本/check-kit.mjs               自检脚本
```

## 基线

当前对齐 DSH 0.2.2-rc.5。DSH 升级后按 `09-升级复核.md` 从安装包重新读宿主签名与 CSS，再改测试页与 fallback。
