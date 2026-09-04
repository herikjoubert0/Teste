# 🚀 Darkcista - Loader Multi-Plataforma

Esta é a extensão de carregamento que busca automaticamente a versão mais recente da automação.

**Suporta:** Google Whisk e Meta AI  
**Usa `world: "MAIN"` para bypassar CSP - funciona 100%!**

## 📦 Instalação

1. **Instale a extensão no Chrome**:
   - Abra `chrome://extensions/`
   - Ative o **"Modo do desenvolvedor"** (canto superior direito)
   - Clique em **"Carregar sem compactação"**
   - Selecione esta pasta

2. **Pronto!** Agora é só acessar o Whisk ou Meta AI.

## 🎯 Como Funciona

### Google Whisk
1. Acesse o [Google Whisk](https://labs.google/fx/pt/tools/whisk/)
2. A extensão detecta automaticamente e carrega `main.js` do servidor
3. A interface do Darkcista aparece na lateral direita

### Meta AI
1. Acesse o [Meta AI](https://www.meta.ai/)
2. A extensão detecta automaticamente e carrega `meta.js` do servidor
3. A interface do Darkcista aparece automaticamente

## ✨ Vantagens

- ✅ **Multi-plataforma**: Funciona no Whisk e Meta AI
- ✅ **Sempre atualizado**: Busca a última versão do servidor automaticamente
- ✅ **Sem reinstalação**: Você nunca precisa atualizar esta extensão
- ✅ **Bypassa CSP**: Usa técnica `world: "MAIN"` que funciona em qualquer site
- ✅ **Automático**: Carrega sozinho quando você acessa as plataformas

## 📁 Estrutura

```
criadores-dark-loader/
├── manifest.json    # Configuração da extensão
├── background.js    # Service Worker (busca e injeta código)
├── README.md        # Este arquivo
└── icons/           # Pasta de ícones
    ├── 16.png
    ├── 48.png
    └── 128.png
```

## 🔧 Configuração do Servidor

Os códigos principais são carregados de:
```
Google Whisk: https://fixa.tech/a_dark/main.js
Meta AI:      https://fixa.tech/a_dark/meta.js
```

Se precisar mudar as URLs, edite o objeto `REMOTE_URLS` no arquivo `background.js`.

## 🐛 Debug

Para ver os logs do background script:
1. Vá em `chrome://extensions/`
2. Encontre "Darkcista - Automação IA"
3. Clique em **"Service Worker"** (link azul)
4. Abre o DevTools do background - veja os logs no Console

---

**Versão**: 1.1.0  
**Desenvolvido por**: Darkcista
