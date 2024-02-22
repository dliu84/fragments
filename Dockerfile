# lab 6 dockerfile optimization

# Stage 0: install the base dependencies
FROM node:20.11.0@sha256:7bf4a586b423aac858176b3f683e35f08575c84500fbcfd1d433ad8568972ec6 AS dependencies

# # labels add key=pair pairs with arbitrary metadata about the image
LABEL maintainer="Di Liu <dliu84@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# # We default to use port 8080 in our service
ENV PORT=8080

# # Reduce npm spam when installing within Docker
# # https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# # Disable colour when run inside Docker
# # https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

COPY package*.json /app/

# Install node dependencies defined in package-lock.json
# npm ci install the exact versions from package-lock
RUN npm ci --only=production

###############################################################

# stage 1: build our app
FROM node:20.11.0@sha256:7bf4a586b423aac858176b3f683e35f08575c84500fbcfd1d433ad8568972ec6 AS production

ENV NODE_ENV=production

# Use /app as our working directory
WORKDIR /app

# Copy cached dependencies from previous stage so we don't have to download
COPY --from=dependencies /app /app

# Copy source code into the image
# COPY . .
COPY ./src ./src

# # Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

################################################################

# stage 2: 
FROM node:20.11.0@sha256:7bf4a586b423aac858176b3f683e35f08575c84500fbcfd1d433ad8568972ec6 AS deploy

# Use /app as our working directory
WORKDIR /app

COPY --from=production /app /app

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3  \
CMD curl --fail localhost:8080 || exit 1
