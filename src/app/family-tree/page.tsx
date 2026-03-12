"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import { LAND_DATA, SEA_DATA, SKY_DATA, FOREST_DATA } from '@/data/evolutionData';
import { TAMA_DATA } from '@/data/simulatorData';
import Simulator from '@/components/Simulator';

// アダルト期・特殊期かつ画像が存在するキャラクターのみを抽出
const ALL_CHARACTERS = [...LAND_DATA, ...SEA_DATA, ...SKY_DATA, ...FOREST_DATA].filter(c => c.iconUrl && (c.stage === 'アダルト' || c.stage === '特殊'));

// 進化データのID → シミュレーター内部名マッピング（スプライト合成用）
const ID_TO_INTERNAL: Record<string, string> = {
  // りく
  'land_7': 'meowtchi', 'land_11': 'pochitchi', 'land_15': 'gumax', 'land_19': 'ratchi',
  'land_8': 'mametchi', 'land_12': 'mimitchi', 'land_16': 'molmotchi', 'land_20': 'sheeptchi',
  'land_9': 'leopatchi', 'land_13': 'sebiretchi', 'land_17': 'elizardotchi', 'land_21': 'heavytchi',
  'land_10': 'furawatchi', 'land_14': 'potsunentchi', 'land_18': 'tustustchi', 'land_22': 'shigemi-san',
  'land_23': 'chodracotchi',
  // みず
  'sea_7': 'irukatchi', 'sea_8': 'kametchi', 'sea_9': 'kujiratchi', 'sea_10': 'uruotchi',
  'sea_11': 'axolopatchi', 'sea_12': 'imoritchi', 'sea_13': 'kawazutchi', 'sea_14': 'beavertchi',
  'sea_15': 'tachutchi', 'sea_16': 'sharktchi', 'sea_17': 'ankotchi', 'sea_18': 'otototchi',
  'sea_19': 'kuraratchi', 'sea_20': 'mendakotchi', 'sea_21': 'amefuratchi', 'sea_22': 'gusokutchi',
  'sea_23': 'mermarintchi',
  // そら
  'sky_7': 'horhotchi', 'sky_8': 'mongatchi', 'sky_9': 'eagletchi', 'sky_10': 'batchi',
  'sky_11': 'peacotchi', 'sky_12': 'batatchi', 'sky_13': 'kuchipatchi', 'sky_14': 'kiwitchi',
  'sky_15': 'papillotchi', 'sky_16': 'kabutotchi', 'sky_17': 'tentotchi', 'sky_18': 'hatchitchi',
  'sky_19': 'gemtchi', 'sky_20': 'oretatchi', 'sky_21': 'ishikorotchi', 'sky_22': 'magmatchi',
  'sky_23': 'yayacorntchi',
  // もり
  'forest_7': 'foresthorhotchi', 'forest_8': 'konkotchi', 'forest_9': 'tigaotchi', 'forest_10': 'tanoontchi',
  'forest_11': 'lessapantchi', 'forest_12': 'kanokotchi', 'forest_13': 'suigyutchi', 'forest_14': 'panbootchi',
  'forest_15': 'kachitchi', 'forest_16': 'tokipatchi', 'forest_17': 'kuchipatchi', 'forest_18': 'sparrotchi',
  'forest_19': 'shiitaketchi', 'forest_20': 'peatchi', 'forest_21': 'nappatchi', 'forest_22': 'rushraditchi',
  'forest_23': 'tatsutchi',
};

// スプライト合成関数（体＋目をキャンバスで合成してdataURLを返す）
async function generateCharacterSprite(internalName: string): Promise<string | null> {
  const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 体画像をロード
    const baseImg = await loadImage(`/simulator/character/${internalName}.png`);
    canvas.width = baseImg.width || 64;
    canvas.height = baseImg.height || 64;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImg, 0, 0);

    // 目画像をロード＆位置合わせして合成
    const tamaConfig = TAMA_DATA[internalName];
    if (tamaConfig) {
      const eyePosX = tamaConfig.eyePosition[0];
      const eyePosY = tamaConfig.eyePosition[1] + tamaConfig.adjustments;
      const eyeImg = await loadImage(`/simulator/eyes/${internalName}.png`);

      // マスク処理
      let useMask = false;
      let maskImg: HTMLImageElement | null = null;
      try {
        maskImg = await loadImage(`/simulator/mask/${internalName}.png`);
        useMask = true;
      } catch { /* no mask */ }

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

    return canvas.toDataURL();
  } catch (e) {
    console.error('Sprite generation failed:', e);
    return null;
  }
}

type CharacterData = {
  name: string;
  imageUrl: string | null;
};

type Generation = {
  id: string;
  partner: CharacterData;
  child: CharacterData;
};

