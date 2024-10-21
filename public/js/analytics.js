// Fetch data from the server
fetch('/api/analytics')
    .then(response => response.json())
    .then(data => {
        createMarksChart(data);
        createSubjectsChart(data);
        createPlacementChart(data);
    });

function createMarksChart(data) {
    const ctx = document.getElementById('marksChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.students.map(s => s.name),
            datasets: [{
                label: 'DSA Score',
                data: data.students.map(s => s.dsa_score),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'WebDev Score',
                data: data.students.map(s => s.webdev_score),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }, {
                label: 'React Score',
                data: data.students.map(s => s.react_score),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createSubjectsChart(data) {
    const ctx = document.getElementById('subjectsChart').getContext('2d');
    const totalScores = data.students.reduce((acc, s) => {
        acc.dsa += s.dsa_score;
        acc.webdev += s.webdev_score;
        acc.react += s.react_score;
        return acc;
    }, {dsa: 0, webdev: 0, react: 0});

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['DSA', 'Web Development', 'React'],
            datasets: [{
                data: [totalScores.dsa, totalScores.webdev, totalScores.react],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
                ]
            }]
        }
    });
}

function createPlacementChart(data) {
    const ctx = document.getElementById('placementChart').getContext('2d');
    const placedCount = data.students.filter(s => s.placement_status === 'Placed').length;
    const notPlacedCount = data.students.length - placedCount;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Placed', 'Not Placed'],
            datasets: [{
                data: [placedCount, notPlacedCount],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ]
            }]
        }
    });
}
