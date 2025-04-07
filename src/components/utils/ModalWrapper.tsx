import { ReactNode } from "react";

export default function ModalWrapper({children}:{children: ReactNode}) {
    return (
    <div className={`absolute z-1000 block`} aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={(e)=>e.stopPropagation()}>
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true">
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                {/* Force center alignment with additional properties */}
                <div className="flex min-h-full items-center justify-center p-4 text-center" >
                    <div className="relative transform rounded-lg bg-white text-left shadow-xl transition-all my-auto mx-auto max-w-lg">
                        <div className="flex-col bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg">
                            {children}
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>
    )
}