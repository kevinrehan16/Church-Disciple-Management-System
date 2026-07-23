import React, { useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  Users, Edit, Key, Sparkles, Heart, Briefcase, 
  GraduationCap, Cross, CheckCircle2,
  Building, BookOpen
} from 'lucide-react';

// ==========================================
// 1. INTERFACES (Nakabase sa JSON response mo)
// ==========================================
export interface MemberData {
  id: number;
  mem_id: string;
  email: string;
  role: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  nickname: string;
  gender: string;
  birthday: string;
  age: number;
  lifestage: string;
  spouse_name: string | null;
  father_name: string | null;
  mother_name: string | null;
  facebook_name: string | null;
  mobile_number: string;
  home_address: string;
  country: string;
  region: string;
  city: string;
  barangay: string;
  occupation: string;
  industry: string;
  college_school: string;
  college_degree: string;
  high_school: string;
  received_jesus: string;
  baptized_immersion: string;
  baptized_date: string;
  picture: string;
  church_name: string;
  member_position: string;
  member_status: string;
  membership_date: string;
  rec_for_baptism: boolean;
  rec_for_membership: boolean;
  spiritual_gifts: Array<{
    id: number;
    name: string;
    code: string;
    category: string;
    description: string;
    scripture_references: string;
  }>;
}

interface ProfilePageProps {
  data?: MemberData;
  isSelf?: boolean;
}

// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================
export default function ProfilePage({ data = defaultMockData, isSelf = true }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'career' | 'security'>('overview');

  return (
    // Fluid Outer Container na hindi masisira sa Zoom In / Zoom Out
    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all">
      
      {/* --- HEADER & BANNER SECTION --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden mb-6">
        {/* Cover Mesh Gradient */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20">
              {data.mem_id}
            </span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-4 sm:px-8 pb-6 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-20 relative z-10">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
              {/* Avatar Box */}
              <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-100 flex-shrink-0">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold uppercase shadow-inner">
                  {data.first_name[0]}{data.last_name[0]}
                </div>
              </div>

              {/* Text Highlights */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {data.full_name}
                  </h1>
                  {data.nickname && (
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      "{data.nickname}"
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                    data.member_status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {data.member_status}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-600 flex flex-wrap items-center gap-2">
                  <span className="text-indigo-600 font-semibold">{data.member_position}</span>
                  <span>•</span>
                  <span>{data.church_name}</span>
                  <span>•</span>
                  <span className="capitalize">{data.role}</span>
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 pt-2 md:pt-0">
              {isSelf ? (
                <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-indigo-200">
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
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Sparkles size={18} />} label="Overview & Spiritual" />
        <TabButton active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} icon={<User size={18} />} label="Personal & Family" />
        <TabButton active={activeTab === 'career'} onClick={() => setActiveTab('career')} icon={<Briefcase size={18} />} label="Education & Work" />
        {isSelf && (
          <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Key size={18} />} label="Account & Security" />
        )}
      </div>

      {/* --- MAIN GRID CONTENT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: TAB DETAILS (Takes 8 cols on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TAB 1: OVERVIEW & SPIRITUAL GIFTS */}
          {activeTab === 'overview' && (
            <>
              {/* Salvation & Baptism Milestone Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Cross size={18} className="text-indigo-600" /> Spiritual Journey & Milestones
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MilestoneBox label="Accepted Jesus" value={data.received_jesus} icon={<Heart className="text-rose-500" size={18} />} />
                  <MilestoneBox label="Water Baptism" value={data.baptized_date} subtext={data.baptized_immersion === "1" ? "By Immersion" : ""} icon={<CheckCircle2 className="text-blue-500" size={18} />} />
                  <MilestoneBox label="Church Membership" value={data.membership_date} icon={<Building className="text-indigo-500" size={18} />} />
                </div>
              </div>

              {/* Spiritual Gifts List */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500" /> Identified Spiritual Gifts
                  </h3>
                  <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                    {data.spiritual_gifts.length} Gifts
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.spiritual_gifts.map((gift) => (
                    <div key={gift.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-900">{gift.name}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                          {gift.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">{gift.description}</p>
                      <div className="text-[11px] font-medium text-indigo-600 flex items-center gap-1">
                        <BookOpen size={12} /> {gift.scripture_references}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: PERSONAL & FAMILY */}
          {activeTab === 'personal' && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-indigo-600" /> Basic Details
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
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-indigo-600" /> Complete Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoData label="Home Address" value={data.home_address} fullWidth />
                  <InfoData label="Barangay" value={data.barangay} />
                  <InfoData label="City / St." value={data.city} />
                  <InfoData label="Region" value={data.region} />
                  <InfoData label="Country" value={data.country} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAREER & EDUCATION */}
          {activeTab === 'career' && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-indigo-600" /> Employment & Industry
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoData label="Occupation" value={data.occupation} />
                  <InfoData label="Industry" value={data.industry} />
                </div>
              </div>
              <hr className="border-slate-100" />
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <GraduationCap size={18} className="text-indigo-600" /> Educational Background
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoData label="College School" value={data.college_school} />
                  <InfoData label="Degree" value={data.college_degree} />
                  <InfoData label="High School" value={data.high_school} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && isSelf && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-1">Account Credentials</h3>
              <p className="text-xs text-slate-500 mb-6">Manage your email and system password security settings.</p>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Email</label>
                  <input type="text" value={data.email} readOnly className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                </div>
                <button className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                  Update Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: QUICK CONTACT & METRICS (Takes 4 cols on Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Contact Details Widget */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Contact Channels</h4>
            <div className="space-y-3">
              <ContactRow icon={<Mail size={16} />} label="Email" value={data.email} />
              <ContactRow icon={<Phone size={16} />} label="Mobile" value={data.mobile_number} />
              <ContactRow icon={<FaFacebook size={16} />} label="Facebook" value={data.facebook_name || 'N/A'} />
            </div>
          </div>

          {/* Recommendation Flags Widget */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">System Standing</h4>
            <div className="space-y-2">
              <StatusFlag label="Recommended for Membership" active={data.rec_for_membership} />
              <StatusFlag label="Recommended for Baptism" active={data.rec_for_baptism} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 3. SUB-COMPONENTS FOR CLEANER CODE
// ==========================================
const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
      active 
        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
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
      {subtext && <p className="text-[11px] font-medium text-indigo-600">{subtext}</p>}
    </div>
  </div>
);

const InfoData = ({ label, value, fullWidth }: any) => (
  <div className={fullWidth ? 'sm:col-span-2' : ''}>
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value || '—'}</p>
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

// ==========================================
// 4. MOCK DATA FALLBACK (Galing sa JSON mo)
// ==========================================
const defaultMockData: MemberData = {
  "email": "seanfuerte@gcfchristian.org",
  "role": "member",
  "id": 15,
  "mem_id": "MEM-1784813553",
  "first_name": "Sean",
  "middle_name": null,
  "last_name": "Fuerte",
  "full_name": "Sean  Fuerte",
  "nickname": "P. Sean",
  "gender": "Male",
  "birthday": "1990-12-12",
  "age": 0,
  "lifestage": "Married",
  "spouse_name": "Hesed Ruth Grace",
  "father_name": null,
  "mother_name": null,
  "facebook_name": "Sean Fuerte",
  "mobile_number": "09186648933",
  "home_address": "Purok Dos, Las Pinas City",
  "country": "Philippines",
  "region": "District II",
  "city": "Blk 1, Lot 2, Gotoden Street",
  "barangay": "Shano",
  "occupation": "Pastor",
  "industry": "Christian",
  "college_school": "College School",
  "college_degree": "College Degree",
  "high_school": "High School",
  "received_jesus": "2002-12-12",
  "baptized_immersion": "1",
  "baptized_date": "2008-12-12",
  "picture": "sean_f.jpg",
  "church_name": "GCF SouthMetro",
  "member_position": "Pastor",
  "member_status": "Active",
  "membership_date": "2008-12-12",
  "rec_for_baptism": false,
  "rec_for_membership": true,
  "spiritual_gifts": [
    {
      "id": 3,
      "name": "Evangelism",
      "code": "GIFT-EVANGELISM",
      "category": "Instructional",
      "description": "The ability to share the Gospel effectively with non-believers, leading them to salvation in Christ.",
      "scripture_references": "Ephesians 4:11"
    },
    {
      "id": 4,
      "name": "Pastoring / Shepherding",
      "code": "GIFT-PASTORING",
      "category": "Instructional",
      "description": "The ability to nurture, guide, protect, and care for the spiritual growth of a group of believers.",
      "scripture_references": "Ephesians 4:11"
    },
    {
      "id": 5,
      "name": "Teaching",
      "code": "GIFT-TEACHING",
      "category": "Instructional",
      "description": "The ability to clarify, explain, and apply biblical truth so that others understand and grow.",
      "scripture_references": "Romans 12:7, 1 Corinthians 12:28, Ephesians 4:11"
    },
    {
      "id": 6,
      "name": "Exhortation",
      "code": "GIFT-EXHORTATION",
      "category": "Instructional",
      "description": "The ability to encourage, counsel, comfort, and motivate others toward spiritual maturity.",
      "scripture_references": "Romans 12:8"
    },
    {
      "id": 9,
      "name": "Leadership",
      "code": "GIFT-LEADERSHIP",
      "category": "Serving",
      "description": "The ability to set vision, direct goals, and motivate others to accomplish God’s work with care and diligence.",
      "scripture_references": "Romans 12:8"
    },
    {
      "id": 16,
      "name": "Faith",
      "code": "GIFT-FAITH",
      "category": "Sign",
      "description": "The ability to trust God with extraordinary confidence for supernatural outcomes and fulfillment of His promises.",
      "scripture_references": "1 Corinthians 12:9"
    }
  ]
};