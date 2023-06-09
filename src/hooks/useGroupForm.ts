import { useState } from 'react';

import {
  GroupFormChangeStateObjProps,
  GroupFormStateObjProps,
} from '@/types/recruit';

export const useGroupForm = (classData: GroupFormStateObjProps) => {
  const {
    className: relayedClassName,
    classType: relayedClassType,
    classRegion: relayedClassRegion,
    classDescription: relayedClassDescription,
    classDay: relayedClassDay,
    classTime: relayedClassTime,
    classPeopleNumber: relayedClassPeopleNumber,
    classKakaoLink: relayedClassKakaoLink,
  } = classData;

  const [className, setClassName] = useState(relayedClassName);
  const [classType, setClassType] = useState(relayedClassType);
  const [classRegion, setClassRegion] = useState(relayedClassRegion);
  const [classDescription, setClassDescription] = useState(
    relayedClassDescription,
  );
  const [classDay, setClassDay] = useState(relayedClassDay);
  const [classTime, setClassTime] = useState(relayedClassTime);
  const [classPeopleNumber, setClassPeopleNumber] = useState(
    relayedClassPeopleNumber,
  );
  const [classKakaoLink, setClassKakaoLink] = useState(relayedClassKakaoLink);

  const classStateObj: GroupFormStateObjProps = {
    className,
    classType,
    classRegion: classType === 'offline' ? classRegion : 'not region data',
    classDescription,
    classDay,
    classTime,
    classPeopleNumber,
    classKakaoLink,
  };

  const classChangeStateObj: GroupFormChangeStateObjProps = {
    changeClassName: (e) => {
      setClassName(e.target.value);
    },
    changeClassType: (type) => {
      if (type === 'online') setClassType('online');
      else setClassType('offline');
    },
    changeClassRegion: (e) => {
      const selectedItem = e.target as HTMLUListElement;
      selectedItem.textContent && setClassRegion(selectedItem.textContent);
    },
    changeClassDescription: (e) => {
      setClassDescription(e.target.value);
    },
    changeClassDay: (e) => {
      const selectedItem = e.target as HTMLUListElement;
      selectedItem.textContent && setClassDay(selectedItem.textContent);
    },
    changeClassTime: (e) => {
      const selectedItem = e.target as HTMLUListElement;
      selectedItem.textContent && setClassTime(selectedItem.textContent);
    },
    changeClassPeopleNumber: (e) => {
      setClassPeopleNumber(e.target.value);
    },
    changeClassKakaoLink: (e) => {
      setClassKakaoLink(e.target.value);
    },
  };

  return { classStateObj, classChangeStateObj } as const;
};
