import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="y2k-container">
        <h1 className="y2k-title">{t('title')}</h1>
        <p style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 'bold' }}>
          {t('subtitle')}<br />
          <span style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-retro)', fontSize: '0.9rem' }}>
            {t('subtitleSmall')}
          </span>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', marginTop: '20px' }}>
          <Link href="/simulator" className="y2k-button">{t('simulator')}</Link>

          <div id="evolution" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-retro)', color: 'var(--primary-color)', fontSize: '1.2rem', fontWeight: 'bold' }}>{t('evolution')}</span>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/evolution/land" className="y2k-button" style={{ backgroundColor: '#fffaf0', color: '#b87333', border: '3px solid #b87333', padding: '10px 15px' }}>{t('land')}</Link>
              <Link href="/evolution/sea" className="y2k-button" style={{ backgroundColor: '#fffaf0', color: '#5f9ea0', border: '3px solid #5f9ea0', padding: '10px 15px' }}>{t('sea')}</Link>
              <Link href="/evolution/sky" className="y2k-button" style={{ backgroundColor: '#fffaf0', color: '#8A6BBE', border: '3px solid #8A6BBE', padding: '10px 15px' }}>{t('sky')}</Link>
              <Link href="/evolution/forest" className="y2k-button" style={{ backgroundColor: '#fffaf0', color: '#4A9E86', border: '3px solid #4A9E86', padding: '10px 15px' }}>{t('forest')}</Link>
            </div>
          </div>

          <Link href="/family-tree" className="y2k-button" style={{ alignSelf: 'center', marginTop: '15px' }}>{t('familyTree')}</Link>
          <Link href="/codes" className="y2k-button" style={{ alignSelf: 'center', marginTop: '15px' }}>{t('codes')}</Link>
          <Link href="/bbs" className="y2k-button" style={{ alignSelf: 'center', marginTop: '15px' }}>{t('bbs')}</Link>
        </div>
      </div>
    </main>
  );
}
