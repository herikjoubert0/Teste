/**
 * Criadores Dark - Background Service Worker (Inscritos)
 * Versão 1.0 - Sem login, scripts públicos
 *
 * PLATAFORMAS VISÍVEIS: Whisk, Flow
 * PLATAFORMAS SILENCIOSAS: Meta, Grok, LMNT (preparadas para futuro)
 */

const SCRIPT_BASE_URL = 'https://fixa.tech/a_dark';

const PLATFORMS = {
    whisk: {
        name: 'Google Whisk',
        patterns: ['labs.google', 'whisk'],
        matchAll: true,
        scripts: ['/main_free.js', '/main.js']
    },
    flow: {
        name: 'Google Flow',
        patterns: ['flow.google'],
        matchAll: false,
        scripts: ['/flow_free.js', '/flow.js']
    },
    meta: {
        name: 'Meta AI',
        patterns: ['meta.ai'],
        matchAll: false,
        scripts: ['/meta_free.js', '/meta.js']
    },
    grok: {
        name: 'Grok',
        patterns: ['grok.com'],
        matchAll: false,
        scripts: ['/grok_free.js', '/grok.js']
    },
    lmnt: {
        name: 'LMNT',
        patterns: ['lmnt.com', 'app.lmnt.com'],
        matchAll: false,
        scripts: ['/lmnt_free.js', '/lmnt.js']
    }
};

// =====================================================
// REGRAS PARA REMOVER CSP (só ativadas se necessário)
// =====================================================
const CSP_RULES = [
    { id: 1, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://meta.ai/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 2, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://*.meta.ai/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 3, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://labs.google/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 4, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://grok.com/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 5, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://*.grok.com/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 6, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://lmnt.com/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 7, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://*.lmnt.com/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 8, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://flow.google/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 9, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://*.flow.google/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 10, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://flow.google.com/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 11, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://*.flow.google.com/*", resourceTypes: ["main_frame", "sub_frame"] } },
    { id: 12, priority: 1, action: { type: "modifyHeaders", responseHeaders: [{ header: "content-security-policy", operation: "remove" }, { header: "content-security-policy-report-only", operation: "remove" }] }, condition: { urlFilter: "*://labs.google.com/*", resourceTypes: ["main_frame", "sub_frame"] } }
];

let cspBypassEnabled = false;

async function enableCSPBypass() {
    if (cspBypassEnabled) return;
    try {
        const ruleIds = CSP_RULES.map(r => r.id);
        await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIds, addRules: CSP_RULES });
        cspBypassEnabled = true;
        console.log('[Darkcista] CSP Bypass ativado');
    } catch (e) {
        console.error('[Darkcista] Erro CSP:', e);
    }
}

// =====================================================
// DETECÇÃO DE PLATAFORMA
// =====================================================
function detectPlatform(url) {
    if (!url) return null;
    const urlLower = url.toLowerCase();
    for (const [key, config] of Object.entries(PLATFORMS)) {
        if (config.matchAll) {
            if (config.patterns.every(p => urlLower.includes(p))) return key;
        } else {
            if (config.patterns.some(p => urlLower.includes(p))) return key;
        }
    }
    return null;
}

// =====================================================
// INJEÇÃO VIA BLOB URL
// =====================================================
function injectViaBlobURL(code) {
    return new Promise((resolve) => {
        try {
            const blob = new Blob([code], { type: 'application/javascript' });
            const blobUrl = URL.createObjectURL(blob);
            const script = document.createElement('script');
            script.src = blobUrl;
            const timeout = setTimeout(() => { cleanup(); resolve({ success: false, error: 'timeout' }); }, 5000);
            function cleanup() { clearTimeout(timeout); URL.revokeObjectURL(blobUrl); script.remove(); }
            script.onload = () => { window.__CD_LOADED__ = true; cleanup(); resolve({ success: true, method: 'blob' }); };
            script.onerror = () => { cleanup(); resolve({ success: false, error: 'csp_blocked' }); };
            (document.head || document.documentElement).appendChild(script);
        } catch (e) {
            resolve({ success: false, error: e.message });
        }
    });
}

// Marcador deixado na página quando o script já foi injetado neste documento
function readMarker() {
    return !!window.__CD_LOADED__;
}

async function alreadyInjected(tabId) {
    try {
        const r = await chrome.scripting.executeScript({ target: { tabId }, world: 'MAIN', func: readMarker });
        return r[0]?.result === true;
    } catch (e) {
        return false;
    }
}

async function setBadge(tabId, text, color) {
    try {
        await chrome.action.setBadgeText({ tabId, text });
        await chrome.action.setBadgeBackgroundColor({ tabId, color });
    } catch (e) { /* aba fechada */ }
}

// Busca o script da plataforma, tentando os nomes alternativos em ordem
async function fetchPlatformScript(config) {
    const tentativas = [];
    for (const path of config.scripts) {
        const url = `${SCRIPT_BASE_URL}${path}?v=${Date.now()}`;
        try {
            const response = await fetch(url);
            if (!response.ok) { tentativas.push(`${path} → HTTP ${response.status}`); continue; }
            const code = await response.text();
            if (!code || code.length < 50) { tentativas.push(`${path} → vazio (${code.length} bytes)`); continue; }
            return { code, path };
        } catch (e) {
            tentativas.push(`${path} → ${e.message}`);
        }
    }
    console.log(`[Darkcista] RESULTADO: ❌ nenhum script disponível no servidor — ${tentativas.join(' | ')}`);
    return null;
}

