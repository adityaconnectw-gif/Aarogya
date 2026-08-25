import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  FileText,
  Pill,
  Syringe,
  FlaskConical,
  LineChart,
  Calendar,
  UserPlus,
  Users,
  ShieldCheck,
  ShieldAlert,
  FolderLock,
  HeartHandshake,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Stethoscope,
  Building2,
  FileSpreadsheet,
  AlertTriangle,
  QrCode,
  ChevronRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { InstitutionalTopBar } from '../common/InstitutionalHeader';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { AarogyamLogo } from '../common/AarogyamLogo';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, isAuthenticated } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, patient } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    highlight?: boolean;
  }

  const patientNav: NavItem[] = [
    { label: 'Overview', path: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Health Timeline', path: '/patient/timeline', icon: Clock },
    { label: 'Medical Records', path: '/patient/records', icon: FileText },
    { label: 'Medications', path: '/patient/medications', icon: Pill },
    { label: 'Vaccinations', path: '/patient/vaccinations', icon: Syringe, badge: 'Due' },
    { label: 'Lab Reports', path: '/patient/labs', icon: FlaskConical },
    { label: 'Health Trends', path: '/patient/trends', icon: LineChart },
    { label: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'Book Appointment', path: '/patient/book-appointment', icon: UserPlus },
    { label: 'Doctor Directory', path: '/patient/doctors', icon: Stethoscope },
    { label: 'Consent & Sharing', path: '/patient/consent', icon: ShieldCheck },
    { label: 'Security Audit Log', path: '/patient/security', icon: ShieldAlert },
    { label: 'Emergency Health Card', path: '/patient/emergency', icon: AlertTriangle, highlight: true },
    { label: 'Health Documents', path: '/patient/documents', icon: FolderLock },
    { label: 'Family Profiles', path: '/patient/family', icon: Users },
    { label: 'Settings', path: '/patient/settings', icon: Settings },
  ];

  const doctorNav: NavItem[] = [
    { label: 'Clinical Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'Appointments Queue', path: '/doctor/appointments', icon: Calendar },
    { label: 'Patient Directory', path: '/doctor/patients', icon: Users },
    { label: 'Digital Case Taking', path: '/doctor/case/new', icon: Stethoscope, highlight: true },
    { label: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
    { label: 'Access Requests', path: '/doctor/access-requests', icon: ShieldCheck },
    { label: 'Clinical Reports', path: '/doctor/reports', icon: FileSpreadsheet },
    { label: 'Doctor Audit Log', path: '/doctor/audit', icon: ShieldAlert },
    { label: 'Doctor Profile', path: '/doctor/profile', icon: Settings },
  ];

  const adminNav: NavItem[] = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Patient Registry', path: '/admin/patients', icon: Users },
    { label: 'Medical Staff (Doctors)', path: '/admin/doctors', icon: Stethoscope },
    { label: 'Hospital Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Appointment Schedules', path: '/admin/appointments', icon: Calendar },
    { label: 'Access & Consent Logs', path: '/admin/access-requests', icon: ShieldCheck },
    { label: 'Institutional Audit', path: '/admin/audit', icon: ShieldAlert },
    { label: 'Hospital Settings', path: '/admin/settings', icon: Settings },
  ];

  const currentNav = role === 'patient' ? patientNav : role === 'doctor' ? doctorNav : adminNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Enforce role authorization
  const isPathAuthorized = () => {
    if (!isAuthenticated) return false;
    if (location.pathname.startsWith('/patient') && role !== 'patient') return false;
    if (location.pathname.startsWith('/doctor') && role !== 'doctor') return false;
    if (location.pathname.startsWith('/admin') && role !== 'admin') return false;
    return true;
  };

  const isAuthorized = isPathAuthorized();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-xs">
        <div className="p-6 rounded-md border border-border bg-surface max-w-md w-full text-center space-y-4 shadow-md">
          <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please sign in with your verified credentials to access this healthcare portal.
            </p>
          </div>
          <Link to="/login" className="block">
            <Button size="md" variant="primary" className="w-full">
              Go to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    const expectedRoleName = location.pathname.startsWith('/doctor')
      ? 'Doctor (Clinician)'
      : location.pathname.startsWith('/admin')
      ? 'Hospital Administrator'
      : 'Patient (Citizen)';

    const currentRoleName = role === 'patient'
      ? 'Patient (Aditya Verma)'
      : role === 'doctor'
      ? 'Doctor (Dr. Rohan Sharma)'
      : 'Hospital Administrator';

    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <InstitutionalTopBar />
        <div className="flex-1 flex items-center justify-center p-4 text-xs">
          <div className="p-6 rounded-md border border-border bg-surface max-w-lg w-full text-center space-y-4 shadow-md">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-danger flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-foreground">Active Session Role Mismatch</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are currently signed in as <strong className="text-foreground">{currentRoleName}</strong>. To access the <strong className="text-foreground">{expectedRoleName}</strong> portal, you must first log out from this session.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="sm" variant="outline" onClick={() => navigate(`/${role}/dashboard`)}>
                Return to My {role.toUpperCase()} Dashboard
              </Button>
              <Button size="sm" variant="danger" onClick={handleLogout} leftIcon={<LogOut className="h-3.5 w-3.5" />}>
                Log Out & Switch Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Institutional Bar */}
      <InstitutionalTopBar />

      {/* Main App Bar */}
      <header className="bg-surface border-b border-border shadow-xs sticky top-[33px] z-30">
        <div className="px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Left: Mobile toggle + Brand/Portal Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground"
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <AarogyamLogo size="sm" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground leading-none">Aarogyam</span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {role === 'patient'
                    ? 'Patient Portal'
                    : role === 'doctor'
                    ? 'Doctor Clinical Portal'
                    : 'Hospital Admin Portal'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center / Search: Direct lookup */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={
                  role === 'patient'
                    ? 'Search timeline, doctors, tests, prescriptions...'
                    : role === 'doctor'
                    ? 'Search patient by ID (e.g. P-10001), name, phone...'
                    : 'Search doctors, departments, patient records...'
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (role === 'patient') navigate('/patient/timeline');
                    else if (role === 'doctor') navigate('/doctor/patients');
                    else navigate('/admin/patients');
                  }
                }}
                className="w-full h-8 pl-9 pr-3 text-xs bg-surface-alt/70 border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Right: Notifications, Emergency shortcut, User chip */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Emergency access badge for patient */}
            {role === 'patient' && (
              <Link to="/patient/emergency" className="hidden sm:inline-flex">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition-colors">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                  <span>Emergency Card</span>
                </span>
              </Link>
            )}

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-1.5 rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-alt"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-md bg-surface border border-border shadow-elevated z-50 animate-slide-up text-xs">
                  <div className="p-3 border-b border-border flex items-center justify-between bg-surface-alt/40">
                    <span className="font-semibold text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-primary hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.actionUrl) {
                              navigate(notif.actionUrl);
                              setNotifDropdownOpen(false);
                            }
                          }}
                          className={`p-3 hover:bg-surface-alt/60 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-primary-muted/20 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-foreground text-xs">{notif.title}</span>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {notif.timestamp.substring(11, 16)}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-0.5 text-[11px] leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-border bg-surface-alt/20 text-center">
                    <Link
                      to={role === 'patient' ? '/patient/security' : '/doctor/audit'}
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-[11px] text-muted-foreground hover:text-foreground font-medium"
                    >
                      View audit & security logs →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Current User Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {user?.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {user?.patientId || user?.doctorId || 'Admin'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded text-muted-foreground hover:text-danger hover:bg-surface-alt transition-colors ml-1"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Portal Body (Sidebar flush to Left Edge + Spacious Content) */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar Navigation (0px margin from Left Edge) */}
        <aside className="hidden lg:block w-[280px] shrink-0 border-r border-border bg-surface min-h-[calc(100vh-88px)]">
          <div className="sticky top-28 p-3.5 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* User Profile Card Summary */}
            <div className="p-3 mb-2.5 rounded bg-surface-alt/80 border border-border text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  {role === 'patient' ? 'Patient Card' : role === 'doctor' ? 'Practitioner' : 'Administrator'}
                </span>
                <Badge variant="success" size="sm">
                  Active
                </Badge>
              </div>
              <p className="font-semibold text-foreground mt-1 text-sm truncate">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {role === 'patient' ? `ID: ${patient.patientId} | ${patient.bloodGroup}` : user?.email}
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-0.5" aria-label="Sidebar">
              {currentNav.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : item.highlight
                        ? 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-alt'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-surface border-r border-border p-4 shadow-xl flex flex-col animate-slide-in-left">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <AarogyamLogo size="xs" />
                  <span className="font-bold text-sm text-foreground">Aarogyam</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-3 flex-1 overflow-y-auto space-y-1">
                {currentNav.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-surface-alt'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-danger hover:bg-danger-muted rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Page Content (Spacious & Responsive) */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
