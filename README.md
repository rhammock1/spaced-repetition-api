# Spaced repetition API!

Hosted on [Vercel](https://spaced-repetition-two-theta.vercel.app/)
Client Repo on [GitHub](https://github.com/rhammock1/spaced-repetition)

## Thinkful Capstone project practicing Linked Lists

This app helps the user learn a new language through the learning technique of spaced repetition. When the user gets translates the word correctly, the word moves further back in line so they're tested less often on it. When they get the answer wrong, the word only moves back a few spaces so the user is tested more frequently on the word.

### Endpoints
/api/language  GET
   Sample Response: 200 ok
   ```
      {
    "language": {
        "id": 1,
        "name": "Spanish",
        "user_id": 1,
        "head": 1,
        "total_score": 0
    },
    "words": [
        {
            "id": 6,
            "language_id": 1,
            "original": "Seis",
            "next": 7,
            "translation": "Six",
            "memory_value": 1,
            "correct_count": 0,
            "incorrect_count": 0
        },
        {
            "id": 4,
            "language_id": 1,
            "original": "Cuatro",
            "next": 5,
            "translation": "Four",
            "memory_value": 1,
            "correct_count": 0,
            "incorrect_count": 1
        },
        ...]

   ```
/api/language/head   GET
   Sample Response: 200 ok
   ```
   {
      "nextWord": "Seis",
      "totalScore": 4,
      "wordCorrectCount": 0,
      "wordIncorrectCount": 0
   }
   ```
/api/language/guess  POST
   Sample Request:
   ```
   {
    "guess": "ten"
   }
   ```
   Sample Response: 200 ok
   ```
   {
    "nextWord": "Cuatro",
    "totalScore": 5,
    "wordCorrectCount": 0,
    "wordIncorrectCount": 1,
    "answer": "ten",
    "isCorrect": false
}
   ```
## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DATABASE_NAME=spaced-repetition-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
