---
title: docker-compose.yml 和 docker-compose.override.yml
date: 2026-11-11
slug: docker-compose-config
category: it
status: published
---

# docker-compose.yml 和 docker-compose.override.yml

官方文档：https://docs.docker.com/compose/reference/overview/

## `docker-compose -f xxx.yml` 命令

docker-compose的命令构成：

```
docker-compose [-f …] [--profile …] [options] [COMMAND] [ARGS…]
```

其中`-f`部分可以指定使用哪一个`yml`文件，来执行后续的`COMMAND`（比如build,up,down等）。



1. 如果有多个`yml`，可以同时指定多个：

```bash
docker-compose -f docker-compose1.yml -f docker-compose2.yml xxxx（省略）
```

`docker-compose`会合并两个文件中的设定，如果存在设定重复，`docker-compose2.yml`会覆盖掉前面的设定。

2. 如果没有用`-f`指定文件的话，那么会用当前文件夹下面的两个文件`docker-compose.yml`和`docker-compose.override.yml`等价于：

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml xxxx（省略）
```

3. 具体使用

一般可以考虑把共同的设定比如build，images之类的放在`docker-compose.override.yml`中，运行时候的 ports 之类的设定放在`docker-compose.yml`中。

即共同的在`compose.override.yml`，各个单独的放在`docker-compose.yml`。
