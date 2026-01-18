/**
 * Allows ts-to-zod to generate schemas for both Zod 3 and Zod 4 by:
 * 
 * 1. Fixing enum handling for Zod 3: ts-to-zod generates z.enum(EnumName) but 
 *    Zod 3 requires z.nativeEnum(EnumName) for TypeScript enums.
 * 2. Adjusting the import path:
 *    - schemas.ts imports from "zod/v3" (Zod 3 API)
 *    - schemas-v4.ts imports from "zod" (Zod 4 API)
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const schemasPath = resolve(import.meta.dirname, "generated/schemas.ts");
const schemasV4Path = resolve(import.meta.dirname, "generated/schemas-v4.ts");

const content = readFileSync(schemasPath, "utf-8");

const ENUM_PATTERN = /z\.enum\(([A-Z][a-zA-Z0-9]*)\)/g;

const zodV3Content = content
  .replace(ENUM_PATTERN, "z.nativeEnum($1)")
  .replace(/from ["']zod["']/g, 'from "zod/v3"');

const matches = content.match(ENUM_PATTERN);
if (matches) {
  console.log(`✔ Fixed ${matches.length} enum schemas to use z.nativeEnum() for Zod 3`);
}

writeFileSync(schemasPath, zodV3Content);
console.log("✔ Generated types/zod/schemas.ts (Zod 3)");

// Fixes for Zod 4
const zodV4Content = content; 
writeFileSync(schemasV4Path, zodV4Content);
console.log("✔ Generated types/zod/schemas-v4.ts (Zod 4)");
