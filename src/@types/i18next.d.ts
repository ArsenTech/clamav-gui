import "i18next";
import overview from "@public/locales/en/overview.json";
import scan from "@public/locales/en/scan.json";
import translation from "@public/locales/en/translation.json";
import table from "@public/locales/en/table.json";
import quarantine from "@public/locales/en/quarantine.json";
import history from "@public/locales/en/history.json";
import scheduler from "@public/locales/en/scheduler.json";
import stats from "@public/locales/en/stats.json";
import settings from "@public/locales/en/settings.json"
import scanSettings from "@public/locales/en/scan-settings.json"
import update from "@public/locales/en/update.json"

import { LangCode } from "../i18n/config";

declare module "i18next" {
     interface CustomTypeOptions {
          defaultNS: "translation";
          resources: {
               overview: typeof overview;
               scan: typeof scan;
               translation: typeof translation;
               table: typeof table;
               quarantine: typeof quarantine;
               history: typeof history;
               scheduler: typeof scheduler;
               stats: typeof stats;
               settings: typeof settings;
               "scan-settings": typeof scanSettings;
               update: typeof update
          };
     }
}