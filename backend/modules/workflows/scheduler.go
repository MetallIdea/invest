package workflows

import (
	"fmt"
	"time"

	"github.com/go-co-op/gocron/v2"
)

func RunScheduler() gocron.Scheduler {
	// create a scheduler
	s, err := gocron.NewScheduler()
	if err != nil {
		// handle error
	}

	// add a job to the scheduler
	j, err := s.NewJob(
		gocron.DurationJob(
			60*time.Minute,
		),
		gocron.NewTask(
			func() {
				fmt.Println("Search workflows")
				ActionGetAllBonds()
				
				ActionGetAllCandles()
			},
		),
	)
	if err != nil {
		// handle error
	}
	// each job has a unique id
	fmt.Println("Scheduler run id: ", j.ID())

	// start the scheduler
	s.Start()

	return s
}