import { AppLayout } from "@/components/layout";

export default function SettingsPage(){
     return (
          <AppLayout className="flex justify-center items-center gap-4 flex-col p-4">
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium border-b pb-2 w-fit">Settings</h1>
          </AppLayout>
     )
}