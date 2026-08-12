import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaFacebook, FaCross, FaUserTag, FaChurch, FaSuitcase, FaUserShield } from 'react-icons/fa';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, Church, 
  Edit, Sparkles, Heart, Briefcase, 
  GraduationCap, Cross, CheckCircle2,
  Building, BookOpen, AlertCircle,
  MapPinned
} from 'lucide-react';
import RegisterMemberModal from '../../components/modals/memberModals/RegisterMemberModal';
import { useMyProfile, useMemberProfile } from '../../hooks/useProfiles';
import type { MemberProfile } from '../../types/typeProfile';
import ChangePassForm from '../../components/ui/ChangePassForm';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingState from '../../components/ui/LoadingState';

// ==========================================
// 1. MAIN SCREEN EXPORT (Router Handler)
// ==========================================
export default function ProfileScreen() {
  const { id } = useParams<{ id: any }>();

  if (id) {
    return <MemberProfileFetcher id={id} />;
  }
  return <MyProfileFetcher />;
}

// ==========================================
// 2. DATA FETCHERS
// ==========================================
function MyProfileFetcher() {
  const { data, isLoading, isError } = useMyProfile();

  if (isLoading) return <LoadingState description='Loading Profile Module...' />;
  if (isError || !data) return <ErrorState message="Hindi makuha ang iyong profile data." />;

  return <ProfileUI data={data} isSelf={true} />;
}

function MemberProfileFetcher({ id }: { id: number }) {
  const { data, isLoading, isError } = useMemberProfile(id);

  if (isLoading) return <LoadingState description='Loading Profile Module...' />;
  if (isError || !data) return <ErrorState message="Hindi nahanap ang profile ng member na ito." />;

  return <ProfileUI data={data} isSelf={false} />;
}

// ==========================================
// 3. UI COMPONENTS (Loading & Error)
// ==========================================
<LoadingState description='Loading Profile Module...' />

const ErrorState = ({ message }: { message: string }) => (
  <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-4">
    <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center max-w-sm w-full">
      <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
      <h3 className="font-bold text-rose-900 mb-1">May Problema</h3>
      <p className="text-xs text-rose-600">{message}</p>
    </div>
  </div>
);

// ==========================================
// 4. MAIN UI COMPONENT (Theme-Based)
// ==========================================
interface ProfileUIProps {
  data: MemberProfile;
  isSelf: boolean;
}

