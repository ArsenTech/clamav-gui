import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MarkdownToJSX } from "markdown-to-jsx";

export const COMPONENTS: MarkdownToJSX.Overrides = {
     h1: {
          props: {
               className: "scroll-m-40 border-b pb-2 text-3xl font-semibold tracking-tight mt-0! mb-2!"
          }
     },
     h2: {
          props: {
               className: "scroll-m-40 border-b pb-2 text-2xl font-semibold tracking-tight mt-0! mb-2!"
          }
     },
     h3: {
          props: {
               className: "scroll-m-40 text-xl font-semibold tracking-tight mt-0! mb-2!",
          }
     },
     h4: {
          props: {
               className: "scroll-m-40 text-lg font-semibold tracking-tight mt-0! mb-2!",
          }
     },
     p: {
          props: {
               className: "leading-7"
          }
     },
     a: {
          props: {
               className: cn(buttonVariants({ variant: "link" }), "px-0.5 py-0 whitespace-normal inline-block text-sm md:text-base break-all")
          }
     },
     small: {
          props: {
               className: "text-sm font-medium leading-none"
          }
     },
}