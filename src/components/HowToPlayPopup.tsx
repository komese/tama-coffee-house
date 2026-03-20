"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Props {
    onClose: () => void;
}

export default function HowToPlayPopup({ onClose }: Props) {
    const t = useTranslations('familyTree');

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content howto-popup" onClick={e => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={onClose}>×</button>
                <h2 className="howto-title">{t('howToPlayTitle')}</h2>
                
                <div className="howto-scroll-area">
                    <div className="howto-step">
                        <h3>{t('howtoStep1Title')}</h3>
                        <p>{t('howtoStep1Desc')}</p>
                        <div className="howto-img-wrapper">
                            <Image src="/images/howto/howto_1.png" alt="Step 1" width={500} height={350} className="howto-img" />
                        </div>
                    </div>

                    <div className="howto-step">
                        <h3>{t('howtoStep2Title')}</h3>
                        <p>{t('howtoStep2Desc')}</p>
                        <div className="howto-img-wrapper">
                            <Image src="/images/howto/howto_2.png" alt="Step 2" width={500} height={350} className="howto-img" />
                        </div>
                    </div>

                    <div className="howto-custom-box">
                        <h4>{t('howtoCustomTitle')}</h4>
                        <p>{t('howtoCustomDesc1')}</p>
                        <div className="howto-img-wrapper">
                            <Image src="/images/howto/howto_3.png" alt="Custom Step 1" width={500} height={350} className="howto-img" />
                        </div>
                        <p>{t('howtoCustomDesc2')}</p>
                        <div className="howto-img-wrapper">
                            <Image src="/images/howto/howto_4.png" alt="Custom Step 2" width={500} height={350} className="howto-img" />
                        </div>
                        <p>{t('howtoCustomDesc3')}</p>
                        <div className="howto-img-wrapper">
                            <Image src="/images/howto/howto_5.png" alt="Custom Step 3" width={500} height={350} className="howto-img" />
                        </div>
                    </div>

                    <div className="howto-step">
                        <h3>{t('howtoStep3Title')}</h3>
                        <p>{t('howtoStep3Desc')}</p>
                    </div>

                    <div className="howto-step">
                        <h3>{t('howtoStep4Title')}</h3>
                        <p>{t('howtoStep4Desc')}</p>
                    </div>

                    <div className="howto-step">
                        <h3>{t('howtoStep5Title')}</h3>
                        <p>{t('howtoStep5Desc')}</p>
                    </div>

                    <div className="howto-extra-box">
                        <h4>{t('howtoExtraTitle')}</h4>
                        <p>{t('howtoExtraDesc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
