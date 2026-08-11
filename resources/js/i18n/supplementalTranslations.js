const caseMetrics = [
    [['18%', '34%'], ['29%', '46%'], '45', '$126,400'],
    [['22%', '41%'], ['31%', '52%'], '60', '$208,700'],
    [['30%', '60%'], ['34%', '61%'], '38', '$184,200'],
    [['16%', '33%'], ['28%', '49%'], '51', '$97,800'],
    [['24%', '48%'], ['30%', '55%'], '44', '$231,600'],
    [['12%', '31%'], ['21%', '44%'], '30', '$88,900'],
    [['20%', '39%'], ['32%', '50%'], '70', '$312,400'],
    [['30%', '60%'], ['36%', '64%'], '42', '$276,500'],
    [['14%', '35%'], ['27%', '47%'], '56', '$145,300'],
    [['26%', '53%'], ['33%', '58%'], '48', '$198,600'],
];

function buildCases(items, labels) {
    return items.map((item, index) => ({
        ...item,
        label: labels.caseStudy,
        typeLabel: item.type === 'video' ? labels.video : labels.image,
        emailLabel: labels.email,
        email: caseMetrics[index][0].map((value, valueIndex) => `${valueIndex ? labels.after : labels.before} ${value}`),
        openLabel: labels.open,
        open: caseMetrics[index][1].map((value, valueIndex) => `${valueIndex ? labels.after : labels.before} ${value}`),
        timeLabel: labels.time,
        time: `${caseMetrics[index][2]} ${labels.days}`,
        revenueLabel: labels.revenue,
        revenue: caseMetrics[index][3],
    }));
}

const englishCases = buildCases([
    { type: 'image', placeholder: 'Image placeholder', mediaDescription: 'Add a Klaviyo dashboard or before/after screenshot', title: 'Client result headline', description: 'Add the brand, starting point, work completed and verified outcome.' },
    { type: 'video', placeholder: 'Video placeholder', mediaDescription: 'Add a Loom walkthrough or client testimonial', title: 'Video case study', description: 'Show the account diagnosis, implementation and result in under three minutes.' },
    { type: 'image', placeholder: 'Image placeholder', mediaDescription: 'Add flow revenue or conversion data', title: 'Flow performance result', description: 'Add the flow improved, baseline metric, final metric and measurement period.' },
    { type: 'image', placeholder: 'Image placeholder', mediaDescription: 'Add a campaign or segmentation screenshot', title: 'Campaign revenue result', description: 'Add the audience strategy, campaign angle and verified revenue outcome.' },
    { type: 'video', placeholder: 'Video placeholder', mediaDescription: 'Add a founder testimonial', title: 'Founder testimonial', description: 'Let the client explain the problem, experience and business impact.' },
    { type: 'image', placeholder: 'Image placeholder', mediaDescription: 'Add deliverability or inbox-placement proof', title: 'Deliverability recovery', description: 'Add the technical issue, changes made and improvement after implementation.' },
    { type: 'image', placeholder: 'Image placeholder', mediaDescription: 'Add repeat-purchase or LTV data', title: 'Repeat-purchase growth', description: 'Add the post-purchase strategy and the customer retention result.' },
    { type: 'video', placeholder: 'Video placeholder', mediaDescription: 'Add a flow teardown', title: 'Before-and-after teardown', description: 'Walk through the original lifecycle gap and the system that replaced it.' },
    { type: 'image', placeholder: 'Image placeholder', mediaDescription: 'Add an attributed-revenue dashboard', title: 'Email revenue growth', description: 'Add the agreed baseline, attribution settings and measured 90-day outcome.' },
    { type: 'video', placeholder: 'Video placeholder', mediaDescription: 'Add a client interview or audit review', title: 'Client story', description: 'Close the library with a concise story focused on business transformation.' },
], { caseStudy: 'Case study', image: 'Image', video: 'Video', email: 'Email revenue', open: 'Open rate', time: 'Time to results', revenue: 'Total revenue generated', before: 'Before', after: 'After', days: 'days' });

