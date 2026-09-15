/**
 * Content migrated from headingnorth.fi (captured 14 September 2026).
 *
 * Rules followed:
 * - Business facts (prices, durations, inclusions, policies, contact details) are verbatim.
 * - Editorial display lines (headlines, taglines) are new brand copy and contain no facts.
 * - Anything the old site did not say is either left empty (sections auto-hide) or seeded as
 *   HIDDEN placeholder content clearly marked "PLACEHOLDER" for the owner to complete.
 */

import { doc, h, link, p, paragraphs, ul } from './lexical'

/**
 * Real photography of Finnish Lapland from Wikimedia Commons (CC0, CC BY 2.0, CC BY-SA 4.0).
 * Credits and licences are stored on each media item and listed on /photo-credits.
 * Replace with commissioned HEADING NORTH photography whenever available.
 */
export const MEDIA = [
  {
    key: 'aurora-frost-landscape',
    focalX: 50,
    focalY: 38,
    file: 'photos/aurora-frost-landscape.jpg',
    title: 'Aurora over frosted wetland',
    alt: 'Green aurora arcing over a frost-covered wetland and birch trees under a violet night sky',
    caption: 'Lapland, Finland',
    category: 'aurora',
    credit: 'Vincent Guth (Unsplash)',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Aurora_borealis_over_Lapland_(Unsplash).jpg',
    featured: true
  },
  {
    key: 'aurora-over-levi',
    file: 'photos/aurora-over-levi.jpg',
    title: 'Aurora over Levi fell',
    alt: 'Wide green northern lights over the dark slopes of Levi fell in early autumn',
    caption: 'Levi, Kittilä — September',
    category: 'aurora',
    credit: 'Ximonic (Simo Räsänen)',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gentle_but_wide_green_aurora_display_over_Levi,_Kittil%C3%A4,_Lapland,_Finland,_2023_September.jpg'
  },
  {
    key: 'aurora-frosted-pines',
    focalX: 55,
    focalY: 45,
    file: 'photos/aurora-frosted-pines.jpg',
    title: 'Aurora through frosted pines',
    alt: 'Looking up through frost-covered pines as green northern lights stream across the sky',
    caption: 'Lapland, Finland',
    category: 'aurora',
    credit: 'Vincent Guth (Unsplash)',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lapland,_Finland_(Unsplash_XrwVIFy6rTw).jpg'
  },
  {
    key: 'frosty-lakeshore-dusk',
    focalX: 50,
    focalY: 70,
    file: 'photos/frosty-lakeshore-dusk.jpg',
    title: 'Frosted lakeshore at dusk',
    alt: 'Frost-covered birch trees along a frozen lakeshore in the soft pink light of a winter evening',
    caption: 'Lapland, Finland',
    category: 'landscape',
    credit: 'Vincent Guth (Unsplash)',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Winter_in_Lapland_(Unsplash).jpg'
  },
  {
    key: 'frosted-pines-sky',
    file: 'photos/frosted-pines-sky.jpg',
    title: 'Snow-covered pines from below',
    alt: 'Looking straight up at tall snow-covered pine trees against a pale winter sky',
    caption: 'Lapland, Finland',
    category: 'landscape',
    credit: 'Vincent Guth (Unsplash)',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Snowy_pines_in_Lapland_(Unsplash).jpg'
  },
  {
    key: 'aurora-tall-pines',
    focalX: 50,
    focalY: 45,
    file: 'photos/aurora-tall-pines.jpg',
    title: 'Tall pines under a faint aurora',
    alt: 'Tall frosted pines against a violet night sky with a faint green aurora',
    caption: 'Lapland, Finland',
    category: 'aurora',
    credit: 'Vincent Guth (Unsplash)',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lapland,_Finland_(Unsplash).jpg'
  },
  {
    key: 'winter-road-night',
    focalX: 50,
    focalY: 84,
    file: 'photos/winter-road-night.jpg',
    title: 'Winter road at night',
    alt: 'A car on a snow-covered forest road under a starry night sky near Rovaniemi',
    caption: 'Rovaniemi, Finland',
    category: 'vehicles',
    credit: 'Vincent Guth (Unsplash)',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rovaniemi,_Finland_(Unsplash_SvMwcHfPV14).jpg'
  },
  {
    key: 'rovaniemi-dusk',
    focalX: 42,
    focalY: 55,
    file: 'photos/rovaniemi-dusk.jpg',
    title: 'Rovaniemi at dusk',
    alt: 'A person in winter clothing silhouetted between pine trees, looking over the lights of Rovaniemi at dusk',
    caption: 'Rovaniemi, Finland',
    category: 'people',
    credit: 'Vincent Guth (Unsplash)',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rovaniemi,_Finland_(Unsplash_gm9utvaw1ao).jpg'
  },
  {
    key: 'lantern-frozen-lake',
    focalX: 62,
    focalY: 82,
    file: 'photos/lantern-frozen-lake.jpg',
    title: 'Lantern on a frozen lake',
    alt: 'A lone figure with a glowing lantern on a frozen lake under a starry night sky',
    caption: 'Rovaniemi, Finland',
    category: 'people',
    credit: 'Vincent Guth (Unsplash)',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rovaniemi,_Finland_(Unsplash).jpg'
  },
  {
    key: 'wilderness-cabins',
    focalX: 40,
    focalY: 84,
    file: 'photos/wilderness-cabins.jpg',
    title: 'Wilderness huts in the snow',
    alt: 'Two snow-covered wooden wilderness huts among tall pines in a snowy forest',
    caption: 'Rovaniemi, Finland',
    category: 'landscape',
    credit: 'Rucksack Magazine (Unsplash)',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cabin_in_Winter_Wonderland_(Unsplash).jpg'
  },
  {
    key: 'riisitunturi-crown-snow',
    focalX: 55,
    focalY: 65,
    file: 'photos/riisitunturi-crown-snow.jpg',
    title: 'Snow-crowned trees, Riisitunturi',
    alt: 'Snow-crowned spruces standing on a white fell under a pale blue winter sky',
    caption: 'Riisitunturi, Posio',
    category: 'landscape',
    credit: 'Ninara',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Riisitunturi,_Finland_-_49651414233.jpg'
  },
  {
    key: 'korouoma-frozen-falls',
    focalX: 50,
    focalY: 55,
    file: 'photos/korouoma-frozen-falls.jpg',
    title: 'Frozen waterfall, Korouoma',
    alt: 'A tall frozen waterfall streaked with amber ice on the rock wall of Korouoma Canyon',
    caption: 'Korouoma Canyon, Posio',
    category: 'landscape',
    credit: 'Ninara',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korouoma_Canyon,_Lapland_06.jpg'
  },
  {
    key: 'korouoma-blue-icefall',
    focalX: 42,
    focalY: 58,
    file: 'photos/korouoma-blue-icefall.jpg',
    title: 'Blue icefall, Korouoma',
    alt: 'A pale blue frozen waterfall on the canyon wall at Korouoma, framed by frosted trees',
    caption: 'Korouoma Canyon, Posio',
    category: 'landscape',
    credit: 'Ninara',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korouoma_Canyon,_Lapland_03.jpg'
  },
  {
    key: 'korouoma-ice-wall',
    file: 'photos/korouoma-ice-wall.jpg',
    title: 'Icicle cliffs, Korouoma',
    alt: 'Rows of icicles and frozen cascades along the snowy cliffs of Korouoma Canyon',
    caption: 'Korouoma Canyon, Posio',
    category: 'landscape',
    credit: 'Ninara',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korouoma_Canyon,_Lapland_04.jpg'
  },
  {
    key: 'korouoma-trail',
    focalX: 55,
    focalY: 55,
    file: 'photos/korouoma-trail.jpg',
    title: 'Korouoma trail in snowfall',
    alt: 'A snow-covered wooden signpost and footbridge on the hiking trail at Korouoma during snowfall',
    caption: 'Korouoma Canyon, Posio',
    category: 'landscape',
    credit: 'Nina R from Africa',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korouoma_Canyon,_Posio,_Lapland_(51141658855).jpg'
  },
  {
    key: 'korouoma-snowy-forest',
    file: 'photos/korouoma-snowy-forest.jpg',
    title: 'Snowfall in the Korouoma valley',
    alt: 'Snow-laden spruces in the Korouoma valley during a quiet snowfall',
    caption: 'Korouoma, Posio',
    category: 'landscape',
    credit: 'Nina R from Africa',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korouoma_Canyon,_Posio,_Lapland_(51139811607).jpg'
  },
  {
    key: 'ranua-polar-bears',
    focalX: 46,
    focalY: 52,
    file: 'photos/ranua-polar-bears.jpg',
    title: 'Polar bears, Ranua Wildlife Park',
    alt: 'Two polar bears in deep snow at Ranua Wildlife Park, one standing on its hind legs',
    caption: 'Ranua Wildlife Park',
    category: 'wildlife',
    credit: 'Rorolinus',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ursus_maritimus_in_Ranua_zoo.JPG'
  },
  {
    key: 'ranua-lynx',
    focalX: 58,
    focalY: 45,
    file: 'photos/ranua-lynx.jpg',
    title: 'Lynx, Ranua Wildlife Park',
    alt: 'A Eurasian lynx walking across trampled snow at Ranua Wildlife Park, seen from above',
    caption: 'Ranua Wildlife Park',
    category: 'wildlife',
    credit: 'Rorolinus',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lynx_lynx_in_Ranua_zoo.JPG'
  },
  {
    key: 'ranua-wolverine',
    focalX: 50,
    focalY: 55,
    file: 'photos/ranua-wolverine.jpg',
    title: 'Wolverine, Ranua Wildlife Park',
    alt: 'A wolverine looking up from a hollow in the snow at Ranua Wildlife Park',
    caption: 'Ranua Wildlife Park',
    category: 'wildlife',
    credit: 'Rorolinus',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gulo_gulo_in_Ranua_zoo.JPG'
  },
  {
    key: 'levi-village-blue-hour',
    focalX: 50,
    focalY: 62,
    file: 'photos/levi-village-blue-hour.jpg',
    title: 'Levi at blue hour',
    alt: 'The snowy village of Sirkka glowing at blue hour, seen from the top of Levi fell',
    caption: 'Levi, Kittilä',
    category: 'landscape',
    credit: 'DanielMichaelPerry',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sirkka_from_Levi,_Finland.jpg'
  },
  {
    key: 'levi-gondola',
    focalX: 35,
    focalY: 55,
    file: 'photos/levi-gondola.jpg',
    title: 'Levi gondola',
    alt: 'Frost-covered gondola cabins and pylon above the snowy forests and village at Levi',
    caption: 'Levi, Kittilä',
    category: 'landscape',
    credit: 'DanielMichaelPerry',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gondola_in_Levi,_Finland.jpg'
  },
  {
    key: 'reindeer-sled-forest',
    focalX: 55,
    focalY: 72,
    file: 'photos/reindeer-sled-forest.jpg',
    title: 'Reindeer sled in a snowy forest',
    alt: 'A reindeer sled on a trail through a heavily snow-laden forest',
    caption: 'Kemi, Lapland',
    category: 'wildlife',
    credit: 'Jacek Rużyczka',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hietaliete_forest_in_snow_with_reindeer_sled.jpg'
  },
  // Home hero video: a 15-second seamless loop edited from two Wikimedia Commons clips filmed in
  // Finnish Lapland (trimmed, colour-graded, crossfaded, no audio). The edit is shared under CC BY-SA 3.0.
  {
    key: 'lapland-winter-loop',
    file: 'video/lapland-winter-loop.mp4',
    title: 'Lapland winter (video loop)',
    alt: 'A reindeer walking along a sunlit snowy road, aurora above snow-covered spruces, and a reindeer looking into the camera',
    caption: 'Inari and Saariselkä, Finnish Lapland. Edited from “Rangifer tarandus – Inari 2013” by Manfred Werner – Tsui (CC BY-SA 3.0) and “Luces del Norte – Auroras Boreales Saariselkä” by El Coleccionista de Instantes (CC BY-SA 2.0).',
    description:
      'Sources: https://commons.wikimedia.org/wiki/File:Rangifer_tarandus_-_Inari_2013.ogv , https://commons.wikimedia.org/wiki/File:Video_Luces_del_Norte_Auroras_Boreales_Laponia_Saariselka.webm',
    category: 'video',
    credit: 'Manfred Werner – Tsui; El Coleccionista de Instantes',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rangifer_tarandus_-_Inari_2013.ogv'
  },
  {
    key: 'lapland-winter-loop-mobile',
    file: 'video/lapland-winter-loop-mobile.mp4',
    title: 'Lapland winter (video loop, mobile)',
    alt: 'A reindeer walking along a sunlit snowy road, aurora above snow-covered spruces, and a reindeer looking into the camera',
    caption: 'Lighter 720p version for phones. Credit: see “Lapland winter (video loop)”.',
    category: 'video'
  },
  {
    key: 'lapland-winter-poster',
    focalX: 44,
    focalY: 55,
    file: 'video/lapland-winter-poster.jpg',
    title: 'Lapland winter (video poster)',
    alt: 'A reindeer walking towards the camera along a sunlit snowy road between pine trees',
    caption: 'First frame of the hero video. Credit: see “Lapland winter (video loop)”.',
    category: 'wildlife'
  },
  {
    key: 'logo',
    file: 'logo.png',
    title: 'HEADING NORTH logo (blue)',
    alt: 'HEADING NORTH',
    category: 'brand'
  },
  {
    key: 'favicon',
    file: 'favicon-antler.webp',
    title: 'Antler favicon',
    alt: 'decorative',
    category: 'brand'
  }
] as const

