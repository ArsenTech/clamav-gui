import { useMemo } from "react";

interface Props{
     items?: number
}
export default function ExclusionsLoader({items = 5}: Props){
     const range = useMemo(()=>Array.from({length: items}).map((_,i)=>i+1),[items]);
     return (
          <div className="border border-accent animate-pulse flex flex-col gap-4 rounded-xl p-6">
               <div className="flex justify-between items-center gap-2 w-full">
                    <div className="space-y-2 w-full">
                         <div className="h-4 bg-accent rounded-md w-1/3"/>
                         <div className="h-3.5 bg-accent rounded-md w-1/5"/>
                    </div>
                    <div className="h-9 w-40 bg-accent rounded-md"/>
               </div>
               {range.length>0 ? (
                    <div className="space-y-2">
                         {range.map(id=>(
                              <div key={id} className="flex justify-between items-center gap-2 pb-1 border-b last:pb-0 last:border-none">
                                   <div className="bg-accent rounded-md w-1/2 h-4"/>
                                   <div className="bg-accent rounded-md size-10"/>
                              </div>
                         ))}
                    </div>
               ) : (
                    <div className="bg-accent rounded-md w-full h-4"/>
               )}
          </div>
     )
}