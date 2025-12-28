#!/bin/bash
# test-direct-upload.sh - Test direct Cloudinary upload flow

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Direct Cloudinary Upload Test ===${NC}\n"

# Check environment variables
echo -e "${BLUE}1. Checking environment variables...${NC}"
if [ -z "$VITE_CLOUDINARY_CLOUD_NAME" ]; then
  echo -e "${RED}✗ VITE_CLOUDINARY_CLOUD_NAME not set${NC}"
  echo "  Run: export VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name"
  exit 1
fi
echo -e "${GREEN}✓ VITE_CLOUDINARY_CLOUD_NAME=${VITE_CLOUDINARY_CLOUD_NAME}${NC}"

if [ -z "$VITE_CLOUDINARY_UPLOAD_PRESET" ]; then
  echo -e "${RED}✗ VITE_CLOUDINARY_UPLOAD_PRESET not set${NC}"
  echo "  Run: export VITE_CLOUDINARY_UPLOAD_PRESET=your_preset"
  exit 1
fi
echo -e "${GREEN}✓ VITE_CLOUDINARY_UPLOAD_PRESET=${VITE_CLOUDINARY_UPLOAD_PRESET}${NC}\n"

# Create test file
echo -e "${BLUE}2. Creating test video file...${NC}"
# Create a small test video (5 frames)
ffmpeg -f lavfi -i testsrc=s=320x240:d=1 -f lavfi -i sine=f=1000:d=1 -c:v libx264 -c:a aac -y test-video.mp4 2>/dev/null
echo -e "${GREEN}✓ Test video created: test-video.mp4${NC}\n"

# Create test thumbnail
echo -e "${BLUE}3. Creating test thumbnail...${NC}"
ffmpeg -f lavfi -i color=c=blue:s=320x240:d=1 -frames:v 1 -y test-thumb.jpg 2>/dev/null
echo -e "${GREEN}✓ Test thumbnail created: test-thumb.jpg${NC}\n"

# Upload to Cloudinary
echo -e "${BLUE}4. Uploading to Cloudinary...${NC}"

VIDEO_RESPONSE=$(curl -s -F "file=@test-video.mp4" \
  -F "upload_preset=${VITE_CLOUDINARY_UPLOAD_PRESET}" \
  -F "cloud_name=${VITE_CLOUDINARY_CLOUD_NAME}" \
  https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/video/upload)

VIDEO_URL=$(echo $VIDEO_RESPONSE | jq -r '.secure_url' 2>/dev/null)

if [ -z "$VIDEO_URL" ] || [ "$VIDEO_URL" = "null" ]; then
  echo -e "${RED}✗ Video upload failed${NC}"
  echo "Response: $VIDEO_RESPONSE"
  exit 1
fi
echo -e "${GREEN}✓ Video uploaded${NC}"
echo "URL: $VIDEO_URL"

THUMB_RESPONSE=$(curl -s -F "file=@test-thumb.jpg" \
  -F "upload_preset=${VITE_CLOUDINARY_UPLOAD_PRESET}" \
  -F "cloud_name=${VITE_CLOUDINARY_CLOUD_NAME}" \
  https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload)

THUMB_URL=$(echo $THUMB_RESPONSE | jq -r '.secure_url' 2>/dev/null)

if [ -z "$THUMB_URL" ] || [ "$THUMB_URL" = "null" ]; then
  echo -e "${RED}✗ Thumbnail upload failed${NC}"
  echo "Response: $THUMB_RESPONSE"
  exit 1
fi
echo -e "${GREEN}✓ Thumbnail uploaded${NC}"
echo "URL: $THUMB_URL\n"

# Test backend endpoint
echo -e "${BLUE}5. Testing backend endpoint...${NC}"

# Get auth token (modify if needed for your setup)
# TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/users/login \
#   -H "Content-Type: application/json" \
#   -d '{"email":"test@example.com","password":"password"}' | jq -r '.data.accessToken')

# For now, just show the payload
echo "Would POST to: http://localhost:8000/api/v1/videos"
echo "With payload:"
cat << EOF
{
  "title": "Test Video",
  "description": "Test video from direct upload",
  "videoUrl": "$VIDEO_URL",
  "thumbnailUrl": "$THUMB_URL",
  "duration": 1
}
EOF

echo -e "\n${BLUE}6. Cleanup...${NC}"
rm -f test-video.mp4 test-thumb.jpg
echo -e "${GREEN}✓ Cleaned up test files${NC}\n"

echo -e "${GREEN}=== Test Complete ===${NC}"
echo -e "Video URL is ready to send to backend!"
echo -e "Thumbnail URL is ready to send to backend!\n"

echo -e "${BLUE}Next steps:${NC}"
echo "1. Copy the URLs above"
echo "2. Get your auth token from login"
echo "3. POST to /api/v1/videos with the URLs"
echo "4. Video will be created in MongoDB with Cloudinary URLs"
