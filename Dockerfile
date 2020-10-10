# Base image
#
# Alias so that
# - all stages can use the same base image
# - base image version can be changed easily
# - node and alpine versions are pinned for reproducible builds
FROM node:14.9.0-alpine3.12 as base-image

#
# Build environment
# With node-gyp support. We do not want the installed dependencies in our runtime container to minimize size and attack surface
#
FROM base-image as build-environment


#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM build-environment AS builder

WORKDIR /opt/app

COPY ["package*.json", "tsconfig*.json", "./"]
COPY src ./src

RUN npm ci --quiet --no-cache && npm run build

#
# Build Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM  build-environment as production-builder

WORKDIR /opt/app
ENV NODE_ENV=production

COPY ["package*.json", "./"]
# Install production dependencies
RUN npm ci --quiet --no-cache --only=production

#
# Runtime image
#
FROM base-image as production
WORKDIR /opt/app

# Run process with less privileges
USER node

## We just need the dist folder and node_modules to execute the command
COPY --from=builder /opt/app/dist ./dist
COPY --from=production-builder /opt/app/node_modules ./node_modules

EXPOSE 3000

# When NODE_ENV is set to production
ENV NODE_ENV=production

# Use nodejs directly for correct handling of SIGTERM / SIGKILL
CMD ["node", "./dist/index.js"]
