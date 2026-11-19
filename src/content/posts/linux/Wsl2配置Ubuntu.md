---
title: WSL2 配置 Ubuntu
date: 2026-11-18
slug: wsl2-ubuntu-setup
category: it
subcategory: linux
tags:
  - linux
summary: 记录在 Windows 上清理旧环境、启用 WSL2 并把 Ubuntu 安装到 D 盘的完整流程。
status: published
---

# WSL2配置Ubuntu 24.04 LTS

> [WSL2 + Ubuntu 22.04 全流程安装与避坑指南（适配 D 盘）_wsl --install -d ubuntu-CSDN博客](https://blog.csdn.net/qq_46111980/article/details/153474067)

---

## 📋 一、前置条件检查

- Windows 已升级到 21H2 或更高版本；

- 已安装 NVIDIA 显卡驱动 ≥ 510（支持 CUDA 12）；
- Windows 已安装 PowerShell 7+；
- 本机具备管理员权限；
- 可联网。

## 🧹 二、彻底清理旧版 WSL 环境

很多用户安装不干净是因为旧版本遗留。执行以下命令可完全重置。

1️⃣ 查看已安装发行版

```
wsl --list --all
wsl -l
```

如果看到：

```
Ubuntu
Ubuntu-20.04
docker-desktop
```

说明旧版本仍存在。

如果没有直接跳转到3.2

2️⃣ **注销所有旧发行版**

```
wsl --unregister Ubuntu
wsl --unregister Ubuntu-20.04
wsl --unregister docker-desktop
wsl --unregister docker-desktop-data
```

3️⃣ **卸载系统组件（可选彻底清理）**

```
wsl --shutdown
dism.exe /online /disable-feature /featurename:Microsoft-Windows-Subsystem-Linux /norestart
dism.exe /online /disable-feature /featurename:VirtualMachinePlatform /norestart
```

在“应用和功能”中卸载：

- Windows Subsystem for Linux Update
- Ubuntu
- Docker Desktop

## ⚙️ 三、重新启用并安装 WSL2

1️⃣ **启用系统组件**

```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

重启电脑：

```
shutdown /r /t 0
```

2️⃣ **安装 WSL 内核**

```
wsl --install --no-distribution
```

3️⃣ **设置默认版本**

```
wsl --set-default-version 2
```

## 四、在 D 盘安装 Ubuntu 22.04

默认情况下，WSL 会安装在 C 盘。我们将其导出迁移到 D 盘，释放空间。

1️⃣ **安装 Ubuntu 22.04**

```bash
wsl --install -d Ubuntu-22.04

# 我安装24.04
wsl --install --distribution Ubuntu-24.04 --location D:\WSL\Ubuntu
```

首次启动后根据提示创建用户（如 jiahao）。如果提示：“wsl: 检测到 localhost 配置，但未镜像 到 WSL。NAT 模式下的 WSL 不支持 localhost。”这是正常的不用管他。

2️⃣ **导出系统镜像**

```
wsl --shutdown wsl --export Ubuntu-22.04 D:\WSL\ubuntu.tar
```

3️⃣ **注销旧系统**

```
wsl --unregister Ubuntu-22.04
```

4️⃣ **导入到 D 盘**

```
wsl --import Ubuntu-22.04 D:\WSL\Ubuntu D:\WSL\ubuntu.tar --version 2
```

5️⃣ 删除

```
del D:\WSL\ubuntu.tar
```

验证迁移：

```
wsl --list --verbose
```

应显示：

```
Ubuntu-22.04 Stopped 2
```

##  五、首次进入系统与基础配置

启动：

```
wsl -d Ubuntu-22.04
```

更新系统：

```
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential git curl wget vim python3.11 python3.11-venv
```

## 六、解决无法联网

⚠️ 默认 WSL 网络为 NAT 模式，不能自动继承 Windows  daili。 你会遇到 curl 卡住、apt update timeout 的问题。

1️⃣ 在 Windows 的🐱(🪜)中启用 LAN

进入🐱设置 → 开启局域网

确认配置中有：

```
allow-lan: true bind-address: 0.0.0.0 mixed-port: 7897
```

重点是第二行：**bind-address: 0.0.0.0**，这一步很关键，🐱的配置文件是config.yaml，同时需要注意端口没错。

然后重启🐱。

2️⃣ **在 PowerShell 验证端口监听**

我们需要得到两条信息：WSL的内网ip和🐱的转发端口（第一步已经得到了）

```
netstat -ano | findstr 7897
```

✅ 期望输出：

```
TCP    0.0.0.0:7897   0.0.0.0:0   LISTENING
……
```

3️⃣ **在 WSL 中获取主机 IP**

```
cat /etc/resolv.conf | grep nameserver
```

输出示例：

```
nameserver 172.19.48.1
```

测试是否连通，在WSL里面执行：

```
nc -zv 172.19.48.1 7897
```

如果输出：

```
Connection to 172.19.48.1 7897 port [tcp/*] succeeded!
```

说明端口没被挡住。如果失败，则管理员权限单开一个Powershell，然后输入（注意替换端口）：

```
netsh advfirewall firewall add rule name="Allow Clash from WSL" dir=in action=allow protocol=TCP localport=7897
```

这条命令会让 Windows 接受来自 WSL 的请求访问端口 7897。

之后再回到 WSL 执行：

```
nc -zv 172.19.48.1 7897
```

应当返回 succeeded ✅。

4️⃣ **手动设置**

```
export http_proxy="http://172.19.48.1:7897"
export https_proxy="http://172.19.48.1:7897"
```

验证：

```
curl -I https://www.google.com
```

返回 HTTP/2 200 即表示成功。

然后执行：

```
echo 'Acquire { HTTP::proxy "http://172.19.48.1:7897"; HTTPS::proxy "http://172.19.48.1:7897"; };' | \
sudo tee /etc/apt/apt.conf.d/proxy.conf
```

能更新包列表就说明 apt 已走DL。

5️⃣ **永久生效（添加到 .bashrc）**

编辑：

```
nano ~/.bashrc
```

添加（注意端口需要替换成自己的🐱实际端口）：

```
win_ip=$(grep nameserver /etc/resolv.conf | awk '{print $2}')
export http_proxy="http://$win_ip:7897"
export https_proxy="http://$win_ip:7897"
export HTTP_PROXY=$http_proxy
export HTTPS_PROXY=$https_proxy
echo "[WSL] Proxy set to $http_proxy"
```

保存并执行：

```
source ~/.bashrc
```

## 👤 七、恢复默认登录用户（迁移后变 root 的修复）

迁移导入后 WSL 默认用 root 登录。

1️⃣ **查看用户**

```
ls /home
```

会看到账户：suhan（你自己的）

2️⃣ **切换回用户**

```
su - suhan
```

3️⃣ **设置默认启动用户**

在 PowerShell 中：

```
Ubuntu-22.04.exe config --default-user suhan
```

下次启动 WSL 就会自动进入你的账户。

------

## 🧰 八、测试 GPU / CUDA（可选）

确保驱动版本 ≥ 510：

```
nvidia-smi
```

输出显示显卡信息即代表 GPU 直通成功。

---



## 最终结构验证

查看系统

```
cat /etc/os-release
```

确认代理

```
echo $http_proxy
```

确认 GPU

```
nvidia-smi
```

确认挂载路径（应在 D 盘）

```
df -h | grep /
```

输出路径指向：

```
/mnt/d/WSL/Ubuntu/
```

