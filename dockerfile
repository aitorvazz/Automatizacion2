FROM apify/actor-node:20

COPY . ./

RUN npm install --quiet --only=prod --no-optional

CMD ["node", "main.js"]
