import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSetRecoilState } from 'recoil';

import { patchReadingClassChange } from '@/api/recruit';
import { selectRecruitStatusAtom } from '@/recoil/modal';
import { GroupList } from '@/types/recruit';

interface RecruitmentModalType {
  groupId: number;
  recruitmentStatus: boolean;
}

const BackDrop = () => {
  const setModal = useSetRecoilState(selectRecruitStatusAtom);
  return (
    <div
      className='fixed w-full max-w-xl h-screen z-20 bg-[rgba(0,0,0,0.6)] top-0 mx-auto'
      onClick={() => setModal(false)}
    />
  );
};

const ModalOverlay = ({ groupId, recruitmentStatus }: RecruitmentModalType) => {
  const setModal = useSetRecoilState(selectRecruitStatusAtom);
  const queryClient = useQueryClient();

  const { mutate: updateRecruitmentStatus } = useMutation(
    patchReadingClassChange,
    {
      onMutate: async ({ groupData }) => {
        const oldData: GroupList | undefined = queryClient.getQueryData([
          'recruitDetail',
          String(groupId),
        ]);

        await queryClient.cancelQueries(['recruitDetail', String(groupId)]);

        if ('recruitment_status' in groupData) {
          queryClient.setQueryData(['recruitDetail', String(groupId)], {
            ...oldData,
            recruitment_status: groupData.recruitment_status,
          });
        }

        setModal(false);
        return () =>
          queryClient.setQueryData(['recruitDetail', String(groupId)], oldData);
      },
      onError: (error, variable, rollback) => {
        if (rollback) return rollback();
      },
    },
  );

  const handleChangeRecruitmentStatus = (
    groupId: number,
    recruitmentStatus: boolean,
    type: boolean,
  ) => {
    if (type === recruitmentStatus) return;

    updateRecruitmentStatus({
      groupId,
      groupData: {
        recruitment_status: !recruitmentStatus,
      },
    });
  };

  const recruitmentStatusList = [
    {
      type: true,
      title: '모집중',
    },
    {
      type: false,
      title: '모집완료',
    },
  ];

  const changeRecruitmentStatusComponent = (
    groupId: number,
    recruitmentStatus: boolean,
  ) => {
    return recruitmentStatusList.map(({ type, title }) => (
      <button
        key={title}
        onClick={() =>
          handleChangeRecruitmentStatus(groupId, recruitmentStatus, type)
        }
        className={`flex justify-center items-center h-14 w-full text-clampLg ${
          recruitmentStatus === type ? 'text-main' : 'text-black'
        }`}
      >
        {title}
      </button>
    ));
  };

  return (
    <>
      <div className='fixed left-0 right-0 w-5/6 max-w-lg bg-[#F3F3F3] h-40 z-30 rounded-2xl bottom-24 animate-slideUp mx-auto'>
        <div className='flex flex-col items-center justify-center divide-y'>
          <p className='h-11 flex justify-center items-center text-[#707070] text-clamSm'>
            상태 변경
          </p>
          {changeRecruitmentStatusComponent(groupId, recruitmentStatus)}
        </div>
      </div>
      <button
        onClick={() => setModal(false)}
        className='fixed left-0 right-0 z-30 w-5/6 max-w-lg mx-auto bg-white h-14 rounded-2xl bottom-8 text-clampLg text-main animate-slideUp'
      >
        닫기
      </button>
    </>
  );
};

const RecruitStatusSelectModal = ({
  groupId,
  recruitmentStatus,
}: RecruitmentModalType) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  const element =
    typeof window !== 'undefined' && document.getElementById('portal');

  return mounted && element ? (
    <>
      {ReactDOM.createPortal(<BackDrop />, element)}
      {ReactDOM.createPortal(
        <ModalOverlay
          recruitmentStatus={recruitmentStatus}
          groupId={groupId}
        />,
        element,
      )}
    </>
  ) : null;
};

export default RecruitStatusSelectModal;
