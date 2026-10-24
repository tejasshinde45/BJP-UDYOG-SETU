import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { Building2, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] mt-auto font-devanagari text-sm text-[#475569]">
      {/* Upper footer grid */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E35914] flex items-center justify-center text-white shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-[#111827]">
                {t.nav.brand}
              </span>
            </Link>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {language === 'mr'
                ? 'महाराष्ट्राच्या $1 Trillion अर्थव्यवस्थेच्या संकल्पपूर्तीसाठी उद्योग, उद्योजक आणि धोरणकर्त्यांमधील सहकार्याचा सेतू.'
                : language === 'hi'
                ? 'महाराष्ट्र के $1 Trillion अर्थव्यवस्था के संकल्प हेतु उद्योग, उद्यमियों और नीति निर्माताओं के मध्य सहयोग का सेतु।'
                : "A collaborative bridge connecting industry leaders, MSMEs, and policymakers towards Maharashtra's $1 Trillion Economy Mission."}
            </p>
            <div className="pt-1">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#136938] hover:text-[#0E532C] bg-[#F0FDF4] px-2.5 py-1 rounded-md border border-[#DCFCE7] transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.nav.admin}</span>
              </Link>
            </div>
          </div>

          {/* Col 2: Core Services */}
          <div>
            <h4 className="font-semibold text-[#111827] text-xs uppercase tracking-wider mb-4 font-label">
              {language === 'mr' ? 'प्रमुख सेवा' : language === 'hi' ? 'प्रमुख सेवाएं' : 'Key Services'}
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>
                <Link to="/udyog-samvaad" className="hover:text-[#E35914] transition">
                  {t.nav.samvaad}
                </Link>
              </li>
              <li>
                <Link to="/udyog-darshan" className="hover:text-[#E35914] transition">
                  {t.nav.darshan}
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="hover:text-[#E35914] transition">
                  {t.nav.grievance}
                </Link>
              </li>
              <li>
                <Link to="/track-complaint" className="hover:text-[#E35914] transition">
                  {t.nav.trackComplaint}
                </Link>
              </li>
              <li>
                <Link to="/meeting-request" className="hover:text-[#E35914] transition">
                  {t.nav.meetingRequest}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Policy & Ecosystem */}
          <div>
            <h4 className="font-semibold text-[#111827] text-xs uppercase tracking-wider mb-4 font-label">
              {language === 'mr' ? 'धोरण व उपक्रम' : language === 'hi' ? 'नीति एवं पहल' : 'Policy & Initiatives'}
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>
                <Link to="/association-registration" className="hover:text-[#E35914] transition">
                  {t.nav.associationReg}
                </Link>
              </li>
              <li>
                <Link to="/niti-manthan" className="hover:text-[#E35914] transition">
                  {t.nav.nitiManthan}
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#E35914] transition">
                  {t.nav.events}
                </Link>
              </li>
              <li>
                <Link to="/#ecosystem" className="hover:text-[#E35914] transition">
                  {language === 'mr' ? '$1 Trillion अर्थव्यवस्था रोडमॅप' : '$1 Trillion Roadmap'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional Desk Info */}
          <div>
            <h4 className="font-semibold text-[#111827] text-xs uppercase tracking-wider mb-4 font-label">
              {language === 'mr' ? 'संपर्क व समन्वय केंद्र' : language === 'hi' ? 'संपर्क व समन्वय केंद्र' : 'Coordination Desk'}
            </h4>
            <div className="space-y-3 text-xs text-[#64748B]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E35914] shrink-0 mt-0.5" />
                <span>
                  {language === 'mr'
                    ? 'उद्योग सहकार्य कक्ष, नरिमन पॉईंट, मुंबई, महाराष्ट्र'
                    : language === 'hi'
                    ? 'उद्योग सहयोग प्रकोष्ठ, नरीमन पॉइंट, मुंबई, महाराष्ट्र'
                    : 'Industry Coordination Cell, Nariman Point, Mumbai, Maharashtra'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#136938] shrink-0" />
                <span>०२२-२२००४४५५ / १८००-२३३-०५५५</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>udyogsetu@bjpmaharashtra.org</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Legal Copyright */}
      <div className="border-t border-[#E2E8F0] bg-white py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#64748B]">
        <div className="w-full max-w-[1560px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-medium text-[#111827]">
              {language === 'mr'
                ? '© २०२६ भाजप उद्योग सेतू, महाराष्ट्र राज्य. सर्व हक्क राखीव.'
                : language === 'hi'
                ? '© २०२६ भाजपा उद्योग सेतु, महाराष्ट्र राज्य। सर्वाधिकार सुरक्षित।'
                : '© 2026 BJP Udyog Setu, Maharashtra State. All rights reserved.'}
            </p>
            <p className="text-[11px] text-[#94A3B8]">
              {language === 'mr'
                ? 'उद्योग, व्यापार आणि धोरण समन्वयासाठी महाराष्ट्र राज्यस्तरीय अधिकृत व्यासपीठ.'
                : language === 'hi'
                ? 'उद्योग, व्यापार और नीति समन्वय हेतु महाराष्ट्र राज्यस्तरीय आधिकारिक मंच।'
                : "Official platform for Maharashtra's industrial engagement and $1 Trillion economy mission."}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-label">
            <span className="text-[#136938] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#136938]"></span>
              {language === 'en' ? 'Official Platform' : 'अधिकृत व्यासपीठ'}
            </span>
            <span>•</span>
            <span className="text-[#E35914] font-medium">
              {language === 'mr'
                ? 'महाराष्ट्र $1T दृष्टिकोन'
                : language === 'hi'
                  ? 'महाराष्ट्र $1T दृष्टि'
                  : 'Maharashtra $1T Vision'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
