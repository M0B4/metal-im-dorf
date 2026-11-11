import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "sanity:client";

const builder = createImageUrlBuilder(sanityClient);

/** Bild-URL ohne Zuschnitt aus dem Studio (Plakate und News-Bilder immer vollständig zeigen). */
export function imageUrl(source: SanityImageSource, width: number, quality = 84) {
  return builder.image(source).ignoreImageParams().width(width).auto("format").quality(quality).url();
}

/** Bild-URL mit dem im Studio gesetzten Ausschnitt (Bandfotos). */
export function croppedImageUrl(source: SanityImageSource, width: number, quality = 82) {
  return builder.image(source).width(width).auto("format").quality(quality).url();
}

export function srcSet(source: SanityImageSource, widths: number[], cropped = false, quality?: number) {
  return widths.map((w) => `${(cropped ? croppedImageUrl : imageUrl)(source, w, quality)} ${w}w`).join(", ");
}