export type MediaKey = (typeof MEDIA)[number]['key']

export const FAQ_CATEGORIES = [
  'General',
  'Booking',
  'Pickup',
  'Aurora',
  'What to wear',
  'Food & drink',
  'Luggage',
  'Tickets',
  'Safety',
  'Cancellation',
] as const

type ExperienceSlug = 'aurora-hunting' | 'ranua-wildlife-park' | 'korouoma-frozen-waterfall-adventure' | 'levi-experience'

export const FAQS: {
  question: string
  answer: string[]
  category: (typeof FAQ_CATEGORIES)[number]
  experiences: ExperienceSlug[]
  featured?: boolean
  slug?: string
}[] = [
  {
    question: 'How many guests can join an experience?',
    answer: ['Our experiences are designed for small groups of up to 4 guests. This allows us to provide a more personal, comfortable and flexible experience.'],
    category: 'General',
    experiences: [],
    featured: true,
  },
  {
    question: 'Do you offer pickup and drop-off?',
    answer: ['Yes. Complimentary pickup and drop-off are available from selected locations in Rovaniemi. Pickup outside our complimentary area may be available for an additional fee, depending on the location. Exact arrangements and any additional cost will be confirmed in advance.'],
    category: 'Pickup',
    experiences: ['aurora-hunting', 'ranua-wildlife-park', 'korouoma-frozen-waterfall-adventure'],
    featured: true,
  },
  {
    question: 'Can you guarantee that we will see the Northern Lights?',
    answer: ['No. The Northern Lights are a natural phenomenon, so sightings cannot be guaranteed. We carefully consider weather and viewing conditions and do our best to find suitable locations for the best possible chance of seeing them.'],
    category: 'Aurora',
    experiences: ['aurora-hunting'],
  },
  {
    question: 'What should I wear for a Lapland experience?',
    answer: ['We recommend warm layered clothing suitable for Arctic conditions, winter boots, gloves and a warm hat. Please check the weather forecast before your experience and dress appropriately for the conditions.'],
    category: 'What to wear',
    experiences: ['aurora-hunting', 'ranua-wildlife-park', 'korouoma-frozen-waterfall-adventure', 'levi-experience'],
    featured: true,
  },
  {
    question: 'Do you provide food and drinks?',
    answer: ['Food and drinks are not included in most experiences unless specifically stated on the experience page. For the Aurora Hunting experience, grilled sausages and a hot non-alcoholic berry drink are included. Please let us know in advance about any allergies or dietary requirements.'],
    category: 'Food & drink',
    experiences: ['aurora-hunting'],
  },
  {
    question: 'Can I bring luggage on the Levi experiences?',
    answer: ['Yes. Luggage is welcome on our one-way Levi experiences. If you are travelling with several large suitcases or oversized luggage, please let us know when booking so we can confirm the available space.'],
    category: 'Luggage',
    experiences: ['levi-experience'],
  },
  {
    question: 'Are entrance tickets included?',
    answer: ['Entrance tickets and activity fees are not included unless specifically stated on the experience page. For example, Ranua Wildlife Park entrance tickets are purchased separately by guests.'],
    category: 'Tickets',
    experiences: ['ranua-wildlife-park', 'levi-experience'],
  },
  // The following answers are taken verbatim from the Terms & Cancellation page.
  {
    question: 'When is my booking confirmed?',
    answer: [
      'All bookings are subject to availability and are confirmed only after you receive a booking confirmation from HEADING NORTH. Please provide accurate contact information, the number of guests, your preferred date and any relevant information when making your booking.',
    ],
    category: 'Booking',
    experiences: [],
  },
  {
    question: 'Can I cancel my booking?',
    answer: [
      'Guests may cancel their booking free of charge up to 24 hours before the scheduled starting time of the experience. Cancellations made less than 24 hours before the scheduled starting time, or failure to attend the experience, are non-refundable.',
      'To cancel or request a change to your booking, please contact HEADING NORTH as soon as possible using the contact details provided in your booking confirmation.',
    ],
    category: 'Cancellation',
    experiences: [],
  },
  {
    question: 'What happens if the weather makes an experience unsafe?',
    answer: [
      'If weather or other conditions make an experience unsafe to operate, HEADING NORTH may cancel or reschedule the experience. In such cases, guests will be offered an alternative date where possible or a refund of the amount paid directly to HEADING NORTH.',
    ],
    category: 'Safety',
    experiences: ['aurora-hunting', 'korouoma-frozen-waterfall-adventure'],
  },
]

