import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { CreateProductValidationSchema } from "../utilities/validationSchemas.mjs";
import { resolveIndexByProductName } from '../utilities/middleware.mjs';
import { product } from "../mongoose/schemas/product.mjs";

const router = Router();

// const responseData = (response, responseJson) => {
//     if (!responseJson || responseJson.length === 0) {
//         const Error = "Product is Not Found."
//         return response.send(Error);
//     } else
//         return response.send(responseJson
//             .map((product) => `
//              productName: ${product.productName}<br>
//              displayName: ${product.displayName}<br>
//              price: ${product.price} <br><br>
//        `)
//             .join('')
//         );
// }

const messageToSend = (response, message) => {
    const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Product Not Found</title>
                <link rel="stylesheet" href="/css/style.css"> <!-- Link to your CSS file -->
            </head>
            <body>
                <div class="container">
                        <p>${message}</p>
                </div>
            </body>
            </html>
            `;

    return response.status(201).contentType('text/html').send(htmlContent);
}

const responseData = (response, responseJson) => {
    if (responseJson && !Array.isArray(responseJson)) {
        responseJson = [responseJson]; // Wrap single object in an array
    }
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Project</title>
            <link rel="stylesheet" href="../css/style.css" /> <!-- Link to your CSS file -->
        </head>
        <body>
            <div class="container">
                ${!responseJson || responseJson.length === 0
            ? `<div class="product-item">
                   <h1>Product Not Found</h1>
                   <p>The product that include those letters does not exist.</p>
            </div>`
            : responseJson.map((product) => `
                        <div class="product-item">
                            <strong>Product Name:</strong> ${product.productName}<br>
                            <strong>Display Name:</strong> ${product.displayName}<br>
                            <strong>Price:</strong> ${product.price}<br><br>
                        </div>
                    `).join('')}
            </div>
        </body>
        </html>
    `;
    response.send(htmlContent);
};

function capitalizeFirstLetter(string) {
    return string.replace(/^\w/, c => c.toUpperCase());
}

router.get("/products",
    async (request, response) => {
        const result = validationResult(request);

        const { query: { filter, value }, } = request;

        try {
            // if (!filter && !value) {
            //     const allProducts = await product.find();
            //     responseData(response, allProducts);
            // }
            const queryObject = {};
            if (filter && value) {
                queryObject[filter] = { $regex: value, $options: 'i' };
            }
            const filteredProducts = await product.find(queryObject);

            responseData(response, filteredProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            response.status(500).send({ msg: 'Server error' });
        }
    });

router.get("/products/:productName", resolveIndexByProductName, (request, response) => {
    const { findProduct } = request;
    responseData(response, findProduct);
    // response.send(`
    //     productName: ${findProduct.productName}<br>
    //     displayName: ${findProduct.displayName}<br>
    //     price: ${findProduct.price}
    // `); // it can also possible to return with out any stylesheet. 
});

router.post("/products/post", checkSchema(CreateProductValidationSchema), async (request, response) => {
    const result = validationResult(request);
    // Check for validation errors
    if (!result.isEmpty()) {
        const errorMessages = result.array().map(err => err.msg).join('\n');
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Product Not Found</title>
                <link rel="stylesheet" href="/css/style.css"> <!-- Link to your CSS file -->
            </head>
            <body>
                <div class="container">
                        ${errorMessages}
                </div>
            </body>
            </html>
            `;

        return response.status(201).contentType('text/html').send(htmlContent);
    }
    const data = matchedData(request);

    data.price = `$${data.price}`;
    const newProduct = new product({
        productName: data.productName,
        displayName: capitalizeFirstLetter(data.displayName),
        price: data.price
    });

    try {
        const savedProduct = await newProduct.save();
        if (savedProduct) {
            const message = "New Product Added successfully."
            messageToSend(response, message);
        }

    } catch (error) {
        // console.log(err);
        return response.send({ msg: `${error}` });
    }
});

router.put("/products/put/:productName", resolveIndexByProductName, async (request, response) => {

    try {
        const { body } = request;
        const { findProduct } = request;

        body.displayName = capitalizeFirstLetter(body.displayName)

        Object.assign(findProduct, body);

        const updatedProduct = await findProduct.save();

        if (updatedProduct) {
            const message = "New Product updated successfully."
            messageToSend(response, message);
        }

    } catch (error) {
        console.error('Error updating product:', error);
        response.status(500).send({ msg: 'Server error' });
    }
});

router.patch("/products/patch/:productName", resolveIndexByProductName, async (request, response) => {
    try {
        const { body } = request;
        const { findProduct } = request;

        body.displayName = capitalizeFirstLetter(body.displayName)

        for (const key in body) {
            if (body[key] !== undefined && body[key] !== '') {
                findProduct[key] = body[key];
            }
        }

        const updatedProduct = await findProduct.save();

        if (updatedProduct) {
            const message = "New Product updated successfully."
            messageToSend(response, message);
        }

    } catch (error) {
        console.error('Error updating product:', error);
        response.status(500).send({ msg: 'Server error' });
    }
});

router.delete("/products/delete/:productName", resolveIndexByProductName, async (request, response) => {
    try {
        const { findProduct } = request;
        await findProduct.deleteOne();

        const message = "Product Removed Successfully."
        messageToSend(response, message);

    } catch (error) {
        console.error('Error deleting product:', error);
        response.status(500).send({ msg: 'Server error' });
    }
});

export default router;