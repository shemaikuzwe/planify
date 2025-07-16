import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useQuery } from "@tanstack/react-query";

export function useCall(id: string | string[] | undefined) {
  const client = useStreamVideoClient();

  const { data: call, isLoading: loading } = useQuery({
    queryKey: ['call', id],
    queryFn: async () => {
      if (!client || !id) return null;
      
      const { calls } = await client.queryCalls({
        filter_conditions: { id },
      });
      
      if (calls.length > 0) {
        return calls[0];
      }
      
      console.log("no call found for this id");
      return null;
    },
    enabled: !!client && !!id,
  });

  return { call, loading };
}