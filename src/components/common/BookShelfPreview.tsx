import Link from 'next/link';

import ImageComponent from './ImageComponent';

interface BookShelfPreviewProps {
  imageSrcArr: string[];
  memberId: string;
}

const BookShelfPreview = ({ imageSrcArr, memberId }: BookShelfPreviewProps) => {
  return (
    <Link
      href={`bookshelf?memberId=${memberId}`}
      className='w-[100%] h-[130px] flex justify-evenly items-center bg-gray-400 cursor-pointer xxs:[&>*:nth-child(n+3)]:hidden'
    >
      {imageSrcArr.map((src: string) => {
        return (
          <div key={src} className='xs:last:hidden'>
            <ImageComponent
              lazy={true}
              placeholder=''
              src={src}
              alt='책장 미리보기 속의 책입니다!'
              size='not-feed-small'
            />
          </div>
        );
      })}
    </Link>
  );
};

export default BookShelfPreview;