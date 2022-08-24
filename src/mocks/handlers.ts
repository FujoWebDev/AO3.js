import allHandlers from "./handlers/all";
import feedHandlers from "./handlers/tags/feed";
import nameHandlers from "./handlers/tags/name";
import profileHandlers from "./handlers/users/profile";
import worksHandlers from "./handlers/tags/works";

export default [
  profileHandlers,
  feedHandlers,
  worksHandlers,
  nameHandlers,
  allHandlers,
];
