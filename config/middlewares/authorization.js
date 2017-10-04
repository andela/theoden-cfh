/**
 * @description Generic require login routing middleware
 * @param  {object} req HTTP Request object
 * @param  {object} res HTTP Response object
 * @param  {function} next function call on success
 * @returns {*} void
 */
exports.requiresLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
  /**
 * @description User authorizations routing middleware
 * @param  {object} req HTTP Request object
 * @param  {object} res HTTP Response object
 * @param  {function} next function call on success
 * @returns {*} void
 */
  hasAuthorization(req, res, next) {
    if (req.profile.id !== req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
  }
};

/**
 * Article authorizations routing middleware
 */
// exports.article = {
//     hasAuthorization: function(req, res, next) {
//         if (req.article.user.id != req.user.id) {
//             return res.send(401, 'User is not authorized');
//         }
//         next();
//     }
// };
