const ENV = PropertiesService.getScriptProperties();
const TOKEN = ENV.getProperty("token");
const ANIMEID = parseInt(ENV.getProperty("animeID"));
const UTITLE = ENV.getProperty("title");
const STATS = JSON.parse(ENV.getProperty("priorData"));
const URL = "https://graphql.anilist.co";

// score trend is adjusted in 48 hour cycles
const ITERATIONS = parseInt(ENV.getProperty("iteration"));

async function main() {
  let sts = await getStats(ANIMEID);
  logStats(sts);

  let bText = await createBadgeText(sts, STATS);
  setBadge(bText);
}

async function getStats(id) {
  let response = await UrlFetchApp.fetch(URL, {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify({
      query: `
        query ($id: Int) {
          Media (id: $id) {
            title {
              userPreferred
            },
            popularity,
            averageScore
          }
        }
      `,
      variables: { id: id }
    })
  })
  return JSON.parse(response.getContentText()).data.Media;
}

function setBadge(text) {
  return UrlFetchApp.fetch(URL, {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify({
      query: `
        mutation ($text: String) {
          UpdateUser(donatorBadge: $text) {
            donatorBadge
          }
        }
      `,
      variables: { text: text }
    }),
    "headers": {
      "Authorization": TOKEN
    }
  });
}

function createBadgeText({title, averageScore, popularity}) {
  let name = UTITLE || title;
  let trendEmoji = getTrendEmoji(averageScore, STATS);
  // only allowed 22 char
  return `${name} ${trendEmoji} ${averageScore}% ${trendEmoji}`;
}

function getTrendEmoji(presentScore, {averageScore}) {
  let scoreDiff = presentScore - averageScore;
  let trend;

  if (scoreDiff > 0) { trend = "up"}
  if (scoreDiff < 0) { trend = "down" }
  if (scoreDiff == 0) { trend = "flat" }

  let emoji = {
    up: "⬆️",
    down: "⬇️",
    flat: "↔️",
  };
  return emoji[trend];
}

// every 48 hours, adjust the score trend
function logStats(stats) {
  if (ITERATIONS >= 24) {
    ENV.setProperty("priorData", JSON.stringify(stats));
    ENV.setProperty("iteration", "0");
  }
  else {
    ENV.setProperty("iteration", String(ITERATIONS + 1));
  }
}