function ProfileUI({ data, isSelf }: ProfileUIProps) {
  useTheme(); // Initialize theme context
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'church' | 'career' | 'security'>('overview');

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleViewProfile = (id: number) => {
    setSelectedMemberId(id);
    setIsRegisterModalOpen(true);
  };

  const activeColorStyle = { color: 'var(--active-parent, rgb(99,102,241))' };
  const activeBgStyle = { backgroundColor: 'var(--active-parent, rgb(99,102,241))' };

  // Helper function to format role: replaces underscores with spaces and capitalizes each word
  const formatRole = (role?: string) => {
    if (!role) return '';
    return role
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all">
      
      {/* --- HEADER & BANNER SECTION --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden mb-6 relative z-0">
        <div className="h-48 sm:h-60 bg-slate-950 relative overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
            style={{ backgroundImage: "url('/web_images/bible.avif')" }}
          />
          <div 
            className="absolute inset-0 pointer-events-none opacity-85" 
            style={{ 
              backgroundImage: 'linear-gradient(to right, color-mix(in srgb, var(--active-parent, rgb(99,102,241)) 85%, #030712), rgba(3, 7, 18, 0.75), color-mix(in srgb, var(--active-parent, rgb(99,102,241)) 85%, #030712))' 
            }}
          />
          <div 
            className="absolute -top-16 left-1/3 w-96 h-96 rounded-full blur-3xl animate-pulse pointer-events-none opacity-20" 
            style={{ animationDuration: '6s' }} 
          />
          <div className="absolute -bottom-16 right-1/4 w-80 h-80 bg-[var(--active-parent,rgb(99,102,241))]-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />

          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-black text-8xl sm:text-9xl tracking-[0.25em] text-white/[0.05] uppercase">
                JESUS
              </span>
            </div>
            <div className="absolute -right-12 sm:-right-20 -top-32 sm:-top-44 transform rotate-[42deg] opacity-[0.08] text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18rem] h-[28rem] sm:w-[26rem] sm:h-[40rem]">
                <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
              </svg>
            </div>
          </div>

          <div className="w-full flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-widest uppercase bg-white/10 text-amber-200 backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Discipleship
            </span>
            <span className="px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-widest uppercase bg-white/10 text-amber-200 backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Disciplemaking
            </span>
          </div>

          <div className="w-full text-center z-10 pb-1 sm:pb-2">
            <p className="text-[9px] sm:text-[11px] font-bold tracking-[0.22em] sm:tracking-[0.3em] text-amber-100/90 uppercase drop-shadow-md">
              KNOW <span className="text-amber-400 font-extrabold mx-1.5">•</span> LOVE <span className="text-amber-400 font-extrabold mx-1.5">•</span> ABIDE <span className="text-amber-400 font-extrabold mx-1.5">•</span> SERVE <span className="text-amber-400 font-extrabold mx-1.5">•</span> PROCLAIM
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-8 pb-6 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-20 relative z-10">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
              <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-100 flex-shrink-0">
                <div 
                  className="h-full w-full rounded-xl flex items-center justify-center text-white shadow-inner relative overflow-hidden"
                  style={activeBgStyle}
                >
                  <span className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
                    {data.first_name?.[0]}{data.last_name?.[0]}
                  </span>
                  
                  <div className="absolute bottom-2 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-black/40 text-[9px] sm:text-[10px] font-bold tracking-wider text-amber-200 backdrop-blur-sm border border-white/15 shadow-sm">
                      {data.mem_id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {data.full_name}
                  </h1>
                  {data.nickname && (
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-sm font-mono">
                      ({data.nickname})
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                    data.member_status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${data.member_status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {data.member_status}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-600 flex flex-wrap items-center gap-2">
                  <span>{formatRole(data.role)}</span>
                  <span className="text-amber-500 font-bold">•</span>
                  <span className="font-semibold" style={activeColorStyle}>{data.member_position}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0">
              {isSelf ? (
                <button 
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:opacity-90 active:scale-[0.98]"
                  style={activeBgStyle}
                  onClick={() => handleViewProfile(data.id)}
                >
                  <Edit size={16} /> Edit Profile
                </button>
              ) : (
                <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm">
                  <ShieldCheck size={16} /> Assign Role
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex items-center gap-1 sm:gap-2 mb-6 border-b border-slate-200/80 overflow-x-auto no-scrollbar">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FaCross size={18} />} label="Overview & Spiritual" />
        <TabButton active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} icon={<FaUserTag size={18} />} label="Personal & Family" />
        <TabButton active={activeTab === 'church'} onClick={() => setActiveTab('church')} icon={<FaChurch size={18} />} label="Church Information" />
        <TabButton active={activeTab === 'career'} onClick={() => setActiveTab('career')} icon={<FaSuitcase size={18} />} label="Education & Work" />
        {isSelf && (
          <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<FaUserShield size={18} />} label="Account & Security" />
        )}
      </div>

      {/* --- MAIN GRID CONTENT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeTab === 'overview' && (
            <>
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <TitleIcon icon={<Cross size={16} style={activeColorStyle} />} /> Spiritual Journey & Milestones
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MilestoneBox label="Accepted Jesus" value={data.received_jesus} icon={<Heart className="text-rose-500" size={18} />} />
                  <MilestoneBox label="Water Baptism" value={data.baptized_date} subtext={String(data.baptized_immersion) === "1" || data.baptized_immersion === true ? "By Immersion" : ""} icon={<CheckCircle2 className="text-blue-500" size={18} />} />
                  <MilestoneBox label="Church Membership" value={data.membership_date} icon={<Building size={18} style={activeColorStyle} />} />
                </div>
              </div>

              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-3">
                    <TitleIcon icon={<Sparkles size={16} style={activeColorStyle} />} /> Identified Spiritual Gifts
                  </h3>
                  <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                    {data.spiritual_gifts?.length || 0} Gifts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.spiritual_gifts?.map((gift) => (
                    <div key={gift.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-900">{gift.name}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                          {gift.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">{gift.description}</p>
                      <div className="text-[11px] font-medium flex items-center gap-1" style={activeColorStyle}>
                        <BookOpen size={12} /> {gift.scripture_references}
                      </div>
                    </div>
                  ))}
                  {(!data.spiritual_gifts || data.spiritual_gifts.length === 0) && (
                    <p className="text-xs text-slate-500 col-span-full">Wala pang nakatala na Spiritual Gifts.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'personal' && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <TitleIcon icon={<User size={16} style={activeColorStyle} />} /> Basic Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoData label="Gender" value={data.gender} />
                  <InfoData label="Birthday" value={data.birthday} />
                  <InfoData label="Lifestage" value={data.lifestage} />
                  <InfoData label="Spouse Name" value={data.spouse_name} />
                </div>
              </div>
              <hr className="border-slate-100" />
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <TitleIcon icon={<MapPin size={16} style={activeColorStyle} />} /> Complete Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoData label="Home Address" value={data.home_address} fullWidth />
                  <InfoData label="Barangay" value={data.barangay} />
                  <InfoData label="City" value={data.city} />
                  <InfoData label="Region" value={data.region} />
                  <InfoData label="Country" value={data.country} />
                </div>
              </div>
            </div>
          )}

          {/* --- CHURCH INFORMATION TAB --- */}
          {activeTab === 'church' && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <TitleIcon icon={<Church size={16} style={activeColorStyle} />} /> Church Details & Assignment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoData label="Church Name" value={data.church_name || "GCF South Metro"} />
                  <InfoData label="Church Code" value={data.church_code || "GCFSM"} />
                  <InfoData label="Church Contact Number" value={data.church_contact_number || "09171234567"} />
                  <InfoData label="Church Email" value={data.church_email || "gcfsouthmetro@gcfchristian.org"} />
                  <InfoData label="Church Address" value={data.church_address || "Daang-hari, Las Pinas City"} fullWidth />
                </div>
              </div>

              <hr className="border-slate-100" />

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <TitleIcon icon={<MapPinned size={16} style={activeColorStyle} />} /> Cluster Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InfoData label="Cluster Name" value={data.cluster_name || "Muntinlupa-Laguna"} />
                  <InfoData label="Cluster Code" value={data.cluster_code || "MUN-LAG"} />
                  <InfoData label="Cluster Mentor" value={data.cluster_leader_name || "Unassigned"} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'career' && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <TitleIcon icon={<Briefcase size={16} style={activeColorStyle} />} /> Employment & Industry
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoData label="Occupation" value={data.occupation} />
                  <InfoData label="Industry" value={data.industry} />
                </div>
              </div>
              <hr className="border-slate-100" />
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <TitleIcon icon={<GraduationCap size={16} style={activeColorStyle} />} /> Educational Background
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoData label="College School" value={data.college_school} />
                  <InfoData label="Degree" value={data.college_degree} />
                  <InfoData label="High School" value={data.high_school} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && isSelf && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-1">Account Credentials</h3>
              <p className="text-xs text-slate-500 mb-6">Manage your email and system password security settings.</p>
              
              <div className="space-y-4 max-w-sm">
                <ChangePassForm emailProp={data.email} />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Contact Channels</h4>
            <div className="space-y-3">
              <ContactRow icon={<Mail size={16} className='text-rose-700' />} label="Email" value={data.email} />
              <ContactRow icon={<Phone size={16} className='text-emerald-500' />} label="Mobile" value={data.mobile_number} />
              <ContactRow icon={<FaFacebook size={16} className='text-blue-600' />} label="Facebook" value={data.facebook_name || 'N/A'} />
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">System Standing</h4>
            <div className="space-y-2">
              <StatusFlag label="Recommended for Membership" active={data.rec_for_membership} />
              <StatusFlag label="Recommended for Baptism" active={data.rec_for_baptism} />
            </div>
          </div>
        </div>

      </div>

      {isRegisterModalOpen && (
        <RegisterMemberModal 
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)} 
          memberId={selectedMemberId != null ? String(selectedMemberId) : null}
        />
      )}
    </div>
  );
}

