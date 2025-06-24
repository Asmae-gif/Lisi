import { useState, useEffect, useCallback } from 'react';
import axiosClient from "@/services/axiosClient";
import { ProjectSettings, ApiResponse, DEFAULT_PROJECT_SETTINGS } from '@/types/ProjectSettings';
import { buildImageUrl } from '@/utils/imageUtils';

export const useProjectSettings = () => {
    const [settings, setSettings] = useState<ProjectSettings>(DEFAULT_PROJECT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            await axiosClient.get('/sanctum/csrf-cookie');
            const response = await axiosClient.get<ApiResponse>('/api/pages/projects/settings', {
                headers: { 'Accept': 'application/json' }
            });
            const settingsData = response.data.data || response.data;
            if (settingsData && typeof settingsData === 'object') {
                setSettings(prev => ({ ...prev, ...settingsData }));
            } else {
                throw new Error('Invalid data format received from server');
            }
        } catch (err: unknown) {
            console.error('Error loading project settings:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to load settings';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return { settings, loading, error, fetchSettings };
}; 