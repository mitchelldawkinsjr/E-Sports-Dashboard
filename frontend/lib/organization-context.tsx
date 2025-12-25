'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orgsApi, userApi } from './api';

interface Organization {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

interface OrganizationContextType {
  organizations: Organization[];
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [hasToken, setHasToken] = useState(
    () => (typeof window !== 'undefined' && !!localStorage.getItem('auth_token')) || false
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasToken(!!localStorage.getItem('auth_token'));
    }
  }, []);

  const { data: orgsData, isLoading: orgsLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => orgsApi.list(),
    enabled: hasToken, // avoid 401 loops on unauthenticated pages
    staleTime: 60 * 1000,
  });

  const organizations = orgsData?.data?.data || [];

  // Set default organization if none selected
  useEffect(() => {
    if (!hasToken) return;
    if (!currentOrganization && organizations.length > 0) {
      // Try to get from localStorage first
      const savedOrgId = localStorage.getItem('current_organization_id');
      const savedOrg = savedOrgId
        ? organizations.find((o: Organization) => o.id.toString() === savedOrgId)
        : null;

      if (savedOrg) {
        setCurrentOrganization(savedOrg);
      } else {
        setCurrentOrganization(organizations[0]);
      }
    }
  }, [organizations, currentOrganization, hasToken]);

  // Save to localStorage when organization changes
  useEffect(() => {
    if (currentOrganization) {
      localStorage.setItem('current_organization_id', currentOrganization.id.toString());
    }
  }, [currentOrganization]);

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        setCurrentOrganization,
        isLoading: orgsLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}

