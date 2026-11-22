// Chart.js renderers for charts 2, 3 and 5. Each takes the rows returned by the matching query in queries.sql.
// Needs Chart.js 4 on the page: <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js"></script>
// Rows come from api/charts.php?chart=trajectories|heatmap|controversy (see analytics.html).
const PALETTE = ['#2a6fdb', '#e4572e', '#17a398', '#f3a712', '#7b4fd6', '#d1495b', '#3d5a80', '#6a994e'];

// Chart 2: rows = [{video_id, title, day, views}]
export function renderTrajectories(canvas, rows) {
  const byVideo = {};
  for (const r of rows) (byVideo[r.video_id] ??= { title: r.title, pts: [] }).pts.push({ x: +r.day, y: +r.views });
  return new Chart(canvas, {
    type: 'line',
    data: {
      datasets: Object.values(byVideo).map((v, i) => ({
        label: v.title.slice(0, 40), data: v.pts,
        borderColor: PALETTE[i % 8], backgroundColor: PALETTE[i % 8], tension: 0.2, pointRadius: 2,
      })),
    },
    options: {
      parsing: false,
      scales: {
        x: { type: 'linear', title: { display: true, text: 'Days since first trending' } },
        y: { title: { display: true, text: 'Views' }, ticks: { callback: v => v / 1e6 + 'M' } },
      },
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } },
    },
  });
}

// Chart 3: rows = [{weekday, hour, videos}]. Chart.js has no heatmap, so this builds a CSS grid in `container`.
export function renderHeatmap(container, rows) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const grid = days.map(() => Array(24).fill(0));
  for (const r of rows) if (grid[+r.weekday] && +r.hour >= 0 && +r.hour < 24) grid[+r.weekday][+r.hour] = +r.videos;
  const max = Math.max(1, ...grid.flat());
  container.style.cssText = 'display:grid;grid-template-columns:40px repeat(24,1fr);gap:2px;font-size:11px';
  let html = '<div></div>' + [...Array(24).keys()].map(h => `<div style="text-align:center">${h}</div>`).join('');
  grid.forEach((row, w) => {
    html += `<div>${days[w]}</div>`;
    row.forEach((n, h) => {
      const a = n / max;
      html += `<div title="${days[w]} ${h}:00 UTC: ${n} videos" style="height:24px;display:flex;align-items:center;justify-content:center;border-radius:3px;background:rgba(42,111,219,${0.05 + a * 0.95});color:${a > 0.5 ? '#fff' : 'inherit'}">${n}</div>`;
    });
  });
  container.innerHTML = html;
}

// Chart 5: rows = [{video_id, title, views, comment_rate, dislike_share}]
export function renderControversy(canvas, rows) {
  // Log x-axis can't show 0, and rows without likes/dislikes have no dislike share
  rows = rows.filter(r => +r.comment_rate > 0 && r.dislike_share != null);
  return new Chart(canvas, {
    type: 'scatter',
    data: {
      datasets: [{
        data: rows.map(r => ({ x: +r.comment_rate, y: +r.dislike_share, t: r.title })),
        backgroundColor: rows.map(r => (+r.dislike_share > 20 ? 'rgba(209,73,91,.7)' : 'rgba(42,111,219,.35)')),
      }],
    },
    options: {
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.raw.t } } },
      scales: {
        x: { type: 'logarithmic', title: { display: true, text: 'Comments per 100 views (log)' } },
        y: { title: { display: true, text: 'Dislike share %' } },
      },
    },
  });
}
