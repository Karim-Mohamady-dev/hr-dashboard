import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowCounterClockwise,
  Briefcase,
  Buildings,
  CalendarCheck,
  Check,
  CheckCircle,
  Clock,
  GearSix,
  Globe,
  House,
  Laptop,
  MagnifyingGlass,
  Plus,
  Trash,
  TrendUp,
  UserPlus,
  Users,
  Warning,
  X,
  XCircle,
} from '@phosphor-icons/react'
import { detectLang, useDict, type Lang } from './i18n'

type Dept = 'engineering' | 'design' | 'sales' | 'marketing' | 'hr' | 'finance'
type Attendance = 'present' | 'remote' | 'leave'
type LeaveType = 'vacation' | 'sick' | 'personal'
type Outcome = 'approved' | 'rejected'
type View = 'overview' | 'directory' | 'leave' | 'onboarding' | 'settings'

interface Employee {
  id: string
  name: string
  role: string
  dept: Dept
  email: string
  attendance: Attendance
  startDate: string
  isNewHire: boolean
}

interface LeaveRequest {
  id: string
  employeeId: string
  type: LeaveType
  from: string
  to: string
}

interface LeaveDecision {
  id: string
  outcome: Outcome
  at: number
}

interface Persisted {
  employees: Employee[]
  leaveDecisions: LeaveDecision[]
  onboarding: Record<string, string[]>
}

const STORE_KEY = 'hrdash-state-v1'
const TEAL = '#0D9488'

const DEPTS: Dept[] = ['engineering', 'design', 'sales', 'marketing', 'hr', 'finance']

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: 'e-01', name: 'Layla Hassan', role: 'Senior Frontend Engineer', dept: 'engineering', email: 'layla@peoplehub.io', attendance: 'present', startDate: '2023-03-14', isNewHire: false },
  { id: 'e-02', name: 'Omar Farouk', role: 'Backend Engineer', dept: 'engineering', email: 'omar@peoplehub.io', attendance: 'remote', startDate: '2022-07-01', isNewHire: false },
  { id: 'e-03', name: 'Nour Abdelaziz', role: 'Product Designer', dept: 'design', email: 'nour@peoplehub.io', attendance: 'present', startDate: '2024-01-22', isNewHire: false },
  { id: 'e-04', name: 'Karim Adel', role: 'UX Designer', dept: 'design', email: 'karim@peoplehub.io', attendance: 'remote', startDate: '2023-09-05', isNewHire: false },
  { id: 'e-05', name: 'Sara Mansour', role: 'Sales Lead', dept: 'sales', email: 'sara@peoplehub.io', attendance: 'present', startDate: '2021-05-17', isNewHire: false },
  { id: 'e-06', name: 'Ahmed Tarek', role: 'Account Executive', dept: 'sales', email: 'ahmed@peoplehub.io', attendance: 'present', startDate: '2024-06-03', isNewHire: false },
  { id: 'e-07', name: 'Mona El-Sayed', role: 'Content Strategist', dept: 'marketing', email: 'mona@peoplehub.io', attendance: 'leave', startDate: '2022-11-08', isNewHire: false },
  { id: 'e-08', name: 'Youssef Nabil', role: 'Growth Marketer', dept: 'marketing', email: 'youssef@peoplehub.io', attendance: 'remote', startDate: '2025-02-10', isNewHire: false },
  { id: 'e-09', name: 'Heba Ibrahim', role: 'HR Business Partner', dept: 'hr', email: 'heba@peoplehub.io', attendance: 'present', startDate: '2020-08-24', isNewHire: false },
  { id: 'e-10', name: 'Mostafa Ali', role: 'Recruiter', dept: 'hr', email: 'mostafa@peoplehub.io', attendance: 'present', startDate: '2024-04-15', isNewHire: false },
  { id: 'e-11', name: 'Rania Khaled', role: 'Financial Analyst', dept: 'finance', email: 'rania@peoplehub.io', attendance: 'remote', startDate: '2023-01-30', isNewHire: false },
  { id: 'e-12', name: 'Tarek Mahmoud', role: 'Accountant', dept: 'finance', email: 'tarek@peoplehub.io', attendance: 'present', startDate: '2022-04-11', isNewHire: false },
  { id: 'e-13', name: 'Jana Samir', role: 'DevOps Engineer', dept: 'engineering', email: 'jana@peoplehub.io', attendance: 'present', startDate: '2025-08-19', isNewHire: false },
  { id: 'e-14', name: 'Bilal Hussein', role: 'Data Analyst', dept: 'engineering', email: 'bilal@peoplehub.io', attendance: 'leave', startDate: '2024-10-07', isNewHire: false },
  { id: 'e-15', name: 'Farah Aziz', role: 'Brand Designer', dept: 'design', email: 'farah@peoplehub.io', attendance: 'remote', startDate: '2025-05-12', isNewHire: false },
  { id: 'e-16', name: 'Adam Sherif', role: 'Sales Development Rep', dept: 'sales', email: 'adam@peoplehub.io', attendance: 'present', startDate: '2026-11-03', isNewHire: true },
  { id: 'e-17', name: 'Lina Fathy', role: 'People Operations Associate', dept: 'hr', email: 'lina@peoplehub.io', attendance: 'remote', startDate: '2026-11-10', isNewHire: true },
  { id: 'e-18', name: 'Ziad Gamal', role: 'Junior Frontend Engineer', dept: 'engineering', email: 'ziad@peoplehub.io', attendance: 'present', startDate: '2026-11-17', isNewHire: true },
]

