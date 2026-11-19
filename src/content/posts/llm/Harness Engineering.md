---
title: Harness Engineering（驾驭工程）
date: 2026-11-18
slug: harness-engineering
category: it
subcategory: llm
tags:
  - llm
  - agent
summary: 介绍 Harness Engineering 的概念、案例和约束代理行为的工程方法。
status: published
---

# Harness Engineering（驾驭工程）

> [一文读懂 Harness Engineering：起源、原理与落地实践-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2664396)

**Harness Engineering（驾驭工程）**是围绕 AI 智能体设计和构建**约束机制、反馈回路、工作流控制和持续改进循环**的系统工程实践。

当 AI Agent 真正进入生产环境、执行跨步骤的长周期自主任务时，一类新的失败模式浮现了：Agent会忽视团队规范、生成违反架构约束的代码、在并行执行时与自身冲突、随时间推移逐渐降低代码质量。于是 Harness Engineering 应运而生。

Harness一词来自马具——缰绳、马鞍、嚼子——这是一套引导强大但不可预测的动物的完整装备。**驾驭工程不是去削弱 AI 的能力，而是为它打造一套黄金缰绳，让它跑得又快又稳。**

> 这个概念由 HashiCorp 联合创始人 Mitchell Hashimoto 在 2026 年 2 月 5 日首次提出，六天后 OpenAI 在百万行代码实验报告中正式采用这一术语，随后 Martin Fowler 撰文深度分析，一个月内成为开发者社区的高频词。

- **案例**：

LangChain 的案例尤其有说服力：底层模型一个参数都没动，**仅仅通过优化外部驾驭环境**（文档结构、验证回路、追踪系统），编码 Agent 在 Terminal Bench 2.0 的得分从 52.8% 飙升至 66.5%，全球排名从第 30 位跃升至第 5 位。

五个独立团队也得出了相同结论：**瓶颈不在模型智能，而在基础设施。**

- **AI 工程范式的三次跃迁**：
  - Prompt Engineering 提示词工程
    - 优化对象：输入措辞
      - CoT、Few-shot 示例
    - 解决：单次对话质量
    - 2023 ~ 2024
  - Context Engineering 上下文工程
    - 优化对象：信息输入
      - RAG 检索、MCP 工具接入、记忆管理
    - 解决：知识边界与幻觉
    - 2025
  - Harness Engineering 驾驭工程
    - 优化对象：运行环境
    - 解决：Agent 可靠性与可持续性
    - 2026

- **Agent 常见失败模式**：

Anthropic 工程师在长时间运行 Agent 的过程中，总结了三种典型的翻车姿势，正是驾驭工程要解决的核心痛点：

**失败模式 1：试图一步到位（One-shotting）**

Agent 倾向于在一个会话里把所有功能都做完。结果是上下文窗口耗尽，留下一堆没有文档的半成品代码，下一个会话启动时只能花大量时间猜测之前发生了什么。

**失败模式 2：过早宣布胜利**

在项目后期，当部分功能已经完成后，Agent 会环顾四周，看到已有进展就直接宣布任务完成——即使还有大量功能未实现。

**失败模式 3：过早标记功能完成**

在没有明确提示的情况下，Agent 写完代码就标记为完成，却没有做端到端测试。单元测试或 curl 命令通过了不代表功能真正可用。

除此之外，更隐蔽的问题是**模式复制**。Agent 把代码库中存在的模式当作"合法实践"，忠实地复制并放大，这其中也包括坏的模式。。这意味着不加约束的 Agent 会以惊人的速度积累技术债务。

## 案例

### 1.修改提示词结构、工具描述方式、中间件逻辑

LangChain 在 Terminal Bench 2.0 中做了控制变量，底层模型固定为 gpt-5.2-codex，权重一个没动。只修改了系统提示词结构、工具描述方式、中间件逻辑，也就是只改了 Harness。这一改动使得分从 52.8% 升到 66.5%，全球排名从第 30 名跃升至第 5 名。

核心 Harness 优化措施：团队利用 LangSmith 的 Trace 功能大规模分析了智能体的失败模式，并针对性地进行了以下三项核心改进：

1. 系统提示词与中间件：强制“构建-验证”循环

**发现的问题**：智能体最常见的失败模式是写完代码后，仅凭“自我感觉良好”就停止，缺乏对代码的实际测试和验证。

**解决方案**：

