import { RestHandler } from "msw";
import allHandlers from "./handlers/all";
import feedHandlers from "./handlers/tags/feed";
import nameHandlers from "./handlers/tags/name";
import profileHandlers from "./handlers/users/profile";
import tagWorksHandlers from "./handlers/tags/works";
import workPageHandlers from "./handlers/works";
import worksHandlers from "./handlers/works";
// TODO: export these directly from worksHandlers
import worksNavigateHandlers from "./handlers/works/navigate";

export default [
  profileHandlers,
  feedHandlers,
  tagWorksHandlers,
  worksHandlers,
  nameHandlers,
  workPageHandlers,
  worksNavigateHandlers,
  allHandlers,
];
