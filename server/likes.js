var GitHubApi = require('github');

module.exports = function (ctx, cb) {
    var item = ctx.query.item;
    var action = ctx.query.action;

    var github = new GitHubApi({
        host: 'api.github.com',
        protocol: 'https',
        version: '3.0.0',  // Needed for webtask supported version of github module
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
        // owner: "emepyc",  // Not available in webtask version, using 'user' instead
        user: 'emepyc',
        repo: "lesmatildes",
        path: "likes.json",
        ref: 'gh-pages'
    }, function (err, res) {
        var likes = JSON.parse(new Buffer(res.content, 'base64'));
        var sha = res.sha;

        // Actions: add or remove
        if (action === 'add') {
            if (!likes[item]) {
                likes[item] = 1;
            } else {
                likes[item]++;
            }
        } else if (action === 'remove') {
            if (likes[item] === 1) {
                delete likes[item];
            } else {
                likes[item]--;
            }
        }

        github.repos.updateFile({
            // owner: 'emepyc',  // Not available in webtask version, using 'user' instead
            user: 'emepyc',
            repo: 'lesmatildes',
            path: 'likes.json',
            message: 'change in likes.json from lesmatildes website',
            branch: 'gh-pages',
            content: new Buffer(JSON.stringify(likes, null, '    ')).toString('base64'),
            sha: sha
        }, cb);

    });
};
