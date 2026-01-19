#!/usr/bin/env python3
"""Fetch and parse ICS calendar data."""

import json
import os
import re
import urllib.request
from datetime import datetime, timedelta
from collections import defaultdict

def fetch_ics(url):
    """Fetch ICS content from URL."""
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def parse_ics(content):
    """Parse ICS content into events."""
    events = []
    if not content:
        return events
    
    # Split into VEVENT blocks
    vevent_pattern = re.compile(r'BEGIN:VEVENT(.*?)END:VEVENT', re.DOTALL)
    
    for match in vevent_pattern.finditer(content):
        event_text = match.group(1)
        event = {}
        
        # Parse fields
        for line in event_text.split('\n'):
            line = line.strip()
            if ':' in line:
                key, value = line.split(':', 1)
                # Handle parameters like DTSTART;TZID=...
                if ';' in key:
                    key = key.split(';')[0]
                event[key] = value
        
        if 'SUMMARY' in event:
            events.append(event)
    
    return events

def parse_datetime(dt_str):
    """Parse ICS datetime string."""
    # Remove any trailing Z
    dt_str = dt_str.rstrip('Z')
    
    # Try different formats
    formats = ['%Y%m%dT%H%M%S', '%Y%m%d']
    
    for fmt in formats:
        try:
            return datetime.strptime(dt_str, fmt)
        except ValueError:
            continue
    
    return None

def categorize_event(title):
    """Categorize event by title keywords."""
    title_lower = title.lower()
    
    if any(k in title_lower for k in ['eps ', 'class', 'lecture', 'coe']):
        return 'class', 'var(--text-muted)'
    if any(k in title_lower for k in ['lend', 'fellowship']):
        return 'fellowship', 'var(--accent-purple)'
    if any(k in title_lower for k in ['client', 'session', 'ados', 'chc']):
        return 'clinical', 'var(--accent-teal)'
    if any(k in title_lower for k in ['meeting', 'supervision', 'supervisee', 'hold for']):
        return 'meeting', 'var(--accent-gold)'
    if any(k in title_lower for k in ['mandatory', 'mandatories', 'break']):
        return 'personal', 'var(--accent-sage)'
    
    return 'default', 'var(--text-secondary)'

def expand_recurring(event, start_date, end_date):
    """Expand recurring events within date range."""
    expanded = []
    
    rrule = event.get('RRULE', '')
    if not rrule:
        return [event]
    
    # Parse RRULE
    freq = None
    byday = []
    until = None
    
    for part in rrule.split(';'):
        if part.startswith('FREQ='):
            freq = part[5:]
        elif part.startswith('BYDAY='):
            byday = part[6:].split(',')
        elif part.startswith('UNTIL='):
            until = parse_datetime(part[6:])
    
    if freq != 'WEEKLY' or not byday:
        return [event]
    
    # Day mapping
    day_map = {'MO': 0, 'TU': 1, 'WE': 2, 'TH': 3, 'FR': 4, 'SA': 5, 'SU': 6}
    target_days = [day_map.get(d, -1) for d in byday if d in day_map]
    
    # Get original start time
    orig_start = parse_datetime(event.get('DTSTART', ''))
    orig_end = parse_datetime(event.get('DTEND', ''))
    
    if not orig_start:
        return [event]
    
    duration = (orig_end - orig_start) if orig_end else timedelta(hours=1)
    
    # Generate occurrences
    current = start_date
    while current <= end_date:
        if until and current > until:
            break
        
        if current.weekday() in target_days:
            new_start = current.replace(
                hour=orig_start.hour,
                minute=orig_start.minute,
                second=0
            )
            new_end = new_start + duration
            
            new_event = event.copy()
            new_event['DTSTART'] = new_start.strftime('%Y%m%dT%H%M%S')
            new_event['DTEND'] = new_end.strftime('%Y%m%dT%H%M%S')
            new_event['_expanded'] = True
            expanded.append(new_event)
        
        current += timedelta(days=1)
    
    return expanded if expanded else [event]

def format_time(dt):
    """Format datetime to 12-hour time string."""
    if not dt:
        return ''
    return dt.strftime('%-I:%M %p').replace(':00 ', ' ')

