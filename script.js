let type = [];
let hp = [];
let attack = [];

// color for each type
const typeColors = {
    grass: 'green',
    fire: 'red',
    water: 'lightblue',
    bug: 'lightgreen',
    normal: 'gray',
    poison: 'rgba(153, 102, 255, 0.6)',
    electric: 'rgba(255, 206, 86, 0.6)',
    ground: 'rgb(153, 101, 21)',
    fairy: 'pink',
};

async function loadData() {
    const response = await fetch('./data.json');
    console.log(response)
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
        type.push(data[i].type1);
        hp.push(data[i].hp)
        attack.push(data[i].attack);
    }

    console.log(type)
    console.log(hp)
    return { type, hp, attack };
}

async function createChart() {
    const { type, hp, attack } = await loadData();
    const myChart = document.getElementById('myChart').getContext('2d');

    let typeCount = {};
    let typeSum = {};
    let attackSum = {};

    for (let i = 0; i < type.length; i++) {
        let t = type[i];
        let h = hp[i];
        let a = attack[i];

        if (!typeCount[t]) {
            typeCount[t] = 0;
            typeSum[t] = 0;
            attackSum[t] = 0;
        }
        typeCount[t] += 1;
        typeSum[t] += h;
        attackSum[t] += a;
    }
    // Calculate average HP per type
    let labels = [];
    let avgHP = [];
    let avgAttack = [];

    for (let t in typeCount) {
        labels.push(t);
        avgHP.push(typeSum[t] / typeCount[t]);
        avgAttack.push(attackSum[t] / typeCount[t]);
    }
    // Map the labels to colors
    let backgroundColors = labels.map(t => typeColors[t] || 'rgba(200,200,200,0.6)'); // fallback color
    let interactiveChart = new Chart(myChart, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                label: 'Average HP',
                data: avgHP,
                backgroundColor: backgroundColors,
            },
            {
                label: 'Average Attack',
                    data: avgAttack,
                    backgroundColor: backgroundColors,
            }
        ]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Average Value' } },
                x: { title: { display: true, text: 'Pokemon Type' } }
            },
            plugins: {
                title: { display: true, text: 'Average Stats by Pokemon Type' }
            }
        }
    });
    document.getElementById('hpBtn').addEventListener('click', ()=>{
        interactiveChart.data.datasets.forEach(ds=>{
            ds.hidden= ds.label != 'Average HP';
        })
        interactiveChart.update();
    })

    document.getElementById('attackBtn').addEventListener('click', ()=>{
        interactiveChart.data.datasets.forEach(ds=>{
            ds.hidden= ds.label != 'Average Attack';
        })
        interactiveChart.update();
    })
    document.getElementById('resetBtn').addEventListener('click', ()=>{
        interactiveChart.data.datasets.forEach(ds=>{
            ds.hidden= false;
        })
        interactiveChart.update();
    })
}

createChart();