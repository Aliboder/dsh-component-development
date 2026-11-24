/**
 * DSH 组件测试页（gallery）模板。
 *
 * 用法：
 * 1. 复制到插件 client 源码（例如 src/client/dev/gallery.js）；
 * 2. 把 CSS 前缀 ui- 改成你的插件前缀；
 * 3. 在仅开发可见的入口渲染 h(GalleryPage)，确认后移除或隐藏入口；
 * 4. 按 references/04-gallery.md 的矩阵补用例。
 *
 * 依赖：外壳基座模块 react 与 @deepseek-ai/dsh-client-ui-primitives，
 * 构建时保持 external，不要打包副本。
 */

const React = require('react')
const ui = require('@deepseek-ai/dsh-client-ui-primitives')

const h = React.createElement
const useState = React.useState

function Case({ title, code, children }) {
  return h('section', { className: 'ui-gallery-case' },
    h('h3', { className: 'ui-gallery-case-title' }, title),
    code ? h('pre', { className: 'ui-gallery-code' }, h('code', null, code)) : null,
    h('div', { className: 'ui-gallery-stage' }, children))
}

function IconButton({ label, icon, onClick }) {
  return h(ui.Tooltip, { label },
    h(ui.Button, { variant: 'ghost', 'aria-label': label, icon, onClick }))
}

