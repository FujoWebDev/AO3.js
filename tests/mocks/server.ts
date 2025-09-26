import handlers from "./handlers";
import { setupServer } from "msw/node";

const server = setupServer(...handlers.flat());

export default server;
