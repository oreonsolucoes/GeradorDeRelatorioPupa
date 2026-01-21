// Adiciona os primeiros candidatos ao carregar
window.onload = () => {
    const hoje = new Date();

    // Data para input type="date" (YYYY-MM-DD)
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, '0');
    const dd = String(hoje.getDate()).padStart(2, '0');

    document.getElementById('data_emissao').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('ano-atual').innerText = new Date().getFullYear();

    // Período no formato DD/MM
    document.getElementById('periodo').value = `${dd}/${mm}`;
    
    addCandidato();
};

function addCandidato(nome = "", status = "INAPTO") {
    const container = document.getElementById('container-candidatos');
    const div = document.createElement('div');
    div.className = 'cand-row';
    div.innerHTML = `
        <input type="text" class="c-nome" value="${nome}" placeholder="Nome do Candidato">
        <select class="c-status">
            <option value="APTO" ${status === 'APTO' ? 'selected' : ''}>APTO</option>
            <option value="INAPTO" ${status === 'INAPTO' ? 'selected' : ''}>INAPTO</option>
        </select>
        <button class="btn-del" onclick="this.parentElement.remove()">X</button>
    `;
    container.appendChild(div);
}

function gerarRelatorio() {
    // 1. Dados Básicos
    const vaga = document.getElementById('vaga').value;
    document.querySelectorAll('.out-vaga').forEach(el => el.innerText = vaga);
    document.getElementById('out-periodo').innerText = document.getElementById('periodo').value;

    // Formatação de data brasileira
    const dataInput = document.getElementById('data_emissao').value;
    const dataFormatada = dataInput.split('-').reverse().join('/');
    document.getElementById('out-data').innerText = dataFormatada;

    // 2. Números
    const nums = ['triados', 'entrevistas', 'finalistas', 'desistentes', 'inaptos', 'antecedentes', 'vagas_aberto', 'aprovados', 'reprovados'];
    nums.forEach(id => {
        const input = document.getElementById(id);
        const out = document.getElementById('out-' + id);

        if (!input || !out) return;

        out.innerText = input.value;
    });




    // 3. Lista de Candidatos
    const listaHtml = [];
    document.querySelectorAll('.cand-row').forEach(row => {
        const n = row.querySelector('.c-nome').value;
        const s = row.querySelector('.c-status').value;
        if (n) listaHtml.push(`${n} - <strong>${s}</strong>`);
    });
    document.getElementById('out-candidatos-lista').innerHTML = listaHtml.join('<br>');

    const rsCampos = [
        'rs_vagas_aberto',
        'rs_abordados',
        'rs_aprovados',
        'rs_reprovados',
        'rs_antecedentes',
        'rs_aprovados_antecedentes',
        'rs_exame',
        'rs_integracao',
        'rs_demissao',
        'rs_qtd_solicitada',
        'rs_enviados'
    ];

    rsCampos.forEach(id => {
        const input = document.getElementById(id);
        const out = document.getElementById('out-' + id);
        if (input && out) {
            out.innerText = input.value || '-';
        }
    });


    // 4. Textos em Tópicos
    const textAreas = ['atividades', 'pendencias', 'dificuldades', 'sugestoes'];

    textAreas.forEach(id => {
        const input = document.getElementById(id);
        const out = document.getElementById('out-' + id);

        if (!input || !out) return;

        const lines = input.value.split('\n');
        out.innerHTML = lines
            .filter(l => l.trim() !== "")
            .map(l => `<li>${l}</li>`)
            .join('');
    });


    document.getElementById('out-obs-gerais').innerText = document.getElementById('obs_gerais').value;
    // ===== FALTAS E ATESTADOS =====
    const faltas = [];
    document.querySelectorAll('.falta-nome').forEach(input => {
        if (input.value.trim() !== "") {
            faltas.push(`<li>${input.value}</li>`);
        }
    });

    document.getElementById('out-faltas').innerHTML =
        faltas.length ? faltas.join('') : '<li>Sem registros no dia.</li>';

    // Data do título
    const hojeFalta = new Date();
    const ddF = String(hojeFalta.getDate()).padStart(2, '0');
    const mmF = String(hojeFalta.getMonth() + 1).padStart(2, '0');
    document.getElementById('out-faltas-data').innerText = `${ddF}/${mmF}`;

    // 5. Controle de EPIs 
    const epiLabels = {
        botas: "Botas",
        camisetas: "Camisetas",
        calcas: "Calças",
        epis: "EPIs Diversos"
    };

    const epiRelatorio = [];

    Object.keys(epiLabels).forEach(tipo => {
        document.querySelectorAll(`#epi-${tipo} .epi-row`).forEach(row => {
            const desc = row.querySelector('input').value;
            const qtde = row.querySelector('select').value;

            if (desc || qtde > 0) {
                epiRelatorio.push(
                    `<li><strong>${epiLabels[tipo]}:</strong> ${qtde} un. – ${desc}</li>`
                );
            }
        });
    });

    document.getElementById('out-epis').innerHTML =
        epiRelatorio.length ? epiRelatorio.join('') : '<li>Sem entrega de EPI no período.</li>';


    // ===== NOME DO PDF =====
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');

    const nomeArquivo = `Relatório Diário Recrutamento&Seleção Laryssa ${dia}-${mes}`;
    document.title = nomeArquivo;
    window.print();
}

function addFalta(nome = "") {
    const container = document.getElementById('container-faltas');

    const div = document.createElement('div');
    div.className = 'falta-row';

    div.innerHTML = `
        <input type="text" class="falta-nome" value="${nome}" placeholder="Nome do colaborador">
        <button class="btn-del" onclick="this.parentElement.remove()">X</button>
    `;

    container.appendChild(div);
}



function addEpiLinha(tipo) {
    const container = document.getElementById(`epi-${tipo}`);

    const div = document.createElement('div');
    div.className = 'epi-row';

    div.innerHTML = `
        <input type="text" placeholder="Tamanho, cor, modelo...">
        <select>
            ${Array.from({ length: 20 }, (_, i) => `<option value="${i}">${i}</option>`).join('')}
        </select>
        <button type="button" class="btn-del-epi" onclick="this.parentElement.remove()">X</button>
    `;

    container.appendChild(div);
}
