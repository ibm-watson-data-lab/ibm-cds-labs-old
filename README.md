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

And to deploy to GitHub Pages `grunt deploy`
