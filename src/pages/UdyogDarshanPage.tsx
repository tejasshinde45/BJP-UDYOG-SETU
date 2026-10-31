import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useDemoData } from '../hooks/useDemoData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import {
  Compass,
  Calendar,
  Users,
  Shield,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { EventItem } from '../types';

export const UdyogDarshanPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { events, addEventRegistration } = useDemoData();

  // Filter darshan events
  const darshanVisits = events.filter((e) => e.category === 'darshan');

  const [selectedVisit, setSelectedVisit] = useState<EventItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    businessName: '',
    participantName: '',
    designation: '',
    sector: '',
    district: 'मुंबई',
    email: '',
    phone: '',
    safetyAck: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

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
    if (!formData.safetyAck) {
      errors.safetyAck = language === 'mr' ? 'कृपया औद्योगिक सुरक्षा नियमावलीची स्वीकृती द्या.' : 'Please acknowledge safety rules.';
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
        eventId: selectedVisit?.id,
        eventTitle: selectedVisit?.titleMr || 'उद्योग दर्शन भेट',
        eventType: 'darshan',
        participantName: formData.participantName,
        businessName: formData.businessName,
        designation: formData.designation,
        sector: formData.sector,
        district: formData.district,
        email: formData.email,
        phone: formData.phone,
        customQuestionsOrNotes: 'Safety Protocol Acknowledged',
      });

      setIsSubmitting(false);
      setSubmittedRef(regRecord.referenceId);
    }, 700);
  };

  const handleOpenDetails = (visit: EventItem) => {
    setSelectedVisit(visit);
    setIsDetailModalOpen(true);
  };

  const handleOpenRegisterFromDetails = (visit: EventItem) => {
    setSelectedVisit(visit);
    setIsDetailModalOpen(false);
    setIsRegisterModalOpen(true);
    setSubmittedRef(null);
    setFormErrors({});
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 font-devanagari text-[#111827]">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumbs items={[{ label: t.nav.darshan }]} />

        {/* Header Hero Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E2E8F0] shadow-xs">
          <div className="max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-xs font-semibold text-[#136938] font-label">
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'औद्योगिक क्षेत्रीय दौरे' : language === 'hi' ? 'औद्योगिक क्षेत्रीय दौरे' : 'INDUSTRIAL STUDY TOURS'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              {language === 'mr' ? 'उद्योग दर्शन उपक्रम' : language === 'hi' ? 'उद्योग दर्शन पहल' : 'Udyog Darshan Industrial Visits'}
            </h1>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              {language === 'mr'
                ? 'महाराष्ट्रातील जागतिक दर्जाच्या बंदरे, समृद्धी महामार्ग लॉजिस्टिक हब्स, एरोस्पेस संकुले आणि आधुनिक उत्पादन प्रकल्पांचे थेट क्षेत्रीय अवलोकन. स्थानिक उद्योजकांना आधुनिक तंत्रज्ञान, निर्यात कार्यपद्धती आणि लॉजिस्टिक साखळी प्रत्यक्ष शिकण्याची संधी.'
                : language === 'hi'
                ? 'महाराष्ट्र के वैश्विक बंदरगाहों, लॉजिस्टिक हबों और अत्याधुनिक विनिर्माण संयंत्रों का प्रत्यक्ष अध्ययन दौरा। नए उद्यमियों के लिए प्रेरणा व ज्ञान।'
                : "Experiential study tours allowing Maharashtra's MSMEs and young entrepreneurs to witness benchmark industrial infrastructure, deep-water ports, automation plants, and aerospace logistics first-hand."}
            </p>
          </div>
        </div>

        {/* Visits Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111827]">
              {language === 'mr' ? 'नियोजित उद्योग दर्शन दौरे' : 'Scheduled Industrial Visits'}
            </h2>
            <span className="text-xs text-[#64748B]">
              {darshanVisits.length} {language === 'mr' ? 'दौरे उपलब्ध' : 'tours available'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {darshanVisits.map((visit) => {
              const title = language === 'mr' ? visit.titleMr : language === 'hi' ? visit.titleHi : visit.titleEn;
              const location = language === 'mr' ? visit.locationMr : language === 'hi' ? visit.locationHi : visit.locationEn;
              const desc = language === 'mr' ? visit.descriptionMr : language === 'hi' ? visit.descriptionHi : visit.descriptionEn;

              return (
                <div
                  key={visit.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-[#111827]/90 overflow-hidden">
                    <img
                      src={visit.imageUrl || '/maharashtra_industry_hero.jpg'}
                      alt={title}
                      className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary">
                        {visit.categoryMr}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] font-semibold bg-[#111827]/70 backdrop-blur-xs px-2.5 py-1 rounded font-devanagari">
                        {location}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-[#111827] leading-snug">
                        {title}
                      </h3>
                      <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                        {desc}
                      </p>

                      <div className="space-y-1.5 pt-2 text-xs text-[#475569] bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#136938]" />
                          <span className="font-semibold text-[#111827]">{visit.date}</span>
                        </div>
                        {visit.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#F59E0B]" />
                            <span>{visit.time}</span>
                          </div>
                        )}
                        {visit.capacity && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#64748B]" />
                            <span>
                              {language === 'mr'
                                ? `क्षमता: ${visit.capacity} प्रतिनिधी (${visit.registeredCount || 0} जागा भरल्या)`
                                : `Batch: ${visit.capacity} max (${visit.registeredCount || 0} booked)`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                      <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => handleOpenDetails(visit)}
                      >
                        {t.common.details}
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenRegisterFromDetails(visit)}
                      >
                        {language === 'mr' ? 'दौऱ्यासाठी नोंदणी करा' : 'Register for Visit'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedVisit && (
        <div className="fixed inset-0 z-50 bg-[#111827]/50 backdrop-blur-xs flex items-center justify-center p-4 modal-scroll-lock" data-lenis-prevent>
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E2E8F0] shadow-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#111827] rounded-lg cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <Badge variant="secondary">{selectedVisit.categoryMr}</Badge>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827]">
                {language === 'mr' ? selectedVisit.titleMr : selectedVisit.titleEn}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                <div>
                  <span className="text-[#64748B] block">{t.common.date}:</span>
                  <span className="font-bold text-[#111827]">{selectedVisit.date}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">{t.common.location}:</span>
                  <span className="font-bold text-[#111827]">{selectedVisit.locationMr}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-1 font-label">
                  {language === 'mr' ? 'दौऱ्याचे स्वरूप व अवलोकन उद्दिष्टे:' : 'Visit Overview & Learning Goals:'}
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {selectedVisit.descriptionMr}
                </p>
              </div>

              {selectedVisit.agenda && selectedVisit.agenda.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2 font-label">
                    {language === 'mr' ? 'दौरा वेळापत्रक (Itinerary):' : 'Itinerary:'}
                  </h4>
                  <ul className="space-y-2 text-xs text-[#334155]">
                    {selectedVisit.agenda.map((ag, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-[#F1F5F9] p-2.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-[#E35914] shrink-0 mt-0.5" />
                        <span>{ag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety Instructions */}
              <div className="bg-[#FFFBEB] p-3.5 rounded-xl border border-[#FEF3C7] space-y-1.5 text-xs text-[#92400E]">
                <div className="flex items-center gap-2 font-bold font-label">
                  <Shield className="w-4 h-4 text-[#F59E0B]" />
                  <span>{language === 'mr' ? 'औद्योगिक सुरक्षा नियमावली:' : 'Safety Regulations:'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {language === 'mr'
                    ? 'सर्व सहभागी उद्योजकांनी सेफ्टी शूज घालणे बंधनकारक आहे. बंदरातील संवेदनशील भागात फोटोग्राफी व विनापरवाना हालचालीस सक्त मनाई आहे.'
                    : 'Personal Protective Equipment (PPE) is mandatory in active port/industrial operational zones. Photography subject to prior clearances.'}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E2E8F0]">
                <Button variant="secondary" size="md" onClick={() => setIsDetailModalOpen(false)}>
                  {t.common.close}
                </Button>
                <Button variant="green" size="md" onClick={() => handleOpenRegisterFromDetails(selectedVisit)}>
                  {language === 'mr' ? 'नोंदणी अर्ज भरा' : 'Proceed to Register'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterModalOpen && selectedVisit && (
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
                  {language === 'mr' ? 'दौरा नोंदणी निश्चित झाली!' : 'Visit Registration Confirmed!'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {language === 'mr'
                    ? 'उद्योग दर्शन दौऱ्यासाठी आपली नोंदणी पूर्ण झाली आहे. अधिकृत सुरक्षा पास व बस व्यवस्था तपशील ईमेलद्वारे पाठवले जातील.'
                    : 'Your registration for the industrial visit has been confirmed. Entry pass and transport guidelines will be emailed.'}
                </p>

                <div className="bg-[#F0FDF4] p-4 rounded-xl border border-[#DCFCE7] inline-block my-2">
                  <div className="text-[11px] text-[#136938] uppercase font-label font-bold">
                    {t.common.referenceId}
                  </div>
                  <div className="text-xl font-extrabold text-[#136938] tracking-wider mt-1 font-label">
                    {submittedRef}
                  </div>
                </div>

                <div className="text-[11px] text-[#136938] bg-[#F0FDF4] p-3 rounded-lg border border-[#DCFCE7]">
                  {language === 'mr'
                    ? 'दौऱ्याच्या दिवशी वैध ओळखपत्र आणि सुरक्षा पादत्राणे (Safety Shoes) अनिवार्य आहेत.'
                    : 'Valid photo ID and safety footwear are mandatory during industrial visits.'}
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
                  <Badge variant="secondary">{selectedVisit.categoryMr}</Badge>
                  <h3 className="text-lg font-bold text-[#111827] mt-2">
                    {selectedVisit.titleMr}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    {selectedVisit.date} • {selectedVisit.locationMr}
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <Input
                    label={language === 'mr' ? 'उद्योजक / प्रतिनिधीचे पूर्ण नाव' : 'Participant Full Name'}
                    value={formData.participantName}
                    onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
                    error={formErrors.participantName}
                    placeholder="उदा. राहुल अनिल महाजन"
                    required
                  />

                  <Input
                    label={language === 'mr' ? 'कंपनी / कारखान्याचे नाव' : 'Enterprise Name'}
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    error={formErrors.businessName}
                    placeholder="उदा. महाजन पॉलिमर्स प्रायव्हेट लिमिटेड"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label={t.common.designation}
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      error={formErrors.designation}
                      placeholder="उदा. उत्पादन प्रमुख / संचालक"
                      required
                    />

                    <Input
                      label={t.common.sector}
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      error={formErrors.sector}
                      placeholder="उदा. लॉजिस्टिक्स / प्लास्टिक"
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
                      placeholder="rahul@company.com"
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

                  {/* Safety Acknowledgement Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-[#334155] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.safetyAck}
                        onChange={(e) => setFormData({ ...formData, safetyAck: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#136938] focus:ring-[#136938]"
                      />
                      <span>
                        {language === 'mr'
                          ? 'मी औद्योगिक सुरक्षिततेचे सर्व नियम व निर्देशांचे पालन करण्याचे मान्य करत आहे.'
                          : 'I agree to comply with all industrial safety guidelines and wear mandatory PPE during the visit.'}
                      </span>
                    </label>
                    {formErrors.safetyAck && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.safetyAck}</p>
                    )}
                  </div>

                  <div className="text-[11px] text-[#136938] bg-[#F0FDF4] p-2.5 rounded border border-[#DCFCE7]">
                    {language === 'mr' ? 'दौऱ्याच्या वेळी औद्योगिक सुरक्षा नियमांचे व मार्गदर्शकांचे पालन करणे आवश्यक आहे.' : 'Compliance with plant safety rules and site escort guidelines is mandatory.'}
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <Button variant="secondary" size="md" type="button" onClick={() => setIsRegisterModalOpen(false)}>
                      {t.common.cancel}
                    </Button>
                    <Button variant="green" size="md" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? t.common.loading : language === 'mr' ? 'दौरा नोंदणी पूर्ण करा' : 'Confirm Registration'}
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
