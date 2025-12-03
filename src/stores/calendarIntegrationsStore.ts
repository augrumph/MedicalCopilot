import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ICalFeed, GoogleCalendarConnection, MicrosoftCalendarConnection } from '@/lib/types/calendar';

interface CalendarIntegrationsStore {
    // Google Calendar
    googleCalendar: GoogleCalendarConnection;
    connectGoogle: (email: string, accessToken: string, expiresIn: number) => void;
    disconnectGoogle: () => void;

    // Microsoft Calendar
    microsoftCalendar: MicrosoftCalendarConnection;
    connectMicrosoft: (email: string, accessToken: string, expiresIn: number) => void;
    disconnectMicrosoft: () => void;

    // iCal Feeds
    icalFeeds: ICalFeed[];
    addIcalFeed: (name: string, url: string) => void;
    removeIcalFeed: (id: string) => void;
    updateIcalFeed: (id: string, updates: Partial<ICalFeed>) => void;

    // Sync
    lastSyncAt?: string;
    updateLastSync: () => void;
}

export const useCalendarIntegrationsStore = create<CalendarIntegrationsStore>()(
    persist(
        (set) => ({
            // Google Calendar - Initially disconnected
            googleCalendar: {
                connected: false,
            },

            connectGoogle: (email: string, accessToken: string, expiresIn: number) =>
                set({
                    googleCalendar: {
                        connected: true,
                        email,
                        connectedAt: new Date().toISOString(),
                        accessToken,
                        tokenExpiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
                    },
                }),

            disconnectGoogle: () =>
                set({
                    googleCalendar: {
                        connected: false,
                    },
                }),

            // Microsoft Calendar - Initially disconnected
            microsoftCalendar: {
                connected: false,
            },

            connectMicrosoft: (email: string, accessToken: string, expiresIn: number) =>
                set({
                    microsoftCalendar: {
                        connected: true,
                        email,
                        connectedAt: new Date().toISOString(),
                        accessToken,
                        tokenExpiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
                    },
                }),

            disconnectMicrosoft: () =>
                set({
                    microsoftCalendar: {
                        connected: false,
                    },
                }),

            // iCal Feeds - Initially empty
            icalFeeds: [],

            addIcalFeed: (name: string, url: string) =>
                set((state) => ({
                    icalFeeds: [
                        ...state.icalFeeds,
                        {
                            id: Date.now().toString(),
                            name,
                            url,
                            createdAt: new Date().toISOString(),
                            isActive: true,
                        },
                    ],
                })),

            removeIcalFeed: (id: string) =>
                set((state) => ({
                    icalFeeds: state.icalFeeds.filter((feed) => feed.id !== id),
                })),

            updateIcalFeed: (id: string, updates: Partial<ICalFeed>) =>
                set((state) => ({
                    icalFeeds: state.icalFeeds.map((feed) =>
                        feed.id === id ? { ...feed, ...updates } : feed
                    ),
                })),

            // Sync
            lastSyncAt: undefined,

            updateLastSync: () =>
                set({
                    lastSyncAt: new Date().toISOString(),
                }),
        }),
        {
            name: 'calendar-integrations-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
