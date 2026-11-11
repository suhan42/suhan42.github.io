---
title: Docker 使用
date: 2026-11-11
slug: docker-usage
category: it
status: published
---

# Docker 使用

常用的 Docker 客户端命令：

| **命令**                | **功能**                             | **示例**                                     |
| :-------------------- | :--------------------------------- | :----------------------------------------- |
| `docker run`          | 启动一个新的容器并运行命令                      | `docker run -d ubuntu`                     |
| `docker ps`           | 列出当前正在运行的容器                        | `docker ps`                                |
| `docker ps -a`        | 列出所有容器（包括已停止的容器）                   | `docker ps -a`                             |
| `docker build`        | 使用 Dockerfile 构建镜像                 | `docker build -t my-image .`               |
| `docker images`       | 列出本地存储的所有镜像                        | `docker images`                            |
| `docker pull`         | 从 Docker 仓库拉取镜像                    | `docker pull ubuntu`                       |
| `docker push`         | 将镜像推送到 Docker 仓库                   | `docker push my-image`                     |
| `docker exec`         | 在运行的容器中执行命令                        | `docker exec -it container_name bash`      |
| `docker stop`         | 停止一个或多个容器                          | `docker stop container_name`               |
| `docker start`        | 启动已停止的容器                           | `docker start container_name`              |
| `docker restart`      | 重启一个容器                             | `docker restart container_name`            |
| `docker rm`           | 删除一个或多个容器                          | `docker rm container_name`                 |
| `docker rmi`          | 删除一个或多个镜像                          | `docker rmi my-image`                      |
| `docker logs`         | 查看容器的日志                            | `docker logs container_name`               |
| `docker inspect`      | 获取容器或镜像的详细信息                       | `docker inspect container_name`            |
| `docker exec -it`     | 进入容器的交互式终端                         | `docker exec -it container_name /bin/bash` |
| `docker network ls`   | 列出所有 Docker 网络                     | `docker network ls`                        |
| `docker volume ls`    | 列出所有 Docker 卷                      | `docker volume ls`                         |
| `docker-compose up`   | 启动多容器应用（从 `docker-compose.yml` 文件） | `docker-compose up`                        |
| `docker-compose down` | 停止并删除由 `docker-compose` 启动的容器、网络等  | `docker-compose down`                      |
| `docker info`         | 显示 Docker 系统的详细信息                  | `docker info`                              |
| `docker version`      | 显示 Docker 客户端和守护进程的版本信息            | `docker version`                           |
| `docker stats`        | 显示容器的实时资源使用情况                      | `docker stats`                             |
| `docker login`        | 登录 Docker 仓库                       | `docker login`                             |
| `docker logout`       | 登出 Docker 仓库                       | `docker logout`                            |

**常用选项说明:**

- **`-d`**：后台运行容器，例如 `docker run -d ubuntu`。
- **`-it`**：以交互式终端运行容器，例如 `docker exec -it container_name bash`。
- **`-t`**：为镜像指定标签，例如 `docker build -t my-image .`。

---

## 维护

用 `--format` 指定要显示的列。比如默认输出包含 PORTS，你想去掉它：

{% raw %}
```bash
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Command}}\t{{.CreatedAt}}\t{{.Status}}\t{{.Names}}"

docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Names}}"
```
{% endraw %}

常用字段：

- `.ID` / `.Names` / `.Image` / `.Command` / `.Status` / `.CreatedAt` / `.RunningFor` / `.Size` / `.Labels` / `.Mounts` / `.Networks` / `.Ports`

## 运行一个 web 应用

```shell
docker pull training/webapp  # 载入镜像
docker run -d -P training/webapp python app.py
```

- **-d:**让容器在后台运行。
- **-P:**将容器内部使用的网络端口随机映射到我们使用的主机上。



## 重启指令

### 重启

```bash
docker compose restart api
```

只重启已经存在的 api 容器
不重新读取 docker-compose.yml 里的新增 volumes
不重新创建容器
适合只改了容器内已经生效的环境、服务卡住、临时重启

### 重建容器

```bash
# 改了代码/Dockerfile，要重新构建镜像并启动
docker compose up -d --build api worker

# 既重新构建镜像，又强制重建容器（最彻底的重启）
docker compose up -d --build --force-recreate api worker


# 全部重建
docker compose up -d --build
```

`--build`：重新执行 Dockerfile 构建，生成新的镜像，然后再用新镜像创建容器

按当前 docker-compose.yml 重新创建 api 和 worker 容器
会应用新增 volumes
会应用 compose 里的 environment 变化
不会动没有点名的其他服务
重建容器让 .env 重新注入
