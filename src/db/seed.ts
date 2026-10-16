import "dotenv/config";
import { db } from "./index";
import {
  cartItems,
  carts,
  newsletterSubs,
  orderItems,
  orders,
  products,
} from "./schema";

const px = (id: number, w = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const KIDS_SIZES = ["8C", "9C", "10C", "11C", "12C", "13C", "1Y", "2Y", "3Y"];

const catalogue = [
  // ------------------------------------------------------------------ SCHOOLBAGS
  {
    slug: "atlas-explorer-backpack",
    name: "Atlas Explorer Backpack",
    category: "schoolbags",
    tagline: "The everyday hero for big school days",
    description:
      "A roomy 16L backpack built for spelling tests, field trips and everything in between. Padded, contoured straps keep little shoulders happy while the water-repellent shell laughs off drizzle and juice-box incidents.",
    details:
      "16L capacity with padded 10\" tablet sleeve\nRecycled 600D polyester, water-repellent finish\nErgonomic S-curve straps + chest clip\nReflective safety piping, BPA-free zips",
    priceCents: 4800,
    compareAtCents: null,
    image: px(4910563),
    gallery: [px(4910563), px(28503348), px(8466004)],
    colors: [
      { name: "Terracotta", hex: "#C4552A" },
      { name: "Blush", hex: "#E2A3A1" },
      { name: "Ink", hex: "#211A13" },
    ],
    sizes: null,
    badge: "bestseller",
    rating: 4.8,
    reviewsCount: 126,
    stock: 34,
    featured: true,
  },
  {
    slug: "dino-roar-rucksack",
    name: "Dino Roar Rucksack",
    category: "schoolbags",
    tagline: "Prehistoric style, modern comfort",
    description:
      "The rucksack that makes Monday mornings feel like expeditions. A playful dino silhouette hides serious organisation — two bottle pockets, a name label and a wipe-clean lining for snack-time archaeology.",
    details:
      "11L capacity, fits A4 folders flat\nWipe-clean insulated front pocket\nSide mesh bottle holders\nMachine washable on gentle",
    priceCents: 4200,
    compareAtCents: null,
    image: px(12960435),
    gallery: [px(12960435), px(4910563), px(6182559)],
    colors: [
      { name: "Fern", hex: "#8CA378" },
      { name: "Dusk Blue", hex: "#6F97BF" },
    ],
    sizes: null,
    badge: "new",
    rating: 4.7,
    reviewsCount: 89,
    stock: 52,
    featured: true,
  },
  {
    slug: "sunbeam-daypack",
    name: "Sunbeam Daypack",
    category: "schoolbags",
    tagline: "A little sunshine for the school run",
    description:
      "Featherweight but mighty, the Sunbeam carries lunch, library books and treasures found on the walk home. Rounded profile fits lockers and cubbies perfectly.",
    details:
      "9L capacity, weighs just 320g\nCordura® style ripstop shell\nName patch + key leash inside\nVentilated back panel",
    priceCents: 3900,
    compareAtCents: null,
    image: px(13198542),
    gallery: [px(13198542), px(8423937), px(8617519)],
    colors: [
      { name: "Sunshine", hex: "#F2B33C" },
      { name: "Sky", hex: "#6F97BF" },
      { name: "Coral", hex: "#E2785C" },
    ],
    sizes: null,
    badge: null,
    rating: 4.6,
    reviewsCount: 64,
    stock: 41,
    featured: false,
  },
  {
    slug: "cranberry-scholar-satchel",
    name: "Cranberry Scholar Satchel",
    category: "schoolbags",
    tagline: "Old-school charm, new-school grit",
    description:
      "A modern take on the classic satchel with magnetic buckles that small hands can open one-handed. Structured body protects picture books and packed lunches alike.",
    details:
      "12L structured body, sits upright\nMagnetic quick-open buckles\nVegan leather trims, cotton canvas shell\nInterior organiser + art-roll loop",
    priceCents: 4400,
    compareAtCents: 5400,
    image: px(6182559),
    gallery: [px(6182559), px(4910563), px(12960435)],
    colors: [
      { name: "Cranberry", hex: "#A63B44" },
      { name: "Oat", hex: "#EFE6D6" },
    ],
    sizes: null,
    badge: "sale",
    rating: 4.5,
    reviewsCount: 41,
    stock: 18,
    featured: false,
  },
  {
    slug: "blue-trail-junior-pack",
    name: "Blue Trail Junior Pack",
    category: "schoolbags",
    tagline: "From classroom door to forest floor",
    description:
      "For kids who learn best outdoors. Trail-ready hardware, a stowable rain cover and trekking loops — tough enough for Saturday hikes, organised enough for Tuesday maths.",
    details:
      "18L capacity with base compression straps\nStowable rain cover included\nGear loops + D-ring attachments\nLifetime repair promise",
    priceCents: 5200,
    compareAtCents: null,
    image: px(7010129),
    gallery: [px(7010129), px(12960435), px(8423937)],
    colors: [
      { name: "Trail Blue", hex: "#4A78A0" },
      { name: "Stone", hex: "#B7AA97" },
    ],
    sizes: null,
    badge: null,
    rating: 4.9,
    reviewsCount: 73,
    stock: 27,
    featured: true,
  },

  // ------------------------------------------------------------------ HANDBAGS
  {
    slug: "sienna-city-tote",
    name: "Sienna City Tote",
    category: "handbags",
    tagline: "Carries the laptop, the snacks and the day",
    description:
      "Full-grain leather that softens beautifully with every commute. A padded 14\" laptop sleeve, hidden phone pocket and key leash mean no more fishing at the door — just grab, sling, go.",
    details:
      "Full-grain vegetable-tanned leather\nPadded 14\" laptop compartment\nCotton twill lining, magnetic top closure\nDetachable interior zip pouch",
    priceCents: 9500,
    compareAtCents: null,
    image: px(35270330),
    gallery: [px(35270330), px(14806252), px(26316185)],
    colors: [
      { name: "Caramel", hex: "#A96F3D" },
      { name: "Noir", hex: "#211A13" },
    ],
    sizes: null,
    badge: "bestseller",
    rating: 4.9,
    reviewsCount: 214,
    stock: 22,
    featured: true,
  },
  {
    slug: "marlow-noire-satchel",
    name: "Marlow Noire Satchel",
    category: "handbags",
    tagline: "Boardroom polish with a rebel streak",
    description:
      "Sharp lines, a structured frame and a flash of crimson at the edge. The Marlow moves from pitch meeting to late dinner without missing a beat, worn by the top handle or crossbody strap.",
    details:
      "Pebbled calfskin, hand-painted edges\nConvertible top handle + crossbody strap\nSuede-touch microfibre lining\nProtective brass feet",
    priceCents: 12000,
    compareAtCents: null,
    image: px(7953286),
    gallery: [px(7953286), px(18601568), px(18601494)],
    colors: [
      { name: "Noir", hex: "#211A13" },
      { name: "Crimson", hex: "#8F2F3B" },
    ],
    sizes: null,
    badge: null,
    rating: 4.8,
    reviewsCount: 97,
    stock: 15,
    featured: false,
  },
  {
    slug: "azure-bloom-shoulder-bag",
    name: "Azure Bloom Shoulder Bag",
    category: "handbags",
    tagline: "A pop of blue for neutral wardrobes",
    description:
      "That one bag that makes a jeans-and-tee morning feel styled. Cloud-soft leather in a saturated azure, with a curved shoulder strap that actually stays put.",
    details:
      "Buttery nappa leather, satin lining\nSculpted shoulder strap, drop 26cm\nInterior zip + slip pockets\nDust bag included",
    priceCents: 8800,
    compareAtCents: null,
    image: px(20380724),
    gallery: [px(20380724), px(14806252), px(4964995)],
    colors: [
      { name: "Azure", hex: "#6F97BF" },
      { name: "Ecru", hex: "#EFE6D6" },
    ],
    sizes: null,
    badge: "new",
    rating: 4.7,
    reviewsCount: 58,
    stock: 30,
    featured: false,
  },
  {
    slug: "harvest-woven-carryall",
    name: "Harvest Woven Carryall",
    category: "handbags",
    tagline: "Market runs to gallery afternoons",
    description:
      "Hand-woven panels with leather handles that shoulder the week beautifully. Roomy enough for a baguette, a novel and impulse farmers-market flowers.",
    details:
      "Hand-woven cotton & jute body\nVeg-tan leather handles, drop 24cm\nUnlined airy interior with zip pocket\nReinforced base panel",
    priceCents: 11200,
    compareAtCents: null,
    image: px(5706278),
    gallery: [px(5706278), px(9218538), px(32229076)],
    colors: [
      { name: "Tan", hex: "#C49A6C" },
      { name: "Cream", hex: "#F3EDE3" },
    ],
    sizes: null,
    badge: null,
    rating: 4.6,
    reviewsCount: 71,
    stock: 12,
    featured: false,
  },
  {
    slug: "atelier-blazer-hobo",
    name: "Atelier Blazer Hobo",
    category: "handbags",
    tagline: "Studio slouch, tailored attitude",
    description:
      "A softly structured hobo that folds under the arm like your favourite blazer. Ivory and noir panels meet at hand-finished seams — understated, but never unnoticed.",
    details:
      "Two-tone smooth leather\nWide flat strap, drop 22cm\nSnap gussets expand the body\nInterior laptop sleeve fits 13\"",
    priceCents: 10400,
    compareAtCents: 12800,
    image: px(18601568),
    gallery: [px(18601568), px(29793778), px(18601494)],
    colors: [
      { name: "Ivory / Noir", hex: "#EFE6D6" },
      { name: "Noir", hex: "#211A13" },
    ],
    sizes: null,
    badge: "sale",
    rating: 4.7,
    reviewsCount: 83,
    stock: 25,
    featured: true,
  },

  // ------------------------------------------------------------------ SHOES
  {
    slug: "cranberry-first-sprint",
    name: "Cranberry First Sprint",
    category: "shoes",
    tagline: "For corridors, curb jumps and sprint finishes",
    description:
      "Fire-engine red and fast as they feel. A flexible natural-rubber sole bends with growing feet while the toe bumper survives scooter season — mostly.",
    details:
      "Natural rubber cupsole, zero-drop last\nAbrasion-resistant toe bumper\nElastic laces + single strap closure\nMachine washable",
    priceCents: 4200,
    compareAtCents: null,
    image: px(2375019),
    gallery: [px(2375019), px(5275375), px(5275371)],
    colors: [
      { name: "Cranberry", hex: "#B33A3A" },
      { name: "Cloud", hex: "#F3EDE3" },
    ],
    sizes: KIDS_SIZES,
    badge: "bestseller",
    rating: 4.9,
    reviewsCount: 188,
    stock: 46,
    featured: true,
  },
  {
    slug: "chestnut-peek-loafers",
    name: "Chestnut Peek Loafers",
    category: "shoes",
    tagline: "Sunday-best polish, playground comfort",
    description:
      "Supple brown leather loafers that slip on without a fuss. Padded collars and a soft-flex sole make them gentle on little feet from weddings to window shopping.",
    details:
      "Full-grain chestnut leather upper\nMemory-foam padded collar\nSlip-on with elastic side gusset\nNatural crepe flex sole",
    priceCents: 3900,
    compareAtCents: null,
    image: px(13822967),
    gallery: [px(13822967), px(13823041), px(31311618)],
    colors: [
      { name: "Chestnut", hex: "#8A5A36" },
      { name: "Espresso", hex: "#4A3325" },
    ],
    sizes: KIDS_SIZES,
    badge: null,
    rating: 4.7,
    reviewsCount: 92,
    stock: 38,
    featured: false,
  },
  {
    slug: "sky-snug-soft-walkers",
    name: "Sky Snug Soft Walkers",
    category: "shoes",
    tagline: "First steps deserve cloud-soft landings",
    description:
      "Podiatrist-approved soft walkers with butter-flex soles for wobbly first miles. Wide toe boxes let tiny toes splay naturally; grippy dots keep cruising confident.",
    details:
      "Barefoot-flex suede sole\nWide anatomical toe box\nAnti-slip grip dot pattern\nPull tab + elastic ankle for easy on",
    priceCents: 3600,
    compareAtCents: null,
    image: px(15844910),
    gallery: [px(15844910), px(15844906), px(31311618)],
    colors: [
      { name: "Sky Blue", hex: "#7FA6C9" },
      { name: "Butter", hex: "#F2B33C" },
    ],
    sizes: ["4C", "5C", "6C", "7C", "8C", "9C"],
    badge: "new",
    rating: 4.8,
    reviewsCount: 134,
    stock: 44,
    featured: true,
  },
  {
    slug: "court-star-mini-trainers",
    name: "Court Star Mini Trainers",
    category: "shoes",
    tagline: "Clean white kicks for court and classroom",
    description:
      "Crisp court-inspired trainers sized down for the smallest style icons. Scuff-guard coating keeps them box-fresh; the hidden sparkle lining is a happy surprise.",
    details:
      "Scuff-guard coated vegan leather\nCushioned EVA midsole\nRip-tape double strap closure\nSurprise sparkle sock-liner",
    priceCents: 4400,
    compareAtCents: null,
    image: px(5275386),
    gallery: [px(5275386), px(5275371), px(8466010)],
    colors: [
      { name: "Cloud White", hex: "#FFFDF8" },
      { name: "Pop Pink", hex: "#E2A3A1" },
    ],
    sizes: KIDS_SIZES,
    badge: null,
    rating: 4.6,
    reviewsCount: 77,
    stock: 31,
    featured: false,
  },
  {
    slug: "playground-dash-runners",
    name: "Playground Dash Runners",
    category: "shoes",
    tagline: "Built for 100 playground laps per day",
    description:
      "Engineered mesh keeps feet cool through double recess; the reinforced heel counter survives scooter brakes. Reflective hits keep them visible at dusk pickup.",
    details:
      "Breathable engineered mesh upper\nReinforced heel + toe guard\nReflective safety accents\nZero-tie speed lace system",
    priceCents: 4100,
    compareAtCents: 4900,
    image: px(8457630),
    gallery: [px(8457630), px(8101683), px(5275375)],
    colors: [
      { name: "Navy", hex: "#2E4057" },
      { name: "Blaze", hex: "#D9592B" },
    ],
    sizes: KIDS_SIZES,
    badge: "sale",
    rating: 4.5,
    reviewsCount: 61,
    stock: 16,
    featured: false,
  },
];

type SeedOrder = {
  orderNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  phone?: string;
  status: string;
  daysAgo: number;
  items: { slug: string; qty: number; size?: string; color?: string }[];
};

const sampleOrders: SeedOrder[] = [
  {
    orderNumber: "TT-100001",
    email: "amelia.hart@example.com",
    firstName: "Amelia",
    lastName: "Hart",
    address: "14 Rowan Lane",
    city: "Portland",
    zip: "97205",
    country: "United States",
    phone: "+1 503 555 0114",
    status: "shipped",
    daysAgo: 9,
    items: [
      { slug: "atlas-explorer-backpack", qty: 1, color: "Terracotta" },
      { slug: "sky-snug-soft-walkers", qty: 2, size: "6C", color: "Sky Blue" },
    ],
  },
  {
    orderNumber: "TT-100002",
    email: "noah.bennett@example.com",
    firstName: "Noah",
    lastName: "Bennett",
    address: "88 Cedar Court",
    city: "Austin",
    zip: "78701",
    country: "United States",
    phone: "+1 512 555 0192",
    status: "fulfilled",
    daysAgo: 7,
    items: [{ slug: "sienna-city-tote", qty: 1, color: "Caramel" }],
  },
  {
    orderNumber: "TT-100003",
    email: "grace.okafor@example.com",
    firstName: "Grace",
    lastName: "Okafor",
    address: "5 Birchwood Rise",
    city: "Chicago",
    zip: "60611",
    country: "United States",
    status: "shipped",
    daysAgo: 4,
    items: [
      { slug: "dino-roar-rucksack", qty: 1, color: "Fern" },
      { slug: "court-star-mini-trainers", qty: 1, size: "11C", color: "Cloud White" },
    ],
  },
  {
    orderNumber: "TT-100004",
    email: "oliver.marsh@example.com",
    firstName: "Oliver",
    lastName: "Marsh",
    address: "220 Alder Street",
    city: "Seattle",
    zip: "98101",
    country: "United States",
    status: "confirmed",
    daysAgo: 2,
    items: [
      { slug: "playground-dash-runners", qty: 2, size: "1Y", color: "Blaze" },
      { slug: "harvest-woven-carryall", qty: 1, color: "Tan" },
    ],
  },
  {
    orderNumber: "TT-100005",
    email: "sofia.lindqvist@example.com",
    firstName: "Sofia",
    lastName: "Lindqvist",
    address: "9 Magnolia Walk",
    city: "Denver",
    zip: "80202",
    country: "United States",
    status: "confirmed",
    daysAgo: 1,
    items: [{ slug: "marlow-noire-satchel", qty: 1, color: "Noir" }],
  },
];

async function main() {
  console.log("Clearing existing data…");
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(cartItems);
  await db.delete(carts);
  await db.delete(newsletterSubs);
  await db.delete(products);

  console.log("Inserting products…");
  const inserted = await db.insert(products).values(catalogue).returning();
  console.log(`Inserted ${inserted.length} products`);

  const bySlug = new Map(inserted.map((p) => [p.slug, p]));

  console.log("Inserting sample orders…");
  for (const sample of sampleOrders) {
    const lines = sample.items.map((item) => {
      const product = bySlug.get(item.slug);
      if (!product) throw new Error(`Unknown slug ${item.slug}`);
      return {
        product,
        qty: item.qty,
        size: item.size ?? null,
        color: item.color ?? product.colors[0]?.name ?? null,
      };
    });
    const subtotal = lines.reduce((s, l) => s + l.product.priceCents * l.qty, 0);
    const shipping = subtotal >= 7500 ? 0 : 695;

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber: sample.orderNumber,
        email: sample.email,
        firstName: sample.firstName,
        lastName: sample.lastName,
        address: sample.address,
        city: sample.city,
        zip: sample.zip,
        country: sample.country,
        phone: sample.phone ?? null,
        subtotalCents: subtotal,
        shippingCents: shipping,
        totalCents: subtotal + shipping,
        status: sample.status,
        createdAt: new Date(Date.now() - sample.daysAgo * 86_400_000),
      })
      .returning();

    await db.insert(orderItems).values(
      lines.map((l) => ({
        orderId: order.id,
        productId: l.product.id,
        name: l.product.name,
        image: l.product.image,
        size: l.size,
        color: l.color,
        qty: l.qty,
        priceCents: l.product.priceCents,
      })),
    );
  }

  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
