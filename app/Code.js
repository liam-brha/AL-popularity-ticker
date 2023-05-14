const ENV = PropertiesService.getScriptProperties();
const TOKEN = ENV.getProperty("token");
const ANIMEID = parseInt(ENV.getProperty("animeID"));
const UTITLE = ENV.getProperty("title");
const LASTSCORE = ENV.getProperty("lastScore");
const URL = "https://graphql.anilist.co";

async function main() {
  let sts = await getStats(ANIMEID);
  logStats(sts);

  let bText = await createBadgeText(sts);
  Logger.log(bText)
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
  let scoreDiff = ENV.getProperty("scoreDiff");
  let trendEmoji = getTrendEmoji(averageScore, LASTSCORE);
  // only allowed 22 char OSHI ↗ 0.5% ↗ (99%)
  return `${name} ${trendEmoji} ${scoreDiff}% ${trendEmoji} (${averageScore}%)`;
}

function getTrendEmoji(score, oldScore) {
  Logger.log(`${score} ${oldScore}`)
  let scoreDiff = ENV.getProperty("scoreDiff");
  let trend;

  if (scoreDiff > 0) {
    trend = "up"
  } else if (scoreDiff < 0) { 
    trend = "down"
  } else {
    trend = "flat"
  }

  let emoji = {
    up: "⬆️",
    down: "⬇️",
    flat: "↔️",
  };
  return emoji[trend];
}

// log the last updated score difference
function logStats(stats) {
  if (stats.averageScore != LASTSCORE) {
    ENV.setProperty("scoreDiff", String(parseFloat(stats.averageScore) - parseFloat(LASTSCORE)))
    ENV.setProperty("lastScore", stats.averageScore);
  }
}
