import React, { FC, useEffect, useState } from 'react'
import Modal from './modal'
import './select_thumbnail.css'

interface SelectThumbnailProperties {
    title: string,
    onCancel: () => void,
    onFile: (file:File) => void,
}

const SelectThumbnail: FC<SelectThumbnailProperties> = ({ title, onCancel, onFile }) => {
    const [ file, setFile ] = useState<File|null>(null);
    const [ url, setUrl ] = useState<string|null>(null);

    useEffect(() => {
        let reader:FileReader|null = null;
        let cancelled = false;

        if (file) {
            reader = new FileReader();

            reader.onload = (e) => {
                if (e.target && e.target.result && !cancelled) {
                    setUrl((e.target.result) as string);
                }
            };

            reader.readAsDataURL(file);
        }

        return () => {
            cancelled = true;

            if (reader && reader.readyState === 1)
                reader.abort();
        };
    }, [file]);

    const cancel = () => {
        setFile(null);
        onCancel();
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files)
            return;

        setFile(e.target.files[0]);
    };

    return (
        <Modal width={250} height={200} title={title} onClose={cancel}>
            {!file &&
                <div className="select_thumbnail">
                    <label>
                        📂
                        <input type="file" onChange={onChange} accept="image/*" />
                    </label>
                    <br />
                    <button onClick={cancel}>Cancel</button>
                </div>
            }
            {file && url &&
                <div className="select_thumbnail">
                    <img src={url} alt="upload preview" />
                    <br />
                    <button onClick={() => onFile(file)}>OK</button>
                    <button onClick={cancel}>Cancel</button>
                </div>
            }
        </Modal>
    )
};

export default SelectThumbnail;
