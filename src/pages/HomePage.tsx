import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useDemoData } from '../hooks/useDemoData';
import {
  CORE_SERVICES,
  ECOSYSTEM_PILLARS,
} from '../data/mockData';
import { SEED_LEADERSHIP } from '../data/seedData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  MessageSquareShare,
  Compass,
  FileCheck2,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Award,
  ChevronRight,
  ArrowRight,
  Building,
  Send,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { grievances, meetingRequests, associations, events } = useDemoData();
  // Calculate live dynamic metrics from shared demo store
  const totalGrievances = grievances.length;
  const resolvedGrievances = grievances.filter((g) => g.status === 'Resolved').length;
  const resolutionPercentage = totalGrievances > 0 ? Math.round((resolvedGrievances / totalGrievances) * 100) : 92;

  // Dynamic metrics
  const dynamicMetrics = [
    {
      id: 'm1',
      labelMr: 'नोंदणीकृत व संपर्कातील उद्योजक',
      labelHi: 'पंजीकृत और संपर्कित उद्यमी',
      labelEn: 'Entrepreneurs Reached',
      value: '४५,२००+',
      change: '+१२% या महिन्यात',
      color: 'primary' as const,
    },
    {
      id: 'm2',
      labelMr: 'संलग्न औद्योगिक संघटना',
      labelHi: 'संबद्ध औद्योगिक संगठन',
      labelEn: 'Connected Associations',
      value: `${associations.length * 120 + 20}+`,
      change: 'सक्रिय क्लस्टर्सचे प्रतिनिधी',
      color: 'secondary' as const,
    },
    {
      id: 'm3',
      labelMr: 'तक्रार निवारण दर',
      labelHi: 'शिकायत निवारण दर',
      labelEn: 'Grievance Resolution Rate',
      value: `${resolutionPercentage}%`,
      change: `एकूण ${totalGrievances} पैकी ${resolvedGrievances} निवारण`,
      color: 'secondary' as const,
    },
    {
      id: 'm4',
      labelMr: 'नोंदवलेल्या भेटी व कार्यक्रम',
      labelHi: 'दर्ज भेंट व कार्यक्रम',
      labelEn: 'Meetings & Events',
      value: `${meetingRequests.length + events.length * 20}+`,
      change: 'सर्वसमावेशक सहभाग',
      color: 'tertiary' as const,
    },
  ];

  // Helper to render service icon
  const renderServiceIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'MessageSquareShare':
        return <MessageSquareShare className={`w-6 h-6 ${color}`} />;
      case 'Compass':
        return <Compass className={`w-6 h-6 ${color}`} />;
      case 'FileCheck2':
        return <FileCheck2 className={`w-6 h-6 ${color}`} />;
      case 'Users':
        return <Users className={`w-6 h-6 ${color}`} />;
      default:
        return <Building className={`w-6 h-6 ${color}`} />;
    }
  };

  const getServiceRoute = (id: string) => {
    switch (id) {
      case 'samvaad':
        return '/udyog-samvaad';
      case 'darshan':
        return '/udyog-darshan';
      case 'grievance':
        return '/grievance';
      case 'leadership':
        return '/meeting-request';
      default:
        return '/';
    }
  };

  const getServiceTitle = (item: (typeof CORE_SERVICES)[0]) => {
    if (language === 'mr') return item.titleMr;
    if (language === 'hi') return item.titleHi;
    return item.titleEn;
  };

  const getServiceDesc = (item: (typeof CORE_SERVICES)[0]) => {
    if (language === 'mr') return item.descriptionMr;
    if (language === 'hi') return item.descriptionHi;
    return item.descriptionEn;
  };

  const getServiceBadge = (item: (typeof CORE_SERVICES)[0]) => {
    if (language === 'mr') return item.badgeMr;
    if (language === 'hi') return item.badgeHi;
    return item.badgeEn;
  };

  const getServiceCta = (item: (typeof CORE_SERVICES)[0]) => {
    if (language === 'mr') return item.ctaTextMr;
    if (language === 'hi') return item.ctaTextHi;
    return item.ctaTextEn;
  };

  return (
    <div className="flex-1 bg-white font-devanagari text-[#111827]">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[calc(100svh-7rem)] overflow-hidden bg-slate-950">
        <div className="absolute inset-0 overflow-hidden bg-slate-950" aria-hidden="true">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="hero-background-video"
          >
            <source src="/videos/7A269378-DF97-4E82-BAA2-D44FD7E2E182.MP4" type="video/mp4" />
          </video>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[68%] bg-linear-to-t from-slate-950/95 via-slate-950/55 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-14 pt-24 text-center sm:px-6 sm:pb-16 lg:pb-20">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-3xl lg:text-4xl 2xl:text-5xl">
              <span className="text-[#FDBA74]">
                {language === 'mr'
                  ? '$1 ट्रिलियन अर्थव्यवस्थेच्या दिशेने महाराष्ट्राची वाटचाल'
                  : language === 'hi'
                    ? '$1 ट्रिलियन अर्थव्यवस्था की ओर महाराष्ट्र के कदम'
                    : "Maharashtra's march towards a $1 trillion economy"}
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-base">
              {language === 'mr'
                ? 'महाराष्ट्राच्या औद्योगिक प्रगतीत सहभागी व्हा आणि विकसित, समृद्ध महाराष्ट्राच्या उभारणीत योगदान द्या.'
                : language === 'hi'
                  ? 'महाराष्ट्र की औद्योगिक प्रगति में सहभागी बनें और विकसित, समृद्ध महाराष्ट्र के निर्माण में योगदान दें।'
                  : 'Join Maharashtra’s industrial progress and help build a developed, prosperous state.'}
            </p>

            <Link
              to="/association-registration"
              className="group mx-auto mt-6 inline-flex items-center gap-4 rounded-full border border-white/50 bg-white/10 py-2 pl-6 pr-2 text-sm font-bold text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all hover:border-[#FDBA74] hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDBA74]"
            >
              <span>
                {language === 'mr' ? 'आजच सहभागी व्हा' : language === 'hi' ? 'आज ही जुड़ें' : 'Join Today'}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E35914] text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>

      </section>

      {/* Leadership Section */}
      <section className="py-14 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF7ED] border border-[#FFEDD5] rounded-full shadow-2xs">
              <img src="/images/udyog-setu-lotus.png" alt="BJP lotus logo" className="w-5 h-5 rounded-full object-contain" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#E35914] font-label">
                {language === 'mr' ? 'भाजप प्रेरणा व नेतृत्व' : language === 'hi' ? 'भाजपा प्रेरणा व नेतृत्व' : 'BJP Leadership & Vision'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
              {t.leadership.heading}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              {t.leadership.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {SEED_LEADERSHIP.map((leader) => {
              const name = language === 'mr' ? leader.nameMr : language === 'hi' ? leader.nameHi : leader.nameEn;
              const role = language === 'mr' ? leader.roleMr : language === 'hi' ? leader.roleHi : leader.roleEn;
              const quote = language === 'mr' ? leader.messageMr : language === 'hi' ? leader.messageHi : leader.messageEn;

              return (
                <div
                  key={leader.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-6 sm:p-7 space-y-5 flex flex-col items-center text-center">
                    {/* Portrait first, followed by leader details */}
                    <div className="relative flex justify-center w-full">
                      <img
                        src={leader.image}
                        alt={name}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover object-top ring-4 ring-[#FFF7ED] shadow-md group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Official BJP Emblem in Card */}
                      <div className="absolute top-0 right-0 shrink-0 p-1 bg-white rounded-full border border-[#FED7AA] shadow-2xs" title="भारतीय जनता पार्टी (BJP)">
                        <img
                          src="/images/bjp-logo.png"
                          alt="BJP"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-contain"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-lg sm:text-xl text-[#111827] leading-tight font-devanagari">
                        {name}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-[#E35914] font-label">
                        {role}
                      </p>
                    </div>

                    <blockquote className="w-full text-xs sm:text-sm text-[#334155] leading-relaxed border-l-3 border-[#136938] pl-3.5 italic bg-[#F8FAFC]/80 p-3 rounded-r-lg text-left">
                      "{quote}"
                    </blockquote>
                  </div>

                  <div className="bg-[#F8FAFC] px-6 py-3.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                    <span className="text-[#64748B] text-[11px] font-label flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E35914]"></span>
                      {language === 'en' ? 'Leadership Vision' : 'मार्गदर्शक विचार'}
                    </span>
                    <Link
                      to="/meeting-request"
                      className="text-[#E35914] font-bold hover:underline inline-flex items-center gap-1 group/btn"
                    >
                      <span>{language === 'en' ? 'Meeting Request' : 'भेट विनंती'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Metrics & Infographic Strip */}
      <section className="py-8 bg-white border-y border-[#E2E8F0]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">
                {language === 'mr'
                  ? 'उद्योग सेतू प्रभाव व सहभाग'
                  : language === 'hi'
                  ? 'उद्योग सेतु प्रभाव व सहभागिता'
                  : 'Udyog Setu Impact & Reach'}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                {language === 'mr'
                  ? 'राज्यातील उद्योजक, औद्योगिक क्लस्टर्स आणि संघटनांचा सक्रिय सहभाग.'
                  : language === 'hi'
                  ? 'राज्य के उद्यमियों, औद्योगिक क्लस्टरों और संगठनों की सक्रिय सहभागिता।'
                  : 'Active engagement across Maharashtra industrial clusters and associations.'}
              </p>
            </div>
            <div className="text-xs text-[#136938] font-label font-medium flex items-center gap-1.5 bg-[#F0FDF4] px-2.5 py-1 rounded-md border border-[#DCFCE7]">
              <span className="w-2 h-2 rounded-full bg-[#136938]" />
              <span>
                {language === 'mr'
                  ? 'सक्रिय सहकार्य नेटवर्क'
                  : language === 'hi'
                  ? 'सक्रिय सहयोग नेटवर्क'
                  : 'Active Engagement Network'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dynamicMetrics.map((metric) => {
              const borderAccent = {
                primary: 'border-l-4 border-l-[#E35914]',
                secondary: 'border-l-4 border-l-[#136938]',
                tertiary: 'border-l-4 border-l-[#F59E0B]',
              }[metric.color];

              const label = language === 'mr' ? metric.labelMr : language === 'hi' ? metric.labelHi : metric.labelEn;

              return (
                <div
                  key={metric.id}
                  className={`bg-white p-5 rounded-xl border border-[#E2E8F0] ${borderAccent} shadow-2xs`}
                >
                  <div className="text-xs text-[#64748B] mb-2 font-devanagari">
                    <span>{label}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-devanagari">
                    {metric.value}
                  </div>
                  {metric.change && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#136938] font-devanagari">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{metric.change}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Four Flagship Services Section */}
      <section id="services" className="py-16 bg-[#F8FAFC]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="inline-block text-xs font-semibold px-3 py-1 bg-[#FFF7ED] text-[#E35914] rounded-full uppercase tracking-wider font-label">
              {language === 'mr'
                ? 'प्रमुख सेवा उपक्रम'
                : language === 'hi'
                ? 'प्रमुख सेवा पहल'
                : 'Flagship Services'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
              {language === 'mr'
                ? 'उद्योजकांसाठी चार मुख्य आधारस्तंभ'
                : language === 'hi'
                ? 'उद्यमियों के लिए चार प्रमुख आधार स्तंभ'
                : 'Four Core Pillars for Maharashtra Industry'}
            </h2>
            <p className="text-sm text-[#64748B]">
              {language === 'mr'
                ? 'संवाद, क्षेत्रीय भेटी, तक्रार निवारण आणि थेट नेतृत्व भेटींच्या माध्यमातून महाराष्ट्रातील उद्योगांना निरंतर सहकार्य.'
                : language === 'hi'
                ? 'संवाद, क्षेत्रीय दौरों, शिकायत निवारण और प्रत्यक्ष नेतृत्व भेंट के माध्यम से निरंतर सहयोग।'
                : 'Continuous engagement through dialogue forums, cluster visits, swift issue redressal, and leadership meetings.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_SERVICES.map((service) => {
              const iconColor = {
                primary: 'text-[#E35914]',
                secondary: 'text-[#136938]',
                tertiary: 'text-[#F59E0B]',
              }[service.accentColor];

              const iconBg = {
                primary: 'bg-[#FFF7ED]',
                secondary: 'bg-[#F0FDF4]',
                tertiary: 'bg-[#FFFBEB]',
              }[service.accentColor];

              const route = getServiceRoute(service.id);

              return (
                <Card
                  key={service.id}
                  accent={service.accentColor}
                  hoverEffect
                  className="flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                        {renderServiceIcon(service.iconName, iconColor)}
                      </div>
                      <Badge variant={service.accentColor === 'secondary' ? 'secondary' : 'primary'}>
                        {getServiceBadge(service)}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#111827]">
                        {getServiceTitle(service)}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                        {getServiceDesc(service)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E2E8F0]">
                    <Link to={route}>
                      <Button
                        variant={service.accentColor === 'primary' ? 'primary' : 'secondary'}
                        size="sm"
                        className="w-full justify-between"
                        icon={<ChevronRight className="w-4 h-4" />}
                        iconPosition="right"
                      >
                        {getServiceCta(service)}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industrial Ecosystem & Long-Term Roadmap */}
      <section id="ecosystem" className="py-16 bg-white border-t border-[#E2E8F0]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Progress Indicators */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold px-3 py-1 bg-[#F0FDF4] text-[#136938] border border-[#DCFCE7] rounded-full uppercase tracking-wider font-label">
                {language === 'mr'
                  ? 'उद्योग परिसंस्था व्हिजन'
                  : language === 'hi'
                  ? 'औद्योगिक पारिस्थितिकी तंत्र विज़न'
                  : 'Industrial Ecosystem Vision'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                {language === 'mr'
                  ? 'महाराष्ट्र $1 Trillion अर्थव्यवस्था: विकास मार्ग'
                  : language === 'hi'
                  ? 'महाराष्ट्र $1 Trillion अर्थव्यवस्था: विकास पथ'
                  : 'Maharashtra $1 Trillion Economy: Growth Pathways'}
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed">
                {language === 'mr'
                  ? 'राज्यातील उद्योग, बंदरे, तंत्रज्ञान आणि पायाभूत सुविधांचा समन्वय साधून महाराष्ट्राला देशाचे अव्वल औद्योगिक केंद्र बनवण्याचा दीर्घकालीन संकल्प.'
                  : language === 'hi'
                  ? 'उद्योगों, बंदरगाहों, प्रौद्योगिकी और बुनियादी ढांचे का समन्वय कर महाराष्ट्र को अग्रणी औद्योगिक केंद्र बनाने का दीर्घकालिक संकल्प।'
                  : "A strategic roadmap aligning expressways, ports, renewable manufacturing, and MSME clusters towards Maharashtra's economic vision."}
              </p>

              {/* Ecosystem Progress Bars */}
              <div className="space-y-4 pt-2">
                {ECOSYSTEM_PILLARS.map((pillar) => {
                  const title = language === 'mr' ? pillar.titleMr : language === 'hi' ? pillar.titleHi : pillar.titleEn;
                  const summary = language === 'mr' ? pillar.summaryMr : language === 'hi' ? pillar.summaryHi : pillar.summaryEn;

                  return (
                    <div key={pillar.id} className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-[#111827]">
                          {title}
                        </span>
                        <span className="text-xs font-bold text-[#475569] font-label">
                          {pillar.percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mb-3">
                        {summary}
                      </p>
                      <ProgressBar
                        percentage={pillar.percentage}
                        color={pillar.color}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Institutional Quote & Niti Manthan */}
            <div className="lg:col-span-6 space-y-6">
              <Card className="border-t-4 border-t-[#E35914] p-8 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#E35914]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">
                      {language === 'mr'
                        ? 'संकल्प: आत्मनिर्भर व समृद्ध महाराष्ट्र'
                        : language === 'hi'
                        ? 'संकल्प: आत्मनिर्भर एवं समृद्ध महाराष्ट्र'
                        : 'Commitment: Self-Reliant & Prosperous Maharashtra'}
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      {language === 'mr'
                        ? 'सर्वसमावेशक औद्योगिक भागीदारी'
                        : language === 'hi'
                        ? 'समावेशी औद्योगिक साझेदारी'
                        : 'Inclusive Industrial Partnership'}
                    </p>
                  </div>
                </div>

                <blockquote className="border-l-3 border-[#E35914] pl-4 italic text-sm text-[#334155] leading-relaxed my-4">
                  {language === 'mr'
                    ? '"लघुउद्योगांपासून ते जागतिक उत्पादन प्रकल्पांपर्यंत – प्रत्येक उद्योजकाचा सन्मान आणि त्यांच्या अडचणींचे गतिमान निवारण हेच आमच्या $1 Trillion अर्थव्यवस्थेच्या ध्येयाचे मूळ अधिष्ठान आहे."'
                    : language === 'hi'
                    ? '"लघु उद्योगों से लेकर वैश्विक विनिर्माण संयंत्रों तक – प्रत्येक उद्यमी का सम्मान और उनकी समस्याओं का त्वरित निवारण ही हमारे आर्थिक मिशन की नींव है।"'
                    : '"From micro-enterprises to major manufacturing hubs – supporting every entrepreneur and resolving administrative bottlenecks is fundamental to Maharashtra\'s economic mission."'}
                </blockquote>

                <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#64748B]">
                    <span className="font-semibold text-[#111827] block">
                      {language === 'mr'
                        ? 'उद्योग समन्वय कक्ष'
                        : language === 'hi'
                        ? 'उद्योग समन्वय प्रकोष्ठ'
                        : 'Industry Coordination Cell'}
                    </span>
                    <span>
                      {language === 'mr'
                        ? 'औद्योगिक सहकार्य संपर्क'
                        : language === 'hi'
                        ? 'औद्योगिक सहयोग संपर्क'
                        : 'Industrial Liaison Desk'}
                    </span>
                  </div>
                  <Link to="/association-registration">
                    <Button variant="green" size="sm">
                      {language === 'mr'
                        ? 'संघटना नोंदणी करा'
                        : language === 'hi'
                        ? 'संगठन पंजीकरण करें'
                        : 'Register Association'}
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Niti Manthan Card */}
              <div id="niti" className="bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F59E0B] uppercase font-label">
                      {t.nav.nitiManthan}
                    </span>
                    <Badge variant="secondary">
                      {language === 'en' ? 'POLICY FORUM' : language === 'hi' ? 'नीति मंच' : 'धोरण मंच'}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-[#111827] mt-1">
                    {language === 'mr'
                      ? 'औद्योगिक धोरण सुधारणा व श्वेतपत्रिका सूचना'
                      : language === 'hi'
                      ? 'औद्योगिक नीति सुधार एवं श्वेतपत्र सुझाव'
                      : 'Industrial Policy Feedback & Whitepaper Notes'}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {language === 'mr'
                      ? 'आपल्या क्षेत्रातील धोरणात्मक प्रस्ताव व शिफारशी थेट पाठवा.'
                      : language === 'hi'
                      ? 'अपने क्षेत्र के नीतिगत प्रस्ताव व सुझाव सीधे प्रेषित करें।'
                      : 'Submit industry sector proposals and policy recommendations.'}
                  </p>
                </div>
                <Link to="/niti-manthan">
                  <Button variant="outlined" size="sm" className="shrink-0">
                    {language === 'mr' ? 'सहभागी व्हा' : language === 'hi' ? 'भाग लें' : 'Participate'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-16 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold px-3 py-1 bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7] rounded-full uppercase tracking-wider font-label">
                {language === 'mr'
                  ? 'आगामी उद्योग उपक्रम'
                  : language === 'hi'
                  ? 'आगामी उद्योग कार्यक्रम'
                  : 'Upcoming Industry Events'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-2">
                {language === 'mr'
                  ? 'उद्योग संवाद व परिषद वेळापत्रक'
                  : language === 'hi'
                  ? 'उद्योग संवाद एवं परिषद समय सारिणी'
                  : 'Conclaves, Visits & Summits'}
              </h2>
            </div>
            <Link to="/events">
              <Button variant="outlined" size="sm">
                {language === 'mr' ? 'सर्व कार्यक्रम पहा' : language === 'hi' ? 'सभी कार्यक्रम देखें' : 'View All Events'}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => {
              const title = language === 'mr' ? event.titleMr : language === 'hi' ? event.titleHi : event.titleEn;
              const location = language === 'mr' ? event.locationMr : language === 'hi' ? event.locationHi : event.locationEn;
              const category = language === 'mr' ? event.categoryMr : language === 'hi' ? event.categoryHi : event.categoryEn;

              return (
                <Card key={event.id} hoverEffect className="flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#E35914] bg-[#FFF7ED] px-2.5 py-1 rounded font-devanagari">
                        {category}
                      </span>
                      <span className="text-[10px] text-[#136938] bg-[#F0FDF4] border border-[#DCFCE7] px-2 py-0.5 rounded font-label uppercase">
                        {language === 'mr' ? 'आगामी' : 'Upcoming'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#111827] leading-snug">
                      {title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-[#64748B] pt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#136938]" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#E35914]" />
                        <span>{location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
                    <Link to="/events">
                      <Button variant="outlined" size="sm" className="w-full">
                        {t.common.register}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Association Registration CTA Section */}
      <section id="register" className="py-16 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold px-3 py-1 bg-[#FFF7ED] text-[#E35914] border border-[#FFEDD5] rounded-full uppercase tracking-wider font-label">
            {language === 'mr'
              ? 'संघटना व उद्योजक नेटवर्क'
              : language === 'hi'
              ? 'संगठन एवं उद्यमी नेटवर्क'
              : 'Association & Industry Network'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            {language === 'mr'
              ? 'आपली औद्योगिक संघटना किंवा उद्योग आजच जोडा'
              : language === 'hi'
              ? 'अपना औद्योगिक संगठन या उद्योग आज ही जोड़ें'
              : 'Register Your Industrial Association or Enterprise Today'}
          </h2>
          <p className="text-sm sm:text-base text-[#475569] max-w-2xl mx-auto">
            {language === 'mr'
              ? 'जिल्हास्तरीय व क्लस्टर संघटनांसाठी थेट समन्वय, धोरणात्मक सल्लामसलत आणि जलद निवारण प्रणाली.'
              : language === 'hi'
              ? 'जिला व क्लस्टर संगठनों के लिए सीधा समन्वय, नीतिगत विमर्श और त्वरित निवारण प्रणाली।'
              : 'Direct coordination, policy dialogue, and fast-track grievance routing for industry associations.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/association-registration">
              <Button variant="primary" size="lg" icon={<Send className="w-4 h-4" />}>
                {t.nav.joinSetu}
              </Button>
            </Link>
            <Link to="/meeting-request">
              <Button variant="secondary" size="lg" icon={<Users className="w-4 h-4" />}>
                {t.nav.meetingRequest}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
