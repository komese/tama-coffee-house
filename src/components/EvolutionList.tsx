"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LAND_DATA, SEA_DATA, SKY_DATA, FOREST_DATA, EvolutionCharacter } from '../data/evolutionData';

const TABS = [
    { id: 'land', path: '/evolution/land' },
    { id: 'sea', path: '/evolution/sea' },
    { id: 'sky', path: '/evolution/sky' },
    { id: 'forest', path: '/evolution/forest' },
];

export default function EvolutionList({ initialTab = 'land' }: { initialTab?: string }) {
    const activeTab = initialTab;
    const [selectedChar, setSelectedChar] = useState<EvolutionCharacter | null>(null);
    const t = useTranslations('evolution');

    let currentData: EvolutionCharacter[] = [];
    switch (activeTab) {
        case 'land': currentData = LAND_DATA; break;
        case 'sea': currentData = SEA_DATA; break;
        case 'sky': currentData = SKY_DATA; break;
        case 'forest': currentData = FOREST_DATA; break;
        default: currentData = [];
    }

    const babies = currentData.filter(c => c.stage === 'ベビー');
    const kids = currentData.filter(c => c.stage === 'キッズ');
    const youngs = currentData.filter(c => c.stage === 'ヤング');
    const adults = currentData.filter(c => c.stage === 'アダルト');
    const specials = currentData.filter(c => c.stage === '特殊');

    const CharCard = ({ char }: { char: EvolutionCharacter }) => {
        const isSelected = selectedChar?.id === char.id;
        return (
            <div
                onClick={() => setSelectedChar(char)}
                style={{
                    padding: '5px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: isSelected ? '2px solid var(--primary-color)' : '2px solid transparent',
                    backgroundColor: isSelected ? '#fff5e0' : 'transparent',
                    transition: 'all 0.2s',
                    width: '70px'
                }}
            >
                <img
                    src={char.iconUrl}
                    alt={char.name}
                    style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'contain',
                        marginBottom: '4px',
                        transform: ['forest_2', 'forest_3', 'forest_4', 'forest_5', 'forest_6'].includes(char.id) ? 'scale(0.8)' : 'none'
                    }}
                />

                <strong style={{ fontSize: '0.75rem', fontFamily: 'var(--font-retro)', wordBreak: 'break-all', overflowWrap: 'break-word', lineHeight: '1.2' }}>{char.name}</strong>
            </div>
        );
    };

    return (
        <div className="y2k-container" style={{ marginTop: '20px' }}>
            <h2 className="y2k-title" style={{ fontSize: '2rem' }}>
                {t(activeTab as 'land' | 'sea' | 'sky' | 'forest')}
                {t('listTitle')}
            </h2>

            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666', fontFamily: 'var(--font-retro)' }}>
            </p>

            <div className="evolution-container">
                <div className="evolution-tree">

                    {currentData.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'var(--font-retro)', border: '2px dashed #999', borderRadius: '10px' }}>
                            {t('preparing')}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '10px', border: '2px solid #ccc' }}>
                        {babies.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontFamily: 'var(--font-retro)', color: '#5599ff' }}>{t('baby')}</h4>
                                {babies.map(char => <CharCard key={char.id} char={char} />)}
                            </div>
                        )}

                        {kids.length > 0 && <div style={{ color: 'var(--accent-color)', fontSize: '1.2rem', fontWeight: 'bold' }}>➡</div>}

                        {kids.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontFamily: 'var(--font-retro)', color: '#ff6699' }}>{t('kids')}</h4>
                                {kids.map(char => <CharCard key={char.id} char={char} />)}
                            </div>
                        )}

                    </div>

                    {youngs.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                            {youngs.map(young => {
                                const relatedAdults = adults.filter(a => a.parentName === young.name);
                                return (
                                    <div key={young.id} style={{ display: 'flex', backgroundColor: '#fcfcfc', borderRadius: '8px', border: '2px solid #e0e0e0', padding: '8px', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ flex: '0 0 auto', borderRight: '2px dashed #ccc', paddingRight: '10px' }}>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '0.8rem', textAlign: 'center', fontFamily: 'var(--font-retro)', color: '#3cb371' }}>{t('young')}</h4>
                                            <CharCard char={young} />
                                        </div>

                                        <div style={{ flex: '1 1 auto' }}>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '0.8rem', textAlign: 'center', fontFamily: 'var(--font-retro)', color: '#daa520' }}>{t('adult')}</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
                                                {relatedAdults.map(adult => <CharCard key={adult.id} char={adult} />)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {specials.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fcfcfc', borderRadius: '8px', border: '2px dashed #ce93d8', padding: '10px', marginTop: '10px' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontFamily: 'var(--font-retro)', color: '#ce93d8' }}>{t('special')}</h4>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {specials.map(char => <CharCard key={char.id} char={char} />)}
                            </div>
                        </div>
                    )}
                </div>

                <div className="y2k-window evolution-detail">
                    <div className="y2k-window-header" style={{ background: 'var(--border-color)', color: '#fff' }}>{t('detailHeader')}</div>
                    <div className="y2k-window-body">
                        {selectedChar ? (
                            <>
                                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                    <img src={selectedChar.iconUrl} alt={selectedChar.name} style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
                                </div>
                                <h3 style={{ textAlign: 'center', color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '15px', fontFamily: 'var(--font-retro)' }}>
                                    {selectedChar.name}
                                </h3>

                                <div style={{ backgroundColor: '#fff', color: 'var(--text-color)', padding: '15px', border: '2px solid var(--border-color)', marginBottom: '15px', fontFamily: 'var(--font-retro)', borderRadius: '10px' }}>
                                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>{t('conditionLabel')}</h4>
                                    <p style={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>{selectedChar.condition}</p>
                                </div>

                                {selectedChar.description && (
                                    <div style={{ borderLeft: '4px solid var(--primary-color)', paddingLeft: '10px' }}>
                                        <h4 style={{ color: 'var(--border-color)', marginBottom: '5px', fontFamily: 'var(--font-retro)' }}>{t('descriptionLabel')}</h4>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-color)', whiteSpace: 'pre-wrap' }}>{selectedChar.description}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ display: 'flex', height: '100%', minHeight: '150px', alignItems: 'center', justifyContent: 'center', color: '#999', textAlign: 'center', fontFamily: 'var(--font-retro)', fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
                                {t('noSelection')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
