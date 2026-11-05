# Development image for the Cely Precast Greener Blocks website.
# The project folder is mounted at /app by docker compose; this image only
# provides the toolchain (Node.js, npm, git).
FROM node:24-bookworm

ENV npm_config_update_notifier=false \
    npm_config_fund=false

# node_modules lives in a Docker volume; create the mount point owned by the
# non-root user so the volume inherits the right permissions.
RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app
USER node

# 5173: Vite dev server, 4173: Vite preview of the production build
EXPOSE 5173 4173

CMD ["npm", "run", "dev"]
