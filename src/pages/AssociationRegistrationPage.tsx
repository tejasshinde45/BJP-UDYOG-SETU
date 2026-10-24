import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useDemoData } from '../hooks/useDemoData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Building2,
  CheckCircle2,
  Copy,
  Check,
  Send,
  ShieldCheck,
  Users,
  Handshake,
  Award,
  Phone,
} from 'lucide-react';

export const AssociationRegistrationPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { addAssociation } = useDemoData();

  const [associationName, setAssociationName] = useState('');
  const [associationType, setAssociationType] = useState('MIDC Manufacturers Association (MIDC उत्पादक संघटना)');
  const [industrySector, setIndustrySector] = useState('');
  const [district, setDistrict] = useState('पुणे');
  const [operatingRegion, setOperatingRegion] = useState('');

  const [representativeName, setRepresentativeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipCount, setMembershipCount] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const associationTypes = [
    'MIDC Manufacturers Association (MIDC उत्पादक संघटना)',
    'District Chamber of Commerce (जिल्हा व्यापारी व औद्योगिक चेंबर)',
    'Sectoral Industry Guild (विशिष्ट उद्योग क्षेत्र महासंघ)',
    'MSME Cooperative Federation (लघुउद्योग सहकारी महासंघ)',
    'Export Promotion Cluster (निर्यात प्रोत्साहन क्लस्टर संघटना)',
    'Other Industry Association (इतर औद्योगिक संघटना)',
  ];

  const maharashtraDistricts = [
    'पुणे',
    'छत्रपती संभाजीनगर',
    'नागपूर',
    'नाशिक',
    'ठाणे',
    'मुंबई व उपनगर',
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!associationName.trim()) newErrors.associationName = t.common.requiredField;
    if (!industrySector.trim()) newErrors.industrySector = t.common.requiredField;
    if (!operatingRegion.trim()) newErrors.operatingRegion = t.common.requiredField;
    if (!representativeName.trim()) newErrors.representativeName = t.common.requiredField;
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
    if (!description.trim()) {
      newErrors.description = t.common.requiredField;
    }
    if (!consentAcknowledged) {
      newErrors.consent = language === 'mr' ? 'कृपया अटी मान्य असल्याचे निश्चित करा' : 'Please agree to terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const record = addAssociation({
        associationName,
        associationType,
        industrySector,
        district,
        operatingRegion,
        representativeName,
        designation,
        email,
        phone,
        membershipCount: membershipCount ? parseInt(membershipCount, 10) : undefined,
        description,
        website: website.trim() || undefined,
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

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 font-devanagari text-[#111827]">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: t.nav.associationReg }]} />

        {/* Heading Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#E35914] via-[#F59E0B] to-[#136938]" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-xs font-semibold text-[#E35914] font-label">
                <Building2 className="w-3.5 h-3.5" />
                <span>STATE INDUSTRY FEDERATION NETWORK</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                {language === 'mr' ? 'उद्योग संघटना व चेंबर अधिकृत नोंदणी' : 'Industry Association Affiliation Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {language === 'mr'
                  ? 'महाराष्ट्रातील एमआयडीसी उत्पादक संघटना, जिल्हा व्यापारी चेंबर्स आणि औद्योगिक महासंघांना उद्योग सेतूशी जोडून धोरणात्मक निर्णय प्रक्रियेत थेट सहभाग मिळवून देण्याचे अधिकृत दालन.'
                  : 'Register your industry association or trade chamber to establish official liaison with government policymakers, pre-budget dialogues, and collective issue resolution.'}
              </p>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-1.5 shrink-0 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#136938]">
                <Handshake className="w-4 h-4" />
                <span>संघटना संपर्क कक्ष</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <Phone className="w-3.5 h-3.5 text-[#E35914]" />
                <span>०२२-२२००४४५५ (विस्तार २२)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Master Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {submittedRef ? (
              <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#136938]" />

                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#136938] flex items-center justify-center mx-auto ring-4 ring-[#DCFCE7]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#111827]">
                    {language === 'mr' ? 'संघटना नोंदणी अर्ज अधिकृतपणे स्वीकारला!' : 'Registration Successfully Received!'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475569] max-w-lg mx-auto">
                    {language === 'mr'
                      ? 'आपल्या संघटनेची माहिती उद्योग सेतू समन्वय कक्षाकडे नोंदवली गेली आहे. पडताळणी प्रक्रियेसाठी खालील अधिकृत संदर्भ क्रमांक जतन करा:'
                      : 'Your association profile has been logged for institutional verification. Please note your official reference ID below:'}
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

                {/* Verification Next Steps Notice */}
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-xs text-[#475569] max-w-lg mx-auto space-y-1.5 text-left">
                  <div className="flex items-center gap-2 font-bold text-[#111827]">
                    <ShieldCheck className="w-4 h-4 text-[#136938]" />
                    <span>पुढील पडताळणी पायऱ्या:</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    उद्योग सेतू राज्य समन्वयकांकडून आपल्या संघटनेच्या नोंदणी प्रमाणपत्राची व अधिकृत पदाधिकाऱ्यांची प्राथमिक तपासणी केली जाईल. त्यानंतर आपल्या संघटनेस अधिकृत मान्यता प्राप्त होईल.
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                  <Button
                    variant="outlined"
                    size="md"
                    onClick={() => {
                      setSubmittedRef(null);
                      setAssociationName('');
                      setDescription('');
                    }}
                  >
                    {language === 'mr' ? 'दुसरी संघटना नोंदवा' : 'Register Another Association'}
                  </Button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Association Basic Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-label">
                      {language === 'mr' ? '१. संघटनेची मूलभूत माहिती' : '1. Association Information'}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Input
                          label={language === 'mr' ? 'औद्योगिक संघटनेचे अधिकृत नाव *' : 'Association Full Name *'}
                          value={associationName}
                          onChange={(e) => setAssociationName(e.target.value)}
                          placeholder={language === 'mr' ? 'उदा. भोसरी मॅन्युफॅक्चरर्स असोसिएशन (BIA)' : 'e.g. Bhosari Manufacturers Association'}
                          error={errors.associationName}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                            {language === 'mr' ? 'संघटनेचा प्रकार *' : 'Association Type *'}
                          </label>
                          <select
                            value={associationType}
                            onChange={(e) => setAssociationType(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E35914] focus:border-transparent transition"
                          >
                            {associationTypes.map((tItem) => (
                              <option key={tItem} value={tItem}>
                                {tItem}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Input
                            label={language === 'mr' ? 'प्रतिनिधित्व करत असलेले उद्योग क्षेत्र *' : 'Core Industry Sector *'}
                            value={industrySector}
                            onChange={(e) => setIndustrySector(e.target.value)}
                            placeholder={language === 'mr' ? 'उदा. ऑटो, फाउंड्री, केमिकल, एमएसएमई' : 'e.g. Automotive, Foundry'}
                            error={errors.industrySector}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                            {language === 'mr' ? 'कार्यक्षेत्राचा जिल्हा *' : 'Operating District *'}
                          </label>
                          <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E35914] focus:border-transparent transition"
                          >
                            {maharashtraDistricts.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Input
                            label={language === 'mr' ? 'कार्यक्षेत्र / MIDC पट्टा *' : 'Operating Region / MIDC Belt *'}
                            value={operatingRegion}
                            onChange={(e) => setOperatingRegion(e.target.value)}
                            placeholder={language === 'mr' ? 'उदा. पिंपरी-चिंचवड आणि भोसरी MIDC' : 'e.g. Bhosari & Chakan Belt'}
                            error={errors.operatingRegion}
                          />
                        </div>
                      </div>

                      <div>
                        <Input
                          label={language === 'mr' ? 'अंदाजे सभासद घटक / उद्योगांची संख्या (ऐच्छिक)' : 'Approx Member Enterprises Count (Optional)'}
                          type="number"
                          value={membershipCount}
                          onChange={(e) => setMembershipCount(e.target.value)}
                          placeholder="उदा. 850"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Office Bearer Details */}
                  <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-label">
                      {language === 'mr' ? '२. मुख्य पदाधिकारी / प्रतिनिधी तपशील' : '2. Key Office Bearer / Delegate'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Input
                          label={language === 'mr' ? 'पदाधिकाऱ्याचे पूर्ण नाव *' : 'Representative Name *'}
                          value={representativeName}
                          onChange={(e) => setRepresentativeName(e.target.value)}
                          placeholder={language === 'mr' ? 'उदा. श्री. अतुल गाडगीळ' : 'e.g. Atul Gadgil'}
                          error={errors.representativeName}
                        />
                      </div>

                      <div>
                        <Input
                          label={language === 'mr' ? 'संघटना पदनाम (उदा. अध्यक्ष, सचिव) *' : 'Designation *'}
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder={language === 'mr' ? 'उदा. अध्यक्ष / मानद सचिव' : 'e.g. President'}
                          error={errors.designation}
                        />
                      </div>

                      <div>
                        <Input
                          label={language === 'mr' ? 'अधिकृत ईमेल *' : 'Official Email *'}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="president@bia-pune.org"
                          error={errors.email}
                        />
                      </div>

                      <div>
                        <Input
                          label={language === 'mr' ? 'मोबाईल क्रमांक *' : 'Contact Phone (10 digits) *'}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9822055667"
                          error={errors.phone}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profile & Description */}
                  <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-label">
                      {language === 'mr' ? '३. संघटनेचा संक्षिप्त परिचय व उद्दिष्टे' : '3. Overview & Objectives'}
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                        {language === 'mr' ? 'संक्षिप्त माहिती व कार्यक्षेत्र वर्णन *' : 'Brief Description *'}
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={language === 'mr' ? 'उदा. पुणे जिल्ह्यातील आघाडीची औद्योगिक संघटना, ज्यामध्ये ८५० हून अधिक लघु व मध्यम उत्पादन घटक सक्रिय सभासद आहेत...' : 'Overview of the association and key member segments...'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E35914] focus:border-transparent transition resize-y font-devanagari"
                      />
                      {errors.description && (
                        <p className="text-xs text-red-600 mt-1">{errors.description}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        label={language === 'mr' ? 'संघटना संकेतस्थळ / वेबसाईट (ऐच्छिक)' : 'Website URL (Optional)'}
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://bia-pune.org"
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
                            ? 'मी याद्वारे प्रमाणित करतो की वरील माहिती सत्य असून आमच्या संघटनेच्या कार्यकारी मंडळाच्या मान्यतेने उद्योग सेतूशी संलग्नतेचा अर्ज सादर करत आहोत.'
                            : 'I confirm that this registration is submitted with executive committee authorization.'}
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
                      icon={<Send className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      {isSubmitting
                        ? t.common.loading
                        : language === 'mr'
                        ? 'संघटना नोंदणी अर्ज सबमिट करा'
                        : 'Submit Association Registration'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Benefits of Affiliation */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <Award className="w-5 h-5 text-[#E35914]" />
                <h3 className="font-bold text-sm text-[#111827]">
                  {language === 'mr' ? 'उद्योग सेतू संलग्नतेचे प्रमुख फायदे' : 'Benefits of Affiliation'}
                </h3>
              </div>

              <div className="space-y-3.5 text-xs text-[#475569]">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FFF7ED] text-[#E35914] font-bold flex items-center justify-center shrink-0 font-label">
                    १
                  </span>
                  <div>
                    <span className="font-semibold text-[#111827] block">थेट शासन व नेतृत्व संवाद</span>
                    <span>राज्य पातळीवरील उद्योग मंत्री व मुख्य समन्वयकांसोबत नियमित धोरणात्मक सल्लामसलत.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FFF7ED] text-[#E35914] font-bold flex items-center justify-center shrink-0 font-label">
                    २
                  </span>
                  <div>
                    <span className="font-semibold text-[#111827] block">सामूहिक अडचणींचे जलद निवारण</span>
                    <span>MIDC अंतर्गत पायाभूत सुविधा, वीज सवलत व रस्त्यांच्या सामूहिक समस्यांना प्राधान्य.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FFF7ED] text-[#E35914] font-bold flex items-center justify-center shrink-0 font-label">
                    ३
                  </span>
                  <div>
                    <span className="font-semibold text-[#111827] block">स्थानिक कार्यक्रमांचे सह-आयोजन</span>
                    <span>आपल्या औद्योगिक पट्ट्यात 'उद्योग संवाद' व 'नीती मंथन' परिसंवादांचे संयुक्त आयोजन.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prominent Affiliated Bodies */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <Users className="w-5 h-5 text-[#136938]" />
                <h3 className="font-bold text-sm text-[#111827]">
                  {language === 'mr' ? 'प्रमुख संलग्न औद्योगिक संस्था' : 'Key Affiliated Associations'}
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-bold text-[#111827]">भोसरी मॅन्युफॅक्चरर्स असोसिएशन (BIA)</div>
                  <div className="text-[#64748B] text-[11px] mt-0.5">८५०+ सक्रिय एमएसएमई उत्पादक सदस्य | पुणे</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-bold text-[#111827]">ठाणे स्मॉल स्केल इंडस्ट्रीज असोसिएशन (TSSIA)</div>
                  <div className="text-[#64748B] text-[11px] mt-0.5">१,२००+ उत्पादन घटक | ठाणे व नवी मुंबई</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-bold text-[#111827]">विदर्भ चेंबर ऑफ कॉमर्स अँड इंडस्ट्री (VCCI)</div>
                  <div className="text-[#64748B] text-[11px] mt-0.5">६५०+ घटक | नागपूर, वर्धा व अमरावती</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
