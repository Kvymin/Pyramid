import { load, Crypto, _ } from 'assets://js/lib/cat.js';

let HOST = 'https://moguvodw.com';
let siteKey = '', siteType = '', sourceKey = '', ext = '';

const PLAY_CACHE = {};
const SEARCH_CACHE = {};
const DETAIL_CACHE = {};

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const COMMON_HEADERS = {
    'User-Agent': UA,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
};


const PLAYER_LIST = {
    bilibili: 'https://www.yemu.xyz/?url=',
    youku: 'https://jx.xmflv.com/?url=',
    qiyi: 'https://jx.xmflv.com/?url=',
    qq: 'https://jx.xmflv.com/?url=',
    mgtv: 'https://jx.playerjy.com/?url=',
    letv: 'https://jx.xmflv.com/?url=',
    pptv: 'https://jx.xmflv.com/?url=',
    sohu: 'https://jx.xmflv.com/?url=',
    bfzym3u8: 'https://vip.vipuuvip.com/?url=',
    dbm3u8: 'https://www.dbjiexi.com:966/jx/?url=',
    dbyun: 'https://www.dbjiexi.com:966/jx/?url='
};

const DEFAULT_PARSE = 'https://jx.xmflv.com/?url=';


const FILTERS = {"1":[{"key":"by","name":"排序","value":[{"n":"按最新","v":"time"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]},{"key":"class","name":"类型","value":[{"n":"喜剧","v":"喜剧"},{"n":"爱情","v":"爱情"},{"n":"恐怖","v":"恐怖"},{"n":"动作","v":"动作"},{"n":"科幻","v":"科幻"},{"n":"剧情","v":"剧情"},{"n":"战争","v":"战争"},{"n":"警匪","v":"警匪"},{"n":"犯罪","v":"犯罪"},{"n":"动画","v":"动画"},{"n":"奇幻","v":"奇幻"},{"n":"武侠","v":"武侠"},{"n":"冒险","v":"冒险"},{"n":"枪战","v":"枪战"},{"n":"恐怖","v":"恐怖"},{"n":"悬疑","v":"悬疑"},{"n":"惊悚","v":"惊悚"},{"n":"经典","v":"经典"},{"n":"青春","v":"青春"},{"n":"文艺","v":"文艺"},{"n":"微电影","v":"微电影"},{"n":"古装","v":"古装"},{"n":"历史","v":"历史"},{"n":"运动","v":"运动"},{"n":"农村","v":"农村"},{"n":"儿童","v":"儿童"},{"n":"网络电影","v":"网络电影"}]},{"key":"area","name":"地区","value":[{"n":"内地","v":"内地"},{"n":"中国香港","v":"中国香港"},{"n":"中国台湾","v":"中国台湾"},{"n":"美国","v":"美国"},{"n":"法国","v":"法国"},{"n":"英国","v":"英国"},{"n":"日本","v":"日本"},{"n":"韩国","v":"韩国"},{"n":"德国","v":"德国"},{"n":"泰国","v":"泰国"},{"n":"印度","v":"印度"},{"n":"意大利","v":"意大利"},{"n":"西班牙","v":"西班牙"},{"n":"加拿大","v":"加拿大"},{"n":"其他","v":"其他"}]},{"key":"year","name":"年份","value":[{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"lang","name":"语言","value":[{"n":"国语","v":"国语"},{"n":"英语","v":"英语"},{"n":"粤语","v":"粤语"},{"n":"闽南语","v":"闽南语"},{"n":"韩语","v":"韩语"},{"n":"日语","v":"日语"},{"n":"法语","v":"法语"},{"n":"德语","v":"德语"},{"n":"其它","v":"其它"}]},{"key":"letter","name":"字母","value":[{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]}],"2":[{"key":"by","name":"排序","value":[{"n":"按最新","v":"time"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]},{"key":"class","name":"类型","value":[{"n":"古装","v":"古装"},{"n":"战争","v":"战争"},{"n":"青春偶像","v":"青春偶像"},{"n":"喜剧","v":"喜剧"},{"n":"家庭","v":"家庭"},{"n":"犯罪","v":"犯罪"},{"n":"动作","v":"动作"},{"n":"奇幻","v":"奇幻"},{"n":"剧情","v":"剧情"},{"n":"历史","v":"历史"},{"n":"经典","v":"经典"},{"n":"乡村","v":"乡村"},{"n":"情景","v":"情景"},{"n":"商战","v":"商战"},{"n":"网剧","v":"网剧"},{"n":"其他","v":"其他"}]},{"key":"area","name":"地区","value":[{"n":"内地","v":"内地"},{"n":"韩国","v":"韩国"},{"n":"中国香港","v":"中国香港"},{"n":"中国台湾","v":"中国台湾"},{"n":"日本","v":"日本"},{"n":"美国","v":"美国"},{"n":"泰国","v":"泰国"},{"n":"英国","v":"英国"},{"n":"新加坡","v":"新加坡"},{"n":"其他","v":"其他"}]},{"key":"year","name":"年份","value":[{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"lang","name":"语言","value":[{"n":"国语","v":"国语"},{"n":"英语","v":"英语"},{"n":"粤语","v":"粤语"},{"n":"闽南语","v":"闽南语"},{"n":"韩语","v":"韩语"},{"n":"日语","v":"日语"},{"n":"其它","v":"其它"}]},{"key":"letter","name":"字母","value":[{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]}],"21":[{"key":"by","name":"排序","value":[{"n":"按最新","v":"time"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]},{"key":"class","name":"类型","value":[{"n":"重生民国","v":"重生民国"},{"n":"穿越现代","v":"穿越现代"},{"n":"反转爽剧","v":"反转爽剧"},{"n":"言情总裁","v":"言情总裁"},{"n":"现代都市","v":"现代都市"},{"n":"古装仙侠","v":"古装仙侠"},{"n":"悬疑烧脑","v":"悬疑烧脑+"}]},{"key":"year","name":"年份","value":[{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"}]},{"key":"letter","name":"字母","value":[{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]}],"4":[{"key":"by","name":"排序","value":[{"n":"按最新","v":"time"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]},{"key":"class","name":"类型","value":[{"n":"情感","v":"情感"},{"n":"科幻","v":"科幻"},{"n":"热血","v":"热血"},{"n":"推理","v":"推理"},{"n":"搞笑","v":"搞笑"},{"n":"冒险","v":"冒险"},{"n":"萝莉","v":"萝莉"},{"n":"校园","v":"校园"},{"n":"动作","v":"动作"},{"n":"机战","v":"机战"},{"n":"运动","v":"运动"},{"n":"战争","v":"战争"},{"n":"少年","v":"少年"},{"n":"少女","v":"少女"},{"n":"社会","v":"社会"},{"n":"原创","v":"原创"},{"n":"亲子","v":"亲子"},{"n":"益智","v":"益智"},{"n":"励志","v":"励志"},{"n":"其他","v":"其他"}]},{"key":"area","name":"地区","value":[{"n":"国产","v":"国产"},{"n":"日本","v":"日本"},{"n":"欧美","v":"欧美"},{"n":"其他","v":"其他"}]},{"key":"year","name":"年份","value":[{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"lang","name":"语言","value":[{"n":"国语","v":"国语"},{"n":"英语","v":"英语"},{"n":"粤语","v":"粤语"},{"n":"闽南语","v":"闽南语"},{"n":"韩语","v":"韩语"},{"n":"日语","v":"日语"},{"n":"其它","v":"其它"}]},{"key":"letter","name":"字母","value":[{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]}],"3":[{"key":"by","name":"排序","value":[{"n":"按最新","v":"time"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]},{"key":"class","name":"类型","value":[{"n":"选秀","v":"选秀"},{"n":"情感","v":"情感"},{"n":"访谈","v":"访谈"},{"n":"播报","v":"播报"},{"n":"旅游","v":"旅游"},{"n":"音乐","v":"音乐"},{"n":"美食","v":"美食"},{"n":"纪实","v":"纪实"},{"n":"曲艺","v":"曲艺"},{"n":"生活","v":"生活"},{"n":"游戏互动","v":"游戏互动"},{"n":"财经","v":"财经"},{"n":"求职","v":"求职"}]},{"key":"area","name":"地区","value":[{"n":"国内","v":"国内"},{"n":"海外","v":"海外"}]},{"key":"year","name":"年份","value":[{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"}]},{"key":"lang","name":"语言","value":[{"n":"国语","v":"国语"},{"n":"英语","v":"英语"},{"n":"粤语","v":"粤语"},{"n":"闽南语","v":"闽南语"},{"n":"韩语","v":"韩语"},{"n":"日语","v":"日语"},{"n":"其它","v":"其它"}]},{"key":"letter","name":"字母","value":[{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]}],"23":[{"key":"by","name":"排序","value":[{"n":"按最新","v":"time"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]},{"key":"letter","name":"字母","value":[{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"},{"n":"0-9","v":"0"},{"n":"按最热","v":"hits"},{"n":"按评分","v":"score"}]}]};



async function request(url, ref, retry = 2) {
    const headers = Object.assign({}, COMMON_HEADERS);
    if (ref) headers['Referer'] = ref;
    try {
        const res = await req(url, {
            method: 'get',
            headers: headers,
            timeout: 30000
        });
        return res;
    } catch (e) {
        if (retry > 0) return await request(url, ref, retry - 1);
        return { content: '' };
    }
}

function toHtml(res) {
    if (!res) return '';
    if (typeof res === 'string') return res;
    return res.content || res.body || res.data || '';
}

function joinUrl(url) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('/')) return HOST + url;
    return HOST + '/' + url;
}


function b64decode(input) {
    const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = String(input).replace(/[^A-Za-z0-9+/=]/g, '');
    let output = '';
    let i = 0;
    while (i < str.length) {
        const enc1 = b64.indexOf(str.charAt(i++));
        const enc2 = b64.indexOf(str.charAt(i++));
        const enc3 = b64.indexOf(str.charAt(i++));
        const enc4 = b64.indexOf(str.charAt(i++));
        const chr1 = (enc1 << 2) | (enc2 >> 4);
        const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        const chr3 = ((enc3 & 3) << 6) | enc4;
        output += String.fromCharCode(chr1);
        if (enc3 !== 64) output += String.fromCharCode(chr2);
        if (enc4 !== 64) output += String.fromCharCode(chr3);
    }
    return output;
}


function jsUnescape(str) {
    if (typeof unescape === 'function') {
        try { return unescape(str); } catch (e) {}
    }
    return String(str)
        .replace(/%u([0-9A-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
        .replace(/%([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function decryptUrl(enc, url) {
    if (!url) return '';
    if (enc === 1 || enc === '1') {
        return jsUnescape(url);
    } else if (enc === 2 || enc === '2') {
        return jsUnescape(b64decode(url));
    }
    return url;
}

function isMedia(url) {
    return /\.(m3u8|mp4|ts|flv|m3u)(\?|$)/i.test(url || '');
}


function extractPlayerJson(html) {
    let i = html.indexOf('var player_aaaa');
    if (i < 0) {
        const m = html.match(/var\s+player_[a-zA-Z0-9_]+\s*=/);
        if (!m) return null;
        i = m.index;
    }
    const start = html.indexOf('{', i);
    if (start < 0) return null;
    let depth = 0, inStr = false, esc = false;
    for (let j = start; j < html.length; j++) {
        const c = html.charAt(j);
        if (inStr) {
            if (esc) { esc = false; }
            else if (c === '\\') { esc = true; }
            else if (c === '"') { inStr = false; }
            continue;
        }
        if (c === '"') { inStr = true; }
        else if (c === '{') { depth++; }
        else if (c === '}') {
            depth--;
            if (depth === 0) return html.slice(start, j + 1);
        }
    }
    return null;
}


function maxPage(html, patterns) {
    let max = 0;
    patterns.forEach(p => {
        const re = new RegExp(p, 'g');
        let m;
        while ((m = re.exec(html)) !== null) {
            const n = parseInt(m[1]);
            if (n > max && n < 100000) max = n;
        }
    });
    return max;
}



function parseVodList(html) {
    const $ = load(html);
    const list = [];

    $('a.hl-item-thumb, a.hl-br-thumb').each((_, el) => {
        const a = $(el);
        const href = a.attr('href') || '';
        if (!href.includes('voddetail')) return;

        const m = href.match(/voddetail\/(\d+)\.html/);
        const vodId = m ? m[1] : '';
        if (!vodId) return;

        let name = a.attr('title') || a.text().trim();
        if (!name) {
            name = a.find('img').attr('alt') || a.find('img').attr('title') || '';
        }
        name = name.trim();
        if (!name || name === '详情' || name.length > 40) return;

        let pic = a.attr('data-original') || a.attr('src') ||
            a.find('img').attr('data-original') || a.find('img').attr('src') || '';
        if (!pic && a.attr('style')) {
            const bg = a.attr('style').match(/url\(['"]?(.*?)['"]?\)/);
            if (bg) pic = bg[1];
        }
        if (!pic) return;

        let remarks = a.find('.hl-pic-text .remarks').text().trim() ||
            a.find('.hl-pic-tag span').text().trim() ||
            a.parent().find('.hl-pic-text .remarks').text().trim() ||
            a.parent().find('.hl-pic-tag span').text().trim() || '';

        list.push({
            vod_id: vodId,
            vod_name: name,
            vod_pic: joinUrl(pic),
            vod_remarks: remarks
        });
    });

    const map = {};
    return list.filter(it => {
        if (!it.vod_id || map[it.vod_id]) return false;
        map[it.vod_id] = 1;
        return true;
    });
}


function buildShowUrl(tid, pg, extend) {
    const e = extend || {};
    const enc = (v) => v ? encodeURIComponent(v) : '';
    const slots = [
        String(tid),
        enc(e.area || ''),
        enc(e.by || ''),
        enc(e.class || ''),
        enc(e.lang || ''),
        enc(e.letter || ''),
        '', '',
        pg > 1 ? String(pg) : '',
        '', '',
        enc(e.year || '')
    ];
    return HOST + '/vodshow/' + slots.join('-') + '.html';
}



function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    sourceKey = cfg.sourceKey;
    ext = cfg.ext || '';
    if (ext && /^https?:\/\//.test(ext)) {
        HOST = ext.replace(/\/$/, '');
    }
}

function home(filter) {
    const classes = [
        { type_id: '1', type_name: '电影' },
        { type_id: '2', type_name: '电视剧' },
        { type_id: '21', type_name: '短剧' },
        { type_id: '4', type_name: '动漫' },
        { type_id: '3', type_name: '综艺' },
        { type_id: '23', type_name: '记录片' }
    ];
    return JSON.stringify({ class: classes, filters: FILTERS });
}

async function homeVod() {
    try {
        const res = await request(HOST + '/');
        const list = parseVodList(toHtml(res));
        return JSON.stringify({ list: list });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
}

async function category(tid, pg, filter, extend) {
    pg = parseInt(pg) || 1;
    let url, pagePatterns;
    const hasFilter = extend && Object.keys(extend).some(k => extend[k]);

    if (hasFilter) {
       
        url = buildShowUrl(tid, pg, extend);
        pagePatterns = ['-(\\d+)---\\.html'];
    } else {
        url = pg === 1
            ? `${HOST}/vodtype/${tid}.html`
            : `${HOST}/vodtype/${tid}-${pg}.html`;
        pagePatterns = ['/vodtype/' + tid + '-(\\d+)\\.html'];
    }

    try {
        const res = await request(url, HOST + '/');
        const html = toHtml(res);
        const list = parseVodList(html);
        const pc = maxPage(html, pagePatterns);
        return JSON.stringify({
            page: pg,
            pagecount: Math.max(pc, list.length > 0 ? pg : pg),
            limit: 20,
            total: list.length > 0 ? (pc || pg) * 20 : 0,
            list: list
        });
    } catch (e) {
        return JSON.stringify({ page: pg, pagecount: 0, limit: 20, total: 0, list: [] });
    }
}

async function detail(id) {
    if (DETAIL_CACHE[id]) return DETAIL_CACHE[id];
    try {
        const url = `${HOST}/voddetail/${id}.html`;
        const res = await request(url, HOST + '/');
        const html = toHtml(res);
        const $ = load(html);

        const vod = {
            vod_id: id,
            vod_name: '',
            vod_pic: '',
            vod_content: '',
            vod_actor: '',
            vod_director: '',
            vod_year: '',
            vod_area: '',
            vod_remarks: ''
        };

        vod.vod_name = $('.hl-dc-title').first().text().trim() ||
            $('h1').first().text().trim();
        let pic = $('.hl-dc-pic').find('[data-original]').first().attr('data-original') ||
            $('.hl-dc-pic img').first().attr('src') || '';
        vod.vod_pic = joinUrl(pic);

        
        const pick = (kw) => {
            let r = '';
            $('li').each((_, el) => {
                const t = $(el).text();
                if (r) return false;
                if (t.indexOf(kw) !== -1) {
                    const a = $(el).find('a');
                    r = a.length ? a.map((__, x) => $(x).text().trim()).get().join('/').trim()
                        : t.replace(kw + '：', '').replace(kw + ':', '').replace(kw, '').trim();
                }
                return true;
            });
            return r;
        };
        vod.vod_actor = pick('主演');
        vod.vod_director = pick('导演');
        vod.vod_year = pick('年份');
        vod.vod_area = pick('地区');
        vod.vod_remarks = pick('备注');

        
        let content = '';
        ['.hl-dc-intro', '.hl-dc-sketch', '.hl-dc-desc', '.hl-dc-content p', '.hl-dc-content'].forEach(sel => {
            const t = $(sel).first().text().trim();
            if (t && t.length > content.length) content = t;
        });
        vod.vod_content = content;

        
        const tabs = [];
        $('.hl-plays-from a').each((_, el) => {
            const t = ($(el).attr('alt') || $(el).text() || '').trim();
            tabs.push(t);
        });

        const blocks = [];
        $('.hl-plays-list').each((_, el) => {
            const arr = [];
            $(el).find('a').each((__, a) => {
                const href = $(a).attr('href') || '';
                const m = href.match(/vodplay\/(\d+-\d+-\d+)\.html/);
                if (m) {
                    let name = $(a).text().trim();
                    if (!name) name = m[1].split('-').pop();
                    arr.push(name + '$' + m[1]);
                }
            });
            blocks.push(arr);
        });

        const playFrom = [], playUrls = [];
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            if (!tab || /下载/.test(tab)) continue;      
            const eps = blocks[i] || [];
            if (!eps.length) continue;                   
            playFrom.push(tab);
            playUrls.push(eps.join('#'));
        }

        vod.vod_play_from = playFrom.join('$$$');
        vod.vod_play_url = playUrls.join('$$$');

        const result = JSON.stringify({ list: [vod] });
        DETAIL_CACHE[id] = result;
        return result;
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
}

async function search(wd, quick, pg) {
    pg = parseInt(pg) || 1;
    const cacheKey = wd + '_' + pg;
    if (SEARCH_CACHE[cacheKey]) return SEARCH_CACHE[cacheKey];

    try {
       
        const url = `${HOST}/vodsearch/${encodeURIComponent(wd)}----------${pg}---.html`;
        const res = await request(url, HOST + '/');
        const html = toHtml(res);
        const list = parseVodList(html);
        const pc = maxPage(html, ['-(\\d+)---\\.html']);
        const result = JSON.stringify({
            page: pg,
            pagecount: Math.max(pc, list.length > 0 ? pg : pg),
            limit: 20,
            total: list.length > 0 ? (pc || pg) * 20 : 0,
            list: list
        });
        SEARCH_CACHE[cacheKey] = result;
        return result;
    } catch (e) {
        return JSON.stringify({ page: pg, pagecount: 0, limit: 20, total: 0, list: [] });
    }
}


async function play(flag, id, flags) {
    const playPageUrl = `${HOST}/vodplay/${id}.html`;
    try {
        const res = await request(playPageUrl, HOST + '/');
        const html = toHtml(res);

        const raw = extractPlayerJson(html);
        if (!raw) {
            return JSON.stringify({ parse: 1, url: playPageUrl, header: { 'User-Agent': UA } });
        }

        let player;
        try {
            player = JSON.parse(raw);
        } catch (e) {
            return JSON.stringify({ parse: 1, url: playPageUrl, header: { 'User-Agent': UA } });
        }

        const realUrl = decryptUrl(player.encrypt, player.url || '');
        if (!realUrl) {
            return JSON.stringify({ parse: 1, url: playPageUrl, header: { 'User-Agent': UA } });
        }

        
        if (isMedia(realUrl)) {
            return JSON.stringify({
                parse: 0,
                url: realUrl,
                header: { 'User-Agent': UA }
            });
        }

        
        const from = player.from || '';
        let parseBase = PLAYER_LIST[from] || DEFAULT_PARSE;
        const parseUrl = parseBase + encodeURIComponent(realUrl);

        return JSON.stringify({
            parse: 1,
            url: parseUrl,
            header: { 'User-Agent': UA, 'Referer': HOST + '/' }
        });

    } catch (e) {
        return JSON.stringify({ parse: 1, url: playPageUrl, header: { 'User-Agent': UA } });
    }
}

export function __jsEvalReturn() {
    return { init, home, homeVod, category, detail, search, play };
}
