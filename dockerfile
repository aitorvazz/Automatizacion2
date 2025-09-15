# Usa la imagen oficial de Apify para Node.js
FROM apify/actor-node:20

# Copiar todos los archivos del proyecto al contenedor
COPY . ./ 

# Instalar dependencias de producción
RUN npm install --quiet --only=prod --no-optional && (npm list || true)

# Definir el archivo de entrada
CMD ["node", "main.js"]
