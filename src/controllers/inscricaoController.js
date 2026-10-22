const prisma = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const inscricoes = await prisma.inscricoes.findMany({
            include: {
                participantes: { select: { id: true, nome: true, email: true } },
                atividades: { select: { id: true, titulo: true, data_atvd: true } }
            }
        });
        res.json(inscricoes);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar inscrições', detalhes: error.message });
    }
};

exports.criar = async (req, res) => {
    try {
        const { participante_id, atividade_id } = req.body;
        const pId = Number(participante_id);
        const aId = Number(atividade_id);

        // Buscar atividade e suas inscrições atuais para checar vagas
        const atividade = await prisma.atividades.findUnique({
            where: { id: aId },
            include: { inscricoes: true }
        });

        if (!atividade) {
            return res.status(404).json({ erro: 'Atividade não encontrada.' });
        }
        // RN05: Impedir duplicidade de inscrição na mesma atividade
        const duplicada = await prisma.inscricoes.findFirst({
            where: { participante_id: pId, atividade_id: aId }
        });

        if (duplicada) {
            return res.status(400).json({ erro: 'Participante já inscrito nesta atividade.' });
        }
        // RN06: Validar limite de vagas
        const vagasOcupadas = atividade.inscricoes ? atividade.inscricoes.length : 0;
        if (vagasOcupadas >= atividade.qtd_vagas) {
            return res.status(400).json({ erro: 'Inscrições esgotadas para esta atividade.' });
        }

        const nova = await prisma.inscricoes.create({
            data: { participante_id: pId, atividade_id: aId }
        });

        res.status(201).json(nova);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao realizar inscrição', detalhes: error.message });
    }
};

exports.cancelar = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.inscricoes.delete({ where: { id: Number(id) } });

        res.json({ mensagem: 'Inscrição cancelada com sucesso.' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao cancelar inscrição', detalhes: error.message });
    }
};