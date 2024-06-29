const success = (body, req) => {
  console.info(`${req.method} ${req.path}\tSuccess`);
  return { status: 'success', data: { ...body } };
};

const failure = (message, req) => {
  console.error(`${req.method} ${req.path}\t${message}`);
  return { status: 'failure', message };
};

module.exports = { success, failure };
