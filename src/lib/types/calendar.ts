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
    tokenExpiresAt?: string;
    connectedAt?: string;
}

export interface MicrosoftCalendarConnection {
    connected: boolean;
    email?: string;
    accessToken?: string;
    tokenExpiresAt?: string;
    connectedAt?: string;
}

export interface CalendarIntegrationsState {
    googleCalendar: GoogleCalendarConnection;
    microsoftCalendar: MicrosoftCalendarConnection;
    icalFeeds: ICalFeed[];
    lastSyncAt?: string;
}
