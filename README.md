# Github API Wrapper

## Dev Setup

### Requirements

- Node 18

### Running Locally

- Clone repo, run `npm install` and `npm run dev`
- Create a `.env` file in the following format:

  ```text
  ACCESS_TOKEN=<GitHub personal access token>
  USERNAME=<Github username>
  ```

❗ Without the `.env` file there will be a 50-request hourly limit on the API.

### Running in Production

Visit this [WEB APP](https://pr-app.herokuapp.com/) to see the API in action.

## About

This app is a thin wrapper around the GitHub API.

It currently supports a single endpoint but is built to scale a bit more.

[GET] /api/openprs?repo={repo}&limit={limit}&page={page}

```js
/*
[GET] https://pr-app.herokuapp.com/api/openprs?repo=https://github.com/expressjs/express&limit=1&page=1

Example of response:
{
    "github_api": {
        "url": "https://api.github.com/repos/expressjs/express/pulls?state=open&per_page=1&page=1",
        "rate_limit": 4948
    },
    "links": {
        "next": {
            "url": "https://pr-app.herokuapp.com/api/openprs?repo=https://github.com/expressjs/express&limit=1&page=2"
        },
        "last": {
            "url": "https://pr-app.herokuapp.com/api/openprs?repo=https://github.com/expressjs/express&limit=1&page=53"
        }
    },
    "data": [
        {
            "id": 1165838603,
            "number": 5063,
            "title": "chore: Add Node.js version 19",
            "commit_count": 1,
            "commits": [
                "chore: Add Node.js version 19"
            ]
        }
    ]
}
/*
```

### URL Parameters

- `repo` URL of GitHub repo. It will respond with a 422 on incorrect format, or 404 on not found
- `limit` between 1 and 100. It will default to 1 for any other value
- `page` between 1 and 100. It will default to 1 for any other value

### Limitations

- Uses Basic auth with a GitHub personal access token
- With a token there is an hourly 5000-request limit
