import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useDemoData } from '../hooks/useDemoData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { MeetingRequestStatus } from '../types';
import {
  Users,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  Building,
  Clock,
  Phone,
  Search,
  ClipboardList,
  XCircle,
  Send,
  FileSearch,
  Stamp,
  CalendarClock,
  CalendarCheck2,
} from 'lucide-react';

type LeaderPresentation = { name: string; title: string; focus: string };

const leaderTranslations: Record<string, Partial<Record<'en' | 'hi', LeaderPresentation>>> = {
  '/images/leadership/devendra-fadnavis.jpg': {
    en: {
      name: 'Hon. Devendra Fadnavis',
      title: 'Deputy Chief Minister, Government of Maharashtra',
      focus: 'Industrial infrastructure, energy costs, and foreign direct investment (FDI)',
    },
    hi: {
      name: 'माननीय देवेंद्र फडणवीस',
      title: 'उपमुख्यमंत्री, महाराष्ट्र सरकार',
      focus: 'औद्योगिक अवसंरचना, ऊर्जा लागत और प्रत्यक्ष विदेशी निवेश (FDI)',
    },
  },
  '/images/leadership/narendra-modi.jpg': {
    en: {
      name: 'Hon. Narendra Modi',
      title: 'Prime Minister, Government of India',
      focus: 'National industrial policy, Aatmanirbhar Bharat, and the $5 trillion economy',
    },
    hi: {
      name: 'माननीय नरेंद्र मोदी',
      title: 'प्रधानमंत्री, भारत सरकार',
      focus: 'राष्ट्रीय औद्योगिक नीति, आत्मनिर्भर भारत और 5 ट्रिलियन अर्थव्यवस्था',
    },
  },
  '/images/leadership/ravindra-chavan.jpg': {
    en: {
      name: 'Hon. Ravindra Chavan',
      title: 'Cabinet Minister, Government of Maharashtra',
      focus: 'Cluster development, MSME empowerment, and local industry coordination',
    },
    hi: {
      name: 'माननीय रवींद्र चव्हाण',
      title: 'कैबिनेट मंत्री, महाराष्ट्र सरकार',
      focus: 'क्लस्टर विकास, MSME सशक्तिकरण और स्थानीय उद्योग समन्वय',
    },
  },
};

