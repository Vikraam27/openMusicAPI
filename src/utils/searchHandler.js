const search = (value, dbColumn) => {
  const val = value.toLowerCase();
  const query = {
    text: `SELECT id, title, performer FROM musics WHERE LOWER(${dbColumn}) LIKE '%' || $1 || '%'`,
    values: [val],
  };
  return query;
};

module.exports = search;
