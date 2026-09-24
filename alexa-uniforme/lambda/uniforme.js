'use strict';

// Zona horaria usada si no se puede obtener la del dispositivo Alexa.
const DEFAULT_TIME_ZONE = 'Europe/Madrid';

// 0 = domingo ... 6 = sábado
const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const SCHEDULE = {
    2: 'Luca',  // martes
    3: 'Diego', // miércoles
    4: 'Luca',  // jueves
    5: 'Diego'  // viernes
};

const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Devuelve el día de la semana (0-6) de `date` en la zona horaria indicada. */
function getWeekday(date, timeZone) {
    let short;
    try {
        short = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(date);
    } catch (e) {
        short = new Intl.DateTimeFormat('en-US', { timeZone: DEFAULT_TIME_ZONE, weekday: 'short' }).format(date);
    }
    return WEEKDAY_INDEX[short];
}

/** Construye la respuesta hablada para un día de la semana (0-6). */
function buildAnswer(weekday) {
    const person = SCHEDULE[weekday];
    const day = DAY_NAMES[weekday];
    if (person) {
        return `Hoy es ${day}. Hoy le toca ir de uniforme a ${person}.`;
    }
    return `Hoy es ${day}. Hoy no le toca ir de uniforme a nadie.`;
}

module.exports = { DEFAULT_TIME_ZONE, SCHEDULE, getWeekday, buildAnswer };
