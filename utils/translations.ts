// Define a type for the translations object to ensure type safety
export interface TranslationSet {
  nav_features: string;
  nav_why_us: string;
  nav_book_demo: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_free: string;
  hero_cta_demo: string;
  why_title: string;
  why_subtitle: string;
  why_card1_title: string;
  why_card1_text: string;
  why_card2_title: string;
  why_card2_text: string;
  why_card3_title: string;
  why_card3_text: string;
  features_title: string;
  feature1_title: string;
  feature1_desc: string;
  feature1_li1: string;
  feature1_li2: string;
  feature1_li3: string;
  feature1_cta: string;
  feature2_title: string;
  feature2_desc: string;
  feature2_li1: string;
  feature2_li2: string;
  feature2_li3: string;
  feature2_cta: string;
  feature3_title: string;
  feature3_desc: string;
  feature3_li1: string;
  feature3_li2: string;
  feature3_li3: string;
  feature3_cta: string;
  feature4_title: string;
  feature4_desc: string;
  feature4_li1: string;
  feature4_li2: string;
  feature4_li3: string;
  feature4_cta: string;
  feature5_title: string;
  feature5_desc: string;
  feature5_li1: string;
  feature5_li2: string;
  feature5_li3: string;
  feature5_cta: string;
  more_title: string;
  more_subtitle: string;
  more_item1_title: string;
  more_item1_text: string;
  more_item2_title: string;
  more_item2_text: string;
  more_item3_title: string;
  more_item3_text: string;
  more_item4_title: string;
  more_item4_text: string;
  final_cta_title: string;
  final_cta_subtitle: string;
  final_cta_waitlist: string;
  final_cta_demo: string;
  footer_text: string;
  footer_privacy: string;
  footer_terms: string;
  waitlist_modal_title: string;
  waitlist_modal_text: string;
  waitlist_modal_email_label: string;
  waitlist_modal_email_placeholder: string;
  waitlist_modal_submit: string;
  waitlist_modal_success: string;
  demo_modal_title: string;
  demo_modal_text: string;
  demo_modal_name_label: string;
  demo_modal_name_placeholder: string;
  demo_modal_email_label: string;
  demo_modal_email_placeholder: string;
  demo_modal_company_label: string;
  demo_modal_company_placeholder: string;
  demo_modal_interest_label: string;
  demo_modal_interest_placeholder: string;
  demo_modal_submit: string;
  demo_modal_success: string;
  pitchit_brand: string;
  close_button: string;
  screenshot_placeholder_text: string;
  [key: string]: string; // Index signature for dynamic keys
}

export interface AllTranslations {
  en: TranslationSet;
  fr: TranslationSet;
}

