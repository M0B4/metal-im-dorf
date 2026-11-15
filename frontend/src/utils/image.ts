import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "sanity:client";

const builder = createImageUrlBuilder(sanityClient);
// fit("max"): Bilder nie über ihre Originalgröße hinaus vergrößern (spart Daten bei kleinen Uploads).

/** Bild-URL ohne Zuschnitt aus dem Studio (Plakate und News-Bilder immer vollständig zeigen). */
export function imageUrl(source: SanityImageSource, width: number, quality = 84) {
  return builder.image(source).ignoreImageParams().width(width).fit("max").auto("format").quality(quality).url();
}

/** Bild-URL mit dem im Studio gesetzten Ausschnitt (Bandfotos). */
export function croppedImageUrl(source: SanityImageSource, width: number, quality = 82) {
  return builder.image(source).width(width).fit("max").auto("format").quality(quality).url();
}

/** Maße aller Vorschaubilder beim Teilen (auch public/og-image.jpg). */
export const SHARE_IMAGE = { width: 1200, height: 630 };

/** Vorschaubild beim Teilen (WhatsApp, Facebook …): JPEG, weil nicht jede App WebP/AVIF zeigt. */
export function shareImageUrl(source: SanityImageSource) {
  // Querformat 1200×630, das Plakat steht vollständig und mittig auf Schwarz statt abgeschnitten zu werden.
  return builder
    .image(source)
    .ignoreImageParams()
    .width(SHARE_IMAGE.width)
    .height(SHARE_IMAGE.height)
    .fit("fill")
    .bg("050505")
    .format("jpg")
    .quality(82)
    .url();
}

export function srcSet(source: SanityImageSource, widths: number[], cropped = false, quality?: number) {
  return widths.map((w) => `${(cropped ? croppedImageUrl : imageUrl)(source, w, quality)} ${w}w`).join(", ");
}
