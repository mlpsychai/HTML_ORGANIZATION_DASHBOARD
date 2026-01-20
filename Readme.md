# Spring 2026 Dashboard

Personal academic dashboard for managing doctoral program coursework, clinical hours, and self-care metrics.

**Live:** [mlpsychai.github.io/HTML_ORGANIZATION_DASHBOARD](https://mlpsychai.github.io/HTML_ORGANIZATION_DASHBOARD)

---

## Working with Claude

### First Steps for New Chats

1. **Fetch the latest files from GitHub** using the URLs below—project knowledge contains academic docs (syllabi, handbook), not dashboard code
2. Review this Readme to understand the architecture
3. Check `data/calendar_data.json` and `data/fitbit-latest.json` for current state

### Interaction Preferences

- **Be methodical** — When debugging gets complex, slow down and work step-by-step rather than jumping to solutions
- **Comprehensive over incremental** — Prefer complete fixes over quick patches that might need revisiting
- **Specific technical specs** — Provide exact measurements, colors, and code rather than vague suggestions
- **Accessibility is priority** — Atkinson Hyperlegible font, low contrast ratios, optimize for light sensitivity and neurodivergent viewers
- **Ask clarifying questions** — When uncertain, ask rather than assume

### Git Workflow

```bash
source ~/.bashrc
git pull
git add -A
git commit -m "Description"
git push https://$GIT_USER:$GIT_TOKEN@github.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD.git
```

Credentials stored in `~/.bashrc` as `$GIT_USER` and `$GIT_TOKEN`.

---

## GitHub File URLs (Fetch Latest)

### Data Files (change frequently)
| File | URL |
|------|-----|
| calendar_data.json | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/data/calendar_data.json` |
| fitbit-latest.json | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/data/fitbit-latest.json` |
| hours_data.json | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/data/hours_data.json` |

### JavaScript Modules
| File | URL |
|------|-----|
| app.js | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/js/app.js` |
| config.js | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/js/config.js` |
| navigation.js | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/js/navigation.js` |
| calendar.js | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/js/calendar.js` |
| hours.js | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/js/hours.js` |
| bandwidth.js | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/js/bandwidth.js` |

### CSS
| File | URL |
|------|-----|
| variables.css | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/css/variables.css` |
| base.css | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/css/base.css` |
| grid.css | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/css/grid.css` |
| components.css | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/css/components.css` |
| calendar.css | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/css/calendar.css` |
| hours.css | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/css/hours.css` |
| bandwidth.css | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/css/bandwidth.css` |

### HTML
| File | URL |
|------|-----|
| index.html | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/index.html` |
| bandwidth.html | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/panels/bandwidth.html` |
| hours.html | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/panels/hours.html` |
| calendar.html | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/panels/calendar.html` |
| semester.html | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/panels/semester.html` |
| deadlines.html | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/panels/deadlines.html` |

### Scripts & Workflows
| File | URL |
|------|-----|
| fetch_calendar_data.py | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/scripts/fetch_calendar_data.py` |
| fitbit-sync.yml | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/.github/workflows/fitbit-sync.yml` |
| calendar-sync.yml | `https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/.github/workflows/calendar-sync.yml` |

---

## Architecture

```
HTML_ORGANIZATION_DASHBOARD/
├── index.html              # Main entry point
├── css/
│   ├── variables.css       # Design tokens (colors, fonts, spacing)
│   ├── base.css            # Reset, body styles
│   ├── grid.css            # Overview grid layout
│   ├── components.css      # Shared components (cards, buttons)
│   ├── calendar.css        # Calendar/timeline styles
│   ├── hours.css           # Hours tracking styles
│   └── bandwidth.css       # Bandwidth panel + overview components
├── js/
│   ├── app.js              # Entry point - initializes all modules
│   ├── config.js           # Data URLs, timezone, constants
│   ├── navigation.js       # Panel switching + lazy loading
│   ├── calendar.js         # Google Calendar integration
│   ├── hours.js            # Time2Track data rendering
│   └── bandwidth.js        # Fitbit data + bandwidth calculations
├── panels/
│   ├── bandwidth.html      # Full bandwidth/self-care panel
│   ├── hours.html          # Detailed hours breakdown
│   ├── calendar.html       # Weekly calendar view
│   ├── semester.html       # Full semester calendar
│   └── deadlines.html      # Assignment deadlines
├── data/
│   ├── fitbit-latest.json  # Auto-updated Fitbit data
│   ├── calendar_data.json  # Google Calendar events
│   └── hours_data.json     # Time2Track hours
├── scripts/
│   └── fetch_calendar_data.py  # Calendar sync script (America/Phoenix timezone)
└── .github/workflows/
    ├── fitbit-sync.yml     # Fitbit sync every 6 hours
    └── calendar-sync.yml   # Calendar sync every 6 hours
```

---

## Design System

### Colors (Warm, Low-Contrast Dark Theme)
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#1a1a1a` | Main background |
| `--bg-secondary` | `#242424` | Cards, sections |
| `--bg-tertiary` | `#2e2e2e` | Nested elements |
| `--text-primary` | `#d8d4cc` | Main text (cream) |
| `--text-secondary` | `#9a9890` | Secondary text |
| `--text-muted` | `#6b6860` | Labels, hints |
| `--accent-teal` | `#7eb8c9` | Sleep, primary accent |
| `--accent-sage` | `#8cb88c` | Activity, positive |
| `--accent-gold` | `#c9b87e` | Warnings, medium |
| `--accent-coral` | `#c99b8c` | Heart, alerts |
| `--accent-purple` | `#b0a0c9` | HRV, tertiary |

### Typography
- **Primary:** Atkinson Hyperlegible (accessibility-optimized)
- **Mono:** JetBrains Mono (data, numbers)

---

## Data Sources

### Fitbit (`data/fitbit-latest.json`)
Auto-synced via GitHub Actions every 6 hours.

```json
{
  "date": "2026-01-20",
  "updated_at": "2026-01-20T13:49:02-07:00",
  "sleep": {
    "summary": {
      "duration_minutes": 391,
      "score": 91,
      "start_time": "2026-01-19T23:24:00.000",
      "end_time": "2026-01-20T06:35:30.000",
      "stages": { "deep": 99, "light": 216, "rem": 75, "wake": 40 }
    },
    "levels": [ { "dateTime": "...", "level": "deep|light|rem|wake", "seconds": 3000 } ]
  },
  "heart": { "summary": { "resting_hr": 67 } },
  "hrv": { "summary": { "daily_rmssd": 0 } },
  "respiratory": { "summary": { "breathing_rate": 14.6 } },
  "activity": { "summary": { "steps": 7, "distance_miles": 0.005, "calories": { "total": 483 } } }
}
```

### Hours (`data/hours_data.json`)
Manual CSV upload or direct edit.

```json
{
  "updated_at": "2026-01-20T12:00:00Z",
  "direct": { "current": 12.0, "goal": 100 },
  "total": { "current": 14.15, "goal": 500 },
  "supervision": {
    "received": { "current": 2.15, "goal": 50 },
    "provided": { "current": 0, "goal": 40 }
  }
}
```

### Calendar (`data/calendar_data.json`)
Synced via `scripts/fetch_calendar_data.py` every 6 hours. Handles timezone conversion from UTC to America/Phoenix.

---

## Modules

### navigation.js
- Hamburger menu toggle
- Lazy-loads panel HTML on first visit
- Panel switching via `data-view` attributes

### bandwidth.js
- Fetches `fitbit-latest.json`
- Calculates bandwidth score (1-10) from:
  - Sleep score (85+ = +2 pts)
  - Sleep duration (7-9h = +1.5 pts)
  - Resting HR (<60 = +1 pt)
  - HRV (>50 = +1 pt)
- Updates overview donut + full panel
- Renders hypnogram SVG from sleep levels

### hours.js
- Fetches `hours_data.json`
- Updates overview cards: Direct, Total, Supervision
- Calculates percentage complete

### calendar.js
- Fetches `calendar_data.json`
- Renders today's events on timeline (5AM-8PM)
- Current time indicator

---

## Views

| View | Description |
|------|-------------|
| **Overview** | Dashboard home - priorities, calendar, hours, bandwidth summary |
| **T2T Log** | Detailed Time2Track hours breakdown |
| **This Week** | Weekly calendar grid |
| **Full Semester** | Jan 12 – May 8 semester calendar |
| **Deadlines** | Upcoming assignments table |
| **Bandwidth** | Full Fitbit data - sleep, heart, activity, readiness |

---

## Key Technical Notes

### Lazy Loading Panels
Panels are loaded via `fetch()` and inserted via `innerHTML`. **Scripts in loaded HTML don't execute** - all logic must be in JS modules.

### Element ID Conventions
Panel elements use prefixed IDs to avoid conflicts:
- Overview: `directHoursValue`, `totalHoursValue`
- Bandwidth panel: `bandwidth-sleep-score`, `bandwidth-resting-hr`

### MutationObserver
`bandwidth.js` uses MutationObserver to detect when the panel becomes active and re-renders data.

### Timezone Handling
`fetch_calendar_data.py` converts all calendar times to America/Phoenix:
- UTC times (ending in `Z`) are converted
- TZID parameters are respected
- GitHub Actions runs in UTC but script uses Phoenix time for "today"

---

## Configuration

Edit `js/config.js`:

```javascript
const CONFIG = {
  dataUrls: {
    calendar: 'https://raw.githubusercontent.com/.../data/calendar_data.json',
    fitbit: 'https://raw.githubusercontent.com/.../data/fitbit-latest.json',
    hours: 'https://raw.githubusercontent.com/.../data/hours_data.json'
  },
  timezone: 'America/Phoenix',
  calendar: { startHour: 5, endHour: 20 },
  refreshIntervals: { timeIndicator: 60000, calendarData: 3600000 }
};
```

---

## Deployment

Hosted on GitHub Pages. Auto-deploys on push to `main`.

```bash
git add -A
git commit -m "Description"
git push
```

---

## Semester Goals (EPS 740)

- **Direct Hours:** 60-100 with child clients
- **Supervision Provided:** ~40 hours to 3 master's students
- **Presentations:** 4 class presentations (2 supervisee, 2 client)
- **Documentation:** All hours logged in Time2Track, videos in Valt
