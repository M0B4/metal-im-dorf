import type { SanityImage } from "./sanity";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const projectId = import.meta.env.PUBLIC_SANITY_STUDIO_PROJECT_ID || "hrgrzj9i";

export interface SiteSettings {
  siteName: string;
  accentColor: string;
  accentTextColor: string;
  logo?: SanityImage;
  defaultSeo: {
    title: string;
    description: string;
    image?: SanityImage;
  };
  hero: {
    image?: SanityImage;
    kicker: string;
    title: string;
    intro: string;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
    showPrimaryButton: boolean;
    showSecondaryButton: boolean;
    showAnnouncement: boolean;
    announcementLabel: string;
    emptyAnnouncementTitle: string;
    emptyAnnouncementText: string;
  };
  sections: {
    news: {
      kicker: string;
      title: string;
      emptyText: string;
      expandLabel: string;
      collapseLabel: string;
      previousLabel: string;
      nextLabel: string;
      pageLabel: string;
    };
    lineup: {
      kicker: string;
      title: string;
      intro: string;
      emptyText: string;
      placeholderGenre: string;
      placeholderName: string;
      defaultGenre: string;
      unknownTime: string;
    };
    history: {
      kicker: string;
      title: string;
      intro: string;
      emptyText: string;
      allFilterLabel: string;
      mainFilterLabel: string;
      sideFilterLabel: string;
      filterEmptyText: string;
    };
  };
  navigation: {
    newsLabel: string;
    lineupLabel: string;
    historyLabel: string;
    legalLabel: string;
  };
  footer: {
    description: string;
    navigationTitle: string;
    contactTitle: string;
    socialTitle: string;
    copyright?: string;
  };
  contact: {
    email: string;
    address: string[];
    instagramUrl: string;
    facebookUrl: string;
    showInstagram: boolean;
    showFacebook: boolean;
  };
}

export function sitePath(path = "") {
  if (!path) return basePath || "/";
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteConfig = {
  name: "Metal im Dorf",
  email: "metalimdorf@gmx.de",
  address: ["Opfermoor Niederdorla", "An der Oberrothe, 99988 Niederdorla"],
  facebookUrl: import.meta.env.PUBLIC_FACEBOOK_URL || "https://www.facebook.com/metalimdorf",
  instagramUrl: import.meta.env.PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/metalimdorf",
  studioUrl:
    import.meta.env.PUBLIC_SANITY_STUDIO_URL ||
    `https://www.sanity.io/manage/project/${projectId}`,
};

export const defaultSiteSettings: SiteSettings = {
  siteName: siteConfig.name,
  accentColor: "#00A8BB",
  accentTextColor: "#050505",
  defaultSeo: {
    title: siteConfig.name,
    description: "News und aktuelle Infos vom Metal im Dorf Festival.",
  },
  hero: {
    kicker: "Small festival, heavy sound",
    title: siteConfig.name,
    intro:
      "Das kleine Metal-Festival am Opfermoor Niederdorla: direkt, laut und ohne Umwege. Hier findest du aktuelle Ansagen, Bands und Rückblicke.",
    primaryButtonLabel: "News lesen",
    secondaryButtonLabel: "Line-Up ansehen",
    showPrimaryButton: true,
    showSecondaryButton: true,
    showAnnouncement: true,
    announcementLabel: "Aktuelle Meldung",
    emptyAnnouncementTitle: "News folgen bald",
    emptyAnnouncementText: "Bleib dran",
  },
  sections: {
    news: {
      kicker: "News",
      title: "Aktuelles vom Festival",
      emptyText: "Keine News verfügbar.",
      expandLabel: "Mehr anzeigen",
      collapseLabel: "Weniger anzeigen",
      previousLabel: "Zurück",
      nextLabel: "Weiter",
      pageLabel: "Seite",
    },
    lineup: {
      kicker: "Live & laut",
      title: "Line-Up",
      intro: "Die Bands für das nächste Metal im Dorf.",
      emptyText: "Das Line-Up wird bald bekanntgegeben.",
      placeholderGenre: "Ankündigung folgt",
      placeholderName: "Wird noch bekannt gegeben",
      defaultGenre: "Metal",
      unknownTime: "TBA",
    },
    history: {
      kicker: "Archiv",
      title: "Historie",
      intro: "Poster, Rückblicke und Impressionen vergangener Festivals und Nebenveranstaltungen.",
      emptyText: "Keine Einträge in der Historie verfügbar.",
      allFilterLabel: "Alle",
      mainFilterLabel: "Hauptfestival",
      sideFilterLabel: "Nebenveranstaltungen",
      filterEmptyText: "In dieser Kategorie gibt es noch keine Einträge.",
    },
  },
  navigation: {
    newsLabel: "News",
    lineupLabel: "Line-Up",
    historyLabel: "Historie",
    legalLabel: "Impressum",
  },
  footer: {
    description:
      "Ein kleines, lautes Festival im Dorf: harte Riffs, kurze Wege und eine Community, die vor der Bühne zuhause ist.",
    navigationTitle: "Navigation",
    contactTitle: "Kontakt",
    socialTitle: "Folge uns",
  },
  contact: {
    email: siteConfig.email,
    address: siteConfig.address,
    instagramUrl: siteConfig.instagramUrl,
    facebookUrl: siteConfig.facebookUrl,
    showInstagram: true,
    showFacebook: true,
  },
};
