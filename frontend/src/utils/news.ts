import type { PortableTextBlock } from "@portabletext/types";
import type { News, SanityImage } from "./sanity";

export const NEWS_PAGE_SIZE = 12;

export function getTextBlocks(content?: PortableTextBlock[]) {
  return content?.filter((block) => block._type === "block") ?? [];
}

export function portableTextToPlainText(content?: PortableTextBlock[]) {
  return getTextBlocks(content)
    .flatMap((block) => block.children ?? [])
    .map((child) => ("text" in child ? child.text : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getNewsImages(item: News): SanityImage[] {
  const inlineImages = (item.inhalt?.filter((block) => block._type === "image") ?? []) as unknown as SanityImage[];

  return [
    ...(item.bild ? [item.bild] : []),
    ...(item.bilder ?? []),
    ...inlineImages,
  ];
}
