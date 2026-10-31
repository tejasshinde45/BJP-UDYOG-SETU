import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useDemoData } from '../hooks/useDemoData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/ui/Button';
import {
  BarChart3,
  FileCheck2,
  Users,
  Building2,
  Calendar,
  Search,
  CheckCircle2,
  X,
  Clock,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type {
  GrievanceRecord,
  GrievanceStatus,
  MeetingRequestRecord,
  MeetingRequestStatus,
  AssociationRecord,
  AssociationVerificationStatus,
} from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    grievances,
    updateGrievance,
    meetingRequests,
    updateMeetingRequest,
    associations,
    updateAssociation,
    eventRegistrations,
  } = useDemoData();

  // Active Tab
  type AdminTab = 'overview' | 'grievances' | 'meetings' | 'associations' | 'events';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Grievance management states
  const [grievanceSearch, setGrievanceSearch] = useState('');
  const [grievanceStatusFilter, setGrievanceStatusFilter] = useState<string>('all');
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);
  const [statusUpdateVal, setStatusUpdateVal] = useState<GrievanceStatus>('Under Review');
  const [assignCoordinatorVal, setAssignCoordinatorVal] = useState('');
  const [adminNoteVal, setAdminNoteVal] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Meeting request management states
  const [meetingStatusFilter, setMeetingStatusFilter] = useState<string>('all');
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRequestRecord | null>(null);
  const [meetingDecisionVal, setMeetingDecisionVal] = useState<MeetingRequestStatus>('Under Review');
  const [meetingNoteVal, setMeetingNoteVal] = useState('');

  // Association management states
  const [associationFilter, setAssociationFilter] = useState<string>('all');
  const [selectedAssociation, setSelectedAssociation] = useState<AssociationRecord | null>(null);
  const [associationStatusVal, setAssociationStatusVal] = useState<AssociationVerificationStatus>('Verified');
  const [associationNoteVal, setAssociationNoteVal] = useState('');

  // Derived metrics
  const totalGrievances = grievances.length;
  const resolvedGrievances = grievances.filter((g) => g.status === 'Resolved').length;
  const inProgressGrievances = grievances.filter(
    (g) => g.status === 'Action in Progress' || g.status === 'Assigned'
  ).length;
  const totalMeetings = meetingRequests.length;
  const totalAssociations = associations.length;
  const totalRegistrations = eventRegistrations.length;

  // Recharts Chart Data (derived from shared demo grievances)
  const categoryCounts = grievances.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = [
    { name: 'MIDC Infra', count: categoryCounts.midc_infrastructure || 0, color: '#E35914' },
    { name: 'Power/Utilities', count: categoryCounts.electricity_utilities || 0, color: '#F59E0B' },
    { name: 'Clearances', count: categoryCounts.permissions_approvals || 0, color: '#136938' },
    { name: 'Services & Roads', count: (categoryCounts.industrial_services || 0) + (categoryCounts.roads_transport || 0), color: '#3B82F6' },
  ];

  const districtCounts = grievances.reduce((acc, g) => {
    acc[g.district] = (acc[g.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const districtChartData = Object.entries(districtCounts).map(([district, count]) => ({
    district,
    count,
  }));

  // Filtered grievances
  const filteredGrievances = grievances.filter((g) => {
    const matchesSearch =
      g.referenceId.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
      g.businessName.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
      g.subject.toLowerCase().includes(grievanceSearch.toLowerCase()) ||
      g.district.toLowerCase().includes(grievanceSearch.toLowerCase());
    const matchesStatus =
      grievanceStatusFilter === 'all' || g.status === grievanceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered meetings
  const filteredMeetings = meetingRequests.filter((m) => {
    return meetingStatusFilter === 'all' || m.status === meetingStatusFilter;
  });

  // Filtered associations
  const filteredAssociations = associations.filter((a) => {
    return associationFilter === 'all' || a.status === associationFilter;
  });

  // Handlers
  const handleOpenGrievanceDetail = (g: GrievanceRecord) => {
    setSelectedGrievance(g);
    setStatusUpdateVal(g.status);
    setAssignCoordinatorVal(g.assignedCoordinator || '');
    setAdminNoteVal('');
    setActionFeedback(null);
  };

  const handleSaveGrievanceUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    const updates: Partial<GrievanceRecord> = {
      status: statusUpdateVal,
      assignedCoordinator: assignCoordinatorVal.trim() || undefined,
    };

    if (adminNoteVal.trim()) {
      updates.internalNotes = [
        ...(selectedGrievance.internalNotes || []),
        `[${new Date().toLocaleTimeString()}]: ${adminNoteVal.trim()}`,
      ];
    }

    updateGrievance(selectedGrievance.id, updates);
    setActionFeedback(language === 'mr' ? 'तक्रारीची स्थिती यशस्वीरीत्या अद्यतनित झाली!' : 'Grievance updated!');
    setTimeout(() => {
      setSelectedGrievance(null);
      setActionFeedback(null);
    }, 1000);
  };

  const handleSaveMeetingUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting) return;

    updateMeetingRequest(selectedMeeting.id, {
      status: meetingDecisionVal,
      decisionNote: meetingNoteVal.trim() || undefined,
    });

    setActionFeedback(language === 'mr' ? 'भेट विनंती स्थिती अद्यतनित झाली!' : 'Meeting status updated!');
    setTimeout(() => {
      setSelectedMeeting(null);
      setActionFeedback(null);
    }, 1000);
  };

  const handleSaveAssociationUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssociation) return;

    updateAssociation(selectedAssociation.id, {
      status: associationStatusVal,
      internalNote: associationNoteVal.trim() || undefined,
    });

    setActionFeedback(language === 'mr' ? 'संघटना स्थिती अद्यतनित झाली!' : 'Association status updated!');
    setTimeout(() => {
      setSelectedAssociation(null);
      setActionFeedback(null);
    }, 1000);
  };

  const renderStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; border: string }> = {
      Submitted: { bg: 'bg-[#FFF7ED]', text: 'text-[#E35914]', border: 'border-[#FFEDD5]' },
      'Under Review': { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#FEF3C7]' },
      Assigned: { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', border: 'border-[#DBEAFE]' },
      'Action in Progress': { bg: 'bg-[#F0FDF4]', text: 'text-[#136938]', border: 'border-[#DCFCE7]' },
      'Awaiting Information': { bg: 'bg-[#FEF2F2]', text: 'text-[#B91C1C]', border: 'border-[#FEE2E2]' },
      Resolved: { bg: 'bg-[#F0FDF4]', text: 'text-[#136938]', border: 'border-[#BBF7D0]' },
      'Pending Review': { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#FEF3C7]' },
      Approved: { bg: 'bg-[#F0FDF4]', text: 'text-[#136938]', border: 'border-[#DCFCE7]' },
      Declined: { bg: 'bg-[#FEF2F2]', text: 'text-[#B91C1C]', border: 'border-[#FEE2E2]' },
      Scheduled: { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', border: 'border-[#DBEAFE]' },
      'Pending Verification': { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#FEF3C7]' },
      Verified: { bg: 'bg-[#F0FDF4]', text: 'text-[#136938]', border: 'border-[#BBF7D0]' },
    };

    const s = config[status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
        {t.statuses[status] || status}
      </span>
    );
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 font-devanagari text-[#111827]">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumbs items={[{ label: t.nav.admin }]} />

        {/* Institutional Admin Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#E35914] via-[#F59E0B] to-[#136938]" />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-xs font-semibold text-[#136938] font-label">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>STATE INDUSTRIAL COORDINATION & CONTROL DESK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              {language === 'mr' ? 'उद्योग सेतू राज्य समन्वय व नियंत्रण कक्ष' : 'State Industrial Coordination & Redressal Center'}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              {language === 'mr'
                ? 'तक्रार निवारण, नेतृत्व भेट नियोजन, संघटना पडताळणी आणि कार्यक्रम नोंदी व्यवस्थापित करण्याचे मध्यवर्ती पोर्टल.'
                : 'Central operations portal for managing submissions, assigning coordinators, and monitoring resolution progress.'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-1.5 shadow-2xs flex flex-wrap gap-1 text-xs font-semibold font-devanagari">
          {[
            { id: 'overview', label: language === 'mr' ? 'डॅशबोर्ड आढावा' : 'Overview & Analytics', icon: BarChart3 },
            { id: 'grievances', label: `${t.nav.grievance} (${grievances.length})`, icon: FileCheck2 },
            { id: 'meetings', label: `${t.nav.meetingRequest} (${meetingRequests.length})`, icon: Users },
            { id: 'associations', label: `${language === 'mr' ? 'संघटना' : 'Associations'} (${associations.length})`, icon: Building2 },
            { id: 'events', label: `${language === 'mr' ? 'उपक्रम नोंदणी' : 'Event RSVPs'} (${eventRegistrations.length})`, icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-[#E35914] text-white shadow-xs font-bold'
                    : 'text-[#475569] hover:bg-[#F4F7FF] hover:text-[#111827]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Derived Key KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#E35914] shadow-2xs">
                <span className="text-xs text-[#64748B] font-devanagari">प्राप्त एकूण तक्रारी</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-1 font-label">
                  {totalGrievances}
                </div>
                <div className="text-[11px] text-[#E35914] mt-1 flex items-center gap-1 font-devanagari">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{inProgressGrievances} प्रक्रियेत / अधिकारी नियुक्त</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#136938] shadow-2xs">
                <span className="text-xs text-[#64748B] font-devanagari">यशस्वी निवारण झालेल्या</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#136938] mt-1 font-label">
                  {resolvedGrievances}
                </div>
                <div className="text-[11px] text-[#136938] mt-1 flex items-center gap-1 font-devanagari">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{totalGrievances > 0 ? Math.round((resolvedGrievances / totalGrievances) * 100) : 100}% निवारण दर</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#F59E0B] shadow-2xs">
                <span className="text-xs text-[#64748B] font-devanagari">नेतृत्व भेट विनंत्या</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-1 font-label">
                  {totalMeetings}
                </div>
                <div className="text-[11px] text-[#B45309] mt-1 flex items-center gap-1 font-devanagari">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{meetingRequests.filter((m) => m.status === 'Pending Review').length} पुनरावलोकन बाकी</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#1D4ED8] shadow-2xs">
                <span className="text-xs text-[#64748B] font-devanagari">संलग्न संघटना / RSVPs</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-1 font-label">
                  {totalAssociations + totalRegistrations}
                </div>
                <div className="text-[11px] text-[#1D4ED8] mt-1 flex items-center gap-1 font-devanagari">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{totalAssociations} संघटना + {totalRegistrations} उपस्थिती नोंदी</span>
                </div>
              </div>
            </div>

            {/* Recharts Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown Chart */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    {language === 'mr' ? 'तक्रारींचे प्रवर्गनिहाय वर्गीकरण' : 'Grievances by Category'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {language === 'mr' ? 'क्षेत्रनिहाय औद्योगिक तक्रारींचे वितरण' : 'Distribution across sectors'}
                  </p>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#E35914" radius={[6, 6, 0, 0]}>
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* District Distribution Chart */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    {language === 'mr' ? 'जिल्हानिहाय तक्रार संख्या' : 'District-wise Distribution'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {language === 'mr' ? 'महाराष्ट्र औद्योगिक क्लस्टर्स' : 'Active Maharashtra industrial hubs'}
                  </p>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#136938" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-[#111827]">
                  {language === 'mr' ? 'थेट चाचणी नेव्हिगेशन' : 'Direct Workflow Verification'}
                </h4>
                <p className="text-xs text-[#64748B]">
                  {language === 'mr'
                    ? 'सार्वजनिक फॉर्ममधून भरलेली कोणतीही नोंद या डॅशबोर्डमध्ये त्वरित दिसते.'
                    : 'Any form submission on the public portal synchronizes immediately into this admin.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link to="/grievance">
                  <Button variant="outlined" size="sm">
                    {t.nav.fileGrievance}
                  </Button>
                </Link>
                <Link to="/track-complaint">
                  <Button variant="outlined" size="sm">
                    {t.nav.trackComplaint}
                  </Button>
                </Link>
                <Link to="/meeting-request">
                  <Button variant="outlined" size="sm">
                    {t.nav.meetingRequest}
                  </Button>
                </Link>
                <Link to="/association-registration">
                  <Button variant="outlined" size="sm">
                    {t.nav.associationReg}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GRIEVANCES MANAGEMENT */}
        {activeTab === 'grievances' && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  {language === 'mr' ? 'तक्रार निवारण व्यवस्थापन' : 'Grievance Management Desk'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {language === 'mr'
                    ? 'संदर्भ, उद्योग नाव किंवा जिल्ह्यावरून शोधा; अधिकारी नियुक्त करा व स्थिती बदला.'
                    : 'Filter records, assign coordinators, and update resolution lifecycle.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={grievanceSearch}
                    onChange={(e) => setGrievanceSearch(e.target.value)}
                    placeholder="शोधा / Search..."
                    className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white w-48 font-devanagari"
                  />
                </div>

                <select
                  value={grievanceStatusFilter}
                  onChange={(e) => setGrievanceStatusFilter(e.target.value)}
                  className="text-xs py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white font-devanagari cursor-pointer"
                >
                  <option value="all">{t.common.all} स्थिती</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Action in Progress">Action in Progress</option>
                  <option value="Awaiting Information">Awaiting Information</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Grievances Table / Mobile Card View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#475569] font-label uppercase text-[11px] border-b border-[#E2E8F0]">
                    <th className="py-3 px-3">संदर्भ क्र. (Ref ID)</th>
                    <th className="py-3 px-3">{t.common.businessName}</th>
                    <th className="py-3 px-3">विषय व प्रवर्ग</th>
                    <th className="py-3 px-3">{t.common.district}</th>
                    <th className="py-3 px-3">{t.common.status}</th>
                    <th className="py-3 px-3">पाठपुरावा</th>
                    <th className="py-3 px-3 text-right">कृती (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredGrievances.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-[#64748B]">
                        {language === 'mr' ? 'कोणतीही तक्रार आढळली नाही' : 'No records found'}
                      </td>
                    </tr>
                  ) : (
                    filteredGrievances.map((g) => (
                      <tr key={g.id} className="hover:bg-[#F8FAFC] transition">
                        <td className="py-3 px-3 font-bold font-label text-[#E35914]">
                          {g.referenceId}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-[#111827] block">{g.businessName}</span>
                          <span className="text-[11px] text-[#64748B]">{g.contactPerson}</span>
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <span className="font-medium text-[#111827] truncate block">{g.subject}</span>
                          <span className="text-[11px] text-[#E35914] truncate block">{t.categories[g.category]}</span>
                        </td>
                        <td className="py-3 px-3 font-medium text-[#475569]">
                          {g.district}
                        </td>
                        <td className="py-3 px-3">
                          {renderStatusBadge(g.status)}
                        </td>
                        <td className="py-3 px-3">
                          {g.followUps.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E35914] bg-[#FFF7ED] px-2 py-0.5 rounded">
                              <MessageSquare className="w-3 h-3" />
                              {g.followUps.length} पाठपुरावा
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#94A3B8]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            variant="outlined"
                            size="sm"
                            onClick={() => handleOpenGrievanceDetail(g)}
                          >
                            {language === 'mr' ? 'व्यवस्थापित करा' : 'Manage'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MEETING REQUESTS MANAGEMENT */}
        {activeTab === 'meetings' && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  {language === 'mr' ? 'नेतृत्व भेट विनंती व्यवस्थापन' : 'Leadership Meeting Requests Desk'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {language === 'mr'
                    ? 'उद्योजकांच्या भेट विनंत्यांची छाननी, मंजुरी किंवा नकार नोंदवा.'
                    : 'Review meeting requests, set sample approval status, and attach decision notes.'}
                </p>
              </div>

              <select
                value={meetingStatusFilter}
                onChange={(e) => setMeetingStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white font-devanagari cursor-pointer"
              >
                <option value="all">{t.common.all} स्थिती</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#475569] font-label uppercase text-[11px] border-b border-[#E2E8F0]">
                    <th className="py-3 px-3">संदर्भ</th>
                    <th className="py-3 px-3">संस्था / प्रतिनिधी</th>
                    <th className="py-3 px-3">प्राधान्य नेतृत्व</th>
                    <th className="py-3 px-3">भेटीचा उद्देश</th>
                    <th className="py-3 px-3">स्थिती</th>
                    <th className="py-3 px-3 text-right">कृती</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredMeetings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[#64748B]">
                        {language === 'mr' ? 'कोणतीही विनंती आढळली नाही' : 'No records found'}
                      </td>
                    </tr>
                  ) : (
                    filteredMeetings.map((m) => (
                      <tr key={m.id} className="hover:bg-[#F8FAFC] transition">
                        <td className="py-3 px-3 font-bold font-label text-[#E35914]">
                          {m.referenceId}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-[#111827] block">{m.businessName}</span>
                          <span className="text-[11px] text-[#64748B]">
                            {m.representativeName} ({m.designation})
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-[#475569]">
                          {m.preferredLeader}
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <p className="truncate text-[#334155]">{m.meetingPurpose}</p>
                        </td>
                        <td className="py-3 px-3">
                          {renderStatusBadge(m.status)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            variant="outlined"
                            size="sm"
                            onClick={() => {
                              setSelectedMeeting(m);
                              setMeetingDecisionVal(m.status);
                              setMeetingNoteVal(m.decisionNote || '');
                              setActionFeedback(null);
                            }}
                          >
                            {language === 'mr' ? 'छाननी करा' : 'Review'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ASSOCIATIONS MANAGEMENT */}
        {activeTab === 'associations' && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  {language === 'mr' ? 'औद्योगिक संघटना नोंदणी व्यवस्थापन' : 'Association Registrations Desk'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {language === 'mr'
                    ? 'संघटनांची पडताळणी स्थिती बदला व अंतर्गत नोंद ठेवा.'
                    : 'Verify registered associations and record coordination notes.'}
                </p>
              </div>

              <select
                value={associationFilter}
                onChange={(e) => setAssociationFilter(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white font-devanagari cursor-pointer"
              >
                <option value="all">{t.common.all} स्थिती</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Under Review">Under Review</option>
                <option value="Verified">Verified</option>
                <option value="Declined">Declined</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#475569] font-label uppercase text-[11px] border-b border-[#E2E8F0]">
                    <th className="py-3 px-3">संदर्भ</th>
                    <th className="py-3 px-3">संघटना नाव व प्रकार</th>
                    <th className="py-3 px-3">जिल्हा / कार्यक्षेत्र</th>
                    <th className="py-3 px-3">प्रतिनिधी व संपर्क</th>
                    <th className="py-3 px-3">पडताळणी स्थिती</th>
                    <th className="py-3 px-3 text-right">कृती</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredAssociations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[#64748B]">
                        {language === 'mr' ? 'कोणतीही संघटना आढळली नाही' : 'No records found'}
                      </td>
                    </tr>
                  ) : (
                    filteredAssociations.map((a) => (
                      <tr key={a.id} className="hover:bg-[#F8FAFC] transition">
                        <td className="py-3 px-3 font-bold font-label text-[#136938]">
                          {a.referenceId}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-[#111827] block">{a.associationName}</span>
                          <span className="text-[11px] text-[#64748B]">{a.associationType}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-[#111827] block">{a.district}</span>
                          <span className="text-[11px] text-[#64748B]">{a.operatingRegion}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-[#111827] block">
                            {a.representativeName} ({a.designation})
                          </span>
                          <span className="text-[11px] text-[#64748B]">{a.phone}</span>
                        </td>
                        <td className="py-3 px-3">
                          {renderStatusBadge(a.status)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            variant="outlined"
                            size="sm"
                            onClick={() => {
                              setSelectedAssociation(a);
                              setAssociationStatusVal(a.status);
                              setAssociationNoteVal(a.internalNote || '');
                              setActionFeedback(null);
                            }}
                          >
                            {language === 'mr' ? 'पडताळणी' : 'Verify'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: EVENT REGISTRATIONS & MANAGEMENT */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h3 className="text-base font-bold text-[#111827]">
                {language === 'mr' ? 'कार्यक्रम व उपक्रम उपस्थिती नोंदी (RSVPs)' : 'Program RSVPs & Registrations'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {language === 'mr'
                  ? 'उद्योग संवाद, उद्योग दर्शन आणि नीती मंथन साठी वापरकर्त्यांनी भरलेल्या थेट उपस्थिती नोंदी:'
                  : 'Live participant registrations recorded through public event RSVP forms:'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[#475569] font-label uppercase text-[11px] border-b border-[#E2E8F0]">
                    <th className="py-3 px-3">नोंदणी संदर्भ</th>
                    <th className="py-3 px-3">कार्यक्रमाचे नाव</th>
                    <th className="py-3 px-3">प्रवर्ग</th>
                    <th className="py-3 px-3">सहभागी नाव व कंपनी</th>
                    <th className="py-3 px-3">जिल्हा</th>
                    <th className="py-3 px-3">संपर्क</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {eventRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[#64748B]">
                        {language === 'mr'
                          ? 'अद्याप कोणतीही उपस्थिती नोंदणी झालेली नाही. चाचणीसाठी उद्योग संवाद किंवा उद्योग दर्शन पानावरून नोंदणी करा.'
                          : 'No registrations submitted yet in this session. RSVP to any event to view it here.'}
                      </td>
                    </tr>
                  ) : (
                    eventRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-[#F8FAFC] transition">
                        <td className="py-3 px-3 font-bold font-label text-[#E35914]">
                          {reg.referenceId}
                        </td>
                        <td className="py-3 px-3 font-medium text-[#111827]">
                          {reg.eventTitle}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] font-bold text-[#136938] bg-[#F0FDF4] px-2 py-0.5 rounded font-devanagari">
                            {reg.eventType}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-[#111827] block">{reg.participantName}</span>
                          <span className="text-[11px] text-[#64748B]">{reg.businessName} ({reg.designation})</span>
                        </td>
                        <td className="py-3 px-3 text-[#475569]">
                          {reg.district}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-[#475569]">
                          {reg.email} • {reg.phone}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL 1: Grievance Detail & Management */}
        {selectedGrievance && (
          <div className="fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-xs flex items-center justify-center p-4 modal-scroll-lock" data-lenis-prevent>
            <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E2E8F0] shadow-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedGrievance(null)}
                className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#111827] rounded-lg cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSaveGrievanceUpdates} className="space-y-4">
                <div className="border-b border-[#E2E8F0] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-label text-[#E35914]">
                      {selectedGrievance.referenceId}
                    </span>
                    {renderStatusBadge(selectedGrievance.status)}
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mt-1">
                    {selectedGrievance.subject}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {selectedGrievance.businessName} • {selectedGrievance.district} ({selectedGrievance.locationArea})
                  </p>
                </div>

                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                  <span className="text-[#64748B] block font-bold uppercase text-[10px]">वर्णन:</span>
                  <p className="text-[#334155]">{selectedGrievance.description}</p>
                </div>

                {/* Follow-ups view */}
                {selectedGrievance.followUps.length > 0 && (
                  <div className="bg-[#FFF7ED] p-3.5 rounded-xl border border-[#FFEDD5] text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#9A3412]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>तक्रारदाराकडून आलेला पाठपुरावा (Follow-ups):</span>
                    </div>
                    {selectedGrievance.followUps.map((fu, i) => (
                      <div key={i} className="pl-3 border-l-2 border-[#E35914] text-[11px] text-[#475569]">
                        <span className="font-bold text-[#111827]">{fu.followUpNumber === 1 ? '१ला पाठपुरावा' : '२रा पाठपुरावा'}:</span>{' '}
                        "{fu.comment}" ({fu.author})
                      </div>
                    ))}
                  </div>
                )}

                {/* Admin Update Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1 font-label">
                      तक्रारीची स्थिती बदला (Update Status) *
                    </label>
                    <select
                      value={statusUpdateVal}
                      onChange={(e) => setStatusUpdateVal(e.target.value as GrievanceStatus)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white font-devanagari focus:outline-none focus:border-[#E35914]"
                    >
                      <option value="Submitted">Submitted (नोंदवले)</option>
                      <option value="Under Review">Under Review (तपासणी सुरू)</option>
                      <option value="Assigned">Assigned (अधिकारी नियुक्त)</option>
                      <option value="Action in Progress">Action in Progress (कारवाई सुरू)</option>
                      <option value="Awaiting Information">Awaiting Information (माहिती अपेक्षित)</option>
                      <option value="Resolved">Resolved (निवारण पूर्ण)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1 font-label">
                      नियुक्त अधिकारी / कक्ष (Assign Coordinator)
                    </label>
                    <input
                      type="text"
                      value={assignCoordinatorVal}
                      onChange={(e) => setAssignCoordinatorVal(e.target.value)}
                      placeholder="उदा. श्री. अनिरुद्ध जोशी (MIDC Desk)"
                      className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white font-devanagari focus:outline-none focus:border-[#E35914]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1 font-label">
                    अंतर्गत प्रशासकीय नोंद किंवा टाईमलाईन अपडेट (Internal Note)
                  </label>
                  <textarea
                    rows={2}
                    value={adminNoteVal}
                    onChange={(e) => setAdminNoteVal(e.target.value)}
                    placeholder="उदा. कार्यकारी अभियंत्यांना तातडीने पाहणीचे निर्देश दिले आहेत..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white font-devanagari focus:outline-none focus:border-[#E35914]"
                  />
                </div>

                {actionFeedback && (
                  <div className="text-xs text-[#136938] bg-[#F0FDF4] p-2.5 rounded border border-[#DCFCE7] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{actionFeedback}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <Link
                    to={`/track-complaint?ref=${selectedGrievance.referenceId}`}
                    target="_blank"
                    className="text-xs text-[#E35914] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>पब्लिक ट्रॅकिंग पेज उघडा</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedGrievance(null)}>
                      {t.common.cancel}
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      बदल जतन करा (Save Changes)
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Meeting Request Review */}
        {selectedMeeting && (
          <div className="fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-xs flex items-center justify-center p-4 modal-scroll-lock" data-lenis-prevent>
            <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E2E8F0] shadow-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedMeeting(null)}
                className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#111827] rounded-lg cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSaveMeetingUpdates} className="space-y-4">
                <div className="border-b border-[#E2E8F0] pb-3">
                  <span className="text-xs font-bold text-[#E35914] font-label">
                    {selectedMeeting.referenceId}
                  </span>
                  <h3 className="text-lg font-bold text-[#111827] mt-1">
                    {selectedMeeting.businessName}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {selectedMeeting.representativeName} ({selectedMeeting.designation}) • {selectedMeeting.preferredLeader}
                  </p>
                </div>

                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                  <span className="text-[#64748B] block font-bold uppercase text-[10px]">भेटीचा उद्देश:</span>
                  <p className="text-[#334155]">{selectedMeeting.meetingPurpose}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1 font-label">
                    भेट विनंती स्थिती (Meeting Status) *
                  </label>
                  <select
                    value={meetingDecisionVal}
                    onChange={(e) => setMeetingDecisionVal(e.target.value as MeetingRequestStatus)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white font-devanagari focus:outline-none focus:border-[#E35914]"
                  >
                    <option value="Pending Review">Pending Review (पुनरावलोकन बाकी)</option>
                    <option value="Under Review">Under Review (छाननी सुरू)</option>
                    <option value="Approved">Approved (मंजूर - बैठक नियोजित)</option>
                    <option value="Declined">Declined (अस्वीकृत)</option>
                    <option value="Scheduled">Scheduled (वेळ निश्चित)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1 font-label">
                    निर्णय किंवा अंतर्गत टिप्पणी (Decision Note)
                  </label>
                  <textarea
                    rows={2}
                    value={meetingNoteVal}
                    onChange={(e) => setMeetingNoteVal(e.target.value)}
                    placeholder="उदा. मुंबई येथील राज्यस्तरीय उद्योग मेळाव्यात शिष्टमंडळाला ५ मिनिटे वेळ देण्याचे प्रस्तावित..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white font-devanagari focus:outline-none focus:border-[#E35914]"
                  />
                </div>

                {actionFeedback && (
                  <div className="text-xs text-[#136938] bg-[#F0FDF4] p-2.5 rounded border border-[#DCFCE7] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{actionFeedback}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedMeeting(null)}>
                    {t.common.cancel}
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    स्थिती अद्यतनित करा
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: Association Verification */}
        {selectedAssociation && (
          <div className="fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-xs flex items-center justify-center p-4 modal-scroll-lock" data-lenis-prevent>
            <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E2E8F0] shadow-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedAssociation(null)}
                className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#111827] rounded-lg cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSaveAssociationUpdates} className="space-y-4">
                <div className="border-b border-[#E2E8F0] pb-3">
                  <span className="text-xs font-bold text-[#136938] font-label">
                    {selectedAssociation.referenceId}
                  </span>
                  <h3 className="text-lg font-bold text-[#111827] mt-1">
                    {selectedAssociation.associationName}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {selectedAssociation.associationType} • {selectedAssociation.district} ({selectedAssociation.operatingRegion})
                  </p>
                </div>

                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                  <span className="text-[#64748B] block font-bold uppercase text-[10px]">वर्णन:</span>
                  <p className="text-[#334155]">{selectedAssociation.description}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1 font-label">
                    पडताळणी स्थिती (Verification Status) *
                  </label>
                  <select
                    value={associationStatusVal}
                    onChange={(e) => setAssociationStatusVal(e.target.value as AssociationVerificationStatus)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white font-devanagari focus:outline-none focus:border-[#E35914]"
                  >
                    <option value="Pending Verification">Pending Verification (पडताळणी बाकी)</option>
                    <option value="Under Review">Under Review (कागदपत्रे तपासणी सुरू)</option>
                    <option value="Verified">Verified (संलग्न व पडताळलेले)</option>
                    <option value="Declined">Declined (नाकारलेले)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1 font-label">
                    समन्वय नोंद (Internal Note)
                  </label>
                  <textarea
                    rows={2}
                    value={associationNoteVal}
                    onChange={(e) => setAssociationNoteVal(e.target.value)}
                    placeholder="उदा. संघटना पदाधिकाऱ्यांशी प्राथमिक चर्चा पूर्ण झाली..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white font-devanagari focus:outline-none focus:border-[#E35914]"
                  />
                </div>

                {actionFeedback && (
                  <div className="text-xs text-[#136938] bg-[#F0FDF4] p-2.5 rounded border border-[#DCFCE7] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{actionFeedback}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedAssociation(null)}>
                    {t.common.cancel}
                  </Button>
                  <Button variant="green" size="sm" type="submit">
                    पडताळणी स्थिती जतन करा
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
