'use strict';

const assert = require('assert');
const { getWeekday, buildAnswer } = require('./uniforme');

const expected = {
    0: 'a nadie',
    1: 'a nadie',
    2: 'a Luca',
    3: 'a Diego',
    4: 'a Luca',
    5: 'a Diego',
    6: 'a nadie'
};
for (const [day, who] of Object.entries(expected)) {
    assert.ok(buildAnswer(Number(day)).includes(who), `día ${day}: ${buildAnswer(Number(day))}`);
}

// 2026-09-23 fue miércoles; a las 23:30 UTC ya es jueves en Madrid pero sigue siendo miércoles en México.
const d = new Date('2026-09-23T23:30:00Z');
assert.strictEqual(getWeekday(d, 'Europe/Madrid'), 4);
assert.strictEqual(getWeekday(d, 'America/Mexico_City'), 3);
assert.strictEqual(getWeekday(d, 'Zona/Invalida'), 4); // cae a la zona por defecto

console.log('OK');
