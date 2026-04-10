import { DangerZoneConfState, DesignType, HistoryConfirmationState, QuarantineConfirmationState, ScanFinishConfState, SchedulerConfState } from "@/lib/types"
import { useTranslation } from "react-i18next"
import AlertBox from "./alert"

type ConfirmationType = "" | HistoryConfirmationState | QuarantineConfirmationState | DangerZoneConfState | ScanFinishConfState | SchedulerConfState

interface ConfirmationMessageProps{
     state: ConfirmationType
     submitAction: "" | "clear" | "delete" | "restore" | DangerZoneConfState | SchedulerConfState
     submitEvent: () => void
     type?: DesignType
     onOpenChange: (state: ConfirmationType) => void
}
export default function ConfirmationMessage({
     state,
     submitAction,
     submitEvent,
     type="default",
     onOpenChange
}: ConfirmationMessageProps){
     const {t} = useTranslation("confirmation")
     return state!=="" ? (
          <AlertBox
               open
               setOpen={(open)=>onOpenChange(open ? state : "")}
               title={t(`${state}.title`)}
               description={t(`${state}.desc`)}
               submitText={submitAction==="" ? undefined : t(`actions.${submitAction}`)}
               cancelText={t("actions.cancel")}
               submitEvent={submitEvent}
               type={type}
          />
     ) : null
}