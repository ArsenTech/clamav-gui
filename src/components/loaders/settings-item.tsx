interface Props{
     className?: string,
     children: React.ReactNode,
     noDescription?: boolean
}
export default function SettingsItemLoader({className, children, noDescription=false}: Props){
     return (
          <div className="border border-accent animate-pulse flex flex-col gap-6 rounded-xl p-6">
               <div className="h-4 bg-accent rounded-md w-1/3"/>
               {!noDescription && (
                    <div className="h-3.5 bg-accent rounded-md w-1/2"/>
               )}
               {!className ? children : (
                    <div className={className}>
                         {children}
                    </div>
               )}
          </div>
     )
}