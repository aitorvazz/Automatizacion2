FROM apify/actor-node:20

COPY . ./

RUN npm install --quiet --only=prod --no-optional && (npm list || true)

CMD ["node", "main.js"]
