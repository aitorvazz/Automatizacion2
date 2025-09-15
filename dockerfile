FROM apify/actor-node:20

COPY . ./

RUN npm install --quiet --only=prod --no-optional

# Verificar que Apify y Playwright están instalados correctamente
RUN npm list apify
RUN npm list playwright

CMD ["node", "main.js"]
