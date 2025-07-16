import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

export const useGetCalls = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const client = useStreamVideoClient();

  const { data: calls, isLoading } = useQuery({
    queryKey: ['calls', user?.id],
    queryFn: async () => {
      if (!client || !user?.id) return null;

      const { calls } = await client.queryCalls({
        sort: [{ field: 'starts_at', direction: -1 }],
        filter_conditions: {
          starts_at: { $exists: true },
          $or: [
            { created_by_user_id: user.id },
            { members: { $in: [user.id] } },
          ],
        },
      });
      console.log("calls", calls);
      return calls;
    },
    enabled: !!client && !!user?.id,
  });

  const now = new Date();

  const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });

  return { endedCalls, upcomingCalls, callRecordings: calls, isLoading };
};