/* ============================================================
   归野 Wiki · 站点配置
   改这里就能改全站显示的信息，不用动页面结构。
   ============================================================ */
window.WIKI_CONFIG = {
    /* ---------- 服务器连接信息 ---------- */
    server: {
        host: 'zjt.rainplay.cn',   // 主域名
        port: 19532,               // 端口
        ip: '43.226.59.13',        // 备用 IP 直连
        version: '1.21.1',         // 客户端版本
        loader: 'NeoForge',        // 模组加载器
        world: '归野 · 生存大陆'
    },

    /* ---------- 实时状态 ---------- */
    status: {
        refreshSeconds: 60,        // 自动刷新间隔（秒）
        timeoutMs: 8000            // 单次请求超时（毫秒）
    },

    /* ---------- 动态地图 ---------- */
    /* 填入 BlueMap / Dynmap / squaremap 的网页地址后，
       首页会自动出现“打开地图”入口并嵌入预览；留空则显示部署中。 */
    map: {
        url: '',
        label: '服务器地图'
    },

    /* ---------- 联系方式 ---------- */
    contact: {
        ownerName: 'xxy150310',
        ownerQQ: '3648142170',
        adminName: 'YuanHollow',
        qqGroup: '',               // 有群号就填这里，首页会自动显示
        groupNote: '必备模组请在服务器 QQ 群文件内下载'
    },

    /* ---------- 外部平台 ---------- */
    external: {
        rainyun: 'https://app.rainyun.com/apps/rgs/45794/detail',
        chunkApply: 'https://v.wjx.cn/vm/YYvvb5z.aspx'
    }
};
