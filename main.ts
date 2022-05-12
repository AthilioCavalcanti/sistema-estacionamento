type Veiculo = {
    modelo: string;
    placa: string;
    entrada: Date | string;
}

const btnCadastrar = document.getElementById('btn-cadastrar');

function calcTempo(tempo: number) : string {
    const minutos = Math.floor(tempo / 60000);
    const segundos = Math.floor((tempo % 60000) / 1000)

    return `${minutos}min e ${segundos}s`;
}

function patio() {
    const totalVagas : number = 20;
    function ler(): Veiculo[]{
        return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function salvar(veiculos: Veiculo[]){
        localStorage.setItem('patio', JSON.stringify(veiculos));
    }


    function adicionar(veiculo: Veiculo, salva?: boolean){
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
        `
        row.querySelector('.delete')?.addEventListener('click', () => remover(veiculo.placa))

        corpoTabela?.append(row);

        if(salva) {
            salvar([...ler(), veiculo]);
        }
    }

    function remover(placa: string){
        const veiculo = ler().find(veiculo => veiculo.placa === placa) as Veiculo;

        const tempo = calcTempo(new Date().getTime() - new Date(veiculo.entrada).getTime());

       if(
           !confirm(`O veiculo ${veiculo.modelo} placa ${veiculo.placa} permaneceu no pátio por ${tempo}. Deseja encerrrar?`)
        ) return;

        salvar(ler().filter(veiculo => veiculo.placa !== placa));
        render();
    }

    function render(){
        const corpoTabela = document.getElementById('patio') as HTMLElement; 
        corpoTabela.innerHTML = "";

        const numeroVagas = document.getElementById('total-vagas') as HTMLSpanElement;
        const numeroCarros = document.getElementById('total-carros') as HTMLSpanElement;
        const vagasDisponiveis = document.getElementById('vagas-disponiveis') as HTMLSpanElement;

        const patio = ler();

        if(patio.length) {
            patio.forEach(veiculo => adicionar(veiculo ));
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

btnCadastrar?.addEventListener("click", () => {
    const modelo: string = (document.getElementById('modelo')as HTMLInputElement).value;
    const placa: string = (document.getElementById('placa') as HTMLInputElement).value;

    if (!modelo || !placa) {
        window.alert("Os campos modelo e placa são obrigatórios!");
        return
    }

    patio().adicionar({ modelo, placa, entrada: new Date().toISOString() }, true);
})
