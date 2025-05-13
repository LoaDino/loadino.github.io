let centroids = null;
let chartInstance = null;

async function loadData() {
    const res = await fetch('data.json');
    return await res.json();
}

function toTensor(data) {
    return tf.tensor2d(data.map(d => [
        d.skills, d.experience, d.education, d.english, d.projects, d.certs
    ]));
}

async function kMeans(data, k = 3, epochs = 30) {
    const tensor = toTensor(data);
    const n = data.length;

    const shuffled = tf.util.createShuffledIndices(n);
    const sliced = Array.from(shuffled).slice(0, k);
    const indices = tf.tensor1d(sliced, 'int32');
    let centroids = tf.gather(tensor, indices);

    for (let i = 0; i < epochs; i++) {
        const expandedPoints = tensor.expandDims(1);
        const expandedCentroids = centroids.expandDims(0);
        const distances = expandedPoints.sub(expandedCentroids).square().sum(2);
        const assignments = distances.argMin(1);

        const newCentroids = [];
        for (let c = 0; c < k; c++) {
            const mask = assignments.equal(c).cast('float32');
            const count = mask.sum();
            const masked = tensor.mul(mask.expandDims(1));
            const sum = masked.sum(0);
            const mean = sum.div(count.add(1e-5));
            newCentroids.push(mean);
        }

        centroids = tf.stack(newCentroids);
    }

    return { centroids };
}

function getClosestCluster(centroids, input) {
    const inputTensor = tf.tensor2d([input]);
    const distances = centroids.sub(inputTensor).square().sum(1);
    return distances.argMin().dataSync()[0];
}

const clusterDescriptions = [
    "Кластер 0: Новичок. Начинает карьеру, обучается, делает первые проекты. Рекомендуем — учебные курсы, pet-проекты, soft skills.",
    "Кластер 1: Развивающийся специалист. Уже работает над реальными задачами, набирает портфолио. Рекомендуем — системное обучение и сертификация.",
    "Кластер 2: Опытный профессионал. Глубокие знания, реальный опыт, уверенный английский. Готов к переходу в тимлиды или архитекторы."
];

async function initializeModel() {
    const data = await loadData();
    const model = await kMeans(data, 3, 30);
    centroids = model.centroids;
}

function drawChart(userInput, centroids) {
    const userPoint = {
        x: userInput[0], // skills
        y: userInput[1], // experience
        backgroundColor: '#000',
        label: 'Вы'
    };

    const centroidPoints = centroids.arraySync().map((c, i) => ({
        x: c[0],
        y: c[1],
        backgroundColor: ['#4a90e2', '#50e3c2', '#f5a623'][i],
        label: `Кластер ${i}`
    }));

    const data = {
        datasets: [
            {
                label: 'Центроиды кластеров',
                data: centroidPoints,
                pointRadius: 10,
                pointHoverRadius: 12,
                pointStyle: 'triangle',
                showLine: false
            },
            {
                label: 'Пользователь',
                data: [userPoint],
                pointRadius: 8,
                pointStyle: 'circle',
                backgroundColor: '#000'
            }
        ]
    };

    const config = {
        type: 'scatter',
        data: data,
        options: {
            scales: {
                x: {
                    title: { display: true, text: 'Skills' },
                    min: 0,
                    max: 10
                },
                y: {
                    title: { display: true, text: 'Experience (years)' },
                    min: 0,
                    max: 30
                }
            },
            plugins: {
                legend: {
                    labels: { usePointStyle: true }
                }
            }
        }
    };

    if (chartInstance) chartInstance.destroy();
    const ctx = document.getElementById('clusterChart').getContext('2d');
    chartInstance = new Chart(ctx, config);
}

document.getElementById("profileForm").addEventListener("submit", async e => {
    e.preventDefault();

    const userInput = [
        +document.getElementById("skills").value,
        +document.getElementById("experience").value,
        +document.getElementById("education").value,
        +document.getElementById("english").value,
        +document.getElementById("projects").value,
        +document.getElementById("certs").value
    ];

    if (!centroids) await initializeModel();

    const clusterId = getClosestCluster(centroids, userInput);

    const resultCard = document.getElementById("result");
    resultCard.classList.remove("hidden");
    resultCard.className = `card cluster-${clusterId}`;
    document.getElementById("clusterId").textContent = `#${clusterId}`;
    document.getElementById("clusterDesc").textContent = clusterDescriptions[clusterId];

    drawChart(userInput, centroids);
});

initializeModel();