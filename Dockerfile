FROM node:18-alpine3.19

# Create app directory and set ownership
RUN mkdir -p /home/node/app/node_modules && \
    chown -R node:node /home/node/app

WORKDIR /home/node/app

# Copy package files first for better layer caching
COPY --chown=node:node package*.json ./

# Switch to non-root user
USER node

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY --chown=node:node resume/ ./resume/
COPY --chown=node:node public/ ./public/
COPY --chown=node:node messages/ ./messages/

# Copy pre-generated PDF directory (generated in CI pipeline)
COPY --chown=node:node pdf/ ./pdf/

# Create a startup script that runs all servers
RUN echo '#!/bin/sh\n\
# Start English resume server\n\
echo "Starting English resume server on port 4000..."\n\
npx resume serve --resume ./resume/eng.json --port 4000 --theme kendall &\n\
\n\
# Start Russian resume server\n\
echo "Starting Russian resume server on port 4001..."\n\
npx resume serve --resume ./resume/rus.json --port 4001 --theme kendall &\n\
\n\
# Start PDF file server\n\
echo "Starting PDF file server on port 4002..."\n\
npx http-server ./pdf -p 4002 --cors &\n\
\n\
# Wait for all servers to start\n\
sleep 5\n\
\n\
echo "All servers are running:"\n\
echo "- English CV: http://localhost:4000"\n\
echo "- Russian CV: http://localhost:4001"\n\
echo "- PDF Files:  http://localhost:4002"\n\
echo "  - English PDF: http://localhost:4002/resume.eng.pdf"\n\
echo "  - Russian PDF: http://localhost:4002/resume.rus.pdf"\n\
\n\
# Keep the container running and show logs from all servers\n\
wait' > /home/node/app/start.sh && \
    chmod +x /home/node/app/start.sh && \
    chown node:node /home/node/app/start.sh

# Expose all ports (CV servers and PDF server)
EXPOSE 4000 4001 4002

# Health check for English version
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application with both language servers
CMD ["/home/node/app/start.sh"]
