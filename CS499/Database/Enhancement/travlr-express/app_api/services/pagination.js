/**
 * Generic pagination helper for Mongoose models
 * Supports cursor-based and offset-based pagination.
 */

const paginate = async (Model, {
    filter = {},
    sort = { createdAt: -1 },
    limit = 20,
    cursorField = 'createdAt',
    cursorValue,
    select,
    populate
} = {}) => {
    const query = { ...filter };

    if (cursorValue) {
        const direction = sort[cursorField] === 1 ? '$gt' : '$lt';
        query[cursorField] = { [direction]: cursorValue };
    }

    let mongooseQuery = Model.find(query).sort(sort).limit(limit + 1);

    if (select) {
        mongooseQuery = mongooseQuery.select(select);
    }

    if (populate) {
        mongooseQuery = mongooseQuery.populate(populate);
    }

    const results = await mongooseQuery.exec();

    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, -1) : results;
    const nextCursor = hasMore && items.length
        ? items[items.length - 1][cursorField]
        : null;

    return {
        items,
        hasMore,
        nextCursor
    };
};

module.exports = {
    paginate
};
