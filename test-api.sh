#!/bin/bash

# API Testing Script for Full Stack Project
# Make sure your server is running on port 8000 before running this script

BASE_URL="http://localhost:8000"

echo "🔍 Testing API endpoints..."
echo "========================================"

echo "1. Health Check:"
curl -s "$BASE_URL/health" | jq '.' 2>/dev/null || curl -s "$BASE_URL/health"

echo -e "\n2. API Health Check:"
curl -s "$BASE_URL/api/v1/healthcheck" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/v1/healthcheck"

echo -e "\n3. 404 Error Test:"
curl -s "$BASE_URL/api/invalid-route" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/invalid-route"

echo -e "\n4. Custom Error Test:"
curl -s "$BASE_URL/api/v1/test/error" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/v1/test/error"

echo -e "\n5. Async Error Test:"
curl -s "$BASE_URL/api/v1/test/async-error" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/v1/test/async-error"

echo -e "\n6. Database Error Test (Invalid ID):"
curl -s "$BASE_URL/api/v1/test/db-error/invalid-id" | jq '.' 2>/dev/null || curl -s "$BASE_URL/api/v1/test/db-error/invalid-id"

echo -e "\n========================================"
echo "✅ Basic tests completed!"
echo "💡 Note: Install 'jq' for better JSON formatting: sudo apt install jq"
