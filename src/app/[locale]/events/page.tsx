"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { SPECIAL_EVENTS, MONTHLY_EVENTS } from '../../../data/eventData';

export default function EventsList() {
    const t = useTranslations('events');

    return (
        <div className="y2k-container" style={{ maxWidth: '800px', margin: '30px auto 0' }}>
            <h1 className="y2k-title" style={{ textAlign: 'center', lineHeight: '1.2' }}>
                {t('title')}<br />
                <span style={{ fontSize: '0.8em' }}>{t('subtitle')}</span>
            </h1>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Link href="/" className="y2k-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    {t('backHome')}
                </Link>
            </div>

            <div className="y2k-window" style={{ marginBottom: '30px' }}>
                <div className="y2k-window-header">{t('specialTab')}</div>
                <div className="y2k-window-body">
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f6ebd8', color: 'var(--text-color)' }}>
                                <th style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'left', width: '35%' }}>{t('dateHeader')}</th>
                                <th style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'left' }}>{t('descHeader')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SPECIAL_EVENTS.map(event => (
                                <tr key={event.id}>
                                    <td style={{ border: '2px solid var(--primary-color)', padding: '10px', fontWeight: 'bold' }}>{event.time}</td>
                                    <td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>{event.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="y2k-window" style={{ marginBottom: '30px' }}>
                <div className="y2k-window-header">{t('monthlyTab')}</div>
                <div className="y2k-window-body">
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f6ebd8', color: 'var(--text-color)' }}>
                                <th style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'left', width: '35%' }}>{t('dateHeader')}</th>
                                <th style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'left' }}>{t('descHeader')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MONTHLY_EVENTS.map(event => (
                                <tr key={event.id}>
                                    <td style={{ border: '2px solid var(--primary-color)', padding: '10px', fontWeight: 'bold' }}>{event.time}</td>
                                    <td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>{event.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
