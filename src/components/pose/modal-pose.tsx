import React, {useEffect, useState} from "react";
import {PoseType} from "@/components/pose/pose";
import {createPortal} from "react-dom";
import api from "@/api";
import {toast, ToastContainer} from "react-toastify";

type PropsType = {
    isModalOpen: Boolean
    onClose: () => void
    poseDataSource: PoseType
}

const PoseModal = (props: PropsType) => {
    const { isModalOpen, onClose, poseDataSource } = props
    const [isAdmin, setIsAdmin] = useState(null)

    const [poseData, setPoseData] = useState<PoseType>(poseDataSource)
    const [titleSanskrit, setTitleSanskrit] = useState<string>(props.poseDataSource.title_sanskrit)
    const [titleTransliteration, setTitleTransliteration] = useState<string>(props.poseDataSource.title_transliteration)
    const [titleRussian, setTitleRussian] = useState<string>(props.poseDataSource.title_russian)
    const [isEdit, setIsEdit] = useState(false)
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [indexSlider, setIndexSlider] = useState(0)


    const checkAdmin = async () => {
        const res = await api.get(`/api/users/me`);
        const data = res.data

        setIsAdmin(data.is_admin)
    }

    const putYogaPose = async () => {
        const result = await api.put(`api/yoga_poses/${poseData.id}`, {
            title_sanskrit: titleSanskrit,
            title_transliteration: titleTransliteration,
            title_russian: titleRussian
        })

        if (result.status == 200){
            toast.success("Изменения успешно применены")
        }
    }

    useEffect(() => {
        checkAdmin()
    }, [])

    const toggleEdit = async () => {
        if (isEdit){
            await putYogaPose()
        }
        setIsEdit(!isEdit)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                if (reader.result) {
                    setBase64Image(reader.result.toString());
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const saveImage = async () => {
        if (base64Image != null){
            const result = await api.patch(`api/yoga_poses/${poseData.id}`, {
                images: [base64Image]
            })
            if (result.status == 200){
                toast.success("Изображение добавлено")
                setPoseData({...result.data})
            }
        }
        else{
            toast.error("Выберите для начала изображение")
        }
    }

    const changeIndexSlider = (position: number) => {
        if (position == 0){
            setIndexSlider(indexSlider - 1 > 0 ? indexSlider - 1 : 0)
        }
        else{
            console.log(poseData.images.length / 4 )
            setIndexSlider(indexSlider + 1 >  Math.floor(poseData.images.length / 4) ? indexSlider : indexSlider + 1)
        }
        console.log(indexSlider)
    }

    return createPortal(
       <>
           <ToastContainer position="bottom-right" autoClose={3000} />
           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
               <div className="bg-white px-5 py-10 rounded-lg shadow-lg relative w-2/3">
                   <div className="flex flex-col justify-center">
                       <div className="text-3xl text-center text-black font-bold mb-8 ">
                           Асана
                       </div>

                       <div className="flex flex-row w-11/12 m-auto">
                           <div className="w-1/2 ">
                               <div className="text-xl mb-4">Описание асаны</div>
                           </div>
                           <div className="w-1/2 ">
                               <div className="text-xl mb-4">Галерея</div>
                           </div>
                       </div>

                       <div className="flex flex-row items-center w-11/12 m-auto">
                           <div className="w-1/2 ">
                               <div className="flex flex-col gap-5">
                                   <div className="flex flex-col gap-1">
                                       <div className="text-lg">Название на Санскрите</div>
                                       <input
                                           onChange={(event) => {setTitleSanskrit(event.target.value)}}
                                           className={`w-1/2 text-lg text-secondary bg-white ${isEdit?"border-black border-b-2 outline-none":""}`}
                                           disabled={!isEdit}
                                           value={titleSanskrit}
                                       />
                                   </div>
                                   <div className="flex flex-col gap-1">
                                       <div className="text-lg">Название на Транслитерации</div>
                                       <input
                                           onChange={(event) => {setTitleTransliteration(event.target.value)}}
                                           className={`w-1/2 text-lg text-secondary bg-white ${isEdit?"border-black border-b-2 outline-none":""}`}
                                           disabled={!isEdit}
                                           value={titleTransliteration}
                                       />
                                   </div>
                                   <div className="flex flex-col gap-1">
                                       <div className="text-lg">Название на Русском</div>
                                       <input
                                           onChange={(event) => {setTitleRussian(event.target.value)}}
                                           className={`w-1/2 text-lg text-secondary bg-white ${isEdit?"border-black border-b-2 outline-none":""}`}
                                           disabled={!isEdit} value={titleRussian}
                                       />
                                   </div>
                               </div>
                           </div>
                           <div className="w-1/2 text-xl">
                               <div className="flex flex-row gap-5 items-center justify-center">
                                   {
                                       poseData.images.length > 0 ?
                                           (
                                               <div className="scale-150 cursor-pointer" onClick={() => {changeIndexSlider(0)}}>
                                                   ←
                                               </div>
                                           ) :
                                           (
                                               ""
                                           )
                                   }

                                   <div className={`grid ${poseData.images.length > 0 ? "grid-cols-2" : "grid-cols-1"}  gap-2`}>
                                       {
                                           poseData.images.length > 0 ?
                                               (
                                                   poseData.images.slice(indexSlider * 4, indexSlider * 4 + 4).map((imageData, index: number) => (
                                                       <img
                                                           key={index}
                                                           src={imageData.image}
                                                           alt="Image"
                                                           style={{width: "80%", objectFit: "cover"}}
                                                           className="rounded-xl m-auto"
                                                       />
                                                   ))
                                               ) :
                                               (
                                                   <div className="underline">
                                                       Изображений нет
                                                   </div>
                                               )
                                       }
                                   </div>
                                   {
                                       poseData.images.length > 0 ?
                                           (
                                               <div className="scale-150 cursor-pointer" onClick={() => {changeIndexSlider(1)}}>
                                                   →
                                               </div>
                                           ) :
                                           (
                                               ""
                                           )
                                   }
                               </div>
                           </div>
                       </div>

                       <div className="w-11/12 m-auto flex flex-row mt-10">
                           <div className="w-1/2 flex flex-row justify-start gap-5 ">
                               {
                                   isAdmin && (
                                       <button className="w-1/3 text-center bg-black text-white font-bold rounded-xl p-2" onClick={() => {toggleEdit()}}>
                                           {isEdit?"Сохранить": "Редактировать"}
                                       </button>
                                   )
                               }
                               <button onClick={onClose} className="w-1/3 text-center bg-red-600 text-white font-bold rounded-xl p-2">
                                   Закрыть
                               </button>
                           </div>
                           <div className="w-1/2 flex flex-row gap-4 items-center justify-start">
                               {
                                   isAdmin && (
                                       <>
                                           <button className="w-1/2 text-center bg-black text-white font-bold rounded-xl p-2" onClick={() => {saveImage()}}>
                                               Сохранить изображение
                                           </button>
                                           <input type="file" accept="image/*" onChange={handleFileChange} />
                                       </>
                                   )
                               }
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </>
    , document.body);
};

export default PoseModal;