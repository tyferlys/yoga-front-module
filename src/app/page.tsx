"use client"

import Image from "next/image";
import React, {useEffect, useState} from "react";
import Pose, {PoseType} from "@/components/pose/pose";

export default function Home() {
    const [poses, setPoses] = useState([])
    const [page, setPage] = useState(0)
    const [maxPage, setMaxPage] = useState(0)
    const [text, setText] = useState("")

    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER;

    async function fetchData(page_index: number){
        console.log(text)
        const response = await fetch(`http://${hostServer}/api/yoga_poses?page=${page_index}&count=9${text != "" ? `&text=${text}` : ""}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        let result = await response.json()

        setPage(page_index)
        setPoses(result.yoga_poses)
        setMaxPage(result.all_pages)
    }

    useEffect(() => {
        if (page == 0){
            fetchData(1)
        }
    });

    const changePage = (page_index: number)  => {
        if (page_index <= 1) {
            fetchData(1)
        }
        else if (page_index >= maxPage){
            fetchData(maxPage)
        }
        else{
            fetchData(page_index)
        }
    }

    const changeTextFind = (text_find: string) => {
        setText(text_find)
        fetchData(1)
    }

    return (
        <div className="min-h-screen flex flex-col justify-center">
            <div className="w-11/12 m-auto">
                <div className="text-primary text-5xl font-bold">
                    Библиотека асан
                </div>
                <div className="flex flex-col gap-4">
                    <div className="text-primary text-xl">Можете найти асану через поиск</div>
                    <input value={text} onChange={(event) => {changeTextFind(event.target.value)}} type="text" className="bg-light border-b-2 border-black p-2 outline-0" placeholder="Введите название асаны"/>
                    <div className="grid grid-cols-3 gap-4 items-stretch">
                        {
                            poses.map((item: PoseType, i: any) => {
                                return (
                                    <div key={i}><Pose clickable={false} poseData={item}/></div>
                                )
                            })
                        }
                    </div>
                    <div className="flex flex-row items-center gap-2 justify-center">
                        <button
                            className="m-auto mt-4 text-center bg-secondary text-white font-bold w-2/5 rounded-xl p-2"
                            onClick={() => {changePage(page - 1)}}
                        >
                            Предыдущая страница
                        </button>
                        <div className="m-auto mt-4 text-center bg-secondary text-white font-bold w-1/5 rounded-xl p-2">Страница {page}</div>
                        <button
                            className="m-auto mt-4 text-center bg-secondary text-white font-bold w-2/5 rounded-xl p-2"
                            onClick={() => {changePage(page + 1)}}
                        >
                            Следующая страница
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
