import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import {
  Menu,
  X,
  Globe,
  FileCheck2,
  ShieldAlert,
  ChevronDown,
  Phone,
  ClipboardList,
  UserPlus,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const location = useLocation();

  // Primary navigation links visible in top bar
  const mainNav = [
    { to: '/udyog-samvaad', label: t.nav.samvaad },
    { to: '/udyog-darshan', label: t.nav.darshan },
    { to: '/grievance', label: t.nav.grievance },
    { to: '/meeting-request', label: t.nav.meetingRequest },
  ];

  // Secondary navigation links in "More" or mobile menu
  const secondaryNav = [
    { to: '/association-registration', label: t.nav.associationReg },
    { to: '/niti-manthan', label: t.nav.nitiManthan },
    { to: '/events', label: t.nav.events },
    { to: '/admin', label: t.nav.admin, isSpecial: true },
  ];

  const allNav = [...mainNav, ...secondaryNav];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      {/* Official Saffron-White-Green Tricolor Accent Stripe */}
      <div className="h-1 w-full bg-linear-to-r from-[#E35914] via-[#F59E0B] to-[#136938]" />

      {/* Top institutional strip */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs py-1.5 px-4 sm:px-6 lg:px-8 text-[#64748B] font-label">
        <div className="w-full max-w-[1560px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E35914]" />
            <span className="font-devanagari font-medium text-[#111827]">
              {t.nav.initiativeTag}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Toll-free Helpline */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#334155] font-devanagari">
              <Phone className="w-3 h-3 text-[#136938]" />
              <span className="font-medium">हेल्पलाइन: १८००-२३३-०५५५</span>
            </div>

            {/* Admin link badge */}
            <Link
              to="/admin"
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-[#136938] bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#DCFCE7] px-2 py-0.5 rounded transition"
            >
              <ShieldAlert className="w-3 h-3 text-[#136938]" />
              <span>{t.nav.admin}</span>
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 text-xs text-[#475569]">
              <Globe className="w-3.5 h-3.5 text-[#E35914]" />
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`cursor-pointer px-2 py-0.5 rounded text-xs transition ${
                  language === 'mr'
                    ? 'font-bold text-[#E35914] bg-[#FFF7ED]'
                    : 'hover:text-[#111827]'
                }`}
                title="मराठी (Default)"
              >
                मराठी
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`cursor-pointer px-2 py-0.5 rounded text-xs transition ${
                  language === 'hi'
                    ? 'font-bold text-[#E35914] bg-[#FFF7ED]'
                    : 'hover:text-[#111827]'
                }`}
                title="हिंदी"
              >
                हिंदी
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`cursor-pointer px-2 py-0.5 rounded text-xs transition ${
                  language === 'en'
                    ? 'font-bold text-[#E35914] bg-[#FFF7ED]'
                    : 'hover:text-[#111827]'
                }`}
                title="English"
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <Link
          to="/"
          className="flex items-center gap-3 select-none shrink-0 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img
            src="/images/udyog-setu-lotus.png"
            alt=""
            className="w-11 h-11 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#111827] font-devanagari">
                {t.nav.brand}
              </span>
            </div>
            <p className="text-xs text-[#64748B] font-devanagari">
              {t.nav.brandSubtitle}
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 font-devanagari text-sm">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition cursor-pointer py-1 font-medium whitespace-nowrap text-xs xl:text-sm ${
                  isActive
                    ? 'text-[#E35914] font-bold border-b-2 border-[#E35914]'
                    : 'text-[#475569] hover:text-[#E35914]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* More Dropdown for secondary pages */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
              className="flex items-center gap-1 text-[#475569] hover:text-[#E35914] font-medium transition cursor-pointer py-1 text-xs xl:text-sm whitespace-nowrap"
            >
              <span>{language === 'mr' ? 'अधिक उपक्रम' : language === 'hi' ? 'अधिक पहल' : 'More'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-[#E2E8F0] shadow-lg py-2 z-50 animate-in fade-in zoom-in-95">
                {secondaryNav.map((sub) => (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    onClick={() => setMoreDropdownOpen(false)}
                    className={`block px-4 py-2 text-xs font-medium transition ${
                      sub.isSpecial
                        ? 'text-[#136938] hover:bg-[#F0FDF4] font-semibold'
                        : 'text-[#334155] hover:bg-[#F4F7FF] hover:text-[#E35914]'
                    } ${location.pathname === sub.to ? 'bg-[#FFF7ED] text-[#E35914] font-bold' : ''}`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Primary CTA Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0 header-action-slot">
          <Link
            to="/track-complaint"
            className="group hidden xl:inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-medium text-[#111827] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#136938] focus-visible:ring-offset-2 header-action-button header-track-action"
            aria-label={t.nav.trackComplaint}
          >
            <ClipboardList className="header-action-icon h-4 w-4 text-[#136938]" aria-hidden="true" />
            <span className="header-action-label">{t.nav.trackComplaint}</span>
          </Link>
          <Link
            to="/association-registration"
            className="group inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-[#E35914] px-4 py-2.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#CC4D0E] active:bg-[#B33E09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E35914] focus-visible:ring-offset-2 header-action-button header-join-action"
            aria-label={t.nav.joinSetu}
          >
            <UserPlus className="header-action-icon h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
            <span className="header-action-label">{t.nav.joinSetu}</span>
          </Link>
        </div>

        {/* Mobile / Tablet menu toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#475569] hover:text-[#111827] rounded-lg border border-[#E2E8F0] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 py-4 space-y-3 font-devanagari shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {allNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#FFF7ED] text-[#E35914] font-bold'
                      : 'text-[#111827] hover:bg-[#F4F7FF]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row gap-2">
            <Link to="/association-registration" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="primary" size="md" className="w-full">
                {t.nav.joinSetu}
              </Button>
            </Link>
            <Link to="/grievance" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button
                variant="outlined"
                size="md"
                className="w-full"
                icon={<FileCheck2 className="w-4 h-4 text-[#136938]" />}
              >
                {t.nav.fileGrievance}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
