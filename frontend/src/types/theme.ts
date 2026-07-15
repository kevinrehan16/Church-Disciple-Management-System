export interface SalusTheme {
  sidebarBg: string;
  menuTextColor: string;
  activeParentBg: string;
  activeSubmenuTextColor: string;
  topbarBg: string;
  topbarTextColor: string;
}

export const defaultTheme: SalusTheme = {
  sidebarBg: '#1e293b', // Dark
  menuTextColor: '#f8fafc',
  activeParentBg: '#0284c7', // Blue
  activeSubmenuTextColor: '#16a34a', // Success Green
  topbarBg: '#f8fafc',
  topbarTextColor: '#1e293b',
};