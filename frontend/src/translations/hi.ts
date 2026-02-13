export const errorMessages = {
  generic: {
    title: "एक त्रुटि हुई",
    retry: "पुनः प्रयास करें",
    close: "बंद करें",
    details: "त्रुटि विवरण",
    report: "समस्या की रिपोर्ट करें"
  },
  network: {
    offline: "आप ऑफ़लाइन हैं",
    timeout: "अनुरोध का समय समाप्त हो गया",
    serverError: "सर्वर में त्रुटि हुई"
  },
  validation: {
    required: "यह फ़ील्ड आवश्यक है",
    invalid: "अमान्य इनपुट",
    tooLong: "इनपुट बहुत लंबा है",
    tooShort: "इनपुट बहुत छोटा है"
  },
  auth: {
    invalidCredentials: "अमान्य उपयोगकर्ता नाम या पासवर्ड",
    sessionExpired: "आपका सत्र समाप्त हो गया है",
    unauthorized: "आप अधिकृत नहीं हैं"
  },
  notFound: {
    title: "पृष्ठ नहीं मिला",
    message: "आप जिस पृष्ठ को खोज रहे हैं वह मौजूद नहीं है",
    backHome: "होम पर वापस जाएं"
  },
  components: {
    form: {
      submitError: "फॉर्म जमा करने में विफल",
      validationError: "कृपया अपना इनपुट जांचें"
    },
    upload: {
      tooLarge: "फ़ाइल बहुत बड़ी है",
      wrongFormat: "असमर्थित फ़ाइल प्रारूप"
    }
  }
} as const;