const list = (...items: string[]) => items.map((text) => ({ text }))

const PICKUP_SUMMARY = 'Complimentary pickup from selected locations in Rovaniemi'
const PICKUP_DETAILS = 'Pickup outside the complimentary area may be available for an additional fee.'

export const EXPERIENCES = [
  {
    slug: 'aurora-hunting',
    title: 'Aurora Hunting',
    shortTitle: 'Aurora Hunting',
    eyebrow: 'Northern Lights',
    categories: ['Northern Lights'],
    tagline: 'Beyond the city lights.',
    shortDescription:
      'Chase the Northern Lights across the Arctic night on a personal small-group experience from Rovaniemi. Enjoy a flexible journey away from city lights while searching for suitable locations to experience one of Lapland’s most magical natural phenomena.',
    description: paragraphs(
      'Chase the Northern Lights across the Arctic night on a personal small-group experience from Rovaniemi. With a maximum of 4 guests, we can keep the journey comfortable and flexible while searching for suitable locations away from city lights.',
    ),
    hero: 'aurora-frosted-pines' as MediaKey,
    gallery: ['aurora-tall-pines', 'aurora-frost-landscape', 'lantern-frozen-lake'] as MediaKey[],
    duration: '3–4 hours',
    groupSize: 'Maximum 4 guests',
    startingPoint: 'Rovaniemi',
    pricing: { fromPrice: 79, unit: 'person' },
    highlights: [
      { title: 'Maximum 4 guests', text: 'Small groups mean more comfort, personal attention and time to enjoy every moment.' },
      { title: 'Away from city lights', text: 'We carefully consider weather and viewing conditions and do our best to find suitable locations for the best possible chance of seeing them.' },
      { title: 'Warm food and drink', text: 'Grilled sausages and a hot non-alcoholic berry drink are included in the experience.' },
    ],
    included: list(
      'Small-group Aurora hunting experience',
      'Maximum 4 guests',
      'Transportation during the experience',
      'Pickup and drop-off within our complimentary pickup area',
      'Hot non-alcoholic berry drink',
      'Grilled sausages',
    ),
    whatToBring: list(
      'Warm layered clothing suitable for Arctic weather',
      'Winter shoes or boots',
      'Gloves and a warm hat',
      'Personal medication if needed',
      'A camera or smartphone if you would like to capture the experience',
    ),
    pickup: { summary: PICKUP_SUMMARY, details: PICKUP_DETAILS },
    notices: [
      {
        title: 'Northern Lights sightings',
        body: 'The Northern Lights are a natural phenomenon and sightings cannot be guaranteed. We carefully consider weather and viewing conditions and do our best to find suitable locations for the best possible chance of seeing them. The route and viewing location may change depending on the conditions.',
        tone: 'important',
      },
      {
        title: 'Food & dietary requirements',
        body: 'Grilled sausages and a hot non-alcoholic berry drink are included in the experience. Please let us know in advance about any allergies or dietary requirements. Alternative options may be available when requested in advance.',
        tone: 'info',
      },
    ],
    booking: {
      label: 'Book your Aurora experience',
      ctaHeading: 'Ready to chase the Northern Lights?',
      ctaBody: 'Join HEADING NORTH for a personal Aurora experience in Finnish Lapland. With a maximum of 4 guests, you can enjoy a relaxed and flexible Arctic adventure.',
    },
    featured: true,
    meta: {
      title: 'Northern Lights Tours Rovaniemi',
      description:
        'Join a small-group Northern Lights tour from Rovaniemi with HEADING NORTH. Enjoy a personal Aurora hunting experience in Lapland with a maximum of 4 guests.',
    },
  },
  {
    slug: 'ranua-wildlife-park',
    title: 'Ranua Wildlife Park',
    shortTitle: 'Ranua',
    eyebrow: 'Arctic Wildlife',
    categories: ['Wildlife', 'Day trip'],
    tagline: 'Discover Arctic wildlife.',
    shortDescription:
      'Discover Arctic wildlife on a comfortable small-group day trip from Rovaniemi to Ranua Wildlife Park. Enjoy the journey through Finnish Lapland and explore the park at your own pace.',
    description: paragraphs(
      'Discover Arctic wildlife on a memorable small-group day trip from Rovaniemi to Ranua Wildlife Park. Travel comfortably through the beautiful landscapes of Finnish Lapland and enjoy time exploring the park, home to a variety of northern and Arctic animals.',
    ),
    hero: 'ranua-polar-bears' as MediaKey,
    gallery: ['ranua-lynx', 'ranua-wolverine', 'reindeer-sled-forest'] as MediaKey[],
    duration: '5–6 hours',
    groupSize: 'Maximum 4 guests',
    startingPoint: 'Rovaniemi',
    location: 'Ranua Wildlife Park',
    pricing: {
      fromPrice: 99,
      unit: 'person',
      note: 'Ranua Wildlife Park entrance tickets are not included in the experience price and must be purchased separately.',
    },
    highlights: [
      { title: 'Northern and Arctic animals', text: 'Enjoy time exploring the park, home to a variety of northern and Arctic animals.' },
      { title: 'Comfortable journey', text: 'Transportation from Rovaniemi to Ranua and back through the beautiful landscapes of Finnish Lapland.' },
      { title: 'Maximum 4 guests', text: 'With a maximum of 4 guests, the experience is relaxed, personal and flexible.' },
    ],
    included: list(
      'Small-group Ranua Wildlife Park experience',
      'Maximum 4 guests',
      'Transportation from Rovaniemi to Ranua and back',
      'Pickup and drop-off within our complimentary pickup area',
      'Time to explore Ranua Wildlife Park',
    ),
    notIncluded: list('Ranua Wildlife Park entrance tickets', 'Food and drinks', 'Personal expenses'),
    whatToBring: list(
      'Warm clothing suitable for the weather',
      'Comfortable walking shoes or winter boots',
      'Gloves and a warm hat during winter',
      'Personal medication if needed',
      'Camera or smartphone',
    ),
    pickup: { summary: PICKUP_SUMMARY, details: PICKUP_DETAILS },
    notices: [
      {
        title: 'Tickets and time at the park',
        body: 'Ranua Wildlife Park entrance tickets are not included in the experience price and must be purchased separately. The amount of time available at the park may vary depending on the schedule, road and weather conditions.',
        tone: 'important',
      },
    ],
    booking: {
      label: 'Book your Ranua experience',
      ctaHeading: 'Ready to discover Ranua Wildlife Park?',
      ctaBody: 'Enjoy a comfortable small-group journey from Rovaniemi to Ranua Wildlife Park with HEADING NORTH. With a maximum of 4 guests, the experience is relaxed, personal and flexible.',
    },
    featured: true,
    meta: {
      title: 'Ranua Wildlife Park Tours from Rovaniemi',
      description:
        'Discover Ranua Wildlife Park on small-group tours from Rovaniemi with HEADING NORTH. Enjoy a comfortable Lapland journey with a maximum of 4 guests.',
    },
  },
  {
    slug: 'korouoma-frozen-waterfall-adventure',
    title: 'Korouoma Frozen Waterfall Adventure',
    shortTitle: 'Korouoma',
    eyebrow: 'Frozen Waterfalls',
    categories: ['Nature', 'Active', 'Day trip'],
    tagline: 'Frozen waterfalls. Deep forests. Arctic silence.',
    shortDescription:
      'Explore the spectacular frozen waterfalls and snowy canyon landscapes of Korouoma on a memorable small-group Arctic adventure from Rovaniemi.',
    description: paragraphs(
      'Discover one of Lapland’s most spectacular winter landscapes on a small-group journey from Rovaniemi to Korouoma Canyon. Explore snow-covered forests, dramatic canyon scenery and impressive frozen waterfalls on a memorable Arctic adventure.',
    ),
    hero: 'korouoma-blue-icefall' as MediaKey,
    gallery: ['korouoma-frozen-falls', 'korouoma-ice-wall', 'korouoma-trail', 'korouoma-snowy-forest'] as MediaKey[],
    duration: '6–7 hours',
    groupSize: 'Maximum 4 guests',
    difficulty: 'challenging',
    startingPoint: 'Rovaniemi',
    location: 'Korouoma Canyon',
    pricing: { fromPrice: 109, unit: 'person' },
    highlights: [
      { title: 'Frozen waterfalls', text: 'Explore snow-covered forests, dramatic canyon scenery and impressive frozen waterfalls.' },
      { title: 'Around 6 km on foot', text: 'The hiking route is approximately 6 km and includes descents, climbs, snowy and icy sections, and uneven terrain.' },
      { title: 'Guided at Korouoma Canyon', text: 'Transportation from Rovaniemi to Korouoma and back, with a guided experience at Korouoma Canyon.' },
    ],
    included: list(
      'Small-group Korouoma experience',
      'Maximum 4 guests',
      'Transportation from Rovaniemi to Korouoma and back',
      'Pickup and drop-off within our complimentary pickup area',
      'Guided experience at Korouoma Canyon',
    ),
    whatToBring: list(
      'Warm layered clothing suitable for Arctic winter conditions',
      'Winter boots with good grip',
      'Gloves and a warm hat',
      'Water or a personal drink',
      'Personal medication if needed',
      'Camera or smartphone',
    ),
    pickup: { summary: PICKUP_SUMMARY, details: PICKUP_DETAILS },
    notices: [
      {
        title: 'A physically demanding experience',
        body: 'Korouoma is a physically demanding outdoor experience. The hiking route is approximately 6 km and includes descents, climbs, snowy and icy sections, and uneven terrain. Guests should have good physical fitness and be comfortable hiking in winter conditions. The route and duration may vary depending on weather, trail and safety conditions. Guests must follow the guide’s safety instructions throughout the experience.',
        tone: 'important',
      },
      {
        title: 'Accessibility',
        body: 'This experience may not be suitable for guests with limited mobility or health conditions that make strenuous hiking difficult.',
        tone: 'info',
      },
    ],
    booking: {
      label: 'Book your Korouoma experience',
      ctaHeading: 'Ready to explore Korouoma?',
      ctaBody: 'Experience the spectacular frozen waterfalls and winter landscapes of Korouoma on a personal small-group adventure with HEADING NORTH. With a maximum of 4 guests, you can enjoy a memorable journey into Arctic nature.',
    },
    featured: true,
    meta: {
      title: 'Korouoma Frozen Waterfall Tours from Rovaniemi',
      description:
        'Explore Korouoma’s frozen waterfalls on a small-group tour from Rovaniemi with HEADING NORTH. Experience spectacular Arctic scenery with a maximum of 4 guests.',
    },
  },
  {
    slug: 'levi-experience',
    title: 'Levi Experience',
    shortTitle: 'Levi',
    eyebrow: 'Rovaniemi — Levi',
    categories: ['Journeys', 'Day trip'],
    tagline: 'Experience Lapland beyond the ordinary.',
    shortDescription:
      'Discover Levi with a flexible small-group experience from Rovaniemi or Levi. Choose a one-way journey with accommodation drop-off or enjoy a full-day Rovaniemi–Levi–Rovaniemi experience.',
    description: paragraphs(
      'Discover Levi with the flexibility to start or finish your Lapland journey in either Rovaniemi or Levi. Our small-group experience is designed for a maximum of 4 guests, offering comfortable travel and a personal way to explore one of Lapland’s most popular destinations.',
    ),
    hero: 'levi-village-blue-hour' as MediaKey,
    gallery: ['levi-gondola', 'aurora-over-levi', 'riisitunturi-crown-snow'] as MediaKey[],
    groupSize: 'Maximum 4 guests',
    startingPoint: 'Rovaniemi or Levi',
    location: 'Levi or Rovaniemi',
    pricing: { fromPrice: 250, unit: 'group', displayLabel: 'One-way from €250 per group' },
    options: [
      {
        title: 'Rovaniemi → Levi with drop-off in Levi',
        description:
          'Start your journey in Rovaniemi and travel to Levi through the beautiful landscapes of Finnish Lapland. Enjoy selected stops along the way before arriving in Levi, where we will drop you off at your accommodation so you can continue your holiday.',
        price: 250,
        unit: 'group',
        capacity: 'Up to 4 guests',
      },
      {
        title: 'Levi → Rovaniemi with drop-off in Rovaniemi',
        description:
          'Start your journey in Levi and travel to Rovaniemi through the beautiful landscapes of Finnish Lapland. Enjoy selected stops along the way before arriving in Rovaniemi, where we will drop you off at your accommodation so you can continue your holiday.',
        price: 250,
        unit: 'group',
        capacity: 'Up to 4 guests',
      },
      {
        title: 'Rovaniemi → Levi → Rovaniemi day experience',
        description:
          'Discover Levi on a full-day experience from Rovaniemi. Travel through the beautiful landscapes of Finnish Lapland, enjoy time to explore Levi and its surroundings, and return to Rovaniemi at the end of the experience.',
        price: 400,
        unit: 'group',
        capacity: 'Up to 4 guests',
      },
    ],
    highlights: [
      { title: 'Start or finish in either town', text: 'The flexibility to start or finish your Lapland journey in either Rovaniemi or Levi.' },
      { title: 'Selected scenic stops', text: 'Enjoy selected stops along the way through the beautiful landscapes of Finnish Lapland.' },
      { title: 'Luggage welcome', text: 'Luggage is welcome on our one-way Levi experiences.' },
    ],
    included: list(
      'Personal small-group Levi experience',
      'Maximum 4 guests',
      'Transportation during the experience',
      'Pickup and drop-off according to your selected Levi experience',
      'Selected scenic stops along the journey',
    ),
    notIncluded: list('Food and drinks', 'Entrance tickets and activity fees', 'Personal expenses'),
    pickup: {
      summary: 'Pickup and drop-off confirmed in advance',
      details: 'Pickup & drop-off are confirmed in advance based on your selected experience and accommodation. Exact pickup time and drop-off arrangements will be confirmed before the experience.',
    },
    notices: [
      {
        title: 'Luggage',
        body: 'Luggage is welcome on our one-way Levi experiences. If you are travelling with several large suitcases or oversized luggage, please let us know when booking so we can confirm the available space.',
        tone: 'info',
      },
      {
        title: 'Travel time and costs',
        body: 'Travel time and selected stops may vary depending on weather, road and traffic conditions. Guests are responsible for their own food, drinks, entrance tickets, activity fees and personal expenses during the experience.',
        tone: 'important',
      },
    ],
    booking: {
      label: 'Book your Levi experience',
      ctaHeading: 'Ready to discover Levi?',
      ctaBody: 'Travel between Rovaniemi and Levi in a more personal way with HEADING NORTH. Choose a one-way experience with accommodation drop-off or enjoy a full-day Levi experience from Rovaniemi, with a maximum of 4 guests.',
    },
    featured: true,
    meta: {
      title: 'Levi Tours from Rovaniemi',
      description:
        'Discover Levi on a personal small-group experience from Rovaniemi with HEADING NORTH. Choose a one-way journey or return day experience for up to 4 guests.',
    },
  },
]