def calculate_position(dt, start_hour=5, end_hour=20):
    """Calculate timeline position as percentage."""
    if not dt:
        return 0
    
    hour = dt.hour + dt.minute / 60
    total_hours = end_hour - start_hour
    
    if hour < start_hour:
        return 0
    if hour > end_hour:
        return 100
    
    return ((hour - start_hour) / total_hours) * 100

def main():
    # Get calendar URLs from environment
    urls_json = os.environ.get('CALENDAR_ICS_URLS', '[]')
    try:
        urls = json.loads(urls_json)
    except json.JSONDecodeError:
        print("Error parsing CALENDAR_ICS_URLS")
        return
    
    if not urls:
        print("No calendar URLs configured")
        return
    
    # Date range
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    range_start = today - timedelta(days=today.weekday())  # Monday of this week
    range_end = today + timedelta(days=30)
    
    # Fetch and parse all calendars
    all_events = []
    for url in urls:
        print(f"Fetching: {url[:50]}...")
        content = fetch_ics(url)
        events = parse_ics(content)
        print(f"  Found {len(events)} events")
        all_events.extend(events)
    
    # Expand recurring events
    expanded_events = []
    for event in all_events:
        expanded_events.extend(expand_recurring(event, range_start, range_end))
    
    print(f"Total events after expansion: {len(expanded_events)}")
    
    # Organize by date
    events_by_date = defaultdict(list)
    
    for event in expanded_events:
        start_dt = parse_datetime(event.get('DTSTART', ''))
        end_dt = parse_datetime(event.get('DTEND', ''))
        
        if not start_dt:
            continue
        
        date_key = start_dt.strftime('%Y-%m-%d')
        title = event.get('SUMMARY', 'Untitled')
        category, color = categorize_event(title)
        
        # Calculate timeline positions
        top_pct = calculate_position(start_dt)
        if end_dt:
            height_pct = calculate_position(end_dt) - top_pct
        else:
            height_pct = 6.7  # Default 1 hour
        
        events_by_date[date_key].append({
            'id': event.get('UID', '')[:20],
            'title': title,
            'start_time': format_time(start_dt),
            'end_time': format_time(end_dt) if end_dt else '',
            'start_iso': start_dt.isoformat(),
            'end_iso': end_dt.isoformat() if end_dt else '',
            'location': event.get('LOCATION'),
            'category': category,
            'color': color,
            'top_percent': round(top_pct, 1),
            'height_percent': round(max(height_pct, 4), 1)
        })
    
    # Sort events within each day
    for date_key in events_by_date:
        events_by_date[date_key].sort(key=lambda e: e['start_iso'])
    
    # Build output structure
    today_str = today.strftime('%Y-%m-%d')
    
    # Week structure
    week = {}
    day_names = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    
    for i, day_name in enumerate(day_names):
        day_date = range_start + timedelta(days=i)
        date_str = day_date.strftime('%Y-%m-%d')
        week[day_name] = {
            'date': date_str,
            'display_date': day_date.strftime('%b %d'),
            'is_today': date_str == today_str,
            'events': events_by_date.get(date_str, [])
        }
    
    # Upcoming events (next 14 days, excluding today)
    upcoming = []
    for i in range(1, 15):
        future_date = today + timedelta(days=i)
        date_str = future_date.strftime('%Y-%m-%d')
        
        for event in events_by_date.get(date_str, []):
            upcoming.append({
                **event,
                'date': date_str,
                'display_date': future_date.strftime('%a, %b %d'),
                'days_until': i
            })
    
    # Limit upcoming to first 10
    upcoming = upcoming[:10]
    
    # Final output
    output = {
        'meta': {
            'generated_at': datetime.now().isoformat(),
            'timezone': 'America/Phoenix',
            'range_start': range_start.strftime('%Y-%m-%d'),
            'range_end': range_end.strftime('%Y-%m-%d'),
            'total_events': len(expanded_events),
            'calendars_synced': len(urls)
        },
        'today': {
            'date': today_str,
            'display_date': today.strftime('%A, %B %d'),
            'events': events_by_date.get(today_str, [])
        },
        'week': week,
        'upcoming': upcoming
    }
    
    # Write output
    os.makedirs('data', exist_ok=True)
    with open('data/calendar_data.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✅ Wrote data/calendar_data.json")
    print(f"   Today: {len(output['today']['events'])} events")
    print(f"   Upcoming: {len(upcoming)} events")

if __name__ == '__main__':
    main()
