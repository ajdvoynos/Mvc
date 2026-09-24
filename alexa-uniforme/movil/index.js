'use strict';

// Versión en un solo archivo: pégala entera en lambda/index.js de la consola de Alexa.

const Alexa = require('ask-sdk-core');

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

async function getTimeZone(handlerInput) {
    try {
        const deviceId = Alexa.getDeviceId(handlerInput.requestEnvelope);
        const upsClient = handlerInput.serviceClientFactory.getUpsServiceClient();
        return (await upsClient.getSystemTimeZone(deviceId)) || DEFAULT_TIME_ZONE;
    } catch (e) {
        console.log(`No se pudo obtener la zona horaria: ${e.message}`);
        return DEFAULT_TIME_ZONE;
    }
}

async function answer(handlerInput) {
    const timeZone = await getTimeZone(handlerInput);
    const speech = buildAnswer(getWeekday(new Date(), timeZone));
    return handlerInput.responseBuilder
        .speak(speech)
        .withSimpleCard('Uniforme', speech)
        .withShouldEndSession(true)
        .getResponse();
}

// "Alexa, abre uniforme escolar" responde directamente.
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle: answer
};

const QuienVaDeUniformeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'QuienVaDeUniformeIntent';
    },
    handle: answer
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speech = 'Puedes preguntarme: ¿a quién le toca ir de uniforme hoy?';
        return handlerInput.responseBuilder.speak(speech).reprompt(speech).getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speech = 'No te he entendido. Pregúntame: ¿a quién le toca ir de uniforme hoy?';
        return handlerInput.responseBuilder.speak(speech).reprompt(speech).getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && ['AMAZON.CancelIntent', 'AMAZON.StopIntent', 'AMAZON.NavigateHomeIntent']
                .includes(Alexa.getIntentName(handlerInput.requestEnvelope));
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.speak('¡Hasta luego!').getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error: ${error.stack}`);
        const speech = 'Lo siento, ha habido un problema. Inténtalo de nuevo.';
        return handlerInput.responseBuilder.speak(speech).getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        QuienVaDeUniformeIntentHandler,
        HelpIntentHandler,
        FallbackIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();
