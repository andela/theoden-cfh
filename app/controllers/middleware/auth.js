const jwt = require('jsonwebtoken');


/**
* this fetched the token and places it in the x-access-token header
* @private
* @param {object} req - request nobject
* @return {string} token response
*/
const getToken = (req) => {
  const token = req.body.token || req.headers['x-access-token'] || req.headers.Authorization;
  return token;
};

/**
* authenticates a the json web token  to be appended in routes that need to be authenticated
* @public
* @param {object} req - request object
* @param {object} res - response object
* @param {function} next - next function to be called on the success
* @return {undefined} if not defined send a response to the server indicating this
*/
const authenticate = (req, res, next) => {
  if (req.url.startsWith('/auth')) return next();
  const token = getToken(req);
  if (token) {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ message: 'Unauthorised access' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res
      .status(403)
      .send({ success: false, message: 'Incorrect, Please try Login again' });
  }
};

/**
 * Generates a json web token with the supplied parameters
 * @param  {String} email email address 
 * @param  {String} username username
 * @return {promise} signed token
 */
const getJWT = (email, username) => new Promise((resolve, reject) => {
  jwt.sign(
    {
      email,
      username
    }, process.env.JWT_SECRET,
    {
      expiresIn: 1440
    }, (error, token) => {
      if (error) {
        reject(
          {
            status: 'Error',
            message: error
          });
      } else if (token) {
        resolve(
          {
            status: 'Success',
            token
          }
        );
      } else {
        reject({
          status: 'Error',
          message: 'token error'
        });
      }
    });
});


module.exports = {
  getJWT,
  authenticate,
  getToken
};