function GalleryPage() {
  const [on, setOn] = useState(false)
  const [agree, setAgree] = useState(true)
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('list')
  const [tab, setTab] = useState('general')
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

  return h('div', { className: 'ui-gallery' },
    h('header', { className: 'ui-gallery-header' },
      h('h2', null, '组件测试页'),
      h('p', null, '浅色 / 深色各看一遍；键盘 Tab 走一遍；改动相关状态都要出现。')),

    h(Case, {
      title: 'Button',
      code: "h(ui.Button, { variant: 'primary' }, '保存')",
    },
      h(ui.Button, { variant: 'primary' }, '主操作'),
      h(ui.Button, { variant: 'outline' }, '次操作'),
      h(ui.Button, { variant: 'ghost' }, 'Ghost'),
      h(ui.Button, { variant: 'toolbar' }, '工具栏'),
      h(ui.Button, { variant: 'primary', disabled: true }, '禁用'),
      IconButton({
        label: '刷新',
        icon: h(ui.IconRefreshOutlineRegular, { size: 16 }),
        onClick: () => setToast('已刷新'),
      })),

    h(Case, {
      title: 'Switch / Checkbox',
      code: "h(ui.Switch, { checked, label, onChange })",
    },
      h(ui.Switch, { checked: on, label: '启用同步', onChange: setOn }),
      h(ui.Switch, { checked: false, label: '禁用开关', disabled: true, onChange: () => {} }),
      h(ui.Checkbox, { checked: agree, label: '我已了解', onChange: setAgree })),

    h(Case, {
      title: 'Input',
      code: "h(ui.Input, { value, onChange: e => setValue(e.target.value) })",
    },
      h(ui.Input, {
        value: query,
        placeholder: '搜索',
        icon: h(ui.IconSearchOutlineRegular, { size: 16 }),
        onChange: event => setQuery(event.target.value),
      }),
      h(ui.Input, { value: '', placeholder: '禁用', disabled: true, onChange: () => {} })),

    h(Case, {
      title: 'SegmentedControl',
      code: "h(ui.SegmentedControl, { id, value, options, label, onChange })",
    },
      h(ui.SegmentedControl, {
        id: 'gallery-view',
        value: mode,
        label: '视图模式',
        options: [
          { value: 'list', label: '列表' },
          { value: 'grid', label: '网格' },
          { value: 'board', label: '看板' },
        ],
        onChange: setMode,
      })),

    h(Case, {
      title: 'SegmentedTabs',
      code: "h(ui.SegmentedTabs, { items, value, label, onChange })",
    },
      h(ui.SegmentedTabs, {
        label: '设置分区',
        value: tab,
        items: [
          { value: 'general', label: '通用', id: 'gallery-tab-general', panelId: 'gallery-panel-general' },
          { value: 'about', label: '关于', id: 'gallery-tab-about', panelId: 'gallery-panel-about' },
        ],
        onChange: setTab,
      })),

    h(Case, {
      title: 'Pill / Tag / StateDot',
      code: "h(ui.Tag, { tone: 'success' }, '已连接')",
    },
      h(ui.Pill, { active: true, onClick: () => {} }, '全部'),
      h(ui.Pill, { active: false, onClick: () => {} }, '未读'),
      ['outline', 'solid', 'neutral', 'quiet', 'success', 'info', 'warning', 'danger']
        .map(tone => h(ui.Tag, { key: tone, tone }, tone)),
      h('span', { className: 'ui-gallery-inline' },
        h(ui.StateDot, { state: 'done' }), '完成',
        h(ui.StateDot, { state: 'warning' }), '注意',
        h(ui.StateDot, { state: 'ongoing' }), '进行中',
        h(ui.StateDot, { state: 'error' }), '失败',
        h(ui.StateDot, { state: 'idle' }), '空闲')),

    h(Case, {
      title: '更多原语：键帽 / 图标',
      code: "h(ui.ShortcutKeys, { keys: ['Ctrl', '+', 'K'] })",
    },
      h(ui.ShortcutKeys, { keys: ['Ctrl', '+', 'K'] }),
      h(ui.ShortcutKeys, { keys: ['Ctrl', '+', 'K'], variant: 'tooltip' }),
      h(ui.FileTypeIcon, { path: 'src/client/ui/gallery.js', size: 28 }),
      h(ui.FileTypeIcon, { path: 'docs/README.md', size: 28 }),
      h(ui.LinkIconRegular, { kind: 'url', href: 'https://github.com/deepseek-ai/deepseek-harness', size: 16 }),
      h(ui.LinkIconRegular, { kind: 'code', size: 16 }),
      h(ui.ReferenceIconRegular, { kind: 'file', size: 16 }),
      h(ui.ReferenceIconRegular, { kind: 'folder', size: 16 }),
      h(ui.PermissionIconReadOnlyRegular, { size: 16 }),
      h(ui.PermissionIconWorkspaceWriteRegular, { size: 16 }),
      h(ui.PermissionIconFullAccessRegular, { size: 16 }),
      h(ui.PermissionIconAutoReviewRegular, { size: 16 })),

    h(Case, {
      title: '用户消息 / 引用',
      code: "h(ui.QuotePreview, { text })",
    },
      h(ui.UserMessageBubble, { className: 'ui-message' }, '用户消息样式'),
      h(ui.UserTextRun, { text: '普通文本' }),
      h(ui.ReferenceChip, { appearance: 'file', label: 'gallery.js', title: 'src/client/ui/gallery.js' }),
      h(ui.QuotePreview, { text: '一段引用摘录，用来检查底色、圆角与截断。' })),
    h(Case, {
      title: '浮层：Menu / Modal / Toast',
      code: "h(ui.Menu, { open, anchor, items, onSelect, onClose })",
    },
      h(ui.Menu, {
        open: menuOpen,
        anchor: h(ui.Button, { variant: 'outline', onClick: () => setMenuOpen(true) }, '打开菜单'),
        items: [
          { id: 'rename', label: '重命名', shortcut: { keys: ['F2'] } },
          { type: 'separator', id: 'sep' },
          { id: 'delete', label: '删除', danger: true },
        ],
        onSelect: id => { setMenuOpen(false); setToast('已选择：' + id) },
        onClose: () => setMenuOpen(false),
      }),
      h(ui.Button, { variant: 'outline', onClick: () => setModalOpen(true) }, '打开弹窗'),
      h(ui.Button, { variant: 'outline', onClick: () => setToast('已保存') }, '显示提示')),

    modalOpen && h(ui.Modal, {
      open: true,
      onClose: () => setModalOpen(false),
      title: '示例弹窗',
      closeLabel: '关闭',
      description: '检查标题、正文、按钮与焦点归还。',
      footer: [
        h(ui.Button, { key: 'cancel', onClick: () => setModalOpen(false) }, '取消'),
        h(ui.Button, { key: 'ok', variant: 'primary', onClick: () => setModalOpen(false) }, '确定'),
      ],
    }, h('p', null, '正文内容。')),

    toast && h(ui.Toast, { text: toast, tone: 'success', onDone: () => setToast(null) }))
}

module.exports = { GalleryPage }
