import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useDemoData } from '../hooks/useDemoData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  X,
  Search,
  MessageSquareShare,
  Info,
} from 'lucide-react';
import type { EventItem } from '../types';

export const UdyogSamvaadPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { events, addEventRegistration } = useDemoData();

  // Filter only samvaad events
  const samvaadEvents = events.filter((e) => e.category === 'samvaad');

  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    businessName: '',
    participantName: '',
    designation: '',
    sector: '',
    district: 'पुणे',
    email: '',
    phone: '',
    customQuestions: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Unique districts for filter
  const districts = Array.from(new Set(samvaadEvents.map((e) => e.district)));

  // Filtered list
  const filteredEvents = samvaadEvents.filter((item) => {
    const matchesSearch =
      item.titleMr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationMr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = districtFilter === 'all' || item.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.businessName.trim()) errors.businessName = t.common.requiredField;
    if (!formData.participantName.trim()) errors.participantName = t.common.requiredField;
    if (!formData.designation.trim()) errors.designation = t.common.requiredField;
    if (!formData.sector.trim()) errors.sector = t.common.requiredField;
    if (!formData.email.trim()) {
      errors.email = t.common.requiredField;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t.common.invalidEmail;
    }
    if (!formData.phone.trim()) {
      errors.phone = t.common.requiredField;
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      errors.phone = t.common.invalidPhone;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const regRecord = addEventRegistration({
        eventId: selectedEvent?.id,
        eventTitle: selectedEvent?.titleMr || 'उद्योग संवाद',
        eventType: 'samvaad',
        participantName: formData.participantName,
        businessName: formData.businessName,
        designation: formData.designation,
        sector: formData.sector,
        district: formData.district,
        email: formData.email,
        phone: formData.phone,
        customQuestionsOrNotes: formData.customQuestions,
      });

      setIsSubmitting(false);
      setSubmittedRef(regRecord.referenceId);
    }, 700);
  };

  const handleOpenRegister = (event: EventItem) => {
    setSelectedEvent(event);
    setIsRegisterModalOpen(true);
    setSubmittedRef(null);
    setFormErrors({});
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 font-devanagari text-[#111827]">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumbs items={[{ label: t.nav.samvaad }]} />

        {/* Header Hero Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E2E8F0] shadow-xs">
          <div className="max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-xs font-semibold text-[#E35914] font-label">
              <MessageSquareShare className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'थेट उद्योग संवाद' : language === 'hi' ? 'प्रत्यक्ष उद्योग संवाद' : 'DIRECT DIALOGUE'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              {language === 'mr' ? 'उद्योग संवाद मंच' : language === 'hi' ? 'उद्योग संवाद मंच' : 'Udyog Samvaad Forum'}
            </h1>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              {language === 'mr'
                ? 'महाराष्ट्रातील उद्योजक, औद्योगिक क्लस्टर्स आणि राज्य धोरणकर्त्यांमध्ये थेट संवाद घडवून आणण्यासाठी आयोजित बैठका. आपल्या भागातील उद्योगांचे प्रश्न, वीज दर, पायाभूत सुविधा आणि विस्तार योजनांवर थेट चर्चा.'
                : language === 'hi'
                ? 'महाराष्ट्र के उद्यमियों, क्लस्टरों और नीति-निर्माताओं के बीच सीधा संवाद। औद्योगिक समस्याओं, बिजली दरों और बुनियादी ढांचे पर प्रत्यक्ष विमर्श।'
                : "Structured interactive dialogue connecting regional entrepreneurs, cluster leads, and policymakers to resolve operational bottlenecks and accelerate Maharashtra's industrial trajectory."}
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search event or location...' : 'संवाद बैठक किंवा ठिकाण शोधा...'}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#E35914] focus:ring-1 focus:ring-[#E35914] bg-white font-devanagari"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-[#64748B] font-medium whitespace-nowrap">
              {language === 'mr' ? 'जिल्हा निवडा:' : language === 'hi' ? 'ज़िला चुनें:' : 'Filter District:'}
            </span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="text-xs rounded-lg border border-[#CBD5E1] py-2 px-3 focus:outline-none focus:border-[#E35914] bg-white font-devanagari cursor-pointer"
            >
              <option value="all">{t.common.all}</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111827]">
              {language === 'mr' ? 'नियोजित संवाद कार्यक्रम' : language === 'hi' ? 'नियोजित संवाद कार्यक्रम' : 'Upcoming Dialogue Sessions'}
            </h2>
            <span className="text-xs text-[#64748B]">
              {filteredEvents.length} {language === 'mr' ? 'कार्यक्रम उपलब्ध' : 'sessions listed'}
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#E2E8F0] space-y-3">
              <Info className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <h3 className="font-bold text-base text-[#111827]">
                {language === 'mr' ? 'कोणताही संवाद कार्यक्रम सापडला नाही' : 'No dialogues found'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {language === 'mr' ? 'कृपया शोध निकष बदला किंवा नंतर पुन्हा तपासा.' : 'Please clear your filters.'}
              </p>
              <Button variant="outlined" size="sm" onClick={() => { setSearchQuery(''); setDistrictFilter('all'); }}>
                {t.common.all}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => {
                const title = language === 'mr' ? event.titleMr : language === 'hi' ? event.titleHi : event.titleEn;
                const location = language === 'mr' ? event.locationMr : language === 'hi' ? event.locationHi : event.locationEn;
                const desc = language === 'mr' ? event.descriptionMr : language === 'hi' ? event.descriptionHi : event.descriptionEn;

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs hover:shadow-md transition p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="primary">{event.categoryMr}</Badge>
                        <span className="text-[11px] font-label text-[#136938] bg-[#F0FDF4] border border-[#DCFCE7] px-2 py-0.5 rounded uppercase font-medium">
                          {language === 'mr' ? 'अधिकृत सत्र' : 'Active Session'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#111827] leading-snug">
                          {title}
                        </h3>
                        <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                          {desc}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 text-xs text-[#475569] bg-[#F8FAFC] p-3.5 rounded-lg border border-[#E2E8F0]">
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-[#136938] shrink-0" />
                          <span className="font-semibold text-[#111827]">{event.date}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-[#F59E0B] shrink-0" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-[#E35914] shrink-0 mt-0.5" />
                          <span>{location}</span>
                        </div>
                        {event.capacity && (
                          <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-[#64748B] shrink-0" />
                            <span>
                              {language === 'mr'
                                ? `क्षमता: ${event.capacity} उद्योजक (${event.registeredCount || 0} नोंदणीकृत)`
                                : `Capacity: ${event.capacity} (${event.registeredCount || 0} registered)`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Agenda preview if available */}
                      {event.agenda && event.agenda.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <h4 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider font-label">
                            {language === 'mr' ? 'ठळक विषयपत्रिका:' : 'Session Agenda:'}
                          </h4>
                          <ul className="text-xs text-[#64748B] space-y-1 pl-4 list-disc">
                            {event.agenda.slice(0, 3).map((ag, idx) => (
                              <li key={idx}>{ag}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                      <span className="text-[11px] text-[#64748B]">
                        {language === 'mr' ? 'मोफत सहभाग • पूर्वनोंदणी आवश्यक' : 'Free Entry • RSVP Required'}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenRegister(event)}
                      >
                        {language === 'mr' ? 'संवादात सहभागी व्हा' : 'Register for Session'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {isRegisterModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-xs flex items-center justify-center p-4 modal-scroll-lock" data-lenis-prevent>
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E2E8F0] shadow-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#111827] rounded-lg cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedRef ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#136938] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">
                  {language === 'mr' ? 'संवाद नोंदणी यशस्वी!' : 'Registration Confirmed!'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {language === 'mr'
                    ? 'आपली उद्योग संवाद सहभाग नोंदणी अधिकृतरीत्या प्राप्त झाली आहे.'
                    : 'Your RSVP for the dialogue session has been officially registered.'}
                </p>

                <div className="bg-[#FFF7ED] p-4 rounded-xl border border-[#FFEDD5] inline-block my-2">
                  <div className="text-[11px] text-[#9A3412] uppercase font-label font-bold">
                    {t.common.referenceId}
                  </div>
                  <div className="text-xl font-extrabold text-[#E35914] tracking-wider mt-1 font-label">
                    {submittedRef}
                  </div>
                </div>

                <div className="text-[11px] text-[#136938] bg-[#F0FDF4] p-3 rounded-lg border border-[#DCFCE7]">
                  {language === 'mr'
                    ? 'नोंदणी क्रमांक व सविस्तर बैठक कार्यक्रम आपल्या संपर्क क्रमांकावर एसएमएसद्वारे पाठवला जाईल.'
                    : 'Registration confirmation and venue entry pass details will be communicated via SMS.'}
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="md" onClick={() => setIsRegisterModalOpen(false)}>
                    {t.common.close}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <span className="text-xs font-bold text-[#E35914] bg-[#FFF7ED] px-2.5 py-1 rounded">
                    {selectedEvent.categoryMr}
                  </span>
                  <h3 className="text-xl font-bold text-[#111827] mt-2">
                    {language === 'mr' ? selectedEvent.titleMr : selectedEvent.titleEn}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    {selectedEvent.date} • {selectedEvent.locationMr}
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <Input
                    label={language === 'mr' ? 'उद्योजक / प्रतिनिधीचे पूर्ण नाव' : 'Participant Full Name'}
                    value={formData.participantName}
                    onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
                    error={formErrors.participantName}
                    placeholder="उदा. सुहास बाळकृष्ण पाटील"
                    required
                  />

                  <Input
                    label={language === 'mr' ? 'कंपनी / संस्थेचे नाव' : 'Enterprise / Association Name'}
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    error={formErrors.businessName}
                    placeholder="उदा. पाटील ऑटोमेशन प्रायव्हेट लिमिटेड"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label={t.common.designation}
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      error={formErrors.designation}
                      placeholder="उदा. संचालक / पार्टनर"
                      required
                    />

                    <Input
                      label={t.common.sector}
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      error={formErrors.sector}
                      placeholder="उदा. ऑटोमोटिव्ह / इंजिनिअरिंग"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label={t.common.email}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={formErrors.email}
                      placeholder="name@company.com"
                      required
                    />

                    <Input
                      label={t.common.phone}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={formErrors.phone}
                      placeholder="98XXXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5 font-label">
                      {language === 'mr' ? 'संवादात मांडायचा प्रमुख प्रश्न किंवा मुद्दा (पर्यायी)' : 'Key Issue or Topic for Dialogue (Optional)'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.customQuestions}
                      onChange={(e) => setFormData({ ...formData, customQuestions: e.target.value })}
                      placeholder={language === 'mr' ? 'आपल्या क्लस्टर किंवा उद्योगाशी संबंधित प्रश्न थोडक्यात नमूद करा...' : 'Brief notes...'}
                      className="w-full text-xs p-3 rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#E35914] bg-white font-devanagari"
                    />
                  </div>

                  <div className="text-[11px] text-[#136938] bg-[#F0FDF4] p-2.5 rounded border border-[#DCFCE7]">
                    {language === 'mr' ? 'नोंदणीनंतर प्रवेशिका व बैठक तपशील आपल्या ईमेल व मोबाईलवर पाठवले जातील.' : 'Entry pass and schedule will be delivered to your registered contact.'}
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <Button variant="secondary" size="md" type="button" onClick={() => setIsRegisterModalOpen(false)}>
                      {t.common.cancel}
                    </Button>
                    <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? t.common.loading : language === 'mr' ? 'नोंदणी पूर्ण करा' : 'Confirm Registration'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
