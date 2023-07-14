import dirTree from "directory-tree";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { renameSync } from "fs";
import filenamify from "filenamify";

const hasInvalidFileCharacters = (filename: string) => {
  return filenamify(filename) != filename;
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
    console.log(
      `${path.join(containingDir, folder.name)} => ${path.join(
        containingDir,
        filenamify(folder.name)
      )}`
    );
    renameSync(
      path.join(containingDir, folder.name),
      path.join(containingDir, filenamify(folder.name))
    );
  }
};

const mocksTree = dirTree(
  path.join(dirname(fileURLToPath(import.meta.url)), "../data"),
  {
    normalizePath: true,
  }
);
console.log(dirname(fileURLToPath(import.meta.url)));
recursivelyRenameDirectories(mocksTree);
