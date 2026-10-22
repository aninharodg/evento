const express = require('express');
const router = express.Router();

const participanteController = require('../controllers/participanteController');
const atividadeController = require('../controllers/atividadeController');
const inscricaoController = require('../controllers/inscricaoController');

//Participantes -----
router.get('/participantes', participanteController.listar);
router.get('/participantes/:id',participanteController.buscarPorId);
router.post('/participantes',participanteController.criar);
router.put('/participantes/:id',participanteController.atualizar);
router.delete('/participantes/:id',participanteController.excluir);

//Atividades ---------
router.get('/atividades', atividadeController.listar);
router.post('/atividades',atividadeController.criar);
router.delete('/atividades/:id',atividadeController.excluir);
router.put('/atividades/:id',atividadeController.atualizar);

//Inscrições ---------
router.get('/inscricoes',inscricaoController.listar);
router.post('/inscricoes', inscricaoController.criar);
router.delete('/inscricoes/:id',inscricaoController.cancelar);

module.exports = router;