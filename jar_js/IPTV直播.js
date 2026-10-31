// 芸直播 - TVBox QuickJS (txt 直播源直连版)
// 源格式: 分组名,#genre#  +  频道名,URL$备注
// 分组: / 📡咪咕央卫 / 📡咪咕頻道 / 📺港澳代理 / 🎹音樂欣賞 / 👑會員頻道

var SRC_URL = 'https://cnb.cool/hogo_box/box/-/git/raw/main/JS/ZB.txt';
var USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';
var CACHE_TTL = 1800000;
var TIMEOUT = 20000;

var DESC_PREFIX = '【友情提醒🔺勿信广告，避免受骗】📢';

// 分组封面覆盖(键=分组名, 值=图片地址)
var GROUP_PIC_OVERRIDE = {
   '📡咪咕頻道': 'https://gitee.com/lyun_1_0/TS/raw/main/lib/咪咕.jpg',
   '🇨🇳央视频道': 'https://gitee.com/lyun_1_0/TS/raw/main/lib/央视.jpg',
   '📡卫视頻道': 'https://gitee.com/lyun_1_0/TS/raw/main/lib/卫视.jpg',
   '📺港澳代理': 'https://gitee.com/lyun_1_0/TS/raw/main/lib/yecao.png',
   '🎹音樂欣賞': 'https://gitee.com/lyun_1_0/TS/raw/main/lib/音乐.jpg'
};

var CACHE = { ts: 0, groups: null };

function fetchGroups() {
    var now = (new Date()).getTime();
    if (CACHE.groups && now - CACHE.ts < CACHE_TTL) return CACHE.groups;
    var res = req(SRC_URL, { headers: { 'User-Agent': USER_AGENT }, timeout: TIMEOUT });
    var content = '';
    if (typeof res === 'object' && res !== null) {
        content = res.content !== undefined ? res.content : (res.body || '');
    } else {
        content = String(res || '');
    }
    if (!content) throw new Error('直播源拉取失败');
    var groups = parseTxt(content);
    if (!groups.length) throw new Error('直播源解析为空');
    CACHE.ts = now;
    CACHE.groups = groups;
    return groups;
}

function parseTxt(text) {
    var lines = String(text).replace(/\r/g, '').split('\n');
    var groups = [], cur = null, i, line, idx, gname, name, rest, url, note, di;
    for (i = 0; i < lines.length; i++) {
        line = lines[i].replace(/^\s+|\s+$/g, '');
        if (!line) continue;
        idx = line.indexOf(',#genre#');
        if (idx > -1) {
            gname = line.substring(0, idx).replace(/^\s+|\s+$/g, '');
            cur = { name: gname, channels: [] };
            groups.push(cur);
            continue;
        }
        idx = line.indexOf(',');
        if (idx < 1 || !cur) continue;
        name = line.substring(0, idx).replace(/^\s+|\s+$/g, '');
        rest = line.substring(idx + 1).replace(/^\s+|\s+$/g, '');
        if (!rest) continue;
        url = rest; note = '';
        di = rest.indexOf('$');
        if (di > -1) { url = rest.substring(0, di); note = rest.substring(di + 1); }
        if (!url) continue;
        cur.channels.push({ name: name, url: url, note: note });
    }
    return groups;
}

function findGroup(tid) {
    var groups = fetchGroups();
    var name = String(tid || '');
    try { name = decodeURIComponent(name); } catch (e) { }
    for (var i = 0; i < groups.length; i++) {
        if (groups[i].name === name) return groups[i];
    }
    return null;
}

function groupPic(gname) {
    return GROUP_PIC_OVERRIDE[gname] || '';
}

function card(gname, ch, idx) {
    return {
        vod_id: encodeURIComponent(gname) + '|' + idx,
        vod_name: ch.name,
        vod_pic: groupPic(gname),
        vod_remarks: ch.note || ''
    };
}

var spider = {
    init: function (cfg) {
        if (cfg && cfg.ext) {
            var ext = typeof cfg.ext === 'string' ? cfg.ext : (cfg.ext.url || '');
            if (ext) SRC_URL = ext;
        }
    },

    home: function (filter) {
        var groups = fetchGroups();
        var classes = [], i;
        for (i = 0; i < groups.length; i++) {
            classes.push({ type_id: encodeURIComponent(groups[i].name), type_name: groups[i].name });
        }
        return JSON.stringify({ class: classes, filters: {} });
    },

    homeVod: function () {
        var groups = fetchGroups();
        var list = [], i, j;
        for (i = 0; i < groups.length; i++) {
            for (j = 0; j < groups[i].channels.length && j < 8; j++) {
                list.push(card(groups[i].name, groups[i].channels[j], j));
            }
        }
        return JSON.stringify({ list: list });
    },

    category: function (tid, pg, filter, extend) {
        var g = findGroup(tid);
        var list = [], i;
        if (g) {
            for (i = 0; i < g.channels.length; i++) list.push(card(g.name, g.channels[i], i));
        }
        return JSON.stringify({ list: list, page: 1, pagecount: 1, limit: list.length, total: list.length });
    },

    detail: function (ids) {
        var id = typeof ids === 'string' ? ids : (ids && ids[0]) || '';
        var parts = String(id).split('|');
        var g = findGroup(parts[0]);
        var idx = parseInt(parts[1] || '0', 10);
        if (!g || !g.channels[idx]) return JSON.stringify({ list: [] });
        var ch = g.channels[idx];
        return JSON.stringify({
            list: [{
                vod_id: id,
                vod_name: ch.name,
                vod_pic: groupPic(g.name),
                vod_content: DESC_PREFIX + ch.name + (ch.note ? ' ' + ch.note : ''),
                vod_play_from: '直播源',
                vod_play_url: '立即播放$' + encodeURIComponent(ch.url)
            }]
        });
    },

    play: function (flag, id, flags) {
        var url = String(id || '');
        try { url = decodeURIComponent(url); } catch (e) { }
        return JSON.stringify({
            parse: 0,
            playUrl: '',
            url: url,
            header: { 'User-Agent': USER_AGENT }
        });
    },

    search: function (wd, quick) {
        var groups = fetchGroups();
        var k = String(wd || '');
        var list = [], i, j;
        for (i = 0; i < groups.length; i++) {
            for (j = 0; j < groups[i].channels.length; j++) {
                if (groups[i].channels[j].name.indexOf(k) > -1) {
                    list.push(card(groups[i].name, groups[i].channels[j], j));
                }
            }
        }
        return JSON.stringify({ list: list });
    }
};

export default spider;
