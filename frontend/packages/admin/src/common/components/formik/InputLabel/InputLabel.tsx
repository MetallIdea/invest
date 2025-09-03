import { FloatLabel } from "primereact/floatlabel";
import type { PropsWithChildren } from "react";
import styles from './InputLabel.module.css';

type Props = {
    id: string;
    label: string;
} & PropsWithChildren;

export function InputLabel({ id, label, children }: Props) {
    return (
        <div className={styles.self}>
            <FloatLabel>
                {children}
                <label htmlFor={id}>{label}</label>
            </FloatLabel>
        </div>
    )
}