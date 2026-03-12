"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import { LAND_DATA, SEA_DATA, SKY_DATA, FOREST_DATA } from '@/data/evolutionData';
import Simulator from '@/components/Simulator';

// アダルト期・特殊期かつ画像が存在するキャラクターのみを抽出
const ALL_CHARACTERS = [...LAND_DATA, ...SEA_DATA, ...SKY_DATA, ...FOREST_DATA].filter(c => c.iconUrl && (c.stage === 'アダルト' || c.stage === '特殊'));

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

  const treeRef = useRef<HTMLDivElement>(null);

  // モーダル制御用ステート
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetNode, setTargetNode] = useState<{ type: 'root' } | { type: 'partner' | 'child', genIndex: number } | null>(null);
  const [modalTab, setModalTab] = useState<'existing' | 'custom'>('existing');

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

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleCharacterSelect({ name: 'カスタムキャラ', imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addGeneration = () => {
    setGenerations([
      ...generations,
      { id: `gen-${generations.length + 1}`, partner: { name: '', imageUrl: null }, child: { name: '', imageUrl: null } }
    ]);
  };

  const handleSaveImage = async () => {
    if (!treeRef.current) return;
    try {
      // 一時的にスタイルを調整して綺麗にキャプチャする（任意）
      const canvas = await html2canvas(treeRef.current, {
        backgroundColor: '#fffdf8', // カフェ風背景色
        scale: 2, // 高画質化
        useCORS: true // 外部画像の描画許可
      });
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = 'bold 24px "M PLUS Rounded 1c", sans-serif';
        ctx.fillStyle = 'rgba(100, 70, 50, 0.4)'; // ブラウン系の透かし
        ctx.textAlign = 'right';
        ctx.fillText('(c) たまコーヒーハウス', canvas.width - 20, canvas.height - 20);
      }
      
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `tamagochi-family-tree-${Date.now()}.png`;
      link.href = imgData;
      link.click();
    } catch (e) {
      console.error('Failed to capture image', e);
      alert('画像の保存に失敗しました。');
    }
  };

  const handleShare = () => {
    const text = encodeURIComponent(`たまコーヒーハウスで${generations.length}世代続く家系図を作ったよ！🧬☕\n\n#たまパラ #たまごっち`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="y2k-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="y2k-title" style={{ textAlign: 'center', lineHeight: '1.2' }}>
        たまコーヒーハウス<br />
        <span style={{ fontSize: '0.8em' }}>家系図メーカー</span>
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p>あなただけのたまごっちの血統を記録しよう！</p>
      </div>

      <div className="y2k-window" style={{ overflowX: 'auto', padding: '40px 20px' }}>
        <div ref={treeRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* ツリー描画領域 */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            
              {/* 一番星 (Root Parentと第1パートナー) */}
              <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                <CharacterBox 
                  title="親1"
                  data={rootParent} 
                  onChange={(newData) => setRootParent(newData)} 
                  onClick={() => openModal({ type: 'root' })}
                />
                <CharacterBox 
                  title="親2"
                  data={generations[0].partner} 
                  onChange={(newData) => {
                    const newGens = [...generations];
                    newGens[0].partner = newData;
                    setGenerations(newGens);
                  }} 
                  onClick={() => openModal({ type: 'partner', genIndex: 0 })}
                />
              </div>

              {/* 初代の線 (最初の結合) */}
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
                    
                    {/* 子ども(次世代の親) と、次世代のパートナーがある場合は横に並べる */}
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                      <CharacterBox 
                          title={`第${index + 1}世代`}
                          data={gen.child} 
                          onChange={(newData) => {
                            const newGens = [...generations];
                            newGens[index].child = newData;
                            setGenerations(newGens);
                          }} 
                          onClick={() => openModal({ type: 'child', genIndex: index })}
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
                        />
                      )}
                    </div>

                    {/* 次の世代へ続く線 */}
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
                      key={c.name} 
                      style={{ border: '2px solid var(--accent-color)', borderRadius: '8px', padding: '5px', cursor: 'pointer', width: '80px', textAlign: 'center' }}
                      onClick={() => handleCharacterSelect({ name: c.name, imageUrl: c.iconUrl || null })}
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
                     <Simulator minimalMode onComplete={handleCharacterSelect} />
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
function CharacterBox({ title, data, onChange, onClick }: { title: string, data: CharacterData, onChange: (d: CharacterData) => void, onClick: () => void }) {
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
          marginBottom: '8px'
        }}
        onClick={onClick}
      >
        {data.imageUrl ? (
          <img src={data.imageUrl} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: '2rem', color: '#ccc' }}>+</span>
        )}
      </div>
      <input 
        type="text" 
        value={data.name}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
        placeholder="なまえ"
        className="y2k-input"
        style={{ width: '100%', padding: '5px', fontSize: '0.8rem', textAlign: 'center' }}
      />
    </div>
  );
}
