import {createPortal} from "react-dom";
import React from "react";

type PropsType = {
    isModalOpen: Boolean
    setCookieStudy: (change: String) => void
}

const PermissionModal = (props: PropsType) => {
    const {isModalOpen, setCookieStudy} = props
    if (!isModalOpen) return null

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white px-5 pb-10 pt-5 rounded-lg shadow-lg relative w-1/3">
                <div className="flex flex-col justify-center">
                    <button onClick={() => {setCookieStudy("false")}}
                            className="text-center bg-red-600 text-white font-bold m-auto rounded-xl py-2 px-4 mr-2 mb-2">
                        ✕
                    </button>
                    <div className="text-3xl text-center text-primary font-bold mb-8">
                        Разрешаете ли вы собирать ваши данные нашему проекту?
                    </div>

                    <div className="p-2">
                        <p>
                            Данные требуется для совершенстования возможностей нейронной сети по распознаванию асан.
                            В процессе работы ваши загруженные изображения будут храниться в системе.
                        </p>
                        <br/>
                        <p className="font-bold">Вы можете зарегистрироваться в нашей системе, где также сможете менять настройки, сохранять ли ваши данные.</p>
                    </div>

                    <button onClick={() => {setCookieStudy("true")}}
                            className="t text-center bg-primary text-white font-bold mt-8 w-2/5 m-auto rounded-xl p-2">
                        Разрешить
                    </button>
                    <button onClick={() => {setCookieStudy("false")}}
                            className="t text-center bg-red-600 text-white font-bold mt-4 w-2/5 m-auto rounded-xl p-2">
                        Запретить
                    </button>
                </div>
            </div>
        </div>
        , document.body);
};

export default PermissionModal;