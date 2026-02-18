'use client';

import styles from './HomePage.module.css';

import { getJobsStatus, initJobs, runJobOnce } from '@/jobs/methods';
import { Button, Checkbox, Input, Space } from 'antd';
import cn from 'classnames';
import { Job } from 'common/src/entities/jobs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { saveJobs } from './actions';
import { QuestionCircleOutlined } from '@ant-design/icons';

type Props = {
    jobs: Job[];
}

export function HomePage({ jobs: initialJobs }: Props) {
    const [jobs, setJobs] = useState(initialJobs);

    const { values, isSubmitting, handleChange, handleSubmit } = useFormik({
        initialValues: {
            jobs: initialJobs,
        },
        onSubmit: async (values) => {
            console.log(values);
            await saveJobs(values.jobs);
        }
    });

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
            <form onSubmit={handleSubmit}>
                <Space vertical={true}>
                    {jobs.map((job, index) => (
                        <div key={job.name} className={cn(styles.job, {
                            [styles.enabled]: job.isEnabled,
                            [styles.isRunning]: job.isRunning,
                        })}>
                            <div>{job.name}</div>
                            <div>
                                <Space.Compact size="large">
                                    <Input name={`jobs[${index}].schedule`} value={values.jobs[index].schedule} onChange={handleChange} />

                                    <Space.Addon>
                                        <a
                                            href={`https://crontab.guru/#${values.jobs[index].schedule.replace(/\s/g, '_')}`}
                                            target={'_blank'}
                                        >
                                            <QuestionCircleOutlined />
                                        </a>
                                    </Space.Addon>
                                </Space.Compact>
                            </div>
                            <div>{job.method}</div>
                            <div>{job.lastRun?.toISOString()}</div>
                            <div>{job.nextRun?.toISOString()}</div>
                            <Checkbox name={`jobs[${index}].isEnabled`} checked={values.jobs[index].isEnabled ?? undefined} onChange={handleChange} />
                            <Space>
                                <Button onClick={handleJobClick(job.id)}>Запустить раз</Button>
                                <Button htmlType="submit" loading={isSubmitting} disabled={isSubmitting}>Сохранить</Button>
                            </Space>
                        </div>
                    ))}
                </Space>
                <div>
                    <Button onClick={handleClick}>Запустить</Button>
                </div>
            </form>
        </div>
    )

}