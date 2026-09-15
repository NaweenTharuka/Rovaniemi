import { CANCELLATION, PRIVACY, TERMS } from './content'
import { paragraphs } from './lexical'

/** SQLite and Postgres adapters both use numeric ids by default. */
type Id = number
type Refs = {
  media: Record<string, Id>
  pages: Record<string, Id>
  experiences: Record<string, Id>
}

const pageRef = (refs: Refs, slug: string, label: string, appearance?: 'primary' | 'secondary' | 'link') => ({
  type: 'reference' as const,
  reference: { relationTo: 'pages' as const, value: refs.pages[slug] },
  label,
  ...(appearance ? { appearance } : {}),
})

const custom = (url: string, label: string, appearance?: 'primary' | 'secondary' | 'link') => ({
  type: 'custom' as const,
  url,
  label,
  ...(appearance ? { appearance } : {}),
})

const PLACEHOLDER = 'PLACEHOLDER — not on the previous website. Replace with real information before un-hiding this section.'

/**
 * Page compositions. Pages that link to other pages are created in two passes
 * (see seed/index.ts), so `refs.pages` is complete when layouts are built.
 */
export const buildPages = (refs: Refs) => {
  const m = refs.media
  return [
    {
      slug: 'home',
      title: 'Home',
      meta: {
        title: 'Lapland Tours in Rovaniemi — HEADING NORTH',
        description:
          'Discover personal small-group Lapland tours from Rovaniemi with HEADING NORTH. Aurora hunting, Ranua, Korouoma and Levi experiences for up to 4 guests.',
        image: m['aurora-frost-landscape'],
      },
      layout: [
        {
          blockType: 'hero',
          variant: 'cinematic',
          eyebrow: 'Rovaniemi — Finnish Lapland',
          heading: 'Go\nNorth.',
          subheading: 'Authentic small-group Arctic experiences from Rovaniemi. Maximum 4 guests for a more personal adventure.',
          mediaType: 'image',
          image: m['aurora-frost-landscape'],
          overlay: 'light',
          parallax: true,
          primaryCta: pageRef(refs, 'experiences', 'Explore experiences'),
          secondaryCta: custom('/contact', 'Plan your journey'),
          tone: 'ink',
        },
        {
          blockType: 'chapters',
          chapters: [
            {
              label: 'The North',
              title: 'Where Lapland begins.',
              body: 'HEADING NORTH is a local tourism company based in Rovaniemi, offering personal small-group experiences across Finnish Lapland.',
              image: m['rovaniemi-dusk'],
              details: [
                { value: 'Rovaniemi', label: 'Home base' },
                { value: 'Finnish Lapland', label: 'Where we travel' },
              ],
            },
            {
              label: 'The Experience',
              title: 'Small groups. Big Arctic moments.',
              body: 'Instead of large-group tours, we focus on small groups of up to 4 guests, allowing more individual attention, comfortable travel and the flexibility to make each experience memorable.',
              image: m['lantern-frozen-lake'],
              details: [
                { value: '4', label: 'Guests, maximum' },
                { value: 'Flexible', label: 'Pickup arrangements' },
              ],
            },
          ],
          tone: 'ink',
        },
        {
          blockType: 'cinematicSequence',
          heading: 'Into the quiet\nof Lapland.',
          body: 'Chase the Northern Lights across the Arctic night on a personal small-group adventure.',
          source: 'path',
          framePattern: '/sequences/north/desktop/frame-{index}.webp',
          frameCount: 36,
          indexPadding: 3,
          startIndex: 1,
          mobileFramePattern: '/sequences/north/mobile/frame-{index}.webp',
          mobileFrameCount: 24,
          poster: m['aurora-tall-pines'],
          captions: [
            { at: 12, text: 'Beyond the city lights.' },
            { at: 48, text: 'Where the sky begins to move.' },
            { at: 82, text: 'Go where the lights begin.' },
          ],
          scrollLength: 'medium',
          tone: 'ink',
        },
        {
          blockType: 'experienceShowcase',
          sectionLabel: '03 — The Journey',
          heading: 'Choose your\nArctic.',
          intro: 'Discover Finnish Lapland with HEADING NORTH through personal small-group experiences designed for a maximum of 4 guests.',
          source: 'all',
          layout: 'index',
          cta: pageRef(refs, 'experiences', 'All experiences', 'secondary'),
          tone: 'snow',
        },
        {
          blockType: 'split',
          eyebrow: 'Why HEADING NORTH',
          heading: 'Explore Lapland in a more personal way.',
          body: paragraphs('With a maximum of 4 guests, our experiences are designed to be comfortable, flexible and memorable.'),
          items: [
            { title: 'Maximum 4 guests', text: 'Small groups mean more comfort, personal attention and time to enjoy every moment.' },
            { title: 'Personal service', text: 'Friendly, personal service designed to make your Lapland experience comfortable and memorable.' },
            { title: 'Flexible pickup arrangements', text: 'Convenient pickup or meeting-point arrangements based on your accommodation and chosen experience.' },
            { title: 'Authentic Lapland experiences', text: 'Discover Arctic nature and the beauty of Lapland through carefully planned experiences beyond the ordinary.' },
          ],
          cta: pageRef(refs, 'about', 'About us', 'secondary'),
          tone: 'ink',
        },
        {
          blockType: 'fullBleedImage',
          image: m['winter-road-night'],
          overlayText: 'Pickup or meeting point,\narranged around your stay.',
          height: 'tall',
          parallax: true,
          tone: 'ink',
        },
        {
          blockType: 'testimonials',
          eyebrow: 'Guest stories',
          heading: 'In their words.',
          style: 'editorial',
          source: 'featured',
          limit: 4,
          tone: 'snow',
        },
        {
          blockType: 'faq',
          eyebrow: 'FAQ',
          heading: 'Frequently asked questions',
          intro: 'Planning your Lapland experience? Here are answers to some of the most common questions from our guests.',
          source: 'featured',
          enableSearch: false,
          enableFilters: false,
          cta: pageRef(refs, 'faq', 'View all FAQs', 'secondary'),
          tone: 'snow',
        },
        {
          blockType: 'cta',
          sectionLabel: '04 — Your moment',
          heading: 'Ready to experience\nLapland?',
          body: 'Start planning your Lapland experience with HEADING NORTH. Contact us and we’ll help you find the experience that suits your plans.',
          primaryCta: pageRef(refs, 'contact', 'Contact us'),
          backgroundImage: m['riisitunturi-crown-snow'],
          showWhatsApp: true,
          tone: 'ink',
        },
      ],
    },
    {
      slug: 'experiences',
      title: 'Experiences',
      meta: {
        title: 'Lapland Tours from Rovaniemi',
        description:
          'Explore small-group Lapland tours from Rovaniemi with HEADING NORTH. Discover Aurora hunting, Ranua, Korouoma and Levi experiences for up to 4 guests.',
      },
      layout: [
        {
          blockType: 'hero',
          variant: 'compact',
          eyebrow: 'Experiences',
          heading: 'Explore our\nLapland experiences.',
          subheading:
            'Discover Finnish Lapland with HEADING NORTH through personal small-group experiences designed for a maximum of 4 guests. From chasing the Northern Lights to exploring Arctic wildlife, frozen waterfalls and Levi, choose the experience that suits your Lapland adventure.',
          mediaType: 'image',
          parallax: false,
          tone: 'snow',
        },
        {
          blockType: 'experienceShowcase',
          source: 'all',
          layout: 'index',
          showFilters: true,
          tone: 'snow',
        },
        {
          blockType: 'cta',
          heading: 'Ready to explore\nLapland?',
          body: 'Choose the experience that suits your plans and discover Finnish Lapland with HEADING NORTH. Our small-group experiences are designed for a maximum of 4 guests, offering a more personal and flexible way to travel.',
          primaryCta: pageRef(refs, 'contact', 'Contact us'),
          backgroundImage: m['frosty-lakeshore-dusk'],
          showWhatsApp: true,
          tone: 'ink',
        },
      ],
    },
    {
      slug: 'about',
      title: 'About',
      breadcrumbLabel: 'About',
      meta: {
        title: 'Lapland Tour Company in Rovaniemi',
        description:
          'Meet HEADING NORTH, a local Lapland tour company in Rovaniemi offering personal small-group Arctic experiences for a maximum of 4 guests.',
      },
      layout: [
        {
          blockType: 'hero',
          variant: 'editorial',
          eyebrow: 'About HEADING NORTH',
          heading: 'Lapland,\npersonally.',
          subheading:
            'HEADING NORTH is a local tourism company based in Rovaniemi, offering personal small-group experiences across Finnish Lapland. We focus on comfortable journeys, flexible service and memorable Arctic experiences, with a maximum of 4 guests.',
          mediaType: 'image',
          image: m['frosted-pines-sky'],
          parallax: true,
          tone: 'snow',
        },
        {
          blockType: 'split',
          sectionLabel: '01 — Our story',
          heading: 'A simple idea.',
          body: paragraphs(
            'HEADING NORTH was created with a simple idea: to help visitors experience Lapland in a more personal and flexible way. Instead of large-group tours, we focus on small groups of up to 4 guests, allowing more individual attention, comfortable travel and the flexibility to make each experience memorable.',
          ),
          tone: 'snow',
        },
        {
          blockType: 'imageText',
          sectionLabel: '02 — Why small groups?',
          heading: 'Personal, relaxed\nand unhurried.',
          body: paragraphs(
            'We believe the best Lapland experiences should feel personal, relaxed and unhurried. By limiting our experiences to a maximum of 4 guests, we can provide more individual attention, greater flexibility and a comfortable journey through Lapland.',
          ),
          image: m['reindeer-sled-forest'],
          imagePosition: 'left',
          imageRatio: 'portrait',
          tone: 'snow',
        },
        {
          blockType: 'imageText',
          sectionLabel: '03 — Our approach',
          heading: 'Planned around\ncomfort and care.',
          body: paragraphs(
            'Every experience is planned with comfort, flexibility and personal service in mind. From Arctic nature and wildlife to the Northern Lights and journeys across Lapland, we aim to create enjoyable experiences while adapting to weather, road and local conditions.',
          ),
          image: m['wilderness-cabins'],
          imagePosition: 'right',
          imageRatio: 'portrait',
          tone: 'snow',
        },
        {
          blockType: 'split',
          sectionLabel: '04 — Why Lapland?',
          heading: 'Northern Lights, wildlife and frozen waterfalls.',
          body: paragraphs(
            'Whether you are searching for the Northern Lights, discovering Arctic wildlife, exploring frozen waterfalls or travelling between Rovaniemi and Levi, HEADING NORTH is here to help you experience Lapland in a personal and memorable way.',
          ),
          cta: pageRef(refs, 'experiences', 'Explore our experiences', 'secondary'),
          tone: 'ink',
        },
        {
          blockType: 'split',
          sectionLabel: '05 — Safety',
          heading: 'Arctic conditions, taken seriously.',
          body: paragraphs(
            'HEADING NORTH experiences take place in Arctic conditions, and weather, road, snow and trail conditions can change quickly. For safety or operational reasons, the route, schedule, viewing location or planned stops may be changed when necessary.',
            'HEADING NORTH may modify or stop an activity if continuing would create an unreasonable safety risk.',
          ),
          cta: pageRef(refs, 'terms', 'Terms & Cancellation', 'link'),
          tone: 'snow',
          anchorId: 'safety',
        },
        {
          blockType: 'split',
          sectionLabel: '06 — Local knowledge',
          heading: 'PLACEHOLDER: Local knowledge',
          body: paragraphs(PLACEHOLDER, 'Describe the team’s local experience in Lapland — for example years guiding, languages, and knowledge of aurora forecasting and routes.'),
          hidden: true,
          tone: 'snow',
        },
        {
          blockType: 'split',
          sectionLabel: '07 — Sustainability',
          heading: 'PLACEHOLDER: Sustainability',
          body: paragraphs(PLACEHOLDER, 'Describe real sustainability practices only (vehicles, group sizes, respect for nature, local partners). Do not publish claims that cannot be verified.'),
          hidden: true,
          tone: 'snow',
        },
        {
          blockType: 'imageGrid',
          sectionLabel: '08 — Team',
          heading: 'PLACEHOLDER: The people behind HEADING NORTH',
          items: [
            { image: m['wilderness-cabins'], title: 'PLACEHOLDER — Name', text: 'PLACEHOLDER — Role and a short personal introduction. Use a real photo.' },
          ],
          hidden: true,
          tone: 'snow',
        },
        {
          blockType: 'cta',
          heading: 'Experience Lapland\nwith us.',
          body: 'Whether you are searching for the Northern Lights, discovering Arctic wildlife, exploring frozen waterfalls or travelling between Rovaniemi and Levi, HEADING NORTH is here to help.',
          primaryCta: pageRef(refs, 'experiences', 'Explore our experiences'),
          secondaryCta: pageRef(refs, 'contact', 'Contact us', 'link'),
          backgroundImage: m['korouoma-snowy-forest'],
          showWhatsApp: false,
          tone: 'ink',
        },
      ],
    },
    {
      slug: 'faq',
      title: 'FAQ',
      meta: {
        title: 'Lapland Tours FAQ',
        description:
          'Find answers to common questions about HEADING NORTH Lapland tours, including group sizes, pickup, Northern Lights, clothing, tickets and luggage.',
      },
      layout: [
        {
          blockType: 'hero',
          variant: 'compact',
          eyebrow: 'Frequently asked questions',
          heading: 'Questions,\nanswered.',
          subheading: 'Planning your Lapland experience? Here are answers to some of the most common questions from our guests.',
          mediaType: 'image',
          parallax: false,
          tone: 'snow',
        },
        {
          blockType: 'faq',
          source: 'all',
          enableSearch: true,
          enableFilters: true,
          tone: 'snow',
        },
        {
          blockType: 'cta',
          heading: 'Ready to plan your\nLapland experience?',
          body: 'Have a question that isn’t answered here? Contact HEADING NORTH and we’ll be happy to help you plan your experience.',
          primaryCta: pageRef(refs, 'contact', 'Contact us'),
          showWhatsApp: true,
          tone: 'ink',
        },
      ],
    },
    {
      slug: 'contact',
      title: 'Contact',
      meta: {
        title: 'Contact HEADING NORTH — Lapland Tours Rovaniemi',
        description:
          'Contact HEADING NORTH to plan your Lapland experience from Rovaniemi. Ask about Aurora, Ranua, Korouoma and Levi small-group experiences for up to 4 guests.',
      },
      layout: [
        {
          blockType: 'hero',
          variant: 'compact',
          eyebrow: 'Contact',
          heading: 'Plan your\njourney.',
          subheading:
            'Planning your Lapland adventure? Get in touch with HEADING NORTH. Whether you have a question about an experience, pickup arrangements, availability or a special request, we are happy to help.',
          mediaType: 'image',
          parallax: false,
          tone: 'snow',
        },
        {
          blockType: 'contactForm',
          intro: 'We are based in Rovaniemi, Finnish Lapland, and welcome inquiries from travellers planning their Lapland experiences.',
          formHeading: 'Send us an inquiry',
          submitLabel: 'Send inquiry',
          successMessage: 'Thank you. We’ll get back to you as soon as possible.',
          showDirectContacts: true,
          showMap: true,
          pickupNote:
            'Complimentary pickup and drop-off are available from selected locations in Rovaniemi. Pickup outside our complimentary area may be available for an additional fee, depending on the location. Exact arrangements and any additional cost will be confirmed in advance.',
          tone: 'snow',
        },
      ],
    },
    {
      slug: 'terms',
      title: 'Terms & Cancellation',
      template: 'legal',
      breadcrumbLabel: 'Terms',
      meta: { title: 'Terms & Cancellation', description: 'Booking, payment, cancellation, weather and safety terms for HEADING NORTH experiences.' },
      layout: [
        {
          blockType: 'hero',
          variant: 'compact',
          eyebrow: 'Legal',
          heading: 'Terms &\nCancellation',
          mediaType: 'image',
          parallax: false,
          tone: 'snow',
        },
        { blockType: 'richText', content: TERMS, width: 'reading', tableOfContents: true, tone: 'snow' },
      ],
    },
    {
      slug: 'cancellation',
      title: 'Cancellation',
      template: 'legal',
      meta: { title: 'Cancellation policy', description: 'Free cancellation up to 24 hours before your HEADING NORTH experience. Weather, no-show and third-party booking conditions.' },
      layout: [
        {
          blockType: 'hero',
          variant: 'compact',
          eyebrow: 'Legal',
          heading: 'Cancellation',
          subheading: 'Free cancellation up to 24 hours before the scheduled starting time of your experience.',
          mediaType: 'image',
          parallax: false,
          tone: 'snow',
        },
        { blockType: 'richText', content: CANCELLATION, width: 'reading', tableOfContents: true, tone: 'snow' },
      ],
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      template: 'legal',
      breadcrumbLabel: 'Privacy',
      meta: { title: 'Privacy Policy', description: 'How HEADING NORTH collects, uses and protects personal information.' },
      layout: [
        {
          blockType: 'hero',
          variant: 'compact',
          eyebrow: 'Legal',
          heading: 'Privacy\nPolicy',
          mediaType: 'image',
          parallax: false,
          tone: 'snow',
        },
        {
          blockType: 'richText',
          content: PRIVACY,
          width: 'reading',
          tableOfContents: true,
          lastUpdated: '2026-09-01T12:00:00.000Z',
          tone: 'snow',
        },
      ],
    },
  ]
}
