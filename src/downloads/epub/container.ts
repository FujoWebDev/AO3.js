import { load } from "cheerio";
import { strFromU8, unzipSync, type Unzipped } from "fflate";

/**
 * Paths in an EPUB are relative to the file that mentions them, and may be
 * URL-encoded ("My%20Work.xhtml").
 */
const resolveZipPath = (fromFile: string, href: string) => {
  const segments = fromFile.split("/").slice(0, -1);
  for (const segment of decodeURIComponent(href).split("/")) {
    if (segment === "..") {
      segments.pop();
    } else if (segment !== "." && segment !== "") {
      segments.push(segment);
    }
  }
  return segments.join("/");
};

const readFromZip = (files: Unzipped, fromFile: string, href: string) => {
  const filePath = resolveZipPath(fromFile, href);
  const file = files[filePath];
  if (!file) {
    throw new Error(`The EPUB doesn't have the file ${filePath}`);
  }
  return { filePath, file };
};

const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
};

/**
 * Lists the EPUB's HTML files in reading order, with the language it's in.
 */
const getEpubPackage = (files: Unzipped) => {
  const container = load(strFromU8(readFromZip(files, "", "META-INF/container.xml").file), {
    xml: true,
  });
  const packagePath = container("rootfile").attr("full-path");
  if (!packagePath) {
    throw new Error("The EPUB doesn't say where its package file is");
  }
  const $package = load(strFromU8(readFromZip(files, "", packagePath).file), { xml: true });

  const items = new Map<string | undefined, { href: string; mediaType: string | undefined }>();
  $package("manifest > item").each((_, item) => {
    const href = $package(item).attr("href");
    if (href) {
      items.set($package(item).attr("id"), {
        href,
        mediaType: $package(item).attr("media-type"),
      });
    }
  });
  const spine = $package("spine > itemref")
    .toArray()
    .map((itemref) => {
      const item = items.get($package(itemref).attr("idref"));
      if (!item) {
        throw new Error("The EPUB's reading order lists a file it doesn't have");
      }
      return readFromZip(files, packagePath, item.href).filePath;
    });

  return {
    spine,
    // Images are referred to by path, so look up their type by path too
    mediaTypes: new Map(
      [...items.values()].map(({ href, mediaType }) => [
        resolveZipPath(packagePath, href),
        mediaType,
      ]),
    ),
    language: $package("metadata > dc\\:language").first().text().trim(),
  };
};

/**
 * Puts the body of every HTML file in the EPUB into one page, in reading
 * order. EPUBs split their text into files at arbitrary points, so this gives
 * back the whole text. Images are embedded into the page, since the files
 * they point to are only inside the EPUB.
 */
export const getEpubBody = (epub: Uint8Array) => {
  let files;
  try {
    files = unzipSync(epub);
  } catch (error) {
    throw new Error("Couldn't open the file as an EPUB", { cause: error });
  }
  const { spine, mediaTypes, language } = getEpubPackage(files);
  const bodies = spine.map((filePath) => {
    const $ = load(strFromU8(files[filePath]));
    $("img").each((_, image) => {
      const src = $(image).attr("src");
      // Absolute URLs ("https:", "data:") point outside the zip
      if (!src || URL.canParse(src)) {
        return;
      }
      const imageFile = readFromZip(files, filePath, src);
      const mediaType = mediaTypes.get(imageFile.filePath) ?? "image/jpeg";
      $(image).attr("src", `data:${mediaType};base64,${toBase64(imageFile.file)}`);
    });
    return $("body").html() ?? "";
  });
  return { $: load(bodies.join("\n")), language };
};