const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'lr-01', employeeId: 'e-07', type: 'vacation', from: 'Dec 1, 2026', to: 'Dec 5, 2026' },
  { id: 'lr-02', employeeId: 'e-02', type: 'sick', from: 'Nov 27, 2026', to: 'Nov 28, 2026' },
  { id: 'lr-03', employeeId: 'e-06', type: 'vacation', from: 'Dec 8, 2026', to: 'Dec 12, 2026' },
  { id: 'lr-04', employeeId: 'e-11', type: 'personal', from: 'Dec 3, 2026', to: 'Dec 3, 2026' },
  { id: 'lr-05', employeeId: 'e-04', type: 'vacation', from: 'Dec 15, 2026', to: 'Dec 22, 2026' },
]

const ONBOARDING_STEPS = ['laptop', 'accounts', 'buddy', 'plan', 'paperwork'] as const

const OPEN_ROLES = [
  { title: 'Senior Backend Engineer', dept: 'engineering' as Dept },
  { title: 'Product Designer', dept: 'design' as Dept },
  { title: 'Account Executive', dept: 'sales' as Dept },
  { title: 'People Operations Manager', dept: 'hr' as Dept },
]

const DEFAULTS: Persisted = {
  employees: DEFAULT_EMPLOYEES,
  leaveDecisions: [],
  onboarding: {
    'e-16': ['laptop', 'accounts'],
    'e-17': ['laptop'],
    'e-18': [],
  },
}

function loadState(): Persisted {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<Persisted>
    return {
      employees: parsed.employees ?? DEFAULTS.employees,
      leaveDecisions: parsed.leaveDecisions ?? DEFAULTS.leaveDecisions,
      onboarding: parsed.onboarding ?? DEFAULTS.onboarding,
    }
  } catch {
    return DEFAULTS
  }
}

function fmtTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const ATTENDANCE_STYLE: Record<Attendance, string> = {
  present: 'bg-emerald-50 text-emerald-700',
  remote: 'bg-sky-50 text-sky-700',
  leave: 'bg-amber-50 text-amber-700',
}

