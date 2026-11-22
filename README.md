# KCoder Plugins

面向 [KCoder](https://github.com/yixuanchen189756-source/KCoder) 的插件市场。这里收录的每个插件都经过 KCoder 实际加载验证，并标明兼容等级、许可证和需要的前提条件。

## 在 KCoder 中添加本市场

**Studio**：打开「插件」页，在市场下拉框选择「自定义地址」，填入：

```text
https://github.com/yixuanchen189756-source/kcoder-plugins
```

**CLI**（先克隆到本地）：

```bash
git clone https://github.com/yixuanchen189756-source/kcoder-plugins.git
kcoder marketplace add kcoder-plugins --path ./kcoder-plugins
kcoder plugin install --marketplace kcoder-plugins --name kcoder-starter
```

安装后新开一个会话即可使用。插件提供的技能可在输入框里用 `$` 选择。

## 插件列表

| 插件 | 能力 | KCoder 兼容等级 | 来源 | 许可证 |
| --- | --- | --- | --- | --- |
| [kcoder-starter](plugins/kcoder-starter) | 技能、Hook、MCP | fully_supported | 本仓库 | 见[许可证说明](#许可证) |

兼容等级取自 `kcoder plugin doctor` 的结果：

- `fully_supported`：全部能力可用。
- `partially_supported`：部分能力被推迟或不可用，表格中会注明缺少哪些能力。

## 仓库结构

```text
.agents/plugins/marketplace.json   市场清单（KCoder 原生布局）
plugins/<name>/                    插件目录，每个插件一个
  plugin.json                      Agent Plugins 1.0.0 清单（必需）
  skills/<skill>/SKILL.md          技能
  mcp.json                         MCP 服务（可选）
  .codex-plugin/plugin.json        展示信息和 Hook 引用（可选）
  hooks/hooks.json                 Hook（可选）
scripts/validate.mjs               静态校验
scripts/kcoder-smoke.sh            用真实 KCoder 加载验证
```

## 校验

```bash
node scripts/validate.mjs                  # 静态校验清单、路径、密钥和格式
node --test scripts/validate.test.mjs      # 校验脚本自身的测试
KCODER_BIN=/path/to/kcoder sh scripts/kcoder-smoke.sh   # 真实加载
```

CI 会在每次提交和 PR 时运行前两项。真实加载需要 KCoder CLI，合并插件前请在本地运行；脚本使用临时的隔离配置，不会改动你的 KCoder 设置，也不会执行插件的 Hook 或 MCP 服务。

## 收录新插件

见 [CONTRIBUTING.md](CONTRIBUTING.md)，里面说明了自有插件、引用上游插件和改编第三方插件三种方式的要求。

## 安全说明

- 插件的 Hook 和 MCP 服务会在你的机器上执行命令。安装前请查看插件目录里的 `hooks/hooks.json` 和 `mcp.json`。
- 本仓库不保存任何凭证。需要账号或 API 密钥的插件，请在 KCoder 的凭证设置中配置。
- 引用上游的插件都固定到具体提交，上游后续的改动需要重新审核才会生效。

## 许可证

本仓库尚未选定许可证。改编自第三方的插件保留其原始许可证文件，以各自目录内的声明为准。
