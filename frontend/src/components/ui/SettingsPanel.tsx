import { X, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const SettingsPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { theme, setTheme } = useTheme();

  // Presets para sa Sidebar Themes
  const sidebarPresets = [
    { name: 'Light', sidebarBg: '#ffffff', menuTextColor: '#1e293b' },
    { name: 'Dark', sidebarBg: '#1e293b', menuTextColor: '#ffffff' },
    { name: 'Midnight', sidebarBg: '#0f172a', menuTextColor: '#ffffff' },
  ];

  // Presets para sa Topbar Design
  const topbarPresets = [
    { name: 'Light', bg: '#ffffff', border: '#e2e8f0', color: '#1e293b' },
    { name: 'Dark', bg: '#1e293b', border: '#334155', color: '#f8fafc' },
    { name: 'Blue', bg: '#0284c7', border: '#e2e8f0', color: '#ffffff' },
    { name: 'Green', bg: '#059669', border: '#e2e8f0', color: '#ffffff' },
    { name: 'Red', bg: '#e11d48', border: '#e2e8f0', color: '#ffffff' },
    { name: 'pink', bg: '#db2777', border: '#e2e8f0', color: '#ffffff' },
    { name: 'Purple', bg: '#7c3aed', border: '#e2e8f0', color: '#ffffff' },
    { name: 'Orange', bg: '#ea580c', border: '#e2e8f0', color: '#ffffff' },
  ];

  // Presets para sa Accent/Active Colors
  const accentPresets = ['#0284c7', '#059669', '#e11d48', '#db2777', '#7c3aed', '#ea580c'];

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-[99]" onClick={onClose} />}
      
      <div className={`fixed inset-y-0 right-0 z-[100] w-72 bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-slate-800 text-lg">Theme Settings</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          
          <div className="space-y-8">
            
            {/* 1. Sidebar Background */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Sidebar Background</p>
              <div className="grid grid-cols-3 gap-3">
                {sidebarPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setTheme(p => ({ ...p, sidebarBg: preset.sidebarBg, menuTextColor: preset.menuTextColor }))}
                    className={`relative h-16 w-full border rounded-lg transition-all flex items-center justify-center ${theme.sidebarBg === preset.sidebarBg ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'}`}
                    style={{ backgroundColor: preset.sidebarBg }}
                  >
                    {theme.sidebarBg === preset.sidebarBg && <Check size={20} className={(preset.sidebarBg === '#f8fafc' || preset.sidebarBg === '#ffffff' || preset.sidebarBg === 'white') ? 'text-slate-800' : 'text-white'} />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Topbar Design */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Topbar Design</p>
              <div className="grid grid-cols-3 gap-3">
                {topbarPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setTheme(p => ({ ...p, topbarBg: preset.bg, topbarAccent: preset.color, topbarBorder: preset.border }))}
                    className={`relative h-16 w-full border rounded-lg transition-all flex items-center justify-center ${theme.topbarBg === preset.bg ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'}`}
                    style={{ backgroundColor: preset.bg, borderColor: preset.border }}
                  >
                    {theme.topbarBg === preset.bg && <Check size={20} className={preset.bg === '#ffffff' || preset.bg === '#f1f5f9' ? 'text-slate-800' : 'text-white'} />}
                  </button>
                ))}
              </div>
            </div>
            
            <hr />

            {/* 3. Other Background Accent */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Other Background Accent</p>
              <div className="flex flex-wrap gap-3">
                {accentPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => setTheme(p => ({ ...p, activeParentBg: color, activeSubmenuTextColor: color }))}
                    className={`relative w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${theme.activeParentBg === color ? 'ring-2 ring-blue-500 ring-offset-2 scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color }}
                  >
                    {theme.activeParentBg === color && <Check size={16} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};