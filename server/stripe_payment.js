var stripe = require('stripe');

module.exports = function (ctx, cb) {
    var order = ctx.body.order;
    var description = 'Nuevo pedido en Les Matildes web';
    var metadata = {
        order_id: ctx.body.orderId,
        customer_contact: ctx.body.email,
    };
    for (var i=0; i<order.length; i++) {
        var item = order[i];
        var name = item.name;
        var amount = item.n;
        metadata[name] = amount;
    }

    stripe(ctx.secrets.stripeSecretKey).charges.create({
        amount: ctx.body.amount,
        currency: ctx.body.currency || "eur",
        source: ctx.body.stripeToken,
        description: description,
        metadata: metadata
    }, cb);
};
