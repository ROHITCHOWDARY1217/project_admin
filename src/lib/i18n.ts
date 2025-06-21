import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Login Page
      login: {
        title: 'Smart Civic Intelligence System',
        subtitle: 'Admin Portal Access',
        adminCode: 'Admin Code',
        adminCodePlaceholder: 'Enter your admin code (e.g., s001, d1, d1m1)',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        signIn: 'Sign In',
        codeHint: 'State: s001 | District: d1-d4 | Mandal: d1m1, d2m2, etc.',
        demoAccounts: 'Demo Accounts'
      },
      
      // Dashboard
      dashboard: {
        overview: 'Dashboard Overview',
        stateOverview: 'State Overview',
        districtOverview: 'District Overview',
        mandalOverview: 'Mandal Overview',
        realTimeInsights: 'Real-time insights and analytics for civic management',
        weeklyTrends: 'Weekly Complaint Trends',
        complaintCategories: 'Complaint Categories'
      },
      
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        complaints: 'Complaints',
        schemes: 'Schemes',
        traffic: 'Traffic Issues',
        elderly: 'Elderly Skills',
        scamAlerts: 'Scam Alerts',
        adminTools: 'Admin Tools'
      },
      
      // Stats Cards
      stats: {
        complaintsToday: 'Complaints Today',
        activeSchemes: 'Active Schemes',
        registeredElderly: 'Registered Elderly',
        scamAlertsWeek: 'Scam Alerts (Week)',
        issuesResolvedMonth: 'Issues Resolved (Month)'
      },
      
      // Complaints
      complaints: {
        management: 'Complaint Management',
        stateManagement: 'State Complaint Management',
        districtManagement: 'District Complaint Management',
        mandalManagement: 'Mandal Complaint Management',
        manageRespond: 'Manage and respond to public service complaints',
        searchPlaceholder: 'Search by name, title, location, or description...',
        allStatus: 'All Status',
        allCategories: 'All Categories',
        pending: 'Pending',
        inProgress: 'In Progress',
        resolved: 'Resolved',
        total: 'Total',
        exportReport: 'Export Report'
      },
      
      // AI Assistant
      ai: {
        inputPlaceholder: 'Ask me about complaints, schemes, traffic, or admin tasks...',
        assistant: 'AI Assistant',
        priority: 'Priority',
        summary: 'Summary',
        help: 'Help'
      },
      
      // Common
      common: {
        loading: 'Loading...',
        search: 'Search...',
        filter: 'Filter',
        export: 'Export',
        save: 'Save',
        cancel: 'Cancel',
        close: 'Close',
        view: 'View',
        approve: 'Approve',
        reject: 'Reject',
        assign: 'Assign',
        markResolved: 'Mark Resolved'
      }
    }
  },
  hi: {
    translation: {
      // Login Page
      login: {
        title: 'स्मार्ट नागरिक बुद्धिमत्ता प्रणाली',
        subtitle: 'प्रशासक पोर्टल पहुंच',
        adminCode: 'प्रशासक कोड',
        adminCodePlaceholder: 'अपना प्रशासक कोड दर्ज करें (जैसे s001, d1, d1m1)',
        password: 'पासवर्ड',
        passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
        signIn: 'साइन इन करें',
        codeHint: 'राज्य: s001 | जिला: d1-d4 | मंडल: d1m1, d2m2, आदि।',
        demoAccounts: 'डेमो खाते'
      },
      
      // Dashboard
      dashboard: {
        overview: 'डैशबोर्ड अवलोकन',
        stateOverview: 'राज्य अवलोकन',
        districtOverview: 'जिला अवलोकन',
        mandalOverview: 'मंडल अवलोकन',
        realTimeInsights: 'नागरिक प्रबंधन के लिए वास्तविक समय की जानकारी और विश्लेषण',
        weeklyTrends: 'साप्ताहिक शिकायत रुझान',
        complaintCategories: 'शिकायत श्रेणियां'
      },
      
      // Navigation
      nav: {
        dashboard: 'डैशबोर्ड',
        complaints: 'शिकायतें',
        schemes: 'योजनाएं',
        traffic: 'ट्रैफिक समस्याएं',
        elderly: 'बुजुर्ग कौशल',
        scamAlerts: 'घोटाला अलर्ट',
        adminTools: 'प्रशासक उपकरण'
      },
      
      // Stats Cards
      stats: {
        complaintsToday: 'आज की शिकायतें',
        activeSchemes: 'सक्रिय योजनाएं',
        registeredElderly: 'पंजीकृत बुजुर्ग',
        scamAlertsWeek: 'घोटाला अलर्ट (सप्ताह)',
        issuesResolvedMonth: 'हल की गई समस्याएं (महीना)'
      },
      
      // Complaints
      complaints: {
        management: 'शिकायत प्रबंधन',
        stateManagement: 'राज्य शिकायत प्रबंधन',
        districtManagement: 'जिला शिकायत प्रबंधन',
        mandalManagement: 'मंडल शिकायत प्रबंधन',
        manageRespond: 'सार्वजनिक सेवा शिकायतों का प्रबंधन और जवाब',
        searchPlaceholder: 'नाम, शीर्षक, स्थान या विवरण से खोजें...',
        allStatus: 'सभी स्थिति',
        allCategories: 'सभी श्रेणियां',
        pending: 'लंबित',
        inProgress: 'प्रगति में',
        resolved: 'हल हो गया',
        total: 'कुल',
        exportReport: 'रिपोर्ट निर्यात करें'
      },
      
      // AI Assistant
      ai: {
        inputPlaceholder: 'शिकायतों, योजनाओं, ट्रैफिक या प्रशासनिक कार्यों के बारे में पूछें...',
        assistant: 'AI सहायक',
        priority: 'प्राथमिकता',
        summary: 'सारांश',
        help: 'सहायता'
      },
      
      // Common
      common: {
        loading: 'लोड हो रहा है...',
        search: 'खोजें...',
        filter: 'फ़िल्टर',
        export: 'निर्यात',
        save: 'सेव करें',
        cancel: 'रद्द करें',
        close: 'बंद करें',
        view: 'देखें',
        approve: 'अनुमोदित करें',
        reject: 'अस्वीकार करें',
        assign: 'असाइन करें',
        markResolved: 'हल के रूप में चिह्नित करें'
      }
    }
  },
  te: {
    translation: {
      // Login Page
      login: {
        title: 'స్మార్ట్ సివిక్ ఇంటెలిజెన్స్ సిస్టమ్',
        subtitle: 'అడ్మిన్ పోర్టల్ యాక్సెస్',
        adminCode: 'అడ్మిన్ కోడ్',
        adminCodePlaceholder: 'మీ అడ్మిన్ కోడ్ ఎంటర్ చేయండి (ఉదా: s001, d1, d1m1)',
        password: 'పాస్‌వర్డ్',
        passwordPlaceholder: 'మీ పాస్‌వర్డ్ ఎంటర్ చేయండి',
        signIn: 'సైన్ ఇన్',
        codeHint: 'రాష్ట్రం: s001 | జిల్లా: d1-d4 | మండలం: d1m1, d2m2, మొదలైనవి।',
        demoAccounts: 'డెమో ఖాతాలు'
      },
      
      // Dashboard
      dashboard: {
        overview: 'డ్యాష్‌బోర్డ్ అవలోకనం',
        stateOverview: 'రాష్ట్ర అవలోకనం',
        districtOverview: 'జిల్లా అవలోకనం',
        mandalOverview: 'మండల అవలోకనం',
        realTimeInsights: 'పౌర నిర్వహణ కోసం రియల్-టైమ్ అంతర్దృష్టులు మరియు విశ్లేషణలు',
        weeklyTrends: 'వారపు ఫిర్యాదు ధోరణులు',
        complaintCategories: 'ఫిర్యాదు వర్గాలు'
      },
      
      // Navigation
      nav: {
        dashboard: 'డ్యాష్‌బోర్డ్',
        complaints: 'ఫిర్యాదులు',
        schemes: 'పథకాలు',
        traffic: 'ట్రాఫిక్ సమస్యలు',
        elderly: 'వృద్ధుల నైపుణ్యాలు',
        scamAlerts: 'స్కామ్ అలర్ట్‌లు',
        adminTools: 'అడ్మిన్ టూల్స్'
      },
      
      // Stats Cards
      stats: {
        complaintsToday: 'నేటి ఫిర్యాదులు',
        activeSchemes: 'క్రియాశీల పథకాలు',
        registeredElderly: 'నమోదైన వృద్ధులు',
        scamAlertsWeek: 'స్కామ్ అలర్ట్‌లు (వారం)',
        issuesResolvedMonth: 'పరిష్కరించిన సమస్యలు (నెల)'
      },
      
      // Complaints
      complaints: {
        management: 'ఫిర్యాదు నిర్వహణ',
        stateManagement: 'రాష్ట్ర ఫిర్యాదు నిర్వహణ',
        districtManagement: 'జిల్లా ఫిర్యాదు నిర్వహణ',
        mandalManagement: 'మండల ఫిర్యాదు నిర్వహణ',
        manageRespond: 'ప్రజా సేవా ఫిర్యాదులను నిర్వహించండి మరియు ప్రతిస్పందించండి',
        searchPlaceholder: 'పేరు, శీర్షిక, స్థానం లేదా వివరణ ద్వారా వెతకండి...',
        allStatus: 'అన్ని స్థితులు',
        allCategories: 'అన్ని వర్గాలు',
        pending: 'పెండింగ్',
        inProgress: 'ప్రగతిలో',
        resolved: 'పరిష్కరించబడింది',
        total: 'మొత్తం',
        exportReport: 'రిపోర్ట్ ఎగుమతి చేయండి'
      },
      
      // AI Assistant
      ai: {
        inputPlaceholder: 'ఫిర్యాదులు, పథకాలు, ట్రాఫిక్ లేదా అడ్మిన్ పనుల గురించి అడగండి...',
        assistant: 'AI అసిస్టెంట్',
        priority: 'ప్రాధాన్యత',
        summary: 'సారాంశం',
        help: 'సహాయం'
      },
      
      // Common
      common: {
        loading: 'లోడ్ అవుతోంది...',
        search: 'వెతకండి...',
        filter: 'ఫిల్టర్',
        export: 'ఎగుమతి',
        save: 'సేవ్ చేయండి',
        cancel: 'రద్దు చేయండి',
        close: 'మూసివేయండి',
        view: 'చూడండి',
        approve: 'ఆమోదించండి',
        reject: 'తిరస్కరించండి',
        assign: 'కేటాయించండి',
        markResolved: 'పరిష్కరించినట్లు గుర్తించండి'
      }
    }
  },
  ur: {
    translation: {
      // Login Page
      login: {
        title: 'سمارٹ سوک انٹیلیجنس سسٹم',
        subtitle: 'ایڈمن پورٹل رسائی',
        adminCode: 'ایڈمن کوڈ',
        adminCodePlaceholder: 'اپنا ایڈمن کوڈ داخل کریں (جیسے s001, d1, d1m1)',
        password: 'پاس ورڈ',
        passwordPlaceholder: 'اپنا پاس ورڈ داخل کریں',
        signIn: 'سائن ان',
        codeHint: 'ریاست: s001 | ضلع: d1-d4 | منڈل: d1m1, d2m2, وغیرہ۔',
        demoAccounts: 'ڈیمو اکاؤنٹس'
      },
      
      // Dashboard
      dashboard: {
        overview: 'ڈیش بورڈ جائزہ',
        stateOverview: 'ریاستی جائزہ',
        districtOverview: 'ضلعی جائزہ',
        mandalOverview: 'منڈل جائزہ',
        realTimeInsights: 'شہری انتظام کے لیے حقیقی وقت کی بصیرت اور تجزیات',
        weeklyTrends: 'ہفتہ وار شکایت کے رجحانات',
        complaintCategories: 'شکایت کی اقسام'
      },
      
      // Navigation
      nav: {
        dashboard: 'ڈیش بورڈ',
        complaints: 'شکایات',
        schemes: 'اسکیمز',
        traffic: 'ٹریفک مسائل',
        elderly: 'بزرگوں کی مہارت',
        scamAlerts: 'اسکام الرٹس',
        adminTools: 'ایڈمن ٹولز'
      },
      
      // Stats Cards
      stats: {
        complaintsToday: 'آج کی شکایات',
        activeSchemes: 'فعال اسکیمز',
        registeredElderly: 'رجسٹرڈ بزرگ',
        scamAlertsWeek: 'اسکام الرٹس (ہفتہ)',
        issuesResolvedMonth: 'حل شدہ مسائل (مہینہ)'
      },
      
      // Complaints
      complaints: {
        management: 'شکایت کا انتظام',
        stateManagement: 'ریاستی شکایت کا انتظام',
        districtManagement: 'ضلعی شکایت کا انتظام',
        mandalManagement: 'منڈل شکایت کا انتظام',
        manageRespond: 'عوامی خدمات کی شکایات کا انتظام اور جواب',
        searchPlaceholder: 'نام، عنوان، مقام یا تفصیل سے تلاش کریں...',
        allStatus: 'تمام حالات',
        allCategories: 'تمام اقسام',
        pending: 'زیر التواء',
        inProgress: 'جاری',
        resolved: 'حل ہو گیا',
        total: 'کل',
        exportReport: 'رپورٹ برآمد کریں'
      },
      
      // AI Assistant
      ai: {
        inputPlaceholder: 'شکایات، اسکیمز، ٹریفک یا ایڈمن کاموں کے بارے میں پوچھیں...',
        assistant: 'AI اسسٹنٹ',
        priority: 'ترجیح',
        summary: 'خلاصہ',
        help: 'مدد'
      },
      
      // Common
      common: {
        loading: 'لوڈ ہو رہا ہے...',
        search: 'تلاش کریں...',
        filter: 'فلٹر',
        export: 'برآمد',
        save: 'محفوظ کریں',
        cancel: 'منسوخ کریں',
        close: 'بند کریں',
        view: 'دیکھیں',
        approve: 'منظور کریں',
        reject: 'مسترد کریں',
        assign: 'تفویض کریں',
        markResolved: 'حل شدہ کے طور پر نشان زد کریں'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    // Force re-render on language change
    react: {
      useSuspense: false,
    },
  });

export default i18n;