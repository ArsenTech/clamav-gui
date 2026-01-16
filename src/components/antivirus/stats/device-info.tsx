import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppWindow, Monitor, PcCase } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Skeleton } from "@/components/ui/skeleton";
import { IDeviceInfo } from "@/lib/types";

export default function DeviceInfo() {
  const [info, setInfo] = useState<IDeviceInfo>({
    sys_os: "",
    sys_host: "",
    sys_name: "",
  });
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    startTransition(async () => {
      const info: IDeviceInfo = await invoke("get_sys_info");
      setInfo((prev) => ({ ...prev, ...info }));
    });
  }, []);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PcCase className="size-5" /> Device Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex flex-col justify-center gap-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ) : (
          <ul className="flex flex-col justify-center gap-2">
            <li className="flex items-center gap-2">
              <span className="font-semibold">Operating System:</span>
              <AppWindow /> {info.sys_name} {info.sys_os}
            </li>
            <li className="flex items-center gap-2">
              <span className="font-semibold">Host Name:</span>
              <Monitor /> {info.sys_host}
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
