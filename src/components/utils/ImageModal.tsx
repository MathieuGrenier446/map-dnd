import { Dispatch, SetStateAction } from "react";
import ModalWrapper from "./ModalWrapper";

export default function ImageModal({imgSrc, setShowModal}:{imgSrc: string, setShowModal: Dispatch<SetStateAction<boolean>>}) {
    return (
        <ModalWrapper>
            <div className="relative">
                <button 
                onClick={(e)=>{
                    e.stopPropagation()
                    setShowModal(false)
                }}
                className="absolute top-0 right-0 px-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                title="Clear selection"
                >
                ✕
                </button>
                <img 
                    src={imgSrc} 
                    alt="Preview" 
                    className="max-w-xs max-h-64 object-contain outline-3 hover:outline-green-300 rounded active:outline-green-300"
                    height={256}
                    width={256}
                />
            </div>
            
        </ModalWrapper>
    )
}