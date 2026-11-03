import { getWork, getWorkContent, toPlainText } from "src/index";
import { expectUnlocked } from "./helpers/invariants";
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import server from "./mocks/server";
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

    expect(workContent.content.chapters[0].notes.start).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.chapters[0].notes.start)).toMatchFileSnapshot(
      "./snapshots/ao3/works/29046888/chapter-1-start-notes.html"
    );

    expect(workContent.content.chapters[0].notes.end).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.chapters[0].notes.end)).toMatchFileSnapshot(
      "./snapshots/ao3/works/29046888/chapter-1-end-notes.html"
    );

    await expect(prettifyOrNullish(workContent.content.chapters[0].html)).toMatchFileSnapshot(
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
    expect(workContent.content.chapters[0].summary).toBeNull();
    expect(workContent.content.chapters[0].notes).toEqual({ start: null, end: null });

    await expect(prettifyOrNullish(workContent.content.chapters[0].html)).toMatchFileSnapshot(
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

    expect(workContent.content.chapters[0].notes.start).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.chapters[0].notes.start)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-start-notes.html"
    );

    // The first chapter shows the work's notes as well as its own
    expect(workContent.content.notes.start).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.notes.start)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/work-start-notes.html"
    );

    await expect(prettifyOrNullish(workContent.content.chapters[0].html)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-content.html"
    );
    await expect(toPlainText({ html: workContent.content.chapters[0].html })).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-content.txt"
    );

    expect(workContent.content.chapters[0].notes.end).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.chapters[0].notes.end)).toMatchFileSnapshot(
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

    expect(workContent.content.chapters[0].summary).not.toBeNull();
    expect(workContent.content.chapters[0].notes.start).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content.chapters[0].notes.start)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-2-start-notes.html"
    );

    await expect(prettifyOrNullish(workContent.content.chapters[0].html)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-2-content.html"
    );

    expect(workContent.content.chapters[0].notes.end).toBeNull();
  });
});

describe("Works/content chapter URL", () => {
  it("should link a oneshot's chapter to the work", async () => {
    const { content } = expectUnlocked(await getWorkContent({ workId: 323217 }));
    expect(content.chapters[0].url).toBe("https://archiveofourown.org/works/323217");
    expect(content.chapters[0].shortUrl).toBe("https://ao3.org/works/323217");
  });

  it("should link to the first chapter when no chapter is given", async () => {
    const { content } = expectUnlocked(await getWorkContent({ workId: 17793689 }));
    expect(content.chapters[0].url).toBe(
      "https://archiveofourown.org/works/17793689/chapters/41980418",
    );
  });

  it("should link to the given chapter", async () => {
    const { content } = expectUnlocked(await getWorkContent({ workId: 17793689, chapterId: 42035519 }));
    expect(content.chapters[0].url).toBe(
      "https://archiveofourown.org/works/17793689/chapters/42035519",
    );
    expect(content.chapters[0].shortUrl).toBe(
      "https://ao3.org/works/17793689/chapters/42035519",
    );
  });
});

describe("Works/content chapter details", () => {
  it("should read the chapter AO3 shows when no chapter is given", async () => {
    const work = expectUnlocked(await getWorkContent({ workId: 17793689 }));
    expect(work.content.chapters).toHaveLength(1);
    expect(work.content.chapters[0]).toMatchObject({ id: 41980418, index: 1 });
  });

  it("should read the given chapter's id, index, and title", async () => {
    const work = expectUnlocked(await getWorkContent({ workId: 17793689, chapterId: 42035519 }));
    expect(work.content.chapters[0]).toMatchObject({
      id: 42035519,
      index: 2,
      title: "The College of Enchanters: New Haven",
    });
  });

  it("should throw when AO3 shows a different chapter than the one asked for", async () => {
    // AO3 redirects a chapter that isn't part of the work to the work's
    // first chapter instead of failing
    server.use(
      http.get(
        "https://archiveofourown.org/works/17793689/chapters/1",
        () => HttpResponse.redirect(
          "https://archiveofourown.org/works/17793689/chapters/41980418",
          302,
        ),
      ),
    );
    await expect(
      getWorkContent({ workId: 17793689, chapterId: 1 }),
    ).rejects.toThrow("Chapter 1 was not found: AO3 showed chapter 41980418 instead");
  });

  it("should accept fullWork as a plain boolean", async () => {
    // A boolean variable didn't type-check when getWorkContent had overloads
    const options: { fullWork: boolean } = { fullWork: true };
    const work = expectUnlocked(await getWorkContent({ workId: 17793689, ...options }));
    expect(work.content.chapters.length).toBeGreaterThan(1);
  });
});

