/**
 * ColorTune - Color Palette Generator logic (ver.2_修正2)
 */

// --- 1. Data Definitions ---

const HUES = [
    { id: '5r', label: 'Red', defaultHex: '#E53935', baseHue: 3 },
    { id: '5yr', label: 'Orange', defaultHex: '#F57C00', baseHue: 30, altHues: [36] },
    { id: '5y', label: 'Yellow', defaultHex: '#FBC02D', baseHue: 48, altHues: [54] },
    { id: '5gy', label: 'Yellow-Green', defaultHex: '#9CCC65', baseHue: 85, altHues: [65] },
    { id: '5g', label: 'Green', defaultHex: '#43A047', baseHue: 130 },
    { id: '5bg', label: 'Turquoise', defaultHex: '#00897B', baseHue: 174 },
    { id: '5b', label: 'Blue', defaultHex: '#1E88E5', baseHue: 208, altHues: [199] },
    { id: '5pb', label: 'Indigo', defaultHex: '#3949AB', baseHue: 232 },
    { id: '5p', label: 'Purple', defaultHex: '#8E24AA', baseHue: 285 },
    { id: '5rp', label: 'Pink', defaultHex: '#EC407A', baseHue: 340, altHues: [335] }
];

const THEMES = [
    {
        id: 'elegant', label: '上品', enName: 'Elegant', desc: '落ち着き、洗練、控えめ',
        tags: ['洗練', '大人', 'フォーマル'],
        rules: { l: { min: 55, max: 75 }, s: { min: 25, max: 45 } }
    },
    {
        id: 'gentle', label: 'やさしい', enName: 'Soft', desc: 'ふんわり、安心感、軽やか',
        tags: ['ふかふか', 'リラックス', '子供'],
        rules: { l: { min: 75, max: 90 }, s: { min: 25, max: 40 } }
    },
    {
        id: 'energetic', label: '元気', enName: 'Energetic', desc: '活発、明快、親しみ',
        tags: ['明るい', 'ポジティブ', '子供向け'],
        rules: { l: { min: 55, max: 75 }, s: { min: 75, max: 95 } }
    },
    {
        id: 'trust', label: '信頼感', enName: 'Trustworthy', desc: '誠実、安定、知的',
        tags: ['ビジネス', '真面目', 'クリーン'],
        rules: { l: { min: 45, max: 65 }, s: { min: 35, max: 55 } }
    },
    {
        id: 'luxury', label: '高級感', enName: 'Luxurious', desc: '深み、格調、静けさ',
        tags: ['プレミアム', 'リッチ', '特別'],
        rules: { l: { min: 28, max: 48 }, s: { min: 20, max: 40 } }
    },
    {
        id: 'natural', label: 'ナチュラル', enName: 'Natural', desc: '自然、素朴、穏やか',
        tags: ['オーガニック', 'エコ', '温もり'],
        rules: { l: { min: 45, max: 70 }, s: { min: 30, max: 50 } }
    }
];

const CARD_THEME_CONFIGS = {
    elegant: {
        jaHeadingFont: "'Shippori Mincho', serif",
        jaBodyFont: "'Shippori Mincho', serif",
        enHeadingFont: "'Playfair Display', serif",
        buttonFont: "'Noto Sans JP', sans-serif",
        lsHeading: "0.02em",
        lsEyebrow: "0.03em",
        lsBody: "0.01em"
    },
    gentle: {
        jaHeadingFont: "'Zen Maru Gothic', sans-serif",
        jaBodyFont: "'Zen Maru Gothic', sans-serif",
        enHeadingFont: "'Quicksand', sans-serif",
        buttonFont: "'Noto Sans JP', sans-serif",
        lsHeading: "0.04em",
        lsEyebrow: "0.05em",
        lsBody: "0.02em"
    },
    energetic: {
        jaHeadingFont: "'M PLUS Rounded 1c', sans-serif", 
        jaBodyFont: "'M PLUS Rounded 1c', sans-serif",
        enHeadingFont: "'Poppins', sans-serif",
        buttonFont: "'Noto Sans JP', sans-serif",
        lsHeading: "0.04em",
        lsEyebrow: "0.05em",
        lsBody: "0.02em"
    },
    trust: {
        jaHeadingFont: "'BIZ UDPGothic', sans-serif",
        jaBodyFont: "'BIZ UDPGothic', sans-serif",
        enHeadingFont: "'Roboto', sans-serif",
        buttonFont: "'Noto Sans JP', sans-serif",
        lsHeading: "0.03em",
        lsEyebrow: "0.04em",
        lsBody: "0.02em"
    },
    luxury: {
        jaHeadingFont: "'Noto Serif JP', serif",
        jaBodyFont: "'Noto Serif JP', serif",
        enHeadingFont: "'Cormorant Garamond', serif",
        buttonFont: "'Noto Sans JP', sans-serif",
        lsHeading: "0.02em",
        lsEyebrow: "0.03em",
        lsBody: "0.01em"
    },
    natural: {
        jaHeadingFont: "'Zen Kurenaido', sans-serif",
        jaBodyFont: "'Sawarabi Gothic', sans-serif",
        enHeadingFont: "'Lora', serif",
        buttonFont: "'Noto Sans JP', sans-serif",
        lsHeading: "0.03em",
        lsEyebrow: "0.04em",
        lsBody: "0.02em"
    }
};

