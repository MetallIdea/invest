import { ReactNode } from "react";

import styles from './BaseCard.module.css';
import cn from "classnames";

type Props = {
    className?: string;
    title?: ReactNode;
    rightTitle?: ReactNode;
    onIntersection?: () => void;
    items?: {
        label?: ReactNode;
        value?: ReactNode;
    }[]
}

export const BaseCard = ({ className, title, rightTitle, items }: Props) => {
    return (
        <div className={cn(styles.root, className)}>
            <div className={styles.title}>
                {title}
                {rightTitle ? <div>{rightTitle}</div> : null}
            </div>
            <div className={styles.items}>
                {
                    items?.map((item, index) => (
                        <div className={styles.item} key={index}>
                            {
                                item.label ? (
                                    <div className={styles.label}>
                                        {item.label}
                                    </div>
                                ) : null
                            }
                            <div>
                                {item.value}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}