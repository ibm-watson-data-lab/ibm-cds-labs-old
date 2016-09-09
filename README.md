#  IBM CDS Labs

A page to host our selected GitHub projects for IBM CDS

## Getting Started

### GitHub API
Firstly you'll need to generate a GitHub API token, you can do this by going

`GitHub.com -> Settings -> Personal access tokens` and select
`Generate access token`

Once you have created the access token please `export` it on your CLI by doing
`export GITHUBTOKEN={GENERATEDTOKEN}`

### Build App
The application is quite simple and self contained, and the pre-requistes for
running it are having Node, Ruby and Ruby Bundler installed.

After that, it's a simple case of `npm install`.

### Build Site
Depending on what you want you need to do the following

Build site with gists `grunt build`

Build without gists `grunt buildNoGist`

To review locally you need to `grunt serve`

And to deploy to GitHub Pages:
- `git commit -a -m "updates"`
- `git push`
- `grunt deploy`


## Developer Details

This view must exist in the Cloudant database. The grunt build jobs query the view to compile the list of repos and gists to publish using this query: 

> https://d14f43e9-5102-45bc-b394-c92520c2c0bd-bluemix.cloudant.com/devcenter/_design/github/_view/github?reduce=false&include_docs=true

```
{
  "_id": "_design/github",
  "views": {
    "github": {
      "map": "function (doc) {
        if ( doc.url.indexOf('github.com')>0 && doc.status=='Live') {
          emit(doc._id, 1);
        }
      }"
    }
  }
}

```

## Publishing

1. Update documents in http://devcenter.mybluemix.net/
  - all documents that have github.com or gist.github.com in the `url` field will be considered
  - also, status=Live and featured=true must be set

2. Notify this site administrator that new content exists
3. Administrator will re-harvest from /devcenter and publish
  