const API = 'http://localhost:3000/api';

window.onload = function() {
    carregarDadosGerais();
};

function carregarDadosGerais() {
    carregarParticipantes();
    carregarAtividades();
    carregarInscricoes();
}

// ==========================
// 1. PARTICIPANTES
// ==========================
async function carregarParticipantes() {
    const resposta = await fetch(`${API}/participantes`);
    const participantes = await resposta.json();
    
    const tbody = document.getElementById('tabelaParticipantes');
    const select = document.getElementById('selectParticipante');
    
    tbody.innerHTML = '';
    select.innerHTML = '<option value="">Selecione o Participante</option>';

    participantes.forEach(function(p) {
        select.innerHTML += '<option value="' + p.id + '">' + p.nome + '</option>';
        
        tbody.innerHTML += '<tr>' +
            '<td>' + p.nome + '</td>' +
            '<td>' + p.email + '</td>' +
            '<td>' + p.telefone + '</td>' +
            '<td>' +
                '<button class="btn-edit" onclick="prepararEdicaoParticipante(' + p.id + ', \'' + p.nome + '\', \'' + p.email + '\', \'' + p.telefone + '\')">Editar</button>' +
                '<button class="btn-del" onclick="deletarRegistro(\'participantes\', ' + p.id + ')">Excluir</button>' +
            '</td>' +
        '</tr>';
    });
}

function prepararEdicaoParticipante(id, nome, email, telefone) {
    document.getElementById('participante_id_edit').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    document.getElementById('telefone').value = telefone;
    
    document.getElementById('btnSalvarParticipante').textContent = 'Alterar Participante';
    document.getElementById('btnCancelarParticipante').style.display = 'inline-block';
}

function cancelarEdicaoParticipante() {
    document.getElementById('participante_id_edit').value = '';
    document.getElementById('formParticipante').reset();
    document.getElementById('btnSalvarParticipante').textContent = 'Cadastrar Participante';
    document.getElementById('btnCancelarParticipante').style.display = 'none';
}

document.getElementById('formParticipante').onsubmit = async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('participante_id_edit').value;
    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value
    };

    let url = `${API}/participantes`;
    let metodo = 'POST';

    if (id) {
        url = `${API}/participantes/${id}`;
        metodo = 'PUT';
    }

    const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    
    const resultado = await resposta.json();

    if (resposta.ok) {
        alert(id ? 'Participante alterado com sucesso!' : 'Participante cadastrado com sucesso!');
        cancelarEdicaoParticipante();
        carregarDadosGerais();
    } else {
        alert(resultado.erro || 'Erro ao salvar participante.');
    }
};

// ==========================
// 2. ATIVIDADES
// ==========================
async function carregarAtividades() {
    const resposta = await fetch(`${API}/atividades`);
    const atividades = await resposta.json();
    
    const tbody = document.getElementById('tabelaAtividades');
    const select = document.getElementById('selectAtividade');
    
    tbody.innerHTML = '';
    select.innerHTML = '<option value="">Selecione a Atividade</option>';

    atividades.forEach(function(a) {
        if (a.vagas_disponiveis > 0) {
            select.innerHTML += '<option value="' + a.id + '">' + a.titulo + ' (' + a.vagas_disponiveis + ' vagas)</option>';
        }

        const dataFormatada = a.data_atvd ? new Date(a.data_atvd).toLocaleString('pt-BR') : 'N/A';
        const dataInput = a.data_atvd ? new Date(a.data_atvd).toISOString().slice(0, 16) : '';

        tbody.innerHTML += '<tr>' +
            '<td>' + a.titulo + '</td>' +
            '<td>' + a.vagas_disponiveis + ' / ' + a.qtd_vagas + '</td>' +
            '<td>' + dataFormatada + '</td>' +
            '<td>' +
                '<button class="btn-edit" onclick="prepararEdicaoAtividade(' + a.id + ', \'' + a.titulo + '\', \'' + a.descricao + '\', ' + a.qtd_vagas + ', \'' + dataInput + '\')">Editar</button>' +
                '<button class="btn-del" onclick="deletarRegistro(\'atividades\', ' + a.id + ')">Excluir</button>' +
            '</td>' +
        '</tr>';
    });
}

