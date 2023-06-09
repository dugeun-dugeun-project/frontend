import { useInfiniteQuery } from '@tanstack/react-query';
import React, { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { fetchRecord } from '@/api/record';
import useRememberScroll from '@/hooks/useRememberScroll';

import FeedItem from './FeedItem';

const RecordFeedList = () => {
  const {
    data: mainFeedData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['feed', 'mainFeed'],
    ({ pageParam = Number.MAX_SAFE_INTEGER }) => fetchRecord(pageParam, 5),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.lastId) return;
        return lastPage.lastId;
      },
      staleTime: 1000 * 60 * 5,
    },
  );

  const [ref, inView] = useInView();
  const { currentScroll, resetScroll } = useRememberScroll('mainFeed');

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (currentScroll) {
      window.scrollTo(0, Number(currentScroll));
      resetScroll();
    }
  }, [currentScroll, resetScroll]);

  if (isError) return <></>;
  if (isLoading) return <></>;

  const mainFeedList = mainFeedData.pages.flatMap(
    (feedList) => feedList.records,
  );

  return (
    <ul className='mx-5'>
      {mainFeedList.map((feed) => (
        <Fragment key={feed.recordId}>
          <FeedItem {...feed} />
        </Fragment>
      ))}
      <div ref={ref} className='h-4 '></div>
    </ul>
  );
};

export default RecordFeedList;
