import { getWorkData } from "../index";

describe("Fetches data from url", () => {
test("Fetches work id from url", async () => {
 const workData = await getWorkData({
  url: "https://archiveofourown.org/works/36667228",
 });

 expect(workData).toMatchObject({
  workUrl: "https://archiveofourown.org/works/36667228",
  workId: "36667228",
 })
});

test("Fetches chapter id from url", async () => {
 const workData = await getWorkData({
  url: "https://archiveofourown.org/works/398023/chapters/659774",
 });

 expect(workData).toMatchObject({
  workUrl: "https://archiveofourown.org/works/398023/chapters/659774",
  workId: "398023",
  chapterId: "659774",
 })
});

test("Fetches collection from url", async () => {
 const workData = await getWorkData({
  url: "https://archiveofourown.org/collections/YJ_Prompts/works/30216801",
 });

 expect(workData).toMatchObject({
  workUrl: "https://archiveofourown.org/collections/YJ_Prompts/works/30216801",
  workId: "30216801",
  collectionName: "YJ_Prompts",
 })
});
});