- 在系统提示词中明确加入了 **“规划-构建-验证-修复”** 的结构化工作流指导。
- 引入了 `PreCompletionChecklistMiddleware` 中间件。这个中间件会在智能体试图结束任务前强制拦截，并提醒它必须对照任务原始需求进行验证，只有通过验证才能退出
- 工具与环境上下文：直接注入，而非探索

**发现的问题**：智能体在不熟悉的环境中浪费大量时间去探索目录结构、寻找可用工具，这个过程容易出错。

**解决方案**：

- **发现的问题**：智能体在不熟悉的环境中浪费大量时间去探索目录结构、寻找可用工具，这个过程容易出错。
- 解决方案：
  - 使用 `LocalContextMiddleware`，在智能体启动时自动运行，将当前工作目录、父/子目录、Python 环境等关键信息**直接注入**其上下文，相当于给智能体做了一次“环境入职培训”。
  - 在提示词中明确告知智能体，其编写的工作将通过**程序化测试**进行评分，引导它写出更规范、可测试的代码。
- 推理预算分配：“三明治”策略

**发现的问题**：在不限制推理预算的情况下，智能体可能在无意义的“末日循环”中过度消耗时间，甚至因超时而失败。

**解决方案**：

- 针对 `gpt-5.2-codex`，他们发现全程使用最高强度推理模式 (`xhigh`) 会导致超时增加，得分反而 **更低 (53.9%)**，低于使用 `high` 模式的得分 (63.6%)。
- 最终方案是采用了 **“推理三明治” (xhigh-high-xhigh)** 策略：在**规划**和**最终验证**阶段使用高强度的 `xhigh` 模式，在中间的**代码实现**阶段使用稍低的 `high` 模式，以此平衡深度与速度
- 模式检测中间件：打破“末日循环”

**发现的问题**：智能体有时会在一个错误的方向上反复尝试，进行细微的、无效的代码修改（在 Trace 中，这种情况有时会重复10次以上）。

**解决方案**：开发了LoopDetectionMiddleware。它通过 Hook 追踪智能体对每个文件的编辑次数，一旦超过阈值，就会自动注入提示，建议模型“**考虑重新审视你的方法**”，帮助它跳出思维定式。

### 2.Hashline 协议：给每行代码赋予基于内容的哈希标签

独立安全研究员 Can Boluk 发现，Agent 修改代码时大量失败不是因为逻辑错误，而是机械性失误。例如“第 47 行少了一个空格”、“匹配文本不完全一致”。

他设计了一套 Hashline 协议：给每行代码赋予基于内容的哈希标签，模型只需引用标签而非精确匹配原始文本。Hashline 通过修改read_file工具的**返回格式**，彻底改变了游戏规则：

1. 读取时加标签：当模型读取文件时，返回的每一行代码都会附带一个**2-3 个字符的内容哈希标签**（例如11:`a3|function hello() {`）。

2. 编辑时引用标签：模型需要修改某一行时，直接**引用这个短标签**，而不是写一遍整行代码。

3. 写入时校验：写入前，系统会检查该标签对应的**原文内容是否发生了变化**。如果有变化（哈希不匹配），直接拒绝编辑，防止覆盖别人的修改。

这个改动带来了一组非常夸张的数据：

- **最大黑马**：**Grok Code Fast 1**的成功率直接从**6.7% 飙升至 68.3%**，翻了十倍不止。
- **普遍提升**：在16个模型、3种编辑格式、每种540个任务的大规模测试中，Hashline 在**几乎所有模型**上都匹配或超越了str_replace。
- **成本直降**：Grok 4 Fast 的输出 token**下降了 61%**，因为模型不再需要反复重试和输出大段修正代码了。

正如他所说：“Gemini 成功率提升了 8%，比大多数模型升级带来的提升都大，而且**训练成本是零**。

### 3.沉默即成功（Silence is Success）

HumanLayer 团队遵循了传统的CI/CD实践：每次代码修改后，都会运行完整的测试套件，并将所有输出（包括成功的测试）返回给AI智能体。

**问题出现了**：在一个中等规模的项目中，一次完整的测试运行可能产生超过**4000行**的输出。这海量的“噪音”瞬间涌入AI大模型本就宝贵的上下文窗口（通常建议控制在75000 token左右的最佳“智能区”）。

这导致了两个严重的后果：

1. **“成功幻觉”**：AI智能体在阅读了大量测试文件的内容后，产生了认知混淆。它开始**误以为那些通过测试所验证的功能，已经是自己实现的业务逻辑了**。这导致它后续的代码修改完全偏离了实际需求——因为它“以为”代码已经写好了。
2. **资源浪费**：每一行“PASS src/utils/helper.test.ts”这样的成功输出，都在无情地消耗着宝贵的上下文token，挤占了真正用于推理和解决问题的空间，并快速将模型推向需要“压缩记忆”的“迟钝区”。