const meetingRequestCopy = {
  mr: {
    preferredLeaderLabel: '१. कोणत्या नेत्यांची भेट घेऊ इच्छिता? (प्राधान्याचे नेते) *',
    delegationSectionTitle: '२. शिष्टमंडळ / उद्योगाची माहिती',
    preferredFormatLabel: 'पसंतीचे भेटीचे स्वरूप',
    meetingFormats: [
      { key: 'mumbai_delegation', label: 'मुंबई / मंत्रालय शिष्टमंडळ' },
      { key: 'regional_conclave', label: 'विभागीय बैठकीत भेट' },
      { key: 'virtual_video', label: 'व्हिडिओ परिषद (VC)' },
    ],
    reviewTimeline: 'सचिवालयाकडून आढावा: ३–५ दिवस',
    coordinationDeskLabel: 'समन्वय कक्ष',
    coordinationPhone: '०२२-२२००४४५५',
    guidelinesTitle: 'शिष्टमंडळासाठी मार्गदर्शक सूचना',
    guidelines: [
      { title: 'प्रतिनिधींची संख्या', description: 'शिष्टमंडळात ३ ते ५ अधिकृत पदाधिकारी किंवा उद्योजकांचा समावेश असावा.' },
      { title: 'धोरणात्मक विषय', description: 'विषय वैयक्तिक नसून संपूर्ण क्लस्टर, MIDC क्षेत्र किंवा उद्योग समूहाशी संबंधित असावा.' },
      { title: 'लेखी निवेदन (मेमोरँडम)', description: 'बैठकीत मांडावयाच्या निवेदनाचा मसुदा सोबत आणावा.' },
    ],
    liaisonTitle: 'नेतृत्व संपर्क सचिवालय',
    liaisonDescription: 'उद्योग सेतूच्या राज्य समन्वय कक्षाकडे प्राप्त होणाऱ्या सर्व अर्जांचे वर्गीकरण करून योग्य समन्वय व वेळ निश्चितीसाठी संबंधित सचिवालयाकडे पाठवले जाते.',
    officePhone: '०२२-२२००४४५५ (कार्यालयीन वेळ)',
    officeHours: 'सोमवार ते शुक्रवार, सकाळी १०:०० ते सायंकाळी ५:३०',
    districtLabel: 'जिल्हा निवडा *',
  },
  hi: {
    preferredLeaderLabel: '१. आप किस नेता से मिलना चाहते हैं? (पसंदीदा नेता) *',
    delegationSectionTitle: '२. प्रतिनिधिमंडल / उद्यम की जानकारी',
    preferredFormatLabel: 'पसंदीदा बैठक का प्रारूप',
    meetingFormats: [
      { key: 'mumbai_delegation', label: 'मुंबई / मंत्रालय प्रतिनिधिमंडल' },
      { key: 'regional_conclave', label: 'क्षेत्रीय बैठक' },
      { key: 'virtual_video', label: 'वीडियो कॉन्फ़्रेंस (VC)' },
    ],
    reviewTimeline: 'सचिवालय द्वारा समीक्षा: ३–५ दिन',
    coordinationDeskLabel: 'समन्वय कक्ष',
    coordinationPhone: '022-22004455',
    guidelinesTitle: 'प्रतिनिधिमंडल के लिए दिशा-निर्देश',
    guidelines: [
      { title: 'प्रतिनिधियों की संख्या', description: 'प्रतिनिधिमंडल में ३ से ५ अधिकृत पदाधिकारी या उद्यमी शामिल हों।' },
      { title: 'नीतिगत विषय', description: 'विषय व्यक्तिगत न होकर पूरे क्लस्टर, MIDC क्षेत्र या औद्योगिक समूह से संबंधित हो।' },
      { title: 'लिखित ज्ञापन', description: 'बैठक में प्रस्तुत किए जाने वाले ज्ञापन का मसौदा साथ लाएँ।' },
    ],
    liaisonTitle: 'नेतृत्व संपर्क सचिवालय',
    liaisonDescription: 'उद्योग सेतु के राज्य समन्वय कक्ष में प्राप्त सभी आवेदनों का वर्गीकरण करके उचित समन्वय और समय निर्धारण के लिए संबंधित सचिवालय को भेजा जाता है।',
    officePhone: '022-22004455 (कार्यालय समय)',
    officeHours: 'सोमवार से शुक्रवार, सुबह 10:00 से शाम 5:30 बजे तक',
    districtLabel: 'जिला चुनें *',
  },
  en: {
    preferredLeaderLabel: '1. Preferred Leader for Meeting *',
    delegationSectionTitle: '2. Delegation / Enterprise Information',
    preferredFormatLabel: 'Preferred Meeting Format',
    meetingFormats: [
      { key: 'mumbai_delegation', label: 'Mumbai / Mantralaya Delegation' },
      { key: 'regional_conclave', label: 'Regional Meeting' },
      { key: 'virtual_video', label: 'Video Conference (VC)' },
    ],
    reviewTimeline: 'Secretariat review: 3–5 days',
    coordinationDeskLabel: 'Coordination desk',
    coordinationPhone: '022-22004455',
    guidelinesTitle: 'Delegation Guidelines',
    guidelines: [
      { title: 'Delegation size', description: 'Include 3–5 authorized office-bearers or entrepreneurs in the delegation.' },
      { title: 'Policy matters', description: 'The matter should relate to an industry cluster, MIDC area, or industry group rather than an individual concern.' },
      { title: 'Written memorandum', description: 'Bring a draft of the memorandum to be presented at the meeting.' },
    ],
    liaisonTitle: 'Leadership Liaison Secretariat',
    liaisonDescription: 'Requests received by the Udyog Setu state coordination desk are reviewed and routed to the relevant leadership office for scheduling.',
    officePhone: '022-22004455 (Office hours)',
    officeHours: 'Monday to Friday, 10:00 AM–5:30 PM',
    districtLabel: 'Select district *',
  },
};

