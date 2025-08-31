import { beforeAll, afterEach, afterAll } from "vitest";
import server from "./mocks/server";

export const initSetup = () => {
  beforeAll(() => {
    server.listen()
  });
  afterEach(() => {
    server.resetHandlers()
  });
  afterAll(() => {
    server.close();
  })
}
