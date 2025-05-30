// Seletores
const btnConcluido = document.querySelector('.modal-footer button[type="submit"]');
const selectresultado = document.getElementById('resultado');
const selectMes = document.getElementById('mes');
const motivoContainer = document.getElementById('motivo-container');
const listaDespesas = document.querySelector('.expense-list');
const totalElement = document.getElementById('total');

let despesas = JSON.parse(localStorage.getItem('despesas')) || [];

// Inicializar gráfico
let ctx = document.getElementById('expenseChart').getContext('2d');
let grafico = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['✅ Aprovado', '❌ Reprovado'],
    datasets: [{
      label: 'Resultados',
      data: [0, 0],
      backgroundColor: ['green', 'red'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true
  }
});

function atualizarGrafico() {
  let aprovados = despesas.filter(d => d.resultado === '✅ Aprovado').length;
  let reprovados = despesas.filter(d => d.resultado === '❌ Reprovado').length;

  grafico.data.datasets[0].data = [aprovados, reprovados];
  grafico.update();
}

function atualizarTotal() {
  totalElement.innerHTML = `<strong>Total de Registros:</strong> ${despesas.length}`;
}

function renderizarDespesas() {
  listaDespesas.innerHTML = '';

  despesas.forEach((d, index) => {
    const item = document.createElement('div');
    item.className = 'expense-item d-flex justify-content-between align-items-center';
    item.innerHTML = `
      <div><span>${d.resultado} - ${d.motivo || ''}</span> <span class="text-muted">(${d.mes})</span></div>
      <div>
        <button class="btn btn-sm btn-danger ms-2" onclick="eliminarDespesa(${index})">&times;</button>
      </div>
    `;
    listaDespesas.appendChild(item);
  });

  atualizarTotal();
  atualizarGrafico();
}

function eliminarDespesa(index) {
  despesas.splice(index, 1);
  localStorage.setItem('despesas', JSON.stringify(despesas));
  renderizarDespesas();
}

btnConcluido.addEventListener('click', () => {
  const resultado = selectresultado.value;
  const mes = selectMes.value;

  const inputMotivo = motivoContainer.querySelector('input');
  const motivo = inputMotivo ? inputMotivo.value.trim() : '';

  if (!resultado || resultado === '-- Escolhe uma Opção --') {
    alert('Por favor, escolha uma opção de resultado.');
    return;
  }

  if ((resultado === '❌ Reprovado' || resultado === '✅ Aprovado') && motivo === '') {
    alert('Por favor, preencha o motivo.');
    return;
  }

  const novaDespesa = { resultado, motivo, mes };
  despesas.push(novaDespesa);
  localStorage.setItem('despesas', JSON.stringify(despesas));

  selectresultado.selectedIndex = 0;
  selectMes.selectedIndex = 0;
  motivoContainer.innerHTML = '';

  const modal = bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
  modal.hide();

  renderizarDespesas();
});

document.getElementById('resultado').addEventListener('change', function () {
  motivoContainer.innerHTML = '';

  const label = document.createElement('label');
  const input = document.createElement('input');

  input.type = 'text';
  input.name = 'motivo';
  input.id = 'motivo';
  input.required = true;
  input.className = 'form-control mt-1';

  if (this.value === '❌ Reprovado') {
    label.textContent = 'Mais uma né caralho??';
    label.setAttribute('for', 'motivo');
    input.placeholder = 'Burro da Merda... Quantas foram desta vez?';
  } else if (this.value === '✅ Aprovado') {
    label.textContent = 'Finalmente Caralho';
    label.setAttribute('for', 'motivo');
    input.placeholder = 'Bem crlh!! Mete ai quantas erraste pah um gajo saber:';
  }

  if (this.value === '❌ Reprovado' || this.value === '✅ Aprovado') {
    motivoContainer.appendChild(label);
    motivoContainer.appendChild(input);
  }
});

window.addEventListener('load', () => {
  renderizarDespesas();
});
