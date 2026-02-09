'use client';

import styles from './HomePage.module.css';

import { getJobsStatus, initJobs, runJobOnce } from '@/jobs/methods';
import { Button, Input, Space } from 'antd';
import cn from 'classnames';
import { Job } from 'common/src/entities/jobs';
import { useEffect, useState } from 'react';

type Props = {
    jobs: Job[];
}

export function HomePage({ jobs: initialJobs }: Props) {
    const [jobs, setJobs] = useState(initialJobs);
    async function handleClick() {
        await initJobs();
    }

    const handleJobClick = (jobId: string) => async () => {
        let copyJobs = [...jobs];
        const jobIndex = copyJobs.findIndex(({ id }) => id === jobId);
        copyJobs[jobIndex].isRunning = true;
        setJobs(copyJobs);

        await runJobOnce(jobId);

        copyJobs = [...jobs];
        copyJobs[jobIndex].isRunning = true;
        setJobs(copyJobs);
    }

    useEffect(() => {
        setInterval(async () => {
            const jobs = await getJobsStatus();
            setJobs(jobs);
        }, 5000);
    }, []);

    return (
        <div>
            <Space vertical={true}>
                {jobs.map((job) => (
                    <div key={job.name} className={cn(styles.job, {
                        [styles.enabled]: job.isEnabled,
                        [styles.isRunning]: job.isRunning,
                    })}>
                        <div>{job.name}</div>
                        <div><Input name='schedule' value={job.schedule} /></div>
                        <div>{job.method}</div>
                        <div>{job.lastRun?.toISOString()}</div>
                        <div>{job.nextRun?.toISOString()}</div>
                        <Button onClick={handleJobClick(job.id)}>Запустить раз</Button>
                    </div>
                ))}
            </Space>
            <div>
                <Button onClick={handleClick}>Запустить</Button>
            </div>
        </div>
    )

}