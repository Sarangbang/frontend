'use client';

import ChallengeCard from './ChallengeCard';

const PopularChallengeSection = () => (
    <div className="p-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">인기Challenge 🔥</h2>
            <button className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">전체보기</button>
        </div>
        <div className="flex flex-wrap -m-2">
            <ChallengeCard image="/images/charactors/image 22.png" location="용인시/중동" title="책..읽읍시다" progress="4/10" />
            <ChallengeCard image="/images/charactors/image 23.png" location="성남시/정자동" title="6시기상챌린지" progress="2/5" />
        </div>
    </div>
);

export default PopularChallengeSection; 