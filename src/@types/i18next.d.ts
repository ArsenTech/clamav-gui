import "i18next";
import overview from "locales/en/overview.json";
import scan from "locales/en/scan.json";
import translation from "locales/en/translation.json";
import table from "locales/en/table.json";
import quarantine from "locales/en/quarantine.json";
import history from "locales/en/history.json";
import scheduler from "locales/en/scheduler.json";
import stats from "locales/en/stats.json";

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
          };
     }
}