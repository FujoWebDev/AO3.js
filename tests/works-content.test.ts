import { getWorkContent } from "src/index";
import { describe, it, expect } from "vitest";
import { prettify } from "htmlfy";

const prettifyOrNullish = (content: string | null) => {
  return content ? prettify(content) : null;
};

describe("Works/content", () => {
  it("should fetch work content with author notes and end notes", async () => {
    const workContent = await getWorkContent({
      workId: 29046888,
    });

    expect(workContent.summary).not.toBeNull();
    await expect(prettifyOrNullish(workContent.summary)).toMatchFileSnapshot(
      "./snapshots/ao3/works/29046888/chapter-1-summary.html"
    );

    expect(workContent.startNotes).not.toBeNull();
    await expect(prettifyOrNullish(workContent.startNotes)).toMatchFileSnapshot(
      "./snapshots/ao3/works/29046888/chapter-1-start-notes.html"
    );

    expect(workContent.endNotes).not.toBeNull();
    await expect(prettifyOrNullish(workContent.endNotes)).toMatchFileSnapshot(
      "./snapshots/ao3/works/29046888/chapter-1-end-notes.html"
    );

    expect(workContent.content).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content)).toMatchFileSnapshot(
      "./snapshots/ao3/works/29046888/chapter-1-content.html"
    );
  });

  it("should handle work without notes", async () => {
    const workContent = await getWorkContent({
      workId: 323217,
    });

    expect(workContent.summary).not.toBeNull();
    await expect(prettifyOrNullish(workContent.summary)).toMatchFileSnapshot(
      "./snapshots/ao3/works/323217/chapter-1-summary.html"
    );

    expect(workContent.startNotes).toBeNull();

    expect(workContent.content).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content)).toMatchFileSnapshot(
      "./snapshots/ao3/works/323217/chapter-1-content.html"
    );

    expect(workContent.endNotes).toBeNull();
  });

  it("should fetch content from multi-chapter work", async () => {
    const workContent = await getWorkContent({
      workId: 17793689,
    });

    expect(workContent.summary).not.toBeNull();
    await expect(prettifyOrNullish(workContent.summary)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-summary.html"
    );

    expect(workContent.startNotes).not.toBeNull();
    await expect(prettifyOrNullish(workContent.startNotes)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-start-notes.html"
    );

    expect(workContent.content).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-content.html"
    );

    expect(workContent.endNotes).not.toBeNull();
    await expect(prettifyOrNullish(workContent.endNotes)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-1-end-notes.html"
    );
  });

  it("should fetch content from non-first chapter in multi-chapter work", async () => {
    const workContent = await getWorkContent({
      workId: 17793689,
      chapterId: 42035519,
    });

    expect(workContent.summary).not.toBeNull();
    await expect(prettifyOrNullish(workContent.summary)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-2-summary.html"
    );

    expect(workContent.startNotes).not.toBeNull();
    await expect(prettifyOrNullish(workContent.startNotes)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-2-start-notes.html"
    );

    expect(workContent.content).not.toBeNull();
    await expect(prettifyOrNullish(workContent.content)).toMatchFileSnapshot(
      "./snapshots/ao3/works/17793689/chapter-2-content.html"
    );

    expect(workContent.endNotes).toBeNull();
  });
});