const CARD_TEXTS = {
    layout: "center",
    eyebrow: "Color combinations<br>shape the impression.",
    heading: "色の組み合わせで、<br>印象は大きく変わる。",
    body: "配色のバランスやコントラストによって、伝わるイメージは大きく変化します。目的に合った色選びが、デザインの質を高めます。",
    button: "Color Balance"
};

const loadedFonts = new Set();
const loadWebFont = (fontFamilyString) => {
    if (!fontFamilyString) return;
    const match = fontFamilyString.match(/['"]?([^'",]+)['"]?,/);
    let fontName = match ? match[1].trim() : fontFamilyString.split(',')[0].replace(/['"]/g, '').trim();
    
    if (!fontName || fontName.toLowerCase() === 'sans-serif' || fontName.toLowerCase() === 'serif' || fontName.toLowerCase() === 'monospace') return;
    if (loadedFonts.has(fontName)) return;
    loadedFonts.add(fontName);
    
    const fontId = `wf-` + fontName.replace(/\s+/g, '-').toLowerCase();
    if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}&display=swap`;
        document.head.appendChild(link);
    }
};

let state = {
    selectedHue: null,
    selectedTheme: null,
    accentMode: 0, // 0: Complementary, 1: ±1 step, 2: ±2 steps
    selectedPaletteType: 'unified',
    currentPalettes: {
        unified: [],
        contrastEasy: [],
        contrastUnique: []
    }
};

// --- 3. Color generation utilities ---

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

const getLuminance = (hex) => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;
    let a = [r, g, b].map(function (v) {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const hexToHslObj = (hex) => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const getBestTextColor = (bgHex, themeId = null) => {
    const bgLum = getLuminance(bgHex);
    const whiteLum = 1.0;
    const darkLum = getLuminance('#1e293b');
    
    const contrastWhite = (whiteLum + 0.05) / (bgLum + 0.05);
    const contrastDark = (bgLum + 0.05) / (darkLum + 0.05);
    
    // 背景色の彩度・明度を調べる
    const hsl = hexToHslObj(bgHex);
    // 視覚的に「強い色（ビビッド）」の判定：彩度が高く、明度が中程度〜やや低め
    const isVivid = hsl.s >= 50 && hsl.l >= 25 && hsl.l <= 65;
    
    // 白文字を優先して採用するためのWCAG倍率ボーナス
    let preferWhiteBonus = 1.0;
    
    // ビビッドカラーなら白を少し優先
    if (isVivid) {
        preferWhiteBonus = 1.2;
    }
    
    // 特に「元気」テーマでの白文字強化
    if (themeId === 'energetic') {
        preferWhiteBonus = isVivid ? 1.6 : 1.3;
    }
    
    if (contrastWhite * preferWhiteBonus >= contrastDark) {
        return '#ffffff';
    }
    
    return contrastWhite >= contrastDark ? '#ffffff' : '#1e293b';
};

const getBaseHue = (hueObj) => {
    if (hueObj.altHues && hueObj.altHues.length > 0 && Math.random() < 0.7) {
        return hueObj.altHues[Math.floor(Math.random() * hueObj.altHues.length)];
    }
    return hueObj.baseHue;
};

/**
 * 簡易版Neon Scoreの判定ロジック
 * @returns {number} Score from 0 to 3. >= 2 indicates strong neon/vibrant characteristics.
 */
const calculateNeonScore = (h, s, l) => {
    let score = 0;
    // 彩度が高い
    if (s >= 85) score++;
    // 中〜高明度
    if (l >= 55 && l <= 75) score++;
    
    // Hue がネオン寄り: 黄(~60), 黄緑(~90), シアン(~180), ピンク(~320)
    if ((h >= 45 && h <= 75) || (h >= 80 && h <= 140) || (h >= 160 && h <= 200) || (h >= 300 && h <= 350)) {
        score++;
    }
    return score;
};

/**
 * 修正2: モードに応じたアクセント色相の取得
 */
const getAccentHueByMode = (hueId, mode) => {
    const currentIndex = HUES.findIndex(h => h.id === hueId);
    let shift = 5; // 初期値：補色 (mode 0)

    if (mode === 1) {
        // 補色 ±1 ステップ
        shift = Math.random() > 0.5 ? 4 : 6;
    } else if (mode === 2) {
        // 補色 ±2 ステップ
        shift = Math.random() > 0.5 ? 3 : 7;
    }

    const targetIndex = (currentIndex + shift) % 10;
    return getBaseHue(HUES[targetIndex]);
};

// --- 4. Main Generation Logic ---

const generateUnifiedPalette = (hueObj, themeObj) => {
    const rules = themeObj.rules;
    let baseH = getBaseHue(hueObj);
    
    let baseL = random(rules.l.min, rules.l.max);
    let baseS = random(rules.s.min, rules.s.max);
    
    // 5YR (黄赤) 専用の特例補正（茶色化の排除・オレンジらしさの強化）
    if (hueObj.id === '5yr') {
        if (themeObj.id === 'gentle') {
            baseS = clamp(baseS + 15, 65, 95);
            baseL = clamp(baseL + 10, 80, 95);
        } else if (themeObj.id === 'energetic') {
            // 元気テーマのときは#F57C00(H30,S100,L48)に近い明快なオレンジをベースにする
            baseH = random(28, 33);
            baseS = random(95, 100);
            baseL = random(46, 52);
        } else {
            baseS = clamp(baseS + 10, 45, 90);
        }
        // 全テーマ共通で泥色(茶色)を防ぐ
        if (baseL < 42) baseL = 42;
    }

    // 5Y (黄色) 専用の特例補正（黄土色の排除・黄色らしさの強化）
    if (hueObj.id === '5y') {
        if (themeObj.id === 'gentle') {
            baseS = clamp(baseS + 20, 70, 95);
            baseL = clamp(baseL, 65, 75);
        } else if (themeObj.id === 'energetic') {
            // 元気テーマのときは#FBC02D(H48,S96,L58)に近い明快なイエローをベースにする
            baseH = random(45, 51);
            baseS = random(90, 100);
            baseL = random(55, 62);
        } else if (themeObj.id === 'luxury') {
            // 高級感は明度を下げすぎると泥色になるため、真鍮・ダークゴールドを狙う
            baseS = clamp(baseS + 10, 40, 70);
            if (baseL < 45) baseL = 45; 
        } else {
            baseS = clamp(baseS + 15, 55, 95);
        }
        // 高級感以外で明度が下がりすぎてオリーブ色・黄土色になるのを防ぐ
        if (themeObj.id !== 'luxury' && baseL < 50) baseL = 50;
    }

    // 5GY (黄緑) 専用の特例補正（カーキ色・濁りの排除）
    if (hueObj.id === '5gy') {
        if (themeObj.id === 'gentle') {
            baseS = clamp(baseS + 15, 60, 85);
            baseL = clamp(baseL + 5, 75, 85);
        } else if (themeObj.id === 'energetic') {
            // 元気テーマのときは#9CCC65(H88,S50,L60)に近いイエローグリーンを強く残す
            baseH = random(86, 90);
            baseS = random(50, 60);
            baseL = random(58, 64);
        } else if (themeObj.id === 'luxury') {
            baseS = clamp(baseS + 5, 40, 65);
            if (baseL < 40) baseL = 40; // 濁りを避けつつ上質な抹茶色
        } else {
            baseS = clamp(baseS + 10, 50, 85);
        }
        if (themeObj.id !== 'luxury' && baseL < 55) baseL = 55;
    }

    // 5G (緑) 専用の特例補正
    if (hueObj.id === '5g') {
        if (themeObj.id === 'energetic') {
            // 元気テーマのときは#43A047(H123,S41,L45)に近い鮮やかな緑を残す
            baseH = random(121, 126);
            baseS = random(40, 50);
            baseL = random(42, 48);
        }
    }

    // 5BG (青緑) 専用の特例補正
    if (hueObj.id === '5bg') {
        if (themeObj.id === 'energetic') {
            // 元気テーマのときは#00897B(H174,S100,L27)の明快なターコイズを強く残す
            baseH = random(172, 176);
            baseS = random(95, 100);
            baseL = random(25, 32);
        }
    }

    // 5B (青) 専用の特例補正（重すぎるネイビー化の排除）
    if (hueObj.id === '5b') {
        if (themeObj.id === 'gentle') {
            baseS = clamp(baseS + 10, 60, 85);
            baseL = clamp(baseL + 10, 70, 85);
        } else if (themeObj.id === 'energetic') {
            baseS = clamp(baseS + 15, 75, 95);
            baseL = clamp(baseL + 10, 60, 80);
        } else if (themeObj.id === 'luxury') {
            baseS = clamp(baseS + 5, 40, 65);
            if (baseL < 30) baseL = 30; // 真っ黒に近いネイビーを防止、上品なダークブルーへ
        } else {
            baseS = clamp(baseS + 5, 50, 80);
        }
        if (themeObj.id !== 'luxury' && baseL < 45) baseL = 45; // 信頼感や上品などでも沈みすぎを防止
    }

    // 5RP (ピンク) 専用の特例補正（紫化・くすみ・過度な子供っぽさの排除）
    if (hueObj.id === '5rp') {
        if (themeObj.id === 'gentle') {
            baseS = clamp(baseS, 50, 75); // パステル寄りに
            baseL = clamp(baseL + 10, 75, 85);
        } else if (themeObj.id === 'energetic') {
            baseS = clamp(baseS + 10, 70, 90); // 強烈なネオン・子供っぽさを防ぐため上限90
            baseL = clamp(baseL + 5, 60, 75);
        } else if (themeObj.id === 'luxury') {
            baseS = clamp(baseS - 10, 30, 50); // 上品なくすみローズ・モーヴ
            if (baseL < 40) baseL = 40; // 濁って紫にならないように
        } else {
            baseS = clamp(baseS - 5, 45, 70);
        }
        if (themeObj.id !== 'luxury' && baseL < 50) baseL = 50; 
    }
    
    // ネオンカラーの抑制処理 (統一型および全テーマのベースに対するネオン防止)
    // ただし、特定色×元気 は鮮やかさを保つためネオン防止をスキップ
    const skipNeonGuard = ['5y', '5yr', '5gy', '5g', '5bg'].includes(hueObj.id) && themeObj.id === 'energetic';
    if (!skipNeonGuard && calculateNeonScore(baseH, baseS, baseL) >= 2) {
        baseS = clamp(baseS - 15, 15, 70);
    }
    
    let bgL = themeObj.id === 'luxury' ? clamp(baseL - 10, 10, 25) : clamp(baseL + 30, 90, 98);
    // 背景の彩度を少し上げて選んだ色の印象を強める
    let bgS = clamp(baseS - 15, 10, 25);
    let subL = themeObj.id === 'luxury' ? clamp(bgL + 10, 20, 35) : clamp(bgL - 5, 80, 93);
    // サブカラーも同系統の彩度を少し持たせる
    let subS = clamp(bgS + 10, 15, 35);
    let mainL = baseL;
    let mainS = baseS;
    let accL = clamp(mainL - 15, 10, 50);
    let accS = clamp(mainS + 15, 30, 90);
    let txtL = themeObj.id === 'luxury' ? 90 : clamp(mainL - 40, 5, 20);
    let txtS = clamp(mainS - 10, 5, 20);

    // 5Y (黄色) の「A. 統一型」アクセント色特例補正
    if (hueObj.id === '5y') {
        if (themeObj.id === 'energetic') {
            accL = mainL;
            accS = clamp(mainS + 5, 85, 100);
        } else if (themeObj.id === 'gentle') {
            accL = clamp(mainL + 5, 60, 80);
            accS = clamp(mainS, 70, 95);
        } else {
            accL = clamp(mainL - 10, 45, 75);
            accS = clamp(mainS + 10, 60, 95);
        }
    }

    // 5GY (黄緑) の「A. 統一型」アクセント色特例補正
    if (hueObj.id === '5gy') {
        if (themeObj.id === 'energetic') {
            accL = clamp(mainL, 65, 80);
            accS = clamp(mainS + 5, 75, 95);
        } else if (themeObj.id === 'gentle') {
            accL = clamp(mainL + 5, 70, 85);
            accS = clamp(mainS, 65, 85);
        } else {
            accL = clamp(mainL - 10, 45, 65);
            accS = clamp(mainS + 10, 55, 85);
        }
    }

    // 5B (青) の「A. 統一型」アクセント色特例補正
    if (hueObj.id === '5b') {
        if (themeObj.id === 'energetic') {
            accL = clamp(mainL, 55, 75);
            accS = clamp(mainS + 5, 75, 95);
        } else if (themeObj.id === 'gentle') {
            accL = clamp(mainL + 5, 65, 85);
            accS = clamp(mainS, 65, 85);
        } else {
            accL = clamp(mainL - 10, 40, 65);
            accS = clamp(mainS + 5, 55, 85);
        }
    }

    // 5RP (ピンク) の「A. 統一型」アクセント色特例補正
    if (hueObj.id === '5rp') {
        if (themeObj.id === 'energetic') {
            accL = clamp(mainL, 55, 70); 
            accS = clamp(mainS + 5, 75, 90);
        } else if (themeObj.id === 'gentle') {
            accL = clamp(mainL + 5, 70, 85);
            accS = clamp(mainS, 55, 75);
        } else {
            accL = clamp(mainL - 10, 45, 65); 
            accS = clamp(mainS + 5, 50, 75);
        }
    }

    // ネオン防止（A:統一型のアクセント等がネオンになった場合）
    // 5Y, 5GY, 5B, 5RP の「元気」「やさしい」のアクセント色においては本来の発色を優先しネオン判定を免除
    const avoidNeonGuard = (['5y', '5gy', '5b', '5rp'].includes(hueObj.id)) && (themeObj.id === 'energetic' || themeObj.id === 'gentle');
    if (!avoidNeonGuard) {
        if (calculateNeonScore(baseH, accS, accL) >= 2) {
            accS = clamp(accS - 15, 20, 60);
        }
    }

    return [
        { role: '背景', hex: hslToHex(baseH, bgS, bgL), textDark: bgL > 60 },
        { role: 'サブ', hex: hslToHex(baseH, subS, subL), textDark: subL > 60 },
        { role: 'メイン', hex: hslToHex(baseH, mainS, mainL), textDark: mainL > 60 },
        { role: 'アクセント', hex: hslToHex(baseH, accS, accL), textDark: accL > 60 },
        { role: '文字', hex: hslToHex(baseH, txtS, txtL), textDark: txtL > 60 }
    ];
};

/**
 * 共通のコントラスト型ベース生成ロジック
 */
const generateContrastPaletteBase = (hueObj, themeObj, unifiedColors, mode = 'easy') => {
    const rules = themeObj.rules;
    
    const bg = {...unifiedColors[0]};
    const sub = {...unifiedColors[1]};
    const main = {...unifiedColors[2]};
    const txt = {...unifiedColors[4]};
    
    // 修正2：accentMode に基づいて色相を選択
    const accH = getAccentHueByMode(hueObj.id, state.accentMode);
    
    let accL = random(rules.l.min, rules.l.max);
    let accS = random(rules.s.min, rules.s.max);
    
    // 個性的なテーマ（元気など）の場合は彩度を高めにするベース調整
    if (themeObj.id === 'energetic') {
        accS = clamp(accS + 10, 80, 100);
    }
    
    const neonScore = calculateNeonScore(accH, accS, accL);
    
    if (mode === 'easy') {
        // ネオンスコアが高い色は避ける、もしくは調整する
        if (neonScore >= 2) {
            accS = clamp(accS - random(20, 35), 10, 60); // くすませる
            accL = clamp(accL - random(5, 15), 20, 50);  // 明度を下げる
        }
    } else if (mode === 'unique') {
        // 個性的：ネオン寄りの色も採用可、むしろ強める
        if (themeObj.id === 'energetic' && neonScore < 2) {
            accS = clamp(accS + 20, 85, 100);
        }
    }
    
    const acc = { 
        role: 'アクセント', 
        hex: hslToHex(accH, accS, accL), 
        textDark: accL > 60 
    };
    
    return [bg, sub, main, acc, txt];
};

// --- 5. UI Rendering & Interaction ---

const sectionHue = document.getElementById('step-hue');
const sectionTheme = document.getElementById('step-theme');
const sectionResult = document.getElementById('step-result');
const hueGrid = document.getElementById('hue-grid');
const themeGrid = document.getElementById('theme-grid');
const paletteUnified = document.getElementById('palette-unified');
const paletteContrastEasy = document.getElementById('palette-contrast-easy');
const paletteContrastUnique = document.getElementById('palette-contrast-unique');
const toast = document.getElementById('toast');

const renderHues = () => {
    hueGrid.innerHTML = '';
    HUES.forEach(hue => {
        const item = document.createElement('div');
        item.className = 'hue-item';
        item.innerHTML = `
            <div class="hue-color-circle" style="background-color: ${hue.defaultHex}"></div>
            <div class="hue-name">${hue.label}</div>
            <div class="hue-hex">${hue.defaultHex}</div>
        `;
        item.addEventListener('click', () => {
            state.selectedHue = hue;
            goToStep(2);
        });
        hueGrid.appendChild(item);
    });
};

const renderThemes = () => {
    themeGrid.innerHTML = '';
    THEMES.forEach(theme => {
        const item = document.createElement('div');
        item.className = 'theme-item';
        let tagsHtml = theme.tags.map(t => `<span class="theme-tag">${t}</span>`).join('');
        
        item.innerHTML = `
            <div class="theme-name">${theme.label}</div>
            <div class="theme-en">${theme.enName}</div>
            <div class="theme-desc">${theme.desc}</div>
            <div class="theme-tags">${tagsHtml}</div>
        `;
        item.addEventListener('click', () => {
            state.selectedTheme = theme;
            state.accentMode = 0; // 修正2：モード初期化
            state.selectedPaletteType = 'unified';
            generateAndShowResults();
            goToStep(3);
        });
        themeGrid.appendChild(item);
    });
};

window.handleColorCopy = (element, hex) => {
    copyToClipboard(hex);
    const indicator = element.querySelector('.copy-indicator');
    if (indicator) {
        indicator.classList.add('show');
        setTimeout(() => indicator.classList.remove('show'), 800);
    }
};

const renderPalettes = () => {
    state.currentPalettes.unified = generateUnifiedPalette(state.selectedHue, state.selectedTheme);
    state.currentPalettes.contrastEasy = generateContrastPaletteBase(state.selectedHue, state.selectedTheme, state.currentPalettes.unified, 'easy');
    state.currentPalettes.contrastUnique = generateContrastPaletteBase(state.selectedHue, state.selectedTheme, state.currentPalettes.unified, 'unique');
    
    const createColorBlock = (color) => {
        return `
            <div class="color-block" style="background-color: ${color.hex}" onclick="window.handleColorCopy(this, '${color.hex}')">
                <div class="color-info" style="color: ${color.textDark ? '#1e293b' : '#ffffff'};">
                    <div class="color-role">${color.role}</div>
                    <div class="color-hex">${color.hex}</div>
                </div>
                <div class="copy-indicator" style="color: ${color.textDark ? '#1e293b' : '#ffffff'};">COPY</div>
            </div>
        `;
    };

    paletteUnified.innerHTML = state.currentPalettes.unified.map(createColorBlock).join('');
    paletteContrastEasy.innerHTML = state.currentPalettes.contrastEasy.map(createColorBlock).join('');
    paletteContrastUnique.innerHTML = state.currentPalettes.contrastUnique.map(createColorBlock).join('');
    
    document.getElementById('meta-hue').innerText = state.selectedHue.label;
    document.getElementById('meta-theme').innerText = state.selectedTheme.label;
    
    updatePreview();
};

const updatePreview = () => {
    document.querySelectorAll('.palette-card.selectable').forEach(card => card.classList.remove('active-palette'));
    const activeCard = document.querySelector(`.palette-card[data-palette-type="${state.selectedPaletteType}"]`);
    if (activeCard) activeCard.classList.add('active-palette');
    
    const colors = state.currentPalettes[state.selectedPaletteType];
    if (!colors || colors.length !== 5) return;
    
    const [bg, sub, main, acc, txt] = colors;
    
    const mockupContainer = document.getElementById('mockup-container');
    const mockupHero = document.getElementById('mockup-hero');
    const mockupEyebrow = document.getElementById('mockup-eyebrow');
    const mockupBody = document.getElementById('mockup-body');
    const mockupTitle = document.getElementById('mockup-title');
    const mockupText = document.getElementById('mockup-text');
    const mockupBtn = document.getElementById('mockup-btn');
    const mockupChips = document.getElementById('mockup-chips');
    const mockupFontNames = document.getElementById('mockup-font-names');
    const mockupFooter = document.getElementById('mockup-footer');
    
    mockupContainer.style.backgroundColor = bg.hex;
    
    if (mockupHero) {
        mockupHero.style.backgroundColor = main.hex;
        const currentThemeId = state.selectedTheme ? state.selectedTheme.id : null;
        const heroTextColor = getBestTextColor(main.hex, currentThemeId);
        mockupTitle.style.color = heroTextColor;
        if (mockupEyebrow) {
            mockupEyebrow.style.color = heroTextColor;
            mockupEyebrow.style.opacity = '0.8';
        }
    }
    
    mockupText.style.color = String(txt.hex) + 'e6'; // 90% opacity
    
    mockupBtn.style.backgroundColor = acc.hex;
    mockupBtn.style.color = acc.textDark ? '#1e293b' : '#ffffff';
    
    if (mockupFooter) {
        mockupFooter.style.borderColor = (bg.hex.toLowerCase() === '#ffffff') || bg.textDark ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.15)';
    }
    
    // Apply texts from config
    const currentThemeId = state.selectedTheme ? state.selectedTheme.id : 'trust';
    const config = CARD_THEME_CONFIGS[currentThemeId] || CARD_THEME_CONFIGS['trust'];

    if (mockupEyebrow) mockupEyebrow.innerHTML = CARD_TEXTS.eyebrow;
    if (mockupTitle) mockupTitle.innerHTML = CARD_TEXTS.heading;
    if (mockupText) mockupText.innerText = CARD_TEXTS.body;
    if (mockupBtn) mockupBtn.innerText = CARD_TEXTS.button;
    
    // Apply layout from config
    if (mockupBody) mockupBody.style.textAlign = CARD_TEXTS.layout;
    
    // Load and Apply fonts
    [config.jaHeadingFont, config.jaBodyFont, config.enHeadingFont].forEach(loadWebFont);
    if (mockupEyebrow) mockupEyebrow.style.fontFamily = config.enHeadingFont || '';
    if (mockupTitle) mockupTitle.style.fontFamily = config.jaHeadingFont || '';
    if (mockupText) mockupText.style.fontFamily = config.jaBodyFont || '';
    if (mockupBtn) mockupBtn.style.fontFamily = config.enHeadingFont || '';
    
    // Apply Letter Spacing dynamically
    if (mockupTitle) mockupTitle.style.letterSpacing = config.lsHeading || '0.03em';
    if (mockupEyebrow) mockupEyebrow.style.letterSpacing = config.lsEyebrow || '0.06em';
    if (mockupText) mockupText.style.letterSpacing = config.lsBody || '0.015em';
    
    // Extract clean font name for footer display
    const getCleanFontName = (str) => {
        if (!str) return '';
        const match = str.match(/['"]?([^'",]+)['"]?,/);
        return match ? match[1] : str.split(',')[0].replace(/['"]/g, '').trim();
    };
    
    if (mockupFontNames) {
        mockupFontNames.innerHTML = `<span class="font-name-ja">${getCleanFontName(config.jaHeadingFont)}</span><span class="font-name-separator"> / </span><span class="font-name-en">${getCleanFontName(config.enHeadingFont)}</span>`;
        mockupFontNames.style.color = txt.hex;
    }
    
    mockupChips.innerHTML = colors.map(c => `<div class="mockup-chip" style="background-color: ${c.hex}; border: 1px solid rgba(0,0,0,0.05)"></div>`).join('');
    
    const detailsList = document.getElementById('details-list');
    detailsList.innerHTML = colors.map(c => `
        <div class="detail-item">
            <div class="detail-color-box" style="background-color: ${c.hex}"></div>
            <div class="detail-info">
                <div class="detail-role">${c.role}</div>
                <div class="detail-hex">${c.hex}</div>
            </div>
            <div style="font-size: 0.8rem; color: ${c.textDark ? '#1e293b' : '#ffffff'}; background: ${c.hex}; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 600;">
                Aa
            </div>
        </div>
    `).join('');
};

const setupPreviewListeners = () => {
    document.querySelectorAll('.palette-card.selectable').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.color-block')) return;
            state.selectedPaletteType = card.dataset.paletteType;
            updatePreview();
        });
    });
    
    const tabBtns = document.querySelectorAll('.preview-tab-btn');
    const tabContents = document.querySelectorAll('.preview-tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
    
    document.getElementById('btn-download-card').addEventListener('click', async () => {
        const mockupContainer = document.getElementById('mockup-container');
        const btn = document.getElementById('btn-download-card');
        
        const originalContent = btn.innerHTML;
        btn.innerText = '画像を生成中...';
        btn.disabled = true;

        try {
            if (document.fonts) await document.fonts.ready;
            
            const canvas = await html2canvas(mockupContainer, {
                scale: 2,
                backgroundColor: null,
                useCORS: true
            });
            
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            
            const themeId = state.selectedTheme ? state.selectedTheme.id : 'export';
            const paletteType = state.selectedPaletteType || 'unified';
            link.download = `colortune-sample-${themeId}-${paletteType}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("PNG export failed:", err);
            alert("画像の保存に失敗しました。");
        } finally {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    });

    init();
};

