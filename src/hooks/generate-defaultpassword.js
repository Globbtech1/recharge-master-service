// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const calpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const num = '1234567890';
    // const specials = ',.!@#$%^&*';
    const specials = '.';
    const options = [alpha, alpha, alpha, calpha, calpha, num, num, specials];
    let opt, choose;
    let pass = 'password123!';
    // for ( let i = 0; i < 8; i++ ) {
    //   opt = Math.floor(Math.random() * options.length);
    //   choose = Math.floor(Math.random() * (options[opt].length));
    //   pass = pass + options[opt][choose];
    //   options.splice(opt, 1);
    // }
    console.log(pass);
    context.data['password'] = pass;
    context.data['plainPassword'] = pass;
    return context;
  };
};


