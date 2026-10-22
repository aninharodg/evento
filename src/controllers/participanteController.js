const prisma = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const listar = await prisma.participantes.findMany();
        res.status(200).json(listar);
    } catch (erro) {
        res.status(500).json({
            erro: 'Deu ruim!',
            detalhes: erro.message
        });
    }
};