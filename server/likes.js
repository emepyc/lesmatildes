var GitHubApi = require('github');
var base64 = require('base64it');
var stringify = require('json-stringify-safe');

module.exports = function (ctx, cb) {
    var data = ctx.data;
    delete(data['githubToken']);

    var github = new GitHubApi({
        debug: true,
        host: 'api.github.com',
        headers: {
            'user-agent': 'webtask',
            Promise: require('bluebird'),
            followRedirects: false,
            timeout: 5000
        }
    });

    // user token
    github.authenticate({
        type: "token",
        token: ctx.secrets.githubToken
    });

    github.repos.getContent({
        owner: "emepyc",
        repo: "lesmatildes",
        path: "likes.json",
        ref: 'gh-pages'
    }, function (err, res) {
        var sha = res.sha;

        github.repos.updateFile({
            owner: 'emepyc',
            repo: 'lesmatildes',
            path: 'likes.json',
            message: 'change in likes.json from lesmatildes website',
            branch: 'gh-pages',
            content: base64.encode(stringify(data, null, '    ')),
            sha: sha
        }, cb);

    });
};