describe("Works/content details", () => {
  it("should include the same work details as getWork", async () => {
    const { content, ...work } = expectUnlocked(await getWorkContent({ workId: 29046888 }));
    expect(work).toEqual(await getWork({ workId: 29046888 }));
  });

  it("should include the same work details as getWork when given a later chapter", async () => {
    const { content, ...work } = expectUnlocked(await getWorkContent({ workId: 17793689, chapterId: 42035519 }));
    // AO3 only shows the work's summary on its first page
    expect(work).toEqual({
      ...(await getWork({ workId: 17793689 })),
      summary: null,
    });
  });

  it("should include the work's details for the full work", async () => {
    const { content, ...work } = expectUnlocked(await getWorkContent({ workId: 17793689, fullWork: true }));
    expect(work).toEqual(await getWork({ workId: 17793689 }));
  });
});

describe("Works/content with fullWork", () => {
  it("should return every chapter of a multi-chapter work", async () => {
    const fullWork = expectUnlocked(await getWorkContent({ workId: 17793689, fullWork: true }));
    const chapter1 = expectUnlocked(await getWorkContent({
      workId: 17793689,
      chapterId: 41980418,
    }));
    const chapter2 = expectUnlocked(await getWorkContent({
      workId: 17793689,
      chapterId: 42035519,
    }));

    expect(fullWork.summary).not.toBeNull();
    expect(fullWork.content.notes.start).not.toBeNull();
    expect(fullWork.content.notes.end).toEqualHtml("<p>Placeholder work end notes.</p>");
    expect(fullWork.content.chapters.map(({ id, index }) => ({ id, index }))).toEqual([
      { id: 41980418, index: 1 },
      { id: 42035519, index: 2 },
    ]);
    const [first, second] = fullWork.content.chapters;
    // Same text and notes as each chapter's own page, whose snapshots leave
    // out AO3's hidden "Chapter Text" heading
    expect(first).toMatchObject({
      title: "The Guild",
      summary: expect.any(String),
      notes: chapter1.content.chapters[0].notes,
      html: chapter1.content.chapters[0].html,
    });
    expect(second).toMatchObject({
      title: expect.any(String),
      summary: expect.any(String),
      notes: { start: chapter2.content.chapters[0].notes.start, end: null },
      html: chapter2.content.chapters[0].html,
    });
  });

  it("should return a single chapter for a oneshot", async () => {
    const fullWork = expectUnlocked(await getWorkContent({ workId: 323217, fullWork: true }));
    const regular = expectUnlocked(await getWorkContent({ workId: 323217 }));

    expect(fullWork.summary).toBe(regular.summary);
    expect(fullWork.content.notes).toEqual(regular.content.notes);
    expect(fullWork.content.notes.start).not.toBeNull();
    expect(fullWork.content.chapters).toEqual(regular.content.chapters);
    expect(fullWork.content.chapters).toMatchObject([
      {
        id: null,
        index: 1,
        title: null,
        summary: null,
        notes: { start: null, end: null },
        url: "https://archiveofourown.org/works/323217",
      },
    ]);
  });
});

describe("Works/content of a locked work", () => {
  it("should return only the lock, without throwing", async () => {
    const workContent = await getWorkContent({ workId: 15461226 });
    expect(workContent).toEqual(await getWork({ workId: 15461226 }));
    expect(workContent.locked).toBe(true);
  });
});
