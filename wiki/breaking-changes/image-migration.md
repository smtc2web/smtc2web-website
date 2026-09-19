# 破坏性变更：图片 API 变更

>[!Caution]
> 此变更已被取消，原因：完全没有必要变更！

## 发生了什么

smtc2web 新增了独立的专辑图片路由 `GET /api/image.jpg`，主题无需再从 `/api/now` JSON 中解码 Base64 再构造 `<img>` 标签。

## 你的主题需要做什么

### 之前：手动解析 Base64

```html
<img v-if="info.album_art" :src="info.album_art" alt="Album Art" />
```

```js
fetch("/api/now")
  .then((r) => r.json())
  .then((data) => {
    if (data.album_art) {
      document.getElementById("cover").src = data.album_art;
    }
  });
```

### 之后：直接用图片路由

```html
<img id="cover" src="/api/image.jpg" />
```

无需 JS。图片自动跟随当前播放歌曲更新。

### 如需即时刷新（同一首歌切换封面时）

```html
<img id="cover" src="/api/image.jpg" />
```

```js
let lastTitle = "";
setInterval(async () => {
  const data = await (await fetch("/api/now")).json();
  if (data.title !== lastTitle) {
    lastTitle = data.title;
    document.getElementById("cover").src =
      "/api/image.jpg?t=" + Date.now();
  }
}, 1000);
```

`?t=` query 参数仅用于绕过浏览器缓存，服务端会忽略它，始终返回当前歌曲封面。

## 行为说明

| 情况 | 返回内容 |
|------|----------|
| 正在播放且有专辑封面 | 原始图片二进制（JPEG/PNG），`Content-Type` 与源文件一致 |
| 正在播放但无专辑封面 | 默认音乐图标 SVG（48×48 紫色音符） |
| 未播放任何音乐 | 默认音乐图标 SVG |

## 零改动向后兼容

`/api/now` 的 `album_art` 字段 **保持不变**。旧主题可以继续使用原有 Base64 方式，无需任何修改。1.0 版本后将不再支持原有的 Base 64 方式。

## 好处

| 方面 | 之前 | 之后 |
|------|------|------|
| HTML 大小 | `src` 为空，JS 动态填充 | 直接 `<img src="/api/image.jpg">` |
| 代码量 | 需 fetch + 解析 JSON + 设 src | 纯 HTML 标签 |
| 图片格式 | 始终 Base64（体积 +33%） | 原始二进制 |
| 默认图标 | 需主题自行处理 | 服务端自动返回 |
| 调试体验 | `src` 中嵌入超长 Base64 字符串 | 干净的 `/api/image.jpg` URL |

## 默认主题变更参考

- [更改专辑封面图代码](https://github.com/smtc2web/smtc2web-theme-spotify/commit/2f10174a2889965c928da1be87da42df6ebff4b1)

变更文件：
- `main.js`：删除 `album_art` 的 Base64 到 `src` 赋值逻辑
- `index.html`：`<img id="cover" src="/api/image.jpg">`

## 主题开发服务器兼容性

`smtc2web dev` 模式下同样开放 `/api/image.jpg` 路由，与正式环境行为一致。