export default function FamilyTreePage() {
  const [rootParent, setRootParent] = useState<CharacterData>({ name: '', imageUrl: null });
  const [generations, setGenerations] = useState<Generation[]>([
    { id: 'gen-1', partner: { name: '', imageUrl: null }, child: { name: '', imageUrl: null } }
  ]);

  // Undo履歴
  type HistoryState = { rootParent: CharacterData; generations: Generation[] };
  const [history, setHistory] = useState<HistoryState[]>([]);

  // 現在の状態をhistoryに保存するヘルパー
  const pushHistory = () => {
    setHistory(prev => [...prev.slice(-19), { rootParent: JSON.parse(JSON.stringify(rootParent)), generations: JSON.parse(JSON.stringify(generations)) }]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setRootParent(prev.rootParent);
    setGenerations(prev.generations);
  };

  const treeRef = useRef<HTMLDivElement>(null);

  // モーダル制御用ステート
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetNode, setTargetNode] = useState<{ type: 'root' } | { type: 'partner' | 'child', genIndex: number } | null>(null);
  const [modalTab, setModalTab] = useState<'existing' | 'custom'>('existing');

  // 名前表示ON/OFFスイッチ
  const [showNames, setShowNames] = useState(true);

  // 画像プレビューモーダル
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const openModal = (target: { type: 'root' } | { type: 'partner' | 'child', genIndex: number }) => {
    setTargetNode(target);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTargetNode(null);
  };

  const handleCharacterSelect = (charData: CharacterData) => {
    if (!targetNode) return;
    pushHistory(); // 操作前の状態を保存

    if (targetNode.type === 'root') {
      setRootParent({ ...rootParent, ...charData });
    } else if (targetNode.type === 'partner') {
      const newGens = [...generations];
      newGens[targetNode.genIndex].partner = { ...newGens[targetNode.genIndex].partner, ...charData };
      setGenerations(newGens);
    } else if (targetNode.type === 'child') {
      const newGens = [...generations];
      newGens[targetNode.genIndex].child = { ...newGens[targetNode.genIndex].child, ...charData };
      setGenerations(newGens);
    }

    closeModal();
  };

  // 既存キャラ選択：スプライト画像を合成して枠にセット
  const handleExistingCharacterSelect = async (charId: string, charName: string, fallbackUrl: string | null) => {
    const internalName = ID_TO_INTERNAL[charId];
    if (internalName) {
      const spriteUrl = await generateCharacterSprite(internalName);
      handleCharacterSelect({ name: charName, imageUrl: spriteUrl || fallbackUrl });
    } else {
      handleCharacterSelect({ name: charName, imageUrl: fallbackUrl });
    }
  };

  // カスタムキャラ用：画像のみセット、名前は自動入力しない
  const handleCustomCharacterSelect = (charData: CharacterData) => {
    handleCharacterSelect({ name: '', imageUrl: charData.imageUrl });
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleCharacterSelect({ name: '', imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addGeneration = () => {
    pushHistory();
    setGenerations([
      ...generations,
      { id: `gen-${generations.length + 1}`, partner: { name: '', imageUrl: null }, child: { name: '', imageUrl: null } }
    ]);
  };

  const removeGeneration = () => {
    if (generations.length <= 1) return;
    pushHistory();
    setGenerations(generations.slice(0, -1));
  };

  const handleSaveImage = async () => {
    if (!treeRef.current) return;
    try {
      // 保存時は名前入力欄の枠線を一時非表示（文字は残す）
      const inputs = treeRef.current.querySelectorAll('input');
      const originalStyles: string[] = [];
      inputs.forEach(input => {
        const el = input as HTMLInputElement;
        originalStyles.push(el.style.cssText);
        el.style.border = 'none';
        el.style.outline = 'none';
        el.style.background = 'transparent';
        el.style.boxShadow = 'none';
      });

      const capturedCanvas = await html2canvas(treeRef.current, {
        backgroundColor: '#fffdf8',
        scale: 2,
        useCORS: true
      });

      // 名前入力欄を復元
      inputs.forEach((input, i) => {
        (input as HTMLInputElement).style.cssText = originalStyles[i];
      });
      
      // 新しいキャンバスに合成してから透かしを追加
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = capturedCanvas.width;
      finalCanvas.height = capturedCanvas.height;
      const ctx = finalCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(capturedCanvas, 0, 0);
        // 右下に控えめな透かしテキスト（scale:2のためフォント・座標も2倍）
        ctx.font = '36px sans-serif';
        ctx.fillStyle = 'rgba(139, 109, 80, 0.35)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('たまコーヒーハウス', finalCanvas.width - 40, finalCanvas.height - 30);
      }
      
      const imgData = finalCanvas.toDataURL('image/png');
      setPreviewImageUrl(imgData);
    } catch (e) {
      console.error('Failed to capture image', e);
      alert('画像の保存に失敗しました。');
    }
  };

  const handleDownloadPreview = () => {
    if (!previewImageUrl) return;
    const link = document.createElement('a');
    link.download = `tamagochi-family-tree-${Date.now()}.png`;
    link.href = previewImageUrl;
    link.click();
  };

  const handleShare = () => {
    const text = encodeURIComponent(`たまコーヒーハウスで${generations.length}世代続く家系図を作ったよ！🧬☕\n\n#たまパラ #たまごっち`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="y2k-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="y2k-title" style={{ textAlign: 'center', lineHeight: '1.2', fontSize: '2.5rem' }}>
        家系図メーカー
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p>あなただけのたまごっちの血統を記録しよう！</p>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', marginTop: '10px' }}>
          <span>名前を表示</span>
          <div
            onClick={() => setShowNames(!showNames)}
            style={{
              width: '44px', height: '24px', borderRadius: '12px',
              backgroundColor: showNames ? 'var(--primary-color)' : '#ccc',
              position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
            }}
          >
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              backgroundColor: '#fff', position: 'absolute', top: '2px',
              left: showNames ? '22px' : '2px', transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }} />
          </div>
        </label>
      </div>

      <div className="y2k-window" style={{ overflowX: 'auto', padding: '40px 20px' }}>
        <div ref={treeRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* ツリー描画領域 */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            
              {/* 第1世代とパートナー */}
              <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                <CharacterBox 
                  title="第1世代"
                  data={rootParent} 
                  onChange={(newData) => setRootParent(newData)} 
                  onClick={() => openModal({ type: 'root' })}
                  showName={showNames}
                />
                <CharacterBox 
                  title="パートナー"
                  data={generations[0].partner} 
                  onChange={(newData) => {
                    const newGens = [...generations];
                    newGens[0].partner = newData;
                    setGenerations(newGens);
                  }} 
                  onClick={() => openModal({ type: 'partner', genIndex: 0 })}
                  showName={showNames}
                />
              </div>

              {/* 初代の線 */}
              <div style={{ position: 'relative', width: '280px', height: '40px' }}>
                  <div style={{ position: 'absolute', left: '60px', top: 0, width: '2px', height: '40px', backgroundColor: 'var(--primary-color)' }}></div>
                  <div style={{ position: 'absolute', left: '220px', top: 0, width: '2px', height: '20px', backgroundColor: 'var(--primary-color)' }}></div>
                  <div style={{ position: 'absolute', left: '60px', top: '20px', width: '160px', height: '2px', backgroundColor: 'var(--primary-color)' }}></div>
              </div>

              {/* 世代ごとのループ描画 */}
              {generations.map((gen, index) => {
                const isLast = index === generations.length - 1;
                const nextGen = generations[index + 1];

                return (
                  <div key={gen.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                      <CharacterBox 
                          title={`第${index + 2}世代`}
                          data={gen.child} 
                          onChange={(newData) => {
                            const newGens = [...generations];
                            newGens[index].child = newData;
                            setGenerations(newGens);
                          }} 
                          onClick={() => openModal({ type: 'child', genIndex: index })}
                          showName={showNames}
                      />
                      {nextGen && (
                        <CharacterBox 
                          title="パートナー"
                          data={nextGen.partner} 
                          onChange={(newData) => {
                            const newGens = [...generations];
                            newGens[index + 1].partner = newData;
                            setGenerations(newGens);
                          }} 
                          onClick={() => openModal({ type: 'partner', genIndex: index + 1 })}
                          showName={showNames}
                        />
                      )}
                    </div>

                    {!isLast && (
                       <div style={{ position: 'relative', width: '280px', height: '40px' }}>
                          <div style={{ position: 'absolute', left: '60px', top: 0, width: '2px', height: '40px', backgroundColor: 'var(--primary-color)' }}></div>
                          <div style={{ position: 'absolute', left: '220px', top: 0, width: '2px', height: '20px', backgroundColor: 'var(--primary-color)' }}></div>
                          <div style={{ position: 'absolute', left: '60px', top: '20px', width: '160px', height: '2px', backgroundColor: 'var(--primary-color)' }}></div>
                       </div>
                    )}

                  </div>
                );
              })}

            </div>

        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
        <button className="y2k-button" onClick={addGeneration} style={{ backgroundColor: '#fffdf8', color: 'var(--primary-color)' }}>
          ➕ 世代を追加
        </button>
        <button 
          className="y2k-button" 
          onClick={removeGeneration} 
          disabled={generations.length <= 1}
          style={{ backgroundColor: '#fffdf8', color: 'var(--primary-color)', opacity: generations.length <= 1 ? 0.4 : 1, cursor: generations.length <= 1 ? 'not-allowed' : 'pointer' }}
        >
          ➖ 世代を削除
        </button>
        <button className="y2k-button" onClick={handleSaveImage}>
          📸 画像として保存
        </button>
        <button className="y2k-button" style={{ backgroundColor: '#1DA1F2', color: '#fff', borderColor: '#1DA1F2' }} onClick={handleShare}>
          🐦 Xでシェア
        </button>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/" className="y2k-button" style={{ padding: '8px 15px', fontSize: '0.9rem' }}>ホームに戻る</Link>
      </div>

      {/* 画像プレビューモーダル */}
      {previewImageUrl && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '20px'
        }}>
          <div className="y2k-window" style={{ maxWidth: '700px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="y2k-window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📸 画像プレビュー</span>
              <button onClick={() => setPreviewImageUrl(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✖</button>
            </div>
            <div className="y2k-window-body" style={{ flex: 1, overflowY: 'auto', textAlign: 'center', padding: '20px', backgroundColor: '#fffdf8' }}>
              <img src={previewImageUrl} alt="家系図プレビュー" style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px', border: '2px solid var(--border-color)' }} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                <button className="y2k-button" onClick={handleDownloadPreview} style={{ padding: '10px 25px', fontSize: '1rem' }}>
                  💾 ダウンロード
                </button>
                <button className="y2k-button" onClick={() => setPreviewImageUrl(null)} style={{ padding: '10px 25px', fontSize: '1rem', backgroundColor: '#fffdf8', color: 'var(--primary-color)' }}>
                  ← 戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* キャラクター選択モーダル */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="y2k-window" style={{ width: '95%', maxWidth: '800px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="y2k-window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>キャラクターをえらぶ</span>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✖</button>
            </div>
            
            <div style={{ display: 'flex', borderBottom: '2px solid var(--primary-color)', backgroundColor: 'var(--primary-color)' }}>
              <button 
                onClick={() => setModalTab('existing')} 
                style={{ flex: 1, padding: '10px', border: 'none', background: modalTab === 'existing' ? '#fffdf8' : 'transparent', color: modalTab === 'existing' ? 'var(--primary-color)' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >既存キャラ</button>
              <button 
                onClick={() => setModalTab('custom')} 
                style={{ flex: 1, padding: '10px', border: 'none', background: modalTab === 'custom' ? '#fffdf8' : 'transparent', color: modalTab === 'custom' ? 'var(--primary-color)' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >自分で作ったキャラ</button>
            </div>

            <div className="y2k-window-body" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fffdf8' }}>
              {modalTab === 'existing' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                  {ALL_CHARACTERS.map(c => (
                    <div 
                      key={c.id} 
                      style={{ border: '2px solid var(--accent-color)', borderRadius: '8px', padding: '5px', cursor: 'pointer', width: '80px', textAlign: 'center' }}
                      onClick={() => handleExistingCharacterSelect(c.id, c.name, c.iconUrl || null)}
                    >
                      <img src={c.iconUrl} alt={c.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                      <div style={{ fontSize: '0.7rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{c.name}</div>
                    </div>
                  ))}
                </div>
              )}

              {modalTab === 'custom' && (
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  {/* 外部画像アップロード */}
                  <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fff', border: '2px dashed #ccc', borderRadius: '8px' }}>
                     <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--primary-color)' }}>手持ちの画像を使う</p>
                     <label className="y2k-button" style={{ cursor: 'pointer', display: 'inline-block', fontSize: '1rem', padding: '8px 16px', backgroundColor: '#fffdf8' }}>
                        📁 画像から選択
                        <input type="file" accept="image/*" onChange={handleCustomImageUpload} style={{ display: 'none' }} />
                     </label>
                  </div>

                  {/* 簡易シミュレーターの組み込み */}
                  <div style={{ border: '2px solid var(--primary-color)', borderRadius: '8px', padding: '10px', backgroundColor: '#fff', position: 'relative' }}>
                     <Simulator minimalMode onComplete={handleCustomCharacterSelect} />
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// 個別のキャラクター枠コンポーネント
function CharacterBox({ title, data, onChange, onClick, showName }: { title: string, data: CharacterData, onChange: (d: CharacterData) => void, onClick: () => void, showName: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
      <span style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px', fontWeight: 'bold' }}>{title}</span>
      <div 
        style={{ 
          width: '100px', 
          height: '100px', 
          border: '3px dashed var(--accent-color)', 
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          cursor: 'pointer',
          overflow: 'hidden',
          marginBottom: '8px',
          padding: '6px'
        }}
        onClick={onClick}
      >
        {data.imageUrl ? (
          <img src={data.imageUrl} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: '2rem', color: '#ccc' }}>+</span>
        )}
      </div>
      {showName && (
        <input 
          type="text" 
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="なまえ"
          className="y2k-input"
          style={{ width: '100%', padding: '5px', fontSize: '0.8rem', textAlign: 'center' }}
        />
      )}
    </div>
  );
}
