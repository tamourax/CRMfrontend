import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Locale = 'en' | 'ar';

const translations: Record<string, string> = {
  Overview: 'نظرة عامة',
  Customers: 'العملاء',
  Deals: 'الصفقات',
  'AI Assistant': 'مساعد الذكاء الاصطناعي',
  'Sales workspace': 'مساحة المبيعات',
  'Personal workspace': 'مساحة شخصية',
  WORKSPACE: 'مساحة العمل',
  'Sign out': 'تسجيل الخروج',
  Workspace: 'مساحة العمل',
  Sales: 'المبيعات',
  'Private workspace': 'مساحة عمل خاصة',
  'Made for meaningful connections.': 'مصممة لعلاقات عمل مثمرة.',
  'Your workspace. Your data.': 'مساحة عملك. بياناتك.',
  'Your data, a clearer story.': 'بياناتك تحكي قصة أوضح.',
  'Ask your assistant about deals, opportunities, and what comes next.':
    'اسأل المساعد عن الصفقات والفرص والخطوة التالية.',
  'Explore assistant': 'اكتشف المساعد',
  'Explore your CRM': 'استكشف نظامك',
  'Sales representative': 'مندوب مبيعات',
  'Welcome back': 'مرحبًا بعودتك',
  'Sign in to your sales workspace.': 'سجّل الدخول إلى مساحة المبيعات.',
  'Work email': 'البريد الإلكتروني للعمل',
  Password: 'كلمة المرور',
  'Enter your password': 'أدخل كلمة المرور',
  'Sign in': 'تسجيل الدخول',
  'Demo workspace': 'مساحة تجريبية',
  'Use the seeded account and password from the README.':
    'استخدم الحساب التجريبي وكلمة المرور في ملف README.',
  'Search name or company…': 'ابحث بالاسم أو الشركة…',
  'Search deals…': 'ابحث عن صفقة…',
  'All statuses': 'كل الحالات',
  'Any closing date': 'أي تاريخ إغلاق',
  'This month': 'هذا الشهر',
  'Overdue & open': 'متأخرة ومفتوحة',
  'Highest value first': 'الأعلى قيمة أولًا',
  'Lowest value first': 'الأقل قيمة أولًا',
  'Closing soonest': 'الأقرب للإغلاق',
  'Newest first': 'الأحدث أولًا',
  Customer: 'العميل',
  Contact: 'جهة الاتصال',
  Industry: 'القطاع',
  Status: 'الحالة',
  'Deal name': 'اسم الصفقة',
  Value: 'القيمة',
  Stage: 'المرحلة',
  'Expected close': 'الإغلاق المتوقع',
  'No deals found': 'لم يتم العثور على صفقات',
  'No customers found': 'لم يتم العثور على عملاء',
  'Sales overview': 'نظرة عامة على المبيعات',
  'Pipeline by stage': 'مسار المبيعات حسب المرحلة',
  'Top relationships': 'أهم علاقات العملاء',
  'Customers by total deal value': 'العملاء حسب إجمالي قيمة الصفقات',
  'High-value opportunities': 'فرص عالية القيمة',
  'Contact & company': 'جهة الاتصال والشركة',
  'Contact name': 'اسم جهة الاتصال',
  'Relationship notes': 'ملاحظات العلاقة',
  'Associated deals': 'الصفقات المرتبطة',
  'Deal value': 'قيمة الصفقة',
  'Deal overview': 'تفاصيل الصفقة',
  'Reason for loss': 'سبب الخسارة',
  'Ask your assistant about this deal or the wider pipeline.':
    'اسأل المساعد عن هذه الصفقة أو مسار المبيعات.',
  Sources: 'المصادر',
  'Ask about your deals, customers, or pipeline…': 'اسأل عن الصفقات أو العملاء أو مسار المبيعات…',
  'Send question': 'إرسال السؤال',
  'Try again': 'أعد المحاولة',
  'Page not found': 'الصفحة غير موجودة',
  'Switch to dark mode': 'التبديل إلى الوضع الداكن',
  'Switch to light mode': 'التبديل إلى الوضع الفاتح',
  English: 'الإنجليزية',
  العربية: 'العربية',
};

export function translate(value: string, locale: Locale): string {
  return locale === 'ar' ? (translations[value] ?? value) : value;
}

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void } | null>(
  null,
);

function initialLocale(): Locale {
  return localStorage.getItem('orbit-locale') === 'ar' ? 'ar' : 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('orbit-locale', locale);
  }, [locale]);
  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}

export function useT() {
  const { locale } = useLocale();
  return (value: string) => translate(value, locale);
}
