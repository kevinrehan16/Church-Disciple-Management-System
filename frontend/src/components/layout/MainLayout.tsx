import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { SettingsPanel } from '../ui/SettingsPanel';
import { useTheme } from '../../contexts/ThemeContext';

export default function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme } = useTheme();

  const cssVariables = {
    '--sidebar-bg': theme.sidebarBg,
    '--menu-text': theme.menuTextColor,
    '--active-parent': theme.activeParentBg,
  } as React.CSSProperties;

  return (
    <div style={cssVariables} className="flex h-screen overflow-hidden">
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <div className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <Sidebar isCollapsed={isCollapsed} onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>

      <div className="flex-1 flex flex-col">
        <Topbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="flex-1 overflow-y-auto bg-slate-50">
           <Outlet />
        </main>
      </div>
    </div>
  );
}