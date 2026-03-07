export default function Footer() {
    return (
        <footer style={{
            backgroundColor: 'var(--primary-color)',
            padding: '20px',
            marginTop: 'auto',
            borderTop: '4px solid var(--accent-color)',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#fffaf0',
            fontFamily: 'var(--font-retro)'
        }}>
            <p style={{ marginBottom: '10px', fontSize: '1.2em' }}>
                ☕ TAMA COFFEE HOUSE ☕
            </p>

            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '12px',
                border: '1px solid var(--accent-color)',
                borderRadius: '8px',
                display: 'inline-block',
                maxWidth: '600px',
                fontSize: '0.85rem',
                color: '#ececec',
                fontFamily: 'var(--font-main)'
            }}>
                <strong style={{ color: '#fdf6e3' }}>【免責事項】</strong><br />
                当サイトは「たまごっちパラダイス」の非公式ファンサイトであり、株式会社バンダイ様および関連企業様とは一切関係ありません。<br />
                サイト内で使用されている名称、画像などの著作権・商標権は、それぞれの原著作者、企業に帰属します。
            </div>

            <p style={{ marginTop: '15px', fontSize: '0.8rem', color: '#666' }}>
                &copy; {new Date().getFullYear()} Tama Coffee House. All rights reserved. (Unofficial)
            </p>
        </footer>
    );
}
