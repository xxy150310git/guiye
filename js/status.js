/* ============================================================
   归野 Wiki · 实时服务器状态
   数据来源：mcstatus.io（主）/ mcsrvstat.us（备），均为公开接口
   ============================================================ */
(function () {
    'use strict';

    var CFG = window.WIKI_CONFIG || {};
    var SRV = CFG.server || {};
    var OPT = CFG.status || {};

    var HOST = SRV.host || 'zjt.rainplay.cn';
    var PORT = SRV.port || 19532;
    var REFRESH = (OPT.refreshSeconds || 60) * 1000;
    var TIMEOUT = OPT.timeoutMs || 8000;

    var panel = document.getElementById('statusPanel');
    if (!panel) return;

    function el(id) { return document.getElementById(id); }

    var els = {
        state: el('stState'),
        motd: el('stMotd'),
        updated: el('stUpdated'),
        players: el('stPlayers'),
        playersSub: el('stPlayersSub'),
        ping: el('stPing'),
        pingSub: el('stPingSub'),
        version: el('stVersion'),
        versionSub: el('stVersionSub'),
        status: el('stStatus'),
        statusSub: el('stStatusSub'),
        onlineList: el('onlineList'),
        refresh: el('stRefresh')
    };

    var lastOkAt = 0;
    var timer = null;

    /* ---------- 工具 ---------- */
    function setState(state) {
        panel.dataset.state = state;
    }

    function setVal(node, text, cls) {
        if (!node) return;
        node.textContent = text;
        node.className = 'st-value' + (cls ? ' ' + cls : '');
    }

    function setSub(node, text) {
        if (node) node.textContent = text;
    }

    function fetchJson(url) {
        var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var tid = setTimeout(function () {
            if (controller) controller.abort();
        }, TIMEOUT);

        return fetch(url, {
            cache: 'no-store',
            signal: controller ? controller.signal : undefined
        }).then(function (res) {
            clearTimeout(tid);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        }).catch(function (err) {
            clearTimeout(tid);
            throw err;
        });
    }

    /* ---------- 主接口：mcstatus.io ---------- */
    function fromMcStatus() {
        var url = 'https://api.mcstatus.io/v2/status/java/' + HOST + ':' + PORT;
        var t0 = performance.now();
        return fetchJson(url).then(function (j) {
            var ping = Math.round(performance.now() - t0);
            var p = j.players || {};
            return {
                online: !!j.online,
                current: p.online || 0,
                max: p.max || 0,
                version: (j.version && (j.version.name_clean || j.version.name_raw)) || '',
                motd: (j.motd && j.motd.clean) || '',
                players: (p.list || []).map(function (x) {
                    return x.name_clean || x.name_raw || '';
                }).filter(Boolean),
                ping: ping,
                source: 'mcstatus.io'
            };
        });
    }

    /* ---------- 备用接口：mcsrvstat.us ---------- */
    function fromMcSrvStat() {
        var url = 'https://api.mcsrvstat.us/3/' + HOST + ':' + PORT;
        var t0 = performance.now();
        return fetchJson(url).then(function (j) {
            var ping = Math.round(performance.now() - t0);
            var p = j.players || {};
            var motd = (j.motd && (j.motd.clean || []).join(' ')) || '';
            return {
                online: !!j.online,
                current: p.online || 0,
                max: p.max || 0,
                version: typeof j.version === 'string' ? j.version : '',
                motd: motd,
                players: (p.list || []).map(function (x) {
                    return x.name || '';
                }).filter(Boolean),
                ping: ping,
                source: 'mcsrvstat.us'
            };
        });
    }

    /* ---------- 渲染 ---------- */
    function render(d) {
        lastOkAt = Date.now();

        if (!d.online) {
            setState('offline');
            if (els.state) els.state.textContent = '服务器离线';
            setSub(els.motd, '');
            setVal(els.players, '—', 'is-muted');
            setSub(els.playersSub, '服务器未响应');
            setVal(els.ping, d.ping + ' ms', 'is-muted');
            setSub(els.pingSub, '接口往返耗时');
            setVal(els.status, '离线', 'is-offline');
            setSub(els.statusSub, '可能正在维护或重启');
            setVal(els.version, d.version || SRV.version || '—');
            setSub(els.versionSub, d.version ? '服务器当前版本' : '以上次记录为准');
            renderPlayers([]);
            return;
        }

        setState('online');
        if (els.state) els.state.textContent = '服务器在线';
        setSub(els.motd, d.motd ? '· ' + d.motd : '');

        setVal(els.players, d.current + ' / ' + (d.max || '—'), 'is-online');
        setSub(els.playersSub, d.max ? '玩家上限 ' + d.max + ' 人' : '在线玩家数');

        setVal(els.ping, d.ping + ' ms', d.ping < 1200 ? 'is-online' : '');
        setSub(els.pingSub, '接口往返 · 非游戏延迟');

        setVal(els.version, d.version || SRV.version || '—');
        setSub(els.versionSub, (SRV.loader ? SRV.loader + ' 模组服' : '服务器版本'));

        setVal(els.status, '在线', 'is-online');
        setSub(els.statusSub, '自动刷新 · ' + Math.round(REFRESH / 1000) + ' 秒');

        renderPlayers(d.players);
    }

    function renderPlayers(list) {
        if (!els.onlineList) return;
        if (!list || !list.length) {
            els.onlineList.innerHTML = '';
            return;
        }
        var html = '<span class="addr-label">在线玩家：</span>';
        list.forEach(function (name) {
            html += '<span class="chip">' + name.replace(/[<>&]/g, '') + '</span>';
        });
        els.onlineList.innerHTML = html;
    }

    function renderError() {
        setState('error');
        if (els.state) els.state.textContent = '状态查询失败';
        setSub(els.motd, '');
        setVal(els.players, '—', 'is-muted');
        setSub(els.playersSub, '接口暂时不可用');
        setVal(els.ping, '—', 'is-muted');
        setSub(els.pingSub, '接口往返耗时');
        setVal(els.version, SRV.version || '—');
        setSub(els.versionSub, '以上次记录为准');
        setVal(els.status, '未知', 'is-muted');
        setSub(els.statusSub, '请稍后刷新');
        renderPlayers([]);
    }

    /* ---------- 加载 ---------- */
    function load(silent) {
        if (!silent && els.refresh) els.refresh.classList.add('spinning');

        fromMcStatus()
            .catch(function () { return fromMcSrvStat(); })
            .then(render)
            .catch(renderError)
            .then(function () {
                if (els.refresh) els.refresh.classList.remove('spinning');
            });
    }

    /* ---------- “x 秒前更新”走字 ---------- */
    function tickUpdated() {
        if (!els.updated) return;
        if (!lastOkAt) {
            els.updated.textContent = '正在连接…';
            return;
        }
        var sec = Math.round((Date.now() - lastOkAt) / 1000);
        if (sec < 5) els.updated.textContent = '刚刚更新';
        else if (sec < 60) els.updated.textContent = sec + ' 秒前更新';
        else els.updated.textContent = Math.round(sec / 60) + ' 分钟前更新';
    }

    /* ---------- 计时器 ---------- */
    function start() {
        stop();
        timer = setInterval(function () {
            if (!document.hidden) load(true);
        }, REFRESH);
    }

    function stop() {
        if (timer) clearInterval(timer);
        timer = null;
    }

    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) load(true);
    });

    if (els.refresh) {
        els.refresh.addEventListener('click', function () {
            load(false);
            tickUpdated();
        });
    }

    load(false);
    tickUpdated();
    setInterval(tickUpdated, 5000);
    start();
})();
