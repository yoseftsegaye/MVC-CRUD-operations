
import { product } from "../mongoose/schemas/product.mjs";

export const resolveIndexByProductName = async (request, response, next) => {
    try {
        const { productName } = request.params;

        const findProduct = await product.findOne({ productName });

        if (!findProduct) {
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Product Not Found</title>
                <link rel="stylesheet" href="../css/style.css" /> <!-- Link to your CSS file -->
            </head>
            <body>
                <div class="container">
                    <div class="product-item">
                        <h1>Product Not Found</h1>
                        <p>The product with the name "${productName}" does not exist.</p>
                    </div>
                </div>
            </body>
            </html>
            `;
            return response.status(404).send(htmlContent); // Send HTML response
        }

        // If product is found, attach it to the request object
        request.findProduct = findProduct;
        next();
    } catch (error) {
        console.error('Error finding product:', error);
        response.status(500).send({ msg: 'Server error' });
    }
};

