import { Search, SearchCheck, FolderSearch, FileSearch } from "lucide-react";
import { IScanMenuItem, ISpecialThanksItem } from "../types";
import { ScanType } from "../types/enums";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MarkdownToJSX } from "markdown-to-jsx";

export const COMPONENTS: MarkdownToJSX.Overrides = {
     h1: { props: { className: "scroll-m-40 border-b pb-2 text-3xl font-semibold tracking-tight mt-0! mb-2!" } },
     h2: { props: { className: "scroll-m-40 border-b pb-2 text-2xl font-semibold tracking-tight mt-0! mb-2!" } },
     h3: { props: { className: "scroll-m-40 text-xl font-semibold tracking-tight mt-0! mb-2!", } },
     h4: { props: { className: "scroll-m-40 text-lg font-semibold tracking-tight mt-0! mb-2!", } },
     p: { props: { className: "leading-7" } },
     a: { props: { className: cn(buttonVariants({ variant: "link" }), "px-0.5 py-0 whitespace-normal inline-block text-sm md:text-base break-all") } },
     small: { props: { className: "text-sm font-medium leading-none" } },
}

export const DAYS_OF_THE_WEEK = ["mon","tue","wed","thu","fri","sat","sun"] as const;
export const INTERVALS = ["daily","weekly","monthly"] as const

export const SCAN_TYPES: IScanMenuItem[] = [
     { type: ScanType.Main, Icon: Search},
     { type: ScanType.Full, Icon: SearchCheck},
     { type: ScanType.Custom, Icon: FolderSearch},
     { type: ScanType.File, Icon: FileSearch}
]
export const SCAN_ENUM = SCAN_TYPES.filter(val=>val.type!=="" && val.type!=="custom" && val.type!=="file").map(val=>val.type);
export const SCAN_OPTIONS = SCAN_TYPES.filter(val=>val.type!=="" && val.type!=="custom" && val.type!=="file").map(val=>({
     value: val.type,
     icon: val.Icon
}))

export const SPECIAL_THANKS: ISpecialThanksItem[] = [
     {
          handle: "@LorNapes2",
          link: "https://www.youtube.com/@LorNapes2",
          note: "early-test",
     },
     {
          handle: "@EinfxxhMicro",
          link: "https://www.youtube.com/@EinfxchMicro",
          note: "bug-report-test"
     },
];