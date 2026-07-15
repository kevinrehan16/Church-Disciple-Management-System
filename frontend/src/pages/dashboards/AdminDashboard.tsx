import React from 'react';
import { 
  Users, Activity, DollarSign, Bed, Calendar, ArrowUpRight, ArrowDownRight, 
  AlertCircle, Clock, CheckCircle2, Hospital, Stethoscope, Syringe,
  FileText, Droplet, Truck, ShieldCheck, Wallet, UserCheck, Pill, MoreVertical, LayoutDashboard 
} from 'lucide-react';
import ModuleHeader from '../../components/ui/ModuleHeader';

export default function AdminDashboard() {
  // =========================================================================
  // MASTER HARDCODED ENTERPRISE DATA (LAHAT NG MODYUL PINAGSAMA NA)
  // =========================================================================
  
  // 1. Primary High-Level KPIs
  const mainKpis = [
    { title: "Total Revenue (Today)", value: "₱ 245,500", trend: "+12.5%", isUp: true, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Total Patients Managed", value: "1,248", trend: "+4.2%", isUp: true, icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
    { title: "Overall Bed Occupancy", value: "85%", trend: "-2.1%", isUp: false, icon: Bed, color: "text-rose-600", bg: "bg-rose-100" },
    { title: "Active Surgeries Today", value: "24", trend: "+8.4%", isUp: true, icon: Activity, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  // 2. Secondary Health Metrics (Dark Operations Ribbon)
  const secondaryKpis = [
    { title: "Avg ER Wait Time", value: "24 mins", status: "Optimal", icon: Clock },
    { title: "Active Ambulances", value: "6 / 8", status: "Deployed", icon: Truck },
    { title: "Staff on Duty", value: "342", status: "94% Attendance", icon: UserCheck },
    { title: "Pending Discharges", value: "18", status: "Processing", icon: CheckCircle2 },
  ];

  // 3. Financial Trajectory (7-Day Yield)
  const weeklyRevenue = [
    { day: "Mon", value: 40 }, { day: "Tue", value: 65 }, { day: "Wed", value: 45 }, 
    { day: "Thu", value: 80 }, { day: "Fri", value: 55 }, { day: "Sat", value: 95 }, { day: "Sun", value: 70 }
  ];

  // 4. Hourly Patient Inflow (Time-Series Activity Bars)
  const hourlyFlow = [
    { time: "06:00 AM", count: 34, load: "low", pct: 30 },
    { time: "10:00 AM", count: 112, load: "peak", pct: 95 },
    { time: "02:00 PM", count: 85, load: "high", pct: 75 },
    { time: "06:00 PM", count: 98, load: "peak", pct: 88 },
    { time: "10:00 PM", count: 45, load: "normal", pct: 40 },
    { time: "02:00 AM", count: 18, load: "low", pct: 15 },
  ];

  // 5. Diagnostics & Lab Revenue (Ranked Bars)
  const labRevenue = [
    { service: "MRI Scans", revenue: "₱ 85,000", pct: 90, color: "bg-indigo-600" },
    { service: "CT Scans", revenue: "₱ 62,400", pct: 72, color: "bg-blue-500" },
    { service: "Ultrasound & X-Ray", revenue: "₱ 48,100", pct: 55, color: "bg-cyan-500" },
    { service: "Comprehensive Blood Panels", revenue: "₱ 39,500", pct: 45, color: "bg-emerald-500" },
    { service: "Histopathology/Biopsy", revenue: "₱ 22,000", pct: 25, color: "bg-amber-500" },
  ];

  // 6. Department Workload
  const departments = [
    { name: "Emergency (ER)", load: 92, color: "bg-rose-500" },
    { name: "Outpatient (OPD)", load: 75, color: "bg-indigo-500" },
    { name: "Intensive Care (ICU)", load: 88, color: "bg-amber-500" },
    { name: "Pediatrics", load: 45, color: "bg-emerald-500" },
    { name: "Maternity / OB", load: 60, color: "bg-pink-500" },
  ];

  // 7. Bed Allocation Matrix Detail
  const bedBreakdown = [
    { type: "Intensive Care (ICU)", occupied: 18, total: 20, color: "bg-rose-500" },
    { type: "Isolation Wards", occupied: 12, total: 15, color: "bg-amber-500" },
    { type: "General Ward Beds", occupied: 110, total: 130, color: "bg-indigo-500" },
    { type: "Premium Private Suites", occupied: 25, total: 30, color: "bg-emerald-500" },
  ];

  // 8. Blood Bank Clinical Inventory
  const bloodBank = [
    { type: "O+", level: 85, status: "Good" },
    { type: "O-", level: 12, status: "Critical" },
    { type: "A+", level: 64, status: "Good" },
    { type: "A-", level: 28, status: "Low" },
    { type: "B+", level: 75, status: "Good" },
    { type: "AB+", level: 40, status: "Normal" },
  ];

  // 9. Pharmacy High-Velocity Supply
  const pharmacyVelocity = [
    { item: "Paracetamol 500mg (IV)", dispensed: "1,420 units", speed: "Critical Demand", color: "text-rose-600", border: "border-rose-100", bg: "bg-rose-50/50" },
    { item: "Amoxicillin 500mg", dispensed: "890 units", speed: "High Velocity", color: "text-amber-600", border: "border-amber-100", bg: "bg-amber-50/50" },
    { item: "Insulin Glargine Pen", dispensed: "340 units", speed: "Normal Flow", color: "text-emerald-600", border: "border-emerald-100", bg: "bg-emerald-50/50" },
  ];

  // 10. Insurance & HMO Claims Escalation
  const hmoClaims = [
    { provider: "Maxicare", pending: 45, amount: "₱ 1,240,000", status: "Processing" },
    { provider: "PhilHealth", pending: 128, amount: "₱ 3,450,500", status: "Delayed" },
    { provider: "Intellicare", pending: 22, amount: "₱ 850,000", status: "Cleared" },
    { provider: "ValuCare", pending: 15, amount: "₱ 420,000", status: "Processing" },
  ];

  // 11. Live Patient Tracker Registry
  const recentPatients = [
    { id: "PT-001", name: "Carmela Dizon", type: "Inpatient", status: "Admitted", time: "10:24 AM", doctor: "Dr. Reyes" },
    { id: "PT-002", name: "Joshua Garcia", type: "ER", status: "Critical", time: "09:45 AM", doctor: "Dr. Santos" },
    { id: "PT-003", name: "Elena Cruz", type: "Outpatient", status: "Discharged", time: "09:12 AM", doctor: "Dr. Mendoza" },
    { id: "PT-004", name: "Miguel Torres", type: "Surgery", status: "In OR", time: "08:30 AM", doctor: "Dr. Lim" },
    { id: "PT-005", name: "Sarah Geronimo", type: "Maternity", status: "Labor", time: "07:15 AM", doctor: "Dr. Villanueva" },
  ];

  // 12. Real-time Infrastructure Logs
  const systemAlerts = [
    { type: "pharmacy", title: "Low Pharmacy Stock", desc: "Paracetamol IV supplies are below 15% threshold.", time: "10 mins ago", icon: Syringe, bg: "bg-rose-50/50", border: "border-rose-100", text: "text-rose-600" },
    { type: "er", title: "High ER Wait Times", desc: "Wait times in ER have exceeded standard KPIs (45m).", time: "1 hour ago", icon: Clock, bg: "bg-amber-50/50", border: "border-amber-100", text: "text-amber-600" },
    { type: "finance", title: "PhilHealth Payout Received", desc: "Batch 2026-A claims cleared (₱ 1.2M).", time: "2 hours ago", icon: Wallet, bg: "bg-emerald-50/50", border: "border-emerald-100", text: "text-emerald-600" },
    { type: "hvac", title: "OR Room 4 Maintenance Cleared", desc: "HVAC maintenance has been completed successfully.", time: "4 hours ago", icon: Hospital, bg: "bg-slate-50", border: "border-slate-100", text: "text-slate-600" },
  ];

  return (
    <div className="px-6 py-4 space-y-6 bg-slate-50/60 min-h-screen animate-in fade-in duration-500">
      
      {/* =========================================================================
          HEADER & COMMAND PANEL CONTROLS
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <ModuleHeader
          title="Hospital Enterprise Command Center"
          description="Unified Admin Portal • Live Clinical & Financial Telemetry"
          icon={<LayoutDashboard size={24} className="text-[var(--active-parent)]" />}
          actions={
            <div className="flex gap-2.5">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 uppercase tracking-wide">
                <FileText size={16} /> System Audit Logs
              </button>
              <button className="px-5 py-2 bg-[var(--active-parent)] text-white rounded-xl text-xs font-bold shadow-lg shadow-[var(--active-parent)]/20 hover:opacity-90 transition-all flex items-center gap-2 uppercase tracking-wide">
                <Calendar size={16} /> Operations Live
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
              <span className="text-slate-400">vs last shift</span>
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
          SECTION 3: ANALYTICS COMPLEX (Financial Progress & Patient Inflow)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART A: 7-Day Financial Growth (Vertical CSS Bars) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Financial Yield Trajectory</h3>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Gross Revenue Stream Breakdown</p>
            </div>
            <button className="text-xs font-bold text-[var(--active-parent)] hover:underline">Download Report</button>
          </div>
          
          <div className="flex-grow flex items-end gap-4 h-52 mt-4">
            {weeklyRevenue.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2.5 group">
                <div className="w-full relative flex justify-center items-end h-full bg-slate-50 rounded-t-xl overflow-hidden">
                  <div 
                    className="w-full bg-[var(--active-parent)] rounded-t-xl transition-all duration-700 ease-out opacity-85 group-hover:opacity-100"
                    style={{ height: `${day.value}%` }}
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

        {/* CHART B: Hourly Patient Inflow Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Capacity & Load Density</h3>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">Hourly Patient Inflow Map</p>
          </div>
          
          <div className="space-y-3.5 flex-grow justify-center flex flex-col">
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
          SECTION 4: OPERATIONAL MAPS (Diagnostics Revenue, Department Loads, Bed Matrix)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CHART C: Diagnostics & Lab Revenue (Ranked Horizontal Bars) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Service capture yield</h3>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">Diagnostics & Labs</p>
          </div>
          <div className="space-y-3.5 flex-grow justify-center flex flex-col">
            {labRevenue.map((lab, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="text-slate-600 font-semibold text-[11px]">{lab.service}</span>
                  <span className="text-slate-900 font-black">{lab.revenue}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                  <div className={`h-full rounded-lg transition-all duration-1000 ${lab.color}`} style={{ width: `${lab.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART D: Department Load Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Congestion Level</h3>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">Department Workload</p>
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

        {/* CHART E: Stacked Bed Matrix Allocation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:col-span-2 lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Asset & Capacity Tracking</h3>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">Bed Allocation Matrix</p>
          </div>
          <div className="space-y-3.5 flex-grow justify-center flex flex-col">
            {bedBreakdown.map((bed, idx) => {
              const occupancyRate = Math.round((bed.occupied / bed.total) * 100);
              return (
                <div key={idx} className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-slate-700 font-bold text-[11px]">{bed.type}</span>
                    <span className="text-slate-500 text-[10px] font-medium">{bed.occupied}/{bed.total} Beds</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${bed.color}`} style={{ width: `${occupancyRate}%` }}></div>
                    </div>
                    <span className={`text-[10px] font-black w-8 text-right ${occupancyRate > 85 ? 'text-rose-600' : 'text-slate-600'}`}>
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
          SECTION 5: LOGISTICS & SECURITY (Blood Bank & Pharmacy Supply Velocity)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MODYUL: Blood Bank Clinical Status */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Critical Reagents</h3>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Blood Bank Inventory</p>
            </div>
            <Droplet size={18} className="text-rose-500" />
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {bloodBank.map((blood, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-sm font-black text-slate-700">{blood.type}</span>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">{blood.level}%</div>
                  <div className={`text-[9px] font-black uppercase tracking-wider ${blood.level < 20 ? 'text-rose-600' : blood.level < 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {blood.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODYUL: Pharmacy Supply Velocity Indicators */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Dispensing Logistics</h3>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Top Moving Pharmacy Stock</p>
            </div>
            <Pill size={18} className="text-indigo-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow justify-center">
            {pharmacyVelocity.map((pharm, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${pharm.border} ${pharm.bg} flex flex-col justify-between`}>
                <div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${pharm.color}`}>
                    {pharm.speed}
                  </span>
                  <h4 className="text-xs font-black text-slate-800 mt-1">{pharm.item}</h4>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-3">Dispensed today: <br /><span className="font-bold text-slate-700 text-xs">{pharm.dispensed}</span></p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 6: REGISTRY & FINANCE (Live Patient Database & HMO Claims Telemetry)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TABLE: Live Patient Registry Tracking */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Admission Flow</h3>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Live Patient Registry</p>
            </div>
            <button className="text-xs font-bold text-[var(--active-parent)] hover:underline">View All Admissions</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[9px] uppercase tracking-widest font-black border-b border-slate-100">
                  <th className="px-6 py-4">Patient Profile</th>
                  <th className="px-6 py-4">Department / Type</th>
                  <th className="px-6 py-4">Clinical Status</th>
                  <th className="px-6 py-4">Attending MD</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold">
                {recentPatients.map((patient, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-slate-700">
                      <div className="font-extrabold">{patient.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">{patient.id} • {patient.time}</div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 text-[11px] font-semibold">
                      {patient.type}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider
                        ${patient.status === 'Critical' ? 'bg-rose-100 text-rose-700' : 
                          patient.status === 'Admitted' ? 'bg-indigo-100 text-indigo-700' :
                          patient.status === 'In OR' || patient.status === 'Labor' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 text-[11px] font-semibold">{patient.doctor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE: Insurance & HMO Escrow Claims Ledger */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Financial Escrows</h3>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Insurance & HMO Claims</p>
            </div>
            <button className="text-xs font-bold text-[var(--active-parent)] hover:underline">Reconcile</button>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[9px] uppercase tracking-widest font-black border-b border-slate-100">
                  <th className="px-5 py-4">Provider</th>
                  <th className="px-5 py-4">Pending</th>
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
                    <td className="px-5 py-3.5 text-slate-500 font-semibold">{claim.pending} claims</td>
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
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Infrastructure Governance</h3>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">Real-Time Critical System Alerts</p>
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