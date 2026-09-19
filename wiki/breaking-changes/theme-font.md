# 破坏性变更：主题不再内置字体

## 发生了什么

smtc2web v0.5.0 （未发布）将字体控制权从主题代码移到了用户设置中。主题不再需要捆绑字体文件——用户可以在设置界面选择任意已安装的系统字体。

## 你的主题需要做什么

### 1. 删除字体文件

你捆绑的任何字体文件（`.ttf` / `.otf` / `.woff2`）及其 `@font-face` 声明都应删除。

**之前：** 主题包含一个 23MB 的 `lib/ttf/SarasaUiSC-Regular.ttf`

**之后：** 零字体文件。主题包通常只有几十 KB。

### 2. 更新 CSS：使用 CSS 自定义属性

将 `font-family` 替换为 CSS 变量：

```css
/* 之前 */
body {
  font-family: "My Custom Font", sans-serif;
}

/* 之后 */
body {
  font-family: var(--smtc-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif);
}
```

- `var(--smtc-font-family, ...)` 中的 fallback 值仅在用户尚未配置字体时使用
- smtc2web 通过 `/api/now` 响应自动注入用户选择的字体
- 建议 fallback 中至少包含系统默认 CJK 字体栈，确保中日韩用户开箱即用

### 3. 更新 JS：应用字体

如果主题有自定义 JS，请在 `/api/now` 响应中添加这一行：

```js
if (data.font_family) {
  document.documentElement.style.setProperty("--smtc-font-family", data.font_family);
}
```

参考默认主题的 `main.js` 作为完整示例。

## 零改动的向后兼容

如果完全不改主题代码：
- 旧主题依然能加载（CSS 中的静态 `font-family` 照常工作）
- 用户设置的字体选项将被忽略（因为主题未使用 `var(--smtc-font-family)`）
- 建议至少做第 2 步，体验更好

## 好处

| 方面 | 之前 | 之后 |
|------|------|------|
| 主题包大小 | ~23 MB（含字体） | ~几十 KB |
| 字体控制 | 硬编码在主题中 | 用户设置中选择 |
| 字形覆盖 | 仅捆绑字体 | 任意已安装系统字体 |
| 更新字体 | 等主题作者更新 | 安装到系统即可使用 |

## 默认主题变更参考

- [移除主题内置字体，使用系统已安装的字体](https://github.com/smtc2web/smtc2web-theme-spotify/commit/5017a16a3e7beef6e28b1dbb43f98c8e8196280f)

变更文件：
- `style.css`：删除 `@font-face`，使用 `var(--smtc-font-family, ...)`
- `main.js`：添加 `--smtc-font-family` CSS 属性注入
- `lib/ttf/`：整个目录已删除
