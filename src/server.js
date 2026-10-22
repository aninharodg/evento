const express = require('express');
const prisma = require('./config/database');
const routes = require('./routes');//c

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api',routes);//c

app.use(express.static('public'));

app.get('/teste',async (req,res) =>{
    try{
        const totalParticipante = await prisma.participantes.count();

        res.status(200).json({
            status:'Ok',
            mensagem:'Conectado com sucesso!',
            participantesCadastrados:totalParticipante
        });
    }catch(error){
        res.status(500).json({
            status:'Error',
            mensagem:'Erro na conexão.',
            detalhes:error.message
        });
    }
});

app.listen(port, () =>{
    console.log('Servidor rodando!')
});