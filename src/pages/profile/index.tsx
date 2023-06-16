import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';

import { getMyBookShelfApi } from '@/api/bookshelf';
import { getMyProfileApi, getUserProfileApi } from '@/api/profile';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';
import BottomNav from '@/components/common/BottomNav';
import ProfileLayout from '@/layout/ProfileLayout';
import { NextPageWithLayout } from '@/types/layout';

const ProfilePage: NextPageWithLayout = () => {
  const router = useRouter();
  const [edit, setEdit] = useState(false);

  const { data: myBookShelfDatas, status: myBoosShelfStatus } = useQuery(
    ['getMyBookShelf', 'profile'],
    () => getMyBookShelfApi(),
  );

  const { data: getMyProfile } = useQuery(['getMyProfile', 'profile'], () =>
    getMyProfileApi(),
  );

  return (
    <AuthRequiredPage>
      {myBoosShelfStatus === 'success' && (
        <>
          <div className='flex items-center justify-between px-6 py-0 h-14'>
            <span className='text-[15px] text-[#707070]'>
              전체{' '}
              <span className='text-[15px] text-[#67a68a]'>
                {myBookShelfDatas.length}
              </span>
              권
            </span>
            {getMyProfile?.isMine && (
              <span
                className='text-[15px] text-[#333333]'
                onClick={() => setEdit((prev) => !prev)}
              >
                {edit ? '완료' : '편집'}
              </span>
            )}
          </div>
          <section className='grid grid-cols-[repeat(3,1fr)] px-4 py-0'>
            {myBookShelfDatas.map((data) => (
              <article
                className='relative flex flex-col items-center mb-4'
                key={data.bookIsbn}
              >
                {edit && (
                  <div className='absolute flex items-center justify-center w-4 h-4 text-[4px] bg-[#707070] rounded-[50%] right-0.5'>
                    X
                  </div>
                )}

                <section className='w-full shadow-[0px_4px_8px_rgba(0,0,0,0.15)] mb-4 p-[7px]'>
                  <Image
                    src={data.thumbnail}
                    alt={data.title}
                    width='0'
                    height='0'
                    sizes='100vw'
                    className='w-full h-[9.5rem]  rounded-[0px_3px_3px_0px] shadow-[0px_0px_7px_rgba(0, 0, 0, 0.25)]'
                  />
                </section>
                <div className='flex flex-col items-center w-full'>
                  <h3 className='text-[13px] text-[#333333] mb-[5px]'>
                    {data.title}
                  </h3>
                  <h4 className='text-[11px] text-[#707070]'>
                    {data.authors[0]}
                  </h4>
                </div>
              </article>
            ))}
          </section>
          <BottomNav />
        </>
      )}
    </AuthRequiredPage>
  );
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const queryClient = new QueryClient();

  if (context.query.isbn) {
    await queryClient.prefetchQuery(['getUserProfile', 'profile'], () =>
      getUserProfileApi(context.query.isbn as string),
    );
  } else {
    await Promise.all([
      queryClient.prefetchQuery(['getMyProfile', 'profile'], () =>
        getMyProfileApi(),
      ),
      queryClient.prefetchQuery(['getMyBookShelf', 'profile'], () =>
        getMyBookShelfApi(),
      ),
    ]);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default ProfilePage;