// ==========================================
// 5. SUB-COMPONENTS
// ==========================================
const TitleIcon = ({ icon }: { icon: React.ReactNode }) => (
  <div 
    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0"
    style={{ backgroundColor: 'var(--active-parent-light, rgba(99, 102, 241, 0.1))' }}
  >
    {icon}
  </div>
);

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    style={active ? { backgroundColor: 'var(--active-parent-light, rgba(99, 102, 241, 0.1))', color: 'var(--active-parent, rgb(99,102,241))' } : {}}
    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
      active 
        ? 'shadow-sm' 
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
    }`}
  >
    {icon} {label}
  </button>
);

const MilestoneBox = ({ label, value, subtext, icon }: any) => (
  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value || 'N/A'}</p>
      {subtext && <p className="text-[11px] font-medium" style={{ color: 'var(--active-parent, rgb(99,102,241))' }}>{subtext}</p>}
    </div>
  </div>
);

const InfoData = ({ label, value, fullWidth }: any) => (
  <div className={fullWidth ? 'sm:col-span-2' : ''}>
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value || '---'}</p>
  </div>
);

const ContactRow = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-3 text-slate-600 text-xs">
    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">{icon}</div>
    <div className="overflow-hidden">
      <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
      <p className="font-semibold text-slate-800 truncate">{value}</p>
    </div>
  </div>
);

const StatusFlag = ({ label, active }: any) => (
  <div className="flex items-center justify-between text-xs py-1">
    <span className="text-slate-300 font-medium">{label}</span>
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
      active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
    }`}>
      {active ? 'YES' : 'NO'}
    </span>
  </div>
);