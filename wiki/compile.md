# 编译

## 克隆源代码

```bash
git clone --recurse-submodules https://github.com/smtc2web/smtc2web.git 
```

## 现有代码用户

```bash
git pull
git submodule update --init --recursive
```


## Windows

### 前期准备

- Visual Studio Community / 生成工具 2017+ | 使用 C++ 的桌面开发
- Windows SDK
- Rustup


### 构建源代码

```bash
cd smtc2web
pnpm tauri:build
```

构建好后，会保存在 `src-tauri\target\release\bundle\nsis` 路径，双击安装即可使用。

## Linux

### 前期准备

- Rustup
- Volta

### 安装环境

#### 安装 Rustup

如果包管理器有 Rustup，直接安装即可。

```bash
# Debian/Ubuntu
sudo apt install rustup

# Fedora/CentOS
sudo dnf install rustup

# Arch Linux
sudo pacman -S rustup

```

如果包管理器没有 Rustup，需要手动安装。

```bash
curl -fsSL https://sh.rustup.rs | sh
```

#### 安装 Volta

输入以下命令安装 Volta。

```bash
curl -fsSL https://get.volta.sh | sh
```

输入以下命令安装 Node.js 和 pnpm。

```bash
volta install node@lts
volta install pnpm
```

#### 安装 Tauri 依赖

输入以下命令安装 Tauri 依赖。

```bash
cd smtc2web
pnpm install
```

#### 安装系统依赖

请参考 Tauri 官方文档安装环境。 

https://tauri.app/zh-cn/start/prerequisites/#linux


```bash
pnpm tauri:build
```

构建好后，安装包将保存在以下路径，双击安装即可使用。

```
src-tauri/target/release/bundle/deb
```

```
src-tauri/target/release/bundle/rpm
```
