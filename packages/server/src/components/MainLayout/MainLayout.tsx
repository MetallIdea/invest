'use client';

import { useAppSelector } from "@/state/store";
import { memo, PropsWithChildren } from "react";
import { Menu } from "../menu/Menu";

type Props = PropsWithChildren;

export const MainLayout = memo(({ children }: Props) => {
    const { user, isMobile } = useAppSelector(state => state.common);

    return (
        <div>
            {user && (<div>{user.login}</div>)}
            {children}
            {
                isMobile ? <Menu /> : null
            }
        </div>
    )
});