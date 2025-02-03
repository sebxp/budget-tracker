// components/ConfirmDialog.tsx

import styles from '../styles/ConfirmDialog.module.css';

interface ConfirmDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({ message, onConfirm, onCancel }: ConfirmDialogProps) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <p>{message}</p>
                <div className={styles.buttonGroup}>
                    <button onClick={onConfirm} className={styles.confirmButton}>Confirm</button>
                    <button onClick={onCancel} className={styles.cancelButton}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;