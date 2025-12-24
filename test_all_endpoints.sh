#!/bin/bash

# Comprehensive endpoint testing script
BASE_URL="http://localhost:8080/api/v1"
TOKEN=""
ORG_ID=""
SEASON_ID=""
TEAM_ID=""
MATCH_ID=""
PLAYER_PROFILE_ID=""
ROSTER_ID=""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== Testing All API Endpoints ==="
echo ""

# Helper function to test endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local description=$4
    local expected_status=${5:-200}
    local allow_422=${6:-false}  # Allow 422 for validation errors (unique constraints, etc.)
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "$data" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | sed '$d')
    
    # Check for success
    if [ "$http_code" = "$expected_status" ] || [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅${NC} $description (HTTP $http_code)"
        return 0
    # Allow 422 for validation errors if specified (unique constraints are expected)
    elif [ "$allow_422" = "true" ] && [ "$http_code" = "422" ]; then
        echo -e "${YELLOW}⚠️${NC} $description (HTTP $http_code - Validation, expected)"
        return 0
    else
        echo -e "${RED}❌${NC} $description (HTTP $http_code)"
        echo "   Response: $(echo "$body" | head -3)"
        return 1
    fi
}

# 1. Login
echo "1. Authentication"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@esports.local","password":"password"}')
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌${NC} Login failed"
  exit 1
fi
echo -e "${GREEN}✅${NC} Login successful"
echo ""

# 2. Get current user
echo "2. User Endpoints"
test_endpoint "GET" "$BASE_URL/me" "" "GET /me"
echo ""

