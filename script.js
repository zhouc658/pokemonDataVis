//arrays to store values pulled from the JSON
let type = [];
let hp = [];
let attack = [];

// color for each type
const typeColors = {
    grass: 'rgba(170, 220, 170, 0.8)',   
    fire: 'rgba(255, 180, 180, 0.8)',    
    water: 'rgba(180, 220, 255, 0.8)',   
    bug: 'rgba(200, 235, 180, 0.8)',    
    normal: 'rgba(220, 220, 220, 0.8)',  
    poison: 'rgba(210, 190, 240, 0.8)',  
    electric: 'rgba(255, 240, 180, 0.8)',
    ground: 'rgba(215, 190, 150, 0.8)',  
    fairy: 'rgba(255, 210, 230, 0.8)',   
};
//color for the attack
const attackColors = {
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
  
  //function to load and process the data from the json files
async function loadData() {
    //we fetch the data.json file
    const response = await fetch('./data.json');
    console.log(response)
    //convert to js obj
    const data = await response.json();

    //we loop thru the data
    for (let i = 0; i < data.length; i++) {
        //store the pokemon information into arrays
        type.push(data[i].type1);
        hp.push(data[i].hp)
        attack.push(data[i].attack);
    }

    console.log(type)
    console.log(hp)
    //return the arrays to be used in the chart
    return { type, hp, attack };
}
//we create the actual chart
async function createChart() {
    //load the data from those arrays
    const { type, hp, attack } = await loadData();
    //get the canvas that we set up in html to draw it 
    const myChart = document.getElementById('myChart').getContext('2d');

    //the count for pokemon type, sum for hp and attack to calculate the average later
    let typeCount = {};
    let hpSum = {};
    let attackSum = {};

    //loop trhu each pokemon and group their info by type
    for (let i = 0; i < type.length; i++) {
        //setup the type,hp, attack
        let t = type[i];
        let h = hp[i];
        let a = attack[i];

        //if it is first time to see a type, then we initialize the counts
        if (!typeCount[t]) {
            typeCount[t] = 0;
            hpSum[t] = 0;
            attackSum[t] = 0;
        }
        //add the info for this type
        typeCount[t] += 1;
        hpSum[t] += h;
        attackSum[t] += a;
    }
    // setup empty arrays to store chart labels and average stats
    let labels = [];
    let avgHP = [];
    let avgAttack = [];

    //calculate the avg for each type
    for (let t in typeCount) {
        labels.push(t); //type name
        //bars for hp and attack
        avgHP.push(hpSum[t] / typeCount[t]); 
        avgAttack.push(attackSum[t] / typeCount[t]);
    }
    // give the colors based on the type, so the array we set up before
    let hpColors = labels.map(
        t => typeColors[t] 
      );
      //color for attack
      let attackColor = labels.map(
        t => attackColors[t]
      );
      
      //create the bar chart
    let interactiveChart = new Chart(myChart, {
        type: 'bar',
        data: {
            //labels is the types we show on the x-axis
            labels: labels,
            datasets: [
                {
                label: 'Average HP',
                data: avgHP,
                backgroundColor: hpColors,
            },
            {
                label: 'Average Attack',
                    data: avgAttack,
                    backgroundColor: attackColor,
            }
        ]
        },
        options: {
            //what label we show on the x and y axis
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Average Value' } },
                x: { title: { display: true, text: 'Pokemon Type' } }
            },
            //the title on top the chart for what this graph is for
            plugins: {
                title: { display: true, text: 'Average Stats by Pokemon Type' }
            }
        }
    });

    //eventlistener that let users select between hp, attack, or reset to see each chart
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
// call the funciton to create the chart
createChart();