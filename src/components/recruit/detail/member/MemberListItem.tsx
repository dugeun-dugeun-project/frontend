import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useRecoilState } from 'recoil';

import { deleteGroupMember } from '@/api/recruit';
import Avatar from '@/components/common/Avartar';
import Modal from '@/components/common/Modal';
import { modalStateAtom } from '@/recoil/modal';
import { UserGroup } from '@/types/recruit';

type MemberListProps = Pick<
  UserGroup,
  'photoUrl' | 'nickname' | 'userInfo' | 'userId'
> & {
  groupId: string;
  groupLeader: boolean;
  groupLeaderId: string;
};

const MemberListItem = ({
  photoUrl,
  nickname,
  userInfo,
  userId,
  groupId,
  groupLeader,
  groupLeaderId,
}: MemberListProps) => {
  const checkGroupReader = groupLeaderId === userId;
  const [modal, setModal] = useRecoilState(modalStateAtom);
  const { mutate: kickOutMember } = useMutation(deleteGroupMember);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleKickOutMember = (groupId: string, userId: string) => {
    kickOutMember(
      { groupId, userId },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['recruitDetail']);
          router.push({
            pathname: 'recruit/detail',
            query: {
              groupId,
            },
          });
        },
      },
    );
  };

  const groupKickOutModal = (
    <div className='flex flex-col items-center justify-center'>
      <h3 className='text-xl font-bold'>
        정말 {nickname}님을
        <br /> 강퇴 하시겠어요?
      </h3>
      <p className='pb-7'>더 이상 {nickname}님과 모임에서 함께 할 수 없어요</p>
      <div>
        <button
          onClick={() => setModal({ type: 'HIDDEN' })}
          className='w-36 h-12 bg-[#F3F3F3] rounded-lg mr-3 text-[#333333]'
        >
          취소
        </button>
        <button
          onClick={() => handleKickOutMember(groupId, userId)}
          className='w-36 h-12 bg-[#F05050] rounded-lg text-white'
        >
          강퇴
        </button>
      </div>
    </div>
  );

  return (
    <li className='flex items-center justify-between'>
      <Link href={`/profile?userId=${userId}`} className='flex pb-4'>
        <Avatar
          src={photoUrl}
          shape='circle'
          placeholder=''
          lazy={false}
          alt='멤버 프로필 이미지'
          width='w-[50px]'
          height='h-[50px]'
        />
        <div className='flex flex-col justify-center pl-3'>
          <h3 className='text-sm font-bold'>{nickname}</h3>
          <p className='text-[#999797]'>{userInfo}</p>
        </div>
      </Link>
      {groupLeader && !checkGroupReader && (
        <button
          onClick={() => setModal({ type: 'KICKOUT' })}
          className='w-14 h-8 border border-[#EBEAEA] rounded-md text-xs font-semibold'
        >
          강퇴
        </button>
      )}
      {modal.type === 'KICKOUT' && <Modal>{groupKickOutModal}</Modal>}
    </li>
  );
};

export default MemberListItem;
