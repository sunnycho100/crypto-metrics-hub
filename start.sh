#!/bin/bash

# Function to extract port from Vite output
get_vite_port() {
    local output="$1"
    echo "$output" | grep -o "http://localhost:[0-9]*" | head -1 | grep -o "[0-9]*$"
}

# Start the development server and capture output
echo "Starting development server..."
npm run dev > vite_output.log 2>&1 &
DEV_PID=$!

# Wait for the server to start and extract the port
echo "Waiting for server to start..."
PORT=""
TIMEOUT=10
COUNTER=0

while [ $COUNTER -lt $TIMEOUT ]; do
    if [ -f vite_output.log ]; then
        # Check if Vite has started and extract port
        if grep -q "ready in" vite_output.log; then
            PORT=$(get_vite_port "$(cat vite_output.log)")
            if [ ! -z "$PORT" ]; then
                echo "Server started on port $PORT"
                break
            fi
        fi
    fi
    sleep 1
    COUNTER=$((COUNTER + 1))
done

# If we couldn't detect the port, default to 3000
if [ -z "$PORT" ]; then
    PORT="3000"
    echo "Could not detect port, defaulting to 3000"
fi

# Open the browser with the detected port
echo "Opening browser at http://localhost:$PORT"
open "http://localhost:$PORT"

# Display the server output in real-time
tail -f vite_output.log &
TAIL_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "Stopping server..."
    kill $DEV_PID 2>/dev/null
    kill $TAIL_PID 2>/dev/null
    rm -f vite_output.log
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for the dev server process
wait $DEV_PID
