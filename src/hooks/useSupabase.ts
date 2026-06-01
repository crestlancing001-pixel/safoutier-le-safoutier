import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type SiteImage = Database['public']['Tables']['site_images']['Row'];
type ContactInfo = Database['public']['Tables']['contact_info']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type Testimonial = Database['public']['Tables']['testimonials']['Row'];

export function useMenuItems() {
  return useQuery({
    queryKey: ['menu_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as MenuItem[];
    },
  });
}

export function useSiteImages() {
  return useQuery({
    queryKey: ['site_images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as SiteImage[];
    },
  });
}

export function useContactInfo() {
  return useQuery({
    queryKey: ['contact_info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      return data as ContactInfo | null;
    },
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Event[];
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    },
  });
}

// Single global realtime subscription for all public-facing tables.
// Mount once (e.g. in Layout) — invalidates react-query caches on any change.
export function useRealtimeUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const tables: Array<{ table: string; key: string }> = [
      { table: 'menu_items', key: 'menu_items' },
      { table: 'site_images', key: 'site_images' },
      { table: 'contact_info', key: 'contact_info' },
      { table: 'events', key: 'events' },
      { table: 'testimonials', key: 'testimonials' },
    ];

    const channel = supabase.channel('public-realtime');
    tables.forEach(({ table, key }) => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => queryClient.invalidateQueries({ queryKey: [key] })
      );
    });
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
