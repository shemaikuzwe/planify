import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export function useCall(id: string | string[]|undefined) {
  const [call, setCall] = useState<Call>();
  const [loading, setLoading] = useState(true);
  const client = useStreamVideoClient();
  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
     try{
      const { calls } = await client.queryCalls({
        filter_conditions: { id },
      });
      if (calls.length > 0) {
        setCall(calls[0]);
        setLoading(false);
      } else {
        console.log("no call found for this id");
      }
     }catch(err){
      console.log(err);
      setLoading(false) 
     }
     finally{
      setLoading(false)
     }
    };
    loadCall();
  }, [client, id]);


  return { call, loading };
}