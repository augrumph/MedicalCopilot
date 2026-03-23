import { useState, useEffect } from 'react';
import { Protocol } from '@/stores/protocolsStore';

const MAX_SUGGESTIONS = 20;

export function useProtocolSuggestions(transcript: string, protocols: Protocol[]) {
    const [suggestions, setSuggestions] = useState<Protocol[]>([]);
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!transcript || protocols.length === 0) return;

        const matched = protocols.filter(protocol => {
            if (dismissedIds.has(protocol.id)) return false;

            const keywords = [
                protocol.title.toLowerCase(),
                ...(protocol.tags || []).map(t => t.toLowerCase())
            ];
            const transcriptLower = transcript.toLowerCase();

            return keywords.some(keyword => {
                if (!keyword) return false;
                try {
                    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
                    return regex.test(transcriptLower);
                } catch (e) {
                    return transcriptLower.includes(keyword);
                }
            });
        });

        if (matched.length > 0) {
            setSuggestions(prev => {
                const existingIds = new Set(prev.map(s => s.id));
                const fresh = matched.filter(s => !existingIds.has(s.id));
                if (fresh.length === 0) return prev;
                return [...prev, ...fresh].slice(-MAX_SUGGESTIONS);
            });
        }
    // `suggestions` intentionally excluded — duplicate check is done inside setSuggestions callback
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transcript, protocols, dismissedIds]);

    const dismissSuggestion = (id: string) => {
        setDismissedIds(prev => new Set([...prev, id]));
        setSuggestions(prev => prev.filter(s => s.id !== id));
    };

    return { suggestions, dismissSuggestion };
}