// i18n translations - UPDATED with dual audience focus (VCs and Founders)
export const translations: AllTranslations = {
  en: {
    // Header
    nav_features: "Features",
    nav_why_us: "Why Us?",
    nav_book_demo: "Book a Demo",
    // Hero
    hero_title: "Empowering Founders & Informing VCs with AI-Driven Insights",
    hero_subtitle: "Pitch-it is the AI platform that helps founders validate concepts and prepare for investment, while giving VCs deeper market intelligence for smarter decision-making.",
    hero_cta_free: "Get Started for Free",
    hero_cta_demo: "Book a Demo Call",
    // Why Pitch-it
    why_title: "The Bridge Between Great Ideas and Smart Capital",
    why_subtitle: "For founders, we validate concepts and prepare you for investment. For VCs, we provide deeper insights and streamline due diligence with AI-powered analysis.",
    why_card1_title: "For Founders",
    why_card1_text: "Validate your market, build compelling decks, and practice your pitch with AI-powered feedback before meeting real investors.",
    why_card2_title: "For VCs",
    why_card2_text: "Gain deeper insights into potential investments with data-driven market analysis and standardized pitch evaluation.",
    why_card3_title: "For Both",
    why_card3_text: "Save time, reduce risk, and make more informed decisions with our comprehensive platform.",
    // Features
    features_title: "A Complete Platform for Founders and Investors",
    feature1_title: "01 | Key Trends & Netnography Analysis",
    feature1_desc: "Our AI drafts a full deck in seconds, grabs insights as you work, and keeps every slide in sync.",
    feature1_li1: "Real-time market trend identification",
    feature1_li2: "Competitive landscape mapping",
    feature1_li3: "Consumer sentiment analysis",
    feature1_cta: "Explore Market Insights",
    feature2_title: "02 | Real Market Research (Pulse)",
    feature2_desc: "Market Pulse links you to real users—confirm demand, surface pain points, and test pricing before you spend.",
    feature2_li1: "Targeted user validation panels",
    feature2_li2: "Quantitative and qualitative feedback",
    feature2_li3: "Pricing and feature preference testing",
    feature2_cta: "Validate Your Market",
    feature3_title: "03 | Personas with Unique Attributes",
    feature3_desc: "Pitch to virtual VCs in a lifelike call and get instant coaching on content, delivery, and confidence.",
    feature3_li1: "Customizable market segment personas",
    feature3_li2: "Interactive Q&A with AI personas",
    feature3_li3: "Messaging and positioning refinement",
    feature3_cta: "Meet Your Customers",
    feature4_title: "04 | AI/Manual Deck Builder",
    feature4_desc: "Blend smart templates with your voice: generate data-backed slides, tweak by hand, and wow investors.",
    feature4_li1: "AI-generated slide templates and content",
    feature4_li2: "Investor-focused narrative building",
    feature4_li3: "Real-time feedback on clarity and impact",
    feature4_cta: "Build Your Deck",
    feature5_title: "05 | Virtual VC Pitch Simulation",
    feature5_desc: "Rehearse in a simulated VC meeting and receive detailed metrics on answers, pacing, and persuasion.",
    feature5_li1: "Realistic investor meeting simulation",
    feature5_li2: "AI analysis of presentation and responses",
    feature5_li3: "Detailed performance metrics and improvement suggestions",
    feature5_cta: "Practice Your Pitch",
    // More Than Tool
    more_title: "A Complete Ecosystem for Investment Success",
    more_subtitle: "Pitch-it goes beyond individual features to offer an integrated platform that serves both founders and investors throughout the funding journey.",
    more_item1_title: "Continuous AI Insights",
    more_item1_text: "Real-time market intelligence and competitive analysis to inform decisions.",
    more_item2_title: "Centralized Document Hub",
    more_item2_text: "Secure storage for pitch materials, market research, and due diligence documents.",
    more_item3_title: "Progress Tracking",
    more_item3_text: "Monitor pitch improvements and investor engagement with detailed analytics.",
    more_item4_title: "Collaboration Tools",
    more_item4_text: "Seamless sharing between founders, team members, and potential investors.",
    // Final CTA
    final_cta_title: "Ready to Transform the Investment Process?",
    final_cta_subtitle: "Whether you're a founder seeking funding or an investor looking for quality deals, Pitch-it provides the tools for more successful outcomes.",
    final_cta_waitlist: "Join the Waitlist (Free)",
    final_cta_demo: "Request a Demo",
    // Footer
    footer_text: "© {year} Pitch-it. All rights reserved. <br />Connecting visionary founders with strategic investors.",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    // Modals
    waitlist_modal_title: "Join our Waitlist!",
    waitlist_modal_text: "Be among the first to access Pitch-it and transform how founders and investors connect. Enter your email below.",
    waitlist_modal_email_label: "Email Address",
    waitlist_modal_email_placeholder: "you@example.com",
    waitlist_modal_submit: "Sign Up for Waitlist",
    waitlist_modal_success: "Thank you! {email} has been added to our waitlist. We'll keep you informed!",
    demo_modal_title: "Request a Personalized Demo",
    demo_modal_text: "Discover how Pitch-it can improve the investment process for your specific needs. Fill out this form, and we'll contact you.",
    demo_modal_name_label: "Full Name",
    demo_modal_name_placeholder: "Your Name",
    demo_modal_email_label: "Email Address",
    demo_modal_email_placeholder: "you@example.com",
    demo_modal_company_label: "Company Name (Optional)",
    demo_modal_company_placeholder: "Your Company",
    demo_modal_interest_label: "What interests you most?",
    demo_modal_interest_placeholder: "E.g., Market validation, pitch preparation, investment analysis...",
    demo_modal_submit: "Send Demo Request",
    demo_modal_success: "Thank you, {name}! Your demo request has been received. We will contact you soon.",
    // General
    pitchit_brand: "Pitch-it",
    close_button: "×",
    screenshot_placeholder_text: "Feature Screenshot",
  },
  fr: {
    // Header
    nav_features: "Fonctionnalités",
    nav_why_us: "Pourquoi Nous?",
    nav_book_demo: "Demander une Démo",
    // Hero
    hero_title: "Autonomiser les Fondateurs & Informer les VCs avec l'IA",
    hero_subtitle: "Pitch-it est la plateforme IA qui aide les fondateurs à valider leurs concepts et à se préparer à l'investissement, tout en offrant aux VCs une intelligence de marché approfondie pour des décisions plus éclairées.",
    hero_cta_free: "Commencer Gratuitement",
    hero_cta_demo: "Réserver un Appel Démo",
    // Why Pitch-it
    why_title: "Le Pont Entre Grandes Idées et Capital Intelligent",
    why_subtitle: "Pour les fondateurs, nous validons les concepts et vous préparons à l'investissement. Pour les VCs, nous fournissons des insights plus profonds et simplifions la due diligence avec l'analyse IA.",
    why_card1_title: "Pour les Fondateurs",
    why_card1_text: "Validez votre marché, créez des decks convaincants et entraînez-vous au pitch avec feedback IA avant de rencontrer de vrais investisseurs.",
    why_card2_title: "Pour les VCs",
    why_card2_text: "Obtenez des insights plus profonds sur les investissements potentiels avec une analyse de marché basée sur les données et une évaluation standardisée des pitchs.",
    why_card3_title: "Pour les Deux",
    why_card3_text: "Gagnez du temps, réduisez les risques et prenez des décisions plus éclairées avec notre plateforme complète.",
    // Features
    features_title: "Une Plateforme Complète pour Fondateurs et Investisseurs",
    feature1_title: "01 | Analyse des Tendances Clés & Netnographie",
    feature1_desc: "L’IA génère votre deck en secondes, capte les insights à la volée et garde chaque slide à jour.",
    feature1_li1: "Identification des tendances de marché en temps réel",
    feature1_li2: "Cartographie du paysage concurrentiel",
    feature1_li3: "Analyse du sentiment des consommateurs",
    feature1_cta: "Explorer les Insights Marché",
    feature2_title: "02 | Recherche de Marché Réelle (Pulse)",
    feature2_desc: "Market Pulse valide vos idées auprès de vrais utilisateurs : besoin, points de douleur et prix avant d’investir.",
    feature2_li1: "Panels de validation utilisateurs ciblés",
    feature2_li2: "Feedback quantitatif et qualitatif",
    feature2_li3: "Tests de prix et de préférences de fonctionnalités",
    feature2_cta: "Valider Votre Marché",
    feature3_title: "03 | Personas avec Attributs Uniques",
    feature3_desc: "Entraînez-vous face à des VCs virtuels et recevez un coaching instantané sur contenu, delivery et assurance.",
    feature3_li1: "Personas de segments de marché personnalisables",
    feature3_li2: "Q&R interactif avec personas IA",
    feature3_li3: "Affinement des messages et du positionnement",
    feature3_cta: "Rencontrez Vos Clients",
    feature4_title: "04 | Créateur de Deck AI/Manuel",
    feature4_desc: "Alliez modèles intelligents et touche perso : créez des slides appuyées par la data et séduisez les investisseurs.",
    feature4_li1: "Modèles de slides et contenu générés par IA",
    feature4_li2: "Construction de récit orienté investisseur",
    feature4_li3: "Feedback en temps réel sur la clarté et l'impact",
    feature4_cta: "Construire Votre Deck",
    feature5_title: "05 | Simulation de Pitch VC Virtuel",
    feature5_desc: "Simulez une réunion VC et obtenez des métriques précises sur vos réponses, votre rythme et votre impact.",
    feature5_li1: "Simulation réaliste de réunion d'investisseur",
    feature5_li2: "Analyse IA de la présentation et des réponses",
    feature5_li3: "Métriques de performance détaillées et suggestions d'amélioration",
    feature5_cta: "Entraînez Votre Pitch",
    // More Than Tool
    more_title: "Un Écosystème Complet pour le Succès des Investissements",
    more_subtitle: "Pitch-it va au-delà des fonctionnalités individuelles pour offrir une plateforme intégrée qui sert à la fois les fondateurs et les investisseurs tout au long du parcours de financement.",
    more_item1_title: "Insights IA Continus",
    more_item1_text: "Intelligence de marché en temps réel et analyse concurrentielle pour éclairer les décisions.",
    more_item2_title: "Hub Documentaire Centralisé",
    more_item2_text: "Stockage sécurisé pour les documents de pitch, études de marché et documents de due diligence.",
    more_item3_title: "Suivi de Progression",
    more_item3_text: "Suivez les améliorations de pitch et l'engagement des investisseurs avec des analyses détaillées.",
    more_item4_title: "Outils de Collaboration",
    more_item4_text: "Partage fluide entre fondateurs, membres d'équipe et investisseurs potentiels.",
    // Final CTA
    final_cta_title: "Prêt à Transformer le Processus d'Investissement ?",
    final_cta_subtitle: "Que vous soyez un fondateur à la recherche de financement ou un investisseur à la recherche de deals de qualité, Pitch-it fournit les outils pour des résultats plus réussis.",
    final_cta_waitlist: "Rejoindre la Waitlist (Gratuit)",
    final_cta_demo: "Demander une Démo",
    // Footer
    footer_text: "© {year} Pitch-it. Tous droits réservés. <br />Connecter les fondateurs visionnaires aux investisseurs stratégiques.",
    footer_privacy: "Politique de Confidentialité",
    footer_terms: "Conditions d'Utilisation",
    // Modals
    waitlist_modal_title: "Rejoignez notre Waitlist !",
    waitlist_modal_text: "Soyez parmi les premiers à accéder à Pitch-it et à transformer la façon dont les fondateurs et les investisseurs se connectent. Entrez votre email ci-dessous.",
    waitlist_modal_email_label: "Adresse Email",
    waitlist_modal_email_placeholder: "vous@exemple.com",
    waitlist_modal_submit: "S'inscrire à la Waitlist",
    waitlist_modal_success: "Merci ! {email} a été ajouté à notre waitlist. Nous vous tiendrons informé !",
    demo_modal_title: "Demandez une Démo Personnalisée",
    demo_modal_text: "Découvrez comment Pitch-it peut améliorer le processus d'investissement pour vos besoins spécifiques. Remplissez ce formulaire et nous vous contacterons.",
    demo_modal_name_label: "Nom Complet",
    demo_modal_name_placeholder: "Votre Nom",
    demo_modal_email_label: "Adresse Email",
    demo_modal_email_placeholder: "vous@exemple.com",
    demo_modal_company_label: "Nom de l'entreprise (Optionnel)",
    demo_modal_company_placeholder: "Votre Entreprise",
    demo_modal_interest_label: "Qu'est-ce qui vous intéresse le plus ?",
    demo_modal_interest_placeholder: "Ex: Validation marché, préparation de pitch, analyse d'investissement...",
    demo_modal_submit: "Envoyer la Demande de Démo",
    demo_modal_success: "Merci, {name} ! Votre demande de démo a été reçue. Nous vous contacterons bientôt.",
    // General
    pitchit_brand: "Pitch-it",
    close_button: "×",
    screenshot_placeholder_text: "Capture d'écran de fonctionnalité",
  }
};