/* ------------------------------------------------------------------ legal (verbatim) */

export const TERMS = doc(
  h('h2', 'Booking & Confirmation'),
  p('All bookings are subject to availability and are confirmed only after you receive a booking confirmation from HEADING NORTH. Please provide accurate contact information, the number of guests, your preferred date and any relevant information when making your booking.'),
  p('Please check your booking details carefully after receiving confirmation and contact us as soon as possible if any information needs to be corrected.'),
  h('h2', 'Payment & Prices'),
  p('All prices displayed on the HEADING NORTH website are in euros (€) and include applicable taxes. The displayed price is the price for the experience unless otherwise stated.'),
  p('Any services, entrance tickets, meals, activities or other costs that are not specifically stated as included in the experience are the responsibility of the guest.'),
  h('h2', 'Cancellation & Refunds'),
  p('Guests may cancel their booking free of charge up to 24 hours before the scheduled starting time of the experience. Cancellations made less than 24 hours before the scheduled starting time, or failure to attend the experience, are non-refundable.'),
  p('To cancel or request a change to your booking, please contact HEADING NORTH as soon as possible using the contact details provided in your booking confirmation.'),
  p('If HEADING NORTH has to cancel an experience, guests will be offered an alternative date where possible or a refund of the amount paid directly to HEADING NORTH.'),
  h('h2', 'Weather & Natural Conditions'),
  p('HEADING NORTH experiences take place in Arctic conditions, and weather, road, snow and trail conditions can change quickly. For safety or operational reasons, the route, schedule, viewing location or planned stops may be changed when necessary.'),
  p('The Northern Lights are a natural phenomenon and sightings cannot be guaranteed. A tour is not considered unsuccessful solely because the Northern Lights are not visible.'),
  p('If weather or other conditions make an experience unsafe to operate, HEADING NORTH may cancel or reschedule the experience. In such cases, guests will be offered an alternative date where possible or a refund of the amount paid directly to HEADING NORTH.'),
  h('h2', 'Guest Responsibilities & Safety'),
  p('Guests are responsible for following the guide’s safety instructions throughout the experience and for behaving in a way that does not endanger themselves, other guests or the guide.'),
  p('Guests should wear clothing and footwear suitable for the weather and the activity. Some experiences, particularly Korouoma, require good physical fitness and involve walking on snowy, icy and uneven terrain. Guests are responsible for informing HEADING NORTH in advance about any relevant mobility limitations, health considerations or other circumstances that may affect their safe participation.'),
  p('HEADING NORTH may modify or stop an activity if continuing would create an unreasonable safety risk.'),
  h('h2', 'Late Arrivals & No-Shows'),
  p('Guests should be ready at the confirmed pickup or meeting point at least 10 minutes before the scheduled pickup time.'),
  p('If you expect to be late, please contact HEADING NORTH as soon as possible. We will make reasonable efforts to accommodate delays where possible, but waiting cannot be guaranteed if it would significantly affect the experience or other guests.'),
  p('Failure to arrive at the confirmed pickup or meeting point without prior notice may be treated as a no-show. No-shows are non-refundable.'),
  h('h2', 'Changes to Experiences'),
  p('The itinerary, route, schedule, stops and duration shown on our website are approximate and may change due to weather, road, trail, safety or other operational conditions.'),
  p('HEADING NORTH may make reasonable changes to an experience when necessary to provide the service safely and appropriately. We will inform guests of significant changes whenever reasonably possible.'),
  h('h2', 'Food, Allergies & Dietary Requirements'),
  p('Some HEADING NORTH experiences may include food or drinks as specifically stated in the experience description. Guests must inform us in advance about any allergies, dietary requirements or other food-related restrictions.'),
  p('We will make reasonable efforts to accommodate dietary requirements when notified in advance, but alternative options cannot always be guaranteed.'),
  h('h2', 'Third-Party Bookings'),
  p('If an experience is booked through a third-party booking platform, the payment, cancellation, refund and booking conditions of that platform may also apply. Please refer to the terms provided by the booking platform when making your reservation.'),
  p('For bookings made directly with HEADING NORTH, the terms and cancellation conditions stated on this website apply.'),
  h('h2', 'Contact & Questions'),
  p('If you have any questions about these Terms & Cancellation conditions, your booking or your experience, please contact HEADING NORTH.'),
  ul([
    ['Email: ', link('info@headingnorth.fi', 'mailto:info@headingnorth.fi')],
    ['WhatsApp: ', link('+358 44 246 2427', 'https://wa.me/358442462427')],
    ['Location: Rovaniemi, Finland'],
  ]),
)