// =====================================================
// FUNÇÃO PRINCIPAL
// =====================================================
async function processTab(tabId, platform, opts = {}) {
    const { isRetry = false, force = false } = opts;
    const config = PLATFORMS[platform];
    console.log(`[Darkcista] Processando: ${config.name}${isRetry ? ' (retry pós-CSP)' : ''}${force ? ' (ativação manual)' : ''}`);

    try {
        if (!force && await alreadyInjected(tabId)) {
            console.log('[Darkcista] Script já carregado nesta página, ignorando.');
            return;
        }

        const found = await fetchPlatformScript(config);
        if (!found) {
            await setBadge(tabId, 'ERR', '#c62828');
            return;
        }

        console.log(`[Darkcista] Script ${found.path} baixado (${found.code.length} bytes)`);

        // Injeta via Blob URL no MAIN world
        const results = await chrome.scripting.executeScript({
            target: { tabId },
            world: "MAIN",
            func: injectViaBlobURL,
            args: [found.code]
        });

        const result = results[0]?.result;

        if (result?.success) {
            console.log(`[Darkcista] RESULTADO: ✅ ${found.path} injetado com sucesso via ${result.method}`);
            await setBadge(tabId, 'ON', '#2e7d32');
            return;
        }

        // Se falhou e não é retry, ativa CSP bypass e recarrega
        if (!isRetry && result?.error === 'csp_blocked') {
            console.log('[Darkcista] Blob URL bloqueado pela CSP, ativando bypass e recarregando...');
            await enableCSPBypass();
            await chrome.storage.local.set({ [`cspBypass_${tabId}`]: true });
            await chrome.tabs.reload(tabId);
            return;
        }

        console.log(`[Darkcista] RESULTADO: ❌ falha na injeção — ${result?.error}`);
        await setBadge(tabId, 'ERR', '#c62828');

    } catch (e) {
        console.error('[Darkcista] RESULTADO: ❌ erro:', e);
        await setBadge(tabId, 'ERR', '#c62828');
    }
}

// =====================================================
// LISTENERS
// =====================================================
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const platform = detectPlatform(tab.url);

        if (platform) {
            console.log(`[Darkcista] ${platform} detectado em ${tab.url}`);

            const { [`cspBypass_${tabId}`]: isRetry } = await chrome.storage.local.get([`cspBypass_${tabId}`]);
            if (isRetry) await chrome.storage.local.remove([`cspBypass_${tabId}`]);

            setTimeout(() => {
                processTab(tabId, platform, { isRetry }).catch(e => {
                    console.error('[Darkcista] Erro:', e);
                });
            }, 1500);
        }
    }
});

// O Flow troca de tela sem recarregar a página (history API), então
// a navegação interna do site também precisa disparar a injeção.
const NAV_FILTER = {
    url: [
        { hostSuffix: 'flow.google' },
        { hostSuffix: 'flow.google.com' },
        { hostSuffix: 'labs.google' },
        { hostSuffix: 'labs.google.com' }
    ]
};

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.frameId !== 0) return;
    const platform = detectPlatform(details.url);
    if (!platform) return;
    setTimeout(() => {
        processTab(details.tabId, platform).catch(() => {});
    }, 1200);
}, NAV_FILTER);

// Clique no ícone da extensão = forçar ativação na aba atual
chrome.action.onClicked.addListener(async (tab) => {
    if (!tab || !tab.id || !tab.url) return;
    const platform = detectPlatform(tab.url);
    if (!platform) {
        console.log(`[Darkcista] Página não suportada: ${tab.url}`);
        await setBadge(tab.id, '?', '#f9a825');
        return;
    }
    console.log('[Darkcista] Ativação manual solicitada pelo usuário...');
    await processTab(tab.id, platform, { force: true });
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('[Darkcista] Extensão instalada');
});

console.log('[Darkcista] Service Worker iniciado');

// =====================================================
// DOWNLOAD ROBUSTO COM FILA  (correcao Darkcista)
// =====================================================
const CD_FOLDER = 'Darkcista';
let cdQueue = [];
let cdBusy = false;
function cdSanitize(n){ if(!n) return ''; n=String(n).split(/[\\/]/).pop(); return n.replace(/[<>:"|?*\x00-\x1F]/g,'_').trim(); }
function cdExt(u){ const m=/\.(jpe?g|png|gif|webp|bmp|svg|mp4|webm)(?:$|\?)/i.exec(u||''); return m?m[1].toLowerCase():''; }
function cdOne(job){ return new Promise((res)=>{ let fn=cdSanitize(job.filename); if(!fn){ fn=`img_${Date.now()}_${Math.floor(Math.random()*1e4)}.${cdExt(job.url)||'png'}`; } if(!/\.[a-z0-9]{2,4}$/i.test(fn)){ fn+='.'+(cdExt(job.url)||'png'); } try{ chrome.downloads.download({url:job.url,filename:`${CD_FOLDER}/${fn}`,saveAs:false,conflictAction:'uniquify'},()=>{ void chrome.runtime.lastError; res(); }); }catch(e){ res(); } }); }
async function cdProcess(){ if(cdBusy) return; cdBusy=true; while(cdQueue.length){ await cdOne(cdQueue.shift()); await new Promise(r=>setTimeout(r,400)); } cdBusy=false; }
chrome.runtime.onMessage.addListener((msg,s,sr)=>{ if(msg&&msg.type==='CD_DOWNLOAD'&&msg.url){ cdQueue.push({url:msg.url,filename:msg.filename||''}); cdProcess(); sr({queued:true}); return true; } });
console.log('[Darkcista] Modulo de download robusto ativo');
