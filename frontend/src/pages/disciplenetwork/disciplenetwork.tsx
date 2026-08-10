import React, { useState, useMemo } from 'react';
import { 
  Crown, 
  Shield, 
  Award, 
  UserCheck, 
  UserX, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Sparkles, 
  FolderTree, 
  Users,
  Maximize2,
  Minimize2,
  RefreshCw,
  X,
  ChevronLeft
} from 'lucide-react';
import { useDiscipleNetwork } from '../../hooks/useDiscipleNetwork';

// --- TYPES ---
export interface MemberNode {
  id: number;
  parentId: number | null;
  name: string;
  email: string | null;
  position: string;
  rank: number;
  cluster: string;
  avatarBg: string;
}

interface TreeNodeProps {
  node: MemberNode;
  allMembers: MemberNode[];
  childrenMap: Map<number, MemberNode[]>;
  searchQuery: string;
  expandedNodes: Set<number | string>;
  toggleNode: (id: number | string) => void;
  targetMatchedId: number | null;
}

// --- SINGLE TREE NODE COMPONENT ---
const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  allMembers, 
  childrenMap, 
  searchQuery, 
  expandedNodes, 
  toggleNode,
  targetMatchedId
}) => {
  const children = childrenMap.get(node.id) || [];
  const hasChildren = children.length > 0;
  const isExpanded = expandedNodes.has(node.id);

  // Search Match Highlighting
  const isSearchMatch = searchQuery.trim() !== '' && node.name.toLowerCase().includes(searchQuery.toLowerCase());
  const isTargetScroll = targetMatchedId === node.id;

  // Dynamic Rank & Position Badge Styling Helper
  const getBadgeStyle = (rank: number, position: string) => {
    switch (rank) {
      case 1:
        return {
          badge: 'bg-amber-500 text-white border-amber-300',
          border: 'border-l-4 border-l-amber-500 bg-amber-50/30 hover:bg-amber-50/60',
          icon: <Crown size={14} className="text-amber-500" />,
          label: `L1 • ${position || 'Senior Pastor'}`
        };
      case 2:
        return {
          badge: 'bg-indigo-600 text-white border-indigo-300',
          border: 'border-l-4 border-l-indigo-600 bg-indigo-50/20 hover:bg-indigo-50/50',
          icon: <Shield size={14} className="text-indigo-600" />,
          label: `L2 • ${position}`
        };
      case 3:
        return {
          badge: 'bg-blue-600 text-white border-blue-300',
          border: 'border-l-4 border-l-blue-500 bg-blue-50/20 hover:bg-blue-50/50',
          icon: <Award size={14} className="text-blue-500" />,
          label: 'L3 • GG Leader'
        };
      case 4:
        return {
          badge: 'bg-emerald-600 text-white border-emerald-300',
          border: 'border-l-4 border-l-emerald-500 bg-slate-50/80 hover:bg-slate-100',
          icon: <UserCheck size={14} className="text-emerald-500" />,
          label: 'L4 • GG Member'
        };
      default:
        return {
          badge: 'bg-slate-500 text-white',
          border: 'border-l-4 border-l-slate-400 bg-slate-50',
          icon: <UserX size={14} className="text-slate-400" />,
          label: 'L5 • No GG'
        };
    }
  };

  const style = getBadgeStyle(node.rank, node.position);

  // Categorization Logic for Level 2 under Senior Pastor
  const isSeniorPastor = node.rank === 1;

  const eldersGroup = useMemo(() => children.filter(c => c.position === 'Elder'), [children]);
  const deaconsGroup = useMemo(() => children.filter(c => c.position === 'Deacon'), [children]);
  const pastorsGroup = useMemo(() => children.filter(c => c.position === 'Pastor' || c.position === 'Pastoral Staff'), [children]);
  const otherL2Group = useMemo(() => children.filter(c => !['Elder', 'Deacon', 'Pastor', 'Pastoral Staff'].includes(c.position)), [children]);

  return (
    <div id={`node-${node.id}`} className="relative my-2.5 transition-all">
      {/* NODE CARD CONTAINER */}
      <div 
        className={`flex items-center justify-between min-h-[58px] p-3.5 rounded-2xl border border-slate-200/90 shadow-sm transition-all duration-300 select-none ${style.border} ${
          isTargetScroll 
            ? 'ring-4 ring-amber-400 bg-amber-100 animate-pulse scale-[1.01]' 
            : isSearchMatch 
            ? 'ring-2 ring-amber-400 bg-amber-50/80' 
            : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* EXPAND / COLLAPSE BUTTON */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleNode(node.id)}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 transition-colors shrink-0"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
          )}

          {/* AVATAR */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner shrink-0 ${node.avatarBg}`}>
            {node.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>

          {/* DETAILS & MULTI-ROLE BADGES */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm tracking-tight">{node.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                {node.position}
              </span>

              {/* OPTIONAL: Multi-Role Indicator kung Elder/Pastor na may hawak ding GG */}
              {node.rank === 2 && hasChildren && (
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                  + GG Leader
                </span>
              )}

              {/* OPTIONAL: Indicator kung GG Leader position pero napunta sa Level 5 (Unassigned) */}
              {node.position === 'Growth Group Leader' && node.rank === 5 && (
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                  No Active Group
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{node.email || 'No email registered'}</span>
              <span>•</span>
              <span className="font-medium text-slate-500">{node.cluster}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE BADGES & COUNTS */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          {hasChildren && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              {children.length} {children.length === 1 ? 'Subordinate' : 'Subordinates'}
            </span>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700">
            {style.icon}
            <span>{style.label}</span>
          </div>
        </div>
      </div>

      {/* NESTED CHILDREN (WITH CENTERED CONNECTOR BRANCH LINES) */}
      {hasChildren && isExpanded && (
        <div className="relative pl-6 md:pl-10 ml-4 border-l-2 border-indigo-200/80 space-y-3 mt-2 transition-all">
          
          {/* IF SENIOR PASTOR (LEVEL 1), RENDER THE 3 GROUP CARDS */}
          {isSeniorPastor ? (
            <>
              {/* 1. ELDERS GROUP CARD */}
              {eldersGroup.length > 0 && (
                <div id="cat-elders" className="relative my-1">
                  {/* Perfectly Vertical-Centered Horizontal Line for Group (top-[22px]) */}
                  <span className="absolute -left-6 md:-left-10 top-[22px] w-6 md:w-10 h-[2px] bg-indigo-200/80" />
                  
                  <div 
                    onClick={() => toggleNode('cat-elders')}
                    className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/90 hover:bg-indigo-100/90 border border-indigo-200 cursor-pointer transition-all shadow-sm select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-xl bg-indigo-200/70 text-indigo-800">
                        {expandedNodes.has('cat-elders') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                      <Shield size={18} className="text-indigo-600" />
                      <div>
                        <span className="font-bold text-indigo-950 text-sm">Elders Group</span>
                        <span className="text-xs text-indigo-600 font-medium ml-2">({eldersGroup.length} Members)</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-200 text-indigo-800 uppercase tracking-wider">
                      Role Group
                    </span>
                  </div>

                  {expandedNodes.has('cat-elders') && (
                    <div className="relative pl-6 md:pl-8 ml-3 border-l-2 border-indigo-200/80 space-y-2 mt-2">
                      {eldersGroup.map((child) => (
                        <div key={child.id} className="relative">
                          {/* Centered Horizontal Line for Child Node (top-[29px]) */}
                          <span className="absolute -left-6 md:-left-8 top-[29px] w-6 md:w-8 h-[2px] bg-indigo-200/80" />
                          <TreeNode
                            node={child}
                            allMembers={allMembers}
                            childrenMap={childrenMap}
                            searchQuery={searchQuery}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                            targetMatchedId={targetMatchedId}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. DEACONS GROUP CARD */}
              {deaconsGroup.length > 0 && (
                <div id="cat-deacons" className="relative my-1">
                  <span className="absolute -left-6 md:-left-10 top-[22px] w-6 md:w-10 h-[2px] bg-teal-200/80" />

                  <div 
                    onClick={() => toggleNode('cat-deacons')}
                    className="flex items-center justify-between p-3 rounded-2xl bg-teal-50/90 hover:bg-teal-100/90 border border-teal-200 cursor-pointer transition-all shadow-sm select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-xl bg-teal-200/70 text-teal-800">
                        {expandedNodes.has('cat-deacons') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                      <Award size={18} className="text-teal-600" />
                      <div>
                        <span className="font-bold text-teal-950 text-sm">Deacons Group</span>
                        <span className="text-xs text-teal-600 font-medium ml-2">({deaconsGroup.length} Members)</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-teal-200 text-teal-800 uppercase tracking-wider">
                      Role Group
                    </span>
                  </div>

                  {expandedNodes.has('cat-deacons') && (
                    <div className="relative pl-6 md:pl-8 ml-3 border-l-2 border-teal-200/80 space-y-2 mt-2">
                      {deaconsGroup.map((child) => (
                        <div key={child.id} className="relative">
                          <span className="absolute -left-6 md:-left-8 top-[29px] w-6 md:w-8 h-[2px] bg-teal-200/80" />
                          <TreeNode
                            node={child}
                            allMembers={allMembers}
                            childrenMap={childrenMap}
                            searchQuery={searchQuery}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                            targetMatchedId={targetMatchedId}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. PASTORS & PASTORAL STAFF GROUP CARD */}
              {pastorsGroup.length > 0 && (
                <div id="cat-pastors" className="relative my-1">
                  <span className="absolute -left-6 md:-left-10 top-[22px] w-6 md:w-10 h-[2px] bg-blue-200/80" />

                  <div 
                    onClick={() => toggleNode('cat-pastors')}
                    className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/90 hover:bg-blue-100/90 border border-blue-200 cursor-pointer transition-all shadow-sm select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-xl bg-blue-200/70 text-blue-800">
                        {expandedNodes.has('cat-pastors') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                      <Users size={18} className="text-blue-600" />
                      <div>
                        <span className="font-bold text-blue-950 text-sm">Pastors & Pastoral Staff Group</span>
                        <span className="text-xs text-blue-600 font-medium ml-2">({pastorsGroup.length} Members)</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-200 text-blue-800 uppercase tracking-wider">
                      Role Group
                    </span>
                  </div>

                  {expandedNodes.has('cat-pastors') && (
                    <div className="relative pl-6 md:pl-8 ml-3 border-l-2 border-blue-200/80 space-y-2 mt-2">
                      {pastorsGroup.map((child) => (
                        <div key={child.id} className="relative">
                          <span className="absolute -left-6 md:-left-8 top-[29px] w-6 md:w-8 h-[2px] bg-blue-200/80" />
                          <TreeNode
                            node={child}
                            allMembers={allMembers}
                            childrenMap={childrenMap}
                            searchQuery={searchQuery}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                            targetMatchedId={targetMatchedId}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* OTHER LEVEL 2 MEMBERS IF ANY */}
              {otherL2Group.length > 0 && (
                <div className="space-y-2 mt-2">
                  {otherL2Group.map((child) => (
                    <div key={child.id} className="relative">
                      <span className="absolute -left-6 md:-left-10 top-[29px] w-6 md:w-10 h-[2px] bg-indigo-200/80" />
                      <TreeNode
                        node={child}
                        allMembers={allMembers}
                        childrenMap={childrenMap}
                        searchQuery={searchQuery}
                        expandedNodes={expandedNodes}
                        toggleNode={toggleNode}
                        targetMatchedId={targetMatchedId}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* STANDARD RENDER FOR LEVEL 2 & LEVEL 3 NODES */
            children.map((child) => (
              <div key={child.id} className="relative">
                {/* Centered Horizontal Line to Node Card Middle (top-[29px]) */}
                <span className="absolute -left-6 md:-left-10 top-[29px] w-6 md:w-10 h-[2px] bg-indigo-200/80" />
                <TreeNode
                  node={child}
                  allMembers={allMembers}
                  childrenMap={childrenMap}
                  searchQuery={searchQuery}
                  expandedNodes={expandedNodes}
                  toggleNode={toggleNode}
                  targetMatchedId={targetMatchedId}
                />
              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
};

// --- MAIN TRACKER COMPONENT ---
export default function LeadershipHierarchyTracker() {
  const { data: membersData = [], isLoading, isError, refetch } = useDiscipleNetwork();

  const [activeTab, setActiveTab] = useState<'tree' | 'unassigned'>('tree');
  const [search, setSearch] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<number | string>>(new Set());
  const [targetMatchedId, setTargetMatchedId] = useState<number | null>(null);
  
  // Pagination state for Level 5 / Unassigned Members
  const [unassignedPage, setUnassignedPage] = useState(1);
  const itemsPerPage = 24;

  const memberMap = useMemo(() => {
    const map = new Map<number, MemberNode>();
    membersData.forEach(m => map.set(m.id, m));
    return map;
  }, [membersData]);

  // BUILD PARENT -> CHILDREN LOOKUP MAP & COUNTS
  const { rootNodes, unassignedNodes, childrenMap, totalCounts } = useMemo(() => {
    const map = new Map<number, MemberNode[]>();
    const roots: MemberNode[] = [];
    const unassigned: MemberNode[] = [];

    let l1 = 0, l2 = 0, l3 = 0, l4 = 0, l5 = 0;

    membersData.forEach((member) => {
      if (member.rank === 1) l1++;
      if (member.rank === 2) l2++;
      if (member.rank === 3) l3++;
      if (member.rank === 4) l4++;
      if (member.rank === 5) l5++;

      if (member.rank === 5) {
        unassigned.push(member);
      } else if (member.parentId === null) {
        roots.push(member);
      } else {
        const list = map.get(member.parentId) || [];
        list.push(member);
        map.set(member.parentId, list);
      }
    });

    return {
      rootNodes: roots,
      unassignedNodes: unassigned,
      childrenMap: map,
      totalCounts: { total: membersData.length, l1, l2, l3, l4, l5 }
    };
  }, [membersData]);

  // Default expanded nodes
  React.useEffect(() => {
    if (rootNodes.length > 0) {
      const defaultExpanded = new Set<number | string>(rootNodes.map(r => r.id));
      defaultExpanded.add('cat-elders');
      defaultExpanded.add('cat-deacons');
      defaultExpanded.add('cat-pastors');
      setExpandedNodes(defaultExpanded);
    }
  }, [rootNodes]);

  const toggleNode = (id: number | string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds: (number | string)[] = membersData.filter(m => m.rank < 4).map(m => m.id);
    allIds.push('cat-elders', 'cat-deacons', 'cat-pastors');
    setExpandedNodes(new Set(allIds));
  };

  const collapseAll = () => {
    setExpandedNodes(new Set(rootNodes.map(r => r.id)));
  };

  const handleClearSearch = () => {
    setSearch('');
    setTargetMatchedId(null);
    setUnassignedPage(1);
  };

  // SEARCH AND AUTO-SCROLL LOGIC (ENTER KEY)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    // Reset pagination
    setUnassignedPage(1);

    // Hanapin ang unang miyembrong nagm-match sa search query
    const matchedMember = membersData.find(m => 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      (m.email && m.email.toLowerCase().includes(search.toLowerCase()))
    );

    if (!matchedMember) return;

    // Kung L5 (Unassigned), kusa ring lilipat sa Unassigned tab
    if (matchedMember.rank === 5) {
      setActiveTab('unassigned');
      return;
    }

    // Kung nasa Tree, i-expand ang buong pamilya ng leader
    setActiveTab('tree');
    const nodesToExpand = new Set<number | string>(expandedNodes);

    let currId: number | null = matchedMember.id;
    while (currId !== null) {
      const currNode = memberMap.get(currId);
      if (!currNode) break;

      nodesToExpand.add(currNode.id);

      if (currNode.rank === 2) {
        if (currNode.position === 'Elder') nodesToExpand.add('cat-elders');
        else if (currNode.position === 'Deacon') nodesToExpand.add('cat-deacons');
        else if (currNode.position === 'Pastor' || currNode.position === 'Pastoral Staff') nodesToExpand.add('cat-pastors');
      }

      currId = currNode.parentId;
    }

    setExpandedNodes(nodesToExpand);
    setTargetMatchedId(matchedMember.id);

    // Auto-scroll smoothly sa target node DOM element
    setTimeout(() => {
      const el = document.getElementById(`node-${matchedMember.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  };

  // Filtered Unassigned (Level 5) Members
  const filteredUnassigned = useMemo(() => {
    if (!search.trim()) return unassignedNodes;
    return unassignedNodes.filter(m => 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      (m.email && m.email.toLowerCase().includes(search.toLowerCase()))
    );
  }, [unassignedNodes, search]);

  // Paginated Unassigned Members
  const totalUnassignedPages = Math.ceil(filteredUnassigned.length / itemsPerPage) || 1;
  const paginatedUnassigned = useMemo(() => {
    const start = (unassignedPage - 1) * itemsPerPage;
    return filteredUnassigned.slice(start, start + itemsPerPage);
  }, [filteredUnassigned, unassignedPage]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm w-full">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="font-bold text-slate-800 text-lg">Loading Disciple Network...</h3>
        <p className="text-slate-400 text-xs mt-1">Fetching leadership hierarchy and growth group assignments.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-3xl border border-rose-200 text-rose-700 w-full">
        <h3 className="font-bold text-lg">Nagka-error sa pag-load ng Disciple Network</h3>
        <p className="text-xs text-rose-500 mt-1 mb-4">Hindi makuha ang data mula sa server. Pakisubukan ulit.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-rose-700 transition-all"
        >
          <RefreshCw size={14} /> Subukan Ulit
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/5 p-3 sm:p-5 md:p-6 font-sans text-slate-800 w-full">
      <div className="w-full space-y-6">
        
        {/* EXECUTIVE HEADER - FULL WIDTH */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 w-full">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles size={15} /> Church Leadership Architecture
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Organizational Tree Tracker
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">
              Interactive structural map connecting leaders to members with real-time level hierarchies.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('tree')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tree' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderTree size={16} /> Hierarchy Tree ({totalCounts.total - totalCounts.l5})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unassigned')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'unassigned' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserX size={16} /> No Growth Group ({totalCounts.l5})
            </button>
          </div>
        </div>

        {/* METRICS SUMMARY STRIP - FULL WIDTH */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 block">Level 1</span>
            <span className="text-lg font-black text-slate-900">{totalCounts.l1}</span>
            <span className="text-xs text-slate-400 block font-medium">Senior Pastor</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-indigo-600 block">Level 2</span>
            <span className="text-lg font-black text-slate-900">{totalCounts.l2}</span>
            <span className="text-xs text-slate-400 block font-medium">Staff / Elders</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 block">Level 3</span>
            <span className="text-lg font-black text-slate-900">{totalCounts.l3}</span>
            <span className="text-xs text-slate-400 block font-medium">GG Leaders</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 block">Level 4</span>
            <span className="text-lg font-black text-slate-900">{totalCounts.l4}</span>
            <span className="text-xs text-slate-400 block font-medium">GG Members</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Level 5</span>
            <span className="text-lg font-black text-slate-900">{totalCounts.l5}</span>
            <span className="text-xs text-slate-400 block font-medium">Unassigned / No GG</span>
          </div>
        </div>

        {/* TOOLBAR WITH CLEAR SEARCH & ZOOM STABILITY */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Type name & press Enter to scroll..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setUnassignedPage(1);
              }}
              className="w-full pl-9 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-16 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold transition-all"
            >
              Search
            </button>
          </form>

          {activeTab === 'tree' && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <button
                type="button"
                onClick={expandAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Maximize2 size={13} /> Expand Tree
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Minimize2 size={13} /> Collapse Tree
              </button>
            </div>
          )}
        </div>

        {/* TAB CONTENT 1: INTERACTIVE HIERARCHY TREE */}
        {activeTab === 'tree' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm overflow-x-auto w-full">
            <div className="min-w-[760px] space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Leadership Hierarchy Flow (Type name & hit Enter to auto-locate)
              </div>

              {rootNodes.length > 0 ? (
                rootNodes.map((rootNode) => (
                  <TreeNode
                    key={rootNode.id}
                    node={rootNode}
                    allMembers={membersData}
                    childrenMap={childrenMap}
                    searchQuery={search}
                    expandedNodes={expandedNodes}
                    toggleNode={toggleNode}
                    targetMatchedId={targetMatchedId}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 font-medium text-sm">
                  Walang nahanap na Senior Pastor o Root Node sa hierarchy.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: UNASSIGNED MEMBERS (LEVEL 5 - NO GG) */}
        {activeTab === 'unassigned' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Unassigned Members (Level 5)
                </span>
                {search.trim() && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                      Filtered by "{search}" ({filteredUnassigned.length} of {totalCounts.l5} found)
                    </span>
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="text-xs text-slate-500 underline hover:text-slate-800"
                    >
                      Clear filter to view all {totalCounts.l5}
                    </button>
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Showing {filteredUnassigned.length} of {totalCounts.l5} Members
              </span>
            </div>

            {paginatedUnassigned.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {paginatedUnassigned.map((member) => (
                    <div key={member.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{member.name}</div>
                          <div className="text-xs text-slate-400">{member.email || 'No email registered'}</div>
                        </div>
                      </div>
                      <button type="button" className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors shrink-0 ml-2">
                        Assign GG
                      </button>
                    </div>
                  ))}
                </div>

                {/* PAGINATION CONTROLS FOR 650 MEMBERS */}
                {totalUnassignedPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                      Page {unassignedPage} of {totalUnassignedPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={unassignedPage === 1}
                        onClick={() => setUnassignedPage(p => Math.max(p - 1, 1))}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1"
                      >
                        <ChevronLeft size={14} /> Prev
                      </button>
                      <button
                        type="button"
                        disabled={unassignedPage === totalUnassignedPages}
                        onClick={() => setUnassignedPage(p => Math.min(p + 1, totalUnassignedPages))}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1"
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-slate-400 font-medium text-sm">
                Walang miyembrong nagm-match sa "{search}".
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}