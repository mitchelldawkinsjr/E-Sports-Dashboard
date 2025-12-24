# Esports Dashboard - User Guide

Welcome to the Esports Dashboard! This guide will help you learn how to use all the features of the platform to manage your esports competitions.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Organizations](#organizations)
4. [Seasons](#seasons)
5. [Teams](#teams)
6. [Matches](#matches)
7. [Standings](#standings)
8. [Announcements](#announcements)
9. [Notifications](#notifications)
10. [Tips & Best Practices](#tips--best-practices)

---

## Getting Started

### Accessing the Application

1. Open your web browser and navigate to: **http://localhost:4000**
2. You'll see the login page

> 📸 **Screenshot Placeholder:** Login page showing the Esports Dashboard login form

### Logging In

1. Enter your email address in the **Email** field
2. Enter your password in the **Password** field
3. Click the **Sign In** button

**Demo Credentials:**
- **Email:** `admin@esports.local`
- **Password:** `password`

> 📸 **Screenshot Placeholder:** Login form with demo credentials filled in

### First Login Experience

After logging in, you'll be redirected to the dashboard homepage. If you don't have an organization selected, you'll need to create or select one.

> 📸 **Screenshot Placeholder:** Dashboard homepage showing the hero section and quick access cards

---

## Dashboard Overview

The dashboard is your central hub for managing all aspects of your esports competitions.

### Navigation Sidebar

The left sidebar provides quick access to all major features:

- **🏢 Organizations** - Manage your organizations
- **📅 Seasons** - Create and manage competition seasons
- **👥 Teams** - Manage teams and rosters
- **🎮 Matches** - Schedule and manage matches
- **📊 Standings** - View league standings
- **📢 Announcements** - View and create announcements
- **🔔 Notifications** - View your notifications

> 📸 **Screenshot Placeholder:** Sidebar navigation showing all menu items

### Organization Selector

At the top of the sidebar, you'll see the organization selector. Click it to:
- Switch between organizations
- Create a new organization

> 📸 **Screenshot Placeholder:** Organization selector dropdown showing available organizations

### User Profile

At the bottom of the sidebar, click your profile to:
- Access settings
- Logout

> 📸 **Screenshot Placeholder:** User profile section in sidebar

---

## Organizations

Organizations are the top-level containers for all your competition data. Each organization is completely isolated from others.

### Viewing Organizations

1. Click **Organizations** in the sidebar
2. You'll see a grid of all organizations you have access to

> 📸 **Screenshot Placeholder:** Organizations page showing a grid of organization cards

### Creating a New Organization

1. Click **Organizations** in the sidebar
2. Click the **Create Organization** button in the top right
3. Fill in the form:
   - **Organization Name** (required): Enter a descriptive name
   - **Slug** (required): URL-friendly identifier (auto-generated from name if left empty)
   - **Description** (optional): Add details about your organization
4. Click **Create Organization**

> 📸 **Screenshot Placeholder:** Create organization form

### Organization Details

Click on any organization card to view its details page, which shows:
- Organization information
- Associated seasons
- Associated teams
- Quick actions to create new seasons or teams

> 📸 **Screenshot Placeholder:** Organization detail page showing seasons and teams sections

---

## Seasons

Seasons represent a competition period (e.g., "Spring 2024", "Championship Season").

### Viewing Seasons

1. Click **Seasons** in the sidebar
2. You'll see all seasons for your current organization

> 📸 **Screenshot Placeholder:** Seasons page showing a grid of season cards

### Creating a Season

1. Click **Seasons** in the sidebar
2. Click **Create Season** button
3. Fill in the form:
   - **Season Name** (required): e.g., "Spring 2024 Championship"
   - **Slug** (optional): Auto-generated if left empty
   - **Game Title ID** (required): Enter the game title ID (check database for available IDs)
   - **Start Date** (required): When the season begins
   - **End Date** (required): When the season ends
   - **Description** (optional): Additional details
4. Click **Create Season**

> 📸 **Screenshot Placeholder:** Create season form with all fields

### Season Details

Click on any season card to view:
- Season information and status
- Associated teams
- Scheduled matches
- Quick actions (view standings, schedule match, add team)

> 📸 **Screenshot Placeholder:** Season detail page showing teams and matches

---

## Teams

Teams are groups of players competing in your seasons.

### Viewing Teams

1. Click **Teams** in the sidebar
2. You'll see all teams for your current organization

> 📸 **Screenshot Placeholder:** Teams page showing team cards with logos and information

### Creating a Team

1. Click **Teams** in the sidebar
2. Click **Create Team** button
3. Fill in the form:
   - **Season** (required): Select which season this team belongs to
   - **Team Name** (required): e.g., "Thunderbolts"
   - **Slug** (optional): Auto-generated if left empty
   - **Description** (optional): Team description
4. Click **Create Team**

> 📸 **Screenshot Placeholder:** Create team form

### Team Details

Click on any team card to view:
- Team information (name, season, division, coach)
- **Roster** table showing all players
- Actions to add or remove players

> 📸 **Screenshot Placeholder:** Team detail page showing roster table

### Managing Roster

#### Adding a Player

1. Navigate to the team detail page
2. Click **+ Add Player** button
3. Fill in the form:
   - **Player** (required): Select from available player profiles
   - **Position** (optional): e.g., "Top", "Jungle", "Mid", "ADC", "Support"
   - **Jersey Number** (optional): Player's jersey number
4. Click **Add Player**

> 📸 **Screenshot Placeholder:** Add player to roster form

#### Removing a Player

1. Navigate to the team detail page
2. Find the player in the roster table
3. Click **Remove** button next to the player
4. Confirm the removal in the dialog

> 📸 **Screenshot Placeholder:** Roster table with remove button highlighted

---

## Matches

Matches are individual games between teams.

### Viewing Matches

1. Click **Matches** in the sidebar
2. You'll see a table of all matches with:
   - Match name
   - Scheduled time
   - Status
   - Actions

> 📸 **Screenshot Placeholder:** Matches page showing table of matches

### Creating a Match

1. Click **Matches** in the sidebar
2. Click **Create Match** button
3. Fill in the form:
   - **Season** (required): Select the season
   - **Team 1** (required): Select first team
   - **Team 2** (required): Select second team
   - **Match Name** (optional): Auto-generated if left empty
   - **Scheduled At** (required): Date and time for the match
   - **Best Of** (required): Select best-of-1, 3, 5, or 7
4. Click **Create Match**

> 📸 **Screenshot Placeholder:** Create match form

### Match Details

Click on any match to view:
- Match information (status, scheduled time, best-of)
- Participating teams
- Result submission form (if applicable)
- Result submissions history
- Confirmation options

> 📸 **Screenshot Placeholder:** Match detail page showing all sections

### Submitting Match Results

When a match is ready for results:

1. Navigate to the match detail page
2. Scroll to the **Submit Result** section
3. For each game in the best-of series, enter:
   - **1** for a win
   - **0** for a loss
4. (Optional) Add notes about the match
5. Click **Submit Result**

> 📸 **Screenshot Placeholder:** Result submission form showing score inputs

**Example for Best-of-3:**
- Game 1: Enter `1` (win)
- Game 2: Enter `0` (loss)
- Game 3: Enter `1` (win)

The system will automatically determine which team you're submitting for based on your coach relationship.

> 📸 **Screenshot Placeholder:** Completed result submission form with scores filled in

### Confirming Match Results

After both teams submit results:

1. Navigate to the match detail page
2. Scroll to the **Confirm Result** section
3. Review the submitted results
4. Click **Confirm Result** to approve, or **Dispute Result** if there's an issue

> 📸 **Screenshot Placeholder:** Result confirmation section showing submitted results

### Viewing Confirmed Results

Once results are confirmed:
- The match status changes to "Results Confirmed"
- Standings are automatically updated
- A confirmation message is displayed

> 📸 **Screenshot Placeholder:** Confirmed result showing success message

---

## Standings

Standings show the current rankings for teams in a season.

### Viewing Standings

1. Click **Standings** in the sidebar
2. Select a season from the dropdown
3. View the standings table showing:
   - Rank
   - Team name
   - Wins (W)
   - Losses (L)
   - Draws (D)
   - Matches Played (MP)
   - Points
   - Win Percentage

> 📸 **Screenshot Placeholder:** Standings page with season selector and standings table

### Understanding Standings

- **Rank**: Team's position in the standings (🏆 for first place)
- **Points**: Calculated based on wins, losses, and draws
- **Win %**: Win percentage (wins / total matches)
- Standings update automatically when match results are confirmed

> 📸 **Screenshot Placeholder:** Standings table with highlighted columns

---

## Announcements

Announcements keep your organization and teams informed.

### Viewing Announcements

1. Click **Announcements** in the sidebar
2. You'll see all announcements, with pinned announcements at the top

> 📸 **Screenshot Placeholder:** Announcements page showing announcement cards

### Creating an Announcement

1. Click **Announcements** in the sidebar
2. Click **+ New Announcement** button
3. Fill in the form:
   - **Title** (required): Announcement headline
   - **Content** (required): Full announcement text
   - **Scope** (required): 
     - **Organization-wide**: Visible to all in the organization
     - **Season-specific**: Only for a specific season
   - **Season** (if scope is season-specific): Select the season
   - **Pin this announcement**: Check to keep it at the top
   - **Publish Date** (optional): Schedule for later (leave empty for immediate)
4. Click **Create Announcement**

> 📸 **Screenshot Placeholder:** Create announcement form

### Announcement Features

- **Pinned announcements** appear at the top with a yellow badge
- **Scope badges** show whether it's organization-wide or season-specific
- **Author and date** information is displayed

> 📸 **Screenshot Placeholder:** Announcement card showing pinned badge and scope

---

## Notifications

Notifications alert you to important events.

### Viewing Notifications

1. Click **Notifications** in the sidebar (or the bell icon)
2. You'll see all your notifications
3. Unread notifications have a blue indicator

> 📸 **Screenshot Placeholder:** Notifications page showing notification cards

### Notification Types

You'll receive notifications for:
- Match scheduled
- Result submitted (awaiting your confirmation)
- Result confirmed
- Dispute created
- Team roster changes
- And more

> 📸 **Screenshot Placeholder:** Different notification types displayed

### Marking as Read

1. Click **Mark read** on any unread notification
2. Or click **Mark all as read** at the top to clear all

> 📸 **Screenshot Placeholder:** Notification with mark as read button

---

## Tips & Best Practices

### Workflow Recommendations

1. **Start with Organizations**: Create your organization first
2. **Create Seasons**: Set up seasons before creating teams
3. **Build Teams**: Create teams and add players to rosters
4. **Schedule Matches**: Create matches between teams
5. **Submit Results**: After matches, submit results promptly
6. **Confirm Results**: Review and confirm submitted results
7. **Monitor Standings**: Check standings regularly

### Best Practices

- **Use descriptive names**: Clear names help everyone understand what they're looking at
- **Fill in descriptions**: Add context to help team members understand
- **Submit results promptly**: Keep standings up to date
- **Use announcements**: Keep your organization informed about important updates
- **Check notifications**: Stay on top of pending actions

### Common Workflows

#### Running a Complete Season

1. Create or select your organization
2. Create a new season with start/end dates
3. Create teams for the season
4. Add players to team rosters
5. Schedule matches between teams
6. After matches, submit results
7. Confirm results when both teams have submitted
8. View updated standings
9. Create announcements for important updates

#### Adding a New Team Mid-Season

1. Navigate to Teams
2. Click Create Team
3. Select the current season
4. Fill in team details
5. Add players to the roster
6. Schedule matches for the new team

#### Handling a Dispute

1. Navigate to the match in question
2. Review the submitted results
3. Click **Dispute Result** if needed
4. Provide details about the dispute
5. Wait for official review and resolution

---

## Troubleshooting

### Can't See Any Data

- **Check organization selection**: Make sure you have an organization selected in the sidebar
- **Verify permissions**: Ensure you have the correct role for the organization
- **Check filters**: Some pages filter by organization automatically

### Can't Submit Results

- **Check match status**: Results can only be submitted for matches in "awaiting_results", "scheduled", or "draft" status
- **Verify team relationship**: You must be the coach of one of the participating teams
- **Check scores**: All games must have valid scores (0 or 1)

### Can't Confirm Results

- **Wait for both submissions**: Both teams must submit results before confirmation is available
- **Check match status**: Match must be in "results_submitted" status
- **Verify permissions**: You must be the coach of the opposing team

---

## Keyboard Shortcuts

- **Navigation**: Use the sidebar to quickly jump between sections
- **Organization Switch**: Click the organization selector at the top of the sidebar
- **Quick Actions**: Use the action buttons on detail pages for common tasks

---

## Getting Help

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review the **README.md** for technical setup
3. Check the **QUICKSTART.md** for quick setup instructions
4. Review the **DOCKER.md** for Docker-specific help

---

## Feature Summary

| Feature | Description | Access |
|---------|-------------|--------|
| Organizations | Manage your esports organizations | Sidebar → Organizations |
| Seasons | Create and manage competition seasons | Sidebar → Seasons |
| Teams | Manage teams and player rosters | Sidebar → Teams |
| Matches | Schedule matches and submit results | Sidebar → Matches |
| Standings | View league rankings and statistics | Sidebar → Standings |
| Announcements | Create and view announcements | Sidebar → Announcements |
| Notifications | View important updates | Sidebar → Notifications |

---

## Quick Reference Card

### Common Actions

- **Create Organization**: Organizations → Create Organization
- **Create Season**: Seasons → Create Season
- **Create Team**: Teams → Create Team
- **Add Player**: Teams → [Select Team] → + Add Player
- **Schedule Match**: Matches → Create Match
- **Submit Result**: Matches → [Select Match] → Submit Result
- **View Standings**: Standings → [Select Season]
- **Create Announcement**: Announcements → + New Announcement

---

*Last Updated: December 2024*

*For technical documentation, see README.md*

