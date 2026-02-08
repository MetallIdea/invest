'use client';

import { initJobs, runJobOnce } from '@/jobs/methods';
import { Button, Input } from 'antd';
import { Job } from 'common/src/entities/jobs';

type Props = {
    jobs: Job[];
}

export function HomePage({ jobs }: Props) {
    async function handleClick() {
        await initJobs();
    }
    const handleJobClick = (jobId: string) => async () => {
        runJobOnce(jobId);
    }

    return (
        <div>
            <div>
                {jobs.map((job) => (<div key={job.name}>
                    <div>{job.name}</div>
                    <div><Input name='schedule' value={job.schedule} /></div>
                    <div>{job.method}</div>
                    <div>{job.lastRun?.toISOString()}</div>
                    <div>{job.nextRun?.toISOString()}</div>
                    <Button onClick={handleJobClick(job.id)}>Запустить раз</Button>
                </div>))}
            </div>
            <div>
                <Button onClick={handleClick}>Запустить</Button>
            </div>
        </div>
    )

}