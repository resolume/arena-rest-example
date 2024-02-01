import React, { FC, ReactNode } from 'react'
import './modal.css'

interface ModalProperties {
    width: number,
    height: number,
    title: string,
    onClose?: () => void
    children: ReactNode,
}

const Modal: FC<ModalProperties> = ({ width, height, title, onClose, children }) => {
    return (
        <>
            <div className="overlay"></div>
            <div className="modal" style={{width: `${width}px`, height: `${height}px`}}>
                <div className="title">{title}</div>
                <div className="close" onClick={() => onClose?.()}>X</div>
                {children}
            </div>
        </>
    )
};

export default Modal;
