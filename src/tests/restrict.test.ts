import { checkLocks } from "..";
import { getCheckingURL, getLockedCheck } from "../utils/restrict";

describe("Checks status of a restricted work. NOTE: This test may fail if the owner of the example work changes it to unrestricted!", () => {
 test("Checks a known restricted work.", async () => {
  const work = await checkLocks( { workID: "15461226" } )

  expect(work).toMatchObject({
   locked: true
  })

 });

})