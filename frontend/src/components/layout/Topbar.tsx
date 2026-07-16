import { useState, useRef, useEffect } from 'react';
import { PanelLeft, PanelLeftClose, PanelLeftOpen, PanelRightOpen, Lock, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils/formatters';

export default function Topbar({ isCollapsed, setIsCollapsed }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const isWhiteBg = theme.topbarBg?.toLowerCase() === '#ffffff' || theme.topbarBg?.toLowerCase() === 'white';

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header 
      className="h-16 flex shadow-md z-10 items-center px-6 justify-between border-b border-slate-200/50 transition-colors duration-300"
      style={{ backgroundColor: theme.topbarBg, borderColor: theme.topbarBorder, color: theme.topbarAccent }}
    >
      
      {/* SIDEBAR TOGGLE WRAPPER */}
      <div className="relative flex items-center">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="p-2 rounded-lg text-slate-500 transition-all duration-300 hover:bg-slate-200/50 active:scale-90 cursor-pointer"
          style={{ color: theme.topbarAccent }}
        >
          {isHovered ? (
            isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />
          ) : (
            <PanelLeft size={20} />
          )}
        </button>

        {/* TOOLTIP / POPUP (Lilitaw sa right side) */}
        <div 
          className={`absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap pointer-events-none transition-all duration-200 z-50
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
        >
          {isCollapsed ? 'Open Sidebar' : 'Close Sidebar'}
          
          {/* Maliit na triangle arrow na nakaturo sa button */}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-800"></div>
        </div>
      </div>

      {/* Profile Trigger */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            color: isWhiteBg ? '#000000' : theme.topbarBg,
            '--glow-color': theme.topbarAccent,
            '--offset-color': theme.topbarBg
          } as React.CSSProperties}
          className={`w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs border-2 border-white 
                      transition-all duration-300 ease-in-out
                      hover:shadow-[0_0_15px_var(--glow-color)]
                      hover:ring-2 hover:ring-offset-2 hover:ring-offset-[var(--offset-color)]
                      active:scale-95 cursor-pointer ${isWhiteBg ? 'hover:ring-black' : 'hover:ring-white'}`}
        >
          {user ? getInitials(user?.data?.member?.firstName + ' ' + user?.data?.member?.lastName) : '??'}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
            
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div 
                  style={{ 
                    color: isWhiteBg ? '#000000' : theme.topbarBg,
                    '--ring-color': isWhiteBg ? '#000000' : theme.topbarBg 
                  } as React.CSSProperties}
                  className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-semibold shadow-sm 
                            transition-all duration-300 ease-in-out 
                            ring-2 ring-[var(--ring-color)] ring-offset-2 cursor-pointer"
                >
                  {user ? getInitials(user?.data?.member?.firstName + ' ' + user?.data?.member?.lastName) : '??'}
                </div>
                <div>
                  {/* Tinama ko yung firsNname -> firstName dito */}
                  <p className="text-sm font-semibold text-slate-900">{user?.data?.member?.firstName} {user?.data?.member?.lastName}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.data?.role || 'User'}</p>
                </div>
              </div>
            </div>

            <div className="p-1">
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-all duration-200 cursor-pointer"
              >
                <Lock size={16} /> Change Password
              </button>
              
              <div className="border-t border-slate-100 my-1" />
              
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 cursor-pointer"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}