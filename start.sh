#!/bin/bash

# Start the development server
npm run dev &

# Wait for the server to start
echo "Waiting for server to start..."
sleep 3

# Open the browser
open http://localhost:3000

# Wait for user to stop the server
wait
