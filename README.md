# AL-popularity-ticker
OSHI ↗ 0.5% ↗  (99 %)

## Deployment

Make an apps script project and copy `./app`to it. This is a mostly manual affair.

Add a trigger in the webUI to run every 2 hours, and deploy the project as a web app.

## Architecture

Google Apps Script is used to deploy the code.

It is responsible for:

1. Fetching the average score for the provided anime ID
2. Building the new donator badge text
3. Setting the new text for the provided user ID