const goToStep = (step) => {
    sectionHue.classList.remove('active');
    sectionTheme.classList.remove('active');
    sectionResult.classList.remove('active');
    
    setTimeout(() => {
        sectionHue.classList.add('hidden');
        sectionTheme.classList.add('hidden');
        sectionResult.classList.add('hidden');
        
        if (step === 1) {
            sectionHue.classList.remove('hidden');
            setTimeout(() => sectionHue.classList.add('active'), 50);
        } else if (step === 2) {
            sectionTheme.classList.remove('hidden');
            setTimeout(() => sectionTheme.classList.add('active'), 50);
        } else if (step === 3) {
            sectionResult.classList.remove('hidden');
            setTimeout(() => sectionResult.classList.add('active'), 50);
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
};

const generateAndShowResults = () => renderPalettes();

const copyToClipboard = async (hex) => {
    try {
        await navigator.clipboard.writeText(hex);
        showToast(` ${hex} をコピーしました！`);
    } catch (err) {
        const el = document.createElement('textarea');
        el.value = hex;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast(` ${hex} をコピーしました！`);
    }
};

let toastTimeout;
const showToast = (message) => {
    toast.innerText = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
};

// 修正2：再生成サイクル
const btnRegenerate = document.getElementById('btn-regenerate');
if (btnRegenerate) {
    btnRegenerate.addEventListener('click', () => {
        state.accentMode = (state.accentMode + 1) % 3;
        generateAndShowResults();
    });
}

document.getElementById('btn-retheme').addEventListener('click', () => { 
    state.selectedTheme = null; 
    state.accentMode = 0;
    goToStep(2); 
});

document.getElementById('btn-restart').addEventListener('click', () => { 
    state.selectedHue = null; 
    state.selectedTheme = null; 
    state.accentMode = 0; // 修正2：モード初期化
    goToStep(1); 
});

document.getElementById('back-to-hue').addEventListener('click', () => { 
    state.selectedHue = null; 
    state.accentMode = 0; // 修正2：モード初期化
    goToStep(1); 
});

document.getElementById('back-to-theme').addEventListener('click', () => { 
    state.selectedTheme = null; 
    state.accentMode = 0; // 修正2：モード初期化
    goToStep(2); 
});

// Boot app
renderHues();
renderThemes();
setupPreviewListeners();
