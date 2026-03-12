"use client";

import { useState, useEffect, useRef } from 'react';
import { TAMA_DATA, COLOR_PALETTES, JADE_EXCLUSIVE, NON_BREEDABLE_EYES, RGBColor } from '../data/simulatorData';

const tamaNames = Object.keys(TAMA_DATA);
// 並び順を明確なグラデーション（赤→オレンジ→黄→黄緑→緑→青緑→水色→青→藍→紫→薄紫→ピンク→モノクロ）に固定
const colorNames = [
    'red', 'orange', 'yellow', 'light_yellow', 'light_green', 'green',
    'teal', 'sky_blue', 'blue', 'indigo', 'purple', 'lavender',
    'pink', 'light_pink', 'white', 'gray'
];
// breedableEyes are tamas not in NON_BREEDABLE_EYES
const eyeNames = tamaNames.filter(name => !NON_BREEDABLE_EYES.includes(name));

// Helper: compare colors (with small tolerance if needed, but exact match is usually fine for pixel art)
const isColorMatch = (c1: Uint8ClampedArray, offset: number, c2: RGBColor) => {
    // Canvasに描画・再取得した際の色空間変換や圧縮アーティファクトでRGB値が意図せずズレることがあるため
    // 許容誤差を大きめに取る（各チャンネル±40程度の差異は同一色とみなす）
    const tol = 40;
    return Math.abs(c1[offset] - c2[0]) <= tol &&
        Math.abs(c1[offset + 1] - c2[1]) <= tol &&
        Math.abs(c1[offset + 2] - c2[2]) <= tol;
    // alpha値は無視する
};

