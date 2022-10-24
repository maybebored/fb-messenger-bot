const ProductRepository = require("../repository/product");

module.exports = class MessageHandler {
    constructor({ message }) {
        this.message = message
        const keys = message.split(' ');
        this.actionRaw = keys[0];
        this.subject = keys[1];
        this.action = MessageHandler._getAction(this.actionRaw, this.subject);
        this.productRepository = new ProductRepository();
    };

    async getResponse() {
        if (!this.action) {
            return { 'text': 'Sorry, I did not understand your message.' };
        }
        const result = await this.action(this.productRepository).catch(error => {
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
        switch (actionRaw) {
            case '/desc':
                return (productRepository) => {
                    return productRepository.getBySku(subject).then(res => res.description);
                };
            case '/price':
                return (productRepository) => {
                    return productRepository.getBySku(subject).then(res => res.price);
                };
            case '/shipping':
                return (productRepository) => {
                    return productRepository.getBySku(subject).then(res => res.shipping);
                };
            case '/buy':
                return async (productRepository) => {
                    const product = await productRepository.getBySku(subject);
                    if (product) {
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