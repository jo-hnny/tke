import { PodItem, FetchPodsProps, FetchPodsResponse } from '@/src/webApi/pods';
import { useEffect, useState } from 'react';

export interface UsePodsProps {
  fetchPods(params: FetchPodsProps): Promise<FetchPodsResponse>;
  needPolling?: boolean;
  polllingInterval?: number;
  fillters?: Record<string, string>;
}

export function usePods({ fetchPods, fillters = {}, needPolling = false, polllingInterval = 5000 }: UsePodsProps) {
  const [continueMap, setContinueMap] = useState<{
    [key: number]: string;
  }>({});
  const [pods, setPods] = useState<PodItem[]>([]);
  const [podCount, setPodCount] = useState(0);
  const [currentContinue, setCurrentContinue] = useState<string | undefined>();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    async function getPodsAndAnother() {
      const continueStr = continueMap[pageIndex] || currentContinue;
      setContinueMap({
        ...continueMap,
        [pageIndex]: continueStr
      });
      const { items, metadata, remaingingItemCount = 0 } = await fetchPods({ limit: pageSize, continueStr, fillters });
      setPods(items);
      setCurrentContinue(metadata.continue);
      setPodCount(items.length + remaingingItemCount);
    }

    if (needPolling) {
      const timer = setInterval(getPodsAndAnother, polllingInterval);

      return () => clearInterval(timer);
    } else {
      getPodsAndAnother();
    }
  }, [pageSize, pageIndex, needPolling, polllingInterval, fillters]);

  return { pods, podCount, setPageIndex, setPageSize };
}
