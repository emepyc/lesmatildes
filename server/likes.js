var GitHubApi = require('github');

module.exports = function (ctx, cb) {
    var data = ctx.data;
    delete(data['githubToken']);

    var github = new GitHubApi({
        host: 'api.github.com',
        protocol: 'https',
        version: '3.0.0',
        headers: {
            'user-agent': 'webtask',
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
        // owner: "emepyc",
        user: 'emepyc',
        repo: "lesmatildes",
        path: "likes.json",
        ref: 'gh-pages'
    }, function (err, res) {
        var sha = res.sha;

        github.repos.updateFile({
            // owner: 'emepyc',
            user: 'emepyc',
            repo: 'lesmatildes',
            path: 'likes.json',
            message: 'change in likes.json from lesmatildes website',
            branch: 'gh-pages',
            content: new Buffer(JSON.stringify(data, null, '    ')).toString('base64'),
            sha: sha
        }, cb);

    });
};
