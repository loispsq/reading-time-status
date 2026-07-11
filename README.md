# Reading Time Status

Show word count and estimated reading time for the current note in the status bar (CJK-aware).

## 开发

```bash
npm install
npm run dev      # 监听构建
npm run build    # 生产构建，产出 main.js
```

本地调试：把本目录软链到某个 vault 的 `.obsidian/plugins/reading-time-status/`，
在 Obsidian 里启用插件，改代码后 reload（或用 Hot-Reload 插件）。

## 发布

```bash
# 在本目录下
node ../../plugin-factory/scripts/release.mjs --patch
```

或手动打 tag，GitHub Actions 会自动构建并发 Release。

## 首次上架（一次性）

向 [`obsidianmd/obsidian-releases`](https://github.com/obsidianmd/obsidian-releases)
提 PR，把本插件加进 `community-plugins.json`。合并后，之后每次发 Release 自动生效。

## License

MIT
