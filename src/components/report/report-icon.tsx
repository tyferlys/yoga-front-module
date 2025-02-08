import {useState} from "react";
import ReportModal from "@/components/report/modal-report";
import {toast, ToastContainer} from "react-toastify";
export default function ReportIcon() {
    const [open, setOpen] = useState(false);
    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER;

    const sendRequest = async (text: string | null) => {
        setOpen(false)

        if (text != null){
            const response = await fetch(`http://${hostServer}/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
                credentials: 'include',
            });

            let result = await response.json()
            if (response.status === 200) {
                toast.success("Сообщение об ошибке отправлено.", { position: "bottom-right" })
            }
        }
    }

    return (
        <>
            <ReportModal isModalOpen={open} sendRequest={sendRequest}/>
            <ToastContainer position="bottom-right" autoClose={3000} />
            <div className="fixed bottom-10 right-10">
                <button
                    onClick={() => setOpen(!open)}
                    className="p-3 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition flex items-center justify-center font-bold"
                >
                    Нашли ошибку?
                </button>
            </div>
        </>
    );
}
