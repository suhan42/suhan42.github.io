# 内容清点表

更新时间：2026-11-18

本文记录当前 Eleventy 内容源的实际状态。迁移前 P0 清点快照可从 `pre-eleventy-migration` 标签和 git 历史查看，不再把已删除的 `posts/`、`views/` 路径当作当前文件。

## 当前统计

| 项目 | 数量或状态 |
|---|---:|
| 文章源 | 61 |
| published 文章 | 61 |
| draft 文章 | 0 |
| 父分类（当前使用） | 3（`acgn`、`essay`、`it`） |
| 子分类（front matter 声明） | 10（`blog`、`database`、`docker`、`flowchart`、`git`、`linux`、`llm`、`markdown`、`operations-research`、`rag`） |
| 标签页 | 18 |
| 独立特殊页 | 2 |

## 文章源

下表日期是当前 front matter 的实际值，已经作为排序、归档、RSS 和 sitemap 的唯一依据；`docker` 三篇使用 `2026-11-11`，2026-11-18 批量导入的 47 篇统一使用 `2026-11-18`。

| 源文件 | 标题 | date | slug | category | tags | status |
|---|---|---|---|---|---|---|
| `src/content/posts/成本.md` | 成本与成本分类 | 2026-11-18 | `cost-classification` | `it` | `operations-research` | published |
| `src/content/posts/database/1. 数据库基础.md` | 数据库基础 | 2026-11-18 | `database-basics` | `it` | `database` | published |
| `src/content/posts/database/2.数据库设计.md` | 数据库设计 | 2026-11-18 | `database-design` | `it` | `database` | published |
| `src/content/posts/database/3. MySQL命令.md` | MySQL 命令 | 2026-11-18 | `mysql-commands` | `it` | `database` | published |
| `src/content/posts/database/4.数据库编程.md` | 数据库编程 | 2026-11-18 | `database-programming` | `it` | `database` | published |
| `src/content/posts/database/5.过程式数据库对象.md` | 过程式数据库对象 | 2026-11-18 | `database-procedural-objects` | `it` | `database` | published |
| `src/content/posts/database/6.事务与并发控制.md` | 事务与并发控制 | 2026-11-18 | `transactions-and-concurrency` | `it` | `database` | published |
| `src/content/posts/database/7.数据库安全与保护.md` | 数据库安全与保护 | 2026-11-18 | `database-security` | `it` | `database`, `security` | published |
| `src/content/posts/database/Redis.md` | Redis 入门 | 2026-11-18 | `redis-basics` | `it` | `database` | published |
| `src/content/posts/微信小程序.md` | 微信小程序开发 | 2026-11-18 | `wechat-miniprogram` | `it` | `wechat` | published |
| `src/content/posts/operations-research/10盈亏分析模型.md` | 盈亏分析模型 | 2026-11-18 | `break-even-analysis` | `it` | `operations-research` | published |
| `src/content/posts/operations-research/11模拟的基本概念.md` | 模拟的基本概念 | 2026-11-18 | `simulation-basics` | `it` | `operations-research` | published |
| `src/content/posts/operations-research/1导论.md` | 运筹学导论 | 2026-11-18 | `operations-research-introduction` | `it` | `operations-research` | published |
| `src/content/posts/operations-research/2预测.md` | 预测方法 | 2026-11-18 | `forecasting-methods` | `it` | `operations-research` | published |
| `src/content/posts/operations-research/3决策.md` | 决策分析 | 2026-11-18 | `decision-analysis` | `it` | `operations-research` | published |
| `src/content/posts/operations-research/4库存管理.md` | 库存管理 | 2026-11-18 | `inventory-management` | `it` | `operations-research` | published |
| `src/content/posts/operations-research/5线性规划.md` | 线性规划 | 2026-11-18 | `linear-programming` | `it` | `operations-research` | published |
| `src/content/posts/operations-research/6运输问题.md` | 运输问题 | 2026-11-18 | `transportation-problem` | `it` | `operations-research` | published |
| `src/content/posts/operations-research/7网络计划技术.md` | 网络计划技术 | 2026-11-18 | `network-planning` | `it` | `operations-research` | published |
| `src/content/posts/operations-research/8图论.md` | 图论方法 | 2026-11-18 | `graph-theory` | `it` | `operations-research` | published |
| `src/content/posts/operations-research/9马尔科夫分析.md` | 马尔科夫分析 | 2026-11-18 | `markov-analysis` | `it` | `operations-research` | published |
| `src/content/posts/git/Git commit规范.md` | Git Commit 规范 | 2026-11-18 | `git-commit-convention` | `it` | `git`, `workflow` | published |
| `src/content/posts/git/Git使用.md` | Git 使用 | 2026-11-18 | `git-usage` | `it` | `git`, `workflow` | published |
| `src/content/posts/linux/破解wifi.md` | Linux 破解 WiFi | 2026-11-18 | `linux-wifi-cracking` | `it` | `linux`, `security` | published |
| `src/content/posts/linux/网卡安装.md` | Linux 网卡驱动安装 | 2026-11-18 | `linux-nic-install` | `it` | `linux` | published |
| `src/content/posts/linux/shell脚本.md` | Shell 脚本 | 2026-11-18 | `shell-script` | `it` | `linux` | published |
| `src/content/posts/linux/vi.md` | vi 与 vim | 2026-11-18 | `vi-and-vim` | `it` | `linux` | published |
| `src/content/posts/linux/Wsl2配置Ubuntu.md` | WSL2 配置 Ubuntu | 2026-11-18 | `wsl2-ubuntu-setup` | `it` | `linux` | published |
| `src/content/posts/llm/大模型MoE架构.md` | 大模型 MoE 架构资料 | 2026-11-18 | `moe-architecture` | `it` | `llm` | published |
| `src/content/posts/llm/量化、蒸馏和剪枝.md` | 模型量化、蒸馏和剪枝 | 2026-11-18 | `model-compression` | `it` | `llm` | published |
| `src/content/posts/llm/Agent 架构.md` | Agent 架构 | 2026-11-18 | `agent-architecture` | `it` | `llm`, `agent` | published |
| `src/content/posts/llm/Dify.md` | Dify 工作流 | 2026-11-18 | `dify-workflow` | `it` | `llm`, `agent`, `workflow` | published |
| `src/content/posts/llm/Function Calling.md` | Function Calling 与工具调用 | 2026-11-18 | `function-calling` | `it` | `llm`, `agent` | published |
| `src/content/posts/llm/Harness Engineering.md` | Harness Engineering（驾驭工程） | 2026-11-18 | `harness-engineering` | `it` | `llm`, `agent` | published |
| `src/content/posts/llm/Hermes Agent.md` | Hermes Agent | 2026-11-18 | `hermes-agent` | `it` | `llm`, `agent` | published |
| `src/content/posts/llm/LLM API调参.md` | LLM API 调参 | 2026-11-18 | `llm-api-tuning` | `it` | `llm` | published |
| `src/content/posts/llm/LLM.md` | LLM 基础 | 2026-11-18 | `llm-basics` | `it` | `llm` | published |
| `src/content/posts/llm/Prompt.md` | Prompt Engineering | 2026-11-18 | `prompt-engineering` | `it` | `llm`, `prompt` | published |
| `src/content/posts/markdown/markdown中数学公式编辑.md` | Markdown 中数学公式编辑 | 2026-11-18 | `markdown-math` | `it` | `markdown` | published |
| `src/content/posts/markdown/mermaid画图.md` | Mermaid 画图 | 2026-11-18 | `mermaid-diagrams` | `it` | `markdown` | published |
| `src/content/posts/markdown/typora的逆向破解.md` | Typora 授权与激活机制分析 | 2026-11-18 | `typora-license-analysis` | `it` | `markdown`, `security` | published |
| `src/content/posts/python.md` | Python 笔记 | 2026-11-18 | `python-notes` | `it` | `python` | published |
| `src/content/posts/python线程、进程、异步.md` | Python 线程、进程与异步 | 2026-11-18 | `python-concurrency` | `it` | `python` | published |
| `src/content/posts/rag/RAG.md` | RAG 基础 | 2026-11-18 | `rag-basics` | `it` | `rag` | published |
| `src/content/posts/rag/RAG回测.md` | RAG 评估与回测 | 2026-11-18 | `rag-evaluation` | `it` | `rag` | published |
| `src/content/posts/rag/RAG检索配置.md` | RAG 检索配置 | 2026-11-18 | `rag-retrieval-config` | `it` | `rag` | published |
| `src/content/posts/rag/Vector Database（向量数据库）.md` | 向量数据库 | 2026-11-18 | `vector-database` | `it` | `rag` | published |
| `src/content/posts/docker/docker-compose.yml 和 docker-compose.override.yml.md` | docker-compose.yml 和 docker-compose.override.yml | 2026-11-11 | `docker-compose-config` | `it` | 无 | published |
| `src/content/posts/docker/Docker.md` | Docker 使用 | 2026-11-11 | `docker-usage` | `it` | 无 | published |
| `src/content/posts/docker/Docker自定义安装.md` | Docker 自定义安装 | 2026-11-11 | `docker-custom-install` | `it` | 无 | published |
| `src/content/posts/markdown/typora手册.md` | typora 手册 | 2026-10-22 | `typora-index` | `it` | `markdown` | published |
| `src/content/posts/database/PGvsMYSQL.md` | PostgreSQL 与 MySQL 对比 | 2026-09-17 | `postgresql-vs-mysql` | `it` | `database` | published |
| `src/content/posts/如何搜索.md` | 搜索的技巧 | 2025-06-25 | `search-tips` | `it` | `workflow` | published |
| `src/content/posts/Doxygen注释.md` | Doxygen 注释 | 2024-04-22 | `doxygen-comments` | `it` | `cpp`, `c` | published |
| `src/content/posts/what did you learn from your heartbreak.md` | what did you learn from your heartbreak | 2023-09-26 | `learn-from-heartbreak` | `essay` | `essay` | published |
| `src/content/posts/blog/marked造轮子.md` | marked 造轮子 | 2023-01-23 | `marked-blog-generator` | `it` | `static-site`, `markdown` | published |
| `src/content/posts/《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理].html` | 《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理] | 2023-01-22 | `wa2-playthrough-guide` | `acgn` | `game` | published |
| `src/content/posts/flowchart/程序流程图.md` | 程序流程图 | 2023-01-22 | `lct` | `it` | 无 | published |
| `src/content/posts/blog/静态博客框架之Hexo & Jekyll.md` | 静态博客框架之 Hexo 与 Jekyll | 2023-01-22 | `hexo-and-jekyll` | `it` | `static-site` | published |
| `src/content/posts/c自查表.md` | C 自查表 | 2023-01-22 | `c-reference` | `it` | `c`, `cpp` | published |
| `src/content/posts/linux/Linux命令行.md` | Linux 命令行 | 2023-01-22 | `linux-command` | `it` | `linux` | published |

