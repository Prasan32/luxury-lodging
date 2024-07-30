export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            return next(error);
        }

        next();
    };
};

export const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);

        if (error) {
            return next(error);
        }

        next();
    };
};