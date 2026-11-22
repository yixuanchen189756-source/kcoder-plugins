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

### 本仓库插件

| 插件 | 说明 | 能力 |
| --- | --- | --- |
| [kcoder-starter](plugins/kcoder-starter) | 示例插件，可作为新插件的模板 | 技能、Hook、MCP |

### 收录的上游插件

收录标准：在隔离的 KCoder 配置中，从上游按固定提交真实安装，并且 `kcoder plugin doctor` 报告 `healthy: true`、兼容等级为 `fully_supported`（全部声明的能力都能被 KCoder 加载）。每个插件的验证记录、许可证和来源见 [catalog/plugins.json](catalog/plugins.json)。

这项验证说明插件能被 KCoder 完整加载，**不代表其外部服务已就绪**：

- 「需要」一栏列出 MCP 服务启动所需的运行时（如 Node.js、Python/uv、Docker）和凭证。
- 标注了环境变量的插件，需要先在 KCoder 中配置这些变量，它的 MCP 服务才会启用。验证时用的是占位值，只确认配置齐全后能完整加载。
- 「能力」一栏是 KCoder 实际加载到的内容（`kcoder plugin read`），不是插件自己声明的。
- 远端 MCP 通常需要在首次使用时登录对应服务的账号。
- 插件的许可证以上游仓库为准。未改编的插件只记录固定提交的引用，不复制上游代码；改编版保留上游许可证文件和版权声明。

### 测试方法

每个插件都经过以下测试，结果记录在 [catalog/plugins.json](catalog/plugins.json)：

1. **安装与加载**：在隔离的 KCoder 配置中真实安装，`plugin doctor` 报告健康且为 `fully_supported`，并用 `plugin read` 确认实际加载到的内容（「能力」一栏）。
2. **MCP 测试**：用 KCoder 自己解析出的配置启动每个 MCP 服务，只做初始化和列出工具，不调用任何工具。本地服务在 bubblewrap 沙箱中运行；远端服务只发送一次不带凭证的初始化请求。「MCP 测试」一栏的含义：
   - 可用：启动成功并列出了工具。
   - 需要登录：远端服务要求账号授权，首次使用时登录即可。
   - 需要配置：需要先设置凭证、项目或连接参数。
   - 缺少某个命令：本机需要先安装对应运行时。
3. **内容审查**：扫描技能、命令和子代理文本中只适用于 Claude Code 或 Codex 的写法，包括 KCoder 没有的工具名、写死的 MCP 工具名、`~/.claude` 配置路径、`claude` 命令行和技能中的 `${CLAUDE_PLUGIN_ROOT}`。有问题的插件逐个人工改编，改编版放在 `plugins/<name>/`，每个都附 `UPSTREAM.md` 说明来源提交、许可证和改动。

### 已知限制

- 依赖 Claude Code「channels」的插件（discord、telegram、imessage）在 KCoder 中可以使用其工具，但收到的消息不会自动推送到会话里。
- 部分插件附带的脚本只能读取 Claude Code 的会话记录（如 receipts、session-report），在 KCoder 中无法统计 KCoder 会话。
- 技能前置信息里的 `allowed-tools` 列表在正常使用技能时不生效；如果把这类技能配置进 KCoder 专家或子代理，其中 Claude 风格的 MCP 工具名不会匹配。
- 只通过 claude.ai 连接器工作的服务（例如 intuit-quickbooks）在 KCoder 中没有对应功能，插件会提示工具不可用。

<!-- catalog:start -->
共收录 265 个上游插件，全部在 KCoder 中验证为 `fully_supported`。其中 70 个已针对 KCoder 改编并放在本仓库 `plugins/` 下，其余固定到上游的具体提交。

内容审查：163 个未发现其他客户端专属写法，21 个经人工判断无需修改，70 个已改编，11 个因许可证未改编（仍可安装，但说明中可能提到 Claude Code 的命令或路径）。

