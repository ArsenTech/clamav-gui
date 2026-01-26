export const CREDIS_DATA = {
     coreTech: {
          title: "Core Technologies",
          entries: [
               "ClamAV (Antivirus Engine)",
               "FreshClam (Signature Updates)",
          ]
     },
     interface: {
          title: "Interface & Platform",
          entries: [
               "Tauri (Desktop Runtime)",
               "React (UI/UX)",
               "Rust (Backend & Security)",
               "React Router (Navigation)",
               "ShadCN UI (Design system)",
               "Tailwind CSS (Styling)"
          ]
     },
     system: {
          title: "System Integration",
          entries: [
               "Windows Task Scheduler",
               "Windows Security APIs",
               "Command-line Interfaces (CLI tools)"
          ]
     },
     ecosystem: {
          title: "Open Source Ecosystem",
          entries: [
               "ClamAV Community",
               "Tauri Community",
               "Rust Open Source Ecosystem",
               "Open Source Contributors Worldwide"
          ]
     }
} as const
export const SPECIAL_THANKS = [
     {
          handle: "@LorNapes2",
          link: "https://www.youtube.com/@LorNapes2",
          note: "Early testing & feedback",
     },
     {
          handle: "@EinfxxhMicro",
          link: "https://www.youtube.com/@EinfxchMicro",
          note: "Bug reports & testing",
     },
] as const;