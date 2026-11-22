# dsh-component-development

让 DSH Client 插件的界面与 DeepSeek Harness 官方风格对齐的一套 **skill + 可移植规范**。

- **skill**：`SKILL.md`，AI 在开发/修改 DSH 界面组件时自动加载，给出最小规则、工作流、模板与验收清单。
- **规范**：`组件开发规范/`，完整版：核心原则、宿主加载器、适配层、10 篇组件页、测试页、几何/token、深色岛、验收、升级复核、契约 JSON、自检脚本与可直接复制的模板。

对齐基线：**DSH 0.2.2-rc.5**（宿主原语与 CSS 均来自该版本实际产物）。

当前版本：**1.1.0**。

## 它解决什么问题

DSH 的控件由宿主渲染，插件拿不到宿主 CSS module，只能靠同一组 props + 同一组 token 复刻。没有规范时会出现：

- 宿主可用却自绘控件，外观「差一点」；
- fallback 只把颜色调像，布局/键盘/aria 不一致；
- 深色面板在浅色主题下开关变成白底白滑块；
- 每次升级 DSH 都要重新猜宿主签名。

这套规范把上述问题拆成可执行规则：宿主优先、fallback 五维等价、组件测试页唯一标准、token 优先、深色岛固定 token、唯一加载入口。

## 使用方式

### 1. 安装 skill

```text
# macOS / Linux
mkdir -p ~/.dsh/skills/dsh-component-development
cp SKILL.md ~/.dsh/skills/dsh-component-development/SKILL.md

# Windows (PowerShell)
New-Item -ItemType Directory -Force "$HOME\.dsh\skills\dsh-component-development" | Out-Null
Copy-Item SKILL.md "$HOME\.dsh\skills\dsh-component-development\SKILL.md"
```

重新打开 DSH 会话后，涉及界面开发时 AI 会自动加载该 skill。

### 2. 了解 skill 结构

`SKILL.md` 只做决策与流程入口：何时使用/不用、选型决策、工作流与交付物、适配层契约、验收门禁、常见错误、停止确认条件。完整代码与逐组件说明在 `组件开发规范/`。

### 3. 使用规范

把 `组件开发规范/` 整个拷进你的插件仓库（例如 `A_other/组件开发规范/`），让 AI 按 `组件开发规范/README.md` 的阅读顺序执行。

### 4. 自检

```bash
node 组件开发规范/脚本/check-kit.mjs
```

检查相对链接、契约 JSON、每个组件是否有文档、CSS 是否写死颜色、几何常量是否齐全、是否混入具体插件专用词。

## 仓库结构

```text
├─ SKILL.md                        DSH skill（AI 入口）
└─ 组件开发规范/
   ├─ README.md                    阅读顺序 + 接入步骤 + 给 AI 的开场指令
   ├─ 01-核心原则.md
   ├─ 02-宿主组件加载.md
   ├─ 03-适配层规范.md
   ├─ 04-组件/                     10 篇：签名 → 适配层 → 调用 → CSS → 坑
   ├─ 05-组件测试页.md
   ├─ 06-样式与Token.md
   ├─ 07-深色岛.md
   ├─ 08-验收清单.md
   ├─ 09-升级复核.md
   ├─ 参考/                        0.2.2-rc.5 宿主签名与关键 CSS 实测
   ├─ 模板/                        host-ui.js / primitives / gallery / theme.css
   ├─ 契约/                        components.json / geometry.json
   └─ 脚本/check-kit.mjs
```

## 六个核心原则

1. 宿主优先：`hostComponent('X') !== null` 时必须用宿主组件。
2. fallback 等价：props、DOM/aria、几何、交互、颜色五个维度一致。
3. 测试页唯一标准：先在组件测试页立用例，再写业务。
4. token 优先：颜色/圆角/阴影/焦点环只用 `--dsw-*`。
5. 深色岛固定 token：用 `--dsw-static-*`，不要手写近似色。
6. 唯一加载入口：全插件只有一处 `require('@deepseek-ai/dsh-client-ui-primitives')`。

## 更新与复核

DSH 升级后按 `组件开发规范/09-升级复核.md` 从安装包重新读宿主签名与 CSS，更新 `参考/`、`契约/` 与版本号，再改测试页与 fallback。

## 许可

MIT，见 [LICENSE](LICENSE)。
