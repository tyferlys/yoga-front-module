import {createPortal} from "react-dom";
import React from "react";

type PropsType = {
    isModalOpen: Boolean
    changePermission: () => void
    isStudyingAllowed: boolean
    onClose: () => void
}

const OptionsModal = (props: PropsType) => {
    const {isModalOpen, changePermission, isStudyingAllowed, onClose} = props
    if (!isModalOpen) return null

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white pl-10 pr-5 pb-10 pt-5 rounded-lg shadow-lg relative w-1/3">
                <div className="flex flex-col justify-center">
                    <button
                            className="text-center bg-red-600 text-white font-bold m-auto rounded-xl py-2 px-4 mr-2 mb-2"
                            onClick={onClose}
                    >
                        ✕
                    </button>
                    <div className="text-3xl text-center text-primary font-bold mb-8">
                        Настройки аккаунта
                    </div>

                    <div className="flex flex-col justify-center gap-2">
                        <div className="text-2xl text-primary">Разрешение на просмотр статистики</div>
                        <div className="flex flex-row gap-4 items-center">
                            <div className="text-xl underline">{isStudyingAllowed ? 'Разрешено' : 'Не разрешено'}</div>
                            <button
                                className="mt-2 w-1/4 p-1 bg-primary text-white rounded-md"
                                onClick={changePermission}
                            >
                                Изменить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        , document.body);
};

export default OptionsModal;