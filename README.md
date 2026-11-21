# 归野服务器 Wiki

归野 · 我的世界生存服务器的规则与信息站。

- 访问地址：<https://gy-wiki.cc.cd/>
- 服务器地址：`zjt.rainplay.cn:19532`（IP 直连 `43.226.59.13:19532`）
- 客户端：Minecraft **1.21.1 + NeoForge**，必备模组见服务器 QQ 群文件
- 服主 QQ：`3648142170`

## 页面结构

| 文件 | 内容 |
| --- | --- |
| `index.html` | 首页：实时状态面板、服务器地图、联系方式、命令行查询脚本 |
| `rules.html` | 服务器规定：卡服 / 物品 / 铁路 / 地铁 / 城镇 / 行为 / 处罚 |
| `players.html` | 服务器玩家名单：服主、管理员与玩家 |
| `faq.html` | 常见问题：进服、模组、状态查询、规则与联系 |
| `css/style.css` | 全站共用样式 |
| `js/config.js` | **站点配置（改信息优先改这里）** |
| `js/main.js` | 侧边栏、折叠面板、锚点直达、一键复制、配置注入 |
| `js/status.js` | 实时状态面板逻辑 |

## 改信息先看 js/config.js

```js
window.WIKI_CONFIG = {
    server:  { host, port, ip, version, loader, world },
    status:  { refreshSeconds, timeoutMs },
    map:     { url, label },        // 填入 BlueMap / Dynmap 地址即自动出现地图入口
    contact: { ownerName, ownerQQ, adminName, qqGroup, groupNote },
    external:{ rainyun, chunkApply }
};
```

首页、FAQ 中带 `data-cfg="server.version"` 这类属性的文字会自动从配置读取并替换。

## 实时状态面板

- 数据来源：`api.mcstatus.io`（主）、`api.mcsrvstat.us`（备用），均为公开且允许跨域的接口。
- 每 60 秒自动刷新一次，切换回页面时也会立即刷新，可手动点「刷新」。
- 面板中的「延迟」是**本站向状态接口查询一次的往返耗时**（含 DNS / TLS 握手），**不是游戏内延迟**；游戏内延迟以客户端 Tab 列表为准。

## 维护说明

- 规则以「篇」为单位，每篇是一个 `.accordion-item`，篇内每条规则是一个 `.rule-card`。
- 新增一篇：复制任意 `.accordion-item`，同时修改头部 `data-target` 与对应 `.accordion-body` 的 `id`（两处必须一致）。
- 支持锚点直达：`rules.html#acc-rail` 会自动展开并滚动到「铁路篇」。
  现有锚点：`acc-kafu`、`acc-item`、`acc-rail`、`acc-metro`、`acc-town`、`acc-behavior`、`acc-punish`。
- FAQ 同样支持锚点，如 `faq.html#faq-mod` 直达「必备模组在哪里下载」。
- 玩家名单在 `players.html`，新增玩家时复制一个 `.player-card` 块，并同步修改顶部四张统计卡片里的数字。

## 发布

仓库开启 GitHub Pages（`main` 分支根目录），并绑定自定义域名 `gy-wiki.cc.cd`（见 `CNAME`）。推送到 `main` 后约 30～60 秒自动生效。
