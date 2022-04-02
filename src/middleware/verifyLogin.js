const connection = require('../connection');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret');

const verifyLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    const token = authorization.replace('Bearer', '').trim();

    try {
        const { id } = jwt.verify(token, jwtSecret);

        const queryUser = 'SELECT id, nome, email FROM usuarios WHERE id = $1';
        const { rowCount: userCount, rows } = await connection.query(queryUser, [id]);

        if (!userCount) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        const user = rows[0];

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verifyLogin;