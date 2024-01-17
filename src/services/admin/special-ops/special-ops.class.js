/* eslint-disable no-unused-vars */
const { exec } = require("child_process");
const { promisify } = require("util");

// Promisify the exec function
const execPromise = promisify(exec);
exports.SpecialOps = class SpecialOps {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    console.log(data);
    const { command } = data;
    // const scriptToExecute = "resetPort";

    return executeScript(command)
      .then((result) => {
        console.log("Script execution result:", result);
        // Send the result to the frontend
        return result;
      })
      .catch((error) => {
        console.error("Error executing script:", error);
        // Handle the error and send an appropriate response to the frontend
        return error;
      });
  }
};
async function executeScript(scriptName) {
  try {
    const { stdout, stderr } = await execPromise(`yarn run ${scriptName}`);
    return { success: true, stdout, stderr };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
