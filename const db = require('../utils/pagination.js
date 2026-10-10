function buildPaginatedResponse(rows, page, limit, total){
  const totalPages = Math.ceil(total/limit);
  return {
    data: rows,
    meta: {
      page, limit, total, totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      nextPage: page < totalPages ? page+1 : null,
      prevPage: page > 1 ? page-1 : null
    }
  };
}

function cursorPagination(rows, limit, nextCursor){
  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0,limit) : rows;
  return { data, nextCursor: hasMore ? data[data.length-1].id : null, hasMore };
}

module.exports = { buildPaginatedResponse, cursorPagination };
