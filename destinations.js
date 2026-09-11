// Curated realistic multi-platform booking database for Travelflow
export const DESTINATIONS = [
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa, India',
    tagline: 'Sun-drenched beaches, Portuguese colonial villas & vibrant susegad living',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
    bestSeason: 'Nov – March',
    avgTemp: '28°C',
    defaultDays: 4,
    recommendedBudget: 26000,
    budgetTiers: {
      backpacker: {
        dailyPerPerson: 2200,
        label: 'Backpacker & Solo',
        description: 'Vibrant beach hostels, rented scooters, authentic beach shacks & free sunset viewpoints.',
        stayType: 'Social Beach Hostel & Homestay',
        transportType: 'Self-drive Scooter / Local Ferry',
        diningType: 'Beach Shacks & Local Fish Curry Thalis',
        experiences: 'Sunset cliffs, Old Goa heritage churches, beach swimming'
      },
      comfort: {
        dailyPerPerson: 5800,
        label: 'Explorer & Comfort',
        description: 'Boutique Portuguese villa resorts, private AC cab rentals, seafood dining & heritage walks.',
        stayType: 'Boutique 4-Star Heritage Villa with Pool',
        transportType: 'Private AC Cab Rental',
        diningType: 'Chef-led Indo-Portuguese Bistros & Sunset Lounges',
        experiences: 'Fontainhas guided walk, spice plantation tour, catamaran sail'
      },
      luxury: {
        dailyPerPerson: 14500,
        label: 'Luxury & Bespoke',
        description: '5-star beachfront palaces, private yacht charters, private mixology & spa wellness.',
        stayType: '5-Star Oceanfront Resort (Taj / W Goa)',
        transportType: 'Private Chauffeur Sedan / SUV',
        diningType: 'Fine-dining Seafood & Private Beachside Candlelight Dinners',
        experiences: 'Private sunset yacht cruise, personalized spice masterclass, premier cabana'
      }
    },
    itineraryDays: [
      {
        day: 1,
        title: 'Arrival & North Goa Coastal Sunset',
        summary: 'Settle into your boutique stay, explore Vagator cliffs, and unwind with fresh coconut and live acoustic sundowners.',
        activities: [
          {
            id: 'goa-d1-1',
            time: '08:30 AM – 10:00 AM',
            title: 'Arrival at Dabolim/MOPA Airport & Scenic Coast Drive',
            category: 'transit',
            cost: 1200,
            location: 'Airport to North Goa Stay',
            notes: 'Private pre-booked AC transit passing through coconut groves & Zuari bridge.',
            buffer: 'Includes 20 min buffer for luggage retrieval'
          },
          {
            id: 'goa-d1-2',
            time: '10:30 AM – 12:00 PM',
            title: 'Check-in & Traditional Goan Breakfast',
            category: 'food',
            cost: 450,
            location: 'Artjuna Cafe, Anjuna',
            notes: 'Poee bread with Goan pork sausage or mushroom cafe bhaji with fresh passionfruit juice.',
            buffer: 'Relaxed 40 min garden patio rest'
          },
          {
            id: 'goa-d1-3',
            time: '01:00 PM – 03:30 PM',
            title: 'Vagator Beach & Chapora Fort Historical Hike',
            category: 'attraction',
            cost: 200,
            location: 'Chapora Fort Ridge',
            notes: 'Iconic panoramic viewpoint overlooking the Arabian Sea and Chapora River mouth.',
            buffer: '30 min buffer for hydration & photos'
          },
          {
            id: 'goa-d1-4',
            time: '04:30 PM – 06:30 PM',
            title: 'Anjuna Flea Market & Seaside Coffee',
            category: 'buffer',
            cost: 350,
            location: 'Anjuna Coastal Promenade',
            notes: 'Leisurely stroll through bohemian artisan stalls, handcrafted accessories & espresso.',
            buffer: 'Completely open buffer time'
          },
          {
            id: 'goa-d1-5',
            time: '07:30 PM – 09:30 PM',
            title: 'Seaside Coastal Dinner with Live Jazz',
            category: 'food',
            cost: 1100,
            location: 'Curlies / Thalassa Seaside',
            notes: 'Grilled tiger prawns, rava fried calamari & Goan kokum mocktails under palm lanterns.',
            buffer: 'Reservations recommended'
          }
        ]
      },
      {
        day: 2,
        title: 'Old Goa Latin Quarter & Spice Sanctuaries',
        summary: 'Immerse in Portuguese architecture in Fontainhas, ancient basilicas, and an organic plantation feast.',
        activities: [
          {
            id: 'goa-d2-1',
            time: '08:00 AM – 09:15 AM',
            title: 'Heritage Walk through Fontainhas Latin Quarter',
            category: 'attraction',
            cost: 300,
            location: 'Panjim Latin Quarter',
            notes: 'Pastel-toned villas, azulejo tile murals, antique wooden verandas and iconic bakeries.',
            buffer: '20 min photography buffer'
          },
          {
            id: 'goa-d2-2',
            time: '09:30 AM – 10:30 AM',
            title: 'Morning Pastries at 31st January Bakery',
            category: 'food',
            cost: 280,
            location: 'Rua 31 de Janeiro, Panaji',
            notes: 'Warm traditional Bebinca, date cakes, and Goan artisanal coffee.',
            buffer: '15 min leisurely chat'
          },
          {
            id: 'goa-d2-3',
            time: '11:15 AM – 01:00 PM',
            title: 'Basilica of Bom Jesus & Se Cathedral',
            category: 'attraction',
            cost: 150,
            location: 'Old Goa',
            notes: 'UNESCO World Heritage 16th-century baroque architecture preserving relics of St. Francis Xavier.',
            buffer: '25 min courtyard buffer'
          },
          {
            id: 'goa-d2-4',
            time: '01:45 PM – 04:00 PM',
            title: 'Sahakari Spice Plantation Tour & Traditional Buffet',
            category: 'food',
            cost: 950,
            location: 'Ponda Spice Valley',
            notes: 'Guided botany walk with vanilla and cardamom plantations, followed by banana-leaf Goan lunch.',
            buffer: '40 min hammock relaxation'
          },
          {
            id: 'goa-d2-5',
            time: '05:30 PM – 07:30 PM',
            title: 'Mandovi River Sunset Cruise / Kayaking',
            category: 'attraction',
            cost: 800,
            location: 'Panaji Jetty',
            notes: 'Glide along mangrove backwaters with views of floating casinos and heritage lights.',
            buffer: 'Includes life jacket safety prep'
          }
        ]
      },
      {
        day: 3,
        title: 'South Goa Untouched Shores & Cabo de Rama',
        summary: 'Escape to South Goa’s turquoise coves, dramatic cliff fort ruins, and relaxed beachside solitude.',
        activities: [
          {
            id: 'goa-d3-1',
            time: '09:00 AM – 11:30 AM',
            title: 'Scenic Drive to Palolem Beach & Dolphin Spotting',
            category: 'transit',
            cost: 1400,
            location: 'South Goa Coastline',
            notes: 'Lush coconut highways leading to the tranquil crescent bay of Palolem.',
            buffer: 'Comfortable road transit'
          },
          {
            id: 'goa-d3-2',
            time: '12:00 PM – 02:00 PM',
            title: 'Butterfly Beach Boat Ride & Fresh Crab Lunch',
            category: 'attraction',
            cost: 1200,
            location: 'Butterfly Beach Cove',
            notes: 'Secluded cove accessible only by boat; crystalline water ideal for swimming.',
            buffer: '30 min sunbathing buffer'
          },
          {
            id: 'goa-d3-3',
            time: '03:00 PM – 05:30 PM',
            title: 'Cabo de Rama Fort & Cliff Overlook',
            category: 'attraction',
            cost: 250,
            location: 'Canacona Ridge',
            notes: 'Ancient coastal fortress ruins with a sheer 50-meter plunge into azure surf.',
            buffer: '45 min sunset picnic buffer'
          },
          {
            id: 'goa-d3-4',
            time: '07:00 PM – 09:30 PM',
            title: 'Candlelight Dinner at Fisherman\'s Wharf',
            category: 'food',
            cost: 1400,
            location: 'Mobor, Cavelossim',
            notes: 'Riverfront deck serving Goan fish curry, butter garlic lobster, and live Portuguese fado music.',
            buffer: 'Open dinner buffer'
          }
        ]
      },
      {
        day: 4,
        title: 'Artisan Souvenirs & Relaxed Departure',
        summary: 'Pick up organic cashew feni, local spices, and handmade ceramics before heading to the terminal.',
        activities: [
          {
            id: 'goa-d4-1',
            time: '09:00 AM – 10:30 AM',
            title: 'Late Brunch at Baba Au Rhum',
            category: 'food',
            cost: 650,
            location: 'Anjuna Bamboo Grove',
            notes: 'Croissants, artisanal shakshuka, fresh cold-pressed pineapple juice among bamboo trees.',
            buffer: 'Casual morning buffer'
          },
          {
            id: 'goa-d4-2',
            time: '11:00 AM – 01:00 PM',
            title: 'Souvenir Hunting: Feni, Spices & Portuguese Azulejos',
            category: 'buffer',
            cost: 1000,
            location: 'Mapusa Market / Panjim Promenade',
            notes: 'Pack vacuum-sealed cashew nuts, local feni, and handcrafted ceramic home items.',
            buffer: '60 min flexible buffer'
          },
          {
            id: 'goa-d4-3',
            time: '02:00 PM – 03:30 PM',
            title: 'Airport Transit & Check-in',
            category: 'transit',
            cost: 1100,
            location: 'Hotel to MOPA / GOI Airport',
            notes: 'Timely departure transfer ensuring minimum 2 hours pre-flight boarding.',
            buffer: 'Final buffer for security gate'
          }
        ]
      }
    ],
    transits: {
      flights: [
        {
          id: 'fl-1',
          airline: 'IndiGo',
          flightNumber: '6E-512',
          logo: '✈️',
          from: 'BOM (Mumbai)',
          to: 'GOX (Goa Mopa)',
          deptTime: '06:15 AM',
          arrTime: '07:30 AM',
          duration: '1h 15m',
          type: 'Non-stop',
          badge: 'Cheapest Option',
          badgeType: 'cheapest',
          reason: 'Save ₹1,850 vs average day rate; early morning arrival gives you an extra full day.',
          platformOptions: [
            { platform: 'MakeMyTrip', price: 3450, isLowest: true, badge: 'Cheapest', url: 'https://www.makemytrip.com/flight/search?itinerary=BOM-GOX-2026-09-25&tripType=O' },
            { platform: 'EaseMyTrip', price: 3520, isLowest: false, badge: 'Zero Conv. Fee', url: 'https://www.easemytrip.com/flight-search/BOM-GOX/2026-09-25' },
            { platform: 'IndiGo Official', price: 3580, isLowest: false, badge: 'Official Airline', url: 'https://www.goindigo.in' },
            { platform: 'Yatra', price: 3610, isLowest: false, badge: '₹500 Off with Code', url: 'https://www.yatra.com/flights' }
          ]
        },
        {
          id: 'fl-2',
          airline: 'Air India Express',
          flightNumber: 'IX-198',
          logo: '✈️',
          from: 'BOM (Mumbai)',
          to: 'GOI (Goa Dabolim)',
          deptTime: '10:45 AM',
          arrTime: '11:55 AM',
          duration: '1h 10m',
          type: 'Non-stop',
          badge: 'Fastest Transit',
          badgeType: 'fastest',
          reason: 'Quickest flight directly landing at Dabolim (ideal for Central & South Goa stays).',
          platformOptions: [
            { platform: 'EaseMyTrip', price: 4180, isLowest: true, badge: 'Best Price', url: 'https://www.easemytrip.com' },
            { platform: 'MakeMyTrip', price: 4200, isLowest: false, badge: 'Instant Refund', url: 'https://www.makemytrip.com' },
            { platform: 'Air India', price: 4250, isLowest: false, badge: 'Official Airline', url: 'https://www.airindia.com' },
            { platform: 'Cleartrip', price: 4290, isLowest: false, badge: 'Standard', url: 'https://www.cleartrip.com' }
          ]
        },
        {
          id: 'fl-3',
          airline: 'Vistara / Air India',
          flightNumber: 'UK-841',
          logo: '✈️',
          from: 'BOM (Mumbai)',
          to: 'GOX (Goa Mopa)',
          deptTime: '02:30 PM',
          arrTime: '03:45 PM',
          duration: '1h 15m',
          type: 'Non-stop',
          badge: 'Most Comfortable',
          badgeType: 'comfort',
          reason: 'Premium Economy with gourmet hot meal, priority boarding, extra legroom & 20kg check-in.',
          platformOptions: [
            { platform: 'MakeMyTrip', price: 6850, isLowest: true, badge: 'Lowest Premium', url: 'https://www.makemytrip.com' },
            { platform: 'Air India Official', price: 6920, isLowest: false, badge: 'Direct', url: 'https://www.airindia.com' },
            { platform: 'Yatra', price: 7100, isLowest: false, badge: 'Standard', url: 'https://www.yatra.com' }
          ]
        }
      ],
      trains: [
        {
          id: 'tr-1',
          trainNumber: '22229',
          name: 'Vande Bharat Express',
          from: 'CSMT Mumbai',
          to: 'Madgaon (MAO)',
          deptTime: '05:25 AM',
          arrTime: '01:10 PM',
          duration: '7h 45m',
          classes: [
            { code: 'CC', name: 'Chair Car', price: 1815, availability: 'AVAILABLE - 54' },
            { code: 'EC', name: 'Exec Chair Car', price: 3355, availability: 'AVAILABLE - 16' }
          ],
          badge: 'Fastest & Scenic',
          badgeType: 'fastest',
          reason: 'Modern high-speed train cutting 4 hours off regular Konkan railway transit with included catering.',
          platformOptions: [
            { platform: 'IRCTC Rail Connect', price: 1815, isLowest: true, badge: 'Official Indian Railways', url: 'https://www.irctc.co.in/nget/train-search' },
            { platform: 'ConfirmTkt', price: 1840, isLowest: false, badge: 'Trip Guarantee', url: 'https://www.confirmtkt.com' },
            { platform: 'MakeMyTrip Trains', price: 1845, isLowest: false, badge: 'Free Cancellation Pass', url: 'https://www.makemytrip.com/railways' },
            { platform: 'ixigo', price: 1835, isLowest: false, badge: 'Live Running Status', url: 'https://www.ixigo.com/trains' }
          ]
        },
        {
          id: 'tr-2',
          trainNumber: '10103',
          name: 'Mandovi Express',
          from: 'CSMT Mumbai',
          to: 'Madgaon (MAO)',
          deptTime: '07:10 AM',
          arrTime: '07:15 PM',
          duration: '12h 05m',
          classes: [
            { code: '2S', name: 'Second Sitting', price: 320, availability: 'AVAILABLE - 110' },
            { code: '3A', name: '3-Tier AC', price: 1145, availability: 'RAC 4' },
            { code: '2A', name: '2-Tier AC', price: 1640, availability: 'AVAILABLE - 22' }
          ],
          badge: 'Cheapest Konkan Ride',
          badgeType: 'cheapest',
          reason: 'Legendary scenic Konkan route famous for panty-car food & waterfall bridges at under ₹1,200.',
          platformOptions: [
            { platform: 'IRCTC Rail Connect', price: 1145, isLowest: true, badge: 'Official', url: 'https://www.irctc.co.in' },
            { platform: 'ConfirmTkt', price: 1165, isLowest: false, badge: 'Alternate Berth Match', url: 'https://www.confirmtkt.com' },
            { platform: 'MakeMyTrip', price: 1170, isLowest: false, badge: 'Standard', url: 'https://www.makemytrip.com' }
          ]
        },
        {
          id: 'tr-3',
          trainNumber: '12432',
          name: 'Trivandrum Rajdhani Express',
          from: 'Panvel (PNVL)',
          to: 'Madgaon (MAO)',
          deptTime: '11:05 PM',
          arrTime: '07:05 AM',
          duration: '8h 00m',
          classes: [
            { code: '3A', name: '3-Tier AC', price: 1850, availability: 'AVAILABLE - 38' },
            { code: '2A', name: '2-Tier AC', price: 2650, availability: 'AVAILABLE - 12' },
            { code: '1A', name: 'First AC Cabin', price: 3950, availability: 'AVAILABLE - 4' }
          ],
          badge: 'Most Comfortable Overnight',
          badgeType: 'comfort',
          reason: 'Overnight sleeper saving hotel cost for night 1; full bedding & hot dinner delivered to your berth.',
          platformOptions: [
            { platform: 'IRCTC Rail Connect', price: 1850, isLowest: true, badge: 'Official Portal', url: 'https://www.irctc.co.in' },
            { platform: 'ConfirmTkt', price: 1880, isLowest: false, badge: 'Tatkal Predictor', url: 'https://www.confirmtkt.com' },
            { platform: 'ixigo Trains', price: 1875, isLowest: false, badge: 'Instant PNR', url: 'https://www.ixigo.com' }
          ]
        }
      ]
    },
    stays: [
      {
        id: 'st-1',
        name: 'The Postcard Moira — Heritage Hideaway',
        tier: 'luxury',
        type: 'Boutique Heritage Villa',
        rating: 4.9,
        reviewsCount: 384,
        location: 'Moira, North Goa (Near Mapusa)',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
        amenities: ['Private Plunge Pool', 'Ayurvedic Spa', 'Bespoke Goan Dining', 'Artisan Coffee', 'High-Speed Wi-Fi'],
        badge: 'Top Rated Boutique',
        platformOptions: [
          { platform: 'Booking.com', pricePerNight: 12200, isLowest: true, badge: 'Best Rate Guarantee', url: 'https://www.booking.com' },
          { platform: 'Agoda', pricePerNight: 12450, isLowest: false, badge: 'VIP Member Deal', url: 'https://www.agoda.com' },
          { platform: 'MakeMyTrip', pricePerNight: 12500, isLowest: false, badge: 'Breakfast Included', url: 'https://www.makemytrip.com' },
          { platform: 'Hotel Direct', pricePerNight: 13000, isLowest: false, badge: 'Welcome Drinks', url: 'https://postcardresorts.com' }
        ]
      },
      {
        id: 'st-2',
        name: 'Ahilya by the Sea',
        tier: 'luxury',
        type: 'Luxury Oceanfront Haven',
        rating: 4.85,
        reviewsCount: 512,
        location: 'Nerul, Dolphin Bay',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
        amenities: ['2 Ocean Facing Pools', 'Direct Beach Access', 'Candlelight Deck', 'Yoga Pavilion', 'Airport Limousine'],
        badge: 'Luxury Pick',
        platformOptions: [
          { platform: 'Agoda', pricePerNight: 16500, isLowest: true, badge: 'Secret Deal', url: 'https://www.agoda.com' },
          { platform: 'Booking.com', pricePerNight: 16750, isLowest: false, badge: 'Free Cancellation', url: 'https://www.booking.com' },
          { platform: 'MakeMyTrip', pricePerNight: 16800, isLowest: false, badge: 'Earn MMT Cash', url: 'https://www.makemytrip.com' }
        ]
      },
      {
        id: 'st-3',
        name: 'Casa Da Praia — Portuguese Villa',
        tier: 'comfort',
        type: 'Charming Portuguese Bed & Breakfast',
        rating: 4.7,
        reviewsCount: 620,
        location: 'Candolim Beach (3 min walk)',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
        amenities: ['Garden Swimming Pool', 'Complimentary Breakfast', 'Balcony Suites', 'Scooter Rental Desk', 'Wi-Fi'],
        badge: 'Best Value Comfort',
        platformOptions: [
          { platform: 'MakeMyTrip', pricePerNight: 4750, isLowest: true, badge: 'Lowest Fare', url: 'https://www.makemytrip.com' },
          { platform: 'Goibibo', pricePerNight: 4800, isLowest: false, badge: 'Bank Discount', url: 'https://www.goibibo.com' },
          { platform: 'Booking.com', pricePerNight: 4950, isLowest: false, badge: 'Pay at Property', url: 'https://www.booking.com' }
        ]
      },
      {
        id: 'st-4',
        name: 'The Noname Social Homestay & Co-work',
        tier: 'backpacker',
        type: 'Eco-Chic Social Homestay',
        rating: 4.65,
        reviewsCount: 890,
        location: 'Vagator Beach Road',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
        amenities: ['Community Kitchen', 'Air-Conditioned Dorms & Private Pods', 'Rooftop Hammocks', 'Gigabit Wi-Fi', 'Daily Sunset Events'],
        badge: 'Solo Traveler Choice',
        platformOptions: [
          { platform: 'Hostelworld', pricePerNight: 1850, isLowest: true, badge: 'Backpacker Rate', url: 'https://www.hostelworld.com' },
          { platform: 'Booking.com', pricePerNight: 1950, isLowest: false, badge: 'Instant Confirmation', url: 'https://www.booking.com' },
          { platform: 'MakeMyTrip', pricePerNight: 2000, isLowest: false, badge: 'Standard', url: 'https://www.makemytrip.com' }
        ]
      }
    ]
  },
  {
    id: 'manali',
    name: 'Manali & Solang',
    state: 'Himachal Pradesh, India',
    tagline: 'Snow-capped Himalayan spires, cedar wood cabins & high alpine trails',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
    bestSeason: 'Year-Round (Snow in Dec-Feb, Lush Jun-Sep)',
    avgTemp: '16°C',
    defaultDays: 5,
    recommendedBudget: 32000,
    budgetTiers: {
      backpacker: {
        dailyPerPerson: 1800,
        label: 'Backpacker & Trekker',
        description: 'Cozy apple orchard hostels in Old Manali, shared Himalayan volvo buses & scenic village trails.',
        stayType: 'Rustic Pine Hostel & Riverside Dorm',
        transportType: 'Local Shared Jeeps & Walking',
        diningType: 'Old Manali Israeli Cafes & Momos',
        experiences: 'Jogini waterfall trek, Hadimba forest walk, hot springs'
      },
      comfort: {
        dailyPerPerson: 4900,
        label: 'Explorer & Mountain Comfort',
        description: 'Boutique wooden cottages with Himalayan balcony views, private 4x4 cab, and Solang snow activities.',
        stayType: 'Boutique Wooden Chalet with Fireplace',
        transportType: 'Private 4x4 Bolero / Innova Cab',
        diningType: 'Trout Bistros & Himalayan Woodfired Pizza',
        experiences: 'Atal Tunnel crossing, Sissu waterfall, Solang paragliding'
      },
      luxury: {
        dailyPerPerson: 13000,
        label: 'Alpine Luxury & Spa',
        description: '5-star pine luxury resort (The Himalayan Castle / Span Resort), heated outdoor pool & helicopter joyride.',
        stayType: '5-Star Luxury Mountain Resort with Heated Pool',
        transportType: 'Private Chauffeur Fortuner / Luxury SUV',
        diningType: 'Fine Dine Himalayan Trout & Private Bonfire Barbecue',
        experiences: 'Helicopter snow ride to Rohtang, private spa day, chef-curated picnic'
      }
    },
    itineraryDays: [
      {
        day: 1,
        title: 'Arrival into Kullu Valley & Old Manali Vibe',
        summary: 'Check into your pine wood chalet, breathe in cedar air, and stroll down the bohemian alleys of Old Manali.',
        activities: [
          {
            id: 'mnl-d1-1',
            time: '09:00 AM – 11:00 AM',
            title: 'Arrival at Bhuntar Airport / Volvo Stand & Valley Transfer',
            category: 'transit',
            cost: 1400,
            location: 'Bhuntar to Old Manali',
            notes: 'Follow the Beas River upstream flanked by towering deodar forests.',
            buffer: 'Includes 30 min road stop for tea & mountain views'
          },
          {
            id: 'mnl-d1-2',
            time: '12:00 PM – 02:00 PM',
            title: 'Himalayan Trout Lunch at Cafe 1947',
            category: 'food',
            cost: 750,
            location: 'Old Manali Riverside',
            notes: 'Freshly caught river trout in lemon garlic butter right beside the gushing river.',
            buffer: '30 min riverside stroll buffer'
          },
          {
            id: 'mnl-d1-3',
            time: '03:00 PM – 05:30 PM',
            title: 'Hadimba Wooden Temple & Cedar Forest Stroll',
            category: 'attraction',
            cost: 150,
            location: 'Dhungri Forest',
            notes: '1553 AD pagoda-style wooden temple nestled within giant 500-year-old cedar trees.',
            buffer: '25 min courtyard photography buffer'
          },
          {
            id: 'mnl-d1-4',
            time: '06:30 PM – 09:00 PM',
            title: 'Old Manali Acoustic Evening & Apple Cider',
            category: 'buffer',
            cost: 600,
            location: 'Dylan’s Toasted & Roasted Cafe',
            notes: 'Fresh hot chocolate, walnut cookies, and acoustic mountain guitar jam.',
            buffer: 'Completely flexible leisure'
          }
        ]
      },
      {
        day: 2,
        title: 'Atal Tunnel, Sissu & Lahaul Valley Expedition',
        summary: 'Pass through the world’s longest highway tunnel into the surreal barren landscape of Lahaul Valley.',
        activities: [
          {
            id: 'mnl-d2-1',
            time: '08:00 AM – 09:30 AM',
            title: 'Atal Tunnel Crossing (9.02 km)',
            category: 'transit',
            cost: 1200,
            location: 'Dhundi to North Portal',
            notes: 'Drive through 3,100m high engineering marvel bridging green Kullu with stark Lahaul.',
            buffer: '15 min photo point buffer'
          },
          {
            id: 'mnl-d2-2',
            time: '10:00 AM – 01:00 PM',
            title: 'Sissu Waterfall & Chandra River Glacial Basin',
            category: 'attraction',
            cost: 350,
            location: 'Sissu, Lahaul',
            notes: 'Walk across the wooden footbridge towards the cascading glacial falls; zip-line options.',
            buffer: '40 min scenic picnic buffer'
          },
          {
            id: 'mnl-d2-3',
            time: '01:30 PM – 03:00 PM',
            title: 'Traditional Lahauli Thukpa & Siddu Lunch',
            category: 'food',
            cost: 450,
            location: 'Sissu Valley Homestay',
            notes: 'Steaming wheat siddu stuffed with walnut paste, hot butter and mountain broth.',
            buffer: '20 min rest'
          },
          {
            id: 'mnl-d2-4',
            time: '04:30 PM – 07:00 PM',
            title: 'Solang Valley Alpine Meadows',
            category: 'attraction',
            cost: 800,
            location: 'Solang Valley',
            notes: 'Ropeway cable car ride to 3,200m altitude for panoramic views of Friendship Peak.',
            buffer: '30 min buffer'
          }
        ]
      }
    ],
    transits: {
      flights: [
        {
          id: 'mnl-fl-1',
          airline: 'Alliance Air',
          flightNumber: '9I-805',
          logo: '✈️',
          from: 'DEL (New Delhi)',
          to: 'KUU (Kullu Bhuntar)',
          deptTime: '06:45 AM',
          arrTime: '08:05 AM',
          duration: '1h 20m',
          type: 'Non-stop ATR',
          badge: 'Fastest & Scenic Flyover',
          badgeType: 'fastest',
          reason: 'Bypasses the 12-hour winding highway drive; provides dramatic bird’s-eye views of snow peaks.',
          platformOptions: [
            { platform: 'MakeMyTrip', price: 6850, isLowest: true, badge: 'Cheapest Rate', url: 'https://www.makemytrip.com' },
            { platform: 'EaseMyTrip', price: 6900, isLowest: false, badge: 'Zero Conv Fee', url: 'https://www.easemytrip.com' },
            { platform: 'Alliance Air Direct', price: 7150, isLowest: false, badge: 'Official', url: 'https://www.airindia.com' }
          ]
        },
        {
          id: 'mnl-fl-2',
          airline: 'IndiGo (Via Chandigarh)',
          flightNumber: '6E-2051',
          logo: '✈️',
          from: 'DEL (New Delhi)',
          to: 'IXC (Chandigarh) + Expressway Cab',
          deptTime: '07:30 AM',
          arrTime: '08:35 AM',
          duration: '1h 05m air + 5h cab',
          type: 'Air + Expressway Transit',
          badge: 'Cheapest Hybrid Route',
          badgeType: 'cheapest',
          reason: 'Fly to Chandigarh and board an expressway cab; saves ₹3,100 per traveler.',
          platformOptions: [
            { platform: 'EaseMyTrip', price: 3750, isLowest: true, badge: 'Lowest Total', url: 'https://www.easemytrip.com' },
            { platform: 'MakeMyTrip', price: 3800, isLowest: false, badge: 'Instant Confirm', url: 'https://www.makemytrip.com' },
            { platform: 'IndiGo Official', price: 3880, isLowest: false, badge: 'Direct Air', url: 'https://www.goindigo.in' }
          ]
        }
      ],
      trains: [
        {
          id: 'mnl-tr-1',
          trainNumber: '12011',
          name: 'Kalka Shatabdi Express',
          from: 'New Delhi (NDLS)',
          to: 'Chandigarh (CDG)',
          deptTime: '07:40 AM',
          arrTime: '11:05 AM',
          duration: '3h 25m',
          classes: [
            { code: 'CC', name: 'AC Chair Car', price: 950, availability: 'AVAILABLE - 82' },
            { code: 'EC', name: 'Executive Class', price: 1780, availability: 'AVAILABLE - 14' }
          ],
          badge: 'Fastest Rail Link',
          badgeType: 'fastest',
          reason: 'Superfast rail to Chandigarh gateway, connecting with the 4-lane Kiratpur-Manali highway.',
          platformOptions: [
            { platform: 'IRCTC Official', price: 950, isLowest: true, badge: 'Zero Extra Fee', url: 'https://www.irctc.co.in' },
            { platform: 'ConfirmTkt', price: 975, isLowest: false, badge: 'Live PNR', url: 'https://www.confirmtkt.com' },
            { platform: 'MakeMyTrip', price: 980, isLowest: false, badge: 'Standard', url: 'https://www.makemytrip.com' }
          ]
        }
      ]
    },
    stays: [
      {
        id: 'mnl-st-1',
        name: 'The Himalayan Castle & Luxury Cottages',
        tier: 'luxury',
        type: 'Victorian Gothic Stone Castle',
        rating: 4.9,
        reviewsCount: 420,
        location: 'Hadimba Road, Manali',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
        amenities: ['Heated Outdoor Swimming Pool', 'Working Fireplaces', 'Apple Orchard Walk', 'Fine Dining Bar', 'Mountain View'],
        badge: 'Iconic Castle Stay',
        platformOptions: [
          { platform: 'Booking.com', pricePerNight: 14500, isLowest: true, badge: 'Free Breakfast', url: 'https://www.booking.com' },
          { platform: 'Agoda', pricePerNight: 14700, isLowest: false, badge: 'Instant Deal', url: 'https://www.agoda.com' },
          { platform: 'MakeMyTrip', pricePerNight: 14800, isLowest: false, badge: 'Verified', url: 'https://www.makemytrip.com' }
        ]
      },
      {
        id: 'mnl-st-2',
        name: 'Apple Country Resorts & Mountain Spa',
        tier: 'comfort',
        type: 'Mountain Chalet Resort',
        rating: 4.75,
        reviewsCount: 710,
        location: 'Log Huts Area, Old Manali',
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80',
        amenities: ['Private Balconies', 'Steam Sauna & Spa', 'Mountain Facing Rooms', 'Buffet Breakfast', 'Indoor Games'],
        badge: 'Best Family Comfort',
        platformOptions: [
          { platform: 'Goibibo', pricePerNight: 5050, isLowest: true, badge: 'Best Discount', url: 'https://www.goibibo.com' },
          { platform: 'MakeMyTrip', pricePerNight: 5200, isLowest: false, badge: 'Free Cancellation', url: 'https://www.makemytrip.com' },
          { platform: 'Booking.com', pricePerNight: 5350, isLowest: false, badge: 'Standard', url: 'https://www.booking.com' }
        ]
      }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur & Udaipur',
    state: 'Rajasthan, India',
    tagline: 'Gilded palace courtyards, majestic hill forts & royal Rajput hospitality',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80',
    bestSeason: 'Oct – March',
    avgTemp: '24°C',
    defaultDays: 4,
    recommendedBudget: 28000,
    budgetTiers: {
      backpacker: {
        dailyPerPerson: 1900,
        label: 'Backpacker & Explorer',
        description: 'Authentic haveli homestays, cycle rickshaws, heritage street stalls & composite monument pass.',
        stayType: 'Traditional Rajput Haveli Homestay',
        transportType: 'E-Rickshaw & Metro',
        diningType: 'Pyaaz Kachori & Rawat Sweets Thali',
        experiences: 'Amer Fort walk, Hawa Mahal photography, Johari Bazaar'
      },
      comfort: {
        dailyPerPerson: 5200,
        label: 'Heritage & Comfort',
        description: 'Converted palace heritage hotels, private chauffeur cab, sunset rooftop dining with Nahargarh views.',
        stayType: 'Heritage 4-Star Converted Haveli (Alsisar)',
        transportType: 'Private AC Sedan Cab',
        diningType: 'Rooftop Rajasthani Laal Maas & Royal Thalis',
        experiences: 'Private guided City Palace, Jal Mahal sunset boat, blue pottery workshop'
      },
      luxury: {
        dailyPerPerson: 16000,
        label: 'Royal Maharaja Luxury',
        description: 'Grand palace suites (Rambagh Palace / Taj Lake Palace), vintage car rides & private royal butler service.',
        stayType: '5-Star Heritage Palace (Taj Rambagh Palace)',
        transportType: 'Vintage Royal Chauffeur Car',
        diningType: 'Suvarna Mahal 24-Karat Gold Plate Fine Dining',
        experiences: 'Private royal quarters tour, hot air balloon ride over Amer Fort, bespoke royal polo match'
      }
    },
    itineraryDays: [
      {
        day: 1,
        title: 'The Pink City Walled Gates & Hawa Mahal',
        summary: 'Enter through Ajmeri Gate, admire the honeycomb windows of Hawa Mahal, and explore City Palace.',
        activities: [
          {
            id: 'jpr-d1-1',
            time: '08:30 AM – 10:00 AM',
            title: 'Hawa Mahal Sunrise View & Heritage Chai',
            category: 'attraction',
            cost: 200,
            location: 'Wind View Cafe Rooftop',
            notes: 'Capture morning sunlight piercing through the 953 honeycomb jharokhas with hot spiced tea.',
            buffer: '30 min relaxed camera setup'
          },
          {
            id: 'jpr-d1-2',
            time: '10:30 AM – 01:30 PM',
            title: 'Jaipur City Palace & Royal Museum Walk',
            category: 'attraction',
            cost: 700,
            location: 'City Palace Courtyard',
            notes: 'Admire the Peacock Gate, royal ceremonial attire gallery, and world-record silver water vessels.',
            buffer: '30 min courtyard fountain buffer'
          }
        ]
      }
    ],
    transits: {
      flights: [
        {
          id: 'jpr-fl-1',
          airline: 'IndiGo',
          flightNumber: '6E-7204',
          logo: '✈️',
          from: 'DEL (New Delhi)',
          to: 'JAI (Jaipur)',
          deptTime: '06:00 AM',
          arrTime: '06:55 AM',
          duration: '55m',
          type: 'Non-stop',
          badge: 'Cheapest & Fastest Air',
          badgeType: 'cheapest',
          reason: 'Fly from capital under an hour for just ₹2,650; ideal for weekend gateway travelers.',
          platformOptions: [
            { platform: 'MakeMyTrip', price: 2650, isLowest: true, badge: 'Cheapest Deal', url: 'https://www.makemytrip.com' },
            { platform: 'EaseMyTrip', price: 2680, isLowest: false, badge: 'Zero Conv Fee', url: 'https://www.easemytrip.com' },
            { platform: 'IndiGo Official', price: 2750, isLowest: false, badge: 'Official', url: 'https://www.goindigo.in' }
          ]
        }
      ],
      trains: [
        {
          id: 'jpr-tr-1',
          trainNumber: '20977',
          name: 'Ajmer Vande Bharat Express',
          from: 'Delhi Cantt (DEC)',
          to: 'Jaipur Junction (JP)',
          deptTime: '06:10 AM',
          arrTime: '10:05 AM',
          duration: '3h 55m',
          classes: [
            { code: 'CC', name: 'Chair Car', price: 925, availability: 'AVAILABLE - 94' },
            { code: 'EC', name: 'Executive Class', price: 1735, availability: 'AVAILABLE - 22' }
          ],
          badge: 'Fastest Rail Option',
          badgeType: 'fastest',
          reason: 'Smooth modern train reaching heart of Jaipur in under 4 hours with fresh breakfast served on board.',
          platformOptions: [
            { platform: 'IRCTC Official', price: 925, isLowest: true, badge: 'Zero Extra Markup', url: 'https://www.irctc.co.in' },
            { platform: 'ConfirmTkt', price: 950, isLowest: false, badge: 'Waitlist Predictor', url: 'https://www.confirmtkt.com' },
            { platform: 'MakeMyTrip', price: 955, isLowest: false, badge: 'Standard', url: 'https://www.makemytrip.com' }
          ]
        }
      ]
    },
    stays: [
      {
        id: 'jpr-st-1',
        name: 'Taj Rambagh Palace — The Jewel of Jaipur',
        tier: 'luxury',
        type: 'Authentic Royal Maharaja Palace',
        rating: 4.95,
        reviewsCount: 680,
        location: 'Bhawani Singh Road, Jaipur',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
        amenities: ['Private Royal Peacock Gardens', 'Jiva Grande Luxury Spa', 'Polo Bar', 'Indoor Marble Pool', 'Butler Service'],
        badge: 'World #1 Luxury Hotel',
        platformOptions: [
          { platform: 'Booking.com', pricePerNight: 28200, isLowest: true, badge: 'Member Rate', url: 'https://www.booking.com' },
          { platform: 'Agoda', pricePerNight: 28400, isLowest: false, badge: 'Special Offer', url: 'https://www.agoda.com' },
          { platform: 'Taj Official', pricePerNight: 28500, isLowest: false, badge: 'Direct Butler Perks', url: 'https://www.tajhotels.com' }
        ]
      }
    ]
  },
  {
    id: 'kerala',
    name: 'Kerala Backwaters & Munnar',
    state: 'Kerala, India',
    tagline: 'Emerald carpeted tea plantations, tranquil lagoons & Ayurvedic bliss',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    bestSeason: 'Sep – March',
    avgTemp: '23°C',
    defaultDays: 4,
    recommendedBudget: 29000,
    budgetTiers: {
      backpacker: {
        dailyPerPerson: 2100,
        label: 'Backpacker & Nature',
        description: 'Village homestays on canals, state ferry rides (₹20), organic spice garden visits and tea factory tours.',
        stayType: 'Canalside Family Homestay',
        transportType: 'Public Waterways Ferry & Local Bus',
        diningType: 'Appam with Stew & Karimeen Fry at Village Shacks',
        experiences: 'Canoe canal glide, Munnar tea plantation trek, Kathakali show'
      },
      comfort: {
        dailyPerPerson: 5900,
        label: 'Explorer & Comfort',
        description: 'Heritage plantation bungalows, private AC car with driver, private day cruise on Alleppey backwaters.',
        stayType: 'Plantation Bungalow & Deluxe Houseboat',
        transportType: 'Private AC Chauffeur Sedan',
        diningType: 'Authentic Sadhya Feast on Banana Leaf & Seafood Curries',
        experiences: 'Private Kettuvallam houseboat cruise, Periyar spice walk, Ayurvedic massage'
      },
      luxury: {
        dailyPerPerson: 15500,
        label: 'Ayurvedic Luxury & Private Villa',
        description: '5-star lakefront sanctuaries (Kumarakom Lake Resort), private pool villas & private luxury houseboat.',
        stayType: '5-Star Lakefront Resort (Kumarakom Lake Resort)',
        transportType: 'Private Luxury SUV / Speedboat',
        diningType: 'Chef-curated Malabar Seafood Tasting Menu & Champagne Breakfast',
        experiences: 'Full overnight private air-conditioned luxury houseboat, bespoke Panchakarma spa'
      }
    },
    itineraryDays: [
      {
        day: 1,
        title: 'Cochin Arrival & Drive into Munnar Mist',
        summary: 'Land in Kochi, drive through Cheeyappara waterfalls, and arrive in rolling tea estates.',
        activities: [
          {
            id: 'ker-d1-1',
            time: '09:00 AM – 12:30 PM',
            title: 'Kochi Airport to Munnar Scenic Hill Drive',
            category: 'transit',
            cost: 2200,
            location: 'Kochi to Munnar (130 km)',
            notes: 'Passing rubber plantations, Valara & Cheeyappara roadside waterfalls.',
            buffer: '25 min waterfall photo buffer'
          }
        ]
      }
    ],
    transits: {
      flights: [
        {
          id: 'ker-fl-1',
          airline: 'Air India Express',
          flightNumber: 'IX-482',
          logo: '✈️',
          from: 'BLR (Bengaluru)',
          to: 'COK (Kochi)',
          deptTime: '07:15 AM',
          arrTime: '08:20 AM',
          duration: '1h 05m',
          type: 'Non-stop',
          badge: 'Cheapest Non-stop',
          badgeType: 'cheapest',
          reason: 'Fast 65-min hop into Kochi at under ₹3,000.',
          platformOptions: [
            { platform: 'MakeMyTrip', price: 2850, isLowest: true, badge: 'Cheapest', url: 'https://www.makemytrip.com' },
            { platform: 'EaseMyTrip', price: 2890, isLowest: false, badge: 'Zero Conv Fee', url: 'https://www.easemytrip.com' },
            { platform: 'Air India Express', price: 2950, isLowest: false, badge: 'Direct', url: 'https://www.airindiaexpress.com' }
          ]
        }
      ],
      trains: [
        {
          id: 'ker-tr-1',
          trainNumber: '20631',
          name: 'Kasargod – Thiruvananthapuram Vande Bharat',
          from: 'Kozhikode (CLT)',
          to: 'Ernakulam (ERS)',
          deptTime: '08:40 AM',
          arrTime: '11:45 AM',
          duration: '3h 05m',
          classes: [
            { code: 'CC', name: 'Chair Car', price: 780, availability: 'AVAILABLE - 68' }
          ],
          badge: 'Fastest Coastal Rail',
          badgeType: 'fastest',
          reason: 'Fastest train linking Kerala coastline with modern plush reclining seats.',
          platformOptions: [
            { platform: 'IRCTC Official', price: 780, isLowest: true, badge: 'Official', url: 'https://www.irctc.co.in' },
            { platform: 'ConfirmTkt', price: 805, isLowest: false, badge: 'Live Charting', url: 'https://www.confirmtkt.com' }
          ]
        }
      ]
    },
    stays: [
      {
        id: 'ker-st-1',
        name: 'Kumarakom Lake Resort — Backwater Oasis',
        tier: 'luxury',
        type: '5-Star Heritage Sanctuary',
        rating: 4.92,
        reviewsCount: 1120,
        location: 'Kumarakom, Vembanad Lake',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
        amenities: ['Meandering Pool Villas', 'Ayurmana Heritage Spa', 'Lakeside Seafood Bar', 'Traditional Cultural Evenings', 'Houseboat Fleet'],
        badge: 'Premier Heritage Luxury',
        platformOptions: [
          { platform: 'Agoda', pricePerNight: 21800, isLowest: true, badge: 'Best Rate', url: 'https://www.agoda.com' },
          { platform: 'Booking.com', pricePerNight: 22000, isLowest: false, badge: 'Free Cancellation', url: 'https://www.booking.com' },
          { platform: 'MakeMyTrip', pricePerNight: 22400, isLowest: false, badge: 'Verified', url: 'https://www.makemytrip.com' }
        ]
      }
    ]
  }
];

export const SOURCE_CITIES = [
  'Mumbai (BOM)',
  'New Delhi (DEL)',
  'Bengaluru (BLR)',
  'Hyderabad (HYD)',
  'Chennai (MAA)',
  'Kolkata (CCU)',
  'Ahmedabad (AMD)',
  'Pune (PNQ)',
  'Jaipur (JAI)'
];
