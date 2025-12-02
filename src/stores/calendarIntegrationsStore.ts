import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ICalFeed, GoogleCalendarConnection } from '@/lib/types/calendar';

interface CalendarIntegrationsStore {
    // Google Calendar
    googleCalendar: GoogleCalendarConnection;
    connectGoogle: (email: string) => void;
    disconnectGoogle: () => void;

    // iCal Feeds
    icalFeeds: ICalFeed[];
    addIcalFeed: (name: string, url: string) => void;
    removeIcalFeed: (id: string) => void;
    updateIcalFeed: (id: string, updates: Partial<ICalFeed>) => void;
}

export const useCalendarIntegrationsStore = create<CalendarIntegrationsStore>()(
    persist(
        (set) => ({
            // Google Calendar - Initially disconnected
            googleCalendar: {
                connected: false,
            },

            connectGoogle: (email: string) =>
                set({
                    googleCalendar: {
                        connected: true,
                        email,
                        connectedAt: new Date().toISOString(),
                        accessToken: 'mock-token-' + Date.now(), // Mock token
                    },
                }),

            disconnectGoogle: () =>
                set({
                    googleCalendar: {
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
        }),
        {
            name: 'calendar-integrations-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
