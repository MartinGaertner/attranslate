import { readTFile, writeTFile } from "../../src/serializers/nested-json";
import { TSet } from "../../src/core/core-definitions";
import { runCommand } from "../test-util";

// TODO: Fix output format to pass these tests.

function expectedTSet(nested: boolean): TSet {
  if (nested) {
    return {
      lng: "en",
      translations: new Map([
        ["inner.innerInner.one", "One"],
        ["inner.two", "Two"],
        ["three", "Three"],
      ]),
    };
  } else {
    return {
      lng: "en",
      translations: new Map([
        ["one", "One"],
        ["two", "Two"],
        ["three", "Three"],
      ]),
    };
  }
}

describe.each([
  { srcFile: "test-assets/flat-json/count-en.flat.json", nested: false },
  { srcFile: "test-assets/nested-json/count-en.nested.json", nested: true },
])("Read - delete - write - git-diff", (args) => {
  test("Read-write %p", async () => {
    const tSet = readTFile(args.srcFile, "en");
    expect(tSet).toStrictEqual(expectedTSet(args.nested));
    await runCommand(`rm ${args.srcFile}`);
    writeTFile(args.srcFile, tSet);
    await runCommand(`git diff --exit-code ${args.srcFile}`);
  });
});