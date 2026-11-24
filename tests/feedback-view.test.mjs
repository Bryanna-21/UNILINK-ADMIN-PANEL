// Run with:  npm test
import test from "node:test";
import assert from "node:assert/strict";
import {
  categoryLabel, statusLabel, statusEdge, platformLabel, contextFacts, nextActions, tabCount, readFeedbackPage, STATUS_TABS,
} from "../src/lib/feedback-view.ts";

const row = {
  id: "64b0000000000000000000a1", reference: "FB-7K3M9QXD", category: "bug", message: "The feed freezes.\nSecond line.",
  context: { platform: "android", appVersion: "0.2.0", screen: "campus", userAgent: "UniLink/0.2.0 (android 14)" },
  status: "new", universityId: "u1", reporterId: "64b0000000000000000000b2", reporterName: "Amina", handledAt: null, createdAt: "2026-11-22T10:00:00.000Z",
};

test("labels", () => {
  assert.equal(categoryLabel("bug"), "Bug");
  assert.equal(categoryLabel("idea"), "Idea");
  assert.equal(categoryLabel("anything else"), "Other");
  assert.equal(statusLabel("seen"), "Seen");
  assert.equal(statusLabel("closed"), "Closed");
  assert.equal(statusLabel("weird"), "New");
  assert.equal(platformLabel("IOS"), "iOS");
  assert.equal(platformLabel("web"), "Website");
  assert.equal(platformLabel("symbian"), "");
});

test("the coloured edge uses the panel's existing status colours", () => {
  assert.equal(statusEdge("new"), "open");
  assert.equal(statusEdge("seen"), "pending");
  assert.equal(statusEdge("closed"), "resolved");
});

test("context facts skip whatever the app did not send, and tolerate missing context", () => {
  assert.deepEqual(contextFacts(row.context), ["Android", "Version 0.2.0", "Screen: campus"]);
  assert.deepEqual(contextFacts({ platform: "web", appVersion: "", screen: "" }), ["Website"]);
  assert.deepEqual(contextFacts(null), []);
  assert.deepEqual(contextFacts(undefined), []);
  assert.deepEqual(contextFacts({}), []);
});

test("what an admin may do next: nothing is permanent, a closed report can be reopened", () => {
  assert.deepEqual(nextActions("new").map((a) => a.status), ["seen", "closed"]);
  assert.deepEqual(nextActions("seen").map((a) => a.status), ["closed", "new"]);
  assert.deepEqual(nextActions("closed").map((a) => a.status), ["new"]);
  assert.deepEqual(nextActions("garbage").map((a) => a.status), ["new"]);
});

test("tabs and their counts", () => {
  assert.deepEqual(STATUS_TABS.map((t) => t.value), ["new", "seen", "closed", "all"]);
  const counts = { new: 3, seen: 2, closed: 5 };
  assert.equal(tabCount("new", counts), 3);
  assert.equal(tabCount("closed", counts), 5);
  assert.equal(tabCount("all", counts), 10);
});

test("a good server answer is read as it is", () => {
  const page = readFeedbackPage({ status: "success", data: [row], counts: { new: 1, seen: 0, closed: 4 }, page: 2, limit: 20, total: 25, totalPages: 2 });
  assert.equal(page.items.length, 1);
  assert.deepEqual(page.items[0], row);
  assert.deepEqual(page.counts, { new: 1, seen: 0, closed: 4 });
  assert.deepEqual([page.page, page.limit, page.total, page.totalPages], [2, 20, 25, 2]);
});

test("a malformed answer becomes an empty, safe page and never throws", () => {
  for (const raw of [null, undefined, "x", 5, [], {}, { data: "x" }, { data: [null, 5, "x", [], {}] }, { counts: "x" }]) {
    const page = readFeedbackPage(raw);
    assert.deepEqual(page.items, []);
    assert.deepEqual(page.counts, { new: 0, seen: 0, closed: 0 });
    assert.equal(page.page, 1);
    assert.equal(page.totalPages, 1);
  }
});

test("odd values inside a report are cleaned, not trusted", () => {
  const page = readFeedbackPage({ data: [{ id: "abc123", status: "hacked", category: "<script>", message: 42, context: "x", reporterName: "", universityId: 7, handledAt: 5 }], counts: { new: -3, seen: "2", closed: NaN } });
  const item = page.items[0];
  assert.equal(item.status, "new");
  assert.equal(item.category, "other");
  assert.equal(item.message, "");
  assert.deepEqual(item.context, { platform: "", appVersion: "", screen: "", userAgent: "" });
  assert.equal(item.reporterName, "Unknown user");
  assert.equal(item.universityId, null);
  assert.equal(item.handledAt, null);
  assert.deepEqual(page.counts, { new: 0, seen: 0, closed: 0 });
});

test("markup in a message is kept as text (the page shows it as text, never as HTML)", () => {
  const html = "<img src=x onerror=alert(1)> broken";
  assert.equal(readFeedbackPage({ data: [{ ...row, message: html }] }).items[0].message, html);
});

test("an item with no id is dropped, and absurdly long text is capped", () => {
  const page = readFeedbackPage({ data: [{ ...row, id: "" }, { ...row, message: "x".repeat(9000) }] });
  assert.equal(page.items.length, 1);
  assert.equal(page.items[0].message.length, 2500);
});
