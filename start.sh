#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  BTC Metrics Hub - Starting All Services${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to extract port from Vite output
get_vite_port() {
    local output="$1"
    echo "$output" | grep -o "http://localhost:[0-9]*" | head -1 | grep -o "[0-9]*$"
}

# Check if server directory exists
if [ ! -d "server" ]; then
    echo -e "${YELLOW}Warning: server directory not found. Skipping backend server.${NC}"
    BACKEND_ENABLED=false
else
    BACKEND_ENABLED=true
fi

# Start the backend server if it exists
if [ "$BACKEND_ENABLED" = true ]; then
    echo -e "${GREEN}[1/2] Starting backend server (Express)...${NC}"
    cd server
    npm run dev > ../backend_output.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    echo "Waiting for backend server..."
    BACKEND_READY=false
    TIMEOUT=10
    COUNTER=0
    
    while [ $COUNTER -lt $TIMEOUT ]; do
        if [ -f backend_output.log ]; then
            if grep -q "Server running on" backend_output.log; then
                echo -e "${GREEN}✓ Backend server started on port 3001${NC}\n"
                BACKEND_READY=true
                break
            fi
        fi
        sleep 1
        COUNTER=$((COUNTER + 1))
    done
    
    if [ "$BACKEND_READY" = false ]; then
        echo -e "${YELLOW}⚠ Backend server may not have started properly${NC}\n"
    fi
fi

# Start the frontend development server
echo -e "${GREEN}[2/2] Starting frontend server (Vite)...${NC}"
npm run dev > vite_output.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start and extract the port
echo "Waiting for frontend server..."
PORT=""
TIMEOUT=15
COUNTER=0

while [ $COUNTER -lt $TIMEOUT ]; do
    if [ -f vite_output.log ]; then
        # Check if Vite has started and extract port
        if grep -q "ready in" vite_output.log; then
            PORT=$(get_vite_port "$(cat vite_output.log)")
            if [ ! -z "$PORT" ]; then
                echo -e "${GREEN}✓ Frontend server started on port $PORT${NC}\n"
                break
            fi
        fi
    fi
    sleep 1
    COUNTER=$((COUNTER + 1))
done

# If we couldn't detect the port, default to 5173
if [ -z "$PORT" ]; then
    PORT="5173"
    echo -e "${YELLOW}⚠ Could not detect port, defaulting to $PORT${NC}\n"
fi

# Display status
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}All services are running!${NC}"
echo -e "${BLUE}========================================${NC}"
if [ "$BACKEND_ENABLED" = true ]; then
    echo -e "Backend:  ${GREEN}http://localhost:3001${NC}"
fi
echo -e "Frontend: ${GREEN}http://localhost:$PORT${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}\n"
echo -e "${BLUE}========================================${NC}\n"

# Open the browser with the detected port
echo -e "Opening browser at http://localhost:$PORT\n"
open "http://localhost:$PORT" 2>/dev/null || xdg-open "http://localhost:$PORT" 2>/dev/null

# Display combined server output in real-time
if [ "$BACKEND_ENABLED" = true ]; then
    echo -e "${BLUE}--- Server Logs (Frontend & Backend) ---${NC}\n"
    tail -f vite_output.log backend_output.log &
    TAIL_PID=$!
else
    echo -e "${BLUE}--- Server Logs (Frontend Only) ---${NC}\n"
    tail -f vite_output.log &
    TAIL_PID=$!
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all services...${NC}"
    kill $FRONTEND_PID 2>/dev/null
    if [ "$BACKEND_ENABLED" = true ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    kill $TAIL_PID 2>/dev/null
    rm -f vite_output.log backend_output.log
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for the frontend process (main process)
wait $FRONTEND_PID