const frenchCases = buildCases([
    { type: 'image', placeholder: 'Emplacement image', mediaDescription: 'Ajoutez un tableau Klaviyo ou une capture avant/après', title: 'Titre du résultat client', description: 'Ajoutez la marque, le point de départ, le travail réalisé et le résultat vérifié.' },
    { type: 'video', placeholder: 'Emplacement vidéo', mediaDescription: 'Ajoutez une présentation Loom ou un témoignage client', title: 'Étude de cas vidéo', description: 'Montrez le diagnostic, la mise en œuvre et le résultat en moins de trois minutes.' },
    { type: 'image', placeholder: 'Emplacement image', mediaDescription: 'Ajoutez les revenus ou conversions d’un scénario', title: 'Résultat des scénarios', description: 'Ajoutez le scénario amélioré, la mesure initiale, la mesure finale et la période.' },
    { type: 'image', placeholder: 'Emplacement image', mediaDescription: 'Ajoutez une capture de campagne ou segmentation', title: 'Résultat des campagnes', description: 'Ajoutez la stratégie d’audience, l’angle de campagne et le revenu vérifié.' },
    { type: 'video', placeholder: 'Emplacement vidéo', mediaDescription: 'Ajoutez un témoignage du fondateur', title: 'Témoignage du fondateur', description: 'Laissez le client expliquer le problème, l’expérience et l’impact commercial.' },
    { type: 'image', placeholder: 'Emplacement image', mediaDescription: 'Ajoutez une preuve de délivrabilité', title: 'Récupération de la délivrabilité', description: 'Ajoutez le problème technique, les changements et l’amélioration obtenue.' },
    { type: 'image', placeholder: 'Emplacement image', mediaDescription: 'Ajoutez les données de réachat ou de LTV', title: 'Croissance des achats répétés', description: 'Ajoutez la stratégie après-achat et le résultat de rétention client.' },
    { type: 'video', placeholder: 'Emplacement vidéo', mediaDescription: 'Ajoutez une analyse des scénarios', title: 'Analyse avant et après', description: 'Présentez la lacune du cycle initial et le système qui l’a remplacé.' },
    { type: 'image', placeholder: 'Emplacement image', mediaDescription: 'Ajoutez un tableau des revenus attribués', title: 'Croissance des revenus e-mail', description: 'Ajoutez la référence convenue, les réglages d’attribution et le résultat à 90 jours.' },
    { type: 'video', placeholder: 'Emplacement vidéo', mediaDescription: 'Ajoutez une interview client ou un audit', title: 'Histoire client', description: 'Terminez par une histoire concise centrée sur la transformation de l’entreprise.' },
], { caseStudy: 'Étude de cas', image: 'Image', video: 'Vidéo', email: 'Revenus e-mail', open: 'Taux d’ouverture', time: 'Délai des résultats', revenue: 'Revenus totaux générés', before: 'Avant', after: 'Après', days: 'jours' });