| 分类 | 数量 |
| --- | --- |
| [办公文档](#办公文档) | 6 |
| [办公与协作](#办公与协作) | 36 |
| [数据与数据库](#数据与数据库) | 37 |
| [开发工具](#开发工具) | 82 |
| [测试](#测试) | 9 |
| [安全](#安全) | 23 |
| [云与部署](#云与部署) | 17 |
| [运维与监控](#运维与监控) | 21 |
| [设计与创意](#设计与创意) | 28 |
| [学习与研究](#学习与研究) | 6 |

### 办公文档

| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `doc-coauthoring`（含 Claude 专属说明） | Guide users through a structured workflow for co-authoring documentation. Use… | 技能 | — | — | 未声明 | [skills](https://github.com/anthropics/skills) |
| `document-skills` | Collection of document processing suite including Excel, Word, PowerPoint, an… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `docx` | Use this skill whenever the user wants to create, read, edit, or manipulate W… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `pdf` | Use this skill whenever the user wants to do anything with PDF files. This in… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `pptx` | Use this skill any time a .pptx or .potx file is involved in any way — as inp… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `xlsx` | Use this skill any time a spreadsheet file is the primary input or output. Th… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |

### 办公与协作

| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `airtable` | Airtable is the database and operations layer for your agents — whether runni… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `airwallex-agentos` | Bring Airwallex's global financial infrastructure to Codex. Orchestrate actio… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `amazon-selling-partner` | Connect your Amazon Seller Central account to Claude. Ask about sales, invent… | 技能、MCP、命令 | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`apollo`](plugins/apollo/UPSTREAM.md)（已改编） | Prospect, enrich leads, load outreach sequences, and query sales analytics wi… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `asana`（含 Claude 专属说明） | Asana project management integration. Connects Claude Code to Asana's V2 MCP … | 命令 | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `atlassian` | Connect AI agents to Atlassian products including Jira and Confluence, with r… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `atlassian-twg-cli` | Teamwork Graph CLI is Atlassian's agent-first interface to your entire work c… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `box` | Box plugin for working with Box content, building Box Platform integrations, … | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `brand-guidelines` | Applies Anthropic's official brand colors and typography to any sort of artif… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `calcom` | Cal.com scheduling for Grok Build via the hosted Cal.com MCP server at mcp.ca… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [xai](https://github.com/xai-org/plugin-marketplace) |
| `carta-cap-table`（含 Claude 专属说明） | Carta Cap Table plugin — skills and hooks for querying cap tables, grants, SA… | 技能、Hook | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `carta-crm`（含 Claude 专属说明） | Manage the Carta CRM conversationally — search, add, update, and enrich inves… | 技能、Hook | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `carta-investors`（含 Claude 专属说明） | Carta Investors plugin — write-capable skills for querying and updating inves… | 技能、Hook | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `circleback` | Circleback conversational context integration. Search and access meetings, em… | MCP | 需要登录 | 远端 MCP（可能需要登录授权） | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `discord` | Discord channel for Claude Code — messaging bridge with built-in access contr… | 技能、MCP | 缺少 `bun` | Bun | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `dropbox` | The Dropbox plugin for Claude connects your Dropbox files directly to Claude,… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `gc-ai` | Work in your GC AI legal knowledge base from Claude: upload documents, run re… | 技能、MCP、命令、子代理 | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `helena` | Helena is an AI marketer that learns your business and plans, launches, and o… | MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [xai](https://github.com/xai-org/plugin-marketplace) |
| `hubspot-sales` | HubSpot sales workflows: contact import, call prep, daily brief, follow-up dr… | 技能、MCP、命令、子代理 | 需要登录 | 远端 MCP（可能需要登录授权） | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `hunter` | Find and verify professional email addresses, search contacts by domain, enri… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`imessage`](plugins/imessage/UPSTREAM.md)（已改编） | iMessage channel for Claude Code — reads chat.db directly, sends via AppleScr… | 技能、MCP | 缺少 `bun` | Bun | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `intercom` | Intercom integration for Claude Code. Search conversations, analyze customer … | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `internal-comms` | A set of resources to help me write all kinds of internal communications, usi… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| [`intuit-quickbooks`](plugins/intuit-quickbooks/UPSTREAM.md)（已改编） | QuickBooks business insights and actions for Claude: financial health briefin… | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `legalzoom` | LegalZoom Plugin - AI-powered business legal assistance with contract review … | 技能、MCP、命令 | 需要登录 | 远端 MCP（可能需要登录授权） | Proprietary | [claude](https://github.com/anthropics/claude-plugins-official) |
| `linear` | Linear issue tracking integration. Create issues, manage projects, update sta… | MCP | 需要登录 | 远端 MCP（可能需要登录授权） | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `linq-alpha` | Connect Claude to LinqAlpha, guide capability-based provider selection, and l… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`monday-crm`](plugins/monday-crm/UPSTREAM.md)（已改编） | Run your sales pipeline in monday CRM from plain language. Start the day with… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `notion` | Notion Skills + Notion MCP server packaged as a Claude Code plugin. | 技能、MCP、命令 | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `pendo-orchestrate` | Create, configure, and edit draft Orchestrate email journeys via Pendo MCP — … | 技能、MCP | 需要登录 | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `postiz` | Social media automation CLI and MCP server for scheduling posts, managing int… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | AGPL-3.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `slack` | Slack skills for developing apps with the Slack CLI, Bolt frameworks, Web API… | 技能、命令 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `telegram` | Telegram channel for Claude Code — messaging bridge with built-in access cont… | 技能、MCP | 缺少 `bun` | Bun | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `zocks-advisor` | Seven skills for financial advisors, built exclusively on Zocks' structured m… | 技能、MCP | 端点返回 HTTP 404 | 远端 MCP（可能需要登录授权） | LicenseRef-Zocks-Modified-Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`zoom-plugin`](plugins/zoom-plugin/UPSTREAM.md)（已改编） | Claude plugin for planning, registering, building, and debugging Zoom integra… | 技能、MCP | 需要登录 | 环境变量 `ZOOM_CANVAS_MCP_ACCESS_TOKEN`；环境变量 `ZOOM_CHAT_MCP_ACCESS_TOKEN`；环境变量 `ZOOM_MCP_ACCESS_TOKEN`；环境变量 `ZOOM_MEETINGS_MCP_ACCESS_TOKEN`；环境变量 `ZOOM_REVENUE_ACCELERATOR_MCP_ACCESS_TOKEN`；环境变量 `ZOOM_TASKS_MCP_ACCESS_TOKEN`；环境变量 `ZOOM_WHITEBOARD_MCP_ACCESS_TOKEN`；远端 MCP（可能需要登录授权）；凭证 `Authorization` | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `zoominfo` | Connect AI agents to ZoomInfo's verified GTM context graph: 100M companies, 3… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |

### 数据与数据库

| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `aiven` | Easily deploy managed PostgreSQL (pg), Kafka, OpenSearch, Clickhouse and othe… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `alloydb` | Create, connect, and interact with an AlloyDB for PostgreSQL database and data. | MCP | 需要配置 `ALLOYDB_POSTGRES_PROJECT`、`ALLOYDB_POSTGRES_REGION`、`ALLOYDB_POSTGRES_CLUSTER` 等 | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `alloydb-omni` | Create, connect, and interact with an AlloyDB Omni database and data. | 技能、MCP | 需要配置 `ALLOYDB_OMNI_DATABASE`、`ALLOYDB_OMNI_USER`、`ALLOYDB_OMNI_PASSWORD` | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`aws-data-analytics`](plugins/aws-data-analytics/UPSTREAM.md)（已改编） | Data lake, analytics, and ETL workflows with S3 Tables, AWS Glue, and Athena.… | 技能、MCP | 可用（8 个工具） | Python/uv | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `azure-cosmos-db-assistant` | Azure Cosmos DB plugin for Claude Code. Includes 73 best-practice rules acros… | 技能、命令、子代理 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`azure-sql-developer`](plugins/azure-sql-developer/UPSTREAM.md)（已改编） | Agent skills for the Azure SQL Database container, the Azure SQL Database eng… | 技能 | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `bigdata-com` | Financial research and market intelligence on stocks, companies, sectors, and… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | See upstream license file | [claude](https://github.com/anthropics/claude-plugins-official) |
| `bigquery-data-analytics` | Connect, query, and generate data insights for BigQuery datasets and data. | 技能、MCP | 需要配置 `BIGQUERY_PROJECT` | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`clickhouse-best-practices`](plugins/clickhouse-best-practices/UPSTREAM.md)（已改编） | 28 best practice rules for ClickHouse schema design, query optimization, and … | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `cloud-sql-mysql` | Connect and interact with a Cloud SQL for MySQL database and data. | MCP | 需要配置 `CLOUD_SQL_MYSQL_PROJECT`、`CLOUD_SQL_MYSQL_REGION`、`CLOUD_SQL_MYSQL_INSTANCE` 等 | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `cloud-sql-postgresql` | Create, connect, and interact with a Cloud SQL for PostgreSQL database and data. | MCP | 需要配置 `CLOUD_SQL_POSTGRES_PROJECT`、`CLOUD_SQL_POSTGRES_REGION`、`CLOUD_SQL_POSTGRES_INSTANCE` 等 | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `cloud-sql-sqlserver` | Connect to Cloud SQL for SQL Server | MCP | 需要配置 `CLOUD_SQL_MSSQL_PROJECT`、`CLOUD_SQL_MSSQL_REGION`、`CLOUD_SQL_MSSQL_INSTANCE` 等 | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`data-agent-kit`](plugins/data-agent-kit/UPSTREAM.md)（已改编） | This plugin provides a specialized suite of skills for data engineers and dat… | 技能、MCP、Hook | 需要 gcloud 登录（ADC）；可用（9 个工具）；需要配置 `GCP_REGION`、`PROJECT_ID`；可用（0 个工具） | Node.js | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `dataproc` | Manage Dataproc clusters and jobs. | MCP | 需要配置 `DATAPROC_PROJECT`、`DATAPROC_REGION` | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`duckdb-skills`](plugins/duckdb-skills/UPSTREAM.md)（已改编） | DuckDB-powered skills for Claude Code: read any data file, attach and query D… | 技能 | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `firebase` | Google Firebase MCP integration. Manage Firestore databases, authentication, … | MCP | 可用（19 个工具） | Node.js | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `firestore-native` | Connect and interact with Firestore databases, collections, and documents. | MCP | 需要配置 `FIRESTORE_PROJECT` | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `knowledge-catalog` | Connect to Knowledge Catalog to discover, manage, monitor, and govern data an… | MCP | 需要配置 `DATAPLEX_PROJECT` | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `looker` | Connect to Looker and interact with your data using LookML. | MCP | 需要配置 `LOOKER_BASE_URL` | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `lovable` | Build, iterate on, deploy, and manage Lovable apps from Claude Code. Bundles … | MCP、命令 | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`mixpanel-headless`](plugins/mixpanel-headless/UPSTREAM.md)（已改编） | Analyze Mixpanel data with the mixpanel_headless Python SDK and Codex skills. | 技能 | — | — | MIT | 本仓库改编自 [openai](https://github.com/openai/plugins) |
| [`mongodb`](plugins/mongodb/UPSTREAM.md)（已改编） | Connect to any MongoDB deployment (Community, Enterprise Advanced, local dev … | 技能、MCP | 可用（27 个工具） | Node.js | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `neon` | Manage your Neon backend with the Neon agent skills and the Neon MCP Server: … | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `omneky` | Omneky ads, analytics, product catalogue, and creative generation via the hos… | MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Proprietary | [xai](https://github.com/xai-org/plugin-marketplace) |
| [`oracle-ai-data-platform-workbench-databricks-migrator`](plugins/oracle-ai-data-platform-workbench-databricks-migrator/UPSTREAM.md)（已改编） | Drive the Oracle AI Data Platform (AIDP) Databricks Migration Toolkit in natu… | 技能、命令、子代理 | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`oracle-ai-data-platform-workbench-engineer-agent`](plugins/oracle-ai-data-platform-workbench-engineer-agent/UPSTREAM.md)（已改编） | Operate the entire Oracle AI Data Platform (AIDP) Workbench in natural langua… | 技能、Hook | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`oracle-ai-data-platform-workbench-spark-connectors`](plugins/oracle-ai-data-platform-workbench-spark-connectors/UPSTREAM.md)（已改编） | Oracle AI Data Platform Workbench Spark connectors for Claude Code. 26 connec… | 技能 | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `oracledb` | Connect, query, and interact with Oracle Databases and their data. | MCP | 需要配置 `ORACLE_CONNECTION_STRING`、`ORACLE_USERNAME`、`ORACLE_PASSWORD` | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`pendo-analytics`](plugins/pendo-analytics/UPSTREAM.md)（已改编） | Bring Pendo analytics into Claude Code with skills for app health, account he… | 技能、MCP | 需要登录 | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `planetscale` | An authenticated hosted MCP server that accesses your PlanetScale organizatio… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `prisma` | Prisma MCP integration for Postgres database management, schema migrations, S… | MCP | 可用（3 个工具）；需要登录 | Node.js；远端 MCP（可能需要登录授权） | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `qdrant-skills` | Agent skills for Qdrant vector search: scaling, performance optimization, sea… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `sap-hana-cli` | 150+ SAP HANA database tools for AI assistants. Query tables, import/export d… | MCP | 可用（22 个工具） | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `setup-agent-analytics` | Detect AI agents in your codebase and instrument them with Pendo agent analyt… | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`setup-mcp-agent-analytics`](plugins/setup-mcp-agent-analytics/UPSTREAM.md)（已改编） | Detect an MCP server's language (Python, TypeScript, Go, or Java) and instrum… | 技能 | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `spanner` | Connect and interact with Spanner data using natural language. | MCP | 需要配置 `SPANNER_PROJECT`、`SPANNER_INSTANCE`、`SPANNER_DATABASE` | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`vsql-extension-builder`](plugins/vsql-extension-builder/UPSTREAM.md)（已改编） | Skills for VillageSQL including building extensions from scratch and porting … | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |

### 开发工具

| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `academy-guide` | Recommends relevant Claude Academy courses, tutorials, and use cases when use… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `amazon-location-service` | Guide developers through adding maps, places search, geocoding, routing, and … | 技能、MCP | 需要 AWS 凭证 | Python/uv | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `blackrock-advisor-center-plugin` | BlackRock Advisor Center 360° skills for AC360 capability routing, guided ben… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `carbone-skill` | Official Carbone skill — complete templating language reference covering tags… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`champion-kit`](plugins/champion-kit/UPSTREAM.md)（已改编） | Help Claude Code champions run hackathons and office hours, find patterns wor… | 技能、命令、子代理 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`ckeditor`](plugins/ckeditor/UPSTREAM.md)（已改编） | Install, configure, and integrate CKEditor 5 (free and premium) in any JavaSc… | 技能 | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`claude-api`](plugins/claude-api/UPSTREAM.md)（已改编） | Claude API and SDK documentation skill for building LLM-powered applications | 技能 | — | — | Apache-2.0 | 本仓库改编自 [skills](https://github.com/anthropics/skills) |
| [`claude-code-setup`](plugins/claude-code-setup/UPSTREAM.md)（已改编） | Analyze codebases and recommend tailored Claude Code automations such as hook… | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `clay`（含 Claude 专属说明） | Build with Clay in Codex | 技能、Hook | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`coderabbit`](plugins/coderabbit/UPSTREAM.md)（已改编） | AI-powered code review, review-comment autofix, and repository configuration,… | 技能、命令、子代理 | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`confidence`](plugins/confidence/UPSTREAM.md)（已改编） | Access Confidence feature flags, experiments, and migration tools directly fr… | 技能、MCP、命令 | 可用；需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `context7` | Upstash Context7 MCP server for up-to-date documentation lookup. Connects to … | MCP | 需要登录 | 远端 MCP（可能需要登录授权） | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`deepeval`](plugins/deepeval/UPSTREAM.md)（已改编） | Skills for adding DeepEval evaluations, tracing, datasets, Confident AI repor… | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `desktop-commander` | MCP server for terminal commands, process management, and file operations acr… | 技能、MCP | 可用（25 个工具） | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `discernment-nudge` | Appends two or three short follow-up questions after a substantive answer to … | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| [`exa`](plugins/exa/UPSTREAM.md)（已改编） | A Model Context Protocol server with Exa for web search, code search, and web… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `example-skills`（含 Claude 专属说明） | Collection of example skills demonstrating various capabilities including ski… | 技能 | — | — | 未声明 | [skills](https://github.com/anthropics/skills) |
| `fakechat` | Localhost iMessage-style web chat for Claude Code — test surface with file up… | MCP | 缺少 `bun` | Bun | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `fastly-agent-toolkit` | Fastly development tools and platform skills | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`fiftyone`](plugins/fiftyone/UPSTREAM.md)（已改编） | Agent Context Protocol (ACP) skills for computer vision workflows using Fifty… | 技能、MCP、命令 | 缺少 `fiftyone-mcp` | 命令 `fiftyone-mcp` | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `firecrawl` | Search the web, developer sources, and scientific papers with Firecrawl. | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`forge-skills`](plugins/forge-skills/UPSTREAM.md)（已改编） | Forge app builder skill bundle with Forge MCP integration for Atlassian Forge… | 技能、MCP | 可用 | 远端 MCP（可能需要登录授权） | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `github` | Official GitHub MCP server for repository management. Create issues, manage p… | MCP | 需要登录 | 环境变量 `GITHUB_PERSONAL_ACCESS_TOKEN`；远端 MCP（可能需要登录授权）；凭证 `Authorization` | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `gitkraken` | This plugin gives Claude access to your real Git and project context: commits… | MCP | 可用（35 个工具） | Node.js | See upstream license file | [claude](https://github.com/anthropics/claude-plugins-official) |
| `gitlab` | GitLab DevOps platform integration. Manage repositories, merge requests, CI/C… | MCP | 需要登录 | 远端 MCP（可能需要登录授权） | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `govtribe` | GovCon research and capture | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`greptile`](plugins/greptile/UPSTREAM.md)（已改编） | AI code review agent for GitHub and GitLab. View Greptile's PR review comment… | 技能、MCP | 可用 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`huggingface-skills`](plugins/huggingface-skills/UPSTREAM.md)（已改编） | Core Hugging Face Hub operations through the hf CLI, including skill installa… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `idmp-plugin` | TDengine IDMP plugin with packaged skills for discovery, schema inspection, a… | 技能 | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `laravel-boost` | Laravel development toolkit MCP server. Provides intelligent assistance for L… | MCP | 缺少 `php` | 命令 `php`；PHP | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `leadfeeder` | Turn website visitor signals into pipeline. Six Leadfeeder-powered skills — G… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `lusha` | Find and enrich B2B contacts and companies with verified emails, direct dials… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `magicpath` | Use MagicPath to find, inspect, install, create, and edit UI components from … | 技能 | — | — | Proprietary | [openai](https://github.com/openai/plugins) |
| `mapbox` | Mapbox skills and MCP servers for building location-aware applications with A… | 技能、MCP | 需要登录；可用 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `mcp-apps` | Claude Code skill for building MCP Apps with interactive UIs | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`mintlify`](plugins/mintlify/UPSTREAM.md)（已改编） | Build beautiful documentation sites with Mintlify. Convert non-markdown files… | 技能、MCP | 需要登录；可用 | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `modern-web-guidance` | Keep your coding agent up to date with the latest web best practices | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `netsuite-ai-companion` | Guide AI assistants using NetSuite AI Connector. | 技能 | — | — | The Universal Permissive License (UPL), Version 1.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `netsuite-finance-analyst` | Deliver Director-level finance analysis on live NetSuite data. | 技能 | — | — | The Universal Permissive License (UPL), Version 1.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `nvidia`（含 Claude 专属说明） | Skills for NVIDIAs ecosystem spans GPU acceleration, CUDA, AI agents, inferen… | 技能 | — | — | Apache-2.0 AND CC-BY-4.0 | [openai](https://github.com/openai/plugins) |
| `nvidia-skills` | Find the right NVIDIA skill for GPU acceleration, CUDA, AI agents, data loadi… | 技能 | — | — | Apache-2.0 AND CC-BY-4.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `openai-ads-conversions` | Set up OpenAI Ads Measurement Pixel and optional Conversions API instrumentat… | 技能 | — | — | Proprietary | [openai](https://github.com/openai/plugins) |
| `pendo-guides` | Create production-ready Pendo in-app guides (walkthroughs, announcements, ale… | 技能、MCP | 需要登录 | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `pigment` | Analyze business data and build planning models in your Pigment workspace | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | See upstream license file | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`pixeltable`](plugins/pixeltable/UPSTREAM.md)（已改编） | Build multimodal AI applications with Pixeltable using declarative tables, co… | 技能、Hook、命令、子代理 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `playground` | Creates interactive HTML playgrounds — self-contained single-file explorers w… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `preset-cli-skills` | Preset CLI skills for explicit shell, scripting, and CI/CD workflows driven b… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`project-artifact`](plugins/project-artifact/UPSTREAM.md)（已改编） | Generate and publish a project status artifact — an opinionated, tabbed statu… | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `qodo` | Qodo setup, code intelligence, and review workflows. | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `qodo-standards` | Optional Qodo standards discovery and review rules/skills administration work… | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `qt-development-skills` | Agentic engineering skills for Qt software development, including Qt C++/QML … | 技能、MCP | 可用 | 远端 MCP（可能需要登录授权） | See upstream license file | [claude](https://github.com/anthropics/claude-plugins-official) |
| `quarkus-agent` | MCP server for AI coding agents to create, manage, and interact with Quarkus … | MCP | 缺少 `jbang` | 命令 `jbang`；JBang | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `quo` | Manage Quo business communications from Grok Build: send texts, work with con… | MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [xai](https://github.com/xai-org/plugin-marketplace) |
| `rc` | Set up RevenueCat, integrate it, and access data. | 技能、MCP | 需要登录 | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`receipts`](plugins/receipts/UPSTREAM.md)（已改编） | A personal Claude Code impact report for justifying your usage to a manager o… | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `revenuecat` | Set up RevenueCat, integrate it, and access data. | 技能、MCP | 需要登录 | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `rill` | Skills for developing and querying projects in the Rill business intelligence… | 技能、MCP | 需要先在本机启动对应服务 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`sanity`](plugins/sanity/UPSTREAM.md)（已改编） | Sanity plugin with an MCP server and agent skills for structured content deve… | 技能、MCP、命令 | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `sap-mdk-server` | Model Context Protocol (MCP) server for AI-assisted development of MDK applic… | MCP | 缺少 `mdk-mcp` | Node.js；命令 `mdk-mcp` | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `serena` | Semantic code analysis MCP server providing intelligent code understanding, r… | MCP | 可用（3 个工具） | Python/uv | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`session-report`](plugins/session-report/UPSTREAM.md)（已改编） | Generate an explorable HTML report of Claude Code session usage — tokens, cac… | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `shippo` | Shippo connects you to USPS, UPS, FedEx, DHL, and 40+ carriers, so you can ha… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `shopify-ai-toolkit` | Shopify developer tools for OpenAI Codex — search Shopify docs, generate and … | 技能、Hook | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`snowflake-cortex-code`](plugins/snowflake-cortex-code/UPSTREAM.md)（已改编） | Automatically route Snowflake prompts from Codex to Cortex Code for execution. | 技能、Hook | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `sourcegraph` | Use Sourcegraph MCP from Claude Code for code search, navigation, history, an… | 技能、MCP | 需要配置服务地址 | 环境变量 `SOURCEGRAPH_ENDPOINT`；环境变量 `SOURCEGRAPH_ACCESS_TOKEN`；远端 MCP（可能需要登录授权）；凭证 `Authorization` | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`streaming-skills-plugin`](plugins/streaming-skills-plugin/UPSTREAM.md)（已改编） | Skills for streaming application developers, covering Kafka and Flink client … | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`sumup`](plugins/sumup/UPSTREAM.md)（已改编） | Skills for SumUp payment integrations across terminal and online checkout flows | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`superpowers`](plugins/superpowers/UPSTREAM.md)（已改编） | An agentic skills framework & software development methodology that works: pl… | 技能 | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `synthflow` | Connects Claude Code to the Synthflow AI voice-agent platform through its hos… | 技能、MCP | 需要登录；可用 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `tavily` | Build AI applications with real-time web data using Tavily's search, extract,… | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `terraform` | The Terraform MCP Server provides seamless integration with Terraform ecosyst… | MCP | 缺少 `docker` | 环境变量 `TFE_TOKEN`；Docker | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`twilio-developer-kit`](plugins/twilio-developer-kit/UPSTREAM.md)（已改编） | Twilio Skills provide procedural knowledge for AI coding agents — which APIs … | 技能、MCP | 可用 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `ui5` | SAPUI5 / OpenUI5 plugin for coding agents. Creates and validates UI5 projects… | 技能、MCP | 可用（10 个工具） | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `ui5-modernization` | Complete UI5 modernization toolkit with workflow and specialized fix patterns… | 技能、MCP | 可用（33 个工具） | Node.js | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `ui5-typescript-conversion` | SAPUI5 / OpenUI5 plugin for coding agents. Converts JavaScript-based UI5 proj… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `unity`（含 Claude 专属说明） | Unity's official plugin for Codex, with curated skills for game development, … | 技能 | — | — | LicenseRef-Unity-Companion-License | [claude](https://github.com/anthropics/claude-plugins-official) |
| `valtown` | Build and deploy on Val Town. Bundles the Val Town MCP server and platform sk… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `vanguard-advisor-tools` | Research and evaluate investment products across the industry using Vanguard … | 技能、MCP | 需要登录 | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `vibe-prospecting` | Power your chat with B2B data to create lead lists, research companies, perso… | 技能、命令 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `web-artifacts-builder` | Suite of tools for creating elaborate, multi-component claude.ai HTML artifac… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `youdotcom-agent-skills` | You.com skills for search, contents, research, finance, and integration disco… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `zyte-web-data` | Zyte Web Data for Claude Code | 技能、Hook | — | — | See upstream license file | [claude](https://github.com/anthropics/claude-plugins-official) |

### 测试

| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `aws-serverless` | Design, build, deploy, test, and debug serverless applications with AWS Serve… | 技能、MCP、Hook | 可用（25 个工具） | Python/uv | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `browser-use` | Give Claude a real browser — your Chrome or a Browser Use Cloud browser. Use … | MCP | 可用（4 个工具） | Python/uv | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `circleci` | Build, test, and deploy any application | 技能 | — | — | MIT | [openai](https://github.com/openai/plugins) |
| [`cloudflare`](plugins/cloudflare/UPSTREAM.md)（已改编） | Build, test, and deploy applications on Cloudflare with platform guidance Ski… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `playwright` | Browser automation and end-to-end testing MCP server by Microsoft. Enables Cl… | MCP | 可用（25 个工具） | Node.js | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `pydantic-ai` | Build production-grade AI agents with Pydantic AI — tools, capabilities, stru… | 技能 | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`skill-creator`](plugins/skill-creator/UPSTREAM.md)（已改编） | Create new skills, improve existing skills, and measure skill performance. Us… | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`unreal-engine-skills-for-claude-code`](plugins/unreal-engine-skills-for-claude-code/UPSTREAM.md)（已改编） | Control Unreal Editor directly from Claude Code via MCP. Hundreds of tools ex… | 技能、Hook | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `webapp-testing` | Toolkit for interacting with and testing local web applications using Playwri… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |

### 安全

| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `42crunch-api-security-testing` | Catch API security issues during development: audit, scan, remediate, validat… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `aikido` | Aikido Security for Claude Code: scan code (SAST, secrets, IaC) and list all … | 技能、MCP | 可用（13 个工具） | Node.js | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`auth0`](plugins/auth0/UPSTREAM.md)（已改编） | Add Auth0 authentication to any app — login, MFA, SSO, Organizations, RBAC, A… | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`aws-agents-for-devsecops`](plugins/aws-agents-for-devsecops/UPSTREAM.md)（已改编） | Investigate incidents, review code and execute UAT for release readiness, sca… | 技能、命令 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `aws-transform` | Migrate, modernize, and upgrade codebases to AWS. Transforms .NET Framework t… | 技能、MCP | 可用（21 个工具） | Python/uv | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `crowdsec` | CrowdSec skills: an operational skill (install/configure/operate/debug the en… | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`crowdstrike-falcon-foundry`](plugins/crowdstrike-falcon-foundry/UPSTREAM.md)（已改编） | Build Falcon Foundry apps with guided workflows for UI, functions, collection… | 技能、Hook | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`crowdstrike-falcon-fusion`](plugins/crowdstrike-falcon-fusion/UPSTREAM.md)（已改编） | CrowdStrike Falcon Fusion skills for authoring, deploying, and executing Fusi… | 技能、Hook | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`dataverse`](plugins/dataverse/UPSTREAM.md)（已改编） | Microsoft Dataverse plugin for coding agents, covering record CRUD, bulk data… | 技能 | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `duende-skills` | Duende development skills and agents — covering OAuth/OIDC protocols, Identit… | 技能、命令、子代理 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `dynatrace` | Connect Claude Code to your Dynatrace environment and investigate production … | 技能、MCP | 需要配置服务地址 | 环境变量 `DT_ENVIRONMENT`；环境变量 `DT_PLATFORM_TOKEN`；远端 MCP（可能需要登录授权）；凭证 `Authorization` | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`google-cloud-storage`](plugins/google-cloud-storage/UPSTREAM.md)（已改编） | Official Google Cloud Storage (GCS) plugin. Storage tools plus vetted skills … | 技能、MCP | 需要配置 `CLOUD_STORAGE_PROJECT` | Node.js | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`jfrog`](plugins/jfrog/UPSTREAM.md)（已改编） | Official JFrog plugin. Connect Claude Code to JFrog to manage, secure, and go… | 技能、MCP、Hook | 需要配置服务地址 | 环境变量 `JFROG_URL`；远端 MCP（可能需要登录授权） | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `miro` | Secure access to Miro boards. Enables AI to read board context, create diagra… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `nightvision` | Skills for working with NightVision, a DAST and API Discovery platform that f… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `redis-development` | Redis development best practices for data modeling, search, caching, connecti… | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `security-guidance` | Security review for Claude-generated code. Pattern-based warnings on edits, L… | Hook | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `semgrep` | Semgrep Guardian scans agent-generated code for security vulnerabilities. | 技能、MCP、Hook | 可用（11 个工具） | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `sonatype-guide` | Sonatype Guide MCP server for software supply chain intelligence and dependen… | 技能、MCP | 需要登录 | 环境变量 `SONATYPE_GUIDE_TOKEN`；远端 MCP（可能需要登录授权）；凭证 `Authorization` | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `stackhawk-api` | Query the StackHawk platform API for security posture reporting, findings ana… | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `stackhawk-hawkscan` | Configure, run, and interpret HawkScan DAST results. Generates stackhawk.yml … | 技能、Hook | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `vanta` | Vanta MCP server integration for Claude Code | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `vanta-mcp-plugin` | Vanta MCP server integration for Claude Code | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |

