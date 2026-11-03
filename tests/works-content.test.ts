import { getWork, getWorkContent, toPlainText } from "src/index";
import { expectUnlocked } from "./helpers/invariants";
import { describe, it, expect } from "vitest";
import { prettify } from "htmlfy";

const prettifyOrNullish = (content: string | null) => {
  return content ? prettify(content) : null;
};

describe("Works/content", () => {
  it("should fetch work content with author notes and end notes", async () => {
    const workContent = expectUnlocked(await getWorkContent({
      workId: 29046888,
    }));

    expect(workContent.summary).not.toBeNull();
    await expect(prettifyOrNullish(workContent.summary)).toMatchFileSnapshot(
      "./snapshots/ao3/works/29046888/chapter-1-summary.html"
    );

    expect(workContent.content.chapter.notes.start).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.chapter.notes.start)).toMatchFileSnapshot(
      "./snapshots/ao3/works/29046888/chapter-1-start-notes.html"
    );

    expect(workContent.content.chapter.notes.end).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.chapter.notes.end)).toMatchFileSnapshot(
      "./snapshots/ao3/works/29046888/chapter-1-end-notes.html"
    );

    await expect(prettifyOrNullish(workContent.content.chapter.html)).toMatchFileSnapshot(
      "./snapshots/ao3/works/29046888/chapter-1-content.html"
    );
  });

  it("should put a oneshot's notes on the work, not the chapter", async () => {
    const workContent = expectUnlocked(await getWorkContent({
      workId: 323217,
    }));

    expect(workContent.summary).not.toBeNull();
    await expect(prettifyOrNullish(workContent.summary)).toMatchFileSnapshot(
      "./snapshots/ao3/works/323217/chapter-1-summary.html"
    );

    // Works with a single chapter have no chapter notes, only the work's
    expect(workContent.content.notes.start).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.notes.start)).toMatchFileSnapshot(
      "./snapshots/ao3/works/323217/work-start-notes.html"
    );
    expect(workContent.content.notes.end).toBeNull();
    expect(workContent.content.chapter.summary).toBeNull();
    expect(workContent.content.chapter.notes).toEqual({ start: null, end: null });

    await expect(prettifyOrNullish(workContent.content.chapter.html)).toMatchFileSnapshot(
      "./snapshots/ao3/works/323217/chapter-1-content.html"
    );
  });

  it("should fetch content from multi-chapter work", async () => {
    const workContent = expectUnlocked(await getWorkContent({
      workId: 17793689,
    }));

    expect(workContent.summary).not.toBeNull();
    await expect(prettifyOrNullish(workContent.summary)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-summary.html"
    );

    expect(workContent.content.chapter.notes.start).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.chapter.notes.start)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-start-notes.html"
    );

    // The first chapter shows the work's notes as well as its own
    expect(workContent.content.notes.start).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.notes.start)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/work-start-notes.html"
    );

    await expect(prettifyOrNullish(workContent.content.chapter.html)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-content.html"
    );
    await expect(toPlainText({ html: workContent.content.chapter.html })).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-content.txt"
    );

    expect(workContent.content.chapter.notes.end).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.chapter.notes.end)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-end-notes.html"
    );
  });

  it("should fetch content from non-first chapter in multi-chapter work", async () => {
    const workContent = expectUnlocked(await getWorkContent({
      workId: 17793689,
      chapterId: 42035519,
    }));

    // AO3 only shows the work's summary and start notes on its first chapter
    expect(workContent.summary).toBeNull();
    expect(workContent.content.notes.start).toBeNull();

    expect(workContent.content.chapter.summary).not.toBeNull();
    expect(workContent.content.chapter.notes.start).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.chapter.notes.start)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-2-start-notes.html"
    );

    await expect(prettifyOrNullish(workContent.content.chapter.html)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-2-content.html"
    );

    expect(workContent.content.chapter.notes.end).toBeNull();
  });
});

describe("Works/content details", () => {
  it("should include the same work details as getWork", async () => {
    const { content, ...work } = expectUnlocked(await getWorkContent({ workId: 29046888 }));
    expect(work).toEqual(await getWork({ workId: 29046888 }));
  });

  it("should include the chapter's details when given a chapter", async () => {
    const { content, ...work } = expectUnlocked(await getWorkContent({
      workId: 17793689,
      chapterId: 42035519,
    }));
    expect(work).toEqual(
      await getWork({ workId: 17793689, chapterId: 42035519 }),
    );
  });
});

describe("Works/content of a locked work", () => {
  it("should return only the lock, without throwing", async () => {
    const workContent = await getWorkContent({ workId: 15461226 });
    expect(workContent).toEqual(await getWork({ workId: 15461226 }));
    expect(workContent.locked).toBe(true);
  });
});
