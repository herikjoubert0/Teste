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
        script: '/main_free.js'
    },
    flow: {
        name: 'Google Flow',
        patterns: ['flow.google'],
        matchAll: false,
        script: '/flow_free.js'
    },
    meta: {
        name: 'Meta AI',
        patterns: ['meta.ai'],
        matchAll: false,
        script: '/meta_free.js'
    },
    grok: {
        name: 'Grok',
        patterns: ['grok.com'],
        matchAll: false,
        script: '/grok_free.js'
    },
    lmnt: {
        name: 'LMNT',
        patterns: ['lmnt.com', 'app.lmnt.com'],
        matchAll: false,
        script: '/lmnt_free.js'
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
        console.log('[Criadores Dark Free] CSP Bypass ativado');
    } catch (e) {
        console.error('[Criadores Dark Free] Erro CSP:', e);
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
            script.onload = () => { cleanup(); resolve({ success: true, method: 'blob' }); };
            script.onerror = () => { cleanup(); resolve({ success: false, error: 'csp_blocked' }); };
            (document.head || document.documentElement).appendChild(script);
        } catch (e) {
            resolve({ success: false, error: e.message });
        }
    });
}

// =====================================================
// FUNÇÃO PRINCIPAL
// =====================================================
async function processTab(tabId, platform, isRetry = false) {
    const config = PLATFORMS[platform];
    console.log(`[Criadores Dark Free] Processando: ${config.name}${isRetry ? ' (retry)' : ''}`);

    try {
        // Busca script público (sem autenticação)
        const url = `${SCRIPT_BASE_URL}${config.script}?v=${Date.now()}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.log(`[Criadores Dark Free] Script ${platform} não disponível (${response.status})`);
            return;
        }

        const code = await response.text();
        if (!code || code.length < 50) {
            console.log(`[Criadores Dark Free] Script ${platform} vazio ou inválido`);
            return;
        }

        console.log(`[Criadores Dark Free] Script carregado (${code.length} bytes)`);

        // Injeta via Blob URL no MAIN world
        const results = await chrome.scripting.executeScript({
            target: { tabId },
            world: "MAIN",
            func: injectViaBlobURL,
            args: [code]
        });

        const result = results[0]?.result;

        if (result?.success) {
            console.log(`[Criadores Dark Free] ✅ Sucesso via ${result.method}`);
            return;
        }

        // Se falhou e não é retry, ativa CSP bypass e recarrega
        if (!isRetry && result?.error === 'csp_blocked') {
            console.log('[Criadores Dark Free] Blob URL bloqueado, ativando CSP bypass...');
            await enableCSPBypass();
            await chrome.tabs.reload(tabId);
            await chrome.storage.local.set({ [`cspBypass_${tabId}`]: true });
            return;
        }

        console.log(`[Criadores Dark Free] Erro na injeção:`, result?.error);

    } catch (e) {
        console.error('[Criadores Dark Free] Erro:', e);
    }
}

// =====================================================
// LISTENERS
// =====================================================
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const platform = detectPlatform(tab.url);

        if (platform) {
            console.log(`[Criadores Dark Free] ${platform} detectado`);

            const { [`cspBypass_${tabId}`]: isRetry } = await chrome.storage.local.get([`cspBypass_${tabId}`]);
            if (isRetry) await chrome.storage.local.remove([`cspBypass_${tabId}`]);

            setTimeout(() => {
                processTab(tabId, platform, isRetry).catch(e => {
                    console.error('[Criadores Dark Free] Erro:', e);
                });
            }, 1500);
        }
    }
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('[Criadores Dark Free] Extensão v1.0 instalada');
});

console.log('[Criadores Dark Free] Service Worker v1.0 iniciado');

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
