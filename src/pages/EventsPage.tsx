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
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { EventItem } from '../types';

export const EventsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { events, addEventRegistration } = useDemoData();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Upcoming vs past events
  const upcomingEvents = events.filter((e) => e.status !== 'completed');
  const pastEvents = events.filter((e) => e.status === 'completed');

  const currentList = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const filteredEvents = currentList.filter((event) => {
    const matchesCat = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch =
      event.titleMr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.locationMr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
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
      const reg = addEventRegistration({
        eventId: selectedEvent?.id,
        eventTitle: selectedEvent?.titleMr || 'उद्योग कार्यक्रम',
        eventType: (selectedEvent?.category as any) || 'summit',
        participantName: formData.participantName,
        businessName: formData.businessName,
        designation: formData.designation,
        sector: formData.sector,
        district: formData.district,
        email: formData.email,
        phone: formData.phone,
        customQuestionsOrNotes: formData.notes,
      });

      setIsSubmitting(false);
      setSubmittedRef(reg.referenceId);
    }, 700);
  };

  const handleOpenDetails = (ev: EventItem) => {
    setSelectedEvent(ev);
    setIsDetailModalOpen(true);
  };

  const handleOpenRegister = (ev: EventItem) => {
    setSelectedEvent(ev);
    setIsDetailModalOpen(false);
    setIsRegisterModalOpen(true);
    setSubmittedRef(null);
    setFormErrors({});
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 font-devanagari text-[#111827]">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumbs items={[{ label: t.nav.events }]} />

        {/* Header Hero Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E2E8F0] shadow-xs">
          <div className="max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FFEDD5] text-xs font-semibold text-[#E35914] font-label">
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'उद्योग मेळावे व उपक्रम' : 'CONCLAVES & EVENTS HUB'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              {language === 'mr' ? 'कार्यक्रम व उपक्रम केंद्र' : 'Industrial Events & Programs'}
            </h1>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              {language === 'mr'
                ? 'उद्योग संवाद, उद्योग दर्शन, नीती मंथन आणि राज्यस्तरीय औद्योगिक शिखर परिषदांचे एकत्रित वेळापत्रक. सर्व कार्यक्रमांची माहिती, कार्यक्रमपत्रिका व उपस्थिती नोंदणी.'
                : 'Central calendar for all BJP Udyog Setu dialogues, field study tours, policy roundtables, and regional industrial summits.'}
            </p>
          </div>
        </div>

        {/* Tab & Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Upcoming vs Past Toggle */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl text-xs font-medium font-devanagari w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`cursor-pointer px-4 py-2 rounded-lg transition ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-[#111827] font-bold shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                {language === 'mr' ? 'आगामी कार्यक्रम' : 'Upcoming Events'} ({upcomingEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('past')}
                className={`cursor-pointer px-4 py-2 rounded-lg transition ${
                  activeTab === 'past'
                    ? 'bg-white text-[#111827] font-bold shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                {language === 'mr' ? 'मागील यशस्वी उपक्रम' : 'Past Conclaves'} ({pastEvents.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'mr' ? 'कार्यक्रम शोधा...' : 'Search events...'}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#E35914] bg-white font-devanagari"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
            <span className="text-xs text-[#64748B] font-medium py-1">प्रवर्ग:</span>
            {[
              { id: 'all', label: t.common.all },
              { id: 'samvaad', label: 'उद्योग संवाद (Samvaad)' },
              { id: 'darshan', label: 'उद्योग दर्शन (Darshan)' },
              { id: 'niti', label: 'नीती मंथन (Niti Manthan)' },
              { id: 'summit', label: 'शिखर परिषद (Summits)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`cursor-pointer px-3 py-1 rounded-full border transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#E35914] text-white border-[#E35914] font-semibold'
                    : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111827]">
              {activeTab === 'upcoming'
                ? language === 'mr'
                  ? 'आगामी कार्यक्रम यादी'
                  : 'Upcoming Event Schedule'
                : language === 'mr'
                ? 'मागील उपक्रम अहवाल व फलनिष्पत्ती'
                : 'Past Activities & Outcomes'}
            </h2>
            <span className="text-xs text-[#64748B]">
              {filteredEvents.length} {language === 'mr' ? 'कार्यक्रम आढळले' : 'events shown'}
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#E2E8F0] space-y-2">
              <Calendar className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <h3 className="font-bold text-base text-[#111827]">
                {language === 'mr' ? 'कोणताही कार्यक्रम आढळला नाही' : 'No events match the filter'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {language === 'mr' ? 'कृपया शोध किंवा प्रवर्ग निकष बदला.' : 'Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const title = language === 'mr' ? event.titleMr : language === 'hi' ? event.titleHi : event.titleEn;
                const location = language === 'mr' ? event.locationMr : language === 'hi' ? event.locationHi : event.locationEn;
                const desc = language === 'mr' ? event.descriptionMr : language === 'hi' ? event.descriptionHi : event.descriptionEn;

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-40 bg-[#111827]/90 overflow-hidden">
                      <img
                        src={event.imageUrl || '/maharashtra_industry_hero.jpg'}
                        alt={title}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[11px] font-bold bg-[#E35914] text-white px-2.5 py-1 rounded shadow-xs font-devanagari">
                          {event.categoryMr}
                        </span>
                      </div>
                      {event.status === 'completed' && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-bold bg-[#136938] text-white px-2 py-0.5 rounded font-label uppercase">
                            Completed
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-[#111827] leading-snug">
                          {title}
                        </h3>
                        <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                          {desc}
                        </p>

                        <div className="space-y-1.5 pt-2 text-xs text-[#475569]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#136938] shrink-0" />
                            <span className="font-semibold text-[#111827]">{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#E35914] shrink-0" />
                            <span className="truncate">{location}</span>
                          </div>
                          {event.capacity && (
                            <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                              <Users className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {language === 'mr'
                                  ? `क्षमता: ${event.capacity} (${event.registeredCount || 0} नोंदणीकृत)`
                                  : `Capacity: ${event.capacity} (${event.registeredCount || 0} RSVPs)`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 mt-2 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                        <Button
                          variant="outlined"
                          size="sm"
                          onClick={() => handleOpenDetails(event)}
                        >
                          {t.common.details}
                        </Button>

                        {event.status !== 'completed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenRegister(event)}
                          >
                            {language === 'mr' ? 'नोंदणी करा' : 'RSVP Now'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E2E8F0] shadow-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#111827] rounded-lg cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <Badge variant="primary">{selectedEvent.categoryMr}</Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827]">
                {language === 'mr' ? selectedEvent.titleMr : selectedEvent.titleEn}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                <div>
                  <span className="text-[#64748B] block">{t.common.date}:</span>
                  <span className="font-bold text-[#111827]">{selectedEvent.date}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">{t.common.location}:</span>
                  <span className="font-bold text-[#111827]">{selectedEvent.locationMr}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-1 font-label">
                  {language === 'mr' ? 'कार्यक्रमाचा तपशील:' : 'Program Description:'}
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {selectedEvent.descriptionMr}
                </p>
              </div>

              {selectedEvent.agenda && (
                <div>
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2 font-label">
                    {language === 'mr' ? 'वेळापत्रक व सत्रे (Agenda):' : 'Agenda:'}
                  </h4>
                  <ul className="space-y-2 text-xs text-[#334155]">
                    {selectedEvent.agenda.map((ag, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-[#F1F5F9] p-2.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-[#E35914] shrink-0 mt-0.5" />
                        <span>{ag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-[#F0FDF4] p-3 rounded-xl border border-[#DCFCE7] text-xs text-[#136938]">
                {language === 'mr' ? 'कार्यक्रमाचे अधिकृत प्रवेश पत्र आणि बैठक तपशील आपल्या नोंदणीकृत ईमेलवर पाठवले जातील.' : 'Official event pass and schedule will be communicated via registered email.'}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2E8F0]">
                <Button variant="secondary" size="md" onClick={() => setIsDetailModalOpen(false)}>
                  {t.common.close}
                </Button>
                {selectedEvent.status !== 'completed' && (
                  <Button variant="primary" size="md" onClick={() => handleOpenRegister(selectedEvent)}>
                    {language === 'mr' ? 'नोंदणी अर्ज भरा' : 'Proceed to RSVP'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-xs flex items-center justify-center p-4">
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
                  {language === 'mr' ? 'उपक्रम नोंदणी यशस्वी!' : 'Event RSVP Confirmed!'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {language === 'mr'
                    ? 'आपली उपस्थिती नोंदणी अधिकृतरीत्या नोंदवली गेली आहे.'
                    : 'Your RSVP has been officially registered.'}
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
                    ? 'कार्यक्रमाचे प्रवेश पत्र व सविस्तर कार्यक्रमपत्रिका आपल्या नोंदणीकृत ईमेलवर पाठवली जाईल.'
                    : 'Event pass and itinerary will be shared on your registered contacts.'}
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
                  <Badge variant="primary">{selectedEvent.categoryMr}</Badge>
                  <h3 className="text-lg font-bold text-[#111827] mt-2">
                    {selectedEvent.titleMr}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    {selectedEvent.date} • {selectedEvent.locationMr}
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <Input
                    label={language === 'mr' ? 'सहभागी प्रतिनिधीचे पूर्ण नाव' : 'Participant Name'}
                    value={formData.participantName}
                    onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
                    error={formErrors.participantName}
                    placeholder="उदा. अमित सुरेश शिंदे"
                    required
                  />

                  <Input
                    label={language === 'mr' ? 'कंपनी / संस्थेचे नाव' : 'Enterprise / Association Name'}
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    error={formErrors.businessName}
                    placeholder="उदा. शिंदे इंजिनिअर्स प्रा. लि."
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label={t.common.designation}
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      error={formErrors.designation}
                      placeholder="उदा. व्यवस्थापक / संचालक"
                      required
                    />

                    <Input
                      label={t.common.sector}
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      error={formErrors.sector}
                      placeholder="उदा. मशिनिंग / ऑटो"
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
                      placeholder="amit@shinde.com"
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
                      {language === 'mr' ? 'काही प्रश्न किंवा टिप्पणी? (पर्यायी)' : 'Questions or Notes (Optional)'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="उदा. उपस्थिती नोंदणीबाबत सूचना..."
                      className="w-full text-xs p-3 rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#E35914] bg-white font-devanagari"
                    />
                  </div>

                  <div className="text-[11px] text-[#136938] bg-[#F0FDF4] p-2.5 rounded border border-[#DCFCE7]">
                    {language === 'mr' ? 'कार्यक्रमाचे प्रवेश पत्र व सविस्तर कार्यक्रमपत्रिका आपल्या नोंदणीकृत ईमेलवर पाठवली जाईल.' : 'Event pass and itinerary will be shared on your registered contacts.'}
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <Button variant="secondary" size="md" type="button" onClick={() => setIsRegisterModalOpen(false)}>
                      {t.common.cancel}
                    </Button>
                    <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? t.common.loading : language === 'mr' ? 'उपस्थिती नोंदणी करा' : 'Confirm RSVP'}
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