解决方案：为了解决这个问题，他们设计了一个极其简单但在逻辑上却非常颠覆的协议：“沉默即成功” (Silence is Success)。他们修改了执行测试的工具逻辑，不再将原始输出一股脑地扔给模型，而是实现了这样一个流程：

```javascript
# 伪代码示例：HumanLayer采用的“静默执行”逻辑
run_silent() {
    local description="$1"
    local command="$2"
    local tmp_file=$(mktemp)

    if eval "$command" > "$tmp_file" 2>&1; then
        # 成功时：只输出一个绿色对勾，然后删除原始日志
        printf "  ✓ %s\n" "$description"
        rm -f "$tmp_file"
        return 0
    else
        # 失败时：输出红叉，并将之前暂存的完整错误日志全部打印出来
        local exit_code=$?
        printf "  ✗ %s\n" "$description"
        cat "$tmp_file"
        rm -f "$tmp_file"
        return $exit_code
    fi
}
```

（注：此代码逻辑源于HumanLayer团队的公开技术分享）

这个协议的核心是**确定性控制**：成功，就只返回一个极简的✓符号（占用远少于10个token）；失败，才返回全部的错误细节，让模型精准地知道问题出在哪里。这样，模型不再需要自己去判断是否需要截断输出，也彻底杜绝了被无用信息干扰的可能。

实验结果：

这一改动带来了惊人的效果提升：

- **任务达成效率飙升**：智能体在**10步操作内**成功完成任务的比例，从原先的**43%**猛增到了**78%**。
- **成本与效率双赢**：平均每次任务节省了约**35%**的上下文token消耗，这不仅降低了API调用成本，也让模型的注意力始终保持在“智能区”，从而做出更准确的决策。



## Harness 的四大护栏

综合 OpenAI、Anthropic、LangChain 和 Martin Fowler 的实践，Harness 可以归纳为四个核心组件，即四根"护栏"：

```Mermaid 
flowchart
    A[<b>上下文工程</b><br/>Context Engineering<br/>动态知识注入：AGENTS.md<br/>按需检索：活文档机制]
    B[<b>架构约束</b><br/>Architecture Constraints<br/>分层依赖模型：自动 Linter<br/>CI 强制阻断：类型系统]
    C([AI Agent<br/>智能体])
    D[<b>反馈循环</b><br/>Feedback Loop<br/>智能体审智能体：自动测试<br/>CI 验证：错误信号回传]
    E[<b>熵管理</b><br/>Entropy Management<br/>定期垃圾回收：文档园丁<br/>持续小额偿还技术债]
    
    A -.-> C
    B -.-> C
    D -.-> C
    E -.-> C
    
    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style B fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style C fill:#1a237e,stroke:#0d1b2a,stroke-width:2px,color:#fff
    style D fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style E fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```



### 1.上下文工程（Context Engineering）

就像给新员工一本详细的工作手册，`AGENTS.md` 是 AI 智能体进入代码仓库时看到的第一份指南。但这不是一本静态的说明书——上下文是稀缺资源，过多的指导反而会挤掉任务、代码和相关文档的空间，变成陈旧规则的坟场。

更好的做法是：提供一个稳定、小巧的入口点，然后教 Agent 根据当前任务按需检索和拉取更多的上下文。

具体操作：

1. 标注清楚 `docs/`下每份文档是什么、什么时候该读
2. 每份文档头部带元信息：最后更新时间、状态、覆盖范围
3. Agent 根据当前任务按需检索，而非一股脑全加载

> Mitchell Hashimoto 的 Ghostty 项目 `AGENTS.md` 里每一行都对应一个历史 Agent 失败案例。

### 2.架构约束（Architecture Constraints）

OpenAI 团队建立了严格的层级依赖模型：

**Types → Config → Repo → Service → Runtime → UI**

下层不能反向依赖上层。所有架构规则被编码为**自定义 Linter 规则**，在 CI 中强制阻断。人写的还是 AI 写的，违规就合不进去。

一个关键细节：Linter 的错误信息不只是"你违反了规则 X"，还会解释规则为什么存在、正确做法是什么。Agent 读到错误能自动理解并修正，不需要人类介入。

规则写在文档里 → Agent 仍然可以违反。

规则编码为系统级阻断 → 从根本上阻止违规。

