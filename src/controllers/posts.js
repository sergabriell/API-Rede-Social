const connection = require('../connection');

const registerPost = async (req, res) => {
    const { texto } = req.body;
    const { user } = req;

    if (!texto) {
        return res.status(400).json({ message: "Excreva algo na postagem..." });
    }

    try {
        const queryPost = 'INSERT INTO postagens (usuario_id, texto) VALUES ($1, $2)';

        const { rowCount: post } = await connection.query(queryPost, [user.id, texto]);

        if (!post) {
            return res.status(400).json({ message: "Não foi possível fazer a postagem..." });
        }

        return res.status(200).json({ message: "Postagem feita, muito bom!" });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ message: "O texto e o token são obrigatórios" });
    }

    try {
        const querySearchPost = 'SELECT * FROM postagens WHERE id = $1';
        const { rowCount: searchPost, rows } = await connection.query(querySearchPost, [id]);

        if (!searchPost) {
            return res.status(404).json({ message: "Postagem não encontrada!" });
        }

        const currentPost = rows[0];

        if (currentPost.usuario_id !== user.id) {
            return res.status(400).json({ message: "Essa postagem não é sua!" });
        }

        const queryPost = 'UPDATE postagens SET texto = $1 WHERE id = $2 AND usuario_id = $3';

        const { rowCount: post } = await connection.query(queryPost, [texto, id, user.id]);

        if (!post) {
            return res.status(400).json({ message: "Não foi possível alterar a postagem..." });
        }

        return res.status(200).json({ message: "Postagem alterada com sucesso!" });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listAllPosts = async (req, res) => {
    try {
        const query = 'SELECT p.id, u.nome AS usuario, p.texto FROM postagens p LEFT JOIN usuarios u ON p.usuario_id = u.id';
        const { rows: posts } = await connection.query(query);

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listPosts = async (req, res) => {
    const { user } = req;

    try {
        const query = `
        SELECT p.id, u.nome AS usuario, texto FROM postagens p 
        LEFT JOIN usuarios u ON p.usuario_id = u.id WHERE p.usuario_id = $1`;

        const { rowCount: postsCount, rows: posts } = await connection.query(query, [user.id]);

        if (!postsCount) {
            return res.status(404).json({ message: "Postagens não encontradas" });
        }

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const deletePost = async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    try {
        const querySearchPost = 'SELECT * FROM postagens WHERE id = $1';
        const { rowCount: searchPost, rows } = await connection.query(querySearchPost, [id]);

        if (!searchPost) {
            return res.status(404).json({ message: "Postagem não encontrada!" });
        }

        const currentPost = rows[0];

        if (currentPost.usuario_id !== user.id) {
            return res.status(400).json({ message: "Essa postagem não é sua!" });
        }

        const query = `DELETE FROM postagens WHERE id = $1 AND usuario_id = $2`;

        const { rowCount: postsCount } = await connection.query(query, [id, user.id]);

        if (!postsCount) {
            return res.status(404).json({ message: "Não foi possivel excluir a postagem..." });
        }

        return res.status(200).json({ message: "Postagem excluida com sucesso" });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    registerPost,
    updatePost,
    listAllPosts,
    listPosts,
    deletePost
}