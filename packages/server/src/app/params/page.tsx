import { db } from "common/src/data/db";
import { candlesParams } from "common/src/entities/candlesParams";
import { ParamsPage } from "@/app-pages/ParamsPage/ParamsPage";

export default async function Params() {
    const allParameters = await db.select().from(candlesParams).orderBy(candlesParams.name);

    return (
        <ParamsPage params={allParameters} />
    );
}
