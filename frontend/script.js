// Global placeholder variable for the Chart instance to prevent multiple initialization errors
let demandChart = null;

async function fetchDashboardData() {
    try {
        // Points natively to your local running FastAPI instance
        const response = await fetch('http://127.0.0.1:8000/api/v1/forecast');
        if (!response.ok) throw new Error("Backend connection failed.");
        
        const data = await response.json();
        
        // 1. Update the Summary Metric Display Panels
        const avgTemp = data.temperature.reduce((a, b) => a + b, 0) / data.temperature.length;
        const avgCloud = data.cloud_cover.reduce((a, b) => a + b, 0) / data.cloud_cover.length;
        
        document.getElementById('widget-temp').innerText = `${avgTemp.toFixed(1)} °C`;
        document.getElementById('widget-cloud').innerText = `${avgCloud.toFixed(0)} %`;
        
        // Find if a holiday occurs anywhere in the forecast window 
        const holidayIdx = data.is_holiday.indexOf(1);
        if (holidayIdx !== -1) {
            document.getElementById('widget-holiday').innerText = data.holiday_names[holidayIdx];
            document.getElementById('widget-holiday').className = "text-sm font-bold text-amber-400 mt-2 truncate";
        } else {
            document.getElementById('widget-holiday').innerText = "Normal Operational Schedule";
            document.getElementById('widget-holiday').className = "text-sm font-bold text-emerald-400 mt-2 truncate";
        }

        // 2. Format Chart Data Structures
        renderChart(data);

    } catch (error) {
        console.error("Dashboard Error:", error);
        document.getElementById('widget-holiday').innerText = "API Offline Error";
        document.getElementById('widget-holiday').className = "text-sm font-bold text-red-400 mt-2";
    }
}

function renderChart(data) {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    
    // Clean old chart instances before generating fresh plots to avoid artifact ghosting
    if (demandChart) {
        demandChart.destroy();
    }

    // Extract time components out of full timestamp strings for neat X-axis tick labels
    const lightLabels = data.timestamps.map(ts => ts.split(' ')[1].substring(0, 5));

    demandChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: lightLabels,
            datasets: [
                {
                    label: 'Predicted Grid Load (MW)',
                    data: data.forecasted_load,
                    borderColor: '#10b981', // emerald
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'Temperature (°C)',
                    data: data.temperature,
                    borderColor: '#f59e0b', // amber
                    borderWidth: 1.5,
                    borderDash: [4, 4],
                    pointRadius: 0,
                    fill: false,
                    tension: 0.2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { color: '#1f2937' },
                    ticks: { color: '#9ca3af', maxTicksLimit: 24 }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: 'Grid Load Magnitude (MW)', color: '#10b981' },
                    grid: { color: '#1f2937' },
                    ticks: { color: '#9ca3af' }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: { display: true, text: 'Temperature Context (°C)', color: '#f59e0b' },
                    grid: { drawOnChartArea: false }, // avoid grid line clutter
                    ticks: { color: '#9ca3af' }
                }
            },
            plugins: {
                legend: { labels: { color: '#f3f4f6' } }
            }
        }
    });
}

// Initial fire on layout ready
window.addEventListener('DOMContentLoaded', fetchDashboardData);