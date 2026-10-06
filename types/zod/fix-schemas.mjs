/**
 * ts-to-zod generates Zod 4 code, but we still support Zod 3 consumers.
 * This post-processing is needed to produce both entry points: the Zod 4
 * file explicitly imports zod/v4, while the existing Zod 3 file uses
 * z.nativeEnum() for TypeScript enums. Both come from the same generator run.
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const ENUM_PATTERN = /z\.enum\(([A-Z][a-zA-Z0-9]*)\)/g;

const schemasPath = resolve(import.meta.dirname, "generated/schemas.ts");
const v4SchemasPath = resolve(import.meta.dirname, "generated/schemas-v4.ts");
const content = readFileSync(schemasPath, "utf-8");
writeFileSync(v4SchemasPath, content.replace('from "zod"', 'from "zod/v4"'));
writeFileSync(schemasPath, content.replace(ENUM_PATTERN, "z.nativeEnum($1)"));

console.log("✔ Generated Zod 3 and Zod 4 schemas");
