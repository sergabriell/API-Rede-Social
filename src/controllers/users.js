const connection = require('../connection');
const bcrypt = require('bcrypt');


const registerUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios..." });
    }

    try {
        const queryValidateEmail = 'SELECT * FROM usuarios WHERE email = $1';
        const { rowCount: emailFound } = await connection.query(queryValidateEmail, [email]);

        if (emailFound) {
            return res.status(400).json({ message: "Email já cadastrado!" });
        }

        const encryptedPassword = await bcrypt.hash(senha, 10);

        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)';
        const { rowCount: user } = await connection.query(query, [nome, email, encryptedPassword]);

        if (!user) {
            return res.status(400).json({ message: "Não foi possivel cadastrar o usuário..." });
        }

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}



module.exports = {
    registerUser
}