// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars

const isDateGreaterThanToday = (date) => {
  const currentDate = new Date();
  return date > currentDate;
};

module.exports = {
  isDateGreaterThanToday,
};
