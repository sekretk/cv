#!/bin/sh
# Create public directories for each resume server
mkdir -p public-eng public-rus

# Start PDF file server on port 6001
echo "Starting PDF file server on port 6001..."
cd /home/node/app && http-server ./pdf -p 6001 &
PDF_PID=$!

# Start English resume server on port 6002
echo "Starting English resume server on port 6002..."
cd /home/node/app && npm run serve:eng &
ENG_PID=$!

# Start Russian resume server on port 6003
echo "Starting Russian resume server on port 6003..."
cd /home/node/app && npm run serve:rus &
RUS_PID=$!

# Wait for all servers to start
sleep 8

echo "All servers are running:"
echo "- PDF Files:  http://localhost:6001 (PID: $PDF_PID)"
echo "  - English PDF: http://localhost:6001/resume.eng.pdf"
echo "  - Russian PDF: http://localhost:6001/resume.rus.pdf"
echo "- English CV: http://localhost:6002 (PID: $ENG_PID)"
echo "- Russian CV: http://localhost:6003 (PID: $RUS_PID)"

# Keep the container running and show logs from all servers
wait

