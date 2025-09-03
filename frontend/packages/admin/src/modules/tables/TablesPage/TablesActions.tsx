import { observer } from "mobx-react-lite";
import { Link } from "react-router";

export const TablesActions = observer(() => {
    return (
        <div>
            <Link to="/tables/new">Создать</Link>
        </div>
    )
});