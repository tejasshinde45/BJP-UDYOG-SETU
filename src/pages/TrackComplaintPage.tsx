import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useDemoData } from '../hooks/useDemoData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import {
  Search,
  FileCheck2,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  Phone,
  Building2,
  MapPin,
  Layers,
  CalendarDays,
  UserRound,
  Wrench,
  MessageSquare,
} from 'lucide-react';
import type { GrievanceRecord, GrievanceStatus, TimelineEvent } from '../types';

const getTimelineEventIcon = (event: TimelineEvent) => {
  const title = event.title.toLowerCase();
  if (title.includes('पाठपुरावा') || title.includes('follow-up') || title.includes('follow up')) {
    return Send;
  }

  switch (event.status) {
    case 'Submitted':
      return FileText;
    case 'Under Review':
      return Search;
    case 'Assigned':
      return UserRound;
    case 'Action in Progress':
      return Wrench;
    case 'Awaiting Information':
      return MessageSquare;
    case 'Resolved':
      return CheckCircle2;
    default:
      return FileText;
  }
};

export const TrackComplaintPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { getGrievanceByRef, addFollowUp } = useDemoData();
  const [searchParams, setSearchParams] = useSearchParams();

  const refFromUrl = searchParams.get('ref') || '';
  const initialRef = refFromUrl || 'MH-US-2025-1001';

  const [searchRef, setSearchRef] = useState(initialRef);
  const [currentRecord, setCurrentRecord] = useState<GrievanceRecord | undefined>(() =>
    getGrievanceByRef(initialRef)
  );
  const [searched, setSearched] = useState(true);
  const [prevUrlRef, setPrevUrlRef] = useState(refFromUrl);

  // Follow-up form
  const [followUpComment, setFollowUpComment] = useState('');
  const [followUpAuthor, setFollowUpAuthor] = useState('');
  const [followUpError, setFollowUpError] = useState<string | null>(null);
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);
  const [followUpSuccess, setFollowUpSuccess] = useState<string | null>(null);



  // Sync state during render if URL query changes
  if (refFromUrl !== prevUrlRef) {
    setPrevUrlRef(refFromUrl);
    setSearchRef(refFromUrl);
    setCurrentRecord(getGrievanceByRef(refFromUrl));
    setSearched(true);
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchRef.trim()) return;

    const trimmed = searchRef.trim();
    setSearchParams({ ref: trimmed });
    const found = getGrievanceByRef(trimmed);
    setCurrentRecord(found);
    setSearched(true);
    setFollowUpError(null);
    setFollowUpSuccess(null);
  };



  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRecord) return;

    if (!followUpComment.trim()) {
      setFollowUpError(language === 'mr' ? 'कृपया पाठपुराव्याची टिप्पणी लिहा' : 'Please enter follow-up comments');
      return;
    }

    setIsSubmittingFollowUp(true);
    setFollowUpError(null);

    setTimeout(() => {
      const authorName = followUpAuthor.trim() || currentRecord.contactPerson || 'तक्रारदार उद्योजक';
      const result = addFollowUp(currentRecord.referenceId, followUpComment, authorName);

      setIsSubmittingFollowUp(false);
      if (result.success) {
        setFollowUpSuccess(
          language === 'mr'
            ? `पाठपुरावा #${result.followUpNumber} यशस्वीरीत्या नोंदवला गेला व समन्वयकांकडे पाठवला आहे.`
            : `Follow-up #${result.followUpNumber} submitted successfully to the coordinator.`
        );
        setFollowUpComment('');
        setFollowUpAuthor('');
        // Refresh local view
        const updated = getGrievanceByRef(currentRecord.referenceId);
        setCurrentRecord(updated);
      } else {
        setFollowUpError(result.error || 'पाठपुरावा नोंदवण्यात त्रुटी आली');
      }
    }, 500);
  };

  const renderStatusBadge = (status: GrievanceStatus) => {
    switch (status) {
      case 'Submitted':
        return <Badge variant="warning">{t.statuses.Submitted}</Badge>;
      case 'Under Review':
        return <Badge variant="info">{t.statuses['Under Review']}</Badge>;
      case 'Assigned':
        return <Badge variant="primary">{t.statuses.Assigned}</Badge>;
      case 'Action in Progress':
        return <Badge variant="warning">{t.statuses['Action in Progress']}</Badge>;
      case 'Awaiting Information':
        return <Badge variant="danger">{t.statuses['Awaiting Information']}</Badge>;
      case 'Resolved':
        return <Badge variant="success">{t.statuses.Resolved}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'उपलब्ध नाही';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(language === 'en' ? 'en-IN' : 'mr-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 font-devanagari text-[#111827]">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: t.nav.trackComplaint }]} />

        {/* Heading & Search Bar */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#E35914] via-[#F59E0B] to-[#136938]" />

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-xs font-semibold text-[#E35914] font-label">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'पारदर्शक तक्रार स्थिती व पाठपुरावा' : 'TRANSPARENT TRACKING DESK'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                {language === 'mr' ? 'औद्योगिक तक्रार पाठपुरावा प्रणाली' : 'Grievance Tracking & Redressal Timeline'}
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B]">
                {language === 'mr'
                  ? 'आपला अधिकृत संदर्भ क्रमांक प्रविष्ट करा आणि तक्रारीची वर्तमान स्थिती, नियुक्त समन्वय अधिकारी व प्रथम/द्वितीय पाठपुरावा इतिहास तपासा.'
                  : 'Enter your complaint reference to view live status, assigned coordinators, action timeline, and submit first or second follow-ups.'}
              </p>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  placeholder="उदा. MH-US-2025-1001"
                  className="w-full text-sm pl-11 pr-4 py-3 rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#E35914] focus:ring-2 focus:ring-[#E35914]/20 bg-white font-label font-semibold uppercase tracking-wider"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="whitespace-nowrap"
                icon={<Search className="w-4 h-4" />}
              >
                {language === 'mr' ? 'स्थिती तपासा' : 'Track Status'}
              </Button>
            </form>
          </div>
        </div>

        {/* 2-Column Master Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {searched && !currentRecord ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#E2E8F0] space-y-4">
                <AlertCircle className="w-12 h-12 text-[#E35914] mx-auto" />
                <h3 className="text-lg font-bold text-[#111827]">
                  {language === 'mr' ? 'तक्रार संदर्भ सापडला नाही' : 'Grievance Record Not Found'}
                </h3>
                <p className="text-xs text-[#64748B] max-w-md mx-auto">
                  {language === 'mr'
                    ? `प्रविष्ट केलेला क्रमांक "${searchRef}" प्रणालीमध्ये उपलब्ध नाही. कृपया संदर्भ क्रमांक तपासा किंवा उजवीकडील नमुना प्रकरणांपैकी एक निवडा.`
                    : `Reference "${searchRef}" was not found. Please verify the ID or select a sample case from the right sidebar.`}
                </p>
                <div className="pt-2">
                  <Link to="/grievance">
                    <Button variant="primary" size="md">
                      {language === 'mr' ? 'नवीन तक्रार नोंदवा' : 'File a New Grievance'}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : currentRecord ? (
              <div className="space-y-6">
                {/* Complaint Header Card */}
                <div className="relative overflow-hidden rounded-2xl border border-[#DCE5EF] bg-white shadow-sm">
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#E35914] via-[#F59E0B] to-[#136938]" />
                  <div className="space-y-6 p-5 sm:p-7">
                    <div className="flex flex-col gap-4 border-b border-[#E8EDF3] pb-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                            {language === 'mr' ? 'संदर्भ क्रमांक' : 'Reference number'}
                          </span>
                          <span className="rounded-md bg-[#FFF7ED] px-2.5 py-1 font-label text-sm font-extrabold tracking-wide text-[#D94F0B]">
                            {currentRecord.referenceId}
                          </span>
                        </div>
                        <h2 className="mt-3 break-words text-lg font-extrabold leading-snug text-[#111827] sm:text-xl">
                          {currentRecord.subject}
                        </h2>
                      </div>
                      <div className="shrink-0 sm:pt-1">
                        {renderStatusBadge(currentRecord.status)}
                      </div>
                    </div>

                    {/* Case details */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex min-w-0 gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#E35914]">
                          <Building2 className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{t.common.businessName}</p>
                          <p className="mt-1 break-words text-sm font-bold leading-snug text-[#111827]">{currentRecord.businessName}</p>
                          <p className="mt-1 break-words text-xs leading-relaxed text-[#64748B]">
                            {currentRecord.contactPerson} <span className="text-[#CBD5E1]">·</span> {currentRecord.designation}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                          <MapPin className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{t.common.district} / MIDC</p>
                          <p className="mt-1 break-words text-sm font-bold leading-snug text-[#111827]">{currentRecord.district}</p>
                          <p className="mt-1 break-words text-xs leading-relaxed text-[#64748B]">{currentRecord.locationArea}</p>
                        </div>
                      </div>

                      <div className="flex min-w-0 gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#E35914]">
                          <Layers className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{language === 'mr' ? 'प्रवर्ग व विभाग' : 'Category & department'}</p>
                          <p className="mt-1 break-words text-sm font-bold leading-snug text-[#E35914]">{t.categories[currentRecord.category]}</p>
                          <p className="mt-1 break-words text-xs leading-relaxed text-[#64748B]">{currentRecord.departmentCategory}</p>
                        </div>
                      </div>

                      <div className="flex min-w-0 gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#136938]">
                          <CalendarDays className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{language === 'mr' ? 'नोंदणी दिनांक' : 'Submitted on'}</p>
                          <p className="mt-1 break-words text-sm font-bold leading-snug text-[#111827]">{formatDate(currentRecord.submittedAt)}</p>
                          {currentRecord.assignedCoordinator && (
                            <p className="mt-1 flex items-start gap-1.5 break-words text-xs leading-relaxed text-[#136938]">
                              <UserRound className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              <span>{language === 'mr' ? 'नोडल अधिकारी:' : 'Coordinator:'} {currentRecord.assignedCoordinator}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#E35914]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#334155]">
                          {language === 'mr' ? 'समस्येचे सविस्तर वर्णन' : 'Grievance description'}
                        </h4>
                      </div>
                      <p className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3.5 text-sm leading-7 text-[#334155]">
                        {currentRecord.description}
                      </p>
                    </div>

                    {/* Attached file metadata */}
                    {currentRecord.attachments && currentRecord.attachments.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#334155]">
                          {language === 'mr' ? 'संलग्न कागदपत्रे' : 'Attached documents'}
                        </h4>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {currentRecord.attachments.map((att, i) => (
                            <div key={`${att.name}-${i}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#E35914]">
                                <FileText className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-semibold text-[#334155]">{att.name}</span>
                                <span className="mt-0.5 block text-[10px] text-[#94A3B8]">{(att.size / 1024).toFixed(0)} KB</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Timeline Section */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#E35914]" />
                      <span>{language === 'mr' ? 'तक्रार निवारण प्रगती व टाईमलाईन' : 'Resolution Progress Timeline'}</span>
                    </h3>
                    <span className="text-xs text-[#64748B]">
                      {currentRecord.timeline?.length || 0} टप्पे नोंदवले
                    </span>
                  </div>

                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E2E8F0]">
                    {currentRecord.timeline?.map((event, idx) => {
                      const TimelineIcon = getTimelineEventIcon(event);
                      return (
                      <div key={event.id || idx} className="relative group">
                        <div
                          className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                            event.status === 'Resolved'
                              ? 'bg-[#136938] text-white'
                              : event.title.includes('पाठपुरावा')
                              ? 'bg-[#F59E0B] text-white'
                              : 'bg-[#E35914] text-white'
                          }`}
                        >
                          <TimelineIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.25} />
                        </div>

                        <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-bold text-sm text-[#111827] font-devanagari">
                              {event.title}
                            </span>
                            <span className="text-[11px] text-[#64748B] font-label">
                              {formatDate(event.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-[#475569] leading-relaxed">
                            {event.description}
                          </p>
                          {event.actor && (
                            <span className="text-[11px] text-[#136938] font-medium block pt-0.5">
                              नोंदणीकर्ता: {event.actor}
                            </span>
                          )}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>

                {/* Follow-up Submission Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <div>
                      <h3 className="text-base font-bold text-[#111827]">
                        {language === 'mr' ? 'तक्रारीवर पाठपुरावा नोंदवा (Follow-up)' : 'Submit Official Follow-up'}
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        {language === 'mr'
                          ? 'जर आपल्या समस्येवर वेळेत कार्यवाही झाली नसेल तर प्रथम किंवा द्वितीय पाठपुरावा नोंदवा.'
                          : 'If response is delayed, submit a 1st or 2nd follow-up to escalate with the coordination desk.'}
                      </p>
                    </div>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFF7ED] text-[#E35914] font-label shrink-0">
                      नोंदवले: {currentRecord.followUps?.length || 0}/2
                    </span>
                  </div>

                  {followUpSuccess && (
                    <div className="text-xs text-[#136938] bg-[#F0FDF4] p-3 rounded-xl border border-[#DCFCE7] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{followUpSuccess}</span>
                    </div>
                  )}

                  {followUpError && (
                    <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{followUpError}</span>
                    </div>
                  )}

                  {(currentRecord.followUps?.length || 0) >= 2 ? (
                    <div className="text-xs text-[#92400E] bg-[#FFFBEB] p-4 rounded-xl border border-[#FEF3C7] space-y-1">
                      <span className="font-bold block">
                        कमाल पाठपुरावा मर्यादा (२/२) पूर्ण झाली आहे.
                      </span>
                      <span>
                        हे प्रकरण थेट जिल्हा उद्योग मित्र व वरिष्ठ प्रशासकीय समितीकडे वर्ग करण्यात आले आहे. तातडीच्या मदतीसाठी हेल्पलाइन १८००-२३३-०५५५ वर संपर्क साधा.
                      </span>
                    </div>
                  ) : currentRecord.status === 'Resolved' ? (
                    <div className="text-xs text-[#136938] bg-[#F0FDF4] p-4 rounded-xl border border-[#DCFCE7]">
                      ही तक्रार यशस्वीरीत्या निकाली (Resolved) काढली गेली असल्याने पुढील पाठपुराव्याची आवश्यकता नाही.
                    </div>
                  ) : (
                    <form onSubmit={handleFollowUpSubmit} className="space-y-4 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Input
                            label={language === 'mr' ? 'पाठपुरावा करणाऱ्या व्यक्तीचे नाव' : 'Author Name'}
                            value={followUpAuthor}
                            onChange={(e) => setFollowUpAuthor(e.target.value)}
                            placeholder={currentRecord.contactPerson || 'उदा. श्री. संजय कुलकर्णी'}
                          />
                        </div>
                        <div className="flex items-end">
                          <span className="text-xs text-[#64748B] mb-2">
                            {language === 'mr'
                              ? `सध्याचा पाठपुरावा: ${
                                  (currentRecord.followUps?.length || 0) === 0 ? 'प्रथम पाठपुरावा (1st)' : 'द्वितीय पाठपुरावा (2nd)'
                                }`
                              : `Active stage: ${
                                  (currentRecord.followUps?.length || 0) === 0 ? 'First Follow-up' : 'Second Follow-up'
                                }`}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                          {language === 'mr' ? 'पाठपुरावा टिप्पणी व अतिरिक्त माहिती *' : 'Follow-up Details *'}
                        </label>
                        <textarea
                          rows={3}
                          value={followUpComment}
                          onChange={(e) => setFollowUpComment(e.target.value)}
                          placeholder={language === 'mr' ? 'उदा. ५ दिवस उलटूनही प्रत्यक्ष पाहणी झालेली नाही, कृपया तातडीने कार्यवाही करावी...' : 'Enter your specific concern regarding the delay or update...'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E35914] focus:border-transparent transition resize-y font-devanagari"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          disabled={isSubmittingFollowUp}
                          icon={<Send className="w-4 h-4" />}
                          iconPosition="right"
                        >
                          {isSubmittingFollowUp
                            ? t.common.loading
                            : (currentRecord.followUps?.length || 0) === 0
                            ? 'प्रथम पाठपुरावा नोंदवा'
                            : 'द्वितीय पाठपुरावा नोंदवा'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar Column (4 Cols) - Eliminates empty spaces & provides valuable portal assistance */}
          <div className="lg:col-span-4 space-y-6">
            {/* Escalation Matrix Guide */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <ShieldCheck className="w-5 h-5 text-[#136938]" />
                <h3 className="font-bold text-sm text-[#111827]">
                  {language === 'mr' ? 'पाठपुरावा व निवारण नियमावली' : 'Escalation Guidelines'}
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#475569]">
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E35914] mt-1.5 shrink-0" />
                  <span>
                    <strong>प्रथम पाठपुरावा (1st Follow-up):</strong> तक्रार दाखल केल्यानंतर ४८ तासांत अधिकारी नियुक्त न झाल्यास अथवा संपर्क न आल्यास नोंदवता येतो.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] mt-1.5 shrink-0" />
                  <span>
                    <strong>द्वितीय पाठपुरावा (2nd Follow-up):</strong> प्रथम पाठपुराव्यानंतर ७ दिवसांत प्रत्यक्ष काम सुरू न झाल्यास थेट वरिष्ठ समन्वय समितीकडे वर्ग होतो.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#136938] mt-1.5 shrink-0" />
                  <span>
                    <strong>निकाली स्थिती (Resolved):</strong> संबंधित विभाग व तक्रारदार यांच्या सहमतीनंतरच तक्रार अधिकृतपणे निकाली जाहीर केली जाते.
                  </span>
                </div>
              </div>
            </div>

            {/* Helpdesk Toll-Free */}
            <div className="bg-linear-to-br from-[#111827] to-[#1E293B] text-white rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#F59E0B]">
                <Phone className="w-5 h-5" />
                <span className="font-bold text-sm">थेट सहाय्य कक्ष</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-label">
                १८००-२३३-०५५५
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                तक्रार ट्रॅक करण्यात अडचण येत असल्यास आमच्या जिल्हा समन्वय कक्षाशी थेट संपर्क साधा.
              </p>
              <div className="pt-2">
                <Link to="/grievance">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    नवीन तक्रार नोंदवा
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