## 子分类清单

子分类以 front matter 的 `subcategory` 为准，目录名必须与 id 一致；中文只作为展示名配置在 `src/_data/category-labels.json`。

| 父分类 | subcategory | 目录 | 展示名 | 文章数 |
|---|---|---|---:|---:|
| `it` | `blog` | `blog/` | 博客 | 2 |
| `it` | `database` | `database/` | 数据库 | 9 |
| `it` | `docker` | `docker/` | Docker | 3 |
| `it` | `flowchart` | `flowchart/` | 程序流程图 | 1 |
| `it` | `git` | `git/` | Git | 2 |
| `it` | `linux` | `linux/` | Linux | 6 |
| `it` | `llm` | `llm/` | LLM | 10 |
| `it` | `markdown` | `markdown/` | Markdown | 4 |
| `it` | `operations-research` | `operations-research/` | 运筹学 | 11 |
| `it` | `rag` | `rag/` | RAG | 4 |

## 受控标签

标签已从 86 个收敛为 18 个受控标签，标签页仍由 published 文章的 front matter 派生。

| 标签 | 文章数 |
|---|---:|
| `operations-research` | 12 |
| `llm` | 10 |
| `database` | 9 |
| `linux` | 6 |
| `agent` | 5 |
| `markdown` | 5 |
| `rag` | 4 |
| `workflow` | 4 |
| `security` | 3 |
| `c` | 2 |
| `cpp` | 2 |
| `git` | 2 |
| `python` | 2 |
| `static-site` | 2 |
| `essay` | 1 |
| `game` | 1 |
| `prompt` | 1 |
| `wechat` | 1 |

## 独立特殊页

这些页面不进入文章集合，不参与文章排序、RSS 和搜索索引；首页展示元数据集中在 `src/_data/custom-pages.json`。

| 源文件 | 标题 | 路由 | 分类 | 状态 | 备注 |
|---|---|---|---|---|---|
| `src/content/custom/divergence.html` | Divergence Meter | `/custom/divergence-meter/` | `acgn` | 已迁移 | 交互页，独立资源和脚本 |
| `src/content/custom/fireworks.html` | Happy New Year | `/custom/happy-new-year/` | `acgn` | 已迁移 | 节令烟花页 |

## 待确认项

1. 父分类：当前实际使用 `acgn`、`essay`、`it`，是否作为最终集合需项目所有者确认；子分类由 front matter `subcategory` 显式声明并与目录保持一致。
2. 受控标签：当前已收敛为 18 个标签页，是否作为最终集合需项目所有者确认。
3. `views/fireworks2.html`：迁移前未进入首页，文件已随 `views/` 删除，当前没有回退路由或退役结论。
4. 目录型子分类：当前 10 个子分类均已生成分类页；新增子分类必须同时创建英文目录并在文章 front matter 写同名 `subcategory`，根目录文章不写该字段。