export const CANCELLATION = doc(
  p('This page brings together the cancellation-related sections of our ', link('Terms & Cancellation', '/terms'), '. The full terms apply to every booking.'),
  h('h2', 'Cancellation & Refunds'),
  p('Guests may cancel their booking free of charge up to 24 hours before the scheduled starting time of the experience. Cancellations made less than 24 hours before the scheduled starting time, or failure to attend the experience, are non-refundable.'),
  p('To cancel or request a change to your booking, please contact HEADING NORTH as soon as possible using the contact details provided in your booking confirmation.'),
  p('If HEADING NORTH has to cancel an experience, guests will be offered an alternative date where possible or a refund of the amount paid directly to HEADING NORTH.'),
  h('h2', 'Weather & Natural Conditions'),
  p('The Northern Lights are a natural phenomenon and sightings cannot be guaranteed. A tour is not considered unsuccessful solely because the Northern Lights are not visible.'),
  p('If weather or other conditions make an experience unsafe to operate, HEADING NORTH may cancel or reschedule the experience. In such cases, guests will be offered an alternative date where possible or a refund of the amount paid directly to HEADING NORTH.'),
  h('h2', 'Late Arrivals & No-Shows'),
  p('Guests should be ready at the confirmed pickup or meeting point at least 10 minutes before the scheduled pickup time.'),
  p('Failure to arrive at the confirmed pickup or meeting point without prior notice may be treated as a no-show. No-shows are non-refundable.'),
  h('h2', 'Third-Party Bookings'),
  p('If an experience is booked through a third-party booking platform, the payment, cancellation, refund and booking conditions of that platform may also apply. Please refer to the terms provided by the booking platform when making your reservation.'),
)

