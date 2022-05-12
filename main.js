"use strict";
const btnCadastrar = document.getElementById('btn-cadastrar');
function calcTempo(tempo) {
    const minutos = Math.floor(tempo / 60000);
    const segundos = Math.floor((tempo % 60000) / 1000);
    return `${minutos}min e ${segundos}s`;
}
function patio() {
    const totalVagas = 20;
    function ler() {
        return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }
    function salvar(veiculos) {
        localStorage.setItem('patio', JSON.stringify(veiculos));
    }
    function adicionar(veiculo, salva) {
        var _a;
        const corpoTabela = document.getElementById('patio');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${veiculo.modelo}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}s</td>
            <td>
                <button 
                    class="delete"
                >
                    X
                </button>
            </td>
        `;
        (_a = row.querySelector('.delete')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => remover(veiculo.placa));
        corpoTabela === null || corpoTabela === void 0 ? void 0 : corpoTabela.append(row);
        // Remover antes de subir no github
        console.log(`O carro de modelo ${veiculo.modelo} e placa ${veiculo.placa} foi adicionado!`);
        if (salva) {
            salvar([...ler(), veiculo]);
        }
    }
    function remover(placa) {
        const veiculo = ler().find(veiculo => veiculo.placa === placa);
        const tempo = calcTempo(new Date().getTime() - new Date(veiculo.entrada).getTime());
        if (!confirm(`O veiculo ${veiculo.modelo} placa ${veiculo.placa} permaneceu no pátio por ${tempo}. Deseja encerrrar?`))
            return;
        salvar(ler().filter(veiculo => veiculo.placa !== placa));
        render();
    }
    function render() {
        const corpoTabela = document.getElementById('patio');
        corpoTabela.innerHTML = "";
        const numeroVagas = document.getElementById('total-vagas');
        const numeroCarros = document.getElementById('total-carros');
        const vagasDisponiveis = document.getElementById('vagas-disponiveis');
        const patio = ler();
        if (patio.length) {
            patio.forEach(veiculo => adicionar(veiculo));
            numeroVagas.innerText = `${totalVagas}`;
            numeroCarros.innerText = `${patio.length}`;
            vagasDisponiveis.innerText = `${totalVagas - patio.length}`;
        }
    }
    return {
        ler,
        salvar,
        adicionar,
        remover,
        render
    };
}
patio().render();
btnCadastrar === null || btnCadastrar === void 0 ? void 0 : btnCadastrar.addEventListener("click", () => {
    const modelo = document.getElementById('modelo').value;
    const placa = document.getElementById('placa').value;
    if (!modelo || !placa) {
        window.alert("Os campos modelo e placa são obrigatórios!");
        return;
    }
    patio().adicionar({ modelo, placa, entrada: new Date().toISOString() }, true);
});
