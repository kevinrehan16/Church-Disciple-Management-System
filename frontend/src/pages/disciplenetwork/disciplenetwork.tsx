import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Maximize2, 
  Minimize2, 
  Folder, 
  Link2, 
  ShieldCheck, 
  Users,
  ArrowUp
} from 'lucide-react';
import { useDiscipleNetwork } from '../../hooks/useDiscipleNetwork';

// --- TYPES ---
export interface MemberNode {
  nodeKey: string;
  memberId: number | string;
  parentId: number | string | null;
  name: string;
  email: string | null;
  churchPosition: string | null;
  ggRole: 'GG Leader' | 'GG Member' | 'Growth Group' | 'Group' | 'None';
  rank: number;
  primaryRank: number;
  hasGrowthGroup: boolean;
  growthGroupName: string;
  isDuplicate: boolean;
  isGroupFolder?: boolean;
  avatarBg: string;
}

interface TreeNodeProps {
  node: MemberNode;
  allMembers: MemberNode[];
  childrenMap: Map<number | string, MemberNode[]>;
  searchQuery: string;
  expandedNodes: Set<string>;
  toggleNode: (key: string) => void;
  targetMatchedKey: string | null;
  ancestorIds?: Set<number | string>;
}

// --- RECURSIVE TREE NODE COMPONENT ---
const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  allMembers, 
  childrenMap, 
  searchQuery, 
  expandedNodes, 
  toggleNode,
  targetMatchedKey,
  ancestorIds = new Set()
}) => {
  const currentAncestors = new Set(ancestorIds);
  currentAncestors.add(node.memberId);

  const rawChildren = node.isDuplicate ? [] : (childrenMap.get(node.memberId) || []);
  
  const children = rawChildren.filter(child => {
    if (child.isDuplicate) return true;
    return !currentAncestors.has(child.memberId);
  });

  const hasChildren = children.length > 0;
  const isExpanded = expandedNodes.has(node.nodeKey);

  const isSearchMatch = searchQuery.trim() !== '' && node.name.toLowerCase().includes(searchQuery.toLowerCase());
  const isTargetScroll = targetMatchedKey === node.nodeKey;

  // --- 1. RENDER FOR GROUP / CATEGORY / GG FOLDERS ---
  if (node.isGroupFolder) {
    return (
      <div id={`node-${node.nodeKey}`} className="relative my-2 transition-all">
        <div 
          onClick={() => toggleNode(node.nodeKey)}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100/90 border border-indigo-200/80 cursor-pointer transition-all shadow-sm select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-indigo-200/70 text-indigo-800">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            <Folder size={18} className="text-indigo-600" />
            <div>
              <span className="font-bold text-indigo-950 text-sm">{node.name}</span>
              <span className="text-xs text-indigo-600 font-medium ml-2">
                ({children.length} {children.length === 1 ? 'member' : 'members'})
              </span>
            </div>
          </div>

          {hasChildren && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
              {children.length} {children.length === 1 ? 'Subordinate' : 'Subordinates'}
            </span>
          )}
        </div>

        {/* ALIGNED CONNECTING LINES FOR GROUP FOLDERS */}
        {hasChildren && isExpanded && (
          <div className="relative pl-8 ml-3 border-l-2 border-indigo-200/80 space-y-2 mt-2">
            {children.map((child) => (
              <div key={child.nodeKey} className="relative">
                <span className="absolute -left-8 top-[28px] w-8 h-[2px] bg-indigo-200/80" />
                <TreeNode 
                  node={child} 
                  allMembers={allMembers} 
                  childrenMap={childrenMap} 
                  searchQuery={searchQuery} 
                  expandedNodes={expandedNodes} 
                  toggleNode={toggleNode} 
                  targetMatchedKey={targetMatchedKey} 
                  ancestorIds={currentAncestors} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- 2. RENDER FOR PERSON / MEMBER CARDS ---
  const getBadgeStyle = (rank: number, position: string | null) => {
    switch (rank) {
      case 1:
        return {
          border: 'border-l-4 border-l-amber-500 bg-amber-50/30 hover:bg-amber-50/60',
          icon: <Crown size={14} className="text-amber-500" />,
          label: `L1 • ${position || 'Senior Pastor'}`
        };
      case 2:
        return {
          border: 'border-l-4 border-l-indigo-600 bg-indigo-50/20 hover:bg-indigo-50/50',
          icon: <Shield size={14} className="text-indigo-600" />,
          label: `L2 • ${position || 'Staff / Elder'}`
        };
      case 3:
        return {
          border: 'border-l-4 border-l-blue-500 bg-blue-50/20 hover:bg-blue-50/50',
          icon: <Award size={14} className="text-blue-500" />,
          label: 'L3 • GG Leader'
        };
      case 4:
        return {
          border: 'border-l-4 border-l-emerald-500 bg-slate-50/80 hover:bg-slate-100',
          icon: <UserCheck size={14} className="text-emerald-500" />,
          label: 'L4 • GG Member'
        };
      default:
        return {
          border: 'border-l-4 border-l-slate-400 bg-slate-50',
          icon: <UserX size={14} className="text-slate-400" />,
          label: 'L5 • Member'
        };
    }
  };

  const style = getBadgeStyle(node.rank, node.churchPosition);
  const rawGGName = node.growthGroupName;
  const displayGGName = (!rawGGName || rawGGName === 'Walang GG') ? 'No GrowthGroup' : rawGGName;

  return (
    <div id={`node-${node.nodeKey}`} className="relative my-2.5 transition-all">
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
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleNode(node.nodeKey)}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 transition-colors shrink-0"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
          )}

          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner shrink-0 ${node.avatarBg}`}>
            {node.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-sm tracking-tight">{node.name}</span>
              
              {node.churchPosition && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  {node.churchPosition}
                </span>
              )}

              {node.ggRole === 'GG Leader' && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                  Growth Group Leader
                </span>
              )}
              {node.ggRole === 'GG Member' && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  Growth Group Member
                </span>
              )}

              {node.isDuplicate && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
                  <Link2 size={10} /> Secondary Node
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{node.email || 'No email registered'}</span>
              <span>•</span>
              <span className={`font-semibold ${node.hasGrowthGroup ? 'text-indigo-600' : 'text-slate-400 italic'}`}>
                {displayGGName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {hasChildren && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              {children.length} {children.length === 1 ? 'Subordinate' : 'Subordinates'}
            </span>
          )}

          {node.rank <= 4 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700">
              {style.icon}
              <span>{style.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* ALIGNED CONNECTING LINES FOR MEMBER NODES */}
      {hasChildren && isExpanded && (
        <div className="relative pl-8 ml-4 border-l-2 border-indigo-200/80 space-y-3 mt-2 transition-all">
          {children.map((child) => (
            <div key={child.nodeKey} className="relative">
              <span className="absolute -left-8 top-[28px] w-8 h-[2px] bg-indigo-200/80" />
              <TreeNode 
                node={child} 
                allMembers={allMembers} 
                childrenMap={childrenMap} 
                searchQuery={searchQuery} 
                expandedNodes={expandedNodes} 
                toggleNode={toggleNode} 
                targetMatchedKey={targetMatchedKey} 
                ancestorIds={currentAncestors} 
              />
            </div>
          ))}
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
  
  const [treeState, setTreeState] = useState<'expanded' | 'collapsed' | 'custom'>('expanded');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [targetMatchedKey, setTargetMatchedKey] = useState<string | null>(null);

  const topRef = useRef<HTMLDivElement>(null);

  // PAGINATION STATE FOR UNASSIGNED
  const [unassignedPage, setUnassignedPage] = useState(1);
  const itemsPerPage = 24;

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { rootNodes, unassignedNodes, childrenMap, totalCounts } = useMemo(() => {
    const map = new Map<number | string, MemberNode[]>();
    const roots: MemberNode[] = [];
    const unassigned: MemberNode[] = [];

    const uniqueMemberMap = new Map<number | string, MemberNode>();

    membersData.forEach((node) => {
      if (!node.isGroupFolder && !uniqueMemberMap.has(node.memberId)) {
        uniqueMemberMap.set(node.memberId, node);
      }

      if (node.rank === 5) {
        if (!unassigned.some(u => u.memberId === node.memberId)) {
          unassigned.push(node);
        }
      } else if (node.parentId === null) {
        roots.push(node);
      } else {
        const list = map.get(node.parentId) || [];
        list.push(node);
        map.set(node.parentId, list);
      }
    });

    let l1 = 0, l2 = 0, l3 = 0, l4 = 0, l5 = 0;
    uniqueMemberMap.forEach((node) => {
      if (node.primaryRank === 1) l1++;
      if (node.primaryRank === 2) l2++;
      if (node.primaryRank === 3) l3++;
      if (node.primaryRank === 4) l4++;
      if (node.primaryRank === 5) l5++;
    });

    return {
      rootNodes: roots,
      unassignedNodes: unassigned,
      childrenMap: map,
      totalCounts: { total: uniqueMemberMap.size, l1, l2, l3, l4, l5 }
    };
  }, [membersData]);

  // INITIAL AUTO-EXPAND SETUP
  useEffect(() => {
    if (rootNodes.length > 0 && membersData.length > 0) {
      const keys: string[] = membersData.map(m => m.nodeKey);
      setExpandedNodes(new Set(keys));
      setTreeState('expanded');
    }
  }, [rootNodes, membersData]);

  // RESET UNASSIGNED PAGE ON SEARCH INPUT CHANGE
  useEffect(() => {
    setUnassignedPage(1);
  }, [search]);

  // RESET SEARCH HIGHLIGHT WHEN SEARCH IS CLEAR / EMPTY
  useEffect(() => {
    if (!search.trim()) {
      setTargetMatchedKey(null);
    }
  }, [search]);

  const toggleNode = (key: string) => {
    setTreeState('custom'); 
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    const keys: string[] = membersData.map(m => m.nodeKey);
    setExpandedNodes(new Set(keys));
    setTreeState('expanded');
  };

  const collapseAll = () => {
    setExpandedNodes(new Set(rootNodes.map(r => r.nodeKey)));
    setTreeState('collapsed');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    setUnassignedPage(1);

    const matched = membersData.find(m => 
      !m.isGroupFolder && (
        m.name.toLowerCase().includes(search.toLowerCase()) || 
        (m.email && m.email.toLowerCase().includes(search.toLowerCase()))
      )
    );

    if (!matched) return;

    if (matched.primaryRank === 5) {
      setActiveTab('unassigned');
      return;
    }

    setActiveTab('tree');
    setTreeState('custom');
    const toExpand = new Set<string>(expandedNodes);
    
    const visited = new Set<number | string>();
    let currId: number | string | null = matched.memberId;

    while (currId !== null && !visited.has(currId)) {
      visited.add(currId);
      const currNode = membersData.find(m => m.memberId === currId && !m.isDuplicate);
      if (!currNode) break;

      toExpand.add(currNode.nodeKey);
      currId = currNode.parentId;
    }

    toExpand.add(matched.nodeKey);
    setExpandedNodes(toExpand);
    setTargetMatchedKey(matched.nodeKey);

    setTimeout(() => {
      const el = document.getElementById(`node-${matched.nodeKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  const filteredUnassigned = useMemo(() => {
    if (!search.trim()) return unassignedNodes;
    return unassignedNodes.filter(m => 
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [unassignedNodes, search]);

  const paginatedUnassigned = useMemo(() => {
    const start = (unassignedPage - 1) * itemsPerPage;
    return filteredUnassigned.slice(start, start + itemsPerPage);
  }, [filteredUnassigned, unassignedPage]);

  const totalUnassignedPages = useMemo(() => {
    return Math.ceil(filteredUnassigned.length / itemsPerPage) || 1;
  }, [filteredUnassigned.length, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm w-full">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="font-bold text-slate-800 text-lg">Loading Disciple Network...</h3>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-rose-50 rounded-3xl border border-rose-200 text-rose-700 w-full">
        <h3 className="font-bold text-lg">Error loading hierarchy data</h3>
        <button type="button" onClick={() => refetch()} className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">
          Subukan Ulit
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/5 p-3 sm:p-5 md:p-6 font-sans text-slate-800 w-full relative">
      <div ref={topRef} />

      <div className="w-full space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 w-full">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles size={15} /> Church Leadership Architecture
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Organizational Tree Tracker
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('tree')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tree' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <FolderTree size={16} /> Hierarchy Tree ({totalCounts.total - totalCounts.l5})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unassigned')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'unassigned' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <UserX size={16} /> No GrowthGroup ({totalCounts.l5})
            </button>
          </div>
        </div>

        {/* METRICS SUMMARY STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 w-full">
          {/* LEVEL 1: SENIOR PASTOR */}
          <div className="relative group overflow-hidden bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500" />
            <Crown size={72} className="absolute -right-2 -bottom-2 text-amber-600/5 group-hover:text-amber-600/10 group-hover:scale-110 transition-all duration-500 pointer-events-none" />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs">
                Level 1
              </span>
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/60 text-amber-600 border border-amber-200/80 shadow-xs group-hover:scale-110 transition-transform duration-300">
                <Crown size={20} />
              </div>
            </div>

            <div className="relative z-10">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums block">
                {totalCounts.l1}
              </span>
              <span className="text-xs font-bold text-slate-500 mt-0.5 block truncate">
                Senior Pastor
              </span>
            </div>
          </div>

          {/* LEVEL 2: PASTORAL STAFFS */}
          <div className="relative group overflow-hidden bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600" />
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
            <ShieldCheck size={72} className="absolute -right-2 -bottom-2 text-indigo-600/5 group-hover:text-indigo-600/10 group-hover:scale-110 transition-all duration-500 pointer-events-none" />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-2xs">
                Level 2
              </span>
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 text-indigo-600 border border-indigo-200/80 shadow-xs group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="relative z-10">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums block">
                {totalCounts.l2}
              </span>
              <span className="text-xs font-bold text-slate-500 mt-0.5 block truncate">
                Pastoral Staffs
              </span>
            </div>
          </div>

          {/* LEVEL 3: GROWTHGROUP LEADERS */}
          <div className="relative group overflow-hidden bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
            <Award size={72} className="absolute -right-2 -bottom-2 text-blue-600/5 group-hover:text-blue-600/10 group-hover:scale-110 transition-all duration-500 pointer-events-none" />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs">
                Level 3
              </span>
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-600 border border-blue-200/80 shadow-xs group-hover:scale-110 transition-transform duration-300">
                <Award size={20} />
              </div>
            </div>

            <div className="relative z-10">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums block">
                {totalCounts.l3}
              </span>
              <span className="text-xs font-bold text-slate-500 mt-0.5 block truncate">
                GrowthGroup Leaders
              </span>
            </div>
          </div>

          {/* LEVEL 4: GROWTHGROUP MEMBERS */}
          <div className="relative group overflow-hidden bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600" />
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
            <Users size={72} className="absolute -right-2 -bottom-2 text-emerald-600/5 group-hover:text-emerald-600/10 group-hover:scale-110 transition-all duration-500 pointer-events-none" />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                Level 4
              </span>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 text-emerald-600 border border-emerald-200/80 shadow-xs group-hover:scale-110 transition-transform duration-300">
                <Users size={20} />
              </div>
            </div>

            <div className="relative z-10">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums block">
                {totalCounts.l4}
              </span>
              <span className="text-xs font-bold text-slate-500 mt-0.5 block truncate">
                GrowthGroup Members
              </span>
            </div>
          </div>

          {/* LEVEL 5: NO GROWTHGROUP */}
          <div className="relative group overflow-hidden bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 col-span-2 sm:col-span-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600" />
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all duration-500" />
            <UserX size={72} className="absolute -right-2 -bottom-2 text-rose-600/5 group-hover:text-rose-600/10 group-hover:scale-110 transition-all duration-500 pointer-events-none" />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 shadow-2xs">
                Level 5
              </span>
              <div className="p-2 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/60 text-rose-600 border border-rose-200/80 shadow-xs group-hover:scale-110 transition-transform duration-300">
                <UserX size={20} />
              </div>
            </div>

            <div className="relative z-10">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums block">
                {totalCounts.l5}
              </span>
              <span className="text-xs font-bold text-slate-500 mt-0.5 block truncate">
                No GrowthGroup
              </span>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Type name & press Enter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-colors">
              Search
            </button>
          </form>

          {activeTab === 'tree' && (
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={expandAll} 
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  treeState === 'expanded'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Maximize2 size={13} /> Expand Tree
              </button>
              <button 
                type="button" 
                onClick={collapseAll} 
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  treeState === 'collapsed'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Minimize2 size={13} /> Collapse Tree
              </button>
            </div>
          )}
        </div>

        {/* TREE TAB */}
        {activeTab === 'tree' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm overflow-x-auto w-full">
            <div className="min-w-[760px] space-y-4">
              {rootNodes.map((rootNode) => (
                <TreeNode
                  key={rootNode.nodeKey}
                  node={rootNode}
                  allMembers={membersData}
                  childrenMap={childrenMap}
                  searchQuery={search}
                  expandedNodes={expandedNodes}
                  toggleNode={toggleNode}
                  targetMatchedKey={targetMatchedKey}
                />
              ))}
            </div>
          </div>
        )}

        {/* UNASSIGNED TAB */}
        {activeTab === 'unassigned' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 w-full">
            {filteredUnassigned.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium text-sm">
                Walang nahanap na miyembro na walang Growth Group.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {paginatedUnassigned.map((member) => (
                    <div key={member.nodeKey} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/80 transition-colors">
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-900 text-sm truncate">{member.name}</p>
                        <p className="text-xs text-slate-400 truncate">{member.email || 'No email'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION CONTROLS */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-3">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing {((unassignedPage - 1) * itemsPerPage) + 1} to {Math.min(unassignedPage * itemsPerPage, filteredUnassigned.length)} of {filteredUnassigned.length} entries
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUnassignedPage(p => Math.max(p - 1, 1))}
                      disabled={unassignedPage === 1}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      Prev
                    </button>
                    
                    <span className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl">
                      {unassignedPage} / {totalUnassignedPages}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => setUnassignedPage(p => Math.min(p + 1, totalUnassignedPages))}
                      disabled={unassignedPage === totalUnassignedPages}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* SCROLL TO TOP FLOATING BUTTON */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 group border border-indigo-400/30 cursor-pointer"
        title="Scroll to top"
      >
        <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}