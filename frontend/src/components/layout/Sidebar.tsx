import { useState, useEffect } from 'react';
import { FaUsers, FaUserFriends, FaNetworkWired, FaLayerGroup } from "react-icons/fa";
import { 
  LayoutDashboard, Users, Calendar, Settings, 
  ChevronDown, ChevronRight, MonitorCog 
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils/formatters';
import Logo from '../ui/Logo';

const getColor = (variable: string) => `var(${variable})`;

export default function Sidebar({ 
  isCollapsed, 
  onOpenSettings 
}: { 
  isCollapsed: boolean; 
  onOpenSettings: () => void; 
}) {
  const { user } = useAuth();
  const location = useLocation();

  // 1. STATE: Initialized base sa URL pag load
  const [isMembersOpen, setIsMembersOpen] = useState(() => location.pathname.startsWith('/members'));
  const [isBillingOpen, setIsBillingOpen] = useState(() => location.pathname.startsWith('/billing'));

  // 2. AUTO-CLOSE LOGIC: Kapag lumipat ng page, isasara ang menu na hindi kasama sa path
  useEffect(() => {
    if (!location.pathname.startsWith('/members')) {
      setIsMembersOpen(false);
    }
    if (!location.pathname.startsWith('/billing')) {
      setIsBillingOpen(false);
    }
  }, [location.pathname]);

  // Handler para sa pag-toggle (Accordion style)
  const toggleMembers = () => {
    setIsMembersOpen(!isMembersOpen);
    setIsBillingOpen(false); // Close billing pag binuksan members
  };

  const toggleBilling = () => {
    setIsBillingOpen(!isBillingOpen);
    setIsMembersOpen(false); // Close members pag binuksan billing
  };

  // Active States
  const isBillingActive = location.pathname.startsWith('/billing');
  const isMembersActive = location.pathname.startsWith('/members');

  // Classes
  const activeParentClass = `bg-[var(--active-parent)] text-white font-medium shadow-md shadow-blue-500/20`;
  const inactiveParentClass = `text-[var(--menu-text)] hover:bg-slate-700/40 hover:text-white`;
  const navLinkBase = "flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg transition-colors duration-150 ease-in-out";
  
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    `${navLinkBase} ${isActive ? activeParentClass : inactiveParentClass} ${isCollapsed ? 'justify-center px-0' : ''}`;

  const SectionHeader = ({ title }: { title: string }) => (
    isCollapsed ? <div className="border-t border-slate-700/50 mx-4 my-4"></div> : 
    <div className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 first:mt-0">{title}</div>
  );

  return (
    <aside 
      className={`h-full shadow-xl relative z-20 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{ backgroundColor: getColor('--sidebar-bg'), color: getColor('--menu-text') }}
    >
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-5'} border-b border-slate-400/50 shrink-0`}>
        <div className="w-10 h-10 rounded-full border-3 border-[var(--active-parent)] shadow-md overflow-hidden shrink-0">
          <Logo />
        </div>
        {!isCollapsed && <span className="ml-2.5 font-extrabold text-xl tracking-tight">Med<span className="text-[var(--active-parent)]">Salus</span></span>}
      </div>

      <nav className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin">
        <NavLink to="/" className={getNavLinkClass}>
          <LayoutDashboard size={18} className="shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        <div>
          <SectionHeader title="Operations" />
          <div className="space-y-1.5">
            
            {/* MEMBERS DROPDOWN */}
            <div>
              <button onClick={toggleMembers} className={`${navLinkBase} w-full justify-between ${isMembersActive ? activeParentClass : inactiveParentClass} ${isCollapsed ? 'justify-center px-0' : ''}`}>
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                  <FaUsers size={18} className="shrink-0" />
                  {!isCollapsed && <span>Members</span>}
                </div>
                {!isCollapsed && (isMembersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              
              {isMembersOpen && (
                <div className={`mt-1 relative w-full ${isCollapsed ? 'flex flex-col items-center gap-2' : 'space-y-1'}`}> 
                   {!isCollapsed && <div className="absolute left-[23px] top-0 bottom-0 w-[1px] bg-slate-700/50 z-0" />}
                   
                   {/* Sublinks */}
                   <NavLink to="/members/all" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>All Members</div>
                       </div>
                     )}
                   </NavLink>
                   <NavLink to="/members/pastoral-staff" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>Pastoral Staff</div>
                       </div>
                     )}
                   </NavLink>
                   <NavLink to="/members/elders" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>Elders</div>
                       </div>
                     )}
                   </NavLink>
                   <NavLink to="/members/deacons" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>Deacons</div>
                       </div>
                     )}
                   </NavLink>
                </div>
              )}
            </div>
            
            <NavLink to="/visitors" className={getNavLinkClass}>
              <FaUserFriends size={18} className="shrink-0" />
              {!isCollapsed && <span>Visitors</span>}
            </NavLink>
            <NavLink to="/disciple-network" className={getNavLinkClass}>
              <FaNetworkWired size={18} className="shrink-0" />
              {!isCollapsed && <span>Disciple Network</span>}
            </NavLink>
            
            {/* GROUPS DROPDOWN */}
            <div>
              <button onClick={toggleBilling} className={`${navLinkBase} w-full justify-between ${isBillingActive ? activeParentClass : inactiveParentClass} ${isCollapsed ? 'justify-center px-0' : ''}`}>
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                  <FaLayerGroup size={18} className="shrink-0" />
                  {!isCollapsed && <span>Groups</span>}
                </div>
                {!isCollapsed && (isBillingOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              
              {isBillingOpen && (
                <div className={`mt-1 relative w-full ${isCollapsed ? 'flex flex-col items-center gap-2' : 'space-y-1'}`}> 
                   {!isCollapsed && <div className="absolute left-[23px] top-0 bottom-0 w-[1px] bg-slate-700/50 z-0" />}
                   
                   <NavLink to="/groups/clusters" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>Clusters</div>
                       </div>
                     )}
                   </NavLink>
                   <NavLink to="/groups/growth-groups" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>Growth Groups</div>
                       </div>
                     )}
                   </NavLink>
                   <NavLink to="/groups/ggli-classes" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>GGLi Classes</div>
                       </div>
                     )}
                   </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* FOOTER: Restored with original design and hover animation */}
      <div className="p-4 border-t border-slate-400/50 mt-auto bg-slate-800">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
           {!isCollapsed && (
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[var(--active-parent)] flex items-center justify-center text-white font-semibold shadow-sm">
                 {user?.data?.member ? getInitials(`${user.data.member.firstName} ${user.data.member.lastName}`) : '??'}
               </div>
               <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[100px]">{user?.data?.member?.firstName} {user?.data?.member?.lastName}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.data?.role}</p>
               </div>
             </div>
           )}
           <button 
             onClick={onOpenSettings} 
             className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all duration-300 hover:rotate-90 flex items-center justify-center" 
             title="Change Theme"
           >
            <Settings size={18} />
           </button>
        </div>
      </div>
    </aside>
  );
}