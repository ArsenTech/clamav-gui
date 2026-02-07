import { LazyStore } from '@tauri-apps/plugin-store';
import { DEFAULT_BACKEND_SETTINGS } from '@/lib/constants/settings';

export const store = new LazyStore('settings.json',{
     autoSave: true,
     defaults: DEFAULT_BACKEND_SETTINGS
});