export const PRIVACY = doc(
  p('HEADING NORTH respects your privacy and is committed to handling personal information responsibly. This Privacy Policy explains what information we collect, why we collect it, and how we use it when you contact us or use our services.'),
  h('h2', '1. Who We Are'),
  p('HEADING NORTH is a tourism service provider based in Rovaniemi, Finland.'),
  ul([
    ['Business ID: 3536358-1'],
    ['Email: ', link('info@headingnorth.fi', 'mailto:info@headingnorth.fi')],
    ['WhatsApp: +358 44 246 2427'],
    ['Location: Rovaniemi, Finland'],
    ['Website: headingnorth.fi'],
  ]),
  h('h2', '2. What Personal Information We Collect'),
  p('When you contact us, submit an inquiry or make a booking, we may collect information such as:'),
  ul([
    'Name',
    'Email address',
    'Mobile or WhatsApp number',
    'Experience or tour you are interested in',
    'Preferred experience date',
    'Number of guests',
    'Messages, special requests or other information you choose to provide',
    'Information necessary to arrange your booking, pickup or experience',
  ]),
  p('Please avoid providing unnecessary sensitive personal information through our contact form.'),
  h('h2', '3. Why We Use Your Information'),
  p('We use personal information when necessary to:'),
  ul([
    'Respond to inquiries and communicate with you',
    'Process and manage bookings',
    'Arrange experiences, pickup and drop-off',
    'Provide requested customer service',
    'Handle changes, cancellations and refunds',
    'Meet applicable legal, accounting and regulatory obligations',
    'Maintain the safety and proper operation of our services',
  ]),
  p('We do not sell your personal information.'),
  h('h2', '4. Contact Form'),
  p('When you submit the inquiry form on our website, the information you enter is used to respond to your inquiry and, where applicable, arrange your booking.'),
  p('Our form asks you to agree that HEADING NORTH may use the information you provide to respond to your inquiry.'),
  h('h2', '5. Email and WhatsApp'),
  p('If you contact HEADING NORTH by email or WhatsApp, the information you provide will be processed for the purpose of responding to your inquiry, managing your booking or providing the requested service.'),
  p('WhatsApp and your email provider may process information according to their own privacy policies.'),
  h('h2', '6. Third-Party Booking Services'),
  p('If you book a HEADING NORTH experience through a third-party booking platform, that platform may collect and process your personal information according to its own privacy policy.'),
  p('We may receive information from the platform that is necessary to manage and provide your booked experience.'),
  h('h2', '7. How Long We Keep Your Information'),
  p('We keep personal information only for as long as reasonably necessary for the purpose for which it was collected and for any period required by applicable legal, accounting or regulatory obligations.'),
  p('Information that is no longer required will be deleted or otherwise appropriately disposed of.'),
  h('h2', '8. Sharing Your Information'),
  p('We do not sell or rent your personal information.'),
  p('Information may be shared with service providers or other parties only when necessary to operate our website, process bookings, provide the requested service, comply with legal obligations or protect legitimate rights and interests.'),
  h('h2', '9. Cookies and Website Technology'),
  p('Our website may use cookies and similar technologies that are necessary for website functionality, security and performance.'),
  p('If we later introduce analytics, advertising or other non-essential tracking technologies that require consent, we will provide appropriate information and consent choices where required.'),
  h('h2', '10. Your Privacy Rights'),
  p('Under applicable data-protection law, including the GDPR where applicable, you may have rights concerning your personal information, including the right to request access, correction or deletion of your information, and in certain circumstances to restrict or object to processing.'),
  p('Where processing is based on consent, you may also have the right to withdraw your consent.'),
  p('To make a privacy-related request, contact: ', link('info@headingnorth.fi', 'mailto:info@headingnorth.fi')),
  p('You also have the right to lodge a complaint with the competent data-protection supervisory authority if you believe your personal information has been processed unlawfully.'),
  h('h2', '11. Changes to This Privacy Policy'),
  p('We may update this Privacy Policy when our services, website or legal requirements change. The latest version will be published on this page with an updated revision date.'),
)
