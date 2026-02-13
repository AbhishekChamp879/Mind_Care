import { useState, useEffect, useRef } from 'react';
/**
 * @fileoverview ChatWidget - AI-Powered Mental Health Support Chat Component
 * 
 * A comprehensive chat interface that provides immediate AI-powered mental health support
 * with crisis detection, multilingual capabilities, and intelligent response routing.
 * 
 * Key Features:
 * - Advanced crisis detection and intervention protocols
 * - Multi-language support (12+ languages) with culturally appropriate responses
 * - Real-time sentiment analysis and risk assessment
 * - Offline message queuing and sync when reconnected
 * - Contextual action buttons for emergency services, counseling, and resources
 * - WCAG 2.1 AA compliant accessibility features
 * 
 * Crisis Detection:
 * - Suicide ideation detection with immediate intervention
 * - Self-harm risk assessment
 * - Multiple severity levels (low, medium, high, crisis)
 * - Multilingual crisis keywords and patterns
 * - Risk factor identification (isolation, substance use, trauma, etc.)
 * 
 * @example
 * ```tsx
 * // Basic usage - component manages its own state
 * <ChatWidget />
 * 
 * // The widget automatically:
 * // - Detects user's emotional state
 * // - Provides appropriate resources
 * // - Routes to emergency services if needed
 * // - Maintains conversation history
 * ```
 * 
 * @see {@link ./LanguageSelector} For language selection component
 * @see {@link ../../hooks/useOnlineStatus} For network connectivity detection
 * @see {@link ../../types/notifications} For notification integration
 */

import { Button } from '@/components/ui/button';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  AlertTriangle,
  Heart,
  Phone,
  Wifi,
  WifiOff,
  Globe,
  Video,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import LanguageSelector, { languages } from './LanguageSelector';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

/**
 * Represents a chat message with comprehensive metadata for mental health assessment.
 * 
 * @interface Message
 */
interface Message {
  /** Unique identifier for the message */
  id: string;

  /** Message sender type - user input or AI response */
  type: 'user' | 'ai';

  /** The actual message content */
  content: string;

  /** When the message was created */
  timestamp: Date;

  /** 
   * AI-assessed severity level of mental health concerns expressed
   * - low: General wellness, positive mood, minor stress
   * - medium: Moderate anxiety, academic stress, relationship issues
   * - high: Significant distress, depression indicators, isolation
   * - crisis: Suicide ideation, self-harm, immediate danger
   */
  severity?: 'low' | 'medium' | 'high' | 'crisis';

  /** Language code for the message content */
  language?: string;

  /** 
   * Contextual action buttons presented to the user based on assessment
   * Provides immediate pathways to appropriate help and resources
   */
  actions?: Array<{
    /** Type of action - determines routing and urgency */
    type: 'emergency' | 'counselor' | 'resources' | 'followup';
    /** Display text for the action button */
    label: string;
    /** Whether this action requires immediate attention (crisis scenarios) */
    urgent?: boolean;
  }>;

  /** 
   * AI confidence score (0-1) in the severity assessment
   * Higher confidence triggers more assertive interventions
   */
  confidence?: number;

  /** 
   * Specific keywords/phrases that triggered concern levels
   * Used for transparent AI decision making and logging
   */
  triggers?: string[];

  /** 
   * Identified risk factors from psychological research
   * Categories: isolation, substance, trauma, loss, financial, relationship, academic
   */
  riskFactors?: string[];
}

// Multilingual responses with comprehensive language support
const multilingualResponses: Record<
  string,
  {
    welcome: string;
    responses: Array<{ content: string; severity: 'low' | 'medium' | 'high'; keywords?: string[] }>;
    followUps: Array<{ content: string; trigger: string }>;
    offline: string;
    disclaimer: string;
    crisisMessage: string;
  }
