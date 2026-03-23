"use client";

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { SHOP_CODE_DATA, CodeCategory } from '@/data/shopCodeData';

const CATEGORIES: { key: CodeCategory; emoji: string }[] = [
  { key: 'food', emoji: '🍖' },
  { key: 'snack', emoji: '🍩' },
  { key: 'toy', emoji: '🎪' },
  { key: 'deco', emoji: '🎀' },
  { key: 'lab', emoji: '🧪' },
];

export default function CodesPage() {
  const t = useTranslations('codes');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<CodeCategory>('food');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let items = SHOP_CODE_DATA.filter(item => item.category === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = SHOP_CODE_DATA.filter(item =>
        item.nameJa.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
      );
    }
    return items;
  }, [activeTab, searchQuery]);

  const handleCopy = async (code: string) => {
    const cleanCode = code.replace(/\s/g, '');
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = cleanCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <div className="y2k-container" style={{ maxWidth: '900px', margin: '30px auto 0' }}>
      <h1 className="y2k-title" style={{ textAlign: 'center', lineHeight: '1.2' }}>
        {t('title')}<br />
        <span style={{ fontSize: '0.7em' }}>{t('subtitle')}</span>
      </h1>

      {/* 検索バー */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          className="y2k-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}
        />
      </div>

      {/* カテゴリタブ */}
      {!searchQuery.trim() && (
        <div className="codes-tab-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`codes-tab ${activeTab === cat.key ? 'active' : ''}`}
            >
              <span className="codes-tab-emoji">{cat.emoji}</span>
              <span className="codes-tab-label">{t(`cat_${cat.key}`)}</span>
            </button>
          ))}
        </div>
      )}

      {/* アイテム一覧 */}
      <div className="y2k-window" style={{ marginTop: '10px' }}>
        <div className="y2k-window-header">
          {searchQuery.trim()
            ? t('searchResults', { count: filteredItems.length })
            : `${CATEGORIES.find(c => c.key === activeTab)?.emoji} ${t(`cat_${activeTab}`)}`
          }
        </div>
        <div className="y2k-window-body" style={{ padding: '15px' }}>
          {filteredItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>{t('noResults')}</p>
          ) : (
            <div className="codes-grid">
              {filteredItems.map(item => (
                <div key={item.id} className="code-card">
                  {item.imageId && (
                    <div className="code-card-img">
                      <img
                        src={`/images/items/${item.imageId}.png`}
                        alt={locale === 'ja' ? item.nameJa : item.nameEn}
                        style={{ maxWidth: '48px', maxHeight: '48px', objectFit: 'contain', imageRendering: 'pixelated' }}
                      />
                    </div>
                  )}
                  <div className="code-card-info">
                    <div className="code-card-name">
                      {locale === 'ja' ? item.nameJa : item.nameEn}
                      {locale !== 'ja' && (
                        <span className="code-card-name-sub">{item.nameJa}</span>
                      )}
                    </div>
                    {item.price && (
                      <div className="code-card-price">{item.price} ₲</div>
                    )}
                  </div>
                  <button
                    className="code-copy-btn"
                    onClick={() => handleCopy(item.code)}
                    title={t('copy')}
                  >
                    <span className="code-text">{item.code}</span>
                    <span className="code-copy-icon">
                      {copiedCode === item.code ? '✅' : '📋'}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}>
        <Link href={`/${locale}`} className="y2k-nav-btn">{t('backHome')}</Link>
      </div>
    </div>
  );
}
