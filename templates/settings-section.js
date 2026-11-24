/**
 * 设置卡片模板：标题 + 行 + 控件的标准组合。
 *
 * 用法：复制到插件 client 源码，把 ui- 换成插件前缀；
 * 视觉只读 token，行内控件一律用宿主原语。
 */

const React = require('react')
const ui = require('@deepseek-ai/dsh-client-ui-primitives')

const h = React.createElement
const useState = React.useState

function SettingsSection({ title, description, children }) {
  return h('section', { className: 'ui-settings-card' },
    h('header', { className: 'ui-settings-card-header' },
      h('h2', { className: 'ui-settings-card-title' }, title),
      description ? h('p', { className: 'ui-settings-card-desc' }, description) : null),
    h('div', { className: 'ui-settings-card-body' }, children))
}

function SettingsRow({ label, description, control }) {
  return h('div', { className: 'ui-settings-row' },
    h('div', { className: 'ui-settings-row-text' },
      h('span', { className: 'ui-settings-row-label' }, label),
      description ? h('span', { className: 'ui-settings-row-desc' }, description) : null),
    h('div', { className: 'ui-settings-row-control' }, control))
}

function ExampleSettingsSection() {
  const [enabled, setEnabled] = useState(true)
  const [name, setName] = useState('')
  return h(SettingsSection, {
    title: '示例设置',
    description: '卡片负责分组，行负责一个设置项。',
  },
    h(SettingsRow, {
      label: '启用',
      control: h(ui.Switch, { checked: enabled, label: '启用', onChange: setEnabled }),
    }),
    h(SettingsRow, {
      label: '名称',
      description: '显示在面板标题旁。',
      control: h(ui.Input, {
        value: name,
        placeholder: '未命名',
        onChange: event => setName(event.target.value),
      }),
    }),
    h('div', { className: 'ui-settings-actions' },
      h(ui.Button, { variant: 'primary' }, '保存')))
}

module.exports = { SettingsSection, SettingsRow, ExampleSettingsSection }
