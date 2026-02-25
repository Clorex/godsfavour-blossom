import type { AboutContent, HomeContent, ServicesContent, SiteSettings } from "@/types/site";

export const defaultSettings: SiteSettings = {
  publicEmail: "itabitamiracle090@gmail.com",
  whatsapp: "+2347050966616",
  call: "07061761111",
  headOfficeAddress: "Onumane-Egbo, Egbo-kokori, Kokori Inland, EELGA, Delta State.",
  branchOfficeAddress: "God’s Favour Office, OH Western Delta University Qtrs, Ogharefe, EWLGA, Delta State.",
};

export const defaultHome: HomeContent = {
  heroBadge: "A NEW DAWN IN OGHARA",
  heroTitle: "Godsfavour Blossom",
  heroSubtitle: "Savings • Friendly Loan • Overdraft",
  steps: ["Save little", "Borrow (If needed)", "Pay later"],
  trustBadge: "TRUSTED • REGISTERED",
  trustTitle: "Your money is safe with us",
  trustBody:
    "We are registered. Your money is safe with us, and when you need support, we can assist you with loan or overdraft based on your savings.",
};

export const defaultAbout: AboutContent = {
  title: "About Us",
  body:
    "Godsfavour Blossom is a cooperative society built to support people through savings, friendly loan, overdraft and cooperative services.\n\nOur goal is simple: your money is safe with us, and we support you when you need it.\n\nEstablished: September 2012.",
  trustTitle: "Registered & Trusted",
  trustBody:
    "We are registered, and we run our cooperative with trust and responsibility.",
  adminImageUrl: "/admin.jpg",
  cacImageUrl: "/cac.jpg",
  bePartTitle: "Be a part of us",
  bePartBody:
    "If you want to join as a member or shareholder, fill the form and submit. We will contact you with the next steps.",
};

export const defaultServices: ServicesContent = {
  title: "Services",
  subtitle: "Savings, friendly loan, overdraft, and other cooperative support.",
  items: [
    {
      slug: "savings",
      title: "Savings",
      summary: "Daily savings is our core. Weekly and monthly savings are also available.",
      body:
        "Savings is the foundation of what we do.\n\nDaily savings (our core):\n• You save small small every day as you work.\n• We record it for you as you save.\n\nWeekly savings:\n• You can also choose to save weekly if that is easier for you.\n\nMonthly savings:\n• You can save monthly based on what you agree with us.\n\nIf you want to withdraw, we follow the agreed plan with you.",
      showApplyButton: false,
    },
    {
      slug: "loan",
      title: "Friendly Loan",
      summary: "Loan support based on your savings history with us.",
      body:
        "Loan is available after you’ve been saving with us for at least 3 months. Interest is 5% monthly on the outstanding balance (as you pay, it reduces). After you apply, we will contact you and explain your breakdown clearly.",
      showApplyButton: true,
    },
    {
      slug: "overdraft",
      title: "Overdraft",
      summary: "Short-term support based on your savings pattern.",
      body:
        "Overdraft is available after you’ve been saving with us for at least 2 months. Your overdraft is based on your saving pattern with us. Repayment is simple and will be explained clearly after you apply.",
      showApplyButton: true,
    },
    {
      slug: "osusu",
      title: "Osusu / Asset Financing",
      summary: "Osusu and asset support based on cooperative rules.",
      body:
        "If you are new with us, we can place you from number 5 downward (e.g. number 5, 6, 7, 9 or 10) depending on the group.\n\nYou don’t have to pay everything at once — you will be saving small small from your daily savings as you work.\n\nPackages (examples):\n• ₦100,000 package: ₦350 daily for 10 months\n• ₦200,000 package: ₦750 daily for 10 months\n• ₦1,000,000 package: ₦3,500 daily for 10 months\n\n5-number plan (example):\n• ₦100,000 package: ₦750 daily for 5 months\n\nOther rules will be explained to you after you apply.",
      showApplyButton: false,
    },
    {
      slug: "sales",
      title: "Sales of Goods & Services",
      summary: "Save with us and we help you buy what you want.",
      body:
        "This means you can save with us towards an item and we will purchase it for you.\n\nExample: you can save and buy AC, car, or any item you want — once the saving plan is completed.",
      showApplyButton: false,
    },
  ],
};
