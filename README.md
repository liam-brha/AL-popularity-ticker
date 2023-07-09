# AL-ticker
OSHI ⬇️ -1% ⬇️  (99 %)

## Deployment

Make an apps script project and push `./app`to it. Then add a trigger in the webUI to run once a day

### Configuration

Once in the webUI, under project settings add the following Script Properties:

| Property | Value |
| -------- | ----- |
| `animeID` | `<animeId>` |
| `token` | `<token>` |
| `title` | `<customAnimeTitle>` |
| `lastScore` | `70` |
| `scoreDiff` | `0` |

### Token generation

Make an app under settings > api. Then subsitute `<yourid>` for your the app id shown and click the link

```
https://anilist.co/api/v2/oauth/authorize?client_id=<yourid>&response_type=token
```


