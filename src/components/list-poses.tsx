
import Pose, {PoseType} from "@/components/pose/pose";
import {useState} from "react";

type Props = {
    yogaPoses: PoseType[];
    updateList: () => void;
};

export default function YogaPoseList({ yogaPoses, updateList}: Props) {
    const groupedPoses = yogaPoses.reduce<Record<string, PoseType[]>>((acc, pose) => {
        const firstLetter = pose.title_russian.charAt(0).toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(pose);
        return acc;
    }, {});
    const sortedLetters = Object.keys(groupedPoses).sort();

    const [openGroups, setOpenGroups] = useState<string | null>("А");

    const toggleGroup = (letter: string) => {
        setOpenGroups(letter);
    };
    console.log(groupedPoses)
    return (
        <div className="flex flex-col gap-10 w-11/12 m-auto">
            <div className="flex flex-row flex-wrap gap-6 justify-between">
                {sortedLetters.map(letter => (
                    <div key={letter} className="mb-2">
                        <button
                            className="text-xl font-bold text-black underline"
                            onClick={() => toggleGroup(letter)}
                        >
                            {letter}
                        </button>
                    </div>
                ))}
            </div>
            <div className="text-3xl font-bold text-center bm-5">
                Найденные асаны:
            </div>
            <div className="flex flex-col items-center lg:flex-row  lg:items-stretch justify-around flex-wrap gap-4 cursor-pointer">
                {openGroups && groupedPoses[openGroups]?.map((pose, index: number) => (
                    <div key={index} className="w-full lg:w-1/3">
                        <Pose poseData={pose} clickable={true} updateList={updateList}/>
                    </div>
                ))}
            </div>
        </div>
    );
}