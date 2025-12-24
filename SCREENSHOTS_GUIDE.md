# Screenshots Guide

This document lists all the screenshots needed for the User Guide and provides instructions for capturing them.

## Screenshot Checklist

### Getting Started (3 screenshots)

- [ ] **LOGIN_01_login_page.png** - Login page showing the Esports Dashboard login form
  - **Location**: `/login` page
  - **What to capture**: Full login form with email and password fields, "Sign In" button, and demo credentials section

- [ ] **LOGIN_02_login_filled.png** - Login form with demo credentials filled in
  - **Location**: `/login` page
  - **What to capture**: Form with `admin@esports.local` in email field and password field filled (masked)

- [ ] **DASHBOARD_01_homepage.png** - Dashboard homepage showing hero section and quick access cards
  - **Location**: `/` (homepage)
  - **What to capture**: Hero section with badge, title, description, and grid of 6 quick access cards (Organizations, Seasons, Teams, Matches, Standings, Announcements)

### Navigation (3 screenshots)

- [ ] **NAV_01_sidebar_full.png** - Sidebar navigation showing all menu items
  - **Location**: Any authenticated page
  - **What to capture**: Full sidebar with logo, organization selector, all navigation items, and user profile section

- [ ] **NAV_02_org_selector.png** - Organization selector dropdown showing available organizations
  - **Location**: Click organization selector in sidebar
  - **What to capture**: Dropdown menu showing list of organizations and "Create New Organization" option

- [ ] **NAV_03_user_profile.png** - User profile section in sidebar
  - **Location**: Bottom of sidebar
  - **What to capture**: User avatar, name, and dropdown menu with Settings and Logout options

### Organizations (3 screenshots)

- [ ] **ORG_01_list.png** - Organizations page showing grid of organization cards
  - **Location**: `/orgs` page
  - **What to capture**: Grid view of organization cards with "Create Organization" button visible

- [ ] **ORG_02_create_form.png** - Create organization form
  - **Location**: `/orgs/new` page
  - **What to capture**: Form with Name, Slug, and Description fields, plus Create and Cancel buttons

- [ ] **ORG_03_detail.png** - Organization detail page showing seasons and teams
  - **Location**: `/orgs/[id]` page
  - **What to capture**: Organization info card at top, then two-column layout showing Seasons section and Teams section

### Seasons (3 screenshots)

- [ ] **SEASON_01_list.png** - Seasons page showing grid of season cards
  - **Location**: `/seasons` page
  - **What to capture**: Grid of season cards with status badges and dates

- [ ] **SEASON_02_create_form.png** - Create season form with all fields
  - **Location**: `/seasons/new` page
  - **What to capture**: Form showing Season Name, Slug, Game Title ID, Start Date, End Date, Description fields

- [ ] **SEASON_03_detail.png** - Season detail page showing teams and matches
  - **Location**: `/seasons/[id]` page
  - **What to capture**: Season header card, then two-column layout with Teams section and Matches section, plus Quick Actions

### Teams (4 screenshots)

- [ ] **TEAM_01_list.png** - Teams page showing team cards with logos
  - **Location**: `/teams` page
  - **What to capture**: Grid of team cards showing team logos/avatars, names, coaches, and status badges

- [ ] **TEAM_02_create_form.png** - Create team form
  - **Location**: `/teams/new` page
  - **What to capture**: Form with Season selector, Team Name, Slug, Description fields

- [ ] **TEAM_03_detail_roster.png** - Team detail page showing roster table
  - **Location**: `/teams/[id]` page
  - **What to capture**: Team info card with logo, then roster table showing Player, Position, Jersey #, Status, Actions columns

- [ ] **TEAM_04_add_player.png** - Add player to roster form
  - **Location**: `/teams/[id]/roster/add` page
  - **What to capture**: Form with Player selector, Position, and Jersey Number fields

### Matches (6 screenshots)

- [ ] **MATCH_01_list.png** - Matches page showing table of matches
  - **Location**: `/matches` page
  - **What to capture**: Table with Match, Scheduled, Status, Actions columns, showing multiple matches

- [ ] **MATCH_02_create_form.png** - Create match form
  - **Location**: `/matches/new` page
  - **What to capture**: Form with Season, Team 1, Team 2, Match Name, Scheduled At, Best Of fields

- [ ] **MATCH_03_detail_overview.png** - Match detail page showing all sections
  - **Location**: `/matches/[id]` page
  - **What to capture**: Match header, Teams section, and Result Submission section (if applicable)

- [ ] **MATCH_04_submit_result.png** - Result submission form showing score inputs
  - **Location**: `/matches/[id]` page (when status allows submission)
  - **What to capture**: Submit Result card with game score inputs (0/1 fields) for each game in best-of series

- [ ] **MATCH_05_result_filled.png** - Completed result submission form with scores filled in
  - **Location**: `/matches/[id]` page
  - **What to capture**: Form with scores entered (e.g., Game 1: 1, Game 2: 0, Game 3: 1) and "Current Scores" preview

- [ ] **MATCH_06_confirm_result.png** - Result confirmation section showing submitted results
  - **Location**: `/matches/[id]` page (when status is results_submitted)
  - **What to capture**: Result Submissions section showing submitted results, plus Confirm Result and Dispute Result buttons

### Standings (2 screenshots)

