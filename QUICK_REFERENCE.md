# Esports Dashboard - Quick Reference Card

A one-page quick reference for common tasks and navigation.

## 🚀 Quick Start

1. **Login**: http://localhost:4000
   - Email: `admin@esports.local`
   - Password: `password`

2. **Select Organization**: Use dropdown in sidebar

3. **Navigate**: Use sidebar menu items

---

## 📍 Navigation Shortcuts

| Icon | Feature | Path | Description |
|------|---------|------|-------------|
| 🏢 | Organizations | `/orgs` | Manage organizations |
| 📅 | Seasons | `/seasons` | Competition seasons |
| 👥 | Teams | `/teams` | Teams and rosters |
| 🎮 | Matches | `/matches` | Schedule and results |
| 📊 | Standings | `/standings` | League rankings |
| 📢 | Announcements | `/announcements` | Organization updates |
| 🔔 | Notifications | `/notifications` | Your notifications |

---

## ⚡ Common Tasks

### Create Organization
1. Sidebar → Organizations
2. Click "Create Organization"
3. Fill name, slug, description
4. Click "Create"

### Create Season
1. Sidebar → Seasons
2. Click "Create Season"
3. Fill name, dates, game title
4. Click "Create"

### Create Team
1. Sidebar → Teams
2. Click "Create Team"
3. Select season, fill team name
4. Click "Create"

### Add Player to Roster
1. Sidebar → Teams
2. Click team card
3. Click "+ Add Player"
4. Select player, position, jersey #
5. Click "Add Player"

### Schedule Match
1. Sidebar → Matches
2. Click "Create Match"
3. Select season, teams, date/time, best-of
4. Click "Create Match"

### Submit Match Result
1. Sidebar → Matches
2. Click match card
3. Scroll to "Submit Result"
4. Enter scores (1=win, 0=loss) for each game
5. Add notes (optional)
6. Click "Submit Result"

### Confirm Match Result
1. Sidebar → Matches
2. Click match card
3. Scroll to "Confirm Result"
4. Review submitted results
5. Click "Confirm Result" or "Dispute Result"

### View Standings
1. Sidebar → Standings
2. Select season from dropdown
3. View rankings table

### Create Announcement
1. Sidebar → Announcements
2. Click "+ New Announcement"
3. Fill title, content, scope
4. Click "Create Announcement"

---

## 🎯 Match Result Workflow

```
1. Match Created (draft)
   ↓
2. Match Scheduled
   ↓
3. Match Played → Awaiting Results
   ↓
4. Team 1 Submits Result
   ↓
5. Team 2 Submits Result → Results Submitted
   ↓
6. Team 2 Confirms → Results Confirmed
   ↓
7. Standings Updated Automatically
```

---

## 📊 Match Status Guide

| Status | Meaning | Actions Available |
|--------|---------|-------------------|
| `draft` | Just created | Edit, Schedule, Submit Result |
| `scheduled` | Date/time set | Submit Result, Edit |
| `awaiting_results` | Waiting for scores | Submit Result |
| `results_submitted` | Both teams submitted | Confirm Result, Dispute |
| `results_confirmed` | Results verified | View (final) |
| `disputed` | Under review | View only |
| `canceled` | Match canceled | View only |

---

## 🔢 Score Submission

**Best-of-3 Example:**
- Game 1: Enter `1` (your team won)
- Game 2: Enter `0` (your team lost)
- Game 3: Enter `1` (your team won)

**Best-of-5 Example:**
- Game 1: `1`
- Game 2: `0`
- Game 3: `1`
- Game 4: `1`
- Game 5: (not needed if you won 3)

---

## 🎮 Keyboard Shortcuts

- **Sidebar Navigation**: Click menu items
- **Organization Switch**: Click org selector (top of sidebar)
- **Quick Actions**: Use action buttons on detail pages
- **Back Navigation**: Browser back button or "← Back" links

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't see data | Check organization selection in sidebar |
| Can't submit result | Verify match status and team relationship |
| Can't confirm result | Wait for both teams to submit |
| Missing features | Check your role permissions |

---

## 📞 Support Resources

- **User Guide**: See `USER_GUIDE.md` for detailed instructions
- **Technical Docs**: See `README.md` for setup
- **Docker Help**: See `DOCKER.md` for container issues

---

## 💡 Pro Tips

1. **Start with Organizations** → Create your org first
2. **Create Seasons** → Set up competition periods
3. **Build Teams** → Add teams and players
4. **Schedule Matches** → Create match schedule
5. **Submit Results Promptly** → Keep standings current
6. **Use Announcements** → Keep everyone informed
7. **Check Notifications** → Stay on top of pending actions

---

*Print this page for quick reference!*

*Last Updated: December 2024*

