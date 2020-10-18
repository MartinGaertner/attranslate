import { iOSFile, LineChunk } from "./ios-strings";
import { ReadTFileArgs } from "../file-format-definitions";
import { readUtf8File } from "../../util/util";
import { logParseError } from "../common/parse-utils";

const KEY_INDEX = 1;
export const VALUE_INDEX = 3;

export function parseiOSFile(args: ReadTFileArgs): iOSFile {
  const rawString = readUtf8File(args.path);
  const lines = rawString.split("\n");
  if (!lines.length) {
    logParseError("Empty file", args);
  }
  const iosFile: iOSFile = {
    path: args.path,
    entries: new Map(),
    auxData: [],
  };
  let currentChunk: string[] = [];
  lines.forEach((line) => {
    const keyValue = parseiOSLine(line);
    currentChunk.push(line);
    if (keyValue) {
      const key = keyValue.key;
      const value = keyValue.value;
      const lineChunk: LineChunk = {
        value,
        lines: currentChunk,
      };
      if (iosFile.entries.has(key)) {
        logParseError(
          `duplicate key '${key}' -> Currently, the usage of duplicate translation-keys is discouraged.`,
          args
        );
      }
      iosFile.entries.set(key, lineChunk);
      currentChunk = [];
    }
  });
  if (currentChunk.length) {
    iosFile.auxData = currentChunk;
  }
  if (!iosFile.entries.size) {
    logParseError("Did not find any Strings in the expected format", args);
  }
  return iosFile;
}

function parseiOSLine(
  line: string
): { key: string; value: string | null } | null {
  if (!line.trim().length) {
    return null;
  }
  if (isComment(line)) {
    return null;
  }
  const token = line.split('"');
  if (token.length < 5) {
    console.log(`Warning: Line '${line}' seems to be unexpected`);
    return null;
  }
  const key = token[KEY_INDEX];
  if (!key || !key.trim().length) {
    console.log(`Warning: Did not find a key in '${line}'`);
    return null;
  }
  const value = token[VALUE_INDEX];
  return {
    key,
    value,
  };
}

function isComment(line: string) {
  return line.includes("/*") && line.includes("*/");
}