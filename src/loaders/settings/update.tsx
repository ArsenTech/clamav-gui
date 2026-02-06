export default function UpdateSettingsLoader(){
     return (
          <div className="px-1 py-2 space-y-3 w-full">
               <div className="border border-accent animate-pulse flex flex-col gap-5 rounded-xl p-6">
                    <div className="h-4 bg-accent rounded-md w-1/3"/>
                    <div className="flex flex-col items-center gap-4">
                         <div className="flex justify-center items-center gap-4 w-full">
                              <div className="bg-accent rounded-md size-12"/>
                              <div className="text-center space-y-1.5 w-40">
                                   <div className="bg-accent rounded-md h-5 md:h-6 lg:h-[30px] xl:h-8 w-full"/>
                                   <div className="bg-accent rounded-md h-3.5 w-full"/>
                              </div>
                         </div>
                         <div className="bg-accent rounded-md h-9 w-[157px]"/>
                         <div className="bg-accent rounded-md h-3.5 w-64"/>
                    </div>
               </div>
          </div>
     )
}