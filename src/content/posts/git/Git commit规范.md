---
title: Git Commit 规范
date: 2026-11-18
slug: git-commit-convention
category: it
subcategory: git
tags:
  - git
  - workflow
summary: 整理 Git Commit 规范、核心分支和分支命名约定。
status: published
---

## Git Commit 规范

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]


#译文：

<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

- `fix`：表示**修 bug**，这和语义化版本中的 [`PATCH`](https://semver.org/lang/zh-CN/#摘要) 相对应。
- `feat`：表示**新增了一个功能**，这和语义化版本中的 [`MINOR`](https://semver.org/lang/zh-CN/#摘要) 相对应。
- `docs`：用于**修改文档**，例如修改 README 文件、API 文档等。
- `style`：改了**代码格式**但逻辑没变，例如调整缩进、空格、空行等。
- `refactor`：是**代码重构**，例如修改代码结构、变量名、函数名等但不修改功能逻辑。
- `chore`：用于对**非业务性代码**进行修改，例如修改构建流程、工具配置、构建工具、升级依赖这种“杂务”。
- `build`: 用于**修改项目构建系统**，例如修改依赖库、外部接口或者升级 Node 版本等。
- `ci`: 用于**修改持续集成流程**，例如修改 Travis、Jenkins 等工作流配置。
- `perf`: 用于**优化性能**，例如提升代码的性能、减少内存占用等。
- `test:` 用于**修改测试用例**，例如添加、删除、修改代码的测试用例等。

例如：

```
feat(order): 添加订单模块的退款功能
```

`feat` 表示你加了个功能，`order` 是模块，后面是这个提交大概干了啥。

---

## 核心分支

**develop → test → release → master**

1. `master`：代表线上环境，对应 PRO 环境。谁也不许直接在上面动手，所有改动都得从别的分支合并上来。
2. `develop`：开发的大本营，对应的是 DEV 环境。所有新功能和日常 bugfix 都在这儿处理，开发自测用。
3. `feature/xxx`：是“支线剧情”，只要你要做一个新功能，必须从 develop 拉出一个新分支来开发。
4. `test`：是“测试战场”，对应的是 FAT 环境。开发完成后得合并进 test 给 QA 验收。
5. `release`：是“上线候场厅”，对应 UAT 环境，客户提意见的地方。UAT 环境用的代码基本都来自于这个分支。
6. `hotfix/xxx`：是“救火队”，线上崩了临时修 bug 用的，修完要合并回 master 和 develop，防止 patch 丢失。

流程：

- develop 代码写完，合并到 test，让 QA 测。
- QA 测完 OK，合并到 release，客户测。
- 客户点头说好，合到 master，上线。
- 如果线上出了问题，就从 master 拉 hotfix，修完再合回 master 和 develop。



## 分支命名：

为了区分不同的开发任务，我们通常会为相关的改动创建新的分支。 以下是一些常见的分支命名约定：

1. 功能分支：以`feature/`为前缀，后接描述性名称。

   示例：`feature/add-login`

2. 修复bug分支：以`fix/`为前缀，后接JIRA ticket或者描述性名称。

   示例：`fix/login-error`

3. 优化分支：以`refactor/`为前缀，后接描述性名称。

   示例：`refactor/speed-up-homepage`

4. 重构分支：以`rework/`为前缀，后接描述性名称。

   示例：`rework/header-styles`

5. 测试分支：以`test/`为前缀，后接描述性名称。

   示例：`test/e2e-login-flow`

6. 发布分支：以`release/`为前缀，后接版本号。

   示例：`release/1.0.0`

7. 热修复分支：以`hotfix/`为前缀，后接描述性名称。

   示例：`hotfix/crash-on-start`

8. 文档分支：以`docs/`为前缀，后接描述性名称。

   示例：`docs/update-readme`

9. 配置分支：以`config/`为前缀，后接描述性名称。

   示例：`config/add-sonar-quality-gate`

10. 主题分支：以`theme/`为前缀，后接描述性名称。

    示例：`theme/dark-mode`

在实际开发中，选择合适的分支名可以提高团队协作效率，使得项目的维护和更新变得更加清晰和有序。

命名格式: `类别 + / + 日期/迭代版本号/功能名称`

例： `feat/2.1.1`、`fix/20201214`

一些比较复杂的系统，需要子系统迭代的，就会用到功能名称，例：

`feat/user_manage_1.1.1`、`fix/user_manage_20201214`

