const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const projectId = import.meta.env.PUBLIC_SANITY_STUDIO_PROJECT_ID || "hrgrzj9i";

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
