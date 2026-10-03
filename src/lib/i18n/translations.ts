export type Language = 'en' | 'gu'

export interface TranslationSchema {
  nav: {
    societyName: string
    aboutUs: string
    publicNotices: string
    contact: string
    memberLogin: string
    learnMore: string
  }
  hero: {
    trustBadge: string
    titlePart1: string
    titlePart2: string
    subtitle: string
    memberLogin: string
    learnMore: string
    auditVerified: string
    classARating: string
  }
  stats: {
    yearsVal: string
    yearsLabel: string
    yearsServing: string
    membersVal: string
    membersLabel: string
    activeMembers: string
    disbursedVal: string
    disbursedLabel: string
    loansDisbursed: string
    auditVal: string
    auditBadge: string
    auditLabel: string
    statutoryCompliance: string
  }
  services: {
    sectionHeading: string
    sectionSubheading: string
    savingsTitle: string
    savingsDesc: string
    savingsTag: string
    personalLoansTitle: string
    personalLoansDesc: string
    personalLoansTag: string
    fdTitle: string
    fdDesc: string
    fdTag: string
  }
  about: {
    tagline: string
    title: string
    heading: string
    readFullStory: string
    regNo: string
    founded: string
    members: string
    auditor: string
    defaultText: string
  }
  notices: {
    tagline: string
    title: string
    publicAnnouncements: string
    viewAll: string
    loading: string
    empty: string
    noNotices: string
  }
  calculator: {
    title: string
    badge: string
    subtitle: string
    presetEmergency: string
    presetPersonal: string
    presetBusiness: string
    loanAmount: string
    tenure: string
    interestRate: string
    estimatedMonthly: string
    perMonth: string
    principal: string
    interest: string
    totalInterest: string
    totalPayable: string
    disclaimer: string
  }
  footer: {
    societyName: string
    regInfo: string
    description: string
    quickLinks: string
    legal: string
    aboutUs: string
    notices: string
    contact: string
    privacyPolicy: string
    termsOfService: string
    copyright: string
  }
  memberNav: {
    dashboard: string
    statements: string
    notices: string
    profile: string
    support: string
    logout: string
  }
  adminNav: {
    mainSection: string
    reportsSection: string
    dashboard: string
    members: string
    statements: string
    notices: string
    websiteCms: string
    queries: string
    activity: string
    settings: string
    exportData: string
    backupStatus: string
    signOut: string
    searchPlaceholder: string
    notifications: string
    markAllRead: string
    operational: string
  }
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    nav: {
      societyName: 'Shree Crystal Co-op',
      aboutUs: 'About Us',
      publicNotices: 'Public Notices',
      contact: 'Contact & Help',
      memberLogin: 'Member Login',
      learnMore: 'Learn More',
    },
    hero: {
      trustBadge: 'Govt. Registered Co-operative Society • Reg No. B/26456/1985',
      titlePart1: 'Trusted by your community.',
      titlePart2: 'Safe and secure since 1985.',
      subtitle:
        'Your digital passbook and member portal — check your savings, loans, account statements, and society notices with complete peace of mind.',
      memberLogin: 'Member Login',
      learnMore: 'Learn More',
      auditVerified: 'AUDIT VERIFIED',
      classARating: 'Grade "A" Certified Society',
    },
    stats: {
      yearsVal: '35+ Yrs',
      yearsLabel: 'Serving Since 1985',
      yearsServing: 'Serving Since 1985',
      membersVal: '1,847',
      membersLabel: 'Active Members',
      activeMembers: 'Active Members',
      disbursedVal: '₹15 Cr+',
      disbursedLabel: 'Loans Given',
      loansDisbursed: 'Loans Disbursed',
      auditVal: 'Grade A',
      auditBadge: 'Audit',
      auditLabel: '100% Legally Verified',
      statutoryCompliance: 'Statutory Compliance',
    },
    services: {
      sectionHeading: 'Comprehensive Financial Services',
      sectionSubheading: 'Empowering members with ethical, community-centric financial products since 1985.',
      savingsTitle: 'Member Savings & Deposits',
      savingsDesc: 'Secure high-interest savings accounts backed by cooperative principles and audited security.',
      savingsTag: 'Popular',
      personalLoansTitle: 'Low-Interest Member Loans',
      personalLoansDesc: 'Fast approval personal, business, and emergency credit with straightforward repayment terms.',
      personalLoansTag: 'Flexible',
      fdTitle: 'Fixed Term Deposits',
      fdDesc: 'Guaranteed returns on fixed tenures to help your family and business build long-term wealth.',
      fdTag: 'Guaranteed',
    },
    about: {
      tagline: 'Our Society Story',
      title: 'About Shree Crystal Co-op',
      heading: 'About Shree Crystal Co-op',
      readFullStory: 'Read Full Society Story',
      regNo: 'Govt Reg No:',
      founded: 'Established:',
      members: 'Total Members:',
      auditor: 'Official Auditor:',
      defaultText:
        'For over 35 years, Shree Crystal Co-op has been a trusted financial home for local families, shopkeepers, and small businesses. We offer secure savings and affordable loans with complete honesty and transparency.',
    },
    notices: {
      tagline: 'Official Announcements',
      title: 'Latest Notices & Circulars',
      publicAnnouncements: 'Public Notices & Circulars',
      viewAll: 'View all notices',
      loading: 'Loading notices...',
      empty: 'No public notices right now. Please check back later.',
      noNotices: 'No public notices right now. Please check back later.',
    },
    calculator: {
      title: 'Loan EMI Calculator',
      badge: 'Easy Tool',
      subtitle: 'Calculate your monthly installment and see how much goes towards loan principal and interest.',
      presetEmergency: 'Emergency Loan (₹50K)',
      presetPersonal: 'Personal Loan (₹2 Lakh)',
      presetBusiness: 'Business Loan (₹10 Lakh)',
      loanAmount: 'Loan Amount Needed',
      tenure: 'Repayment Duration (Months)',
      interestRate: 'Yearly Interest Rate',
      estimatedMonthly: 'Estimated Monthly Payment',
      perMonth: ' /month',
      principal: 'Principal (Loan Borrowed)',
      interest: 'Interest (Extra Cost)',
      totalInterest: 'Total Interest to Pay',
      totalPayable: 'Total Amount to Return',
      disclaimer: 'Note: This calculator gives an estimate. Final installment amounts follow approved society rules.',
    },
    footer: {
      societyName: 'Shree Crystal Co-op',
      regInfo: 'Registration No. B/26456/1985',
      description:
        'Serving our community with safe savings, fair credit, and honest service for over 35 years.',
      quickLinks: 'Quick Links',
      legal: 'Legal Information',
      aboutUs: 'About Us',
      notices: 'Public Notices',
      contact: 'Contact Us',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      copyright: 'Shree Crystal Co-op Credit and Consumers Society Limited. All rights reserved.',
    },
    memberNav: {
      dashboard: 'Dashboard Overview',
      statements: 'My Passbook Statements',
      notices: 'Society Notices',
      profile: 'My Profile & KYC',
      support: 'Help & Questions',
      logout: 'Log Out',
    },
    adminNav: {
      mainSection: 'Main Menu',
      reportsSection: 'Reports & Data',
      dashboard: 'Admin Dashboard',
      members: 'Member List',
      statements: 'Monthly Statements',
      notices: 'Notices & Circulars',
      websiteCms: 'Website Content',
      queries: 'Member Inquiries',
      activity: 'Activity History',
      settings: 'Society Settings',
      exportData: 'Export Society Data',
      backupStatus: 'Database Backup',
      signOut: 'Sign Out',
      searchPlaceholder: 'Search member ID or name...',
      notifications: 'Recent Alerts',
      markAllRead: 'Mark all as read',
      operational: 'All Systems Running Normally',
    },
  },

  gu: {
    nav: {
      societyName: 'શ્રી ક્રિસ્ટલ કો-ઓપરેટિવ',
      aboutUs: 'અમારા વિશે',
      publicNotices: 'જાહેર નોટિસ',
      contact: 'સંપર્ક',
      memberLogin: 'સભ્ય લૉગિન',
      learnMore: 'વધુ જાણો',
    },
    hero: {
      trustBadge: 'નોંધાયેલ સહકારી મંડળી • નોંધણી નં. B/26456/1985',
      titlePart1: 'તમારા સમાજનો અતૂટ વિશ્વાસ.',
      titlePart2: 'પારદર્શક સહકારી સેવા.',
      subtitle:
        'તમારી પાસબુક હવે ડિજિટલ — ૧૯૮૫થી સંપૂર્ણ પારદર્શિતા, સલામત ધિરાણ અને સમર્પણ સાથે સભ્યોની સેવામાં.',
      memberLogin: 'સભ્ય લૉગિન',
      learnMore: 'વધુ જાણો',
      auditVerified: 'ઓડિટ પ્રમાણિત',
      classARating: 'મંડળી વર્ગ "અ" રેટિંગ',
    },
    stats: {
      yearsVal: '૩૫+ વર્ષ',
      yearsLabel: '૧૯૮૫ થી સેવારત',
      yearsServing: '૧૯૮૫ થી સેવારત',
      membersVal: '૧,૮૪૭',
      membersLabel: 'સક્રિય સભ્યો',
      activeMembers: 'સક્રિય સભ્યો',
      disbursedVal: '₹૧૫ કરોડ+',
      disbursedLabel: 'ધિરાણ વિતરણ',
      loansDisbursed: 'ધિરાણ વિતરણ',
      auditVal: 'વર્ગ "અ"',
      auditBadge: 'ઓડિટ',
      auditLabel: '૧૦૦% કાયદેસર પાલન',
      statutoryCompliance: '૧૦૦% કાયદેસર પાલન',
    },
    services: {
      sectionHeading: 'સંપૂર્ણ સહકારી નાણાકીય સેવાઓ',
      sectionSubheading: '૧૯૮૫ થી સભ્યોને વિશ્વસનીય અને પારદર્શક નાણાકીય સેવાઓ પૂરી પાડીએ છીએ.',
      savingsTitle: 'સભ્ય બચત ખાતું અને થાપણો',
      savingsDesc: 'સહકારી સિદ્ધાંતો અને ઓડિટ સુરક્ષા દ્વારા સમર્થિત ઊંચા વળતરવાળી બચત સેવાઓ.',
      savingsTag: 'લોકપ્રિય',
      personalLoansTitle: 'સરળ ધિરાણ અને પર્સનલ લોન',
      personalLoansDesc: 'સરળ અને પારદર્શક શરતો સાથે તાત્કાલિક વ્યક્તિગત, વ્યાપાર અને કટોકટી ધિરાણ.',
      personalLoansTag: 'સરળ શરતો',
      fdTitle: 'મુદ્દતી થાપણ (FD)',
      fdDesc: 'નિશ્ચિત સમયગાળા માટે સુરક્ષિત અને ચોક્કસ વ્યાજ આપતી ગેરંટેડ મુદ્દતી થાપણો.',
      fdTag: 'સુરક્ષિત',
    },
    about: {
      tagline: 'આપણો સહકારી વારસો',
      title: 'મંડળી વિશે',
      heading: 'મંડળી વિશે',
      readFullStory: 'સંપૂર્ણ ઇતિહાસ વાંચો',
      regNo: 'નોંધણી નં:',
      founded: 'સ્થાપના:',
      members: 'સભ્યો:',
      auditor: 'ઓડિટર:',
      defaultText:
        'શ્રી ક્રિસ્ટલ કો-ઓપરેટિવ સોસાયટી ત્રણ દાયકાથી વધુ સમયથી આપણા સ્થાનિક સમુદાયની આર્થિક કરોડરજ્જુ રહી છે, જે અજોડ પારદર્શિતા સાથે સુરક્ષિત બચત અને સરળ ધિરાણ પૂરું પાડે છે.',
    },
    notices: {
      tagline: 'સત્તાવાર જાહેરાતો',
      title: 'તાજેતરની નોટિસો',
      publicAnnouncements: 'જાહેર નોટિસો અને પરિપત્રો',
      viewAll: 'બધી નોટિસો જુઓ',
      loading: 'નોટિસો લોડ થઈ રહી છે...',
      empty: 'હાલમાં કોઈ જાહેર નોટિસ ઉપલબ્ધ નથી.',
      noNotices: 'હાલમાં કોઈ જાહેર નોટિસ ઉપલબ્ધ નથી.',
    },
    calculator: {
      title: 'ઇ.એમ.આઇ. કેલ્ક્યુલેટર',
      badge: 'લાઇવ ગણતરી',
      subtitle: 'તમારા માસિક હપ્તા અને વ્યાજની વહેંચણીની અંદાજિત ગણતરી કરો.',
      presetEmergency: 'કટોકટી લોન (₹૫૦ હજાર)',
      presetPersonal: 'પર્સનલ લોન (₹૨ લાખ)',
      presetBusiness: 'બિઝનેસ લોન (₹૧૦ લાખ)',
      loanAmount: 'ધિરાણ રકમ',
      tenure: 'મુદ્દત',
      interestRate: 'વાર્ષિક વ્યાજ દર',
      estimatedMonthly: 'અંદાજિત માસિક હપ્તો',
      perMonth: ' /માસિક',
      principal: 'મુદ્દલ',
      interest: 'વ્યાજ',
      totalInterest: 'કુલ વ્યાજ',
      totalPayable: 'કુલ ચૂકવવાપાત્ર',
      disclaimer: 'મંડળીના નિયમો મુજબ ઘટતી જતી બાકી રકમ (Reducing Balance) પદ્ધતિ પર આધારિત અંદાજ.',
    },
    footer: {
      societyName: 'શ્રી ક્રિસ્ટલ કો-ઓપરેટિવ',
      regInfo: 'નોંધણી નં. B/26456/1985',
      description:
        '૩૫ વર્ષથી વધુ સમયથી સંપૂર્ણ પારદર્શિતા અને પ્રમાણિકતા સાથે સમુદાયની સેવામાં.',
      quickLinks: 'ઝડપી લિંક્સ',
      legal: 'કાનૂની માહિતી',
      aboutUs: 'અમારા વિશે',
      notices: 'નોટિસો',
      contact: 'સંપર્ક',
      privacyPolicy: 'ગોપનીયતા નીતિ',
      termsOfService: 'સેવાની શરતો',
      copyright: 'શ્રી ક્રિસ્ટલ કો-ઓપરેટિવ ક્રેડિટ એન્ડ કન્ઝ્યુમર્સ સોસાયટી લિમિટેડ. સર્વાધિકાર સુરક્ષિત.',
    },
    memberNav: {
      dashboard: 'ડેશબોર્ડ',
      statements: 'મારા સ્ટેટમેન્ટ્સ',
      notices: 'નોટિસો',
      profile: 'પ્રોફાઇલ',
      support: 'સહાય / પ્રશ્નો',
      logout: 'લૉગ આઉટ',
    },
    adminNav: {
      mainSection: 'મુખ્ય મેનુ',
      reportsSection: 'અહેવાલો',
      dashboard: 'ડેશબોર્ડ',
      members: 'સભ્યો',
      statements: 'સ્ટેટમેન્ટ્સ',
      notices: 'નોટિસો અને પરિપત્રો',
      websiteCms: 'વેબસાઇટ મેનેજમેન્ટ',
      queries: 'સહાય પ્રશ્નો',
      activity: 'પ્રવૃત્તિ નોંધ (લૉગ)',
      settings: 'સેટિંગ્સ',
      exportData: 'ડેટા નિકાસ (એક્સપોર્ટ)',
      backupStatus: 'બેકઅપ સ્થિતિ',
      signOut: 'સાઇન આઉટ',
      searchPlaceholder: 'સભ્ય આઈડી અથવા નામ શોધો...',
      notifications: 'સૂચનાઓ',
      markAllRead: 'બધા વંચાયેલ તરીકે ચિહ્નિત કરો',
      operational: 'સિસ્ટમ કાર્યરત છે',
    },
  },
}
