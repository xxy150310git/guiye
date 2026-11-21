/* ============================================================
   归野 Wiki · 公共脚本（多页版）
   ============================================================ */
(function () {
    'use strict';

    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    var toggle = document.getElementById('menuToggle');

    function isMobile() {
        return window.innerWidth <= 820;
    }

    function openMenu() {
        if (!sidebar || !overlay || !toggle) return;
        sidebar.classList.add('open');
        overlay.classList.add('active');
        toggle.innerHTML = '<i class="fas fa-times"></i><span style="font-size:0.8rem;font-weight:500;">关闭</span>';
    }

    function closeMenu() {
        if (!sidebar || !overlay || !toggle) return;
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        toggle.innerHTML = '<i class="fas fa-bars"></i><span style="font-size:0.8rem;font-weight:500;">菜单</span>';
    }

    if (toggle) {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebar.classList.contains('open') ? closeMenu() : openMenu();
        });
    }

    if (overlay) overlay.addEventListener('click', closeMenu);

    /* 移动端点击导航后自动收起 */
    document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (isMobile()) closeMenu();
        });
    });

    window.addEventListener('resize', function () {
        if (!isMobile() && sidebar && sidebar.classList.contains('open')) closeMenu();
    });

    var main = document.querySelector('.main');
    if (main) {
        main.addEventListener('click', function () {
            if (isMobile() && sidebar && sidebar.classList.contains('open')) closeMenu();
        });
    }

    /* 当前页高亮兜底：按文件名匹配导航链接 */
    var page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';
    document.querySelectorAll('.sidebar-nav a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;
        var parts = href.split('#');
        if (parts[1]) return; /* 带锚点的快捷链接不参与高亮 */
        if (parts[0] === page) a.classList.add('active');
    });

    /* 回到顶部 */
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ===== 一键复制（[data-copy]） ===== */
    function legacyCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (e) {
            ok = false;
        }
        document.body.removeChild(ta);
        return ok;
    }

    document.querySelectorAll('[data-copy]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var text = btn.getAttribute('data-copy') || '';
            var original = btn.innerHTML;
            function done(success) {
                btn.innerHTML = success ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
                btn.classList.add('done');
                setTimeout(function () {
                    btn.innerHTML = original;
                    btn.classList.remove('done');
                }, 1600);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    done(true);
                }).catch(function () {
                    done(legacyCopy(text));
                });
            } else {
                done(legacyCopy(text));
            }
        });
    });

    /* ===== 站点配置注入（js/config.js） ===== */
    (function () {
        var cfg = window.WIKI_CONFIG || {};

        document.querySelectorAll('[data-cfg]').forEach(function (node) {
            var path = node.getAttribute('data-cfg').split('.');
            var val = path.reduce(function (obj, key) {
                return obj && obj[key] !== undefined ? obj[key] : undefined;
            }, cfg);
            if (val !== undefined && val !== '') node.textContent = val;
        });

        /* 动态地图：配置了地址就显示入口，否则保持“部署中”占位 */
        var map = cfg.map || {};
        var link = document.getElementById('mapLink');
        var frame = document.getElementById('mapFrame');
        var placeholder = document.getElementById('mapPlaceholder');
        if (link) {
            if (map.url) {
                link.href = map.url;
                link.style.display = '';
                if (placeholder) placeholder.style.display = 'none';
                if (frame) {
                    frame.src = map.url;
                    frame.style.display = 'block';
                }
            } else {
                link.style.display = 'none';
            }
        }
    })();

    /* ===== 折叠面板 ===== */
    document.querySelectorAll('.accordion-header').forEach(function (header) {
        header.addEventListener('click', function () {
            var targetId = this.dataset.target;
            if (!targetId) return;
            var body = document.getElementById(targetId);
            if (!body) return;
            var item = this.closest('.accordion-item');
            if (item) item.classList.toggle('open');
        });
    });

    /* ===== 锚点直达：自动展开对应折叠面板 ===== */
    function openHashTarget() {
        var hash = window.location.hash.replace('#', '');
        if (!hash) return;
        var el = document.getElementById(hash);
        if (!el) return;
        var item = el.closest('.accordion-item');
        if (item) item.classList.add('open');
        setTimeout(function () {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
    }

    window.addEventListener('load', openHashTarget);
    window.addEventListener('hashchange', openHashTarget);

    /* ===== 代码折叠与复制 ===== */
    (function () {
        var toggleBtn = document.getElementById('codeToggleBtn');
        var copyBtn = document.getElementById('codeCopyBtn');
        var container = document.getElementById('codeContainer');
        var codeBlock = document.getElementById('codeBlock');

        if (!toggleBtn || !copyBtn || !container || !codeBlock) return;

        var isOpen = false;

        toggleBtn.addEventListener('click', function () {
            isOpen = !isOpen;
            container.style.display = isOpen ? 'block' : 'none';
            toggleBtn.textContent = isOpen ? '折叠代码' : '展开代码';
        });

        function markCopied() {
            var original = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> 已复制';
            setTimeout(function () {
                copyBtn.innerHTML = original;
            }, 2000);
        }

        function fallbackCopy(text) {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                markCopied();
            } catch (e) {
                alert('复制失败，请手动选中代码复制');
            }
            document.body.removeChild(textarea);
        }

        copyBtn.addEventListener('click', function () {
            var pre = codeBlock.querySelector('pre');
            if (!pre) return;
            var codeText = pre.textContent;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(codeText).then(markCopied).catch(function () {
                    fallbackCopy(codeText);
                });
            } else {
                fallbackCopy(codeText);
            }
        });
    })();
})();
