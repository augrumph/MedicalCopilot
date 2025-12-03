import ICAL from 'ical.js';

export interface CalendarEvent {
    id: string;
    title: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    description?: string;
    location?: string;
    source: 'google' | 'microsoft' | 'ical' | 'apple';
    sourceId: string; // ID from the original calendar
    feedId?: string; // For iCal feeds
}

/**
 * Fetches and parses iCalendar (.ics) feed
 */
export async function fetchICalFeed(url: string): Promise<CalendarEvent[]> {
    try {
        // Handle webcal:// URLs (convert to https://)
        const fetchUrl = url.replace('webcal://', 'https://');

        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch calendar: ${response.statusText}`);
        }

        const icsData = await response.text();
        return parseICalData(icsData);
    } catch (error) {
        console.error('Error fetching iCal feed:', error);
        throw error;
    }
}

/**
 * Parses iCalendar data and returns events
 */
export function parseICalData(icsData: string): CalendarEvent[] {
    try {
        const jcalData = ICAL.parse(icsData);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        const events: CalendarEvent[] = [];

        for (const vevent of vevents) {
            const event = new ICAL.Event(vevent);

            // Only include future events and events from last 30 days
            const startDate = event.startDate.toJSDate();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            if (startDate < thirtyDaysAgo) {
                continue;
            }

            events.push({
                id: event.uid || `ical-${Date.now()}-${Math.random()}`,
                title: event.summary || 'Sem título',
                startTime: event.startDate.toJSDate().toISOString(),
                endTime: event.endDate.toJSDate().toISOString(),
                description: event.description || undefined,
                location: event.location || undefined,
                source: 'ical',
                sourceId: event.uid || '',
            });
        }

        return events;
    } catch (error) {
        console.error('Error parsing iCal data:', error);
        throw error;
    }
}

/**
 * Fetches events from Google Calendar API
 */
export async function fetchGoogleCalendarEvents(
    accessToken: string,
    calendarId: string = 'primary'
): Promise<CalendarEvent[]> {
    try {
        const timeMin = new Date();
        timeMin.setDate(timeMin.getDate() - 30); // Last 30 days

        const timeMax = new Date();
        timeMax.setMonth(timeMax.getMonth() + 3); // Next 3 months

        const params = new URLSearchParams({
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            singleEvents: 'true',
            orderBy: 'startTime',
            maxResults: '250',
        });

        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Google Calendar API error: ${response.statusText}`);
        }

        const data = await response.json();

        return (data.items || []).map((item: any) => ({
            id: item.id,
            title: item.summary || 'Sem título',
            startTime: item.start.dateTime || item.start.date,
            endTime: item.end.dateTime || item.end.date,
            description: item.description,
            location: item.location,
            source: 'google' as const,
            sourceId: item.id,
        }));
    } catch (error) {
        console.error('Error fetching Google Calendar events:', error);
        throw error;
    }
}

/**
 * Fetches events from Microsoft Graph API (Outlook/Office 365)
 */
export async function fetchMicrosoftCalendarEvents(
    accessToken: string
): Promise<CalendarEvent[]> {
    try {
        const timeMin = new Date();
        timeMin.setDate(timeMin.getDate() - 30);

        const timeMax = new Date();
        timeMax.setMonth(timeMax.getMonth() + 3);

        const params = new URLSearchParams({
            startDateTime: timeMin.toISOString(),
            endDateTime: timeMax.toISOString(),
            $top: '250',
            $orderby: 'start/dateTime',
        });

        const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/calendar/calendarView?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Microsoft Graph API error: ${response.statusText}`);
        }

        const data = await response.json();

        return (data.value || []).map((item: any) => ({
            id: item.id,
            title: item.subject || 'Sem título',
            startTime: item.start.dateTime,
            endTime: item.end.dateTime,
            description: item.bodyPreview || item.body?.content,
            location: item.location?.displayName,
            source: 'microsoft' as const,
            sourceId: item.id,
        }));
    } catch (error) {
        console.error('Error fetching Microsoft Calendar events:', error);
        throw error;
    }
}

/**
 * Syncs all calendar sources and returns combined events
 */
export async function syncAllCalendars(config: {
    google?: { accessToken: string };
    microsoft?: { accessToken: string };
    icalFeeds?: Array<{ id: string; url: string }>;
}): Promise<CalendarEvent[]> {
    const allEvents: CalendarEvent[] = [];

    // Fetch Google events
    if (config.google?.accessToken) {
        try {
            const googleEvents = await fetchGoogleCalendarEvents(config.google.accessToken);
            allEvents.push(...googleEvents);
        } catch (error) {
            console.error('Failed to sync Google Calendar:', error);
        }
    }

    // Fetch Microsoft events
    if (config.microsoft?.accessToken) {
        try {
            const msEvents = await fetchMicrosoftCalendarEvents(config.microsoft.accessToken);
            allEvents.push(...msEvents);
        } catch (error) {
            console.error('Failed to sync Microsoft Calendar:', error);
        }
    }

    // Fetch iCal feeds
    if (config.icalFeeds) {
        for (const feed of config.icalFeeds) {
            try {
                const icalEvents = await fetchICalFeed(feed.url);
                // Add feedId to each event
                const eventsWithFeedId = icalEvents.map(event => ({
                    ...event,
                    feedId: feed.id,
                }));
                allEvents.push(...eventsWithFeedId);
            } catch (error) {
                console.error(`Failed to sync iCal feed ${feed.id}:`, error);
            }
        }
    }

    // Remove duplicates based on sourceId and startTime
    const uniqueEvents = allEvents.filter(
        (event, index, self) =>
            index ===
            self.findIndex(
                (e) =>
                    e.sourceId === event.sourceId &&
                    e.startTime === event.startTime &&
                    e.source === event.source
            )
    );

    // Sort by start time
    uniqueEvents.sort((a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return uniqueEvents;
}
