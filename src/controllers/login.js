const connection = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret');

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Informe o email e a senha!" });
    }

    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const { rows, rowCount: userFound } = await connection.query(query, [email]);

        if (!userFound) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        const user = rows[0];

        const verifiedPassword = await bcrypt.compare(senha, user.senha);

        if (!verifiedPassword) {
            return res.status(400).json({ message: "Email ou senha incorretos!" });
        }

        const token = jwt.sign(user, jwtSecret, { expiresIn: '5d' });

        return res.status(200).json({ token: token });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    login
}