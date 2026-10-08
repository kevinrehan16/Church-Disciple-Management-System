import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserPlus, FaEye, FaLayerGroup } from "react-icons/fa";
import { FaMapMarkedAlt } from 'react-icons/fa';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';

// Helper function para sa 2-letter initials ng members
const getInitials = (firstName: string, lastName: string) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase();
};

// Kulay generator para sa avatars
const avatarColors = [
    'bg-sky-500', 'bg-indigo-500', 'bg-emerald-500', 
    'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-teal-500'
];

const getColor = (name: any) => {
    let hash = 0;
    const strName = name || '';
    for (let i = 0; i < strName.length; i++) {
        hash = strName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
};

export default function ClusterGroupMembers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mock data base sa iyong backend structure para sa Cluster
  const currentClusters = [
    {
      id: 1,
      name: 'North Central Cluster',
      code: 'NC-01',
      is_active: true,
      number_of_members: 12,
      number_of_growth_groups: 3,
      members: [
        { member_id: 101, full_name: 'Juan Dela Cruz' },
        { member_id: 102, full_name: 'Maria Santos' },
        { member_id: 103, full_name: 'Roberto Tan' }
      ],
      growth_groups: [
        { id: 201, name: 'Youth Core GG' },
        { id: 202, name: 'Men of Valor' }
      ]
    },
    {
      id: 2,
      name: 'South Metro Cluster',
      code: 'SM-02',
      is_active: true,
      number_of_members: 8,
      number_of_growth_groups: 2,
      members: [
        { member_id: 104, full_name: 'Pedro Penduko' },
        { member_id: 105, full_name: 'Ana Reyes' }
      ],
      growth_groups: [
        { id: 203, name: 'Couples for Christ' }
      ]
    },
    {
      id: 3,
      name: 'Eastern District Cluster',
      code: 'ED-03',
      is_active: false,
      number_of_members: 4,
      number_of_growth_groups: 1,
      members: [],
      growth_groups: []
    }
  ];

  // Filtering logic
  const filteredClusters = currentClusters.filter((cluster) => {
    const matchesSearch = 
        (cluster.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cluster.code || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' 
      ? true 
      : selectedStatus === 'active' ? cluster.is_active : !cluster.is_active;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredClusters.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClusters = filteredClusters.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, filteredClusters.length);

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-slate-50 text-slate-800">
      
      {/* -- FIXED HEADER AREA -- */}
      <div className="px-6 py-4 space-y-4 shrink-0">
        <ModuleHeader
          title="Cluster Group Members"
          description="Monitor and organize cluster units, their members and growth groups effectively."
          icon={<FaMapMarkedAlt size={24} />}
        />

        <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
          <SearchInput 
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search cluster name or code..."
          />
          
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[var(--active-parent,rgb(99,102,241))] cursor-pointer shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* -- SCROLLABLE CARD AREA -- */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
          {paginatedClusters.map((cluster) => {
            const maxVisible = 5;
            const members = cluster.members || [];
            const visibleMembers = members.slice(0, maxVisible);
            const hiddenCount = members.length - maxVisible;

            return (
              <div 
                key={cluster.id} 
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[var(--active-parent,rgb(99,102,241))]/70 transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Accent Bar na nagbabago base sa theme color */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--active-parent,rgb(99,102,241))] opacity-80" />

                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3 pt-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[var(--active-parent,rgb(99,102,241))]/10 text-[var(--active-parent,rgb(99,102,241))] flex items-center justify-center font-bold text-xs border border-[var(--active-parent,rgb(99,102,241))]/30 shadow-inner group-hover:bg-[var(--active-parent,rgb(99,102,241))] group-hover:text-white group-hover:scale-105 transition-all duration-300">
                        <FaMapMarkedAlt size={18} />
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {cluster.code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
                          {cluster.name}
                        </h3>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${cluster.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-500'}`}>
                      {cluster.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Summary Info Cards (Counts) */}
                  <div className="grid grid-cols-2 gap-2.5 my-4">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-center gap-2.5">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FaUsers size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Members</p>
                        <p className="text-sm font-bold text-slate-800">{cluster.number_of_members}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-center gap-2.5">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <FaLayerGroup size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Growth Groups</p>
                        <p className="text-sm font-bold text-slate-800">{cluster.number_of_growth_groups}</p>
                      </div>
                    </div>
                  </div>

                  {/* Growth Groups List Preview */}
                  <div className="mb-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Growth Groups</span>
                    <div className="flex flex-wrap gap-1">
                      {cluster.growth_groups && cluster.growth_groups.length > 0 ? (
                        cluster.growth_groups.map((gg: any) => (
                          <span key={gg.id} className="text-[11px] bg-purple-50 text-purple-700 font-medium px-2 py-0.5 rounded-md border border-purple-100">
                            {gg.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs italic text-slate-400">No growth groups found</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Members Section na may Avatars at Action Buttons */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cluster Members Preview</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex -space-x-2 overflow-visible py-1">
                        {visibleMembers.map((member: any, idx: number) => {
                          const cleanName = (member.full_name || '').replace(',', '');

                          return (
                            <Link
                              key={member.member_id || idx}
                              to={`/member/${member.member_id}`}
                              className={`relative group/avatar inline-flex h-7 w-7 rounded-full ring-2 ring-white items-center justify-center text-[10px] font-bold text-white transition-transform duration-200 hover:-translate-y-1 hover:scale-110 hover:z-30 cursor-pointer shadow-sm ${getColor(cleanName)}`}
                            >
                              <span className="leading-none">
                                {getInitials(cleanName.split(' ')[0], cleanName.split(' ').slice(1).join(' '))}
                              </span>
                              
                              {/* Tooltip on Hover */}
                              <div className="absolute bottom-full mb-1.5 hidden group-hover/avatar:flex flex-col z-40 pointer-events-none left-1/2 -translate-x-1/2 items-center">
                                <span className="bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                                  {cleanName}
                                </span>
                                <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {hiddenCount > 0 && (
                        <div className="ml-1 flex items-center justify-center h-7 px-2 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 shadow-sm">
                          +{hiddenCount}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons para i-view o mag-add */}
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => alert(`Add member to cluster ID: ${cluster.id}`)}
                        className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-[var(--active-parent,rgb(99,102,241))] hover:text-white transition-all duration-200 cursor-pointer shadow-2xs"
                        title="Add Member to Cluster"
                      >
                        <FaUserPlus size={13} />
                      </button>
                      <button 
                        onClick={() => alert(`View details for cluster ID: ${cluster.id}`)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer shadow-2xs"
                        title="View Cluster Profile & Members"
                      >
                        <FaEye size={13} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
      
      {/* -- PAGINATION FOOTER -- */}
      <div className="shrink-0 w-full m-0 px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between rounded-none shadow-sm">
        <p className="text-xs text-slate-500 font-medium">
          Showing <span className="text-slate-800 font-bold">{filteredClusters.length > 0 ? startIndex + 1 : 0}</span> to <span className="text-slate-800 font-bold">{endIndex}</span> of <span className="text-slate-800 font-bold">{filteredClusters.length}</span> entries
        </p>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1} 
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Prev
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page} 
              onClick={() => setCurrentPage(page)} 
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm ${currentPage === page ? 'bg-[var(--active-parent,rgb(99,102,241))] text-white shadow-sky-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages || totalPages === 0} 
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}