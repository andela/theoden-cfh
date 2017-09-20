jwt = require('jsonwebtoken');

class UserAuthenticate {
	/**
* this fetched the token and places it in the x-access-token header
* @private
* @param {object} req - request nobject
* @return {string} token response
*/
	static getToken(req) {
		const token = req.body.token || req.headers['x-access-token'] || req.headers.Authorization;
		return token;
	}

	/**
* authenticates a the json web token  to be appended in routes that need to be authenticated
* @public
* @param {object} req - request object
* @param {object} res - response object
* @param {function} next - next function to be called on the pobject
* @return {undefined} if not defined send a response to the server indicating this
*/
	static authenticate(req, res, next) {
		const token = getToken(req);
		if (token) {
			jwt.verify(token, process.env.SECRET, (error, decoded) => {
				if (error) {
					return res.status(401).json({ message: 'Unauthorised access' });
				}
				req.user = decoded;
				next();
			});
		} else {
			res.status(403).send({
				success: false,
				message: 'Incorrect, Please try Login again'
			});
		}
	}

	/** 
 * Signs a json web token with the supplied parameters
 * @param  {String}  - id
 * @param  {String}  - email
 * @param  {String}  - username
 */
	static getJWT(id, email, username) {
		jwt.sign(
			{
				id,
				email,
				username
			},
			'Secret',
			{
				expiresIn: 1440
			}
		);
	}
}
export default UserAuthenticate;
