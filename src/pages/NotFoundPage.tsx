import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/ui/Button';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-[#F8FAFC] font-devanagari text-[#111827]">
      <div className="max-w-md w-full text-center space-y-5 bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#FFF7ED] text-[#E35914] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-4xl font-extrabold text-[#E35914] font-label">४०४ / 404</span>
          <h1 className="text-xl font-bold text-[#111827]">
            {language === 'mr' ? 'पृष्ठ सापडले नाही' : 'Page Not Found'}
          </h1>
          <p className="text-xs text-[#64748B] leading-relaxed">
            {language === 'mr'
              ? 'आपण शोधत असलेले पृष्ठ उपलब्ध नाही किंवा त्याचा पत्ता बदलला गेला आहे.'
              : 'The requested route does not exist or has been relocated.'}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" icon={<Home className="w-4 h-4" />}>
              {t.common.backToHome}
            </Button>
          </Link>
          <Link to="/grievance">
            <Button variant="outlined" size="md">
              {t.nav.fileGrievance}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
