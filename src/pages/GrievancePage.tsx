import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useDemoData } from '../hooks/useDemoData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  FileCheck2,
  CheckCircle2,
  UploadCloud,
  Trash2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Phone,
  Clock,
  ShieldCheck,
  FileText,
  Building,
} from 'lucide-react';
import type { GrievanceCategory } from '../types';

export const GrievancePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { addGrievance } = useDemoData();

  // Wizard Step: 1 = Business, 2 = Grievance, 3 = Documents, 4 = Review & Submit
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [district, setDistrict] = useState('पुणे');
  const [locationArea, setLocationArea] = useState('');

  const [category, setCategory] = useState<GrievanceCategory>('midc_infrastructure');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [departmentCategory, setDepartmentCategory] = useState('MIDC स्थापत्य व पायाभूत कक्ष');
  const [incidentPeriod, setIncidentPeriod] = useState('');

  // File Attachments
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // Consent
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedGrievance, setSubmittedGrievance] = useState<{
    referenceId: string;
    businessName: string;
    subject: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Categories list
  const categoriesList: { key: GrievanceCategory; label: string }[] = [
    { key: 'midc_infrastructure', label: t.categories.midc_infrastructure },
    { key: 'roads_transport', label: t.categories.roads_transport },
    { key: 'electricity_utilities', label: t.categories.electricity_utilities },
    { key: 'permissions_approvals', label: t.categories.permissions_approvals },
    { key: 'industrial_services', label: t.categories.industrial_services },
    { key: 'other', label: t.categories.other },
  ];

  // Maharashtra Industrial Districts
  const districts = [
    'पुणे',
    'छत्रपती संभाजीनगर',
    'नागपूर',
    'नाशिक',
    'ठाणे',
    'नवी मुंबई / रायगड',
    'कोल्हापूर',
    'सोलापूर',
    'अमरावती',
    'सांगली',
    'सातारा',
    'रत्नागिरी',
    'सिंधुदुर्ग',
    'जळगाव',
    'धुळे',
    'नांदेड',
    'चंद्रपूर',
    'पालघर',
  ];

  // Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!businessName.trim()) newErrors.businessName = t.common.requiredField;
    if (!contactPerson.trim()) newErrors.contactPerson = t.common.requiredField;
    if (!designation.trim()) newErrors.designation = t.common.requiredField;
    if (!email.trim()) {
      newErrors.email = t.common.requiredField;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t.common.invalidEmail;
    }
    if (!phone.trim()) {
      newErrors.phone = t.common.requiredField;
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = t.common.invalidPhone;
    }
    if (!industryType.trim()) newErrors.industryType = t.common.requiredField;
    if (!locationArea.trim()) newErrors.locationArea = t.common.requiredField;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!subject.trim()) newErrors.subject = t.common.requiredField;
    if (!description.trim()) {
      newErrors.description = t.common.requiredField;
    } else if (description.trim().length < 20) {
      newErrors.description = language === 'mr' ? 'किमान २० अक्षरांचे सविस्तर वर्णन आवश्यक आहे' : 'Minimum 20 characters required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files) return;

    const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    const newFiles: { name: string; size: number }[] = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const f = e.target.files[i];
      const ext = f.name.split('.').pop()?.toLowerCase() || '';

      if (!allowedExtensions.includes(ext)) {
        setFileError(`अवैध फाईल प्रकार (.${ext}). केवळ PDF, Word, JPG, PNG किंवा ZIP फाईल्स अनुमत आहेत.`);
        return;
      }
      if (f.size > maxSizeBytes) {
        setFileError(`फाईल ${f.name} चा आकार १० एमबी पेक्षा जास्त आहे.`);
        return;
      }
      newFiles.push({ name: f.name, size: f.size });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAcknowledged) {
      setErrors({ consent: language === 'mr' ? 'कृपया वरील अटी मान्य असल्याचे निश्चित करा' : 'Please agree to the declaration' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newRec = addGrievance({
        businessName,
        contactPerson,
        designation,
        email,
        phone,
        industryType,
        district,
        locationArea,
        category,
        subject,
        description,
        departmentCategory,
        incidentPeriod: incidentPeriod || 'सद्यस्थिती (Current)',
        attachments: files,
      });

      setIsSubmitting(false);
      setSubmittedGrievance({
        referenceId: newRec.referenceId,
        businessName: newRec.businessName,
        subject: newRec.subject,
      });
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 600);
  };

  const copyRefId = () => {
    if (submittedGrievance) {
      navigator.clipboard.writeText(submittedGrievance.referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 font-devanagari text-[#111827]">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: t.nav.grievance }]} />

        {/* Hero Header Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#E35914] via-[#F59E0B] to-[#136938]" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-xs font-semibold text-[#E35914] font-label">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'गतिमान औद्योगिक समस्या निवारण व्यासपीठ' : 'FAST-TRACK ISSUE RESOLUTION DESK'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                {language === 'mr' ? 'औद्योगिक तक्रार व अडचण नोंदणी' : 'Industrial Grievance Redressal Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {language === 'mr'
                  ? 'एमआयडीसी पायाभूत सुविधा, रस्ते, वीज पुरवठा, औद्योगिक परवानग्या आणि प्रशासकीय अडचणींची थेट नोंद करा. नोंदणीनंतर आपल्याला अधिकृत संदर्भ क्रमांक प्राप्त होईल, ज्याद्वारे आपण २४/७ स्थिती तपासू शकाल.'
                  : 'Submit operational bottlenecks regarding MIDC infrastructure, utilities, statutory clearances, or transport. You will receive an official tracking reference immediately upon registration.'}
              </p>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-1.5 shrink-0 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#136938]">
                <Clock className="w-4 h-4" />
                <span>प्राथमिक प्रतिसाद: २४ ते ४८ तास</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <Phone className="w-3.5 h-3.5 text-[#E35914]" />
                <span>हेल्पलाइन: १८००-२३३-०५५५</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Master Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {submittedGrievance ? (
              /* Success Confirmation Card */
              <div className="bg-white rounded-2xl p-8 border border-[#DCFCE7] shadow-sm text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#136938]" />

                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#136938] flex items-center justify-center mx-auto ring-4 ring-[#DCFCE7]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#111827]">
                    {language === 'mr' ? 'तक्रार अधिकृतपणे दाखल झाली!' : 'Grievance Successfully Registered!'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475569] max-w-lg mx-auto">
                    {language === 'mr'
                      ? 'आपला तक्रार अर्ज उद्योग सेतू समन्वय कक्षाकडे यशस्वीरीत्या नोंदवला गेला आहे. भविष्यातील पाठपुराव्यासाठी खालील अधिकृत संदर्भ क्रमांक जतन करा:'
                      : 'Your complaint has been assigned an official reference number. Use this ID to track real-time resolution progress and post follow-ups:'}
                  </p>
                </div>

                {/* Reference Badge */}
                <div className="bg-[#FFF7ED] border-2 border-dashed border-[#E35914] rounded-2xl p-6 max-w-md mx-auto space-y-2">
                  <span className="text-xs font-bold text-[#9A3412] uppercase font-label">
                    {t.common.referenceId}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#E35914] tracking-wider font-label">
                    {submittedGrievance.referenceId}
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

                {/* Quick Details */}
                <div className="text-xs text-[#475569] bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] max-w-md mx-auto text-left space-y-2">
                  <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="font-semibold text-[#111827]">{t.common.businessName}:</span>
                    <span className="text-right text-[#334155]">{submittedGrievance.businessName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="font-semibold text-[#111827]">विषय:</span>
                    <span className="text-right text-[#334155] line-clamp-1">{submittedGrievance.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#111827]">{t.common.status}:</span>
                    <span className="text-[#136938] font-bold bg-[#F0FDF4] px-2 py-0.5 rounded text-[11px]">नोंदणीकृत (Registered)</span>
                  </div>
                </div>

                {/* Action steps notice */}
                <div className="text-xs text-[#1E3A8A] bg-[#EFF6FF] p-4 rounded-xl border border-[#BFDBFE] max-w-lg mx-auto flex items-start gap-3 text-left">
                  <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {language === 'mr'
                      ? 'आपल्या तक्रारीची प्रत संबंधित जिल्हा समन्वय अधिकारी व एमआयडीसी समन्वय डेस्ककडे पाठवण्यात आली आहे. पुढील २४ ते ४८ तासांत आपल्याशी संपर्क साधण्यात येईल.'
                      : 'A copy of your grievance has been forwarded to the District Liaison Officer and MIDC desk. You will be contacted within 24-48 hours.'}
                  </span>
                </div>

                {/* Next Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link to={`/track-complaint?ref=${submittedGrievance.referenceId}`}>
                    <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                      {language === 'mr' ? 'तक्रारीची सद्यस्थिती तपासा' : 'Track This Complaint'}
                    </Button>
                  </Link>
                  <Button
                    variant="outlined"
                    size="lg"
                    onClick={() => {
                      setSubmittedGrievance(null);
                      setCurrentStep(1);
                      setSubject('');
                      setDescription('');
                      setFiles([]);
                    }}
                  >
                    {language === 'mr' ? 'दुसरी तक्रार नोंदवा' : 'File Another Grievance'}
                  </Button>
                </div>
              </div>
            ) : (
              /* Multi-Step Wizard Form Card */
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
                {/* 4-Step Progress Indicator */}
                <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 py-4 sm:px-8">
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { num: 1, label: language === 'mr' ? '१. उद्योग तपशील' : '1. Enterprise' },
                      { num: 2, label: language === 'mr' ? '२. तक्रार स्वरूप' : '2. Grievance' },
                      { num: 3, label: language === 'mr' ? '३. कागदपत्रे' : '3. Documents' },
                      { num: 4, label: language === 'mr' ? '४. पडताळणी' : '4. Review' },
                    ].map((s) => {
                      const isActive = currentStep === s.num;
                      const isCompleted = currentStep > s.num;

                      return (
                        <div key={s.num} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition font-label ${
                              isActive
                                ? 'bg-[#E35914] text-white shadow-xs ring-4 ring-[#FFF7ED]'
                                : isCompleted
                                ? 'bg-[#136938] text-white'
                                : 'bg-[#E2E8F0] text-[#64748B]'
                            }`}
                          >
                            {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                          </div>
                          <span
                            className={`text-xs mt-1.5 font-medium font-devanagari ${
                              isActive ? 'text-[#E35914] font-bold' : 'text-[#64748B]'
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                  {/* STEP 1: Enterprise & Contact */}
                  {currentStep === 1 && (
                    <div className="space-y-5 animate-in fade-in">
                      <div className="border-b border-[#E2E8F0] pb-3">
                        <h2 className="text-lg font-bold text-[#111827]">
                          {language === 'mr' ? 'विभाग अ: उद्योजक व उद्योग घटकाचा तपशील' : 'Section A: Enterprise & Contact Details'}
                        </h2>
                        <p className="text-xs text-[#64748B]">
                          {language === 'mr'
                            ? 'आपल्या अधिकृत उद्योगाचे नाव, संपर्क अधिकारी आणि एमआयडीसी क्षेत्राची अचूक माहिती भरा.'
                            : 'Provide enterprise information, key contact person, and industrial area location.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Input
                            label={language === 'mr' ? 'उद्योग / आस्थापनेचे पूर्ण नाव *' : 'Enterprise / Company Name *'}
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder={language === 'mr' ? 'उदा. सह्याद्री इंजिनिअरिंग प्रायव्हेट लिमिटेड' : 'e.g. Sahyadri Engineering Pvt Ltd'}
                            error={errors.businessName}
                          />
                        </div>

                        <div>
                          <Input
                            label={language === 'mr' ? 'संपर्क व्यक्तीचे पूर्ण नाव *' : 'Contact Person Name *'}
                            value={contactPerson}
                            onChange={(e) => setContactPerson(e.target.value)}
                            placeholder={language === 'mr' ? 'उदा. श्री. संजय देशपांडे' : 'e.g. Sanjay Deshpande'}
                            error={errors.contactPerson}
                          />
                        </div>

                        <div>
                          <Input
                            label={language === 'mr' ? 'पदनाम *' : 'Designation *'}
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder={language === 'mr' ? 'उदा. व्यवस्थापकीय संचालक / पार्टनर' : 'e.g. Managing Director'}
                            error={errors.designation}
                          />
                        </div>

                        <div>
                          <Input
                            label={language === 'mr' ? 'ईमेल पत्ता *' : 'Official Email *'}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sanjay@sahyadri-engg.in"
                            error={errors.email}
                          />
                        </div>

                        <div>
                          <Input
                            label={language === 'mr' ? 'मोबाईल क्रमांक *' : 'Phone Number (10 digits) *'}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="9822012345"
                            error={errors.phone}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                            {language === 'mr' ? 'जिल्हा निवडा *' : 'Select District *'}
                          </label>
                          <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E35914] focus:border-transparent transition"
                          >
                            {districts.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Input
                            label={language === 'mr' ? 'उद्योग क्षेत्र (उदा. ऑटो, केमिकल, टेक्स्टाईल) *' : 'Industry Sector *'}
                            value={industryType}
                            onChange={(e) => setIndustryType(e.target.value)}
                            placeholder={language === 'mr' ? 'उदा. अचूक अभियांत्रिकी व ऑटो कंपोनंट्स' : 'e.g. Precision Engineering'}
                            error={errors.industryType}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <Input
                            label={language === 'mr' ? 'औद्योगिक वसाहत / MIDC पत्ता *' : 'Industrial Area / MIDC Location *'}
                            value={locationArea}
                            onChange={(e) => setLocationArea(e.target.value)}
                            placeholder={language === 'mr' ? 'उदा. भोसरी MIDC, ब्लॉक टी, प्लॉट क्र. ४५, पुणे' : 'e.g. Bhosari MIDC, Block T, Plot 45'}
                            error={errors.locationArea}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Grievance Details */}
                  {currentStep === 2 && (
                    <div className="space-y-5 animate-in fade-in">
                      <div className="border-b border-[#E2E8F0] pb-3">
                        <h2 className="text-lg font-bold text-[#111827]">
                          {language === 'mr' ? 'विभाग ब: तक्रारीचे स्वरूप व तपशील' : 'Section B: Grievance Specifics'}
                        </h2>
                        <p className="text-xs text-[#64748B]">
                          {language === 'mr'
                            ? 'आपल्या समस्येचा प्रकार, संबंधित विभाग आणि अडचणीचे सविस्तर वर्णन नोंदवा.'
                            : 'Select grievance category and provide comprehensive issue description.'}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                            {language === 'mr' ? 'तक्रारीचा मुख्य वर्ग निवडा *' : 'Grievance Category *'}
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {categoriesList.map((c) => (
                              <label
                                key={c.key}
                                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer text-xs transition ${
                                  category === c.key
                                    ? 'border-[#E35914] bg-[#FFF7ED] font-semibold text-[#111827] shadow-xs'
                                    : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="grievanceCategory"
                                  checked={category === c.key}
                                  onChange={() => setCategory(c.key)}
                                  className="mt-0.5 text-[#E35914] focus:ring-[#E35914]"
                                />
                                <span>{c.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Input
                            label={language === 'mr' ? 'तक्रारीचा मुख्य विषय *' : 'Subject of Grievance *'}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder={language === 'mr' ? 'उदा. भोसरी सेक्टर ७ मधील २२ केव्ही मुख्य फिडरचे वारंवार ट्रिपिंग' : 'e.g. 22kV Feeder frequent tripping'}
                            error={errors.subject}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                              {language === 'mr' ? 'संबंधित शासकीय / MIDC विभाग' : 'Relevant Department'}
                            </label>
                            <select
                              value={departmentCategory}
                              onChange={(e) => setDepartmentCategory(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E35914] focus:border-transparent transition"
                            >
                              <option value="MIDC स्थापत्य व रस्ते विभाग">MIDC स्थापत्य व रस्ते विभाग</option>
                              <option value="महावितरण (MSEDCL) औद्योगिक वीज कक्ष">महावितरण (MSEDCL) औद्योगिक वीज कक्ष</option>
                              <option value="महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)">महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)</option>
                              <option value="उद्योग संचालनालय (Directorate of Industries)">उद्योग संचालनालय (Directorate of Industries)</option>
                              <option value="औद्योगिक सुरक्षा व आरोग्य संचालनालय (DISH)">औद्योगिक सुरक्षा व आरोग्य संचालनालय (DISH)</option>
                              <option value="स्थानिक महानगरपालिका / नगरपरिषद">स्थानिक महानगरपालिका / नगरपरिषद</option>
                            </select>
                          </div>

                          <div>
                            <Input
                              label={language === 'mr' ? 'अडचण उद्भवल्याचा अंदाजे कालावधी' : 'Period / Date of Issue'}
                              value={incidentPeriod}
                              onChange={(e) => setIncidentPeriod(e.target.value)}
                              placeholder={language === 'mr' ? 'उदा. ऑक्टोबर २०२६ (मागील ३ आठवडे)' : 'e.g. Past 3 weeks'}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                            {language === 'mr' ? 'तक्रारीचे सविस्तर वर्णन *' : 'Detailed Description *'}
                          </label>
                          <textarea
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={language === 'mr' ? 'कृपया समस्येचे नेमके स्वरूप, त्यामुळे उत्पादनावर किंवा व्यवसायावर होणारा परिणाम आणि अपेक्षित उपाययोजना सविस्तर लिहा...' : 'Describe the exact issue, impact on manufacturing operations, and requested resolution...'}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E35914] focus:border-transparent transition resize-y font-devanagari"
                          />
                          {errors.description && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{errors.description}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Documents Upload */}
                  {currentStep === 3 && (
                    <div className="space-y-5 animate-in fade-in">
                      <div className="border-b border-[#E2E8F0] pb-3">
                        <h2 className="text-lg font-bold text-[#111827]">
                          {language === 'mr' ? 'विभाग क: पूरक कागदपत्रे व छायाचित्रे' : 'Section C: Supporting Documents'}
                        </h2>
                        <p className="text-xs text-[#64748B]">
                          {language === 'mr'
                            ? 'समस्येचे छायाचित्र, पत्रव्यवहार, वीज बिल, अर्ज पावती किंवा संघटनेचा ठराव जोडा (ऐच्छिक, कमाल १० एमबी).'
                            : 'Attach site photographs, correspondence, electricity bills, or receipts (Max 10MB per file).'}
                        </p>
                      </div>

                      <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#E35914] rounded-2xl p-6 sm:p-8 text-center transition bg-[#F8FAFC]">
                        <UploadCloud className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
                        <label className="cursor-pointer text-xs font-bold text-[#E35914] hover:text-[#C2410C] bg-[#FFF7ED] px-4 py-2 rounded-xl inline-block border border-[#FFEDD5]">
                          <span>{language === 'mr' ? 'कागदपत्रे निवडा (Choose Files)' : 'Choose Files'}</span>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                          />
                        </label>
                        <p className="text-[11px] text-[#64748B] mt-2">
                          {language === 'mr' ? 'अनुमत फॉरमॅट: PDF, Word, JPG, PNG, ZIP (कमाल १० MB)' : 'Supported: PDF, Word, JPG, PNG, ZIP (Max 10MB)'}
                        </p>
                      </div>

                      {fileError && (
                        <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{fileError}</span>
                        </div>
                      )}

                      {files.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-[#111827]">
                            {language === 'mr' ? 'संलग्न कागदपत्रे:' : 'Attached Files:'}
                          </h4>
                          <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl bg-white overflow-hidden">
                            {files.map((f, idx) => (
                              <div key={idx} className="p-3 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-4 h-4 text-[#E35914] shrink-0" />
                                  <span className="font-medium text-[#111827] truncate">{f.name}</span>
                                  <span className="text-[#64748B] text-[11px]">
                                    ({(f.size / 1024).toFixed(0)} KB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(idx)}
                                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                  title="काढून टाका"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 4: Review & Submit */}
                  {currentStep === 4 && (
                    <div className="space-y-5 animate-in fade-in">
                      <div className="border-b border-[#E2E8F0] pb-3">
                        <h2 className="text-lg font-bold text-[#111827]">
                          {language === 'mr' ? 'विभाग ड: तक्रारीचे पुनरावलोकन व घोषणापत्र' : 'Section D: Review & Official Declaration'}
                        </h2>
                        <p className="text-xs text-[#64748B]">
                          {language === 'mr'
                            ? 'अर्ज सादर करण्यापूर्वी सर्व माहितीची पडताळणी करा.'
                            : 'Verify your submitted details before final submission.'}
                        </p>
                      </div>

                      {/* Summary Table */}
                      <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[#E2E8F0]">
                          <div>
                            <span className="text-[#64748B] block">उद्योग नाव:</span>
                            <span className="font-bold text-[#111827]">{businessName}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">संपर्क व्यक्ती:</span>
                            <span className="font-bold text-[#111827]">{contactPerson} ({designation})</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">संपर्क माहिती:</span>
                            <span className="font-medium text-[#111827]">{email} | {phone}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">जिल्हा व स्थान:</span>
                            <span className="font-medium text-[#111827]">{district} - {locationArea}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="text-[#64748B] block">तक्रारीचा वर्ग:</span>
                            <span className="font-semibold text-[#E35914]">
                              {categoriesList.find((c) => c.key === category)?.label}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">मुख्य विषय:</span>
                            <span className="font-bold text-[#111827]">{subject}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">सविस्तर वर्णन:</span>
                            <p className="text-[#334155] whitespace-pre-wrap bg-white p-3 rounded-lg border border-[#E2E8F0] mt-1">
                              {description}
                            </p>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">संलग्न फाईल्स:</span>
                            <span className="font-medium text-[#111827]">
                              {files.length > 0 ? `${files.length} फाईल्स संलग्न` : 'कोणतीही फाईल जोडलेली नाही'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Declaration Checkbox */}
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
                              ? 'मी याद्वारे घोषित करतो की वर दिलेली सर्व माहिती सत्य व वस्तुस्थितीवर आधारित आहे. उद्योग सेतू समन्वय कक्षास माझ्या तक्रारीच्या निवारणासाठी संबंधित प्रशासकीय विभागांशी थेट संवाद साधण्याचे अधिकार मी देत आहे.'
                              : 'I declare that the information provided above is true and accurate. I authorize the BJP Udyog Setu cell to coordinate with relevant administrative departments for issue resolution.'}
                          </span>
                        </label>
                        {errors.consent && (
                          <p className="text-xs text-red-600 mt-1">{errors.consent}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                    {currentStep > 1 ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={handlePrev}
                        icon={<ArrowLeft className="w-4 h-4" />}
                      >
                        {language === 'mr' ? 'मागील पायरी' : 'Previous Step'}
                      </Button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={handleNext}
                        icon={<ArrowRight className="w-4 h-4" />}
                        iconPosition="right"
                      >
                        {language === 'mr' ? 'पुढील पायरी' : 'Next Step'}
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                        icon={<FileCheck2 className="w-4 h-4" />}
                      >
                        {isSubmitting
                          ? t.common.loading
                          : language === 'mr'
                          ? 'तक्रार दाखल करा (Submit Grievance)'
                          : 'Submit Grievance'}
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar Column (4 Cols) - Enhances the page & eliminates empty space! */}
          <div className="lg:col-span-4 space-y-6">
            {/* Resolution Process Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <ShieldCheck className="w-5 h-5 text-[#136938]" />
                <h3 className="font-bold text-sm text-[#111827]">
                  {language === 'mr' ? 'तक्रार निवारण कार्यपद्धती' : 'Resolution Procedure'}
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FFF7ED] text-[#E35914] font-bold flex items-center justify-center shrink-0 font-label">
                    १
                  </span>
                  <div>
                    <span className="font-semibold text-[#111827] block">ऑनलाईन नोंदणी व संदर्भ क्रमांक</span>
                    <span className="text-[#64748B]">फॉर्म सबमिट करताच युनिक ट्रॅकिंग आयडी त्वरित प्राप्त होतो.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FFF7ED] text-[#E35914] font-bold flex items-center justify-center shrink-0 font-label">
                    २
                  </span>
                  <div>
                    <span className="font-semibold text-[#111827] block">जिल्हा समन्वयक नियुक्ती</span>
                    <span className="text-[#64748B]">२४ ते ४८ तासांत संबंधित MIDC विभागाचा नोडल अधिकारी नियुक्त होतो.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FFF7ED] text-[#E35914] font-bold flex items-center justify-center shrink-0 font-label">
                    ३
                  </span>
                  <div>
                    <span className="font-semibold text-[#111827] block">विभागीय पाठपुरावा व पाहणी</span>
                    <span className="text-[#64748B]">महावितरण, एमपीसीबी किंवा एमआयडीसी अधिकाऱ्यांशी प्रत्यक्ष समन्वय.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#F0FDF4] text-[#136938] font-bold flex items-center justify-center shrink-0 font-label">
                    ४
                  </span>
                  <div>
                    <span className="font-semibold text-[#136938] block">अडचण निवारण व अहवाल</span>
                    <span className="text-[#64748B]">समस्या सुटल्यानंतर तक्रारदारास थेट स्थिती अद्यतन पाठवले जाते.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Liaison Officers Directory */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <Building className="w-5 h-5 text-[#E35914]" />
                <h3 className="font-bold text-sm text-[#111827]">
                  {language === 'mr' ? 'विभागीय समन्वय संपर्क' : 'Regional Liaison Desks'}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-bold text-[#111827]">पुणे व पश्चिम महाराष्ट्र कक्ष</div>
                  <div className="text-[#64748B] text-[11px] mt-0.5">भोसरी, चाकण, रांजणगाव, तळोजा MIDC क्लस्टर</div>
                  <div className="text-[#E35914] font-medium mt-1">pune@udyogsetu.in | ०२०-२५५०१०००</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-bold text-[#111827]">छत्रपती संभाजीनगर व मराठवाडा</div>
                  <div className="text-[#64748B] text-[11px] mt-0.5">वाळूज, शेंद्रा-बिडकीन, जालना औद्योगिक पट्टा</div>
                  <div className="text-[#E35914] font-medium mt-1">marathwada@udyogsetu.in</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-bold text-[#111827]">नागपूर व विदर्भ कक्ष</div>
                  <div className="text-[#64748B] text-[11px] mt-0.5">बुटीबोरी, मिहान, अमरावती टेक्सटाईल झोन</div>
                  <div className="text-[#E35914] font-medium mt-1">vidarbha@udyogsetu.in</div>
                </div>
              </div>
            </div>

            {/* Helpline Box */}
            <div className="bg-linear-to-br from-[#111827] to-[#1E293B] text-white rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#F59E0B]">
                <Phone className="w-5 h-5" />
                <span className="font-bold text-sm">उद्योग हेल्पलाइन</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-label">
                १८००-२३३-०५५५
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                सोमवार ते शनिवार, सकाळी ९:३० ते सायंकाळी ६:००. सर्व औद्योगिक अडचणींचे मार्गदर्शन उपलब्ध.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
