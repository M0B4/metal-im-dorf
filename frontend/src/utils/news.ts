import type { PortableTextBlock } from "@portabletext/types";
import type { News } from "./sanity";

/** So viele News sind anfangs sichtbar; "Weitere News" blendet jeweils so viele weitere ein. */
export const NEWS_BATCH_SIZE = 8;

export function plainText(content?: PortableTextBlock[]) {
  return (content ?? [])
    .filter((block) => block._type === "block")
    .flatMap((block) => block.children ?? [])
    .map((child) => ("text" in child ? child.text : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function newsAnchor(item: Pick<News, "_id">) {
  return `news-${item._id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}