export const MeetingRequestPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { addMeetingRequest, meetingRequests } = useDemoData();
  const [searchParams] = useSearchParams();
  const requestedLeaderId = searchParams.get('leader');
  const copy = meetingRequestCopy[language];

  const MAX_PURPOSE_CHARS = 500;

  const [businessName, setBusinessName] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [industrySector, setIndustrySector] = useState('');
  const [district, setDistrict] = useState('Pune');

  const [meetingPurpose, setMeetingPurpose] = useState('');
  const [preferredFormat, setPreferredFormat] = useState<'mumbai_delegation' | 'regional_conclave' | 'virtual_video'>('mumbai_delegation');
  const [supportingContext, setSupportingContext] = useState('');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pageMode, setPageMode] = useState<'submit' | 'track'>('submit');
  const [trackingRef, setTrackingRef] = useState('');
  const [searchedTrackingRef, setSearchedTrackingRef] = useState<string | null>(null);

  const trackedRequest = searchedTrackingRef
    ? meetingRequests.find(
        (request) => request.referenceId.toUpperCase() === searchedTrackingRef.toUpperCase()
      )
    : undefined;

  const handleTrackingSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trackingRef.trim()) return;
    setSearchedTrackingRef(trackingRef.trim());
  };

  const showTrackingRequest = (referenceId: string) => {
    setTrackingRef(referenceId);
    setSearchedTrackingRef(referenceId);
  };

  const trackingStages = [
    {
      title: language === 'mr' ? 'विनंती प्राप्त' : 'Request submitted',
      description: language === 'mr' ? 'संदर्भ क्रमांक तयार झाला' : 'Your reference number was created.',
    },
    {
      title: language === 'mr' ? 'सचिवालय पुनरावलोकन' : 'Initial review',
      description: language === 'mr' ? 'समन्वय कक्ष अर्ज तपासत आहे' : 'The coordination desk is reviewing the request.',
    },
    {
      title: language === 'mr' ? 'निर्णय' : 'Decision',
      description:
        trackedRequest?.status === 'Approved'
          ? language === 'mr' ? 'विनंती मंजूर झाली आहे.' : 'The request has been approved.'
          : trackedRequest?.status === 'Declined'
          ? language === 'mr' ? 'विनंती नाकारली आहे.' : 'The request was declined.'
          : language === 'mr' ? 'पुनरावलोकनानंतर निर्णय येथे दिसेल.' : 'The decision will appear here after review.',
    },
    {
      title: language === 'mr' ? 'वेळापत्रक समन्वय' : 'Scheduling',
      description: language === 'mr' ? 'भेटीची वेळ निश्चित केली जात आहे' : 'The coordination team is arranging the meeting details.',
    },
    {
      title: language === 'mr' ? 'भेट निश्चित' : 'Meeting scheduled',
      description: language === 'mr' ? 'भेटीचे वेळापत्रक निश्चित झाले' : 'The meeting date and details are confirmed.',
    },
  ];

  const statusStageIndex: Record<MeetingRequestStatus, number> = {
    'Pending Review': 0,
    'Under Review': 1,
    Approved: 3,
    Declined: 2,
    Scheduled: 4,
  };

  const trackingStageIcons = [Send, FileSearch, Stamp, CalendarClock, CalendarCheck2];

  const leadersList = [
    {
      key: 'devendra-fadnavis',
      id: 'Hon. Devendra Fadnavis (मा. देवेंद्र फडणवीस)',
      name: 'मा. देवेंद्र फडणवीस',
      title: 'उपमुख्यमंत्री, महाराष्ट्र शासन',
      image: '/images/leadership/devendra-fadnavis.jpg',
      focus: 'औद्योगिक पायाभूत सुविधा, ऊर्जा दर, थेट परकीय गुंतवणूक (FDI)',
    },
    {
      key: 'narendra-modi',
      id: 'Hon. Narendra Modi (मा. नरेंद्र मोदी)',
      name: 'मा. नरेंद्र मोदी',
      title: 'पंतप्रधान, भारत सरकार',
      image: '/images/leadership/narendra-modi.jpg',
      focus: 'राष्ट्रीय उद्योग धोरण, आत्मनिर्भर भारत, ५ ट्रिलियन अर्थव्यवस्था',
    },
    {
      key: 'ravindra-chavan',
      id: 'Hon. Ravindra Chavan (मा. रवींद्र चव्हाण)',
      name: 'मा. रवींद्र चव्हाण',
      title: 'कॅबिनेट मंत्री, महाराष्ट्र शासन',
      image: '/images/leadership/ravindra-chavan.jpg',
      focus: 'क्लस्टर विकास, एमएसएमई सक्षमीकरण, स्थानिक उद्योग समन्वय',
    },
  ];

  const localizedLeaders = leadersList.map((leader) =>
    language === 'mr'
      ? leader
      : { ...leader, ...(leaderTranslations[leader.image]?.[language] ?? {}) }
  );

  const [preferredLeader, setPreferredLeader] = useState(() =>
    leadersList.find((leader) => leader.key === requestedLeaderId)?.id ?? leadersList[0].id
  );

  const maharashtraDistricts = [
    'पुणे',
    'छत्रपती संभाजीनगर',
    'नागपूर',
    'नाशिक',
    'ठाणे',
    'मुंबई शहर व उपनगर',
    'पालघर',
    'रायगड',
    'सोलापूर',
    'कोल्हापूर',
    'सातारा',
    'अमरावती',
    'सांगली',
    'रत्नागिरी',
    'जळगाव',
    'नांदेड',
    'चंद्रपूर',
  ];

  const districtIds = [
    'Pune',
    'Chhatrapati Sambhajinagar',
    'Nagpur',
    'Nashik',
    'Thane',
    'Mumbai City & Suburbs',
    'Palghar',
    'Raigad',
    'Solapur',
    'Kolhapur',
    'Satara',
    'Amravati',
    'Sangli',
    'Ratnagiri',
    'Jalgaon',
    'Nanded',
    'Chandrapur',
  ];

  const districtTranslations = {
    mr: maharashtraDistricts,
    hi: [
      'पुणे',
      'छत्रपति संभाजीनगर',
      'नागपुर',
      'नासिक',
      'ठाणे',
      'मुंबई शहर और उपनगर',
      'पालघर',
      'रायगढ़',
      'सोलापुर',
      'कोल्हापुर',
      'सातारा',
      'अमरावती',
      'सांगली',
      'रत्नागिरी',
      'जलगांव',
      'नांदेड',
      'चंद्रपुर',
    ],
    en: districtIds,
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!businessName.trim()) newErrors.businessName = t.common.requiredField;
    if (!representativeName.trim()) newErrors.representativeName = t.common.requiredField;
    if (!designation.trim()) newErrors.designation = t.common.requiredField;
    if (!industrySector.trim()) newErrors.industrySector = t.common.requiredField;
    if (!meetingPurpose.trim()) {
      newErrors.meetingPurpose = t.common.requiredField;
    } else if (meetingPurpose.trim().length < 20) {
      newErrors.meetingPurpose = language === 'mr' ? 'किमान २० अक्षरांचे स्पष्ट प्रयोजन आवश्यक आहे' : 'Minimum 20 characters required';
    }
    if (!consentAcknowledged) {
      newErrors.consent = language === 'mr' ? 'कृपया अटी मान्य असल्याचे निश्चित करा' : 'Please accept the declaration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const record = addMeetingRequest({
        businessName,
        representativeName,
        designation,
        industrySector,
        district,
        email: '',
        phone: '',
        preferredLeader,
        meetingPurpose,
        preferredFormat,
        supportingContext: supportingContext.trim() || undefined,
      });

      setIsSubmitting(false);
      setSubmittedRef(record.referenceId);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 600);
  };

  const copyRefId = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const remainingChars = MAX_PURPOSE_CHARS - meetingPurpose.length;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 font-devanagari text-[#111827]">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: t.nav.meetingRequest }]} />

        {/* Heading Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#E35914] via-[#F59E0B] to-[#136938]" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FEF3C7] text-xs font-semibold text-[#B45309] font-label">
                <Users className="w-3.5 h-3.5" />
                <span>WISHLIST / LEADERSHIP MEETING REQUEST PORTAL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                {language === 'mr' ? 'नेतृत्व भेटीची विनंती' : language === 'hi' ? 'नेतृत्व भेंट का अनुरोध' : 'Leadership Meeting Request'}
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {language === 'mr'
                  ? 'महाराष्ट्रातील प्रमुख औद्योगिक संघटना, क्लस्टर्स आणि उद्योग प्रतिनिधींना राज्य व राष्ट्रीय नेतृत्वाशी धोरणात्मक सल्लामसलतीसाठी भेट विनंती नोंदवण्याचे अधिकृत व्यासपीठ.'
                  : 'A formal gateway for industry delegations, manufacturing associations, and enterprise leaders to request policy consultation meetings with designated executive leadership.'}
              </p>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-1.5 shrink-0 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E35914]">
                <Calendar className="w-4 h-4" />
                <span>{copy.reviewTimeline}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <Phone className="w-3.5 h-3.5 text-[#136938]" />
                <span>{copy.coordinationDeskLabel}: {copy.coordinationPhone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative grid w-full max-w-[430px] grid-cols-2 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xs" role="group" aria-label="Meeting request options">
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-1.5 left-1.5 w-[calc(50%_-_0.375rem)] rounded-lg border shadow-sm transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${pageMode === 'track' ? 'translate-x-full border-[#E35914] bg-[#FFF7ED]' : 'translate-x-0 border-transparent bg-[#E35914]'}`}
          />
          <button
            type="button"
            aria-pressed={pageMode === 'submit'}
            onClick={() => setPageMode('submit')}
            className={`relative z-10 inline-flex min-w-0 w-full items-center justify-center gap-2 rounded-lg px-2.5 sm:px-4 py-2.5 text-xs font-bold transition-colors duration-300 ${pageMode === 'submit' ? 'text-white' : 'text-[#475569] hover:text-[#111827]'}`}
          >
            <ClipboardList className="h-4 w-4" />
            {language === 'mr' ? 'भेट विनंती सादर करा' : 'Submit a request'}
          </button>
          <button
            type="button"
            aria-pressed={pageMode === 'track'}
            onClick={() => setPageMode('track')}
            className={`relative z-10 inline-flex min-w-0 w-full items-center justify-center gap-2 rounded-lg px-2.5 sm:px-4 py-2.5 text-xs font-bold transition-colors duration-300 ${pageMode === 'track' ? 'text-[#C2410C]' : 'text-[#475569] hover:text-[#111827]'}`}
          >
            <Search className="h-4 w-4" />
            {language === 'mr' ? 'विनंतीची स्थिती' : 'Track a request'}
          </button>
        </div>

        {/* 2-Column Master Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Column (9 Cols) */}
          <div
            key={pageMode}
            className={`lg:col-span-9 space-y-6 ${pageMode === 'track' ? 'meeting-request-panel-enter-right' : 'meeting-request-panel-enter-left'}`}
          >
            {pageMode === 'track' ? (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                      {language === 'mr' ? 'आपल्या भेट विनंतीची स्थिती' : 'Track your meeting request'}
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      {language === 'mr'
                        ? 'संदर्भ क्रमांक टाका किंवा खालील नमुना विनंत्यांपैकी एक निवडा.'
                        : 'Enter a reference number or choose one of the sample requests below.'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleTrackingSubmit} className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1">
                    <Input
                      label={language === 'mr' ? 'संदर्भ क्रमांक' : 'Request reference number'}
                      value={trackingRef}
                      onChange={(event) => setTrackingRef(event.target.value)}
                      placeholder="MH-LMR-2025-5001"
                      icon={<Search className="h-4 w-4" />}
                      helperText={language === 'mr' ? 'उदा. MH-LMR-2025-5001' : 'Example: MH-LMR-2025-5001'}
                    />
                  </div>
                  <Button type="submit" variant="primary" size="md" className="sm:mt-[22px] sm:self-start" icon={<Search className="h-4 w-4" />}>
                    {language === 'mr' ? 'स्थिती पहा' : 'View status'}
                  </Button>
                </form>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    {language === 'mr' ? 'नमुना विनंत्या' : 'Sample requests'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {meetingRequests.slice(0, 4).map((request) => (
                      <button
                        key={request.id}
                        type="button"
                        onClick={() => showTrackingRequest(request.referenceId)}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${searchedTrackingRef === request.referenceId ? 'border-[#136938] bg-[#F0FDF4]' : 'border-[#E2E8F0] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'}`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-bold text-[#111827]">{request.referenceId}</span>
                          <span className="block truncate text-[11px] text-[#64748B]">{request.businessName}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#475569] border border-[#E2E8F0]">
                          {request.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {searchedTrackingRef && !trackedRequest && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700" role="alert">
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>{language === 'mr' ? 'या संदर्भ क्रमांकासाठी नमुना विनंती सापडली नाही. कृपया क्रमांक तपासा.' : 'No sample request was found for that reference. Check the number and try again.'}</p>
                  </div>
                )}

                {trackedRequest && (
                  <div className="rounded-2xl border border-[#E2E8F0] overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC] p-4 sm:p-5 border-b border-[#E2E8F0]">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-[#64748B]">{language === 'mr' ? 'संदर्भ क्रमांक' : 'Reference number'}</p>
                        <p className="font-label font-extrabold text-[#E35914]">{trackedRequest.referenceId}</p>
                      </div>
                      <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${trackedRequest.status === 'Declined' ? 'bg-red-100 text-red-700' : trackedRequest.status === 'Scheduled' ? 'bg-green-100 text-green-800' : trackedRequest.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                        {trackedRequest.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 border-b border-[#E2E8F0] text-xs">
                      <div>
                        <p className="text-[#64748B]">{language === 'mr' ? 'संस्था' : 'Organization'}</p>
                        <p className="font-semibold text-[#111827]">{trackedRequest.businessName}</p>
                      </div>
                      <div>
                        <p className="text-[#64748B]">{language === 'mr' ? 'प्राधान्य नेतृत्व' : 'Preferred leader'}</p>
                        <p className="font-semibold text-[#111827]">{trackedRequest.preferredLeader}</p>
                      </div>
                      <div>
                        <p className="text-[#64748B]">{language === 'mr' ? 'जिल्हा' : 'District'}</p>
                        <p className="font-semibold text-[#111827]">{trackedRequest.district}</p>
                      </div>
                      <div>
                        <p className="text-[#64748B]">{language === 'mr' ? 'सादर तारीख' : 'Submitted'}</p>
                        <p className="font-semibold text-[#111827]">
                          {new Date(trackedRequest.submittedAt).toLocaleDateString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-[#F8FAFC] via-white to-[#F8FAFC] p-4 sm:p-6">
                      <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FED7AA] bg-[#FFF7ED] text-[#E35914] shadow-xs">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">
                              {language === 'mr' ? 'विनंतीची स्थिती' : 'MEETING REQUEST'}
                            </p>
                            <h3 className="text-sm font-extrabold text-[#111827]">
                              {language === 'mr' ? 'विनंतीचा प्रवास' : 'Request progress'}
                            </h3>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#475569] shadow-xs">
                          {language === 'mr'
                            ? `टप्पा ${statusStageIndex[trackedRequest.status] + 1} / ${trackingStages.length}`
                            : `Stage ${statusStageIndex[trackedRequest.status] + 1} of ${trackingStages.length}`}
                        </span>
                      </div>

                      <ol className="space-y-0">
                        {trackingStages.map((stage, index) => {
                          const currentStage = statusStageIndex[trackedRequest.status];
                          const isCurrent = index === currentStage;
                          const isActive = isCurrent && trackedRequest.status !== 'Scheduled';
                          const isComplete = index < currentStage || trackedRequest.status === 'Scheduled';
                          const isDeclinedStage = trackedRequest.status === 'Declined' && isCurrent;
                          const StageIcon = trackingStageIcons[index];
                          const detail = index === 0
                            ? `${stage.description} ${new Date(trackedRequest.submittedAt).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                            : index === 2 && trackedRequest.decisionNote
                            ? trackedRequest.decisionNote
                            : stage.description;

                          return (
                            <li key={stage.title} className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 pb-5 last:pb-0">
                              {index < trackingStages.length - 1 && (
                                <span className={`absolute left-[19px] top-10 bottom-0 -mb-5 w-0.5 ${isComplete ? 'bg-linear-to-b from-[#136938] to-[#86C79F]' : 'bg-[#DCE5EF]'}`} />
                              )}
                              <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${isDeclinedStage ? 'border-red-500 bg-white text-red-600 ring-4 ring-red-100' : isComplete ? 'border-[#136938] bg-[#136938] text-white shadow-[0_4px_10px_rgba(19,105,56,0.18)]' : isCurrent ? 'border-[#E35914] bg-white text-[#E35914] ring-4 ring-[#FFEDD5] shadow-[0_4px_12px_rgba(227,89,20,0.14)]' : 'border-[#CBD5E1] bg-white text-[#94A3B8]'}`}>
                                {isDeclinedStage ? <XCircle className="h-5 w-5" /> : <StageIcon className="h-5 w-5 stroke-[2.25]" />}
                              </span>
                              <div className={`-mt-1 min-w-0 rounded-xl border px-4 py-3 transition-all ${isDeclinedStage ? 'border-red-200 bg-red-50/80 shadow-xs' : isActive ? 'border-[#FED7AA] bg-linear-to-r from-[#FFF7ED] to-white shadow-[0_4px_16px_rgba(227,89,20,0.07)]' : isComplete ? 'border-transparent bg-white/70' : 'border-transparent bg-transparent'}`}>
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <p className={`pt-0.5 text-sm font-bold ${isDeclinedStage ? 'text-red-700' : isActive ? 'text-[#111827]' : isComplete ? 'text-[#136938]' : 'text-[#94A3B8]'}`}>
                                    {stage.title}{isDeclinedStage ? ` · ${language === 'mr' ? 'नाकारले' : 'Declined'}` : ''}
                                  </p>
                                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${isDeclinedStage ? 'bg-red-100 text-red-700' : isActive ? 'bg-[#FFEDD5] text-[#C2410C]' : isComplete ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                                    {isDeclinedStage
                                      ? language === 'mr' ? 'अंतिम स्थिती' : 'Closed'
                                      : isComplete
                                      ? language === 'mr' ? 'पूर्ण' : 'Completed'
                                      : isActive
                                      ? language === 'mr' ? 'सध्याचा टप्पा' : 'In progress'
                                      : language === 'mr' ? 'पुढील टप्पा' : 'Upcoming'}
                                  </span>
                                </div>
                                <p className={`mt-1.5 text-xs leading-relaxed ${isActive || isDeclinedStage ? 'text-[#475569]' : isComplete ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{detail}</p>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            ) : submittedRef ? (
              <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E35914]" />

                <div className="w-16 h-16 rounded-full bg-[#FFF7ED] text-[#E35914] flex items-center justify-center mx-auto ring-4 ring-[#FFEDD5]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#111827]">
                    {language === 'mr' ? 'भेट विनंती अधिकृतपणे नोंदवली गेली!' : 'Meeting Request Registered!'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475569] max-w-lg mx-auto">
                    {language === 'mr'
                      ? 'आपला नेतृत्व भेट विनंती अर्ज उद्योग सेतू समन्वय कक्षाकडे नोंदवला गेला आहे. पुढील पाठपुराव्यासाठी खालील संदर्भ क्रमांक जतन करा:'
                      : 'Your appointment request has been logged. Please save the official reference number below:'}
                  </p>
                </div>

                {/* Reference Badge */}
                <div className="bg-[#FFF7ED] border-2 border-dashed border-[#E35914] rounded-2xl p-6 max-w-md mx-auto space-y-2">
                  <span className="text-xs font-bold text-[#9A3412] uppercase font-label">
                    {t.common.referenceId}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#E35914] tracking-wider font-label">
                    {submittedRef}
                  </div>
                  <button
                    type="button"
                    onClick={copyRefId}
                    className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-[#E35914] hover:text-[#CC4D0E] font-medium pt-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#136938]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t.common.copied : t.common.copyId}</span>
                  </button>
                </div>

                {/* Official Protocol Notice */}
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-xs text-[#475569] max-w-lg mx-auto space-y-2 text-left">
                  <div className="flex items-center gap-2 font-bold text-[#111827]">
                    <ShieldCheck className="w-4 h-4 text-[#136938]" />
                    <span>{language === 'mr' ? 'सचिवालय समन्वय सूचना:' : 'Coordination Notice:'}</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    {language === 'mr'
                      ? 'भेट विनंती अर्जांची छाननी संबंधित सचिवालय व समन्वय समितीद्वारे वेळापत्रक आणि प्राधान्यक्रमानुसार केली जाते. अर्ज स्वीकारल्यास समन्वय कक्षाकडून थेट संपर्क साधून वेळ व ठिकाण कळवले जाईल.'
                      : 'Meeting requests are reviewed based on schedule availability and priority agenda. Once cleared, the coordination team will reach out directly with scheduling details.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setTrackingRef(submittedRef);
                      setSearchedTrackingRef(submittedRef);
                      setPageMode('track');
                    }}
                  >
                    {language === 'mr' ? 'या विनंतीचा मागोवा घ्या' : 'Track this request'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="md"
                    onClick={() => {
                      setSubmittedRef(null);
                      setMeetingPurpose('');
                      setSupportingContext('');
                    }}
                  >
                    {language === 'mr' ? 'दुसरी भेट विनंती नोंदवा' : 'Submit Another Request'}
                  </Button>
                </div>
              </div>
            ) : (
              /* Request Form */
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Preferred Leader Selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider font-label">
                      {copy.preferredLeaderLabel}
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {localizedLeaders.map((ldr) => (
                        <label
                          key={ldr.id}
                          className={`relative flex flex-col items-center gap-2 min-h-48 p-4 pt-5 rounded-xl border border-[#E2E8F0] cursor-pointer transition-all duration-200 ${
                            preferredLeader === ldr.id
                              ? 'bg-[#FFF7ED] shadow-[0_12px_24px_rgba(227,89,20,0.14)]'
                              : 'bg-white hover:bg-[#F8FAFC] hover:shadow-sm'
                          }`}
                        >
                          {preferredLeader === ldr.id && (
                            <span className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-full bg-[#E35914]" />
                          )}
                          <input
                            type="radio"
                            name="preferredLeader"
                            checked={preferredLeader === ldr.id}
                            onChange={() => setPreferredLeader(ldr.id)}
                            className="absolute top-3 left-3 shrink-0 accent-[#E35914] focus:ring-[#E35914]"
                          />
                          <img
                            src={ldr.image}
                            alt={ldr.name}
                            className="w-20 h-20 rounded-full object-cover object-top border border-[#CBD5E1] shrink-0"
                          />
                          <div className="flex w-full flex-1 min-w-0 flex-col items-center gap-1 text-center">
                            <div className="w-full text-center text-base font-bold text-[#111827]">{ldr.name}</div>
                            <div className="flex min-h-12 w-full items-center justify-center text-center text-[13px] leading-snug text-[#E35914] font-medium">{ldr.title}</div>
                            <div className="mt-0.5 w-full text-center text-[13px] leading-relaxed text-[#64748B]">{ldr.focus}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Representative Details */}
                  <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-label">
                      {copy.delegationSectionTitle}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Input
                          label={language === 'mr' ? 'उद्योग / संघटनेचे नाव *' : 'Business / Association Name *'}
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder={language === 'mr' ? 'उदा. मराठवाडा ऑटो क्लस्टर व सप्लायर्स असोसिएशन' : 'e.g. Marathwada Auto Cluster'}
                          error={errors.businessName}
                        />
                      </div>

                      <div>
                        <Input
                          label={language === 'mr' ? 'प्रतिनिधीचे नाव *' : 'Representative Name *'}
                          value={representativeName}
                          onChange={(e) => setRepresentativeName(e.target.value)}
                          placeholder={language === 'mr' ? 'उदा. श्री. रवींद्र जोशी' : 'e.g. Ravindra Joshi'}
                          error={errors.representativeName}
                        />
                      </div>

                      <div>
                        <Input
                          label={language === 'mr' ? 'पदनाम *' : 'Designation *'}
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder={language === 'mr' ? 'उदा. अध्यक्ष / उपाध्यक्ष' : 'e.g. President'}
                          error={errors.designation}
                        />
                      </div>

                      <div>
                        <Input
                          label={language === 'mr' ? 'उद्योग क्षेत्र *' : 'Industry Sector *'}
                          value={industrySector}
                          onChange={(e) => setIndustrySector(e.target.value)}
                          placeholder={language === 'mr' ? 'उदा. ऑटोमोटिव्ह आणि ई-मोबिलिटी' : 'e.g. Automotive & EV'}
                          error={errors.industrySector}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                          {copy.districtLabel}
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E35914] focus:border-transparent transition"
                        >
                          {districtIds.map((id, index) => (
                            <option key={id} value={id}>
                              {districtTranslations[language][index]}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Meeting Purpose */}
                  <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-label">
                      {language === 'mr' ? '३. भेटीचे नेमके प्रयोजन व स्वरूप' : '3. Meeting Objective & Preferred Mode'}
                    </h3>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#334155]">
                          {language === 'mr' ? 'भेटीचा मुख्य उद्देश व चर्चा विषय *' : 'Purpose of Meeting *'}
                        </label>
                        <span
                          className={`text-[11px] font-label ${
                            remainingChars < 50 ? 'text-red-500 font-bold' : 'text-[#64748B]'
                          }`}
                        >
                          {remainingChars} {language === 'mr' ? 'अक्षरे शिल्लक' : 'chars left'}
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        maxLength={MAX_PURPOSE_CHARS}
                        value={meetingPurpose}
                        onChange={(e) => setMeetingPurpose(e.target.value)}
                        placeholder={language === 'mr' ? 'उदा. नवीन ई-मोबिलिटी कंपोनंट क्लस्टरसाठी विशेष वीज सवलत पॅकेज आणि जमीन वाटपाच्या धोरणावर सविस्तर शिष्टमंडळ चर्चा...' : 'State the core issue, policy discussion agenda, or delegation memorandum summary...'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E35914] focus:border-transparent transition resize-y font-devanagari"
                      />
                      {errors.meetingPurpose && (
                        <p className="text-xs text-red-600 mt-1">{errors.meetingPurpose}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                        {copy.preferredFormatLabel}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        {copy.meetingFormats.map((m) => (
                          <label
                            key={m.key}
                            className={`p-2.5 rounded-xl border cursor-pointer text-center transition ${
                              preferredFormat === m.key
                                ? 'border-[#E35914] bg-[#FFF7ED] font-bold text-[#E35914]'
                                : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="preferredFormat"
                              checked={preferredFormat === m.key}
                              onChange={() => setPreferredFormat(m.key as any)}
                              className="hidden"
                            />
                            <span>{m.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                        {language === 'mr' ? 'अतिरिक्त माहिती / पार्श्वभूमी (ऐच्छिक)' : 'Supporting Context (Optional)'}
                      </label>
                      <textarea
                        rows={2}
                        value={supportingContext}
                        onChange={(e) => setSupportingContext(e.target.value)}
                        placeholder={language === 'mr' ? 'उदा. १५० पेक्षा अधिक एमएसएमई पुरवठादारांचे थेट प्रतिनिधित्व. ५०० कोटींची नवीन गुंतवणूक नियोजित.' : 'Optional notes regarding delegation size or investment potential.'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E35914] focus:border-transparent transition resize-y font-devanagari"
                      />
                    </div>

                    {/* Declaration */}
                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 text-xs text-[#334155] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentAcknowledged}
                          onChange={(e) => setConsentAcknowledged(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#E35914] focus:ring-[#E35914]"
                        />
                        <span className="leading-relaxed">
                          {language === 'mr'
                            ? 'मी याद्वारे खात्री देतो की हा भेट विनंती अर्ज औद्योगिक समूह / संघटनेच्या वतीने अधिकृतरीत्या सादर केला आहे. मला मान्य आहे की भेटीची वेळ नेत्यांच्या उपलब्धतेवर अवलंबून असेल.'
                            : 'I confirm that this appointment request is submitted on behalf of the industry delegation and is subject to official schedule availability.'}
                        </span>
                      </label>
                      {errors.consent && (
                        <p className="text-xs text-red-600 mt-1">{errors.consent}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      icon={<Users className="w-4 h-4" />}
                    >
                      {isSubmitting
                        ? t.common.loading
                        : language === 'mr'
                        ? 'भेट विनंती अर्ज सादर करा'
                        : 'Submit Meeting Request'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar Column (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Delegation Guidelines */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <ShieldCheck className="w-5 h-5 text-[#136938]" />
                <h3 className="font-bold text-sm text-[#111827]">{copy.guidelinesTitle}</h3>
              </div>

              <div className="space-y-3.5 text-xs text-[#475569]">
                {copy.guidelines.map((guideline, index) => (
                  <div key={guideline.title} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FFF7ED] text-[#E35914] font-bold flex items-center justify-center shrink-0 font-label">
                      {language === 'en' ? index + 1 : ['१', '२', '३'][index]}
                    </span>
                    <div>
                      <span className="font-semibold text-[#111827] block">{guideline.title}</span>
                      <span>{guideline.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership Liaison Secretariat */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <Building className="w-5 h-5 text-[#E35914]" />
                <h3 className="font-bold text-sm text-[#111827]">{copy.liaisonTitle}</h3>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">{copy.liaisonDescription}</p>

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#111827]">
                  <Phone className="w-4 h-4 text-[#136938]" />
                  <span>{copy.officePhone}</span>
                </div>
                <div className="flex items-center gap-2 text-[#111827]">
                  <Clock className="w-4 h-4 text-[#E35914]" />
                  <span>{copy.officeHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