const DEPT_COLORS: Record<Dept, string> = {
  engineering: '#0D9488',
  design: '#8B5CF6',
  sales: '#F59E0B',
  marketing: '#EC4899',
  hr: '#3B82F6',
  finance: '#10B981',
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => detectLang())
  const { t } = useDict(lang)
  const [state, setState] = useState<Persisted>(() => loadState())
  const [view, setView] = useState<View>('overview')
  const [query, setQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState<Dept | 'all'>('all')
  const [toast, setToast] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formRole, setFormRole] = useState('')
  const [formDept, setFormDept] = useState<Dept>('engineering')
  const [formEmail, setFormEmail] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state))
    } catch {
      // storage unavailable
    }
  }, [state])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try {
      localStorage.setItem('hrdash-lang', lang)
    } catch {
      // storage unavailable
    }
  }, [lang])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(id)
  }, [toast])

  const employees = state.employees
  const totalEmployees = employees.length
  const newHires = employees.filter((e) => e.startDate.startsWith('2026-11')).length
  const deptCount = new Set(employees.map((e) => e.dept)).size

  const attendanceCounts = useMemo(() => {
    const counts: Record<Attendance, number> = { present: 0, remote: 0, leave: 0 }
    employees.forEach((e) => {
      counts[e.attendance] += 1
    })
    return counts
  }, [employees])

  const deptBreakdown = useMemo(() => {
    return DEPTS.map((d) => ({
      dept: d,
      count: employees.filter((e) => e.dept === d).length,
    })).filter((d) => d.count > 0)
  }, [employees])

  const decidedIds = useMemo(() => new Set(state.leaveDecisions.map((d) => d.id)), [state.leaveDecisions])
  const pendingLeave = LEAVE_REQUESTS.filter((r) => !decidedIds.has(r.id))
  const decidedLeave = useMemo(
    () => [...state.leaveDecisions].reverse().map((d) => ({ ...d, req: LEAVE_REQUESTS.find((r) => r.id === d.id) })),
    [state.leaveDecisions],
  )

  const filteredEmployees = useMemo(() => {
    const q = query.trim().toLowerCase()
    return employees.filter((e) => {
      if (deptFilter !== 'all' && e.dept !== deptFilter) return false
      if (q && !e.name.toLowerCase().includes(q) && !e.role.toLowerCase().includes(q)) return false
      return true
    })
  }, [employees, query, deptFilter])

  const newHiresList = employees.filter((e) => e.isNewHire)

  function decideLeave(id: string, outcome: Outcome) {
    if (decidedIds.has(id)) return
    setState((s) => ({ ...s, leaveDecisions: [...s.leaveDecisions, { id, outcome, at: Date.now() }] }))
    setToast(outcome === 'approved' ? t('toast.approved') : t('toast.rejected'))
  }

  function toggleStep(hireId: string, step: string) {
    setState((s) => {
      const current = s.onboarding[hireId] ?? []
      const next = current.includes(step) ? current.filter((x) => x !== step) : [...current, step]
      return { ...s, onboarding: { ...s.onboarding, [hireId]: next } }
    })
  }

  function addEmployee() {
    const name = formName.trim()
    const role = formRole.trim()
    const email = formEmail.trim()
    if (!name || !role || !email) return
    const id = `e-${Date.now().toString(36)}`
    const emp: Employee = {
      id,
      name,
      role,
      dept: formDept,
      email,
      attendance: 'present',
      startDate: '2026-11-27',
      isNewHire: false,
    }
    setState((s) => ({ ...s, employees: [...s.employees, emp] }))
    setFormName('')
    setFormRole('')
    setFormEmail('')
    setFormDept('engineering')
    setShowAddForm(false)
    setToast(t('toast.added'))
  }

  function deleteEmployee(id: string) {
    setState((s) => ({ ...s, employees: s.employees.filter((e) => e.id !== id) }))
    setToast(t('toast.deleted'))
  }

  function resetDemo() {
    setState(DEFAULTS)
    setQuery('')
    setDeptFilter('all')
    setShowAddForm(false)
    setToast(t('toast.reset'))
  }

  const todayLabel = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  const navItems: { id: View; label: string; icon: ReactNode; badge?: number }[] = [
    { id: 'overview', label: t('nav.overview'), icon: <House size={20} /> },
    { id: 'directory', label: t('nav.directory'), icon: <Users size={20} /> },
    { id: 'leave', label: t('nav.leave'), icon: <CalendarCheck size={20} />, badge: pendingLeave.length },
    { id: 'onboarding', label: t('nav.onboarding'), icon: <Laptop size={20} /> },
    { id: 'settings', label: t('nav.settings'), icon: <GearSix size={20} /> },
  ]

  const stats = [
    { label: t('stats.totalEmployees'), value: totalEmployees, hint: t('stats.totalHint'), icon: <Users size={22} style={{ color: TEAL }} /> },
    { label: t('stats.newHires'), value: newHires, hint: t('stats.newHiresHint'), icon: <UserPlus size={22} style={{ color: TEAL }} /> },
    { label: t('stats.departments'), value: deptCount, hint: t('stats.departmentsHint'), icon: <Buildings size={22} style={{ color: TEAL }} /> },
    { label: t('stats.openRoles'), value: OPEN_ROLES.length, hint: t('stats.openRolesHint'), icon: <Briefcase size={22} style={{ color: TEAL }} /> },
  ]

  const attendanceTotal = Math.max(attendanceCounts.present + attendanceCounts.remote + attendanceCounts.leave, 1)
  const attendanceBar: { key: Attendance; color: string }[] = [
    { key: 'present', color: '#10B981' },
    { key: 'remote', color: '#0EA5E9' },
    { key: 'leave', color: '#F59E0B' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-e border-slate-200 min-h-screen sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-5 pt-6 pb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: TEAL }}>
            <Users size={22} weight="bold" />
          </div>
          <div>
            <p className="font-extrabold text-lg leading-none text-slate-900">{t('app.name')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('app.tagline')}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3 mt-2">
          {navItems.map((item) => {
            const active = view === item.id
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-200 text-start ${
                  active ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className={active ? 'text-teal-600' : 'text-slate-400'}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="min-w-6 h-6 px-1.5 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto px-4 pb-5">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center">S</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">Sara Ahmed</p>
              <p className="text-xs text-emerald-600 font-semibold">● Online — HR Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{t('header.greeting')}</h1>
              <p className="text-sm text-slate-500 mt-1">
                {todayLabel} · {t('header.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5">
                <Warning size={14} weight="fill" />
                {t('app.demoBadge')}
              </span>
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-700 px-3 py-1.5 hover:border-teal-300 hover:text-teal-700 transition-colors duration-200"
              >
                <Globe size={16} />
                {t('header.langToggle')}
              </button>
            </div>
          </header>

          {/* Mobile nav */}
          <div className="md:hidden flex gap-2 overflow-x-auto mt-5 pb-1">
            {navItems.map((item) => {
              const active = view === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-bold transition-colors duration-200 ${
                    active ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {item.label}
                  {typeof item.badge === 'number' && item.badge > 0 ? ` (${item.badge})` : ''}
                </button>
              )
            })}
          </div>

          {view === 'overview' && (
            <div key="overview" className="animate-fade-slide">
              {/* Stat cards */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{s.label}</p>
                      {s.icon}
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 mt-2">{s.value}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <TrendUp size={13} className="text-emerald-500" />
                      {s.hint}
                    </p>
                  </div>
                ))}
              </section>

              <div className="grid lg:grid-cols-2 gap-4 mt-4">
                {/* Attendance */}
                <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                  <h2 className="text-lg font-extrabold text-slate-900">{t('attendance.title')}</h2>
                  <p className="text-sm text-slate-500 mt-1">{t('attendance.subtitle')}</p>
                  <div className="flex h-3 rounded-full overflow-hidden mt-5">
                    {attendanceBar.map((b) => (
                      <div
                        key={b.key}
                        style={{ width: `${(attendanceCounts[b.key] / attendanceTotal) * 100}%`, backgroundColor: b.color }}
                        className="transition-all duration-500"
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    {attendanceBar.map((b) => (
                      <div key={b.key} className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                        <p className="text-2xl font-extrabold" style={{ color: b.color }}>
                          {attendanceCounts[b.key]}
                        </p>
                        <p className="text-xs font-bold text-slate-600 mt-0.5">{t(`attendance.${b.key}`)}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Department breakdown */}
                <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                  <h2 className="text-lg font-extrabold text-slate-900">{t('stats.departments')}</h2>
                  <p className="text-sm text-slate-500 mt-1">{t('stats.totalHint')}</p>
                  <ul className="mt-5 space-y-4">
                    {deptBreakdown.map((d) => (
                      <li key={d.dept}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="font-bold text-slate-700">{t(`dept.${d.dept}`)}</span>
                          <span className="font-extrabold text-slate-900">
                            {d.count} · {Math.round((d.count / totalEmployees) * 100)}%
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(d.count / totalEmployees) * 100}%`, backgroundColor: DEPT_COLORS[d.dept] }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Open roles */}
              <section className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-extrabold text-slate-900">{t('roles.openRoles')}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{t('roles.subtitle')}</p>
                </div>
                <ul className="divide-y divide-slate-100">
                  {OPEN_ROLES.map((r) => (
                    <li key={r.title} className="px-5 sm:px-6 py-4 flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                        <Briefcase size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{r.title}</p>
                        <p className="text-xs text-slate-500">{t(`dept.${r.dept}`)}</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">{t('roles.openRoles')}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {view === 'directory' && (
            <div key="directory" className="animate-fade-slide">
              <section className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {t('directory.title')} <span className="text-teal-600">({filteredEmployees.length})</span>
                  </h2>
                  <button
                    onClick={() => setShowAddForm((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 text-white text-sm font-bold px-4 py-2.5 hover:bg-teal-700 active:scale-[0.98] transition-all duration-200"
                  >
                    <Plus size={16} weight="bold" />
                    {t('actions.add')}
                  </button>
                </div>

                {showAddForm && (
                  <div className="px-5 sm:px-6 py-5 border-b border-slate-100 bg-teal-50/50">
                    <p className="font-extrabold text-slate-900 mb-4">{t('directory.addTitle')}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder={t('directory.name')}
                        className="rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
                      />
                      <input
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder={t('directory.role')}
                        className="rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
                      />
                      <select
                        value={formDept}
                        onChange={(e) => setFormDept(e.target.value as Dept)}
                        className="rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
                      >
                        {DEPTS.map((d) => (
                          <option key={d} value={d}>
                            {t(`dept.${d}`)}
                          </option>
                        ))}
                      </select>
                      <input
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder={t('directory.email')}
                        type="email"
                        className="rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={addEmployee}
                        disabled={!formName.trim() || !formRole.trim() || !formEmail.trim()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 text-white text-sm font-bold px-4 py-2.5 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <Check size={16} weight="bold" />
                        {t('actions.add')}
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-bold px-4 py-2.5 hover:border-slate-400 transition-colors duration-200"
                      >
                        {t('actions.cancel')}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 px-5 sm:px-6 py-3 border-b border-slate-100">
                  <div className="relative">
                    <MagnifyingGlass size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('directory.searchPlaceholder')}
                      className="w-56 sm:w-64 rounded-full border border-slate-200 bg-slate-50 py-2 ps-9 pe-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600 transition-all duration-200"
                    />
                  </div>
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value as Dept | 'all')}
                    className="rounded-full border border-slate-200 bg-slate-50 py-2 px-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
                  >
                    <option value="all">{t('directory.filterAll')}</option>
                    {DEPTS.map((d) => (
                      <option key={d} value={d}>
                        {t(`dept.${d}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {filteredEmployees.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Users size={40} className="mx-auto text-slate-300" weight="duotone" />
                    <p className="font-bold text-slate-800 mt-3">{t('directory.empty')}</p>
                    <p className="text-sm text-slate-500 mt-1">{t('directory.emptyHint')}</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => (
                      <li key={emp.id} className="px-5 sm:px-6 py-4 flex flex-wrap items-center gap-3 hover:bg-slate-50 transition-colors duration-150">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 truncate">
                            {emp.name}
                            {emp.isNewHire && (
                              <span className="ms-2 text-[10px] font-extrabold uppercase tracking-wide bg-teal-600 text-white rounded-full px-2 py-0.5 align-middle">
                                {t('directory.newBadge')}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {emp.role} · {t(`dept.${emp.dept}`)} · {emp.email}
                          </p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ATTENDANCE_STYLE[emp.attendance]}`}>
                          {t(`status.${emp.attendance}`)}
                        </span>
                        <button
                          onClick={() => deleteEmployee(emp.id)}
                          aria-label={`${t('actions.delete')} ${emp.name}`}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          <Trash size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}

          {view === 'leave' && (
            <div key="leave" className="animate-fade-slide">
              <section className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {t('leave.pending')} <span className="text-teal-600">({pendingLeave.length})</span>
                  </h2>
                </div>
                {pendingLeave.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <CheckCircle size={40} className="mx-auto text-emerald-500" weight="duotone" />
                    <p className="font-bold text-slate-800 mt-3">{t('leave.empty')}</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {pendingLeave.map((req) => {
                      const emp = employees.find((e) => e.id === req.employeeId)
                      if (!emp) return null
                      return (
                        <li key={req.id} className="px-5 sm:px-6 py-4 flex flex-wrap items-center gap-3 hover:bg-slate-50 transition-colors duration-150">
                          <div className="w-10 h-10 shrink-0 rounded-full bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center">
                            {emp.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 truncate">{emp.name}</p>
                            <p className="text-xs text-slate-500 truncate">
                              {t(`type.${req.type}`)} · {t('leave.from')} {req.from} {t('leave.to')} {req.to}
                            </p>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                            {t(`dept.${emp.dept}`)}
                          </span>
                          <div className="flex gap-2 ms-auto">
                            <button
                              onClick={() => decideLeave(req.id, 'approved')}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white text-sm font-bold px-3 py-2 hover:bg-emerald-700 active:scale-95 transition-all duration-150"
                            >
                              <Check size={15} weight="bold" />
                              {t('actions.approve')}
                            </button>
                            <button
                              onClick={() => decideLeave(req.id, 'rejected')}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-600 text-white text-sm font-bold px-3 py-2 hover:bg-red-700 active:scale-95 transition-all duration-150"
                            >
                              <X size={15} weight="bold" />
                              {t('actions.reject')}
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              <section className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-extrabold text-slate-900">{t('leave.decided')}</h2>
                  <Clock size={18} className="text-slate-400" />
                </div>
                {decidedLeave.length === 0 ? (
                  <p className="px-6 py-6 text-sm text-slate-500">{t('leave.empty')}</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {decidedLeave.map((d) => {
                      const emp = d.req ? employees.find((e) => e.id === d.req!.employeeId) : undefined
                      if (!d.req || !emp) return null
                      return (
                        <li key={`${d.id}-${d.at}`} className="px-5 sm:px-6 py-3 flex items-center gap-3">
                          {d.outcome === 'approved' ? (
                            <CheckCircle size={20} className="text-emerald-600 shrink-0" weight="fill" />
                          ) : (
                            <XCircle size={20} className="text-red-600 shrink-0" weight="fill" />
                          )}
                          <p className="font-bold text-slate-800 flex-1 truncate">
                            {emp.name} · {t(`type.${d.req.type}`)}
                          </p>
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              d.outcome === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {d.outcome === 'approved' ? t('leave.approved') : t('leave.rejected')}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{fmtTime(d.at)}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            </div>
          )}

          {view === 'onboarding' && (
            <div key="onboarding" className="animate-fade-slide">
              <section className="mt-6">
                <h2 className="text-lg font-extrabold text-slate-900">{t('onboarding.title')}</h2>
                <p className="text-sm text-slate-500 mt-1">{t('onboarding.subtitle')}</p>
                {newHiresList.length === 0 ? (
                  <p className="text-sm text-slate-500 mt-4">{t('onboarding.complete')}</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {newHiresList.map((hire) => {
                      const done = state.onboarding[hire.id] ?? []
                      const pct = Math.round((done.length / ONBOARDING_STEPS.length) * 100)
                      const allDone = done.length === ONBOARDING_STEPS.length
                      return (
                        <article key={hire.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-700 font-extrabold text-lg flex items-center justify-center">
                              {hire.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-extrabold text-slate-900 truncate">{hire.name}</p>
                              <p className="text-xs text-slate-500 truncate">
                                {hire.role} · {t(`dept.${hire.dept}`)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold mt-5 mb-1.5">
                            <span className="text-slate-600">
                              {done.length}/{ONBOARDING_STEPS.length} {t('onboarding.progress')}
                            </span>
                            <span className={allDone ? 'text-emerald-600' : 'text-teal-700'}>
                              {allDone ? t('onboarding.complete') : `${pct}%`}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-emerald-500' : 'bg-teal-600'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <ul className="mt-4 space-y-1">
                            {ONBOARDING_STEPS.map((step) => {
                              const checked = done.includes(step)
                              return (
                                <li key={step}>
                                  <button
                                    onClick={() => toggleStep(hire.id, step)}
                                    className="w-full flex items-center gap-3 rounded-lg px-2 py-2 text-start hover:bg-slate-50 transition-colors duration-150"
                                  >
                                    <span
                                      className={`w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors duration-150 ${
                                        checked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white text-transparent'
                                      }`}
                                    >
                                      <Check size={13} weight="bold" />
                                    </span>
                                    <span className={`text-sm font-semibold ${checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                      {t(`onboarding.steps.${step}`)}
                                    </span>
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {view === 'settings' && (
            <section key="settings" className="animate-fade-slide mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <h2 className="text-lg font-extrabold text-slate-900 px-5 sm:px-6 py-4 border-b border-slate-100">{t('nav.settings')}</h2>
              <div className="p-5 sm:p-6 space-y-6">
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-2">{t('settings.language')}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLang('en')}
                      className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                        lang === 'en' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLang('ar')}
                      className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                        lang === 'ar' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      العربية
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-2">{t('actions.reset')}</p>
                  <p className="text-xs text-slate-500 mb-3">{t('settings.resetHint')}</p>
                  <button
                    onClick={resetDemo}
                    className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold py-2.5 px-4 hover:border-red-300 hover:text-red-600 transition-colors duration-200"
                  >
                    <ArrowCounterClockwise size={17} />
                    {t('actions.reset')}
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-50 animate-fade-slide">
          <div className="flex items-center gap-2 rounded-full bg-slate-900 text-white text-sm font-bold px-4 py-2.5 shadow-lg">
            <CheckCircle size={18} className="text-emerald-400" weight="fill" />
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
