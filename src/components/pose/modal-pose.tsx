import {useEffect, useState} from "react";
import {PoseType} from "@/components/pose/pose";
import {createPortal} from "react-dom";

type PropsType = {
    isModalOpen: Boolean
    onClose: () => void
    poseData: PoseType
}

const PoseModal = (props: PropsType) => {
    const { isModalOpen, onClose, poseData } = props
    if (!isModalOpen) return null

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" >
            <div className="bg-white px-5 py-10 rounded-lg shadow-lg relative w-1/3">
                <div className="flex flex-col justify-center">
                    <div className="text-3xl text-center text-primary font-bold mb-8">
                        Асана
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2 justify-center">
                            <div className="text-center text-xl">Название на Санскрите</div>
                            <div className="text-center text-xl text-secondary">{poseData.title_sanskrit}</div>
                        </div>
                        <div className="flex flex-col gap-2 justify-center">
                            <div className="text-center text-xl">Название на Транслитерации</div>
                            <div className="text-center text-xl text-secondary">{poseData.title_transliteration}</div>
                        </div>
                        <div className="flex flex-col gap-2 justify-center">
                            <div className="text-center text-xl">Название на Русском</div>
                            <div className="text-center text-xl text-secondary">{poseData.title_russian}</div>
                        </div>
                    </div>

                    <button onClick={onClose} className="t text-center bg-red-600 text-white font-bold mt-8 w-2/5 m-auto rounded-xl p-2">
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    , document.body);
};

export default PoseModal;