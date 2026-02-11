import "i18next";
import overview from "@i18n/en/overview.json";
import scan from "@i18n/en/scan.json";
import translation from "@i18n/en/translation.json";
import table from "@i18n/en/table.json";
import quarantine from "@i18n/en/quarantine.json";
import history from "@i18n/en/history.json";
import scheduler from "@i18n/en/scheduler.json";
import stats from "@i18n/en/stats.json";
import settings from "@i18n/en/settings.json"
import scanSettings from "@i18n/en/scan-settings.json"
import update from "@i18n/en/update.json"
import about from "@i18n/en/about.json"
import credits from "@i18n/en/credits.json"
import messages from "@i18n/en/messages.json"
import noClamAvPage from "@i18n/en/no-clamav-page.json"

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
               update: typeof update;
               about: typeof about;
               credits: typeof credits;
               messages: typeof messages;
               "no-clamav-page": typeof noClamAvPage;
          };
     }
}