### 3.反馈循环（Feedback Loop）

> 人类喜欢详细的反馈报告，但Agent 不是。4000 行测试输出里，真正有价值的信息可能只有失败那几行，但 Agent 会把全部内容读一遍，注意力被通过的测试、覆盖率数据、性能指标稀释。

传统开发中，人类工程师负责代码审查（Code Review）。在驾驭工程中，这个工作变成了智能体对智能体的方式：Codex 在本地审核自身更改，请求额外审查，循环往复直到通过。

反馈循环中的钩子可以运行预定义的测试套件，并在失败时带着错误信息循环回到模型，或者提示模型独立评估其代码。并且如果 AI 写的测试用例通过了带有 Bug 的代码，Harness 就会判定测试无效，强迫它重新思考测试边界。

正确的设计是**"沉默即成功"**：

- 每步完成后自动触发检查脚本。通过 → 零输出。失败 → 结构化错误信息。
- Agent 标记任务完成前，系统强制拦截，要求它对照需求逐项确认边界条件、错误处理、测试更新。
- 同一文件被修改超过 3 次且测试仍失败，触发干预：“检测到重复编辑，建议回滚后重新审视需求。”

对人类来说，详细的信息可以帮助理解；但对 Agent，噪声淹没信号。

### 4.熵管理（Entropy Management）

这个论断基于AI编程时代两个已经发生的事实：

1. **AI 复制的速度远超人类**：AI编程智能体能够**瞬间**分析整个代码库，并识别出其中“最普遍”的模式。一旦你允许一个临时的、不完美的妥协方案（比如为了赶进度绕过架构约束）合入主分支，智能体就会将这个“坏模式”视为**可参考的先例**，在几分钟内生成的新代码中，大规模复制并在代码库的每个角落复用这种模式。**人类引入坏模式的速度是线性的，而AI扩散它的速度是指数级的。**
2. **“集中清理”模式已失效**：OpenAI 的内部工程团队在早期实践后发现，传统的“每周五集中清理技术债”模式已不可行。因为在AI辅助开发的背景下，技术债务的堆积速度远超人类团队的清理速度。当一周的工作被智能体加速完成后，堆积的技术债可能在几天甚至几小时内就达到了积重难返的地步。

随着时间推移，软件系统会逐渐混乱（**熵增**）。为了解决上述困境，OpenAI 的工程师 Ryan Lopopolo 提出了一个新的实践：**“垃圾收集日”（Garbage Collection Day）**。

它的核心机制与传统模式截然不同：

1. **频率与节奏**：不是每周一次，而是**每天一次**。在每个工作日的下午（例如4点到5点），团队会固定进入“清理模式”。
2. **工作内容**：在这一个小时里，工程师**不再开发新功能**，而是专门用来审视当天AI Agent生成的所有代码、合并请求（PR）、以及CI/CD流水线的反馈。
3. **核心任务**：快速识别出当天新引入的“坏模式”或临时代码妥协，并立即将它们“编译”成可供AI自动执行的规则。

这本质上就是**把偿还技术债的动作，从一个耗时巨大的“大项目”，拆解为融入到每天工作流末尾的、自动化、可积累的“小习惯”**。

具体措施：定期运行后台 Codex 任务扫描偏差、更新质量等级、发起针对性重构 PR。此外还有一个专门的 **Doc-gardening Agent**（文档园丁代理），在后台自动扫描文档与代码之间的不一致，发现过时内容就自动提交 PR 修复——Agent 为 Agent 维护文档。

## Harness Engineering 三阶段路线图