const arabicCases = buildCases([
    { type: 'image', placeholder: 'موضع صورة', mediaDescription: 'أضف لوحة Klaviyo أو لقطة قبل وبعد', title: 'عنوان نتيجة العميل', description: 'أضف العلامة ونقطة البداية والعمل المنجز والنتيجة الموثقة.' },
    { type: 'video', placeholder: 'موضع فيديو', mediaDescription: 'أضف شرح Loom أو شهادة عميل', title: 'دراسة حالة بالفيديو', description: 'اعرض تشخيص الحساب والتنفيذ والنتيجة في أقل من ثلاث دقائق.' },
    { type: 'image', placeholder: 'موضع صورة', mediaDescription: 'أضف بيانات إيرادات التدفق أو التحويل', title: 'نتيجة أداء التدفقات', description: 'أضف التدفق المحسّن والمقياس الأولي والنهائي وفترة القياس.' },
    { type: 'image', placeholder: 'موضع صورة', mediaDescription: 'أضف لقطة للحملة أو التقسيم', title: 'نتيجة إيرادات الحملات', description: 'أضف استراتيجية الجمهور وزاوية الحملة والنتيجة الموثقة.' },
    { type: 'video', placeholder: 'موضع فيديو', mediaDescription: 'أضف شهادة المؤسس', title: 'شهادة المؤسس', description: 'دع العميل يشرح المشكلة والتجربة والأثر على أعماله.' },
    { type: 'image', placeholder: 'موضع صورة', mediaDescription: 'أضف دليلاً على قابلية التسليم', title: 'استعادة قابلية التسليم', description: 'أضف المشكلة التقنية والتغييرات والتحسن بعد التنفيذ.' },
    { type: 'image', placeholder: 'موضع صورة', mediaDescription: 'أضف بيانات تكرار الشراء أو قيمة العميل', title: 'نمو عمليات الشراء المتكررة', description: 'أضف استراتيجية ما بعد الشراء ونتيجة الاحتفاظ بالعملاء.' },
    { type: 'video', placeholder: 'موضع فيديو', mediaDescription: 'أضف تحليلاً للتدفقات', title: 'تحليل قبل وبعد', description: 'اشرح فجوة دورة العميل الأصلية والنظام الذي حل محلها.' },
    { type: 'image', placeholder: 'موضع صورة', mediaDescription: 'أضف لوحة الإيرادات المنسوبة', title: 'نمو إيرادات البريد', description: 'أضف خط الأساس وإعدادات الإسناد والنتيجة المقاسة خلال 90 يوماً.' },
    { type: 'video', placeholder: 'موضع فيديو', mediaDescription: 'أضف مقابلة عميل أو مراجعة تدقيق', title: 'قصة عميل', description: 'اختم المكتبة بقصة موجزة تركز على تحول الأعمال.' },
], { caseStudy: 'دراسة حالة', image: 'صورة', video: 'فيديو', email: 'إيرادات البريد', open: 'معدل الفتح', time: 'مدة ظهور النتائج', revenue: 'إجمالي الإيرادات المحققة', before: 'قبل', after: 'بعد', days: 'يوماً' });

