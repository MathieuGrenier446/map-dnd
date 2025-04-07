import { ReactNode } from "react";

export default function ModalWrapper({children}:{children: ReactNode}) {
    return (
    <div className={`absolute z-1000 block`} aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={(e)=>e.stopPropagation()}>
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true">
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 ">
                        <div className="flex-col bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-full m-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>
    )
}