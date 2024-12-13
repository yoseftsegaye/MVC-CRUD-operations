import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    displayName: mongoose.Schema.Types.String,
    price: {
        type: mongoose.Schema.Types.String,
        required: true,
    },

});

export const product = mongoose.model("product", productSchema); 