"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importStar(require("axios"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.send('翻訳サーバーが起動しています。/translate にPOSTしてください。');
});
app.post('/translate', async (req, res) => {
    console.log('--- /translate が呼び出されました (req.body):', req.body);
    try {
        const { text, source, target } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'text is required' });
        }
        const sourceLang = source || 'en';
        const targetLang = target || 'ja';
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
        console.log('外部APIを呼び出します:', apiUrl);
        const apiResponse = await axios_1.default.get(apiUrl);
        console.log('外部APIからの応答 (apiResponse.data):', apiResponse.data);
        if (apiResponse.data && apiResponse.data.responseStatus === 200) {
            const translatedText = apiResponse.data.responseData?.translatedText;
            if (translatedText) {
                console.log('翻訳成功:', translatedText);
                res.json({
                    original: text,
                    translated: translatedText,
                    source: sourceLang,
                    target: targetLang,
                });
            }
            else {
                throw new Error('MyMemory API responseData.translatedText not found');
            }
        }
        else {
            throw new Error(`MyMemory API error: ${apiResponse.data?.responseDetails || 'Unknown error'}`);
        }
    }
    catch (error) {
        console.error('--- 翻訳エラー (catchブロック) ---');
        if ((0, axios_1.isAxiosError)(error)) {
            console.error('Axios Error Code:', error.code);
            console.error('Axios Error Message:', error.message);
        }
        else if (error instanceof Error) {
            console.error('Generic Error Message:', error.message);
        }
        else {
            console.error('Unknown Error:', error);
        }
        res.status(500).json({ error: '翻訳処理中にエラーが発生しました' });
    }
});
app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});
