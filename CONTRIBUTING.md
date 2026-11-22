# 收录与适配插件

本市场的目标是：用户从这里安装的插件，在 KCoder 中能按说明工作。每个插件都要经过静态校验和真实加载验证，并如实记录兼容情况。

## 三种收录方式

### 1. 自有插件

直接放在 `plugins/<name>/`，使用 Agent Plugins 1.0.0 布局，可参考 [kcoder-starter](plugins/kcoder-starter)。

### 2. 引用上游（不修改）

上游原样就能被 KCoder 完整加载时，不复制代码，在 `marketplace.json` 里写固定到提交的远端来源：

```json
{
  "name": "example-plugin",
  "source": {
    "source": "git-subdir",
    "url": "https://github.com/owner/repo.git",
    "path": "plugins/example-plugin",
    "sha": "0123456789abcdef0123456789abcdef01234567"
  }
}
```

- 只允许 `https`，`url` 中不能带凭证或查询参数。
- `sha` 必须是完整的 40 位提交号。更新上游版本时，改 `sha` 并重新验证。
- 在 `catalog/plugins.json` 中添加同名记录，`source` 与市场条目完全一致，并写明分类（`group`）、许可证、实际加载到的能力、需要的运行时和环境变量（`env`），以及验证结果（`verification`）。校验脚本会拒绝没有记录、来源不一致或未验证通过的远端条目。
- 修改后运行 `node scripts/render-catalog.mjs` 更新 README 插件表。

### 3. 改编第三方插件

上游需要修改才能在 KCoder 中使用时，复制到 `plugins/<name>/` 再改编：

- 只收录许可证允许修改和再分发的插件，例如 MIT、Apache-2.0、BSD。许可证不明确或禁止再分发的，不要收录。
- 保留上游的 `LICENSE`/`NOTICE` 文件和版权声明。
- 在插件目录里新增 `UPSTREAM.md`，写明上游地址、基于的提交、许可证，以及为适配 KCoder 改了什么。
- 改动尽量小，优先调整清单和路径，不改插件的核心行为。

## 适配检查清单

1. **清单格式**：`plugin.json` 使用 `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`；`name` 只用小写字母、数字、`.`、`-`，并且与 `marketplace.json` 中的 `name` 一致。
2. **路径安全**：所有资源路径以 `./` 开头并留在插件目录内；不使用符号链接、`..` 或绝对路径。
3. **MCP**：
   - `mcp.json` 必须声明 `$schema` 和 `mcpServers`。
   - 插件内的文件用 `${PLUGIN_ROOT}` 引用，可写数据用 `${PLUGIN_DATA}`。这两个占位符只在 `args`、`env` 值和 `cwd` 中展开，`command` 中的不会展开。
   - 远端服务只能用 `https`。
4. **凭证**：清单和代码中都不出现任何密钥。需要凭证的插件，在 README 中写明需要哪些变量，以及在 KCoder 中的配置位置。
5. **Hook**：Hook 会在用户机器上执行命令，保持最小化，并在插件 README 中说明它会运行什么。
6. **外部依赖**：插件需要的运行时（Node.js、Python、某个 CLI 工具）在插件 README 中列出，`kcoder plugin doctor` 不会检查这些依赖。

## 验证步骤

```bash
node scripts/validate.mjs
node --test scripts/validate.test.mjs
KCODER_BIN=/path/to/kcoder sh scripts/kcoder-smoke.sh
```

冒烟脚本必须报告 `healthy: true`，插件兼容等级为 `fully_supported`。如果是 `partially_supported`，在 README 的插件列表中写明缺少的能力和原因。

涉及 MCP 或技能的插件，再在真实会话中试一次：确认技能能被 `$` 选中，MCP 工具出现在工具列表里，并且能完成一次调用。只验证到加载这一步的，要在列表中如实标注。

## 提交 PR 时说明

- 收录方式（自有、引用上游、改编）。
- 上游地址、提交号和许可证（如果有）。
- 三项验证的结果，以及真实会话中测试了什么。
- 需要的凭证、外部依赖和已知限制。
