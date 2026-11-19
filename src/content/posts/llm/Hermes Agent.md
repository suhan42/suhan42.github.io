---
title: Hermes Agent
date: 2026-11-18
slug: hermes-agent
category: it
subcategory: llm
tags:
  - llm
  - agent
summary: 整理 Hermes Agent 的整体架构、上下文工程和机械式约束等特点。
status: published
---

# Hermes Agent

[Hermes Agent | 菜鸟教程](https://www.runoob.com/ai-agent/hermes-agent.html)

Hermes Agent 是 Nous Research 开源的自主 AI Agent 框架。

- GitHub 仓库：https://github.com/nousresearch/hermes-agent
- Hermes Agent 官网：https://hermes-agent.nousresearch.com/

**【与Harness工程的关系】就是通过Harness工程，具体实现的一个应用框架实现。**

官方定义：

>The agent that grows with you.
>一个会随着使用不断成长的 Agent。

Hermes Agent 的核心理念是：**让 AI 成为长期在线的数字员工，而非一次性聊天机器人。**

Hermes Agent 是业内少见的**原生内置学习闭环的 AI Agent**，可从执行经验中沉淀技能、自主优化能力、持久化知识、检索历史对话，并在跨会话中持续完善用户认知模型。

Hermes Agent 支持自由切换任意大模型，包括 **Nous Portal、OpenRouter（200+ 模型）、OpenAI、GLM、Kimi、MiniMax** 等，执行 `hermes model` 即可切换，无需改代码、无厂商锁定。

| 提供商           | 说明                                        | 设置方式                                   |
| :--------------- | :------------------------------------------ | :----------------------------------------- |
| **Nous Portal**  | 订阅制，零配置                              | 通过 `hermes model` 进行 OAuth 登录        |
| **OpenAI Codex** | ChatGPT OAuth，使用 Codex 模型              | 通过 `hermes model` 进行设备代码认证       |
| **Anthropic**    | 直接使用 Claude 模型                        | 通过 Claude Code 认证或 Anthropic API 密钥 |
| **OpenRouter**   | 多提供商路由                                | 输入您的 API 密钥                          |
| **DeepSeek**     | 直接 DeepSeek API 访问                      | 设置 `DEEPSEEK_API_KEY`                    |
| **Hugging Face** | 通过统一路由器访问 20+ 开放模型             | 设置 `HF_TOKEN`                            |
| **自定义端点**   | VLLM、SGLang、Ollama 或任何 OpenAI 兼容 API | 设置基础 URL 和 API 密钥                   |

## 整体架构

整体流程：

![img](https://www.runoob.com/wp-content/uploads/2026/04/runoob_1778902606748.png)

架构图：

![img](https://www.runoob.com/wp-content/uploads/2026/04/425bde75-892c-4560-8d76-89d15c7e7555.webp)

| 模块                            | 作用                   | 示例                   |
| :------------------------------ | :--------------------- | :--------------------- |
| 接入层（Clients）               | 接收用户请求           | Web、App、API、飞书    |
| 输入层（Input）                 | 处理各种输入数据       | 文本、图片、PDF、Excel |
| 调度器（Agent Orchestrator）    | 理解任务并拆分执行流程 | 分析需求 → 制定计划    |
| 能力层（Capabilities）          | 提供执行能力           | 对话、检索、代码执行   |
| 记忆层（Memory）                | 保存上下文和历史信息   | 会话记忆、长期记忆     |
| 知识层（Knowledge）             | 提供知识检索能力       | RAG、向量数据库        |
| 模型层（Model Layer）           | 提供推理能力           | GPT、Claude、本地模型  |
| 工具层（Tools）                 | 调用外部工具完成任务   | 搜索、数据库、API      |
| 外部服务层（External Services） | 对接业务系统           | ERP、CRM、云服务       |
| 基础设施层（Infrastructure）    | 支撑系统运行           | 权限、日志、监控       |



## 特点

### 上下文工程

Hermes Agent 的四层记忆系统本质上就是一套Context Engineering方案：

- MEMORY.md（短期记忆）：当前会话的偏好和上下文
- USER.md（用户画像）：跨会话的用户偏好积累
- SQLite FTS5（长期记忆）：全文检索历史对话和经验
- 外部Provider（扩展记忆）：对接8种以上外部知识源

### Mechanical Enforcement：机械式约束

### Feedback Loops &Verification：反馈闭环与验证

### 中间件





## 安装

### 快速安装

**Windows 系统说明**：不支持原生 Windows 环境，请先安装 WSL2，再在 WSL2 终端中执行命令。以下安装命令适用于 Linux、macOS 与 WSL2 系统：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

安装程序会自动处理所有依赖项：

- **uv** — 快速 Python 包管理器
- **Python 3.11** — 通过 uv 安装，无需 sudo
- **Node.js v22** — 用于浏览器自动化和 WhatsApp 桥接
- **ripgrep** — 快速文件搜索
- **ffmpeg** — TTS 音频格式转换

![img](https://www.runoob.com/wp-content/uploads/2026/04/9eecf986-5c45-4099-8221-4ef1b2b98d9c.png)

### 手动安装

如果您更喜欢完全控制安装过程，请按照以下步骤操作。

#### 步骤 1：克隆仓库

使用 `--recurse-submodules` 克隆以获取所需的子模块：

```
git clone --recurse-submodules https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
```

如果已经克隆但没有子模块：

```
git submodule update --init --recursive
```

#### 步骤 2：安装 uv 并创建虚拟环境

```
# 安装 uv（如果尚未安装）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 创建 Python 3.11 的虚拟环境（uv 会在需要时下载，无需 sudo）
uv venv venv --python 3.11
```

**提示：**您**不需要**激活虚拟环境来使用 `hermes`。入口点有一个硬编码的 shebang 指向虚拟环境中的 Python，因此全局链接后即可使用。

#### 步骤 3：安装 Python 依赖

```
# 告诉 uv 要安装到哪个虚拟环境
export VIRTUAL_ENV="$(pwd)/venv"

# 安装所有扩展
uv pip install -e ".[all]"
```

如果您只想要核心智能体（不包含 Telegram/Discord/cron 支持）：

```
uv pip install -e "."
```

**可选扩展说明：**

| 扩展        | 功能                       | 安装命令                           |
| :---------- | :------------------------- | :--------------------------------- |
| `all`       | 包含以下所有功能           | `uv pip install -e ".[all]"`       |
| `messaging` | Telegram 和 Discord 网关   | `uv pip install -e ".[messaging]"` |
| `cron`      | 定时任务的 Cron 表达式解析 | `uv pip install -e ".[cron]"`      |
| `voice`     | CLI 麦克风输入和音频播放   | `uv pip install -e ".[voice]"`     |
| `mcp`       | 模型上下文协议支持         | `uv pip install -e ".[mcp]"`       |
| `honcho`    | AI 原生记忆（Honcho 集成） | `uv pip install -e ".[honcho]"`    |

我们可以组合使用：`uv pip install -e ".[messaging,cron]"`

#### 步骤 4：创建配置目录

```
# 创建目录结构
mkdir -p ~/.hermes/{cron,sessions,logs,memories,skills,pairing,hooks,image_cache,audio_cache,whatsapp/session}

# 复制示例配置文件
cp cli-config.yaml.example ~/.hermes/config.yaml

# 创建空的 .env 文件用于存储 API 密钥
touch ~/.hermes/.env
```

#### 步骤 5：添加 API 密钥

打开 `~/.hermes/.env` 并添加至少一个 LLM 提供商密钥：

```
# 必需 — 至少一个 LLM 提供商：
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# 可选 — 启用其他工具：
FIRECRAWL_API_KEY=fc-your-key          # 网页搜索和抓取
FAL_KEY=your-fal-key                   # 图像生成（FLUX）
```

或者通过 CLI 设置：

```
hermes config set OPENROUTER_API_KEY sk-or-v1-your-key-here
```

#### 步骤 6：将 hermes 添加到 PATH

```
mkdir -p ~/.local/bin
ln -sf "$(pwd)/venv/bin/hermes" ~/.local/bin/hermes
```

如果 `~/.local/bin` 不在 PATH 中，请添加到 shell 配置：

```
# Bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc

# Zsh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

#### 步骤 7：配置您的提供商

```
hermes model       # 选择您的 LLM 提供商和模型
```

#### 步骤 8：验证安装

```
hermes version    # 检查命令是否可用
hermes doctor     # 运行诊断以验证一切正常
hermes status     # 检查您的配置
hermes chat -q "Hello! What tools do you have available?"
```

#### 故障排除

| 问题                        | 解决方案                                                     |
| :-------------------------- | :----------------------------------------------------------- |
| `hermes: command not found` | 重新加载 shell（`source ~/.bashrc`）或检查 PATH              |
| API 密钥未设置              | 运行 `hermes model` 配置提供商，或 `hermes config set OPENROUTER_API_KEY your_key` |
| 更新后配置丢失              | 运行 `hermes config check` 然后 `hermes config migrate`      |

如需更多诊断信息，运行 `hermes doctor` — 它会告诉您缺少什么以及如何修复。

> **提示：**您可以随时通过 `hermes model` 切换提供商——无需更改代码，没有锁定。



## 消息网关

Hermes Agent 消息网关允许您通过多个平台与智能体交互——Telegram、Discord、Slack、WhatsApp、Signal、Email、Home Assistant 等。

从一个网关向 15+ 个平台发送消息。无论您身在何处，都可以与 Hermes 保持联系。

## 安全考虑

**重要：**

- 不要将 API 密钥提交到源代码控制
- 使用环境变量或安全的凭据存储
- 限制允许与智能体交互的用户/频道
- 定期轮换 API 密钥
- 在公共平台上启用命令审批
