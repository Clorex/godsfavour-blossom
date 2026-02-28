import type { AboutContent, HomeContent, ServicesContent, SiteSettings } from "@/types/site";

export const defaultSettings: SiteSettings = {
  publicEmail: "itabitamiracle090@gmail.com",
  whatsapp: "07050966619",
  call: "07061761111",
  callAlt: "08127120909",
  headOfficeAddress: "Onumane-Egbo, Egbo-kokori, Kokori Inland, EELGA, Delta State.",
  branchOfficeAddress: "God’s Favour Office, OH Western Delta University Qtrs, Ogharefe, EWLGA, Delta State.",
};

export const defaultHome: HomeContent = {
  heroBadge: "A NEW DAWN",
  heroTitle: "Godsfavour Blossom",
  heroSubtitle: "Savings • Friendly Loan • Overdraft",
  steps: ["Save little", "Borrow (If needed)", "Pay later"],
  trustBadge: "TRUSTED • REGISTERED",
  trustTitle: "Your money is safe with us",
  trustBody:
    "We are registered. Your money is safe with us. When you need support, we can assist you with loan or overdraft based on your savings.",
};

export const defaultAbout: AboutContent = {
  title: "About Us",
  body:
    "Godsfavour Blossom is a cooperative society built to support people through savings, friendly loan, overdraft and cooperative services.\n\nEstablished: September 2012.\n\nOur goal is simple: your money is safe with us, and we support you when you need it.",
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
  subtitle: "Savings, friendly loan, overdraft, osusu packages, and save & buy.",
  items: [
    {
      slug: "savings",
      title: "Savings",
      summary: "Daily savings is our core. Weekly and monthly savings are also available.",
      body:
        "Savings is the foundation of what we do.\n\nDaily savings (our core):\n• You save small small every day as you work.\n• We record it for you as you save.\n\nWeekly savings:\n• You can choose weekly savings.\n\nMonthly savings:\n• You can choose monthly savings based on what you agree with us.",
      showApplyButton: true,
    },
    {
      slug: "loan",
      title: "Friendly Loan",
      summary: "Loan support based on your savings history with us.",
      body:
        "Loan is available after you’ve been saving with us for at least 3 months.\n\nInterest: 7.5% monthly.\nComputer number is required.\nCollateral: 2× to 3× the value of the loan.\n\nCharges:\n• 5% insurance\n• 2% bank charges\n• 1% administrative charges\n• 0.6% office charges\nTotal: 8.6%.\n\nAfter you apply, we will contact you and explain your breakdown clearly.",
      showApplyButton: true,
    },
    {
      slug: "overdraft",
      title: "Overdraft",
      summary: "Short-term support based on your savings pattern.",
      body:
        "Overdraft is available after you’ve been saving with us for at least 2 months.\n\nRepayment: you pay 33 numbers instead of 31 (we collect only 2 extra numbers).\nExample: if you pay ₦500 daily, you will pay ₦16,500 instead of ₦15,500.\n\nCharges:\n• 5% insurance\n• 2% bank charges\n• 1% administrative charges\n• 0.6% office charges\nTotal: 8.6%.\n\nAfter you apply, we will contact you and explain everything clearly.",
      showApplyButton: true,
    },
    {
      slug: "osusu",
      title: "Osusu Packages",
      summary: "Choose a package and payment mode.",
      body:
        "If you are new with us, we can place you from number five downward in a 10-person group (e.g. 5, 6, 7, 9, 10).\n\nYou don’t have to pay everything once — you save small small from your daily savings as you work.\n\nPackages and rules will be shown on this page, and other rules will be explained after you apply.",
      showApplyButton: true,
    },
    {
      slug: "sales",
      title: "Sales of Goods & Services (Save & Buy)",
      summary: "Save with us towards an item and we purchase it for you.",
      body:
        "This means you can save with us towards an item and we will purchase it for you.\n\nExample: you can save and buy AC, car, or any item you want — once the saving plan is completed.",
      showApplyButton: true,
    },
  ],
};