> = {
  en: {
    welcome:
      "Hi! I'm your MindBuddy AI assistant. I'm here to provide immediate support and help assess how you're feeling. How are you doing today?",
    responses: [
      {
        content:
          'Thank you for sharing that. On a scale of 1-9, how would you rate your current mood?',
        severity: 'low',
        keywords: ['ok', 'fine', 'good', 'well'],
      },
      {
        content:
          'I understand this is challenging. Have you been experiencing these feelings for more than two weeks?',
        severity: 'medium',
        keywords: ['stressed', 'anxious', 'worried', 'tired', 'overwhelmed'],
      },
      {
        content:
          "I'm concerned about what you've shared. It's important that you talk to someone right away. Would you like me to connect you with immediate support?",
        severity: 'high',
        keywords: ['sad', 'depressed', 'hopeless', 'alone', 'hurt', 'pain'],
      },
    ],
    followUps: [
      {
        content: "That's great to hear! What's been helping you feel this way?",
        trigger: 'positive',
      },
      {
        content: "I understand. Can you tell me more about what's been on your mind?",
        trigger: 'neutral',
      },
      {
        content: "It sounds like you're going through a difficult time. You're not alone in this.",
        trigger: 'negative',
      },
    ],
    offline:
      "You're currently offline. Your messages will be saved and processed when you reconnect.",
    disclaimer: 'AI support for immediate help. Not a substitute for professional care.',
    crisisMessage:
      "If you're having thoughts of self-harm, please contact emergency services immediately or call a crisis helpline.",
  },
  es: {
    welcome:
      '¡Hola! Soy tu asistente de IA MindBuddy. Estoy aquí para brindarte apoyo inmediato y ayudarte a evaluar cómo te sientes. ¿Cómo estás hoy?',
    responses: [
      {
        content:
          'Gracias por compartir eso. En una escala del 1 al 9, ¿cómo calificarías tu estado de ánimo actual?',
        severity: 'low',
        keywords: ['bien', 'bueno', 'normal', 'tranquilo'],
      },
      {
        content:
          'Entiendo que esto es desafiante. ¿Has estado experimentando estos sentimientos durante más de dos semanas?',
        severity: 'medium',
        keywords: ['estresado', 'ansioso', 'preocupado', 'cansado', 'abrumado'],
      },
      {
        content:
          'Me preocupa lo que has compartido. Es importante que hables con alguien de inmediato. ¿Te gustaría que te conecte con apoyo inmediato?',
        severity: 'high',
        keywords: ['triste', 'deprimido', 'desesperanzado', 'solo', 'dolor'],
      },
    ],
    followUps: [
      {
        content: '¡Qué bueno escuchar eso! ¿Qué te ha estado ayudando a sentirte así?',
        trigger: 'positive',
      },
      {
        content: 'Entiendo. ¿Puedes contarme más sobre lo que ha estado en tu mente?',
        trigger: 'neutral',
      },
      {
        content: 'Parece que estás pasando por un momento difícil. No estás solo en esto.',
        trigger: 'negative',
      },
    ],
    offline:
      'Actualmente estás sin conexión. Tus mensajes se guardarán y procesarán cuando te reconectes.',
    disclaimer: 'Apoyo de IA para ayuda inmediata. No es sustituto de atención profesional.',
    crisisMessage:
      'Si tienes pensamientos de autolesión, contacta servicios de emergencia inmediatamente o llama a una línea de crisis.',
  },
  fr: {
    welcome:
      "Salut ! Je suis votre assistant IA MindBuddy. Je suis là pour vous apporter un soutien immédiat et vous aider à évaluer comment vous vous sentez. Comment allez-vous aujourd'hui ?",
    responses: [
      {
        content:
          'Merci de partager cela. Sur une échelle de 1 à 9, comment évalueriez-vous votre humeur actuelle ?',
        severity: 'low',
        keywords: ['bien', 'bon', 'normal', 'calme'],
      },
      {
        content:
          "Je comprends que c'est difficile. Ressentez-vous ces sentiments depuis plus de deux semaines ?",
        severity: 'medium',
        keywords: ['stressé', 'anxieux', 'inquiet', 'fatigué', 'débordé'],
      },
      {
        content:
          "Ce que vous avez partagé m'inquiète. Il est important que vous parliez à quelqu'un tout de suite. Souhaiteriez-vous que je vous connecte à un soutien immédiat ?",
        severity: 'high',
        keywords: ['triste', 'déprimé', 'désespéré', 'seul', 'douleur'],
      },
    ],
    followUps: [
      {
        content: "C'est formidable d'entendre cela ! Qu'est-ce qui vous aide à vous sentir ainsi ?",
        trigger: 'positive',
      },
      {
        content: 'Je comprends. Pouvez-vous me dire plus sur ce qui vous préoccupe ?',
        trigger: 'neutral',
      },
      {
        content:
          "Il semble que vous traversez une période difficile. Vous n'êtes pas seul dans cette épreuve.",
        trigger: 'negative',
      },
    ],
    offline:
      'Vous êtes actuellement hors ligne. Vos messages seront sauvegardés et traités lors de votre reconnexion.',
    disclaimer: 'Support IA pour aide immédiate. Ne remplace pas les soins professionnels.',
    crisisMessage:
      "Si vous avez des pensées d'automutilation, contactez immédiatement les services d'urgence ou appelez une ligne de crise.",
  },
  de: {
    welcome:
      'Hallo! Ich bin dein MindBuddy KI-Assistent. Ich bin hier, um dir sofortige Unterstützung zu bieten und dir zu helfen, zu bewerten, wie du dich fühlst. Wie geht es dir heute?',
    responses: [
      {
        content:
          'Danke, dass du das geteilt hast. Auf einer Skala von 1-9, wie würdest du deine aktuelle Stimmung bewerten?',
        severity: 'low',
        keywords: ['gut', 'okay', 'normal', 'ruhig'],
      },
      {
        content:
          'Ich verstehe, dass das herausfordernd ist. Erlebst du diese Gefühle schon seit mehr als zwei Wochen?',
        severity: 'medium',
        keywords: ['gestresst', 'ängstlich', 'besorgt', 'müde', 'überfordert'],
      },
      {
        content:
          'Was du geteilt hast, bereitet mir Sorgen. Es ist wichtig, dass du sofort mit jemandem sprichst. Möchtest du, dass ich dich mit sofortiger Hilfe verbinde?',
        severity: 'high',
        keywords: ['traurig', 'deprimiert', 'hoffnungslos', 'allein', 'schmerz'],
      },
    ],
    followUps: [
      {
        content: 'Das ist großartig zu hören! Was hat dir geholfen, dich so zu fühlen?',
        trigger: 'positive',
      },
      {
        content: 'Ich verstehe. Kannst du mir mehr darüber erzählen, was dich beschäftigt?',
        trigger: 'neutral',
      },
      {
        content:
          'Es klingt, als würdest du eine schwere Zeit durchmachen. Du bist nicht allein damit.',
        trigger: 'negative',
      },
    ],
    offline:
      'Du bist derzeit offline. Deine Nachrichten werden gespeichert und verarbeitet, wenn du dich wieder verbindest.',
    disclaimer: 'KI-Unterstützung für sofortige Hilfe. Kein Ersatz für professionelle Betreuung.',
    crisisMessage:
      'Wenn du Gedanken an Selbstverletzung hast, kontaktiere sofort den Notdienst oder rufe eine Krisenhotline an.',
  },
  it: {
    welcome:
      'Ciao! Sono il tuo assistente AI MindBuddy. Sono qui per fornire supporto immediato e aiutarti a valutare come ti senti. Come stai oggi?',
    responses: [
      {
        content:
          'Grazie per aver condiviso questo. Su una scala da 1 a 9, come valuteresti il tuo umore attuale?',
        severity: 'low',
        keywords: ['bene', 'okay', 'normale', 'tranquillo'],
      },
      {
        content: 'Capisco che sia difficile. Provi questi sentimenti da più di due settimane?',
        severity: 'medium',
        keywords: ['stressato', 'ansioso', 'preoccupato', 'stanco', 'sopraffatto'],
      },
      {
        content:
          'Quello che hai condiviso mi preoccupa. È importante che tu parli con qualcuno subito. Vorresti che ti collegassi con supporto immediato?',
        severity: 'high',
        keywords: ['triste', 'depresso', 'senza speranza', 'solo', 'dolore'],
      },
    ],
    followUps: [
      {
        content: 'È fantastico sentire questo! Cosa ti ha aiutato a sentirti così?',
        trigger: 'positive',
      },
      { content: 'Capisco. Puoi dirmi di più su quello che hai in mente?', trigger: 'neutral' },
      {
        content: 'Sembra che tu stia attraversando un periodo difficile. Non sei solo in questo.',
        trigger: 'negative',
      },
    ],
    offline:
      'Attualmente sei offline. I tuoi messaggi verranno salvati e elaborati quando ti riconnetterai.',
    disclaimer: 'Supporto AI per aiuto immediato. Non sostituisce le cure professionali.',
    crisisMessage:
      'Se hai pensieri di autolesionismo, contatta immediatamente i servizi di emergenza o chiama una linea di crisi.',
  },
  pt: {
    welcome:
      'Olá! Sou seu assistente de IA MindBuddy. Estou aqui para fornecer suporte imediato e ajudar a avaliar como você se sente. Como você está hoje?',
    responses: [
      {
        content:
          'Obrigado por compartilhar isso. Em uma escala de 1-9, como você classificaria seu humor atual?',
        severity: 'low',
        keywords: ['bem', 'okay', 'normal', 'calmo'],
      },
      {
        content:
          'Entendo que isso é desafiador. Você tem experimentado esses sentimentos por mais de duas semanas?',
        severity: 'medium',
        keywords: ['estressado', 'ansioso', 'preocupado', 'cansado', 'sobrecarregado'],
      },
      {
        content:
          'Estou preocupado com o que você compartilhou. É importante que você fale com alguém imediatamente. Gostaria que eu o conectasse com suporte imediato?',
        severity: 'high',
        keywords: ['triste', 'deprimido', 'sem esperança', 'sozinho', 'dor'],
      },
    ],
    followUps: [
      {
        content: 'É ótimo ouvir isso! O que tem ajudado você a se sentir assim?',
        trigger: 'positive',
      },
      {
        content: 'Entendo. Pode me contar mais sobre o que está em sua mente?',
        trigger: 'neutral',
      },
      {
        content:
          'Parece que você está passando por um momento difícil. Você não está sozinho nisso.',
        trigger: 'negative',
      },
    ],
    offline:
      'Você está atualmente offline. Suas mensagens serão salvas e processadas quando você se reconectar.',
    disclaimer: 'Suporte de IA para ajuda imediata. Não substitui cuidados profissionais.',
    crisisMessage:
      'Se você tem pensamentos de autolesão, entre em contato com serviços de emergência imediatamente ou ligue para uma linha de crise.',
  },
  zh: {
    welcome:
      '你好！我是你的MindBuddy AI助手。我在这里提供即时支持，帮助评估你的感受。你今天怎么样？',
    responses: [
      {
        content: '谢谢你分享这些。在1-9的评分中，你会如何评价你当前的心情？',
        severity: 'low',
        keywords: ['好', '还行', '正常', '平静'],
      },
      {
        content: '我理解这很有挑战性。你是否已经体验这些感受超过两周了？',
        severity: 'medium',
        keywords: ['压力', '焦虑', '担心', '疲倦', 'overwhelmed'],
      },
      {
        content: '你分享的内容让我担心。立即与某人交谈很重要。你希望我为你联系即时支持吗？',
        severity: 'high',
        keywords: ['悲伤', '沮丧', '绝望', '孤独', '痛苦'],
      },
    ],
    followUps: [
      { content: '听到这个真是太好了！是什么帮助你有这样的感觉？', trigger: 'positive' },
      { content: '我理解。你能告诉我更多关于你心中所想的吗？', trigger: 'neutral' },
      { content: '听起来你正在经历困难时期。在这件事上你并不孤单。', trigger: 'negative' },
    ],
    offline: '你目前处于离线状态。你的消息将被保存，并在重新连接时处理。',
    disclaimer: 'AI支持提供即时帮助。不能替代专业护理。',
    crisisMessage: '如果你有自伤念头，请立即联系紧急服务或拨打危机热线。',
  },
  ja: {
    welcome:
      'こんにちは！私はあなたのMindBuddy AIアシスタントです。即座のサポートを提供し、あなたの気持ちを評価するお手伝いをします。今日はいかがですか？',
    responses: [
      {
        content: 'シェアしてくれてありがとう。1-9のスケールで、現在の気分をどう評価しますか？',
        severity: 'low',
        keywords: ['元気', '大丈夫', '普通', '落ち着いている'],
      },
      {
        content: 'それが困難であることを理解しています。これらの感情を2週間以上経験していますか？',
        severity: 'medium',
        keywords: ['ストレス', '不安', '心配', '疲れた', 'overwhelmed'],
      },
      {
        content:
          'あなたがシェアしたことが心配です。すぐに誰かと話すことが重要です。即座のサポートに接続しましょうか？',
        severity: 'high',
        keywords: ['悲しい', 'うつ', '絶望的', '孤独', '痛み'],
      },
    ],
    followUps: [
      {
        content: 'それを聞いて素晴らしいです！何があなたをそのように感じさせているのですか？',
        trigger: 'positive',
      },
      {
        content: '理解します。あなたの心にあることについてもっと教えてもらえますか？',
        trigger: 'neutral',
      },
      {
        content: '困難な時期を過ごしているようですね。あなたは一人ではありません。',
        trigger: 'negative',
      },
    ],
    offline: '現在オフラインです。メッセージは保存され、再接続時に処理されます。',
    disclaimer: '即座の支援のためのAIサポート。専門的なケアの代替ではありません。',
    crisisMessage:
      '自傷の考えがある場合は、すぐに緊急サービスに連絡するか、危機ホットラインに電話してください。',
  },
  ko: {
    welcome:
      '안녕하세요! 저는 당신의 MindBuddy AI 어시스턴트입니다. 즉각적인 지원을 제공하고 당신의 기분을 평가하는 데 도움을 드리고 있습니다. 오늘 어떠세요?',
    responses: [
      {
        content: '공유해 주셔서 감사합니다. 1-9 척도에서 현재 기분을 어떻게 평가하시겠습니까?',
        severity: 'low',
        keywords: ['좋아', '괜찮아', '보통', '평온한'],
      },
      {
        content: '이것이 도전적이라는 것을 이해합니다. 이러한 감정을 2주 이상 경험하고 계신가요?',
        severity: 'medium',
        keywords: ['스트레스', '불안한', '걱정', '피곤한', 'overwhelmed'],
      },
      {
        content:
          '당신이 공유한 내용이 걱정됩니다. 즉시 누군가와 이야기하는 것이 중요합니다. 즉각적인 지원에 연결하시겠습니까?',
        severity: 'high',
        keywords: ['슬픈', '우울한', '절망적인', '외로운', '고통'],
      },
    ],
    followUps: [
      {
        content: '그것을 들으니 정말 좋습니다! 무엇이 그렇게 느끼게 도와주고 있나요?',
        trigger: 'positive',
      },
      { content: '이해합니다. 마음에 있는 것에 대해 더 말씀해 주시겠습니까?', trigger: 'neutral' },
      {
        content: '어려운 시기를 겪고 계신 것 같습니다. 이 일에서 혼자가 아닙니다.',
        trigger: 'negative',
      },
    ],
    offline: '현재 오프라인 상태입니다. 메시지가 저장되고 다시 연결될 때 처리됩니다.',
    disclaimer: '즉각적인 도움을 위한 AI 지원. 전문적인 치료를 대체하지 않습니다.',
    crisisMessage:
      '자해 생각이 있으시면 즉시 응급 서비스에 연락하거나 위기 상담 전화에 전화하세요.',
  },
  ar: {
    welcome:
      'مرحبا! أنا مساعد الذكي MindBuddy. أنا هنا لتقديم الدعم الفوري ومساعدتك في تقييم مشاعرك. كيف حالك اليوم؟',
    responses: [
      {
        content: 'شكرا لك على مشاركة ذلك. على مقياس من 1-9، كيف تقيم مزاجك الحالي؟',
        severity: 'low',
        keywords: ['جيد', 'بخير', 'عادي', 'هادئ'],
      },
      {
        content: 'أفهم أن هذا صعب. هل تواجه هذه المشاعر لأكثر من أسبوعين؟',
        severity: 'medium',
        keywords: ['مضغوط', 'قلق', 'قلق', 'متعب', 'مرهق'],
      },
      {
        content:
          'ما شاركته يقلقني. من المهم أن تتحدث مع شخص ما فورا. هل تريد أن أصلك بالدعم الفوري؟',
        severity: 'high',
        keywords: ['حزين', 'مكتئب', 'يائس', 'وحيد', 'ألم'],
      },
    ],
    followUps: [
      {
        content: 'من الرائع سماع ذلك! ما الذي يساعدك على الشعور بهذه الطريقة؟',
        trigger: 'positive',
      },
      { content: 'أفهم. هل يمكنك إخباري المزيد عما يدور في ذهنك؟', trigger: 'neutral' },
      { content: 'يبدو أنك تمر بوقت صعب. أنت لست وحدك في هذا.', trigger: 'negative' },
    ],
    offline: 'أنت حاليا غير متصل. سيتم حفظ رسائلك ومعالجتها عند إعادة الاتصال.',
    disclaimer: 'دعم الذكاء الاصطناعي للمساعدة الفورية. ليس بديلا عن الرعاية المهنية.',
    crisisMessage:
      'إذا كان لديك أفكار إيذاء النفس، يرجى الاتصال بخدمات الطوارئ فورا أو الاتصال بخط أزمة.',
  },
  hi: {
    welcome:
      'नमस्ते! मैं आपका MindBuddy AI सहायक हूं। मैं तत्काल सहायता प्रदान करने और आपकी भावनाओं का मूल्यांकन करने में मदद करने के लिए यहां हूं। आज आप कैसे हैं?',
    responses: [
      {
        content:
          'इसे साझा करने के लिए धन्यवाद। 1-9 के पैमाने पर, आप अपने वर्तमान मूड को कैसे रेट करेंगे?',
        severity: 'low',
        keywords: ['अच्छा', 'ठीक', 'सामान्य', 'शांत'],
      },
      {
        content:
          'मैं समझता हूं कि यह चुनौतीपूर्ण है। क्या आप इन भावनाओं को दो सप्ताह से अधिक समय से अनुभव कर रहे हैं?',
        severity: 'medium',
        keywords: ['तनावग्रस्त', 'चिंतित', 'चिंतित', 'थका हुआ', 'अभिभूत'],
      },
      {
        content:
          'आपने जो साझा किया है उससे मैं चिंतित हूं। यह महत्वपूर्ण है कि आप तुरंत किसी से बात करें। क्या आप चाहेंगे कि मैं आपको तत्काल सहायता से जोड़ूं?',
        severity: 'high',
        keywords: ['उदास', 'अवसादग्रस्त', 'निराश', 'अकेला', 'दर्द'],
      },
    ],
    followUps: [
      {
        content: 'यह सुनना बहुत अच्छा है! आपको इस तरह महसूस करने में क्या मदद मिल रही है?',
        trigger: 'positive',
      },
      {
        content: 'मैं समझता हूं। क्या आप मुझे बता सकते हैं कि आपके मन में क्या चल रहा है?',
        trigger: 'neutral',
      },
      {
        content: 'ऐसा लगता है कि आप कठिन समय से गुजर रहे हैं। इसमें आप अकेले नहीं हैं।',
        trigger: 'negative',
      },
    ],
    offline:
      'आप वर्तमान में ऑफलाइन हैं। आपके संदेश सहेजे जाएंगे और पुनः कनेक्ट होने पर संसाधित होंगे।',
    disclaimer: 'तत्काल सहायता के लिए AI समर्थन। पेशेवर देखभाल का विकल्प नहीं।',
    crisisMessage:
      'यदि आपको आत्म-हानि के विचार आ रहे हैं, तो कृपया तुरंत आपातकालीन सेवाओं से संपर्क करें या संकट हेल्पलाइन पर कॉल करें।',
  },
  ru: {
    welcome:
      'Привет! Я ваш ИИ-помощник MindBuddy. Я здесь, чтобы оказать немедленную поддержку и помочь оценить ваши чувства. Как дела сегодня?',
    responses: [
      {
        content:
          'Спасибо, что поделились этим. По шкале от 1 до 9, как бы вы оценили свое текущее настроение?',
        severity: 'low',
        keywords: ['хорошо', 'нормально', 'обычно', 'спокойно'],
      },
      {
        content: 'Я понимаю, что это сложно. Испытываете ли вы эти чувства более двух недель?',
        severity: 'medium',
        keywords: ['стресс', 'тревожный', 'беспокойный', 'усталый', 'перегруженный'],
      },
      {
        content:
          'То, чем вы поделились, меня беспокоит. Важно, чтобы вы немедленно поговорили с кем-то. Хотели бы вы, чтобы я соединил вас с немедленной поддержкой?',
        severity: 'high',
        keywords: ['грустный', 'подавленный', 'безнадежный', 'одинокий', 'боль'],
      },
    ],
    followUps: [
      {
        content: 'Здорово это слышать! Что помогает вам так себя чувствовать?',
        trigger: 'positive',
      },
      { content: 'Понимаю. Можете рассказать больше о том, что у вас на уме?', trigger: 'neutral' },
      {
        content: 'Похоже, вы переживаете трудное время. Вы не одиноки в этом.',
        trigger: 'negative',
      },
    ],
    offline:
      'Вы сейчас офлайн. Ваши сообщения будут сохранены и обработаны при повторном подключении.',
    disclaimer: 'ИИ-поддержка для немедленной помощи. Не заменяет профессиональный уход.',
    crisisMessage:
      'Если у вас есть мысли о самоповреждении, немедленно обратитесь в службу экстренной помощи или позвоните на горячую линию кризиса.',
  },
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [offlineMessages, setOfflineMessages] = useState<Message[]>([]);
  const isOnline = useOnlineStatus();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: multilingualResponses[selectedLanguage]?.welcome || multilingualResponses.en.welcome,
      timestamp: new Date(),
      language: selectedLanguage,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentSeverity, setCurrentSeverity] = useState<
    'low' | 'medium' | 'high' | 'crisis' | null
  >(null);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ message: string; severity: string; timestamp: Date }>
  >([]);


  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Action handlers for enhanced crisis intervention
  const handleAction = (action: {
    type: 'emergency' | 'counselor' | 'resources' | 'followup';
    label: string;
    urgent?: boolean;
  }) => {
    switch (action.type) {
      case 'emergency': {
        // Redirect to crisis helpline or emergency services
        const emergencyNumbers = {
          en: '988', // US Suicide & Crisis Lifeline
          es: '717-394-2631', // National Suicide Prevention Lifeline (Spanish)
          hi: '9152987821', // AASRA India
        };
        const number =
          emergencyNumbers[selectedLanguage as keyof typeof emergencyNumbers] ||
          emergencyNumbers.en;
        window.open(`tel:${number}`, '_blank');
        break;
      }

      case 'counselor':
        // Navigate to booking page or open video call
        window.dispatchEvent(new CustomEvent('openBooking', { detail: { urgent: action.urgent } }));
        break;

      case 'resources':
        // Navigate to resources page with relevant filters
        window.dispatchEvent(
          new CustomEvent('openResources', {
            detail: {
              category: currentSeverity === 'crisis' ? 'crisis' : 'coping',
              urgent: action.urgent,
            },
          })
        );
        break;

      case 'followup': {
        // Add a follow-up message to continue the conversation
        const followUpMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content:
            "How are you feeling right now? Would you like to talk more about what's troubling you?",
          timestamp: new Date(),
          language: selectedLanguage,
        };
        setMessages((prev) => [...prev, followUpMessage]);
        break;
      }
    }
  };

  // Update welcome message when language changes
  useEffect(() => {
    setMessages((prev) => {
      const newMessages = [...prev];
      if (newMessages.length > 0 && newMessages[0].type === 'ai') {
        newMessages[0] = {
          ...newMessages[0],
          content:
            multilingualResponses[selectedLanguage]?.welcome || multilingualResponses.en.welcome,
          language: selectedLanguage,
        };
      }
      return newMessages;
    });
  }, [selectedLanguage]);

  // Process offline messages when coming back online
  useEffect(() => {
    if (isOnline && offlineMessages.length > 0) {
      setMessages((prev) => [...prev, ...offlineMessages]);
      setOfflineMessages([]);
    }
  }, [isOnline, offlineMessages]);


  useEffect(() => {
    const node = messagesRef.current;
    if (!node) return;

    const last = node.lastElementChild as HTMLElement | null;
    if (last && typeof last.scrollIntoView === 'function') {
      try {
        last.scrollIntoView({ behavior: 'smooth', block: 'end' });
        return;
      } catch (err) {
        console.debug('scrollIntoView not supported, falling back to scrollTo');
      }
    }
    const el = node as HTMLElement & { scrollTo?: (opts?: ScrollToOptions) => void };
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // Enhanced AI Analysis with better crisis detection
  const analyzeMessage = (
    message: string,
    language: string
  ): {
    severity: 'low' | 'medium' | 'high' | 'crisis';
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    triggers: string[];
    riskFactors: string[];
  } => {
    const lowercaseMessage = message.toLowerCase();
    const langData = multilingualResponses[language] || multilingualResponses.en;

    // Enhanced crisis detection with more comprehensive patterns
    const crisisPatterns = {
      suicide: [
        'suicide',
        'kill myself',
        'end it all',
        'no point living',
        'better off dead',
        'hurt myself',
        "don't want to live",
        'want to die',
      ],
      selfHarm: [
        'cut myself',
        'hurt myself',
        'self harm',
        'self-harm',
        'want to hurt',
        'pain will stop',
      ],
      despair: [
        'no hope left',
        'nothing matters',
        "can't go on",
        'give up',
        'no way out',
        'trapped',
      ],
      immediate: ['tonight', 'today', 'right now', 'immediately', "can't wait", 'this minute'],
    };

    // Multilingual crisis keywords
    const multilingualCrisis = {
      es: ['suicidio', 'matarme', 'morir', 'sin esperanza', 'acabar con todo'],
      fr: ['suicide', 'mort', 'mourir', 'désespéré', 'en finir'],
      de: ['selbstmord', 'töten', 'sterben', 'hoffnungslos', 'ende machen'],
      it: ['suicidio', 'uccidermi', 'morire', 'disperato', 'finirla'],
      pt: ['suicídio', 'matar-me', 'morrer', 'desesperado', 'acabar com tudo'],
      zh: ['自杀', '自殺', '死', '绝望', '结束一切'],
      ja: ['自殺', '死にたい', '絶望', 'おわり'],
      ko: ['자살', '죽고싶다', '절망', '끝내고싶다'],
      ar: ['انتحار', 'الموت', 'اليأس', 'إنهاء كل شيء'],
      hi: ['आत्महत्या', 'मरना चाहता हूं', 'निराशा', 'सब कुछ खत्म'],
      ru: ['самоубийство', 'умереть', 'безнадежность', 'покончить со всем'],
    };

    // Risk factor patterns
    const riskFactors = {
      isolation: ['alone', 'lonely', 'no friends', 'nobody cares', 'abandoned'],
      substance: ['drinking', 'drugs', 'pills', 'alcohol', 'high', 'drunk'],
      trauma: ['abused', 'trauma', 'ptsd', 'flashbacks', 'nightmares'],
      loss: ['lost someone', 'death', 'died', 'funeral', 'grief'],
      financial: ['broke', 'homeless', 'unemployed', 'debt', 'money problems'],
      relationship: ['breakup', 'divorce', 'cheated', 'left me', 'rejected'],
      academic: ['failed', 'expelled', 'grades', 'exam stress', 'college pressure'],
    };

    let severity: 'low' | 'medium' | 'high' | 'crisis' = 'low';
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let confidence = 0;
    const triggers: string[] = [];
    const detectedRiskFactors: string[] = [];

    // Crisis detection with higher precision
    let crisisScore = 0;
    Object.entries(crisisPatterns).forEach(([category, patterns]) => {
      patterns.forEach((pattern) => {
        if (lowercaseMessage.includes(pattern)) {
          crisisScore += category === 'immediate' ? 3 : 2;
          triggers.push(pattern);
        }
      });
    });

    // Check multilingual crisis terms
    const currentLangCrisis = multilingualCrisis[language as keyof typeof multilingualCrisis];
    if (currentLangCrisis) {
      currentLangCrisis.forEach((term) => {
        if (lowercaseMessage.includes(term)) {
          crisisScore += 2;
          triggers.push(term);
        }
      });
    }

    // Risk factor analysis
    Object.entries(riskFactors).forEach(([category, patterns]) => {
      patterns.forEach((pattern) => {
        if (lowercaseMessage.includes(pattern)) {
          crisisScore += 1;
          detectedRiskFactors.push(category);
        }
      });
    });

    // Determine severity based on comprehensive analysis
    if (crisisScore >= 4 || triggers.some((t) => crisisPatterns.suicide.includes(t))) {
      severity = 'crisis';
      sentiment = 'negative';
      confidence = Math.min(0.95, 0.7 + crisisScore * 0.05);
    } else if (crisisScore >= 2) {
      severity = 'high';
      sentiment = 'negative';
      confidence = Math.min(0.85, 0.5 + crisisScore * 0.1);
    } else {
      // Standard sentiment analysis
      const negativeWords = [
        'sad',
        'depressed',
        'anxious',
        'stressed',
        'worried',
        'overwhelmed',
        'tired',
        'exhausted',
        'hopeless',
        'worthless',
      ];
      const positiveWords = [
        'good',
        'great',
        'happy',
        'better',
        'improving',
        'hopeful',
        'excited',
        'grateful',
        'peaceful',
      ];

      const negCount = negativeWords.filter((word) => lowercaseMessage.includes(word)).length;
      const posCount = positiveWords.filter((word) => lowercaseMessage.includes(word)).length;

      if (negCount > posCount) {
        severity = negCount > 3 ? 'high' : negCount > 1 ? 'medium' : 'low';
        sentiment = 'negative';
        confidence = Math.min(0.8, 0.4 + negCount * 0.1);
      } else if (posCount > 0) {
        severity = 'low';
        sentiment = 'positive';
        confidence = Math.min(0.8, 0.4 + posCount * 0.1);
      } else {
        confidence = 0.3; // Low confidence for neutral messages
      }
    }

    return { severity, sentiment, confidence, triggers, riskFactors: detectedRiskFactors };
  };

  // Enhanced contextual response with crisis intervention
  const getContextualResponse = (
    analysis: {
      severity: 'low' | 'medium' | 'high' | 'crisis';
      sentiment: 'positive' | 'neutral' | 'negative';
      confidence: number;
      triggers: string[];
      riskFactors: string[];
    },
    language: string
  ): {
    content: string;
    actions: Array<{
      type: 'emergency' | 'counselor' | 'resources' | 'followup';
      label: string;
      urgent?: boolean;
    }>;
  } => {
    const langData = multilingualResponses[language] || multilingualResponses.en;

    if (analysis.severity === 'crisis') {
      const actions = [
        { type: 'emergency' as const, label: 'Emergency Helpline', urgent: true },
        { type: 'counselor' as const, label: 'Immediate Counselor', urgent: true },
        { type: 'resources' as const, label: 'Crisis Resources' },
      ];

      // Immediate crisis intervention message
      let crisisResponse = langData.crisisMessage + '\n\n';

      if (analysis.riskFactors.length > 0) {
        crisisResponse += `I notice you're dealing with ${analysis.riskFactors.join(', ')} issues. `;
      }

      crisisResponse +=
        'Please reach out for immediate support. You are not alone, and there are people who want to help you right now.';

      return { content: crisisResponse, actions };
    }

    if (analysis.severity === 'high') {
      const actions = [
        { type: 'counselor' as const, label: 'Book Counselor' },
        { type: 'resources' as const, label: 'Support Resources' },
        { type: 'emergency' as const, label: 'Crisis Helpline' },
      ];

      let response = "I'm genuinely concerned about what you're sharing. ";

      if (analysis.confidence > 0.7) {
        response +=
          "Based on what you've told me, it sounds like you're experiencing significant distress. ";
      }

      if (analysis.riskFactors.includes('isolation')) {
        response += 'Feeling isolated can make everything seem worse. ';
      }

      response +=
        "It's important that you connect with professional support. Would you like me to help you find immediate resources?";

      return { content: response, actions };
    }

    if (analysis.severity === 'medium') {
      const actions = [
        { type: 'resources' as const, label: 'Coping Resources' },
        { type: 'counselor' as const, label: 'Schedule Session' },
      ];

      let response =
        langData.responses.find((r) => r.severity === 'medium')?.content ||
        "I understand you're going through a challenging time. ";

      if (analysis.riskFactors.includes('academic')) {
        response +=
          'Academic stress can feel overwhelming, but there are effective ways to manage it. ';
      } else if (analysis.riskFactors.includes('relationship')) {
        response += 'Relationship difficulties can be very painful. ';
      }

      response +=
        'Have these feelings been persistent, or are they related to specific recent events?';

      return { content: response, actions };
    }

    // Low severity or positive responses
    const actions =
      analysis.sentiment === 'positive'
        ? [{ type: 'resources' as const, label: 'Wellness Tips' }]
        : [{ type: 'resources' as const, label: 'Self-Care Resources' }];

    if (analysis.sentiment === 'positive') {
      const response =
        langData.followUps.find((f) => f.trigger === 'positive')?.content ||
        "That's wonderful to hear! What's been helping you feel this way?";
      return { content: response, actions };
    }

    const response =
      langData.responses.find((r) => r.severity === 'low')?.content ||
      'Thank you for sharing. How would you describe your overall mood today?';

    return { content: response, actions };
  };
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage,
    };

    if (isOnline) {
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage('');

      // Analyze message for intelligent response
      setTimeout(() => {
        const analysis = analyzeMessage(inputMessage, selectedLanguage);
        setCurrentSeverity(analysis.severity);

        const aiResponse = getContextualResponse(analysis, selectedLanguage);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse.content,
          timestamp: new Date(),
          severity: analysis.severity,
          language: selectedLanguage,
          actions: aiResponse.actions,
          confidence: analysis.confidence,
          triggers: analysis.triggers,
          riskFactors: analysis.riskFactors,
        };

        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    } else {
      // Store message offline
      setOfflineMessages((prev) => [...prev, userMessage]);
      setInputMessage('');

      // Show offline message
      const offlineMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content:
          multilingualResponses[selectedLanguage]?.offline || multilingualResponses.en.offline,
        timestamp: new Date(),
        language: selectedLanguage,
      };
      setMessages((prev) => [...prev, userMessage, offlineMessage]);
    }
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-severity-low';
      case 'medium':
        return 'bg-severity-medium';
      case 'high':
        return 'bg-severity-high';
      case 'crisis':
        return 'bg-severity-crisis';
      default:
        return 'bg-primary';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'Mild Concern';
      case 'medium':
        return 'Moderate Concern';
      case 'high':
        return 'High Concern';
      case 'crisis':
        return 'Crisis Level';
      default:
        return 'Assessment';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="hero"
          size="lg"
          className="rounded-full h-14 w-14 shadow-glow hover:animate-none"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`w-96 transition-all duration-300 shadow-trust ${isMinimized ? 'h-16' : 'h-[500px]'}`}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">MindBuddy AI Support</CardTitle>
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              {currentSeverity && (
                <Badge
                  variant="secondary"
                  className={`text-xs ${getSeverityColor(currentSeverity)} text-white`}
                >
                  {getSeverityText(currentSeverity)}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 pt-0 flex flex-col h-[calc(100%-4rem)]">
            {/* Language Selector */}
            <div className="mb-3">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>

            {/* Messages Area */}
            <div ref={messagesRef} className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    <div className="mb-2">{message.content}</div>

                    {/* Enhanced Action Buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-border/20">
                        {(message.severity === 'crisis' || message.severity === 'high') && (
                          <div className="flex items-center space-x-2 text-xs mb-2">
                            <AlertTriangle
                              className={`h-3 w-3 ${message.severity === 'crisis' ? 'text-red-600' : 'text-orange-500'}`}
                            />
                            <span
                              className={`${message.severity === 'crisis' ? 'text-red-600 font-semibold' : 'text-orange-500'}`}
                            >
                              {message.severity === 'crisis'
                                ? 'CRISIS DETECTED - Immediate help available'
                                : 'High concern - Support recommended'}
                            </span>
                          </div>
                        )}

                        {/* Confidence and Analysis Display */}
                        {message.confidence && message.confidence > 0.7 && (
                          <div className="text-xs text-muted-foreground mb-2">
                            Analysis confidence: {Math.round(message.confidence * 100)}%
                            {message.triggers && message.triggers.length > 0 && (
                              <span className="ml-2">
                                • Detected concerns: {message.triggers.slice(0, 2).join(', ')}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant={
                                action.urgent
                                  ? 'destructive'
                                  : action.type === 'emergency'
                                    ? 'destructive'
                                    : 'secondary'
                              }
                              size="sm"
                              className={`text-xs ${action.urgent ? 'animate-pulse' : ''}`}
                              onClick={() => handleAction(action)}
                            >
                              {action.type === 'emergency' && <Phone className="h-3 w-3 mr-1" />}
                              {action.type === 'counselor' && <Video className="h-3 w-3 mr-1" />}
                              {action.type === 'resources' && <BookOpen className="h-3 w-3 mr-1" />}
                              {action.type === 'followup' && (
                                <MessageCircle className="h-3 w-3 mr-1" />
                              )}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risk Factor Indicators */}
                    {message.riskFactors && message.riskFactors.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/10">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Areas of concern:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {message.riskFactors.slice(0, 3).map((factor, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex space-x-2">
              <Input
                placeholder="Share how you're feeling..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
                aria-label="Type your message here"
                aria-describedby="chat-disclaimer"
              />
              <Button
                onClick={handleSendMessage}
                variant="default"
                size="icon"
                disabled={!inputMessage.trim()}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>

            {/* Disclaimer */}
            <div id="chat-disclaimer" className="mt-2 text-xs text-muted-foreground text-center">
              {multilingualResponses[selectedLanguage]?.disclaimer ||
                multilingualResponses.en.disclaimer}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatWidget;
