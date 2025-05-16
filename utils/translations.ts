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

// i18n translations - UPDATED with blue theme
export const translations: AllTranslations = {
  en: {
    // Header
    nav_features: "Features",
    nav_why_us: "Why Us?",
    nav_book_demo: "Book a Demo",
    // Hero
    hero_title: "Revolutionize Your Pitch. Secure Your Future.",
    hero_subtitle: "Pitch-it is the AI platform that transforms your ideas into impactful presentations, validates your concepts, and prepares you to convince investors.",
    hero_cta_free: "Get Started for Free",
    hero_cta_demo: "Book a Demo Call",
    // Why Pitch-it
    why_title: "Tired of Pitching into the Void?",
    why_subtitle: "Transforming a brilliant idea into a pitch that captivates and converts is a major challenge. Pitch-it gives you the AI tools to overcome every obstacle.",
    why_card1_title: "Disorganized Ideas?",
    why_card1_text: "Structure your thoughts and documents into a coherent and powerful narrative.",
    why_card2_title: "Lack of Validation?",
    why_card2_text: "Test your concepts with real users and get concrete feedback before launching.",
    why_card3_title: "Fear of Failing with VCs?",
    why_card3_text: "Train in real conditions and receive AI analysis to perfect your performance.",
    // Features
    features_title: "Powerful Features at Your Service",
    feature1_title: "Intelligent AI Deck Builder",
    feature1_desc: "Stop struggling with your slides. Pitch-it's AI Deck Builder <strong class=\"text-blue-700\">automatically creates your initial pitch deck</strong> as soon as your project is created. Through your interactions, our AI <strong class=\"text-blue-700\">passively captures key insights</strong>, integrating them directly into your narrative. Iterate with ease, knowing your deck constantly evolves with your vision, supported by intelligent suggestions.",
    feature1_li1: "Instant deck creation",
    feature1_li2: "AI-automated insight capture",
    feature1_li3: "Easy iterations and contextual suggestions",
    feature1_cta: "Discover the Deck Builder",
    feature2_title: "Market Pulse Testing",
    feature2_desc: "Don't guess, <strong class=\"text-blue-700\">know</strong>. Market Pulse Testing connects you with <strong class=\"text-blue-700\">real users to validate your fundamental hypotheses</strong>. Understand if your idea resonates, identify critical pain points, and even test pricing models <strong class=\"text-blue-700\">before investing heavily</strong>. Get concrete, data-driven feedback to steer your business with confidence, whether you're an entrepreneur refining your product or an investor assessing its potential.",
    feature2_li1: "Idea validation with targeted users",
    feature2_li2: "Identification of pain points and opportunities",
    feature2_li3: "Pricing model and willingness-to-pay tests",
    feature2_cta: "Validate Your Ideas",
    feature3_title: "Virtual VC Rehearsal",
    feature3_desc: "Enter the meeting room, prepared. Our Virtual VC Rehearsal isn't just a rehearsal; it's a <strong class=\"text-blue-700\">dynamic video conference simulation</strong> with AI 'investors'. Pitch your vision, and our AI will <strong class=\"text-blue-700\">analyze your delivery, documents, and content substance</strong>. Receive detailed feedback on your behavior, clarity, and responses, to face real VCs with unshakable confidence.",
    feature3_li1: "Realistic video conference pitch simulation",
    feature3_li2: "AI analysis of behavior, documents, and content",
    feature3_li3: "Actionable feedback to improve your performance",
    feature3_cta: "Train to Win",
    // More Than Tool
    more_title: "A Complete Platform for Your Success",
    more_subtitle: "Pitch-it goes beyond key features to offer you an integrated ecosystem, designed to maximize your chances of success.",
    more_item1_title: "Continuous AI Insights",
    more_item1_text: "AI analyses and recommendations to sharpen your strategy in real-time.",
    more_item2_title: "Centralized Document Hub",
    more_item2_text: "All your files, AI reports, and project documents in one secure place.",
    more_item3_title: "Chat with AI Personas",
    more_item3_text: "Test your arguments and anticipate questions with interactive AI personas.",
    more_item4_title: "Intuitive Project Management",
    more_item4_text: "Track your projects' progress, from idea to Series C, on a clear dashboard.",
    // Final CTA
    final_cta_title: "Ready to Transform Your Pitch?",
    final_cta_subtitle: "Join the Pitch-it revolution and give your ideas the impact they deserve. Start for free or request a personalized demo.",
    final_cta_waitlist: "Join the Waitlist (Free)",
    final_cta_demo: "Request a Demo",
    // Footer
    footer_text: "© {year} Pitch-it. All rights reserved. <br />Let's build the future of your presentations together.",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    // Modals
    waitlist_modal_title: "Join our Waitlist!",
    waitlist_modal_text: "Be among the first to access Pitch-it and revolutionize your presentations. Enter your email below.",
    waitlist_modal_email_label: "Email Address",
    waitlist_modal_email_placeholder: "you@example.com",
    waitlist_modal_submit: "Sign Up for Waitlist",
    waitlist_modal_success: "Thank you! {email} has been added to our waitlist. We'll keep you informed!",
    demo_modal_title: "Request a Personalized Demo",
    demo_modal_text: "Discover how Pitch-it can transform your pitching approach. Fill out this form, and we'll contact you.",
    demo_modal_name_label: "Full Name",
    demo_modal_name_placeholder: "Your Name",
    demo_modal_email_label: "Email Address",
    demo_modal_email_placeholder: "you@example.com",
    demo_modal_company_label: "Company Name (Optional)",
    demo_modal_company_placeholder: "Your Company",
    demo_modal_interest_label: "What interests you most?",
    demo_modal_interest_placeholder: "E.g., Improving our investor pitches, validating a new product idea...",
    demo_modal_submit: "Send Demo Request",
    demo_modal_success: "Thank you, {name}! Your demo request has been received. We will contact you soon.",
    // General
    pitchit_brand: "Pitch-it",
    close_button: "×",
    screenshot_placeholder_text: "App Screenshot Placeholder",
  },
  fr: {
    // Header
    nav_features: "Fonctionnalités",
    nav_why_us: "Pourquoi Nous?",
    nav_book_demo: "Book a Demo",
    // Hero
    hero_title: "Révolutionnez Votre Pitch. Sécurisez Votre Avenir.",
    hero_subtitle: "Pitch-it est la plateforme IA qui transforme vos idées en présentations percutantes, valide vos concepts et vous prépare à convaincre les investisseurs.",
    hero_cta_free: "Get Started for Free",
    hero_cta_demo: "Book a Demo Call",
    // Why Pitch-it
    why_title: "Fatigué de pitcher dans le vide ?",
    why_subtitle: "Transformer une idée brillante en un pitch qui captive et convertit est un défi majeur. Pitch-it vous donne les outils IA pour surmonter chaque obstacle.",
    why_card1_title: "Idées Désorganisées ?",
    why_card1_text: "Structurez votre pensée et vos documents en un récit cohérent et puissant.",
    why_card2_title: "Manque de Validation ?",
    why_card2_text: "Testez vos concepts avec de vrais utilisateurs et obtenez des retours concrets avant de vous lancer.",
    why_card3_title: "Peur de l'Échec face aux VCs ?",
    why_card3_text: "Entraînez-vous dans des conditions réelles et recevez des analyses IA pour perfectionner votre performance.",
    // Features
    features_title: "Des Fonctionnalités Puissantes à Votre Service",
    feature1_title: "AI Deck Builder Intelligent",
    feature1_desc: "Ne luttez plus avec vos slides. L'AI Deck Builder de Pitch-it <strong class=\"text-blue-700\">crée automatiquement votre pitch deck initial</strong> dès la création de votre projet. Au fil de vos interactions, notre IA <strong class=\"text-blue-700\">capture passivement des insights clés</strong>, les intégrant directement dans votre narration. Itérez avec aisance, sachant que votre deck évolue constamment avec votre vision, soutenu par des suggestions intelligentes.",
    feature1_li1: "Création de deck instantanée",
    feature1_li2: "Capture d'insights automatisée par IA",
    feature1_li3: "Itérations faciles et suggestions contextuelles",
    feature1_cta: "Découvrir le Deck Builder",
    feature2_title: "Market Pulse Testing",
    feature2_desc: "Ne devinez pas, <strong class=\"text-blue-700\">sachez</strong>. Market Pulse Testing vous connecte avec de <strong class=\"text-blue-700\">vrais utilisateurs pour valider vos hypothèses fondamentales</strong>. Comprenez si votre idée résonne, identifiez les points de douleur critiques, et testez même les modèles de tarification <strong class=\"text-blue-700\">avant d'investir massivement</strong>. Obtenez des retours concrets et basés sur des données pour piloter votre entreprise avec confiance, que vous soyez un entrepreneur affinant votre produit ou un investisseur évaluant son potentiel.",
    feature2_li1: "Validation d'idées avec des utilisateurs ciblés",
    feature2_li2: "Identification des \"pain points\" et opportunités",
    feature2_li3: "Tests de modèles de prix et de \"willingness to pay\"",
    feature2_cta: "Valider vos idées",
    feature3_title: "Virtual VC Rehearsal",
    feature3_desc: "Entrez dans la salle de réunion, préparé. Notre Virtual VC Rehearsal n'est pas une simple répétition ; c'est une <strong class=\"text-blue-700\">simulation de visioconférence dynamique</strong> avec des 'investisseurs' IA. Pitchez votre vision, et notre IA <strong class=\"text-blue-700\">analysera votre prestation, vos documents, et la substance de votre contenu</strong>. Recevez des retours détaillés sur votre comportement, votre clarté et vos réponses, pour affronter les vrais VCs avec une confiance inébranlable.",
    feature3_li1: "Simulation de pitch en visioconférence réaliste",
    feature3_li2: "Analyse IA du comportement, documents et contenu",
    feature3_li3: "Feedback actionnable pour améliorer votre performance",
    feature3_cta: "S'entraîner pour gagner",
    // More Than Tool
    more_title: "Une Plateforme Complète pour Votre Succès",
    more_subtitle: "Pitch-it va au-delà des fonctionnalités clés pour vous offrir un écosystème intégré, conçu pour maximiser vos chances de réussite.",
    more_item1_title: "Insights IA Continus",
    more_item1_text: "Des analyses et recommandations IA pour affûter votre stratégie en temps réel.",
    more_item2_title: "Hub Documentaire Centralisé",
    more_item2_text: "Tous vos fichiers, rapports IA et documents de projet en un seul endroit sécurisé.",
    more_item3_title: "Chat avec Personas IA",
    more_item3_text: "Testez vos arguments et anticipez les questions avec des personas IA interactifs.",
    more_item4_title: "Gestion de Projet Intuitive",
    more_item4_text: "Suivez l'avancement de vos projets, de l'idée à la Série C, sur un dashboard clair.",
    // Final CTA
    final_cta_title: "Prêt à Transformer Votre Pitch ?",
    final_cta_subtitle: "Rejoignez la révolution Pitch-it et donnez à vos idées l'impact qu'elles méritent. Commencez gratuitement ou demandez une démo personnalisée.",
    final_cta_waitlist: "Rejoindre la Waitlist (Gratuit)",
    final_cta_demo: "Demander une Démo",
    // Footer
    footer_text: "© {year} Pitch-it. Tous droits réservés. <br>Construisons ensemble le futur de vos présentations.",
    footer_privacy: "Politique de confidentialité",
    footer_terms: "Termes de service",
    // Modals
    waitlist_modal_title: "Rejoignez notre Waitlist !",
    waitlist_modal_text: "Soyez parmi les premiers à accéder à Pitch-it et à révolutionner vos présentations. Entrez votre email ci-dessous.",
    waitlist_modal_email_label: "Adresse Email",
    waitlist_modal_email_placeholder: "vous@exemple.com",
    waitlist_modal_submit: "S'inscrire à la Waitlist",
    waitlist_modal_success: "Merci ! {email} a été ajouté à notre waitlist. Nous vous tiendrons informé !",
    demo_modal_title: "Demandez une Démo Personnalisée",
    demo_modal_text: "Découvrez comment Pitch-it peut transformer votre approche du pitch. Remplissez ce formulaire et nous vous contacterons.",
    demo_modal_name_label: "Nom Complet",
    demo_modal_name_placeholder: "Votre Nom",
    demo_modal_email_label: "Adresse Email",
    demo_modal_email_placeholder: "vous@exemple.com",
    demo_modal_company_label: "Nom de l'entreprise (Optionnel)",
    demo_modal_company_placeholder: "Votre Entreprise",
    demo_modal_interest_label: "Qu'est-ce qui vous intéresse le plus ?",
    demo_modal_interest_placeholder: "Ex: Améliorer nos pitchs investisseurs, valider une nouvelle idée de produit...",
    demo_modal_submit: "Envoyer la Demande de Démo",
    demo_modal_success: "Merci, {name} ! Votre demande de démo a été reçue. Nous vous contacterons bientôt.",
    // General
    pitchit_brand: "Pitch-it",
    close_button: "×",
    screenshot_placeholder_text: "Aperçu de l'interface",
  }
};