// 選択肢のアイコンを正しく（目＋構成）合成表示するコンポーネント
const CombinedIcon = ({ name }: { name: string }) => {
    const [iconUrl, setIconUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let isRendered = true;
        const renderIcon = async () => {
            if (!canvasRef.current) return;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load ${src}`));
                img.src = src;
            });

            try {
                // 1. 体の画像をロード
                const baseImg = await loadImage(`/simulator/character/${name}.png`);
                canvas.width = baseImg.width || 64;
                canvas.height = baseImg.height || 64;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(baseImg, 0, 0);

                // 2. 目の画像をロード＆位置合わせして合成
                const tamaConfig = TAMA_DATA[name];
                if (tamaConfig) {
                    const eyePosX = tamaConfig.eyePosition[0];
                    const eyePosY = tamaConfig.eyePosition[1] + tamaConfig.adjustments;

                    const eyeImg = await loadImage(`/simulator/eyes/${name}.png`);

                    // マスク処理（あれば）
                    let useMask = false;
                    let maskImg: HTMLImageElement | null = null;
                    try {
                        maskImg = await loadImage(`/simulator/mask/${name}.png`);
                        useMask = true;
                    } catch (e) { /* no mask */ }

                    if (useMask && maskImg) {
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = eyeImg.width;
                        tempCanvas.height = eyeImg.height;
                        const tempCtx = tempCanvas.getContext('2d');
                        if (tempCtx) {
                            tempCtx.drawImage(eyeImg, 0, 0);
                            tempCtx.globalCompositeOperation = 'destination-out';
                            tempCtx.drawImage(maskImg, eyePosX, eyePosY, eyeImg.width, eyeImg.height, 0, 0, eyeImg.width, eyeImg.height);
                            ctx.drawImage(tempCanvas, eyePosX, eyePosY);
                        } else {
                            ctx.drawImage(eyeImg, eyePosX, eyePosY);
                        }
                    } else {
                        ctx.drawImage(eyeImg, eyePosX, eyePosY);
                    }
                }

                if (isRendered) {
                    setIconUrl(canvas.toDataURL());
                }
            } catch (e) {
                // エラー時はフォールバックとして体だけの画像を使う
                if (isRendered) setIconUrl(`/simulator/character/${name}.png`);
            }
        };

        renderIcon();
        return () => { isRendered = false; };
    }, [name]);

    return (
        <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {iconUrl ? (
                <img src={iconUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
                <div style={{ fontSize: '10px' }}>Loading...</div>
            )}
        </div>
    );
};

interface SimulatorProps {
    minimalMode?: boolean;
    onComplete?: (data: { name: string; imageUrl: string }) => void;
}

export default function Simulator({ minimalMode = false, onComplete }: SimulatorProps) {
    // Checkbox states (for filters)
    const [excludeJadeExclusive, setExcludeJadeExclusive] = useState(false);
    const [worldTab, setWorldTab] = useState<'all' | 'land' | 'sea' | 'sky' | 'forest'>(minimalMode ? 'land' : 'all');

    // Filtered lists
    // NON_BREEDABLE（ベビー・キッズ・ヤング）を除外した eyeNames を使うことでアダルト期限定にする
    let availableTamas = eyeNames;
    let availableEyes = eyeNames;

    if (excludeJadeExclusive) {
        availableTamas = availableTamas.filter(name => !JADE_EXCLUSIVE.includes(name));
        availableEyes = availableEyes.filter(name => !JADE_EXCLUSIVE.includes(name));
    }

    // 進化リストのアダルト期キャラクターの並び順（りく→うみ→そら→もりの順）
    // ※ TAMA_DATAの実際のキー名に合わせる
    const ADULT_ORDER = [
        // りく (Land) - 17体
        "meowtchi", "pochitchi", "gumax", "ratchi",
        "mametchi", "mimitchi", "molmotchi", "sheeptchi",
        "leopatchi", "sebiretchi", "elizardotchi", "heavytchi",
        "furawatchi", "potsunentchi", "tustustchi", "shigemi-san",
        "chodracotchi",
        // みず (Water) - 17体
        "irukatchi", "kametchi", "kujiratchi", "uruotchi",
        "axolopatchi", "imoritchi", "kawazutchi", "beavertchi",
        "tachutchi", "sharktchi", "ankotchi", "otototchi",
        "kuraratchi", "mendakotchi", "amefuratchi", "gusokutchi",
        "mermarintchi",
        // そら (Sky) - 17体
        "horhotchi", "mongatchi", "eagletchi", "batchi",
        "peacotchi", "batatchi", "kuchipatchi", "kiwitchi",
        "papillotchi", "kabutotchi", "tentotchi", "hatchitchi",
        "gemtchi", "oretatchi", "ishikorotchi", "magmatchi",
        "yayacorntchi",
        // もり (Forest) - 17体
        "foresthorhotchi", "konkotchi", "tigaotchi", "tanoontchi",
        "lessapantchi", "kanokotchi", "suigyutchi", "panbootchi",
        "kachitchi", "tokipatchi", "kuchipatchi", "sparrotchi",
        "shiitaketchi", "peatchi", "nappatchi", "rushraditchi",
        "tatsutchi"
    ];

    const sortByName = (a: string, b: string) => {
        const idxA = ADULT_ORDER.indexOf(a);
        const idxB = ADULT_ORDER.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    };
    availableTamas.sort(sortByName);
    availableEyes.sort(sortByName);

    // TAMA_DATAのキー名 → フィールドの直接マッピング（複数フィールド対応）
    const FIELD_MAP: Record<string, string[]> = {};
    // りく (Land) - 17体
    ["meowtchi","pochitchi","gumax","ratchi","mametchi","mimitchi","molmotchi","sheeptchi",
     "leopatchi","sebiretchi","elizardotchi","heavytchi","furawatchi","potsunentchi",
     "tustustchi","shigemi-san","chodracotchi"].forEach(n => { FIELD_MAP[n] = [...(FIELD_MAP[n]||[]), 'land']; });
    // みず (Water) - 17体
    ["irukatchi","kametchi","kujiratchi","uruotchi","axolopatchi","imoritchi","kawazutchi",
     "beavertchi","tachutchi","sharktchi","ankotchi","otototchi","kuraratchi","mendakotchi",
     "amefuratchi","gusokutchi","mermarintchi"].forEach(n => { FIELD_MAP[n] = [...(FIELD_MAP[n]||[]), 'sea']; });
    // そら (Sky) - 17体
    ["horhotchi","mongatchi","eagletchi","batchi","peacotchi","batatchi","kuchipatchi","kiwitchi",
     "papillotchi","kabutotchi","tentotchi","hatchitchi","gemtchi","oretatchi","ishikorotchi",
     "magmatchi","yayacorntchi"].forEach(n => { FIELD_MAP[n] = [...(FIELD_MAP[n]||[]), 'sky']; });
    // もり (Forest) - 17体
    ["foresthorhotchi","konkotchi","tigaotchi","tanoontchi","lessapantchi","kanokotchi","suigyutchi",
     "panbootchi","kachitchi","tokipatchi","kuchipatchi","sparrotchi","shiitaketchi","peatchi",
     "nappatchi","rushraditchi","tatsutchi"].forEach(n => { FIELD_MAP[n] = [...(FIELD_MAP[n]||[]), 'forest']; });

    const getWorld = (name: string): string[] => {
        return FIELD_MAP[name] || [];
    };

    if (worldTab !== 'all') {
        availableTamas = availableTamas.filter(name => getWorld(name).includes(worldTab));
        availableEyes = availableEyes.filter(name => getWorld(name).includes(worldTab));
    }

    const [selectedBase, setSelectedBase] = useState(availableTamas[0]);
    const [selectedEye, setSelectedEye] = useState(availableEyes[0]);
    const [selectedColor, setSelectedColor] = useState('blue');
    const [activeTab, setActiveTab] = useState<'base' | 'eye'>('base');

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Randomize handlers
    const randomizeAll = () => {
        setSelectedBase(availableTamas[Math.floor(Math.random() * availableTamas.length)]);
        setSelectedEye(availableEyes[Math.floor(Math.random() * availableEyes.length)]);
        setSelectedColor(colorNames[Math.floor(Math.random() * colorNames.length)]);
    };

    // 描画ロジック
    useEffect(() => {
        let isRendered = true;

        const renderTamagotchi = async () => {
            if (!canvasRef.current || !selectedBase || !selectedEye || !selectedColor) return;
            setLoading(true);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            // Load images function
            const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load ${src}`));
                img.src = src;
            });

            try {
                // 1. Load Base Image
                const baseImg = await loadImage(`/simulator/character/${selectedBase}.png`);
                canvas.width = baseImg.width || 64;
                canvas.height = baseImg.height || 64;

                // Draw base
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(baseImg, 0, 0);

                // 2. Color Swap Logic
                const tamaConfig = TAMA_DATA[selectedBase];
                if (!tamaConfig) throw new Error("Tamagotchi config not found");

                const basePaletteName = tamaConfig.baseColor;
                const basePalette = COLOR_PALETTES[basePaletteName] || [];
                const targetPalette = COLOR_PALETTES[selectedColor] || [];

                // COLOR_PALETTESはオブジェクト形式 ({ "0": [...], "1": [...] })であるため、.length は存在しない。
                // よって undefined > 0 が false となり丸ごとスキップされていたのが原因。
                if (basePaletteName !== selectedColor && basePalette && targetPalette) {
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imgData.data;

                    const whiteCount = [0, 0, 0, 0, 0, 0];
                    let maxwhite = 0;
                    let maxwhiteindex = 0;

                    let replacedCount = 0;

                    for (let i = 0; i < data.length; i += 4) {
                        // 透明ピクセル（Alpha=0）はスキップ
                        if (data[i + 3] === 0) continue;

                        for (let x = 0; x < 6; x++) {
                            if (basePalette[x] && isColorMatch(data, i, basePalette[x])) {
                                data[i] = targetPalette[x][0];
                                data[i + 1] = targetPalette[x][1];
                                data[i + 2] = targetPalette[x][2];
                                data[i + 3] = targetPalette[x][3] !== undefined ? targetPalette[x][3] : 255; // ターゲットにアルファが設定されていれば使う、無ければ255（不透明）
                                whiteCount[x]++;
                                replacedCount++;

                                if (whiteCount[x] > maxwhite) {
                                    maxwhite = whiteCount[x];
                                    maxwhiteindex = x;
                                }
                                break;
                            }
                        }
                    }

                    // デバッグ：最初の10個のユニークな有効ピクセル（非透明）の色を出力
                    if (replacedCount === 0 && imgData.data.length > 0) {
                        const uniqueColors = new Set<string>();
                        for (let j = 0; j < data.length; j += 4) {
                            if (data[j + 3] > 0) {
                                uniqueColors.add(`${data[j]},${data[j + 1]},${data[j + 2]}`);
                                if (uniqueColors.size >= 10) break;
                            }
                        }
                        console.warn(`[DEBUG] 置換失敗 - パレット=${basePaletteName}`,
                            `期待される色: ${Object.values(basePalette).map(c => `[${c[0]},${c[1]},${c[2]}]`).join(', ')}`,
                            `Canvas上の実際のピクセル(一部):`, Array.from(uniqueColors));
                    }

                    console.log(`カラー置換: ${selectedBase}(${basePaletteName}) -> ${selectedColor} | 置換ピクセル数: ${replacedCount}`);

                    // Python original specific hotfix for white palette
                    if (selectedColor === 'white') {
                        for (let i = 0; i < data.length; i += 4) {
                            if (isColorMatch(data, i, targetPalette[maxwhiteindex])) {
                                data[i] = targetPalette[1][0];
                                data[i + 1] = targetPalette[1][1];
                                data[i + 2] = targetPalette[1][2];
                            } else if (targetPalette[maxwhiteindex + 1] && isColorMatch(data, i, targetPalette[maxwhiteindex + 1])) {
                                data[i] = targetPalette[2][0];
                                data[i + 1] = targetPalette[2][1];
                                data[i + 2] = targetPalette[2][2];
                            }
                        }
                    }

                    ctx.putImageData(imgData, 0, 0);
                }

                // 3. Load & Draw Eye Image
                const eyeConfig = TAMA_DATA[selectedEye];
                const adjustments = eyeConfig ? eyeConfig.adjustments : 0;
                let eyePosX = tamaConfig.eyePosition[0];
                let eyePosY = tamaConfig.eyePosition[1] + adjustments;

                const eyeImg = await loadImage(`/simulator/eyes/${selectedEye}.png`);

                // check if mask exists
                let useMask = false;
                let maskImg: HTMLImageElement | null = null;
                try {
                    maskImg = await loadImage(`/simulator/mask/${selectedBase}.png`);
                    useMask = true;
                } catch (e) { /* no mask */ }

                if (useMask && maskImg) {
                    // Create temp canvas for the eye masked
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = eyeImg.width;
                    tempCanvas.height = eyeImg.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    if (tempCtx) {
                        // draw eye first
                        tempCtx.drawImage(eyeImg, 0, 0);
                        // mask it out: where mask is opaque, erase eye.
                        // equivalent to destination-out with the cropped mask
                        tempCtx.globalCompositeOperation = 'destination-out';
                        tempCtx.drawImage(maskImg, eyePosX, eyePosY, eyeImg.width, eyeImg.height, 0, 0, eyeImg.width, eyeImg.height);

                        // draw composed eye to main canvas
                        ctx.drawImage(tempCanvas, eyePosX, eyePosY);
                    } else {
                        ctx.drawImage(eyeImg, eyePosX, eyePosY);
                    }
                } else {
                    ctx.drawImage(eyeImg, eyePosX, eyePosY);
                }

                // convert to data URL for react state
                if (isRendered) {
                    setPreviewUrl(canvas.toDataURL());
                    setLoading(false);
                }

            } catch (e) {
                console.error("Rendering error", e);
                if (isRendered) setLoading(false);
            }
        };

        renderTamagotchi();

        return () => { isRendered = false; };
    }, [selectedBase, selectedEye, selectedColor]);

    return (
        <div className="y2k-container" style={{ marginTop: '20px', padding: minimalMode ? '15px' : '30px', maxWidth: minimalMode ? '100%' : '800px' }}>
            {!minimalMode && (
                <h2 className="y2k-title" style={{ fontSize: '2.5rem' }}>
                    遺伝シミュレーター
                </h2>
            )}
            {minimalMode && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', marginBottom: '10px', flexWrap: 'nowrap' }}>
                    <h2 className="y2k-title" style={{ fontSize: '1.2rem', margin: 0, whiteSpace: 'nowrap' }}>
                        キャラカスタム
                    </h2>
                    <button 
                        className="y2k-button" 
                        style={{ padding: '4px 14px', backgroundColor: 'var(--primary-color)', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', margin: 0, border: '2px solid var(--border-color)', borderRadius: '8px', whiteSpace: 'nowrap' }}
                        onClick={() => {
                            if (onComplete && previewUrl) {
                                onComplete({ name: `${selectedColor} ${selectedBase} / ${selectedEye}目`, imageUrl: previewUrl });
                            }
                        }}
                    >
                        ✓ 完成
                    </button>
                </div>
            )}

            <div style={{ display: 'none' }}>
                <canvas ref={canvasRef}></canvas>
            </div>

            <div className="simulator-container" style={{ flexDirection: minimalMode ? 'column-reverse' : 'row' }}>

                {/* コントロールパネル */}
                <div className="y2k-window simulator-controls" style={minimalMode ? { flex: '1 1 auto', width: '100%', maxWidth: '100%' } : {}}>
                    {!minimalMode && <div className="y2k-window-header">コントロールパネル</div>}
                    <div className="y2k-window-body" style={{ padding: minimalMode ? '10px' : '15px' }}>

                        {/* チェックボックス類 */}
                        {!minimalMode && (
                            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <input type="checkbox" checked={excludeJadeExclusive} onChange={e => setExcludeJadeExclusive(e.target.checked)} />
                                    Jade Forest限定を除外
                                </label>
                            </div>
                        )}

                        {!minimalMode && (
                            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                                <button className="y2k-button" onClick={randomizeAll} style={{ padding: '5px 10px', fontSize: '0.9rem' }}>🎲 全てランダム</button>
                            </div>
                        )}

                        {/* フィールド絞り込みタブ */}
                        <div style={{ marginBottom: '10px', display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '5px' }}>
                            {(minimalMode ? ['land', 'sea', 'sky', 'forest'] as const : ['all', 'land', 'sea', 'sky', 'forest'] as const).map(tab => {
                                const labels = { all: 'すべて', land: 'りく', sea: 'うみ', sky: 'そら', forest: 'もり' };
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setWorldTab(tab)}
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            border: `2px solid ${worldTab === tab ? 'var(--primary-color)' : '#ccc'}`,
                                            background: worldTab === tab ? 'var(--primary-color)' : '#fff',
                                            color: worldTab === tab ? '#fff' : '#666',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {labels[tab]}
                                    </button>
                                );
                            })}
                        </div>

                        {/* タブ切り替え式のキャラ・目選択リスト */}
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <button
                                    className="y2k-button"
                                    onClick={() => setActiveTab('base')}
                                    style={{
                                        flex: 1,
                                        backgroundColor: activeTab === 'base' ? 'var(--primary-color)' : '#fff',
                                        color: activeTab === 'base' ? '#fff' : '#000',
                                        border: '2px solid var(--primary-color)',
                                        padding: '5px'
                                    }}
                                >
                                    👤 ベースを選ぶ
                                </button>
                                <button
                                    className="y2k-button"
                                    onClick={() => setActiveTab('eye')}
                                    style={{
                                        flex: 1,
                                        backgroundColor: activeTab === 'eye' ? 'var(--secondary-color)' : '#fff',
                                        color: activeTab === 'eye' ? '#fff' : '#000',
                                        border: '2px solid var(--secondary-color)',
                                        padding: '5px'
                                    }}
                                >
                                    👀 目を選ぶ
                                </button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <h3 style={{ fontSize: '1rem', margin: 0, fontFamily: 'var(--font-retro)' }}>
                                    {activeTab === 'base' ? 'ベースキャラ (Tamagotchi)' : '目の形 (Eyes)'}
                                </h3>
                                {!minimalMode && (
                                    <button
                                        className="y2k-button"
                                        onClick={() => {
                                            if (activeTab === 'base') setSelectedBase(availableTamas[Math.floor(Math.random() * availableTamas.length)]);
                                            else setSelectedEye(availableEyes[Math.floor(Math.random() * availableEyes.length)]);
                                        }}
                                        style={{ padding: '2px 8px' }}
                                    >
                                        🎲
                                    </button>
                                )}
                            </div>
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '5px',
                                maxHeight: minimalMode ? '160px' : '350px', overflowY: 'auto', padding: '5px', border: '2px solid #ccc', borderRadius: '5px', backgroundColor: '#fff'
                            }}>
                                {availableTamas.length === 0 && <div style={{ padding: '10px', fontSize: '0.8rem', color: '#888' }}>該当なし</div>}
                                {(activeTab === 'base' ? availableTamas : availableEyes).map(opt => {
                                    const isSelected = activeTab === 'base' ? selectedBase === opt : selectedEye === opt;
                                    const selectColor = activeTab === 'base' ? 'var(--primary-color)' : 'var(--secondary-color)';
                                    const bgColor = activeTab === 'base' ? '#fdf6e3' : '#f5e6d3';

                                    // 現在もう片方のタブで選ばれているキャラかどうか
                                    const isOtherSelected = activeTab === 'base' ? selectedEye === opt : selectedBase === opt;

                                    return (
                                        <div
                                            key={opt}
                                            onClick={() => {
                                                if (activeTab === 'base') {
                                                    setSelectedBase(opt);
                                                } else {
                                                    setSelectedEye(opt);
                                                }
                                            }}
                                            style={{
                                                border: isSelected ? `3px solid ${selectColor}` : (isOtherSelected ? '2px dashed #bda798' : '2px solid transparent'),
                                                borderRadius: '5px', padding: '2px', cursor: 'pointer',
                                                backgroundColor: isSelected ? bgColor : 'transparent',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                position: 'relative'
                                            }}
                                            title={opt}
                                        >
                                            {/* Canvasで組み立てたCombinedIconを呼び出す */}
                                            <CombinedIcon name={opt} />

                                            {/* 選択済みバッジ */}
                                            {isSelected && (
                                                <div style={{
                                                    position: 'absolute', top: '-5px', right: '-5px',
                                                    backgroundColor: selectColor, color: '#fff',
                                                    borderRadius: '50%', width: '18px', height: '18px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '12px', fontWeight: 'bold'
                                                }}>✓</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ marginBottom: minimalMode ? '5px' : '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <h3 style={{ fontSize: '1rem', margin: 0, fontFamily: 'var(--font-retro)' }}>色 (Color)</h3>
                                {!minimalMode && (
                                    <button className="y2k-button" onClick={() => setSelectedColor(colorNames[Math.floor(Math.random() * colorNames.length)])} style={{ padding: '2px 8px' }}>🎲</button>
                                )}
                            </div>
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '8px',
                                padding: '10px', border: '2px solid #ccc', borderRadius: '5px', backgroundColor: '#fff'
                            }}>
                                {colorNames.map(opt => {
                                    // pythonのカラー置換パレットでメインの体色（もっとも面積が広い色）に相当することが多い要素（インデックス2など）を選択
                                    // 実際のキャラクターにもっとも近い色をバッジにするため [1] を使用
                                    const repPalette = COLOR_PALETTES[opt]?.[1];
                                    const colorStr = repPalette ? `rgba(${repPalette[0]}, ${repPalette[1]}, ${repPalette[2]}, ${(repPalette[3] !== undefined ? repPalette[3] : 255) / 255})` : '#ccc';

                                    return (
                                        <div
                                            key={opt}
                                            onClick={() => setSelectedColor(opt)}
                                            style={{
                                                width: '35px',
                                                height: '35px',
                                                borderRadius: '50%',
                                                backgroundColor: colorStr,
                                                border: selectedColor === opt ? '3px solid #000' : '1px solid #999',
                                                boxShadow: selectedColor === opt ? '0 0 5px rgba(0,0,0,0.5)' : 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto',
                                                position: 'relative' // for outline
                                            }}
                                            title={opt}
                                        >
                                            {selectedColor === opt && (
                                                <div style={{
                                                    width: '12px', height: '12px', borderRadius: '50%',
                                                    backgroundColor: '#fff', border: '2px solid #000'
                                                }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>

                {/* プレビュー画面 */}
                <div className="y2k-window simulator-preview" style={{ 
                    marginBottom: minimalMode ? '10px' : '20px',
                    ...(minimalMode ? { position: 'relative', top: 'auto', flex: '1 1 auto', width: '100%', maxWidth: '100%' } : {})
                }}>
                    {!minimalMode && <div className="y2k-window-header" style={{ background: 'var(--primary-color)', color: '#fffaf0' }}>[ プレビュー ]</div>}
                    <div className="y2k-window-body" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: minimalMode ? '200px' : '280px',
                        padding: minimalMode ? '10px' : '15px',
                        backgroundColor: '#f5e6d3',
                        backgroundImage: 'repeating-linear-gradient(45deg, #eaddc5 25%, transparent 25%, transparent 75%, #eaddc5 75%, #eaddc5), repeating-linear-gradient(45deg, #eaddc5 25%, #f5e6d3 25%, #f5e6d3 75%, #eaddc5 75%, #eaddc5)',
                        backgroundPosition: '0 0, 10px 10px',
                        backgroundSize: '20px 20px',
                    }}>
                        {loading && <div style={{ marginBottom: '10px', fontFamily: 'var(--font-retro)' }}>ロード中...</div>}

                        {previewUrl && (
                            <div style={{
                                width: '160px',
                                height: '160px',
                                backgroundColor: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // CSS pixels scale pixel-art appropriately
                                imageRendering: 'pixelated'
                            }}>
                                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                        )}

                        <div style={{
                            marginTop: '20px',
                            backgroundColor: '#3b2f2f',
                            color: '#eaddc5',
                            padding: '10px',
                            fontFamily: 'var(--font-retro)',
                            width: '100%',
                            textAlign: 'center',
                            border: '2px solid var(--border-color)',
                            fontSize: '0.8rem',
                            wordBreak: 'break-all'
                        }}>
                            構成:<br />{selectedColor} {selectedBase} / {selectedEye} 目
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
