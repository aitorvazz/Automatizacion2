FROM apify/actor-node:20

COPY . ./

# Instalar dependencias
RUN npm install --quiet --only=prod --no-optional

# Verificar la instalación de Apify y Playwright
RUN npm list apify
RUN npm list playwright

CMD ["node", "main.js"]