function prepararEdicaoAtividade(id, titulo, descricao, qtd_vagas, data_atvd) {
    document.getElementById('atividade_id_edit').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('descricao').value = descricao;
    document.getElementById('qtd_vagas').value = qtd_vagas;
    document.getElementById('data_atvd').value = data_atvd;
    
    document.getElementById('btnSalvarAtividade').textContent = 'Alterar Atividade';
    document.getElementById('btnCancelarAtividade').style.display = 'inline-block';
}

function cancelarEdicaoAtividade() {
    document.getElementById('atividade_id_edit').value = '';
    document.getElementById('formAtividade').reset();
    document.getElementById('btnSalvarAtividade').textContent = 'Cadastrar Atividade';
    document.getElementById('btnCancelarAtividade').style.display = 'none';
}

document.getElementById('formAtividade').onsubmit = async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('atividade_id_edit').value;
    const dados = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        qtd_vagas: document.getElementById('qtd_vagas').value,
        data_atvd: document.getElementById('data_atvd').value
    };

    let url = `${API}/atividades`;
    let metodo = 'POST';

    if (id) {
        url = `${API}/atividades/${id}`;
        metodo = 'PUT';
    }

    const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    
    const resultado = await resposta.json();

    if (resposta.ok) {
        alert(id ? 'Atividade alterada com sucesso!' : 'Atividade cadastrada com sucesso!');
        cancelarEdicaoAtividade();
        carregarDadosGerais();
    } else {
        alert(resultado.erro || 'Erro ao salvar atividade.');
    }
};

// ==========================
// 3. INSCRIÇÕES
// ==========================
async function carregarInscricoes() {
    const resposta = await fetch(`${API}/inscricoes`);
    const inscricoes = await resposta.json();
    
    const tbody = document.getElementById('tabelaInscricoes');
    tbody.innerHTML = '';

    inscricoes.forEach(function(i) {
        const nomeParticipante = i.participantes ? i.participantes.nome : 'N/A';
        const tituloAtividade = i.atividades ? i.atividades.titulo : 'N/A';

        tbody.innerHTML += '<tr>' +
            '<td>' + nomeParticipante + '</td>' +
            '<td>' + tituloAtividade + '</td>' +
            '<td>' +
                '<button class="btn-edit" onclick="prepararEdicaoInscricao(' + i.id + ', ' + i.participante_id + ', ' + i.atividade_id + ')">Editar</button>' +
                '<button class="btn-del" onclick="deletarRegistro(\'inscricoes\', ' + i.id + ')">Excluir</button>' +
            '</td>' +
        '</tr>';
    });
}

function prepararEdicaoInscricao(id, participante_id, atividade_id) {
    document.getElementById('inscricao_id_edit').value = id;
    document.getElementById('selectParticipante').value = participante_id;
    document.getElementById('selectAtividade').value = atividade_id;
    
    document.getElementById('btnSalvarInscricao').textContent = 'Alterar Inscrição';
    document.getElementById('btnCancelarInscricao').style.display = 'inline-block';
}

function cancelarEdicaoInscricao() {
    document.getElementById('inscricao_id_edit').value = '';
    document.getElementById('formInscricao').reset();
    document.getElementById('btnSalvarInscricao').textContent = 'Inscrever';
    document.getElementById('btnCancelarInscricao').style.display = 'none';
}

document.getElementById('formInscricao').onsubmit = async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('inscricao_id_edit').value;
    const dados = {
        participante_id: document.getElementById('selectParticipante').value,
        atividade_id: document.getElementById('selectAtividade').value
    };

    let url = `${API}/inscricoes`;
    let metodo = 'POST';

    if (id) {
        url = `${API}/inscricoes/${id}`;
        metodo = 'PUT';
    }

    const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    
    const resultado = await resposta.json();

    if (resposta.ok) {
        alert(id ? 'Inscrição alterada com sucesso!' : 'Inscrição realizada com sucesso!');
        cancelarEdicaoInscricao();
        carregarDadosGerais();
    } else {
        alert(resultado.erro || 'Erro ao realizar inscrição.');
    }
};

// ==========================
// FUNÇÃO DE EXCLUSÃO
// ==========================
async function deletarRegistro(recurso, id) {
    if (confirm('Deseja realmente excluir este registro?')) {
        const resposta = await fetch(`${API}/${recurso}/${id}`, {
            method: 'DELETE'
        });
        
        const resultado = await resposta.json();

        if (resposta.ok) {
            alert('Excluído com sucesso!');
            carregarDadosGerais();
        } else {
            alert(resultado.erro || 'Erro ao excluir.');
        }
    }
}