import dirTree from "directory-tree";
import path, { dirname } from "path";
import filenameReservedRegex, {
  windowsReservedNameRegex,
} from "filename-reserved-regex";
import { fileURLToPath } from "url";
import { renameSync } from "fs";

const hasInvalidFileCharacters = (filename: string) => {
  return (
    filename.match(filenameReservedRegex()) ||
    filename.match(windowsReservedNameRegex())
  );
};

// We replace all the instances of invalid characters with "!" (a valid character at random)
export const replaceInvalidFileCharacters = (filename: string) => {
  const replaced = filename.replace(filenameReservedRegex(), "!");
  return replaced.replace(windowsReservedNameRegex(), "!");
};

const recursivelyRenameDirectories = (folder: ReturnType<typeof dirTree>) => {
  // If the file is not a folder, we don't care. This is because we're making
  // the assumption that all the mocks files are given standard names from
  // ao3 like `index.html`, `works.html` or `feed.atom`, and the actual custom
  // paths are in the urls.
  if (!folder.children) {
    return;
  }
  // First ensure all the subdirectories are renamed before touching the current
  // one, or paths will get messed up.
  folder.children.forEach((subdirectory) =>
    recursivelyRenameDirectories(subdirectory)
  );
  if (hasInvalidFileCharacters(folder.name)) {
    const containingDir = dirname(folder.path);
    renameSync(
      path.join(containingDir, folder.name),
      path.join(containingDir, replaceInvalidFileCharacters(folder.name))
    );
  }
};

const mocksTree = dirTree(
  path.join(dirname(fileURLToPath(import.meta.url)), "../src/mocks"),
  {
    normalizePath: true,
  }
);
recursivelyRenameDirectories(mocksTree);
