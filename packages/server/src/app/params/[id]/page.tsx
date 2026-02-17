import { db } from "common/src/data/db";
import { eq } from "drizzle-orm";
import { candlesParams } from "common/src/entities/candlesParams";
import { ParamsForm } from "@/app-pages/ParamsForm/ParamsForm";

export default async function ParamsFormPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const [param] = id !== 'new' ? await db.select().from(candlesParams).where(eq(candlesParams.id, id)) : [];

    return (
        <ParamsForm item={param} />
    );
}
