# Skill de Alexa: Uniforme Escolar

Responde a **"¿A quién le toca ir de uniforme hoy?"** según el día de la semana:

| Día       | Respuesta                                  |
|-----------|--------------------------------------------|
| Martes    | Luca                                       |
| Miércoles | Diego                                      |
| Jueves    | Luca                                       |
| Viernes   | Diego                                      |
| Otros     | "Hoy no le toca ir de uniforme a nadie."   |

El día se calcula con la zona horaria configurada en tu dispositivo Alexa
(si no se puede obtener, se usa `Europe/Madrid`; cámbiala en `lambda/uniforme.js`).

## Cómo usarla

- "Alexa, abre uniforme escolar"
- "Alexa, pregunta a uniforme escolar a quién le toca ir de uniforme hoy"

## Instalación (uso privado, sin publicarla)

Las skills no se instalan en el altavoz directamente: se crean en tu cuenta de
desarrollador de Amazon y, mientras están "en desarrollo", quedan activas
automáticamente en todos los dispositivos Echo de **esa misma cuenta de Amazon**.
No hace falta publicarla ni certificarla.

### Opción A: Consola de Alexa (sin instalar nada)

1. Entra en <https://developer.amazon.com/alexa/console/ask> con la misma cuenta
   de Amazon que usan tus Echo.
2. **Create Skill** → nombre `Uniforme Escolar`, idioma principal el de tu Echo
   (Spanish (ES), Spanish (MX) o Spanish (US)).
3. Modelo **Custom**, hosting **Alexa-hosted (Node.js)**, plantilla **Start from Scratch**.
4. **Build → Interaction Model → JSON Editor**: pega el contenido de
   `skill-package/interactionModels/custom/<tu-idioma>.json`, pulsa
   **Save Model** y luego **Build Model**.
5. Pestaña **Code**: sustituye `index.js` y `package.json` por los de la carpeta
   `lambda/`, crea el archivo `uniforme.js` con el contenido de `lambda/uniforme.js`
   y pulsa **Deploy**.
6. Pestaña **Test**: cambia "Skill testing is enabled in" a **Development**.
   Prueba escribiendo "abre uniforme escolar".
7. ¡Listo! Ya puedes decirle a tu Echo: "Alexa, abre uniforme escolar".

### Opción B: ASK CLI

```bash
npm install -g ask-cli
ask configure            # inicia sesión con tu cuenta de Amazon
cd alexa-uniforme
ask deploy
```

Después activa las pruebas en modo **Development** en la pestaña **Test** de la consola.

## Pruebas locales

```bash
cd lambda
npm test
```
