import { Dialog } from 'primereact/Dialog';
import { useTemplatesPageContext } from '../TemplatesPageState';
import { useRef } from 'react';
import { observer } from 'mobx-react-lite';

export const ExportModal = observer(() => {
    const pageState = useTemplatesPageContext();

    const fileRef = useRef<HTMLInputElement>(null);

    const handleHide = () => {
        pageState.setIsExportVisible(false);
    }

    const handleChange = (e: any) => {
        pageState.exportFile(e.target.files[0]);
    }

    if (!pageState.isExportVisible) {
        return null;
    }

    return (
        <Dialog visible={true} onHide={handleHide}>
            <input ref={fileRef} type="file" onChange={handleChange} />
        </Dialog>
    )
});