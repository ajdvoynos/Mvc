'use strict';

const Alexa = require('ask-sdk-core');
const { DEFAULT_TIME_ZONE, getWeekday, buildAnswer } = require('./uniforme');

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
