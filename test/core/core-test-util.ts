import { TSet } from "../../src/core/core-definitions";
import { CoreArgs } from "../../src/core/translate-core";

export const enSrc: TSet = {
  lng: "en",
  translations: new Map([
    ["hello", "Hello"],
    ["world", "World"],
    ["attranslate", "Automated Text Translator"],
    ["value", "Translate within seconds"],
    ["outcome", "No more slowdowns"],
    ["getStarted", "Get started within minutes"],
  ]),
};

export const commonArgs: Omit<CoreArgs, "oldTarget" | "srcCache"> = {
  src: enSrc,
  service: "google-translate",
  serviceConfig: "gcloud/gcloud_service_account.json",
  matcher: "icu",
  targetLng: "de",
};

export const deTarget: TSet = {
  lng: "de",
  translations: new Map([
    ["hello", "Hallo"],
    ["world", "Welt"],
    ["attranslate", "Automatisierter Textübersetzer"],
    ["value", "Innerhalb von Sekunden übersetzen"],
    ["outcome", "Keine Verlangsamungen mehr"],
    ["getStarted", "Beginnen Sie innerhalb von Minuten"],
  ]),
};