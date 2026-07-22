import { useState, useEffect } from 'react';
import { FaUsers, FaUserFriends, FaNetworkWired, FaLayerGroup, FaChartArea, FaCogs } from "react-icons/fa";
import { Users, Calendar, Settings, ChevronDown, ChevronRight, MonitorCog } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils/formatters';

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
  const [isGroupsOpen, setIsGroupsOpen] = useState(() => location.pathname.startsWith('/groups'));
  const [isGroupSetupOpen, setIsGroupSetupOpen] = useState(() => location.pathname.startsWith('/group-setup'));

  // 2. AUTO-CLOSE LOGIC: Kapag lumipat ng page, isasara ang menu na hindi kasama sa path
  useEffect(() => {
    if (!location.pathname.startsWith('/members')) {
      setIsMembersOpen(false);
    }
    if (!location.pathname.startsWith('/groups')) {
      setIsGroupsOpen(false);
    }
    if (!location.pathname.startsWith('/group-setup')) {
      setIsGroupSetupOpen(false);
    }
  }, [location.pathname]);

  // Handler para sa pag-toggle (Accordion style)
  const toggleMembers = () => {
    setIsMembersOpen(!isMembersOpen);
    setIsGroupsOpen(false);
    setIsGroupSetupOpen(false); // Close Groups pag binuksan members
  };

  const toggleGroups = () => {
    setIsGroupsOpen(!isGroupsOpen);
    setIsMembersOpen(false); 
    setIsGroupSetupOpen(false);// Close members pag binuksan Groups
  };

  const toggleGroupSetup = () => {
    setIsGroupSetupOpen(!isGroupSetupOpen);// Close members pag binuksan Groups
    setIsGroupsOpen(false);
    setIsMembersOpen(false); 
  };

  // Active States
  const isGroupsActive = location.pathname.startsWith('/groups');
  const isMembersActive = location.pathname.startsWith('/members');
  const isGroupSetupActive = location.pathname.startsWith('/group-setup');

  // Classes
  const activeParentClass = `bg-gradient-to-br from-[var(--active-parent)] to-black/30 rounded-2xl text-white font-medium`;
  const inactiveParentClass = `text-[var(--menu-text)] hover:bg-slate-700/40 hover:text-white`;
  
  // Tinanggal ang gap-3 dito at nilipat sa loob para sa mas maayos na animation
  const navLinkBase = "flex items-center px-3.5 py-2.5 text-sm rounded-lg transition-colors duration-150 ease-in-out w-full";
  
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    `${navLinkBase} ${isActive ? activeParentClass : inactiveParentClass} ${isCollapsed ? 'justify-center px-0' : ''}`;

  // Smoother Header para sa "Navigations"
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="relative mt-3 mb-3 flex items-center h-4">
       <div className={`absolute transition-all duration-300 border-t border-slate-700/50 mx-4 left-0 right-0 ${isCollapsed ? 'opacity-100' : 'opacity-0 hidden'}`}></div>
       <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
         <div className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</div>
       </div>
    </div>
  );

  return (
    <aside 
      className={`h-full shadow-xl relative z-20 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{ backgroundColor: getColor('--sidebar-bg'), color: getColor('--menu-text') }}
    >
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-5'} border-b border-slate-400/50 shrink-0 transition-all duration-300`}>
        {/* Logo Section */}
        <div className="w-10 h-10 rounded-full border-3 border-[var(--active-parent)] shadow-md overflow-hidden shrink-0">
          <img src="/web_images/cdms_logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>

        {/* Brand Text Section (May width and opacity animation para di agad lumabas) */}
        <div className={`flex flex-col justify-center select-none overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3'}`}>
          <span className="font-extrabold text-[15px] leading-tight tracking-tight text-slate-100">
            Disciple<span className="text-[var(--active-parent)]">Network</span>
          </span>
          <span className="text-[8px] font-bold leading-none tracking-widest text-slate-400 uppercase mt-0.5">
            Management System
          </span>
        </div>
      </div>

      {/* Overflow Fix: Ginawang 'overflow-visible' pag isCollapsed para di ma-clip ang popups */}
      <nav className={`flex-1 p-4 space-y-3 scrollbar-thin ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden'}`}>
        
        {/* DASHBOARD WITH HOVER TOOLTIP */}
        <div className="relative group/dashboard">
          <NavLink to="/" className={getNavLinkClass}>
            <FaChartArea size={18} className="shrink-0" />
            <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3'}`}>
              Dashboard
            </span>
          </NavLink>
          {isCollapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg pointer-events-none opacity-0 group-hover/dashboard:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap border border-slate-700/50">
              Dashboard
            </div>
          )}
        </div>

        <div>
          <SectionHeader title="Navigations" />
          <div className="space-y-1.5">
            
            {/* MEMBERS DROPDOWN WITH POP-OUT MENU */}
            <div className="relative group/members">
              <button onClick={toggleMembers} className={`${navLinkBase} justify-between ${isMembersActive ? activeParentClass : inactiveParentClass} ${isCollapsed ? 'justify-center px-0' : ''}`}>
                <div className="flex items-center">
                  <FaUsers size={18} className="shrink-0" />
                  <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3 text-left'}`}>
                    Members
                  </span>
                </div>
                <div className={`overflow-hidden transition-all duration-300 flex items-center justify-end ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[20px] opacity-100'}`}>
                  {isMembersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </button>
              
              {/* Accordion (Visible only when sidebar is OPEN) */}
              {!isCollapsed && isMembersOpen && (
                <div className="mt-1 relative w-full space-y-1 animate-in slide-in-from-top-2 fade-in duration-200"> 
                   <div className="absolute left-[23px] top-0 bottom-0 w-[1px] bg-slate-700/50 z-0" />
                   
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

              {/* Fly-out Pop-out Menu */}
              {isCollapsed && (
                <div className="absolute left-full top-0 pl-2 w-52 opacity-0 pointer-events-none group-hover/members:opacity-100 group-hover/members:pointer-events-auto transition-all duration-200 ease-in-out z-50">
                  <div className="py-2 rounded-xl shadow-xl border border-slate-700/40 flex flex-col space-y-1 px-1.5 bg-slate-800" style={{ backgroundColor: getColor('--sidebar-bg') }}>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-700/30 mb-1">
                      Members Menu
                    </div>
                    <NavLink to="/members/all" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      All Members
                    </NavLink>
                    <NavLink to="/members/pastoral-staff" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      Pastoral Staff
                    </NavLink>
                    <NavLink to="/members/elders" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      Elders
                    </NavLink>
                    <NavLink to="/members/deacons" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      Deacons
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
            
            {/* VISITORS */}
            <div className="relative group/visitors">
              <NavLink to="/visitors" className={getNavLinkClass}>
                <FaUserFriends size={18} className="shrink-0" />
                <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3'}`}>
                  Visitors
                </span>
              </NavLink>
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg pointer-events-none opacity-0 group-hover/visitors:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap border border-slate-700/50">
                  Visitors
                </div>
              )}
            </div>

            {/* DISCIPLE NETWORK */}
            <div className="relative group/network">
              <NavLink to="/disciple-network" className={getNavLinkClass}>
                <FaNetworkWired size={18} className="shrink-0" />
                <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3'}`}>
                  Disciple Network
                </span>
              </NavLink>
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg pointer-events-none opacity-0 group-hover/network:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap border border-slate-700/50">
                  Disciple Network
                </div>
              )}
            </div>
            
            {/* GROUPS DROPDOWN WITH POP-OUT MENU */}
            {/* FIXED: Tinanggal ang flex at w-full dito para hindi mag-row layout ang accordion items */}
            <div className="relative group/groups">
              <button onClick={toggleGroups} className={`${navLinkBase} justify-between ${isGroupsActive ? activeParentClass : inactiveParentClass} ${isCollapsed ? 'justify-center px-0' : ''}`}>
                <div className="flex items-center">
                  <FaLayerGroup size={18} className="shrink-0" />
                  <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3 text-left'}`}>
                    Groups
                  </span>
                </div>
                <div className={`overflow-hidden transition-all duration-300 flex items-center justify-end ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[20px] opacity-100'}`}>
                  {isGroupsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </button>
              
              {/* Accordion */}
              {!isCollapsed && isGroupsOpen && (
                <div className="mt-1 relative w-full space-y-1 animate-in slide-in-from-top-2 fade-in duration-200"> 
                   <div className="absolute left-[23px] top-0 bottom-0 w-[1px] bg-slate-700/50 z-0" />
                   
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
                   <NavLink to="/groups/ggli-students" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>GGLi Students</div>
                       </div>
                     )}
                   </NavLink>
                </div>
              )}

              {/* Fly-out Pop-out Menu */}
              {isCollapsed && (
                <div className="absolute left-full top-0 pl-2 w-52 opacity-0 pointer-events-none group-hover/groups:opacity-100 group-hover/groups:pointer-events-auto transition-all duration-200 ease-in-out z-50">
                  <div className="py-2 rounded-xl shadow-xl border border-slate-700/40 flex flex-col space-y-1 px-1.5 bg-slate-800" style={{ backgroundColor: getColor('--sidebar-bg') }}>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-700/30 mb-1">
                      Groups Menu
                    </div>
                    <NavLink to="/groups/clusters" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      Clusters
                    </NavLink>
                    <NavLink to="/groups/growth-groups" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      Growth Groups
                    </NavLink>
                    <NavLink to="/groups/ggli-students" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      GGLi Classes
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div>
          <SectionHeader title="Referentials" />
          <div className="space-y-1.5">
            
            {/* GROUP SETUP DROPDOWN WITH POP-OUT MENU */}
            <div className="relative group/groupsetup">
              <button onClick={toggleGroupSetup} className={`${navLinkBase} justify-between ${isGroupSetupActive ? activeParentClass : inactiveParentClass} ${isCollapsed ? 'justify-center px-0' : ''}`}>
                <div className="flex items-center">
                  <FaCogs size={18} className="shrink-0" />
                  <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3 text-left'}`}>
                    Group Setup
                  </span>
                </div>
                <div className={`overflow-hidden transition-all duration-300 flex items-center justify-end ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[20px] opacity-100'}`}>
                  {isGroupSetupOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </button>
              
              {/* Accordion (Visible only when sidebar is OPEN) */}
              {!isCollapsed && isGroupSetupOpen && (
                <div className="mt-1 relative w-full space-y-1 animate-in slide-in-from-top-2 fade-in duration-200"> 
                   <div className="absolute left-[23px] top-0 bottom-0 w-[1px] bg-slate-700/50 z-0" />
                   
                   <NavLink to="/group-setup/churches" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>Churches</div>
                       </div>
                     )}
                   </NavLink>
                   <NavLink to="/group-setup/clusters" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>Clusters</div>
                       </div>
                     )}
                   </NavLink>
                   <NavLink to="/group-setup/growth-groups" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>Growth Groups</div>
                       </div>
                     )}
                   </NavLink>
                   <NavLink to="/group-setup/ggli-students" className="group flex items-center w-full text-sm h-9 relative z-10">
                     {({ isActive }) => (
                       <div className="pl-[23px] flex items-center w-full h-full">
                         <span className={`h-[1px] shrink-0 transition-all duration-150 ${isActive ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)]'}`} />
                         <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'}`}>GGLI Students</div>
                       </div>
                     )}
                   </NavLink>
                </div>
              )}

              {/* Fly-out Pop-out Menu */}
              {isCollapsed && (
                <div className="absolute left-full top-0 pl-2 w-52 opacity-0 pointer-events-none group-hover/groupsetup:opacity-100 group-hover/groupsetup:pointer-events-auto transition-all duration-200 ease-in-out z-50">
                  <div className="py-2 rounded-xl shadow-xl border border-slate-700/40 flex flex-col space-y-1 px-1.5 bg-slate-800" style={{ backgroundColor: getColor('--sidebar-bg') }}>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-700/30 mb-1">
                      Group Setup Menu
                    </div>
                    <NavLink to="/group-setup/churches" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      Churches
                    </NavLink>
                    <NavLink to="/group-setup/clusters" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      Clusters
                    </NavLink>
                    <NavLink to="/group-setup/growth-groups" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      Growth Groups
                    </NavLink>
                    <NavLink to="/group-setup/ggli-students" className={({ isActive }) => `flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'text-white font-bold bg-slate-700/30' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                      GGLI Students
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-3 border-t border-slate-400/50 mt-auto bg-slate-800 shrink-0">
        <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
           
           {/* Profile Details Container */}
           <div className={`flex items-center overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0 m-0' : 'max-w-[200px] opacity-100'}`}>
             <div className="w-10 h-10 rounded-full bg-[var(--active-parent)] flex items-center justify-center text-white font-semibold shadow-sm shrink-0">
               {user?.data?.member ? getInitials(`${user.data.member.firstName} ${user.data.member.lastName}`) : '??'}
             </div>
             <div className="ml-3 overflow-hidden whitespace-nowrap">
                <p className="text-sm font-semibold text-white truncate max-w-[100px]">{user?.data?.member?.firstName} {user?.data?.member?.lastName}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.data?.role}</p>
             </div>
           </div>

           {/* Settings Button */}
           <button 
             onClick={onOpenSettings} 
             className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all duration-300 hover:rotate-90 flex items-center justify-center shrink-0" 
             title="Change Theme"
           >
            <Settings size={18} />
           </button>
           
        </div>
      </div>
    </aside>
  );
}