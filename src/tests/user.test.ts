import { getUser } from "../index";

describe("Fetches id data", () => {
  test("Fetches username and user ID", async () => {
    const user = await getUser({
      userName: "astolat",
    });

    expect(user).toMatchObject({
      name: "astolat",
      id: "8",
    });
  });

});
