"use client"

import Image from "next/image";
import React, {useEffect, useState} from "react";
import Pose, {PoseType} from "@/components/pose/pose";
import axios from "axios";
import api from "@/api";
import YogaPoseList from "@/components/list-poses";

export default function Home() {
    const [poses, setPoses] = useState([])
    const [page, setPage] = useState(0)
    const [maxPage, setMaxPage] = useState(0)
    const [text, setText] = useState("")

    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER;

    async function fetchData(page_index: number){
        const response = await api.get(`/api/yoga_poses?page=${page_index}&count=200${text != "" ? `&text=${text}` : ""}`);

        let result = await response.data

        setPage(page_index)
        setPoses(result.yoga_poses)
        setMaxPage(result.all_pages)
    }

    useEffect(() => {
        if (page == 0){
            fetchData(1)
        }
    });

    return (
        <div className="min-h-screen flex flex-col w-11/12 m-auto">
            <div className="my-10">
                <div className="text-black text-2xl lg:text-4xl font-bold text-center">
                    Библиотека асан
                </div>
                <div className="flex flex-col mt-10">
                    {
                        poses.length > 0 && (
                            <YogaPoseList yogaPoses={poses} updateList={() => {fetchData(1)}}/>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
