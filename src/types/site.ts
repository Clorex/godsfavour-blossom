export type SiteSettings = {
  publicEmail: string;
  whatsapp: string;
  call: string;
  callAlt?: string;
  headOfficeAddress: string;
  branchOfficeAddress: string;
  updatedAt?: number;
};

export type HomeContent = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  steps: string[];
  trustBadge: string;
  trustTitle: string;
  trustBody: string;
  updatedAt?: number;
};

export type AboutContent = {
  title: string;
  body: string;
  trustTitle: string;
  trustBody: string;
  adminImageUrl: string;
  cacImageUrl: string;
  bePartTitle: string;
  bePartBody: string;
  updatedAt?: number;
};

export type ServiceItem = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  showApplyButton?: boolean;
};

export type ServicesContent = {
  title: string;
  subtitle: string;
  items: ServiceItem[];
  updatedAt?: number;
};

export type SiteSectionKey = "home" | "about" | "services";