export const supplementalTranslations = {
    en: {
        nav: { caseStudies: 'Case studies', team: 'Team', blog: 'Blog', openMenu: 'Open navigation menu', closeMenu: 'Close navigation menu' },
        brands: { aria: 'Brands we have worked with', label: 'Brands we’ve worked with', placeholder: 'Add brand logo' },
        thankYou: { metaTitle: 'Thank You', metaDescription: 'Your 10Xscale audit request has been received.', eyebrow: 'Request received', title: 'Thank you. Your audit is in.', description: 'We’ll review your store and reply within one business day with your 15-point email revenue report.', nextTitle: 'What happens next', nextSteps: ['Our team reviews your store, Klaviyo setup and qualification details.', 'We identify the most valuable revenue gaps across flows, campaigns and deliverability.', 'You receive a focused 15-point report and recommended next steps within one business day.'], home: 'Return to homepage', blog: 'Explore the retention journal' },
        cases: { eyebrow: 'Case studies', titleBefore: 'Real retention work. ', titleHighlight: 'Your proof goes here.', description: 'Ten ready-to-use media slots for client results, Klaviyo dashboards, before-and-after flow screenshots, testimonials and video walkthroughs.', note: 'PLACEHOLDERS ONLY — replace each slot with verified client imagery, data or video before publishing the result.', items: englishCases },
        team: { eyebrow: 'Meet the team', titleBefore: 'Senior specialists. ', titleHighlight: 'One retention system.', description: 'Strategy, copy, design and Klaviyo implementation handled by a focused team built around measurable retention growth.', members: [
            { initials: 'AB', photoLabel: 'ADD CEO PHOTO', name: 'Abdelfath Ben Chahyd', role: 'Founder & CEO', description: 'Leads growth strategy, client partnerships and the commercial direction behind every 90-day retention sprint.' },
            { initials: 'ED', photoLabel: 'ADD TEAM PHOTO', name: 'Team member', role: 'Email Designer', description: 'Transforms strategy and copy into clear, on-brand emails designed for mobile engagement and conversion.' },
            { initials: 'KB', photoLabel: 'ADD TEAM PHOTO', name: 'Team member', role: 'Klaviyo Email Builder', description: 'Builds flows, segments, tracking logic, testing setups and technically reliable sends inside Klaviyo.' },
            { initials: 'CD', photoLabel: 'ADD TEAM PHOTO', name: 'Team member', role: 'Conversion Email Designer', description: 'Creates campaign and lifecycle designs that balance brand consistency, readability and direct-response performance.' },
        ] },
        blog: { metaTitle: 'Retention Journal', metaDescription: 'Practical retention and Klaviyo ideas for growing Shopify brands.', eyebrow: 'Retention journal', titleBefore: 'Practical ideas to grow ', titleHighlight: 'email revenue and retention.', description: 'Five demo articles designed to target the questions Shopify teams search for while giving founders useful, actionable answers.', articles: [
            { coverLabel: 'Email revenue benchmark article cover', visual: 'Revenue benchmarks', tag: 'Email strategy · 8 min', title: 'How Much Revenue Should Klaviyo Generate for Your Store?', description: 'Learn the key benchmarks behind email-attributed revenue and how to spot the gap between your current setup and a healthy retention engine.', link: 'Read article →' },
            { coverLabel: 'Klaviyo automation flows article cover', visual: 'Klaviyo flows', tag: 'Automation · 10 min', title: 'The 8 Klaviyo Flows Every Growing Shopify Brand Needs', description: 'A practical lifecycle map covering welcome, browse, cart, post-purchase, win-back and the automations that turn first orders into repeat revenue.', link: 'Read article →' },
            { coverLabel: 'Email deliverability article cover', visual: 'Deliverability', tag: 'Deliverability · 7 min', title: 'Why Good Open Rates Can Still Hide a Deliverability Problem', description: 'Open rates alone do not tell the full story. Discover the signals that reveal inbox placement, list quality and sender-reputation issues.', link: 'Read article →' },
            { coverLabel: 'Repeat purchase strategy article cover', visual: 'Customer retention', tag: 'Retention · 9 min', title: 'How to Increase Repeat Purchases Without Constant Discounts', description: 'Build better post-purchase education, replenishment timing and customer segments so repeat sales grow without training buyers to wait for a sale.', link: 'Read article →' },
            { coverLabel: 'Campaigns versus flows article cover', visual: 'Campaigns vs flows', tag: 'Growth systems · 6 min', title: 'Campaigns vs. Flows: Where Ecommerce Email Revenue Really Comes From', description: 'Understand the role of automated lifecycle messages and planned campaigns—and how to balance both for consistent, measurable growth.', link: 'Read article →' },
        ] },
        legal: { eyebrow: 'Legal', contactTitle: 'Questions about this policy?', contactText: 'Contact us at', documents: {
            'privacy-policy': { title: 'Privacy policy', summary: 'This policy explains how 10Xscale collects, uses, stores and protects personal information submitted through this website and our client services.' },
            'terms-and-conditions': { title: 'Terms & conditions', summary: 'These terms describe the conditions that apply when you access the 10Xscale website, request an audit or engage our services.' },
            'cookie-policy': { title: 'Cookie policy', summary: 'This policy explains how this website may use essential and analytical cookies, and the choices available to visitors.' },
            'data-processing-agreement': { title: 'Data processing agreement', summary: 'This page outlines the data-processing principles that apply when 10Xscale handles personal data while delivering client services.' },
        } },
        footer: { heading: 'A retention system built for profitable growth.', description: '10Xscale helps established Shopify brands turn Klaviyo into a measurable revenue channel through strategy, flows, campaigns, design and ongoing optimization.', explore: 'Explore', policies: 'Policies', privacy: 'Privacy policy', terms: 'Terms & conditions', cookies: 'Cookie policy', dpa: 'Data processing agreement', contact: 'CONTACT: HELLO@10XSCALE.COM', copyright: '© 2026 10XSCALE. ALL RIGHTS RESERVED.' },
    },
    fr: {
        nav: { caseStudies: 'Études de cas', team: 'Équipe', blog: 'Blog', openMenu: 'Ouvrir le menu de navigation', closeMenu: 'Fermer le menu de navigation' },
        brands: { aria: 'Marques avec lesquelles nous avons travaillé', label: 'Les marques qui nous ont fait confiance', placeholder: 'Ajouter le logo' },
        thankYou: { metaTitle: 'Merci', metaDescription: 'Votre demande d’audit 10Xscale a bien été reçue.', eyebrow: 'Demande reçue', title: 'Merci. Votre audit est enregistré.', description: 'Nous analyserons votre boutique et répondrons sous un jour ouvré avec votre rapport en 15 points.', nextTitle: 'La suite du processus', nextSteps: ['Notre équipe analyse votre boutique, votre configuration Klaviyo et vos informations.', 'Nous identifions les principales opportunités dans les scénarios, campagnes et la délivrabilité.', 'Vous recevez un rapport ciblé en 15 points et nos recommandations sous un jour ouvré.'], home: 'Retour à l’accueil', blog: 'Découvrir le journal de la rétention' },
        cases: { eyebrow: 'Études de cas', titleBefore: 'Un vrai travail de rétention. ', titleHighlight: 'Vos preuves ici.', description: 'Dix emplacements prêts pour les résultats clients, tableaux Klaviyo, captures avant/après, témoignages et vidéos.', note: 'EMPLACEMENTS UNIQUEMENT — remplacez chaque élément par des images, données ou vidéos client vérifiées avant publication.', items: frenchCases },
        team: { eyebrow: 'Rencontrez l’équipe', titleBefore: 'Des spécialistes seniors. ', titleHighlight: 'Un seul système de rétention.', description: 'Stratégie, rédaction, design et intégration Klaviyo pris en charge par une équipe concentrée sur une croissance mesurable.', members: [
            { initials: 'AB', photoLabel: 'AJOUTER PHOTO CEO', name: 'Abdelfath Ben Chahyd', role: 'Fondateur & CEO', description: 'Dirige la stratégie de croissance, les partenariats clients et la direction commerciale de chaque sprint de 90 jours.' },
            { initials: 'ED', photoLabel: 'AJOUTER PHOTO', name: 'Membre de l’équipe', role: 'Designer e-mail', description: 'Transforme la stratégie et la rédaction en e-mails clairs, fidèles à la marque et conçus pour convertir sur mobile.' },
            { initials: 'KB', photoLabel: 'AJOUTER PHOTO', name: 'Membre de l’équipe', role: 'Intégrateur Klaviyo', description: 'Construit les scénarios, segments, suivis, tests et envois techniquement fiables dans Klaviyo.' },
            { initials: 'CD', photoLabel: 'AJOUTER PHOTO', name: 'Membre de l’équipe', role: 'Designer conversion e-mail', description: 'Crée des campagnes et cycles qui équilibrent cohérence de marque, lisibilité et performance commerciale.' },
        ] },
        blog: { metaTitle: 'Journal de la rétention', metaDescription: 'Des idées pratiques sur la rétention et Klaviyo pour les marques Shopify en croissance.', eyebrow: 'Journal de la rétention', titleBefore: 'Des idées pratiques pour développer ', titleHighlight: 'les revenus e-mail et la rétention.', description: 'Cinq articles de démonstration répondant aux questions recherchées par les équipes Shopify avec des conseils utiles et concrets.', articles: [
            { coverLabel: 'Couverture sur les repères de revenus e-mail', visual: 'Repères de revenus', tag: 'Stratégie e-mail · 8 min', title: 'Combien de revenus Klaviyo devrait-il générer pour votre boutique ?', description: 'Découvrez les repères des revenus attribués à l’e-mail et identifiez l’écart entre votre configuration et un moteur de rétention sain.', link: 'Lire l’article →' },
            { coverLabel: 'Couverture sur les automatisations Klaviyo', visual: 'Scénarios Klaviyo', tag: 'Automatisation · 10 min', title: 'Les 8 scénarios Klaviyo indispensables à toute marque Shopify en croissance', description: 'Une carte pratique du cycle client : bienvenue, navigation, panier, après-achat, réactivation et automatisations de réachat.', link: 'Lire l’article →' },
            { coverLabel: 'Couverture sur la délivrabilité', visual: 'Délivrabilité', tag: 'Délivrabilité · 7 min', title: 'Pourquoi de bons taux d’ouverture peuvent cacher un problème de délivrabilité', description: 'Les taux d’ouverture ne disent pas tout. Découvrez les signaux liés au placement, à la qualité de liste et à la réputation.', link: 'Lire l’article →' },
            { coverLabel: 'Couverture sur les achats répétés', visual: 'Rétention client', tag: 'Rétention · 9 min', title: 'Comment augmenter les achats répétés sans remises permanentes', description: 'Améliorez l’après-achat, le timing de réapprovisionnement et les segments sans habituer vos clients aux promotions.', link: 'Lire l’article →' },
            { coverLabel: 'Couverture campagnes contre scénarios', visual: 'Campagnes vs scénarios', tag: 'Systèmes de croissance · 6 min', title: 'Campagnes ou scénarios : d’où viennent vraiment les revenus e-mail ?', description: 'Comprenez le rôle des messages automatisés et des campagnes planifiées, puis équilibrez-les pour une croissance mesurable.', link: 'Lire l’article →' },
        ] },
        legal: { eyebrow: 'Juridique', contactTitle: 'Une question sur cette politique ?', contactText: 'Contactez-nous à', documents: {
            'privacy-policy': { title: 'Politique de confidentialité', summary: 'Cette politique explique comment 10Xscale collecte, utilise, conserve et protège les informations personnelles transmises via ce site et nos services.' },
            'terms-and-conditions': { title: 'Conditions générales', summary: 'Ces conditions décrivent les règles applicables lorsque vous consultez le site 10Xscale, demandez un audit ou utilisez nos services.' },
            'cookie-policy': { title: 'Politique relative aux cookies', summary: 'Cette politique explique comment ce site peut utiliser des cookies essentiels et analytiques, ainsi que les choix proposés aux visiteurs.' },
            'data-processing-agreement': { title: 'Accord de traitement des données', summary: 'Cette page présente les principes applicables lorsque 10Xscale traite des données personnelles dans le cadre de ses services.' },
        } },
        footer: { heading: 'Un système de rétention conçu pour une croissance rentable.', description: '10Xscale aide les marques Shopify établies à transformer Klaviyo en canal de revenus mesurable grâce à la stratégie, aux scénarios, aux campagnes, au design et à l’optimisation.', explore: 'Explorer', policies: 'Politiques', privacy: 'Politique de confidentialité', terms: 'Conditions générales', cookies: 'Politique relative aux cookies', dpa: 'Accord de traitement des données', contact: 'CONTACT : HELLO@10XSCALE.COM', copyright: '© 2026 10XSCALE. TOUS DROITS RÉSERVÉS.' },
    },
    ar: {
        nav: { caseStudies: 'دراسات الحالة', team: 'الفريق', blog: 'المدونة', openMenu: 'فتح قائمة التنقل', closeMenu: 'إغلاق قائمة التنقل' },
        brands: { aria: 'العلامات التي عملنا معها', label: 'علامات عملنا معها', placeholder: 'أضف شعار العلامة' },
        thankYou: { metaTitle: 'شكراً لك', metaDescription: 'تم استلام طلب تدقيق 10Xscale الخاص بك.', eyebrow: 'تم استلام الطلب', title: 'شكراً لك. تم تسجيل طلب التدقيق.', description: 'سنراجع متجرك ونرد خلال يوم عمل واحد بتقرير إيرادات البريد المكوّن من 15 نقطة.', nextTitle: 'ماذا سيحدث الآن؟', nextSteps: ['يراجع فريقنا متجرك وإعداد Klaviyo ومعلومات التأهل.', 'نحدد أهم فجوات الإيرادات في التدفقات والحملات وقابلية التسليم.', 'يصلك تقرير مركز من 15 نقطة مع الخطوات المقترحة خلال يوم عمل واحد.'], home: 'العودة إلى الصفحة الرئيسية', blog: 'استكشف مجلة الاحتفاظ' },
        cases: { eyebrow: 'دراسات الحالة', titleBefore: 'عمل حقيقي للاحتفاظ. ', titleHighlight: 'ضع أدلتك هنا.', description: 'عشرة مواضع جاهزة لنتائج العملاء ولوحات Klaviyo ولقطات قبل وبعد والشهادات والفيديوهات.', note: 'مواضع مؤقتة فقط — استبدل كل موضع بصور أو بيانات أو فيديو موثق قبل نشر النتيجة.', items: arabicCases },
        team: { eyebrow: 'تعرّف على الفريق', titleBefore: 'متخصصون ذوو خبرة. ', titleHighlight: 'نظام احتفاظ واحد.', description: 'يتولى فريق متخصص الاستراتيجية والكتابة والتصميم وتنفيذ Klaviyo لتحقيق نمو قابل للقياس.', members: [
            { initials: 'AB', photoLabel: 'أضف صورة الرئيس', name: 'Abdelfath Ben Chahyd', role: 'المؤسس والرئيس التنفيذي', description: 'يقود استراتيجية النمو وشراكات العملاء والتوجه التجاري لكل خطة احتفاظ مدتها 90 يوماً.' },
            { initials: 'ED', photoLabel: 'أضف صورة الفريق', name: 'عضو الفريق', role: 'مصمم البريد الإلكتروني', description: 'يحوّل الاستراتيجية والنص إلى رسائل واضحة ومتوافقة مع العلامة ومصممة للتفاعل والتحويل عبر الهاتف.' },
            { initials: 'KB', photoLabel: 'أضف صورة الفريق', name: 'عضو الفريق', role: 'منشئ رسائل Klaviyo', description: 'يبني التدفقات والشرائح ومنطق التتبع وإعدادات الاختبار والإرسال الموثوق داخل Klaviyo.' },
            { initials: 'CD', photoLabel: 'أضف صورة الفريق', name: 'عضو الفريق', role: 'مصمم بريد للتحويل', description: 'يصمم الحملات ودورات العميل بموازنة اتساق العلامة والوضوح وأداء الاستجابة المباشرة.' },
        ] },
        blog: { metaTitle: 'مجلة الاحتفاظ بالعملاء', metaDescription: 'أفكار عملية حول الاحتفاظ وKlaviyo لعلامات Shopify النامية.', eyebrow: 'مجلة الاحتفاظ', titleBefore: 'أفكار عملية لتنمية ', titleHighlight: 'إيرادات البريد والاحتفاظ.', description: 'خمس مقالات تجريبية تجيب عن أسئلة فرق Shopify وتقدم للمؤسسين إجابات مفيدة وقابلة للتطبيق.', articles: [
            { coverLabel: 'غلاف مقال معايير إيرادات البريد', visual: 'معايير الإيرادات', tag: 'استراتيجية البريد · 8 دقائق', title: 'ما حجم الإيرادات التي يجب أن يحققها Klaviyo لمتجرك؟', description: 'تعرّف على معايير الإيرادات المنسوبة للبريد وكيف تكتشف الفجوة بين إعدادك الحالي ومحرك احتفاظ صحي.', link: 'اقرأ المقال ←' },
            { coverLabel: 'غلاف مقال تدفقات Klaviyo', visual: 'تدفقات Klaviyo', tag: 'الأتمتة · 10 دقائق', title: 'ثمانية تدفقات Klaviyo تحتاجها كل علامة Shopify نامية', description: 'خريطة عملية تشمل الترحيب والتصفح والسلة وما بعد الشراء والاستعادة والأتمتة التي تحول الطلب الأول إلى إيراد متكرر.', link: 'اقرأ المقال ←' },
            { coverLabel: 'غلاف مقال قابلية التسليم', visual: 'قابلية التسليم', tag: 'قابلية التسليم · 7 دقائق', title: 'لماذا قد تخفي معدلات الفتح الجيدة مشكلة في قابلية التسليم؟', description: 'معدلات الفتح لا تروي القصة كاملة. اكتشف مؤشرات الوصول إلى الوارد وجودة القائمة وسمعة المرسل.', link: 'اقرأ المقال ←' },
            { coverLabel: 'غلاف مقال استراتيجية تكرار الشراء', visual: 'الاحتفاظ بالعملاء', tag: 'الاحتفاظ · 9 دقائق', title: 'كيف تزيد عمليات الشراء المتكررة دون خصومات دائمة؟', description: 'طوّر تعليم ما بعد الشراء وتوقيت التجديد والشرائح دون تدريب المشترين على انتظار التخفيضات.', link: 'اقرأ المقال ←' },
            { coverLabel: 'غلاف مقال الحملات مقابل التدفقات', visual: 'الحملات مقابل التدفقات', tag: 'أنظمة النمو · 6 دقائق', title: 'الحملات أم التدفقات: من أين تأتي إيرادات البريد فعلياً؟', description: 'افهم دور رسائل دورة العميل الآلية والحملات المخططة وكيف توازن بينهما لتحقيق نمو ثابت وقابل للقياس.', link: 'اقرأ المقال ←' },
        ] },
        legal: { eyebrow: 'قانوني', contactTitle: 'لديك سؤال حول هذه السياسة؟', contactText: 'تواصل معنا عبر', documents: {
            'privacy-policy': { title: 'سياسة الخصوصية', summary: 'توضح هذه السياسة كيف تجمع 10Xscale المعلومات الشخصية المقدمة عبر الموقع وخدمات العملاء وتستخدمها وتحفظها وتحميها.' },
            'terms-and-conditions': { title: 'الشروط والأحكام', summary: 'توضح هذه الشروط القواعد المطبقة عند زيارة موقع 10Xscale أو طلب تدقيق أو الاستفادة من خدماتنا.' },
            'cookie-policy': { title: 'سياسة ملفات الارتباط', summary: 'توضح هذه السياسة كيفية استخدام الموقع لملفات الارتباط الأساسية والتحليلية والخيارات المتاحة للزوار.' },
            'data-processing-agreement': { title: 'اتفاقية معالجة البيانات', summary: 'توضح هذه الصفحة مبادئ معالجة البيانات عند تعامل 10Xscale مع البيانات الشخصية أثناء تقديم خدمات العملاء.' },
        } },
        footer: { heading: 'نظام احتفاظ مصمم للنمو المربح.', description: 'تساعد 10Xscale علامات Shopify الراسخة على تحويل Klaviyo إلى قناة إيرادات قابلة للقياس عبر الاستراتيجية والتدفقات والحملات والتصميم والتحسين المستمر.', explore: 'استكشف', policies: 'السياسات', privacy: 'سياسة الخصوصية', terms: 'الشروط والأحكام', cookies: 'سياسة ملفات الارتباط', dpa: 'اتفاقية معالجة البيانات', contact: 'للتواصل: HELLO@10XSCALE.COM', copyright: '© 2026 10XSCALE. جميع الحقوق محفوظة.' },
    },
};
