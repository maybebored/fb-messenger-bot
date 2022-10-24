const { sequelize, Sequelize } = require('../../models/index');
const productModel = require('../../models/product');

module.exports = class ProductRepository {
    constructor() {
        this.product = productModel(sequelize, Sequelize.DataTypes);
    }

    async getBySku(sku) {
        const res = await this.product.findOne({ where: { sku } });
        console.log(res);
        return {
            name: res.name,
            description: res.description,
            price: res.price,
            shipping: res.shipping,
        }
    }
}