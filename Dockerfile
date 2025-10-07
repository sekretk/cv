FROM node:18-alpine3.19

# Set environment variable to skip Puppeteer download (PDFs generated in CI)
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Install global packages as root
RUN npm install -g http-server resume-cli && npm cache clean --force

# Create app directory and set ownership
RUN mkdir -p /home/node/app/node_modules && \
    chown -R node:node /home/node/app

WORKDIR /home/node/app

# Copy package files first for better layer caching
COPY --chown=node:node package*.json ./

# Switch to non-root user
USER node

# Install local dependencies
RUN npm i && npm cache clean --force

# Copy application files
COPY --chown=node:node resume/ ./resume/
COPY --chown=node:node theme/ ./theme/
# Copy pre-generated PDF directory (generated in CI pipeline)
COPY --chown=node:node pdf/ ./pdf/
# Copy startup script
COPY --chown=node:node start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose all ports (PDF: 6001, English CV: 6002, Russian CV: 6003)
EXPOSE 6001 6002 6003

# Start the application with all servers
CMD ["./start.sh"]