```Mermaid
flowchart TB
    subgraph 用户开发者空间
        direction LR
        User[用户自然语言需求]
    end

    subgraph Harness核心["Harness Engineering 核心<br/>层 · 可干预 · 可优化"]
        direction TB

        subgraph Phase1["Phase 1: 信息层 (信息索引)"]
            direction TB
            P1A[AGENTS.md 索引地图]
            P1B[结构化文档库<br/>docs/ 目录]
            P1C[上下文注入中间件<br/>如: LocalContextMiddleware]
            P1A --> P1B --> P1C
        end

        subgraph Phase3["Phase 3: 自动化层 (多Agent<br/>协作)"]
            direction TB
            P3A[父Agent<br/>任务拆解与决策]
            P3B1[子Agent 1<br/>隔离上下文执行]
            P3B2[子Agent 2<br/>隔离上下文执行]
            P3D[清理Agent<br/>债务扫描与预防]
            P3A --> P3B1
            P3A --> P3B2
        end

        subgraph Phase2["Phase 2: 约束层 (规则自动<br/>化)"]
            direction TB
            P2A[自动化检查规则<br/>Linter / Hooks]
            P2B[CI/CD 集成门禁]
            P2C[LoopDetectionMiddleware<br/>PreCompletionChecklistMiddleware]
            P2A --> P2B --> P2C
        end
    end

    subgraph 底层模型层["底层模型层 · 固定不变"]
        direction TB
        Model[基础模型<br/>如: gpt-5.2-codex / Grok]
    end

    subgraph 执行环境与工具["执行环境与工具"]
        direction TB
        Env[沙盒环境<br/>Terminal / Harbor]
        Tools[外部Tools<br/>read_file / 测试套件]
        Env --> Tools
    end

    User --> P1A
    P2C -.->|失败时返回精准错误| User

    P1C --> Model
    P2B --> Model
    P3A --> Model

    Model --> Env
    Tools -.->|"沉默即成功"协议<br/>通过时仅输出✓| P2B

    style 用户开发者空间 fill:#fffde7,stroke:#fbc02d,stroke-width:1px
    style User fill:#fff,stroke:#999,stroke-width:1px
    style Harness核心 fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    style Phase1 fill:#e8f5e9,stroke:#388e3c,stroke-width:1px
    style Phase3 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:1px
    style Phase2 fill:#fff3e0,stroke:#f57c00,stroke-width:1px
    style 底层模型层 fill:#fffde7,stroke:#fbc02d,stroke-width:1px
    style Model fill:#fff,stroke:#999,stroke-width:1px
    style 执行环境与工具 fill:#fffde7,stroke:#fbc02d,stroke-width:1px
    style Env fill:#fff,stroke:#999,stroke-width:1px
    style Tools fill:#fff,stroke:#999,stroke-width:1px
```

这个三阶段路线图，是目前将**Harness Engineering**从理念落地为实践的最清晰、最可操作的指南之一。它精准地捕捉到了从“信息混乱”到“自动化治理”的渐进式演进路径，每一步都为下一步打下基础。

业界在以下六个方面已形成明确共识：

| #    | 共识                             | 核心观点                                                     |
| :--- | :------------------------------- | :----------------------------------------------------------- |
| 1    | **瓶颈在基础设施，不在模型智能** | 五个独立团队得出相同结论。仅改变 Harness 工具格式，就能让模型得分从 6.7% 跳到 68.3% |
| 2    | **文档必须是活的反馈循环**       | 静态文档是坟场，动态文档才有价值。让后台 Agent 定期清理过时文档并提交 PR |
| 3    | **思考与执行分离**               | 复杂任务不可能在单个上下文窗口内完成，需要 Orchestrator + Worker 分层架构，状态持久化到外部存储 |
| 4    | **上下文不是越多越好**           | 上下文是稀缺资源。巨大的指令文件会挤掉任务空间，应按需检索、动态注入 |
| 5    | **约束必须自动化**               | 人工 Review 是瓶颈。护栏要编码为 Linter、CI、类型系统，让机器来执行而非人 |
| 6    | **工程师角色在转变**             | 从代码的编写者变成环境的建筑师。最大的工程挑战是设计让 Agent 可靠工作的控制系统 |

## Harness 与传统框架的关系

Harness 不是 SDK、脚手架或 Agent 框架的替代品，而是**位于它们之上的一层**：

```Mermaid
flowchart TB
	A[Harness Layer（驾驭层）<br/>约束 · 反馈循环 · 上下文工程 · 熵管理 · 生命周期管理]
	B[框架层 <br/>Agent Frameworks（LangGraph / AutoGen / CrewAI）<br/>智能体定义 · 消息路由 · 任务生命周期 · 依赖管理]
	C[SDK层 <br/>SDK / API（OpenAI / Anthropic / Gemini）<br/>模型调用 · 工具注册 · 流式输出]
	D[模型层 <br/>Foundation Model（GPT / Claude / Gemini / DeepSeek）]

    A --> B
    B --> C
    C --> D
    
    style A fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style B fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style C fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style D fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
```

传统框架解决的是**如何构建 AI 智能体**，而驾驭层解决的是完全不同的问题：**智能体如何可靠地运行**。

模型正在逐渐吸收框架约 80% 的功能（智能体定义、消息路由、任务生命周期……），但剩余 20%——**持久化、确定性重放、成本控制、可观测性、错误恢复**——正是驾驭层存在的价值。
