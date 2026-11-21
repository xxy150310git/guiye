# 归野服务器 Wiki

归野 · 我的世界生存服务器的规则与信息站。

访问地址：<https://gy-wiki.cc.cd/>

## 页面结构

| 文件 | 内容 |
| --- | --- |
| `index.html` | 首页：服务器新闻、状态查询脚本、快速链接 |
| `rules.html` | 服务器规定：卡服 / 物品 / 铁路 / 地铁 / 城镇 / 行为 / 处罚 |
| `players.html` | 服务器玩家名单：服主、管理员与玩家 |
| `css/style.css` | 全站共用样式 |
| `js/main.js` | 侧边栏、折叠面板、锚点直达、代码复制 |

## 维护说明

- 规则以「篇」为单位，每篇是一个 `.accordion-item`，篇内每条规则是一个 `.rule-card`。
- 新增一篇：复制任意 `.accordion-item`，同时修改头部 `data-target` 与对应 `.accordion-body` 的 `id`（两处必须一致）。
- 支持锚点直达：`rules.html#acc-rail` 会自动展开并滚动到「铁路篇」。
  现有锚点：`acc-kafu`（卡服）、`acc-item`（物品）、`acc-rail`（铁路）、`acc-metro`（地铁）、`acc-town`（城镇）、`acc-behavior`（行为）、`acc-punish`（处罚）。
- 玩家名单在 `players.html`，新增玩家时复制一个 `.player-card` 块，并同步修改顶部四张统计卡片里的数字。

## 发布

仓库开启 GitHub Pages（`main` 分支根目录），并绑定自定义域名 `gy-wiki.cc.cd`（见 `CNAME`）。推送到 `main` 后约 30～60 秒自动生效。
