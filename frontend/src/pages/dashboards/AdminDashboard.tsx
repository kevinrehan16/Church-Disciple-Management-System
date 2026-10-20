import { 
  Users, Calendar, ArrowUpRight, ArrowDownRight, 
  Clock, CheckCircle2, FileText, Wallet, UserCheck, LayoutDashboard, 
  BookOpen, Heart, Church, HandHeart, Users2, Target, Megaphone
} from 'lucide-react';
import ModuleHeader from '../../components/ui/ModuleHeader';

export default function AdminDashboard() {
  // =========================================================================
  // MASTER HARDCODED CHURCH DATA (CDMS COMMAND CENTER)
  // =========================================================================
  
  // 1. Primary High-Level KPIs
  const mainKpis = [
    { title: "Weekly Tithes & Offerings", value: "₱ 245,500", trend: "+12.5%", isUp: true, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Total Active Disciples", value: "1,248", trend: "+4.2%", isUp: true, icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
    { title: "Sanctuary Capacity Load", value: "85%", trend: "-2.1%", isUp: false, icon: Church, color: "text-rose-600", bg: "bg-rose-100" },
    { title: "Active Life Groups", value: "84", trend: "+8.4%", isUp: true, icon: Users2, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  // 2. Secondary Health Metrics (Dark Operations Ribbon)
  const secondaryKpis = [
    { title: "First-Time Guests", value: "42 pax", status: "Follow-up", icon: Heart },
    { title: "Outreach Events", value: "3 / 4", status: "Deployed", icon: Megaphone },
    { title: "Volunteer Roster", value: "342", status: "94% Attendance", icon: UserCheck },
    { title: "Pending Baptisms", value: "18", status: "Processing", icon: CheckCircle2 },
  ];

  // 3. Financial Trajectory (7-Day Yield - Tithes & Daily Giving)
  const weeklyRevenue = [
    { day: "Mon", value: 15 }, { day: "Tue", value: 20 }, { day: "Wed", value: 45 }, 
    { day: "Thu", value: 30 }, { day: "Fri", value: 55 }, { day: "Sat", value: 40 }, { day: "Sun", value: 180 }
  ];

  // 4. Sunday Service Inflow (Time-Series Activity Bars)
  const hourlyFlow = [
    { time: "08:00 AM", count: 345, load: "high", pct: 75 },
    { time: "10:30 AM", count: 480, load: "peak", pct: 95 },
    { time: "01:00 PM", count: 210, load: "normal", pct: 45 },
    { time: "03:30 PM", count: 410, load: "peak", pct: 88 },
    { time: "06:00 PM", count: 180, load: "low", pct: 30 },
  ];

  // 5. Fund Designations (Ranked Bars)
  const labRevenue = [
    { service: "General Tithes", revenue: "₱ 145,000", pct: 90, color: "bg-indigo-600" },
    { service: "Building Fund", revenue: "₱ 42,400", pct: 72, color: "bg-blue-500" },
    { service: "Local Missions", revenue: "₱ 28,100", pct: 55, color: "bg-cyan-500" },
    { service: "Compassion / Care", revenue: "₱ 19,500", pct: 45, color: "bg-emerald-500" },
    { service: "Youth Ministry", revenue: "₱ 10,500", pct: 25, color: "bg-amber-500" },
  ];

  // 6. Ministry Volunteer Workload
  const departments = [
    { name: "Kids Ministry", load: 92, color: "bg-rose-500" },
    { name: "Worship & Arts", load: 75, color: "bg-indigo-500" },
    { name: "Ushers & Greeters", load: 88, color: "bg-amber-500" },
    { name: "Media & Tech", load: 45, color: "bg-emerald-500" },
    { name: "Prayer Team", load: 60, color: "bg-pink-500" },
  ];

  // 7. Network / Demographic Breakdown
  const bedBreakdown = [
    { type: "Couples / Families", occupied: 450, total: 500, color: "bg-indigo-500" },
    { type: "Young Professionals", occupied: 380, total: 400, color: "bg-emerald-500" },
    { type: "Campus / Youth", occupied: 290, total: 350, color: "bg-amber-500" },
    { type: "Kids", occupied: 128, total: 150, color: "bg-rose-500" },
  ];

  // 8. Discipleship Journey Status
  const bloodBank = [
    { type: "One 2 One", level: 85, status: "Active" },
    { type: "Victory Wkd", level: 12, status: "Low Reg" },
    { type: "Making Disciples", level: 64, status: "Active" },
    { type: "Church Com", level: 28, status: "Pending" },
    { type: "Leadership 1", level: 75, status: "Active" },
    { type: "Leadership 2", level: 40, status: "Normal" },
  ];

  // 9. Resource & Materials Distribution
  const pharmacyVelocity = [
    { item: "One 2 One Booklets", dispensed: "142 units", speed: "High Demand", color: "text-rose-600", border: "border-rose-100", bg: "bg-rose-50/50" },
    { item: "Welcome Packets", dispensed: "89 units", speed: "Steady Flow", color: "text-amber-600", border: "border-amber-100", bg: "bg-amber-50/50" },
    { item: "Communion Elements", dispensed: "1,200 units", speed: "Sunday Prep", color: "text-emerald-600", border: "border-emerald-100", bg: "bg-emerald-50/50" },
  ];

  // 10. Building Fund / Pledge Commitments
  const hmoClaims = [
    { provider: "Couples Network", pending: 45, amount: "₱ 1,240,000", status: "On Track" },
    { provider: "Business Owners", pending: 12, amount: "₱ 3,450,500", status: "Delayed" },
    { provider: "Young Pros", pending: 82, amount: "₱ 850,000", status: "Cleared" },
    { provider: "Youth Network", pending: 15, amount: "₱ 42,000", status: "Processing" },
  ];

  // 11. First-Time Guest Registry (Live Follow-up)
  const recentMembers = [
    { id: "GT-001", name: "Carmela Dizon", type: "Young Pro", status: "Assigned", time: "10:24 AM", doctor: "Ptr. Reyes" },
    { id: "GT-002", name: "Joshua Garcia", type: "Campus", status: "Unassigned", time: "09:45 AM", doctor: "Pending" },
    { id: "GT-003", name: "Elena Cruz", type: "Couples", status: "Contacted", time: "09:12 AM", doctor: "Ptr. Mendoza" },
    { id: "GT-004", name: "Miguel Torres", type: "Youth", status: "In Group", time: "08:30 AM", doctor: "Ldr. Lim" },
    { id: "GT-005", name: "Sarah Geronimo", type: "Young Pro", status: "Assigned", time: "07:15 AM", doctor: "Ptr. Villanueva" },
  ];

  // 12. Real-time Ministry Logs
  const systemAlerts = [
    { type: "resources", title: "Low Booklet Stock", desc: "One 2 One booklets are below 15% threshold.", time: "10 mins ago", icon: BookOpen, bg: "bg-rose-50/50", border: "border-rose-100", text: "text-rose-600" },
    { type: "kids", title: "Kids Ministry Congestion", desc: "Toddler room has exceeded standard capacity (45 kids).", time: "1 hour ago", icon: Clock, bg: "bg-amber-50/50", border: "border-amber-100", text: "text-amber-600" },
    { type: "finance", title: "Online Giving Synced", desc: "Batch 2026-A transfers cleared (₱ 125K).", time: "2 hours ago", icon: Wallet, bg: "bg-emerald-50/50", border: "border-emerald-100", text: "text-emerald-600" },
    { type: "facility", title: "Hall A Aircon Maintenance", desc: "HVAC maintenance has been completed successfully.", time: "4 hours ago", icon: Church, bg: "bg-slate-50", border: "border-slate-100", text: "text-slate-600" },
  ];

  return (
    <div className="px-6 py-4 space-y-6 bg-slate-50/60 min-h-screen animate-in fade-in duration-500">
      
      {/* =========================================================================
          HEADER & COMMAND PANEL CONTROLS
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <ModuleHeader
          title="Church Enterprise Command Center"
          description="Unified Admin Portal • Live Ministry & Financial Telemetry"
          icon={<LayoutDashboard size={24} className="text-[var(--active-parent)]" />}
          actions={
            <div className="flex gap-2.5">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 uppercase tracking-wide">
                <FileText size={16} /> Audit Logs
              </button>
              <button className="px-5 py-2 bg-[var(--active-parent)] text-white rounded-xl text-xs font-bold shadow-lg shadow-[var(--active-parent)]/20 hover:opacity-90 transition-all flex items-center gap-2 uppercase tracking-wide">
                <Calendar size={16} /> Weekly Agenda
              </button>
            </div>
          }
        />
      </div>

      {/* =========================================================================
          SECTION 1: CORE PRIMARY METRICS
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mainKpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--active-parent)] opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">{kpi.title}</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">{kpi.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-bold">
              <span className={`flex items-center gap-0.5 ${kpi.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {kpi.trend}
              </span>
              <span className="text-slate-400">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          SECTION 2: SECONDARY OPERATIONS RIBBON (Dark Mode Contrast)
         ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryKpis.map((kpi, idx) => (
          <div key={idx} className="bg-slate-800 rounded-2xl p-4 flex items-center gap-4 text-white shadow-lg shadow-slate-800/5 hover:bg-slate-700 transition-colors cursor-default">
            <div className="p-2.5 bg-white/10 rounded-xl text-white/80">
              <kpi.icon size={17} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{kpi.title}</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-base font-bold">{kpi.value}</span>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wide">{kpi.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          SECTION 3: ANALYTICS COMPLEX (Financial Progress & Member Inflow)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART A: 7-Day Financial Growth (Vertical CSS Bars) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Giving Trajectory</h3>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Daily Giving Stream</p>
            </div>
            <button className="text-xs font-bold text-[var(--active-parent)] hover:underline">Download Report</button>
          </div>
          
          <div className="flex-grow flex items-end gap-4 h-52 mt-4">
            {weeklyRevenue.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2.5 group">
                <div className="w-full relative flex justify-center items-end h-full bg-slate-50 rounded-t-xl overflow-hidden">
                  <div 
                    className="w-full bg-[var(--active-parent)] rounded-t-xl transition-all duration-700 ease-out opacity-85 group-hover:opacity-100"
                    style={{ height: `${(day.value / 180) * 100}%` }} // Dynamic calculation based on max value (180 for Sunday)
                  ></div>
                  <div className="absolute top-2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[9px] font-bold py-1 px-1.5 rounded-md transition-opacity pointer-events-none shadow-xl">
                    ₱{day.value}k
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART B: Sunday Service Inflow Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Capacity & Load Density</h3>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">Sunday Service Attendance</p>
          </div>
          
          <div className="space-y-4 flex-grow justify-center flex flex-col">
            {hourlyFlow.map((flow, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-400" /> {flow.time}
                  </span>
                  <span className="text-slate-800 font-extrabold">{flow.count} <span className="text-slate-400 text-[10px] font-medium">pax</span></span>
                </div>
                <div className="w-full h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      flow.load === 'peak' ? 'bg-rose-500' : flow.load === 'high' ? 'bg-amber-500' : 'bg-indigo-500'
                    }`} 
                    style={{ width: `${flow.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 4: OPERATIONAL MAPS (Fund Revenue, Department Loads, Bed Matrix)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CHART C: Funds & Designations (Ranked Horizontal Bars) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Giving Distribution</h3>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">Fund Designations</p>
          </div>
          <div className="space-y-4 flex-grow justify-center flex flex-col">
            {labRevenue.map((fund, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="text-slate-600 font-semibold text-[11px]">{fund.service}</span>
                  <span className="text-slate-900 font-black">{fund.revenue}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                  <div className={`h-full rounded-lg transition-all duration-1000 ${fund.color}`} style={{ width: `${fund.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART D: Ministry Volunteer Load Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Manpower Density</h3>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">Ministry Volunteer Load</p>
          </div>
          <div className="space-y-4 flex-grow justify-center flex flex-col">
            {departments.map((dept, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 text-[11px] font-semibold">{dept.name}</span>
                  <span className={dept.load > 85 ? 'text-rose-600 font-extrabold' : 'text-slate-500'}>{dept.load}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${dept.color}`} style={{ width: `${dept.load}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART E: Network Demographics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:col-span-2 lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Attendance Spread</h3>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">Network Demographics</p>
          </div>
          <div className="space-y-3.5 flex-grow justify-center flex flex-col">
            {bedBreakdown.map((net, idx) => {
              const occupancyRate = Math.round((net.occupied / net.total) * 100);
              return (
                <div key={idx} className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-slate-700 font-bold text-[11px]">{net.type}</span>
                    <span className="text-slate-500 text-[10px] font-medium">{net.occupied} pax</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${net.color}`} style={{ width: `${occupancyRate}%` }}></div>
                    </div>
                    <span className={`text-[10px] font-black w-8 text-right ${occupancyRate > 85 ? 'text-indigo-600' : 'text-slate-600'}`}>
                      {occupancyRate}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 5: LOGISTICS & RESOURCES (Discipleship & Resource Supply)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MODYUL: Discipleship Journey Track */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Growth Track</h3>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Discipleship Journey</p>
            </div>
            <Target size={18} className="text-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {bloodBank.map((track, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-sm font-black text-slate-700">{track.type}</span>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">{track.level}%</div>
                  <div className={`text-[9px] font-black uppercase tracking-wider ${track.level < 20 ? 'text-rose-600' : track.level < 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {track.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODYUL: Resource & Operations Supply */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Operations Logistics</h3>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Church Resource Inventory</p>
            </div>
            <HandHeart size={18} className="text-rose-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow justify-center">
            {pharmacyVelocity.map((resource, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${resource.border} ${resource.bg} flex flex-col justify-between`}>
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${resource.color}`}>
                    {resource.speed}
                  </span>
                  <h4 className="text-xs font-black text-slate-800 mt-1">{resource.item}</h4>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-3">Distributed this week: <br /><span className="font-bold text-slate-700 text-xs">{resource.dispensed}</span></p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 6: REGISTRY & FINANCE (First-time Guests & Pledges)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TABLE: First Time Guest Tracking */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Connection Flow</h3>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Recent First-Time Guests</p>
            </div>
            <button className="text-xs font-bold text-[var(--active-parent)] hover:underline">View All Guests</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[9px] uppercase tracking-widest font-black border-b border-slate-100">
                  <th className="px-6 py-4">Guest Profile</th>
                  <th className="px-6 py-4">Network / Demo</th>
                  <th className="px-6 py-4">Connection Status</th>
                  <th className="px-6 py-4">Follow-up Leader</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold">
                {recentMembers.map((guest, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-slate-700">
                      <div className="font-extrabold">{guest.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">{guest.id} • {guest.time}</div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 text-[11px] font-semibold">
                      {guest.type}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider
                        ${guest.status === 'Unassigned' ? 'bg-rose-100 text-rose-700' : 
                          guest.status === 'Assigned' ? 'bg-indigo-100 text-indigo-700' :
                          guest.status === 'Contacted' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        {guest.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 text-[11px] font-semibold">{guest.doctor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE: Building Fund / Pledges */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Financial Escrows</h3>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Building Fund Pledges</p>
            </div>
            <button className="text-xs font-bold text-[var(--active-parent)] hover:underline">Reconcile</button>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[9px] uppercase tracking-widest font-black border-b border-slate-100">
                  <th className="px-5 py-4">Network</th>
                  <th className="px-5 py-4">Pledges</th>
                  <th className="px-5 py-4">Total Value</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold">
                {hmoClaims.map((claim, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-800 font-extrabold">
                      <div>{claim.provider}</div>
                      <span className={`text-[8px] font-black uppercase tracking-wider block mt-0.5 ${claim.status === 'Delayed' ? 'text-rose-500' : 'text-slate-400'}`}>{claim.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-semibold">{claim.pending}</td>
                    <td className="px-5 py-3.5 text-slate-800 font-black">{claim.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 7: CRITICAL MONITORING (Comprehensive Real-Time System Infrastructure Logs)
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Ministry Governance</h3>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">Real-Time Operational Alerts</p>
          </div>
          <button className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
            Acknowledge All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemAlerts.map((alert, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border ${alert.border} ${alert.bg} flex flex-col justify-between group cursor-pointer hover:shadow-sm transition-all`}>
              <div className="flex gap-3 items-start">
                <div className={`p-2.5 rounded-xl bg-white border border-slate-100 ${alert.text} flex-shrink-0 shadow-sm`}>
                  <alert.icon size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 leading-tight group-hover:text-[var(--active-parent)] transition-colors">{alert.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 leading-normal">{alert.desc}</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-400 mt-4 block uppercase tracking-wider">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}