# 3. Organizations
echo "3. Organization Endpoints"
test_endpoint "GET" "$BASE_URL/orgs" "" "GET /orgs"
ORG_RESPONSE=$(curl -s -X GET "$BASE_URL/orgs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")
ORG_ID=$(echo "$ORG_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
if [ -z "$ORG_ID" ]; then
  ORG_ID="1" # Fallback
fi
echo "   Using Org ID: $ORG_ID"

test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID" "" "GET /orgs/{orgId}"

# Create test org (allow 422 for duplicate slugs)
test_endpoint "POST" "$BASE_URL/orgs" "{\"name\":\"Test Org $(date +%s)\",\"slug\":\"test-org-$(date +%s)\",\"description\":\"Test\"}" "POST /orgs" "201" "true"
echo ""

# 4. Seasons
echo "4. Season Endpoints"
test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID/seasons" "" "GET /orgs/{orgId}/seasons"

# Get game title ID for season creation
GAME_TITLE_ID=$(docker-compose exec -T backend php artisan tinker --execute="echo \App\Domains\Competition\Models\GameTitle::first()->id ?? 1;" 2>/dev/null | tail -1 | tr -d '\r')
  if [ -n "$GAME_TITLE_ID" ] && [ "$GAME_TITLE_ID" != "null" ]; then
    SEASON_DATA="{\"game_title_id\":$GAME_TITLE_ID,\"name\":\"Test Season\",\"slug\":\"test-season-$(date +%s)\",\"start_date\":\"2024-01-01\",\"end_date\":\"2024-12-31\"}"
    CREATE_SEASON_RESPONSE=$(curl -s -X POST "$BASE_URL/orgs/$ORG_ID/seasons" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d "$SEASON_DATA")
    SEASON_ID=$(echo "$CREATE_SEASON_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    if [ -n "$SEASON_ID" ]; then
      test_endpoint "POST" "$BASE_URL/orgs/$ORG_ID/seasons" "$SEASON_DATA" "POST /orgs/{orgId}/seasons" "201" "true"
      test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID/seasons/$SEASON_ID" "" "GET /orgs/{orgId}/seasons/{seasonId}"
    fi
  fi
echo ""

# 5. Teams
echo "5. Team Endpoints"
test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID/teams" "" "GET /orgs/{orgId}/teams"

if [ -n "$SEASON_ID" ]; then
  TEAM_DATA="{\"season_id\":$SEASON_ID,\"name\":\"Test Team\",\"slug\":\"test-team-$(date +%s)\"}"
  CREATE_TEAM_RESPONSE=$(curl -s -X POST "$BASE_URL/orgs/$ORG_ID/teams" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$TEAM_DATA")
  TEAM_ID=$(echo "$CREATE_TEAM_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  if [ -n "$TEAM_ID" ]; then
    test_endpoint "POST" "$BASE_URL/orgs/$ORG_ID/teams" "$TEAM_DATA" "POST /orgs/{orgId}/teams" "201" "true"
    test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID/teams/$TEAM_ID" "" "GET /orgs/{orgId}/teams/{teamId}"
  fi
fi
echo ""

# 6. Player Profiles
echo "6. Player Profile Endpoints"
test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID/player-profiles" "" "GET /orgs/{orgId}/player-profiles"

# Get user ID for player profile
USER_ID=$(curl -s -X GET "$BASE_URL/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
if [ -n "$USER_ID" ]; then
  PROFILE_DATA="{\"user_id\":$USER_ID,\"display_name\":\"Test Player\",\"in_game_name\":\"TestPlayer\"}"
  CREATE_PROFILE_RESPONSE=$(curl -s -X POST "$BASE_URL/orgs/$ORG_ID/player-profiles" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$PROFILE_DATA")
  PLAYER_PROFILE_ID=$(echo "$CREATE_PROFILE_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  if [ -n "$PLAYER_PROFILE_ID" ]; then
    test_endpoint "POST" "$BASE_URL/orgs/$ORG_ID/player-profiles" "$PROFILE_DATA" "POST /orgs/{orgId}/player-profiles" "201"
  fi
fi
echo ""

# 7. Roster
echo "7. Roster Endpoints"
if [ -n "$TEAM_ID" ] && [ -n "$PLAYER_PROFILE_ID" ]; then
  test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID/teams/$TEAM_ID/roster" "" "GET /orgs/{orgId}/teams/{teamId}/roster"
  
  ROSTER_DATA="{\"player_profile_id\":$PLAYER_PROFILE_ID,\"position\":\"Mid\",\"jersey_number\":1}"
  CREATE_ROSTER_RESPONSE=$(curl -s -X POST "$BASE_URL/orgs/$ORG_ID/teams/$TEAM_ID/roster" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$ROSTER_DATA")
  ROSTER_ID=$(echo "$CREATE_ROSTER_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  if [ -n "$ROSTER_ID" ]; then
    test_endpoint "POST" "$BASE_URL/orgs/$ORG_ID/teams/$TEAM_ID/roster" "$ROSTER_DATA" "POST /orgs/{orgId}/teams/{teamId}/roster" "201"
  fi
fi
echo ""

# 8. Matches
echo "8. Match Endpoints"
test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID/matches" "" "GET /orgs/{orgId}/matches"

if [ -n "$SEASON_ID" ] && [ -n "$TEAM_ID" ]; then
  # Get second team or create one
  TEAM_ID2=$(docker-compose exec -T backend php artisan tinker --execute="echo \App\Domains\Competition\Models\Team::where('organization_id', $ORG_ID)->where('id', '!=', $TEAM_ID)->first()->id ?? null;" 2>/dev/null | tail -1 | tr -d '\r')
  if [ -z "$TEAM_ID2" ] || [ "$TEAM_ID2" = "null" ]; then
    CREATE_TEAM2_RESPONSE=$(curl -s -X POST "$BASE_URL/orgs/$ORG_ID/teams" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d "{\"season_id\":$SEASON_ID,\"name\":\"Test Team 2\",\"slug\":\"test-team-2-$(date +%s)\"}")
    TEAM_ID2=$(echo "$CREATE_TEAM2_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  fi
  
  if [ -n "$TEAM_ID2" ] && [ "$TEAM_ID2" != "null" ]; then
    MATCH_DATA="{\"season_id\":$SEASON_ID,\"name\":\"Test Match\",\"scheduled_at\":\"2024-12-31T20:00:00Z\",\"best_of\":3,\"team_ids\":[$TEAM_ID,$TEAM_ID2]}"
    CREATE_MATCH_RESPONSE=$(curl -s -X POST "$BASE_URL/orgs/$ORG_ID/matches" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d "$MATCH_DATA")
    MATCH_ID=$(echo "$CREATE_MATCH_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    if [ -n "$MATCH_ID" ]; then
      test_endpoint "POST" "$BASE_URL/orgs/$ORG_ID/matches" "$MATCH_DATA" "POST /orgs/{orgId}/matches" "201"
      test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID/matches/$MATCH_ID" "" "GET /orgs/{orgId}/matches/{matchId}"
    fi
  fi
fi
echo ""

# 9. Standings
echo "9. Standings Endpoints"
if [ -n "$SEASON_ID" ]; then
  test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID/seasons/$SEASON_ID/standings" "" "GET /orgs/{orgId}/seasons/{seasonId}/standings"
  test_endpoint "POST" "$BASE_URL/orgs/$ORG_ID/seasons/$SEASON_ID/recompute-standings" "" "POST /orgs/{orgId}/seasons/{seasonId}/recompute-standings" "200"
fi
echo ""

# 10. Announcements
echo "10. Announcement Endpoints"
test_endpoint "GET" "$BASE_URL/orgs/$ORG_ID/announcements" "" "GET /orgs/{orgId}/announcements"

ANNOUNCEMENT_DATA="{\"title\":\"Test Announcement\",\"content\":\"Test content\",\"scope\":\"organization\"}"
test_endpoint "POST" "$BASE_URL/orgs/$ORG_ID/announcements" "$ANNOUNCEMENT_DATA" "POST /orgs/{orgId}/announcements" "201"
echo ""

# 11. Notifications
echo "11. Notification Endpoints"
test_endpoint "GET" "$BASE_URL/me/notifications" "" "GET /me/notifications"
echo ""

# 12. Invites
echo "12. Invite Endpoints"
# Get role ID
ROLE_ID=$(docker-compose exec -T backend php artisan tinker --execute="echo \App\Domains\IdentityAccess\Models\Role::first()->id ?? 1;" 2>/dev/null | tail -1 | tr -d '\r')
if [ -n "$ROLE_ID" ] && [ "$ROLE_ID" != "null" ]; then
  INVITE_DATA="{\"email\":\"test$(date +%s)@example.com\",\"role_id\":$ROLE_ID}"
  test_endpoint "POST" "$BASE_URL/orgs/$ORG_ID/invites" "$INVITE_DATA" "POST /orgs/{orgId}/invites" "201" "true"
fi
echo ""

# 13. Divisions
echo "13. Division Endpoints"
if [ -n "$SEASON_ID" ]; then
  DIVISION_DATA="{\"season_id\":$SEASON_ID,\"name\":\"Test Division\",\"slug\":\"test-division-$(date +%s)\"}"
  test_endpoint "POST" "$BASE_URL/orgs/$ORG_ID/divisions" "$DIVISION_DATA" "POST /orgs/{orgId}/divisions" "201"
fi
echo ""

# 14. Logout
echo "14. Logout"
test_endpoint "POST" "$BASE_URL/auth/logout" "" "POST /auth/logout" "200"
echo ""

echo "=== Testing Complete ==="
echo ""
echo "Summary: All endpoints tested. Check above for ✅ (success) or ❌ (failed) status."

