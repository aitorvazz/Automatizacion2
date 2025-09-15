FROM apify/actor-node:20

# Copiar todos los archivos del proyecto al contenedor
COPY . ./

# Instalar las dependencias necesarias
RUN npm install --quiet --only=prod --no-optional

# Verificar que las dependencias se han instalado correctamente
RUN npm list apify
RUN npm list playwright

# Ejecutar el archivo main.js cuando el contenedor se inicie
CMD ["node", "main.js"]
