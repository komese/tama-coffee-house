import { SPECIAL_EVENTS, MONTHLY_EVENTS, TamaEvent } from '../data/eventData';

export function getTodayEvents(currentDate: Date = new Date()): TamaEvent[] {
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();
    const strDate = date.toString();

    const todayEvents: TamaEvent[] = [];

    // --- 特別なイベントの判定 ---
    // sp2: お正月(1/1)
    if (month === 1 && date === 1) {
        const ev = SPECIAL_EVENTS.find(e => e.id === 'sp2');
        if (ev) todayEvents.push(ev);
    }
    // sp3: たまごっちの日(11/23)
    if (month === 11 && date === 23) {
        const ev = SPECIAL_EVENTS.find(e => e.id === 'sp3');
        if (ev) todayEvents.push(ev);
    }
    // sp4: 12月1日から23日まで
    if (month === 12 && date >= 1 && date <= 23) {
        const ev = SPECIAL_EVENTS.find(e => e.id === 'sp4');
        if (ev) todayEvents.push(ev);
    }
    // sp5: クリスマス・イブ(12/24)
    if (month === 12 && date === 24) {
        const ev = SPECIAL_EVENTS.find(e => e.id === 'sp5');
        if (ev) todayEvents.push(ev);
    }
    // sp6: クリスマス(12/25)
    if (month === 12 && date === 25) {
        const ev = SPECIAL_EVENTS.find(e => e.id === 'sp6');
        if (ev) todayEvents.push(ev);
    }

    // --- 月ごとのイベントの判定 ---
    // mo1: 7の倍数の日 (7, 14, 21, 28)
    if (date % 7 === 0 && date <= 28) {
        const ev = MONTHLY_EVENTS.find(e => e.id === 'mo1');
        if (ev) todayEvents.push(ev);
    }
    // mo2: 9のつく日 (9, 19, 29)
    if (strDate.endsWith('9')) {
        const ev = MONTHLY_EVENTS.find(e => e.id === 'mo2');
        if (ev) todayEvents.push(ev);
    }
    // mo3: 0のつく日 (10, 20, 30)
    if (strDate.endsWith('0')) {
        const ev = MONTHLY_EVENTS.find(e => e.id === 'mo3');
        if (ev) todayEvents.push(ev);
    }
    // mo4: 5のつく日 (5, 15, 25)
    if (strDate.endsWith('5')) {
        const ev = MONTHLY_EVENTS.find(e => e.id === 'mo4');
        if (ev) todayEvents.push(ev);
    }
    // mo5: 13日の午後5時 (当日の間はお知らせを表示)
    if (date === 13) {
        const ev = MONTHLY_EVENTS.find(e => e.id === 'mo5');
        if (ev) todayEvents.push(ev);
    }

    return todayEvents;
}