- [ ] **STANDINGS_01_page.png** - Standings page with season selector and standings table
  - **Location**: `/standings` page
  - **What to capture**: Season selector dropdown at top, then standings table with Rank, Team, W, L, D, MP, Points, Win % columns

- [ ] **STANDINGS_02_table_detail.png** - Standings table with highlighted columns
  - **Location**: `/standings` page (with data)
  - **What to capture**: Close-up of standings table showing multiple teams with different ranks, including first place with trophy emoji

### Announcements (3 screenshots)

- [ ] **ANNOUNCE_01_list.png** - Announcements page showing announcement cards
  - **Location**: `/announcements` page
  - **What to capture**: List of announcement cards, with pinned announcement at top (yellow badge visible)

- [ ] **ANNOUNCE_02_create_form.png** - Create announcement form
  - **Location**: `/announcements/new` page
  - **What to capture**: Form with Title, Content, Scope selector, Season selector (conditional), Pin checkbox, Publish Date fields

- [ ] **ANNOUNCE_03_card_detail.png** - Announcement card showing pinned badge and scope
  - **Location**: `/announcements` page
  - **What to capture**: Individual announcement card showing pinned badge, scope badge, title, content, author, and date

### Notifications (3 screenshots)

- [ ] **NOTIF_01_list.png** - Notifications page showing notification cards
  - **Location**: `/notifications` page
  - **What to capture**: List of notification cards, some with unread indicators (blue dots)

- [ ] **NOTIF_02_types.png** - Different notification types displayed
  - **Location**: `/notifications` page
  - **What to capture**: Multiple notification cards showing different types (match scheduled, result submitted, etc.)

- [ ] **NOTIF_03_mark_read.png** - Notification with mark as read button
  - **Location**: `/notifications` page
  - **What to capture**: Unread notification card with "Mark read" button visible

## How to Capture Screenshots

### Using Browser Developer Tools

1. Open the application in your browser
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Use the device toolbar to set a consistent viewport size (e.g., 1920x1080)
4. Navigate to the page you want to screenshot
5. Use browser extensions or built-in screenshot tools:
   - Chrome: Use extensions like "Full Page Screen Capture" or "Awesome Screenshot"
   - Firefox: Use built-in screenshot tool (Shift+F2, then `screenshot --fullpage`)
   - Safari: Use Cmd+Shift+4 for area selection

### Recommended Settings

- **Viewport Size**: 1920x1080 or 1440x900 for consistency
- **Format**: PNG for best quality
- **Naming**: Use the exact filenames listed above
- **Location**: Save to `/docs/screenshots/` directory (create if needed)

### Tips for Good Screenshots

1. **Use consistent browser zoom**: Set to 100% (Cmd/Ctrl + 0)
2. **Hide browser UI**: Use full-screen mode (F11) or hide bookmarks bar
3. **Use demo data**: Ensure you have sample data loaded for realistic screenshots
4. **Highlight active elements**: If showing interactions, use browser highlighting or annotations
5. **Consistent theme**: Use dark mode consistently (or light mode, but be consistent)
6. **Clean state**: Clear any test data or use fresh demo data

## Screenshot Organization

Create a directory structure:

```
docs/
  screenshots/
    login/
      LOGIN_01_login_page.png
      LOGIN_02_login_filled.png
    navigation/
      NAV_01_sidebar_full.png
      NAV_02_org_selector.png
      NAV_03_user_profile.png
    organizations/
      ORG_01_list.png
      ORG_02_create_form.png
      ORG_03_detail.png
    seasons/
      SEASON_01_list.png
      SEASON_02_create_form.png
      SEASON_03_detail.png
    teams/
      TEAM_01_list.png
      TEAM_02_create_form.png
      TEAM_03_detail_roster.png
      TEAM_04_add_player.png
    matches/
      MATCH_01_list.png
      MATCH_02_create_form.png
      MATCH_03_detail_overview.png
      MATCH_04_submit_result.png
      MATCH_05_result_filled.png
      MATCH_06_confirm_result.png
    standings/
      STANDINGS_01_page.png
      STANDINGS_02_table_detail.png
    announcements/
      ANNOUNCE_01_list.png
      ANNOUNCE_02_create_form.png
      ANNOUNCE_03_card_detail.png
    notifications/
      NOTIF_01_list.png
      NOTIF_02_types.png
      NOTIF_03_mark_read.png
```

## Adding Screenshots to User Guide

Once screenshots are captured, update `USER_GUIDE.md` by replacing the placeholder text:

**Before:**
```
> 📸 **Screenshot Placeholder:** Login page showing the Esports Dashboard login form
```

**After:**
```
![Login Page](docs/screenshots/login/LOGIN_01_login_page.png)
*Login page showing the Esports Dashboard login form*
```

## Quick Capture Script

You can use this approach to quickly capture all screenshots:

1. Start the application: `docker-compose up`
2. Login with demo credentials
3. Navigate through each section systematically
4. Capture screenshots using your preferred method
5. Organize them in the directory structure above
6. Update USER_GUIDE.md with image references

## Notes

- Screenshots should show realistic data (use the demo seeder data)
- Ensure all UI elements are visible and not cut off
- Use consistent styling (dark mode recommended for this app)
- Crop to remove unnecessary browser chrome if needed
- Consider adding annotations for complex workflows

