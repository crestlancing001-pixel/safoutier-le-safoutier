import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type SiteImage = Database['public']['Tables']['site_images']['Row'];
type ContactInfo = Database['public']['Tables']['contact_info']['Row'];

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
        .single();   // assuming one main row

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data as ContactInfo | null;
    },
  });
}

// Real-time subscriptions
export function useRealtimeUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Menu items realtime
    const menuChannel = supabase
      .channel('menu-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['menu_items'] });
        }
      )
      .subscribe();

    // Images realtime
    const imagesChannel = supabase
      .channel('images-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_images' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['site_images'] });
        }
      )
      .subscribe();

    // Contact realtime
    const contactChannel = supabase
      .channel('contact-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_info' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['contact_info'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(menuChannel);
      supabase.removeChannel(imagesChannel);
      supabase.removeChannel(contactChannel);
    };
  }, [queryClient]);
}
