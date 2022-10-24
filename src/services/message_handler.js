module.exports = class MessageHandler {
    constructor({ message }) {
        this.message = message
        const keys = message.split(' ');
        this.actionRaw = keys[0];
        this.subject = keys[1];
        this.action = _getAction(this.actionRaw, this.subject);
    };

    async getResponse() {
        if (!this.action) {
            return { 'text': 'Sorry, I did not understand your message.' };
        }
        const result = await this.action().catch(error => {
            console.log(error);
            return { 'text': 'Sorry, something went wrong.' };
        });
        if (result) {
            return { 'text': result };
        } else {
            return { 'text': 'Sorry, the product does not exist.' };
        }
    }

    static _getAction(actionRaw, subject) {
        if (!actionRaw || !subject) {
            return null;
        }
        switch (rawAction) {
            case '/desc':
                return () => {
                    // return getDescriptionByProductId(subject)
                    return 'Description ACME';
                };
            case '/price':
                return () => {
                    // return getPriceByProductId(subject)
                    return 'Price ACME';
                };
            case '/shipping':
                return () => {
                    // return getShippingByProductId(subject)
                    return 'Shipping ACME';
                };
            case '/buy':
                return async () => {
                    const product = await getProductById(subject);
                    if (product && product.available) {
                        // _sendPurchaseEmail(product);
                        return 'Your product will be shipped soon';
                    } else {
                        return 'This product is not available at the moment';
                    }
                }
            default:
                return null;
        }
    }
};