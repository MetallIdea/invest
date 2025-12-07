import "dotenv/config";
import schedule from "node-schedule";
import { fetchLastCandles } from "./jobs/fetchLastCandles";
import { calculateSuggestions } from "./jobs/calculateSuggestions";
import { globalStore } from "./globalStore";

globalStore.investApiUrl = process.env.TINVEST_API_URL;
globalStore.investApiToken = process.env.TINVEST_API_TOKEN;

const fetchLastCandlesJob = schedule.scheduleJob(
  "0 0 * ? * *",
  async function () {
    console.log(
      "Next invocation fetchLastCandles",
      fetchLastCandlesJob.nextInvocation()
    );

    // await fetchLastCandles();

    await calculateSuggestions();
  }
);

fetchLastCandlesJob.invoke();
