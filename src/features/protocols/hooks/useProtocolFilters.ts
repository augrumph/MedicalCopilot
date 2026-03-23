import { useState, useMemo, useCallback } from 'react';
import { Protocol, ProtocolFilters, TriageColor, TargetAudience } from '../types';
import {
  filterBySearch,
  filterBySpecialty,
  filterByTriageColor,
  filterByAudience,
  sortByRelevance,
  getUniqueSpecialties,
} from '../utils/protocolHelpers';

export function useProtocolFilters(protocols: Protocol[]) {
  const [filters, setFilters] = useState<ProtocolFilters>({
    searchTerm: '',
    specialty: null,
    triageColors: [],
    targetAudience: null,
  });

  // Lista de especialidades únicas
  const specialties = useMemo(() => {
    return getUniqueSpecialties(protocols);
  }, [protocols]);

  // Protocolos filtrados
  const filteredProtocols = useMemo(() => {
    let result = protocols;

    // Aplicar filtro de busca
    result = filterBySearch(result, filters.searchTerm);

    // Aplicar filtro de especialidade
    result = filterBySpecialty(result, filters.specialty);

    // Aplicar filtro de cor de triagem
    result = filterByTriageColor(result, filters.triageColors);

    // Aplicar filtro de público-alvo
    result = filterByAudience(result, filters.targetAudience);

    // Ordenar por relevância se houver busca
    if (filters.searchTerm.trim()) {
      result = sortByRelevance(result, filters.searchTerm);
    }

    return result;
  }, [protocols, filters]);

  // Handlers
  const setSearchTerm = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: term }));
  }, []);

  const setSpecialty = useCallback((specialty: string | null) => {
    setFilters((prev) => ({ ...prev, specialty }));
  }, []);

  const toggleTriageColor = useCallback((color: TriageColor) => {
    setFilters((prev) => {
      const colors = prev.triageColors.includes(color)
        ? prev.triageColors.filter((c) => c !== color)
        : [...prev.triageColors, color];
      return { ...prev, triageColors: colors };
    });
  }, []);

  const setTriageColors = useCallback((colors: TriageColor[]) => {
    setFilters((prev) => ({ ...prev, triageColors: colors }));
  }, []);

  const setTargetAudience = useCallback((audience: TargetAudience | null) => {
    setFilters((prev) => ({ ...prev, targetAudience: audience }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      specialty: null,
      triageColors: [],
      targetAudience: null,
    });
  }, []);

  const clearFilter = useCallback((filterKey: keyof ProtocolFilters) => {
    setFilters((prev) => {
      if (filterKey === 'triageColors') {
        return { ...prev, triageColors: [] };
      }
      return { ...prev, [filterKey]: filterKey === 'searchTerm' ? '' : null };
    });
  }, []);

  // Lista de filtros ativos (para exibir chips)
  const activeFilters = useMemo(() => {
    const active: Array<{ key: keyof ProtocolFilters; label: string; value: string }> = [];

    if (filters.searchTerm) {
      active.push({
        key: 'searchTerm',
        label: 'Busca',
        value: filters.searchTerm,
      });
    }

    if (filters.specialty) {
      active.push({
        key: 'specialty',
        label: 'Especialidade',
        value: filters.specialty,
      });
    }

    filters.triageColors.forEach((color) => {
      active.push({
        key: 'triageColors',
        label: 'Triagem',
        value: color,
      });
    });

    if (filters.targetAudience && filters.targetAudience !== 'ALL') {
      active.push({
        key: 'targetAudience',
        label: 'Público',
        value: filters.targetAudience,
      });
    }

    return active;
  }, [filters]);

  const hasActiveFilters = activeFilters.length > 0;

  return {
    filters,
    filteredProtocols,
    specialties,
    activeFilters,
    hasActiveFilters,
    setSearchTerm,
    setSpecialty,
    toggleTriageColor,
    setTriageColors,
    setTargetAudience,
    clearFilters,
    clearFilter,
  };
}
