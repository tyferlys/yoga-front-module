'use client'

import React, {useState} from "react";
import PoseModal from "@/components/pose/modal-pose";

export type PoseType = {
    id: Number
    title_sanskrit: String
    title_transliteration: String
    title_russian: String
}

type PropsType = {
    poseData: PoseType
    clickable: boolean
}

const Pose = (props: PropsType) => {
    const { poseData, clickable } = props
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <PoseModal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} poseData={poseData}/>
            <div className="p-4 bg-[#9305F2] rounded-xl w-3/3 flex flex-col gap-2 cursor-pointer"  onClick={() => setIsModalOpen(true)}>
                <div className="text-white text-center font-bold">
                    {poseData.title_russian}
                </div>
                {
                    clickable && (
                        <div className="flex flex-row justify-center">
                            <div className="text-white text-sm">
                                Посмотреть подробнее
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Pose