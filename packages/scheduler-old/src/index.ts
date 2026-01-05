import "dotenv/config";
import schedule from "node-schedule";
import { fetchLastCandles } from "./jobs/fetchLastCandles";
import { calculateSuggestions } from "./jobs/calculateSuggestions";
import { globalStore } from "./globalStore";
import { initDb } from "./initialization/initDB";
import { fetchShares } from "./jobs/fetchActualShares";

globalStore.investApiUrl = process.env.TINVEST_API_URL;
globalStore.investApiToken = process.env.TINVEST_API_TOKEN;

(async () => {
  await initDb();
})();

const fetchSharesJob = schedule.scheduleJob("0 0 1 */1 *", async function () {
  console.log(
    "Next invocation fetchSharesJob",
    fetchSharesJob.nextInvocation()
  );

  await fetchShares();
});

const fetchLastCandlesJob = schedule.scheduleJob(
  "0 7,18 * * *",
  async function () {
    console.log(
      "Next invocation fetchLastCandles",
      fetchLastCandlesJob.nextInvocation()
    );

    await fetchLastCandles();

    await calculateSuggestions();
  }
);

fetchLastCandlesJob.invoke();
