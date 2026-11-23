// Renders the view-curve and rank charts on analytics.html from window.EMBER_FILMS (films-data.js).
// Plain script (not a module) so it runs when the page is opened straight from disk as well as on a server.
(function () {
  const PALETTE = ['#2a6fdb', '#e4572e', '#17a398', '#f3a712', '#7b4fd6', '#d1495b', '#5b8cc4', '#6a994e'];
  const RANK_COUNT = 12;
  const ROSE = '#17a398';
  const FELL = '#d1495b';
  const SAME = '#999999';

  function showError(figure, message) {
    figure.classList.add('is-error');
    const status = figure.querySelector('.chart-status');
    if (status) status.textContent = message;
  }

  function renderTrajectories(canvas, traj) {
    return new Chart(canvas, {
      type: 'line',
      data: {
        datasets: Object.entries(traj).map(([title, points], i) => ({
          label: title.slice(0, 42),
          data: points.map(([day, views]) => ({ x: day, y: views })),
          borderColor: PALETTE[i % PALETTE.length],
          backgroundColor: PALETTE[i % PALETTE.length],
          tension: 0.2,
          pointRadius: 2,
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

  // Top films by trailer views, each with its views rank and opening-weekend rank among those films.
  function rankFilms(films) {
    const byViews = [...films].sort((a, b) => b.views - a.views).slice(0, RANK_COUNT);
    const byOpening = [...byViews].sort((a, b) => b.open - a.open);
    return byViews.map((film, i) => ({ ...film, viewsRank: i + 1, openRank: byOpening.indexOf(film) + 1 }));
  }

  function rankColor(row) {
    if (row.openRank < row.viewsRank) return ROSE;
    if (row.openRank > row.viewsRank) return FELL;
    return SAME;
  }

  function renderSlope(canvas, ranked) {
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['YouTube trailer views rank', 'Opening weekend rank'],
        datasets: ranked.map(row => ({
          label: row.film,
          data: [row.viewsRank, row.openRank],
          borderColor: rankColor(row),
          backgroundColor: '#111014',
          borderWidth: 2,
          pointRadius: 4,
        })),
      },
      options: {
        scales: {
          y: { reverse: true, min: 1, max: RANK_COUNT, ticks: { stepSize: 1 }, title: { display: true, text: 'Rank' } },
        },
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 } } },
          tooltip: { callbacks: { label: c => `${c.dataset.label}: #${c.raw}` } },
        },
      },
    });
  }

  function fillRankTable(tbody, ranked) {
    const money = n => '$' + (n / 1e6).toFixed(1) + 'M';
    tbody.innerHTML = ranked.map(row => `
      <tr>
        <td>${row.film}</td>
        <td class="num">${row.views.toLocaleString()}</td>
        <td class="num">${row.viewsRank}</td>
        <td class="num">${money(row.open)}</td>
        <td class="num">${row.openRank}</td>
      </tr>`).join('');
  }

  const data = window.EMBER_FILMS;
  const trajFigure = document.querySelector('[data-static-chart="trajectories"]');
  const slopeFigure = document.querySelector('[data-static-chart="slope"]');

  if (typeof Chart === 'undefined' || !data) {
    const message = 'Chart couldn’t load: Chart.js or izzycharts/films-data.js is missing.';
    [trajFigure, slopeFigure].forEach(fig => fig && showError(fig, message));
    return;
  }

  const ranked = rankFilms(data.films);
  if (trajFigure) renderTrajectories(trajFigure.querySelector('canvas'), data.traj);
  if (slopeFigure) renderSlope(slopeFigure.querySelector('canvas'), ranked);
  const rankBody = document.querySelector('#rank-table tbody');
  if (rankBody) fillRankTable(rankBody, ranked);
})();
