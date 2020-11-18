import { PodItem, FetchPodsProps, FetchPodsResponse } from '@/src/webApi/pods';
import { useEffect, useState } from 'react';

export interface UsePodsProps {
  fetchPods(params: FetchPodsProps): Promise<FetchPodsResponse>;
  needPolling?: boolean;
  polllingInterval?: number;
  fillters?: Record<string, string>;
}

export function usePods({ fetchPods, fillters, needPolling = false, polllingInterval = 10000 }: UsePodsProps) {
  const [continueMap, setContinueMap] = useState<{
    [key: number]: string;
  }>({});
  const [pods, setPods] = useState<PodItem[]>([]);

  const [currentContinue, setCurrentContinue] = useState<string | undefined>();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [podCount, setPodCount] = useState(Infinity);

  useEffect(() => {
    async function getPodsAndAnother() {
      try {
        const continueStr = pageIndex === 1 ? undefined : continueMap[pageIndex] || currentContinue;
        setContinueMap({
          ...continueMap,
          [pageIndex]: continueStr
        });
        const { items, metadata } = await fetchPods({
          limit: pageSize,
          continueStr,
          fillters
        });

        if (!metadata.continue) {
          setPodCount((pageIndex - 1) * pageSize + items.length);
        }

        setPods(items);
        setCurrentContinue(metadata.continue);
      } catch (error) {
        console.log(error);
      }
    }

    getPodsAndAnother();

    if (needPolling) {
      const timer = setInterval(getPodsAndAnother, polllingInterval);

      return () => clearInterval(timer);
    }
  }, [pageSize, pageIndex, needPolling, polllingInterval, fillters, fetchPods]);

  function changePageSize(newPageSize) {
    if (newPageSize === pageSize) return;

    setContinueMap({});
    setPageSize(newPageSize);
  }

  function changePageIndex(newPageIndex) {
    setPageIndex(newPageIndex);
  }

  return { pods, changePageIndex, changePageSize, pageIndex, pageSize, podCount };
}