### 云与部署

| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `aws-amplify` | Build full-stack apps with AWS Amplify Gen 2 using guided workflows for authe… | 技能、MCP | 需要 AWS 凭证 | Python/uv | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`aws-core`](plugins/aws-core/UPSTREAM.md)（已改编） | Build, deploy, and operate applications on AWS. Skills to author infrastructu… | 技能、MCP、Hook | 可用（8 个工具） | Python/uv | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`aws-startup-advisor`](plugins/aws-startup-advisor/UPSTREAM.md)（已改编） | AWS Startup Advisor puts an AWS Startups Solutions Architect in your coding a… | 技能、MCP、Hook、命令、子代理 | 可用（8 个工具） | Python/uv | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`catalyst-by-zoho`](plugins/catalyst-by-zoho/UPSTREAM.md)（已改编） | Official Claude Code plugin for Catalyst by Zoho — full-stack serverless clou… | 技能、MCP、Hook、命令 | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `deploy-on-aws` | Deploy applications to AWS with architecture recommendations, cost estimates,… | 技能、MCP、Hook | 可用（9 个工具）；可用 | Python/uv；远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `hostinger` | Deploy, manage and monitor Hostinger services — Websites, Domains & DNS, Ecom… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `lumen` | Precise local semantic code search via MCP. Indexes your codebase with Go AST… | 技能、MCP、Hook | 可用（3 个工具） | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `microsoft-docs` | Access official Microsoft documentation, API references, and code samples for… | 技能、MCP | 可用 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`migration-to-aws`](plugins/migration-to-aws/UPSTREAM.md)（已改编） | Migrate from GCP or Heroku to AWS — including your entire AI stack. Moves inf… | 技能、MCP、命令、子代理 | 可用（10 个工具）；可用；可用（9 个工具）；需要登录 | 远端 MCP（可能需要登录授权）；Python/uv；Node.js | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`netlify`](plugins/netlify/UPSTREAM.md)（已改编） | Netlify platform skills for Claude Code | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [xai](https://github.com/xai-org/plugin-marketplace) |
| [`netlify-skills`](plugins/netlify-skills/UPSTREAM.md)（已改编） | Netlify platform skills for Claude Code | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`netsuite-suitecloud`](plugins/netsuite-suitecloud/UPSTREAM.md)（已改编） | Develop NetSuite SuiteCloud solutions with SuiteScript, SDF, and best practices. | 技能 | — | — | The Universal Permissive License (UPL), Version 1.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `sagemaker-ai` | Build, train, and deploy AI models with deep AWS AI/ML expertise brought dire… | 技能、MCP | 需要 AWS 凭证 | Python/uv | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `servicenow-sdk` | Create, edit, and deploy ServiceNow applications with the Fluent SDK effortle… | 技能 | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `skyvern` | Give Grok a cloud browser through Skyvern's hosted MCP server. Open pages, cl… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [xai](https://github.com/xai-org/plugin-marketplace) |
| `temporal` | Comprehensive skill for the entire Temporal lifecycle — developing applicatio… | 技能 | — | — | MIT | [openai](https://github.com/openai/plugins) |
| `wix` | Build and deploy Wix apps and headless websites, and manage your Wix business… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |

### 运维与监控

| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `amplitude` | Use Amplitude as an expert analyst and instrumentation partner inside Codex. | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `aws-agents` | Build, deploy, and operate AI agents on AWS. Skills for scaffolding agents wi… | 技能、MCP | 可用 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `axiom` | Use Axiom in your coding agent to search logs, query metrics, and follow trac… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [xai](https://github.com/xai-org/plugin-marketplace) |
| [`azure`](plugins/azure/UPSTREAM.md)（已改编） | Microsoft Azure MCP and Skills integration for cloud resource management, dep… | 技能、MCP、Hook | 缺少系统库 libicu | Node.js；系统库 libicu | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`dash0`](plugins/dash0/UPSTREAM.md)（已改编） | OpenTelemetry observability for OpenAI Codex sessions. Captures prompts, tool… | Hook | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`datadog`](plugins/datadog/UPSTREAM.md)（已改编） | Use Datadog directly in Claude Code through a preconfigured Datadog MCP serve… | 技能、MCP、Hook | 需要配置服务地址 | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `grafana-assistant` | Skills and rules for developing and using the Grafana Assistant app and CLI. | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `grafana-cloud-mcp` | Connect Codex to your Grafana Cloud stack to query metrics, logs, traces, and… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`incident-io`](plugins/incident-io/UPSTREAM.md)（已改编） | Makes your agent fluent in incident.io: responding to and investigating incid… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `langfuse` | Skills for working with Langfuse, the open-source LLM engineering platform fo… | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `langfuse-observability` | The Langfuse x Claude Code Observability Plugin | Hook | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`logfire`](plugins/logfire/UPSTREAM.md)（已改编） | Add Logfire observability to Python applications with auto-instrumentation fo… | 技能、MCP、命令 | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `logrocket` | Connect Claude Code to LogRocket to query session replays, metrics, issues, a… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `mlflow` | Skills for tracing, evaluating, and improving AI agents with MLflow. Supports… | 技能、Hook | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `newrelic` | New Relic observability intelligence for Claude Code. Investigate APM perform… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `noibu`（含 Claude 专属说明） | Connects Claude to the Noibu MCP server | 技能 | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`railway`](plugins/railway/UPSTREAM.md)（已改编） | Deploy, configure, monitor, and troubleshoot apps and infrastructure on Railw… | 技能、MCP、Hook | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`render`](plugins/render/UPSTREAM.md)（已改编） | Deploy, debug, and monitor applications on Render. Includes skills, an agent,… | 技能、MCP、Hook、命令、子代理 | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `sentry` | Sentry Plugin for Claude Code to help with debugging including MCP and skill … | 技能、MCP | 需要登录 | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `sentry-cli` | Skills for using the Sentry CLI to interact with Sentry from the command line | 技能 | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| [`wingspan`](plugins/wingspan/UPSTREAM.md)（已改编） | The contractors you pay through Wingspan, what you owe them, and what is hold… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |

### 设计与创意

| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `adobe-for-creativity` | Brings together Adobe Creative Cloud tools for images, vectors, design, and v… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `algorithmic-art` | Creating algorithmic art using p5.js with seeded randomness and interactive p… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `amd-skills`（含 Claude 专属说明） | AMD's verified Agent Skills in one plugin: route image/audio through local AI… | 技能 | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `boltz` | Predict structures, screen molecules and proteins, and design binders with Bo… | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `boltz-api-cli` | Predict structures, screen molecules and proteins, and design binders. | 技能 | — | — | MIT | [openai](https://github.com/openai/plugins) |
| [`brightdata-plugin`](plugins/brightdata-plugin/UPSTREAM.md)（已改编） | Web scraping, Google search, structured data extraction, and MCP server integ… | 技能 | — | — | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `canvas-design` | Create beautiful visual art in .png and .pdf documents using design philosoph… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `cloudinary` | Use Cloudinary directly in your agent. Upload, manage, optimize, and transfor… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权）；凭证 `cld-api-key`；凭证 `cld-secret` | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `frontend-design` | Frontend design skill for UI/UX implementation | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `game-studio` | Design, prototype, and ship browser games with guided 2D and 3D workflows, as… | 技能 | — | — | MIT | [openai](https://github.com/openai/plugins) |
| [`honeycomb`](plugins/honeycomb/UPSTREAM.md)（已改编） | Skills, agents, and workflows for Honeycomb observability — query patterns, p… | 技能、MCP、Hook、命令、子代理 | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| [`hyperframes`](plugins/hyperframes/UPSTREAM.md)（已改编） | Write HTML, render video. Compositions, GSAP animations, captions, voiceovers… | 技能 | — | — | Apache-2.0 | 本仓库改编自 [openai](https://github.com/openai/plugins) |
| `learn-with-coursera` | Turn any learning intent into a personalized Coursera experience. Asks three … | 技能 | — | — | 未声明 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `liquid-skills` | Liquid language fundamentals, CSS/JS/HTML coding standards, and WCAG accessib… | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `mcp-builder` | Guide for creating high-quality MCP (Model Context Protocol) servers that ena… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| [`mcp-server-dev`](plugins/mcp-server-dev/UPSTREAM.md)（已改编） | Skills for designing and building MCP servers that work seamlessly with Claud… | 技能 | — | — | Apache-2.0 | 本仓库改编自 [claude](https://github.com/anthropics/claude-plugins-official) |
| `mergify` | Skills for the Mergify CLI: merge queue, stacked pull requests, CI Insights, … | 技能 | — | — | LicenseRef-Mergify-Proprietary | [claude](https://github.com/anthropics/claude-plugins-official) |
| `octen` | Live web and news search, company and place lookup, fast URL lookup, broad mu… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [xai](https://github.com/xai-org/plugin-marketplace) |
| `plugin-eval` | Evaluate Codex skills and plugins from chat with a beginner-friendly start co… | 技能 | — | — | MIT | [openai](https://github.com/openai/plugins) |
| `remotion` | Remotion video creation skills — best practices, animations, audio, captions,… | 技能 | — | — | MIT | [openai](https://github.com/openai/plugins) |
| `runway-api` | Get guidance for integrating video, image and audio generation with the Runwa… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `save-to-spotify` | Create polished audio episodes with TTS narration, rich timelines, cover imag… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `scandit-sdk` | AI agent skills for integrating the Scandit Data Capture SDK — product select… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `slack-gif-creator` | Knowledge and utilities for creating animated GIFs optimized for Slack. Provi… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `theme-factory` | Toolkit for styling artifacts with a theme. These artifacts can be slides, do… | 技能 | — | — | Apache-2.0 | [skills](https://github.com/anthropics/skills) |
| `togetherai-skills` | Agent Skills for Together AI platform — inference, training, embeddings, audi… | 技能 | — | — | MIT | [claude](https://github.com/anthropics/claude-plugins-official) |
| `ui-theme-designer` | Plugin for coding agents working with UI theme designer. Bundles two skills: … | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `videogen` | AI video generator and AI video editor. Go from text to video, image to video… | 技能、MCP | 需要登录 | 远端 MCP（可能需要登录授权） | MIT | [xai](https://github.com/xai-org/plugin-marketplace) |

### 学习与研究

| 插件 | 说明 | 能力 | MCP 测试 | 需要 | 许可证 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `explanatory-output-style` | Adds educational insights about implementation choices and codebase patterns … | Hook | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `learning-output-style` | Interactive learning mode that requests meaningful code contributions at deci… | Hook | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `life-science-research` | General life-sciences research workflows with query routing, evidence synthes… | 技能 | — | — | Proprietary | [openai](https://github.com/openai/plugins) |
| `math-olympiad` | Solve competition math (IMO, Putnam, USAMO) with adversarial verification tha… | 技能 | — | — | Apache-2.0 | [claude](https://github.com/anthropics/claude-plugins-official) |
| `ngs-analysis` | Guided NGS intake, local execution, and public-pipeline routing for BCL, FAST… | 技能 | — | — | MIT | [openai](https://github.com/openai/plugins) |
| `zotero` | Work with Zotero from Codex: search your library, export BibTeX, insert citat… | 技能 | — | — | MIT | [openai](https://github.com/openai/plugins) |
<!-- catalog:end -->

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
scripts/kcoder-smoke.sh            用真实 KCoder 安装验证
scripts/render-catalog.mjs         由 catalog 生成 README 插件表
catalog/plugins.json               每个上游插件的来源、许可证、能力和验证记录
```

## 校验

```bash
node scripts/validate.mjs                  # 静态校验清单、路径、密钥、格式和验证记录
node scripts/render-catalog.mjs --check    # README 插件表与 catalog/plugins.json 一致
node --test scripts/validate.test.mjs      # 校验脚本自身的测试
KCODER_BIN=/path/to/kcoder JOBS=8 sh scripts/kcoder-smoke.sh   # 真实安装全部条目
KCODER_BIN=/path/to/kcoder sh scripts/kcoder-smoke.sh github  # 只验证指定条目
```

CI 会在每次提交和 PR 时运行前三项。真实加载需要 KCoder CLI，合并插件前请在本地运行；脚本使用临时的隔离配置，不会改动你的 KCoder 设置，也不会执行插件的 Hook 或 MCP 服务。

## 收录新插件

见 [CONTRIBUTING.md](CONTRIBUTING.md)，里面说明了自有插件、引用上游插件和改编第三方插件三种方式的要求。

## 安全说明

- 插件的 Hook 和 MCP 服务会在你的机器上执行命令。安装前请查看插件目录里的 `hooks/hooks.json` 和 `mcp.json`。
- 本仓库不保存任何凭证。需要账号或 API 密钥的插件，请在 KCoder 的凭证设置中配置。
- 引用上游的插件都固定到具体提交，上游后续的改动需要重新审核才会生效。

## 许可证

本仓库尚未选定许可证。改编自第三方的插件保留其原始许可证文件，以各自目录内的声明为准。
