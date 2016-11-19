var mailgun = require('mailgun-js');

module.exports = function (ctx, cb) {

    var pedidoDetails = ctx.body.pedidoDetails;
    var body = 'Nuevo pedido en Les Matildes web\n';
    
    
    for (var i=0; i<pedidoDetails.length; i++) {
        var item = pedidoDetails[i];
        console.log(item);
        var name = item.name;
        var amount = item.n;
        body += `  ${name} x ${amount}`;
    }

    console.log(body);

    var data = {
        "from": 'emepyc@gmail.com',
        "to": "emepyc@gmail.com",
        "subject": "Les Matildes -- pedido " + ctx.body.pedidoId,
        "text": body
    };

    mailgun({
        "apiKey": ctx.secrets.mailgunSecretKey,
        "domain": "sandboxc0efbfea89d041bda9064fa5f8d4f782.mailgun.org"
    }).messages()
        .send(data, cb);
};
