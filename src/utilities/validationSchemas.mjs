export const CreateProductValidationSchema = {
    productName: {
        isLength: {
            options: {
                min: 3,
                max: 10,
            },
            errorMessage: 'productName must be at least 3-10 character',
        },
        notEmpty: {
            errorMessage: 'productName cannot be empty',
        },
        isString: {
            errorMessage: 'productName must be string',
        },
    },

    displayName: {
        optional: { checkFalsy: true }, // Makes validation optional if not present
        isLength: {
            options: {
                min: 3,
                max: 10,
            },
            errorMessage: 'displayName must be at least 3-10 character',
        },
        notEmpty: {
            errorMessage: 'displayName cannot be empty',
        },
        isString: {
            errorMessage: 'displayName must be string',
        },
    },

    price: {
        notEmpty: true,
    }
}