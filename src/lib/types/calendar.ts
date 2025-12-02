export interface ICalFeed {
    id: string;
    name: string;
    url: string;
    createdAt: string;
    lastSync?: string;
    isActive: boolean;
}

export interface GoogleCalendarConnection {
    connected: boolean;
    email?: string;
    accessToken?: string;
    connectedAt?: string;
}

export interface CalendarIntegrationsState {
    googleCalendar: GoogleCalendarConnection;
    icalFeeds: ICalFeed[];
}
