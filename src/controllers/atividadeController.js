const prisma = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const atividades = await prisma.atividades.findMany({
            include: { inscricoes: true }
        });

        // Formatação para calcular vagas ocupadas e disponíveis
        const resultado = atividades.map(a => {
            const vagasOcupadas = a.inscricoes ? a.inscricoes.length : 0;
            const vagasDisponiveis = a.qtd_vagas - vagasOcupadas;

            return {
                ...a,
                vagas_ocupadas: vagasOcupadas,
                vagas_disponiveis: vagasDisponiveis,
                esgotado: vagasDisponiveis <= 0
            };
        });
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar atividades', detalhes: error.message });
    }
};


exports.criar = async (req, res) => {
    try {
        const { titulo, descricao, qtd_vagas, data_atvd } = req.body;
        const nova = await prisma.atividades.create({
            data: {
                titulo,
                descricao,
                qtd_vagas: Number(qtd_vagas),
                data_atvd: new Date(data_atvd)
            }
        });
        res.status(201).json(nova);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar atividade', detalhes: error.message });
    }
};

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, qtd_vagas, data_atvd } = req.body;

        const atualizada = await prisma.atividades.update({
            where: { id: Number(id) },
            data: {
                titulo,
                descricao,
                qtd_vagas: qtd_vagas ? Number(qtd_vagas) : undefined,
                data_atvd: data_atvd ? new Date(data_atvd) : undefined
            }
        });

        res.json(atualizada);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar atividade', detalhes: error.message });
    }
};

exports.excluir = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.atividades.delete({ where: { id: Number(id) } });

        res.json({ mensagem: 'Atividade excluída com sucesso.' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao excluir atividade (verifique se há inscritos).', detalhes: error.message });
    }
};