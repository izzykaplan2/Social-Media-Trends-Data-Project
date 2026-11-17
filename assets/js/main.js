// Shared site script. Loaded on every page.
//
// 1. Asset slots   <figure class="asset-slot" data-src="path/without/extension" ...>
//    Tries .svg/.webp/.png/.jpg in order. Shows a labeled placeholder if none exist.
//    Files live in assets/visualassets/ (see the README there).
//
// 2. Charts        <figure class="chart" data-chart="path/to/chart.json">
//    Renders a Chart.js chart from a JSON file in data/charts/ (see the README there).
//
// 3. Stats         <div class="stats" data-stats="path/to/headline-stats.json">

const ASSET_EXTENSIONS = ["svg", "webp", "png", "jpg"];

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll(".asset-slot").forEach(loadAssetSlot);
  document.querySelectorAll(".chart[data-chart]").forEach(loadChart);
  document.querySelectorAll(".stats[data-stats]").forEach(loadStats);
});

/* ---------- Asset slots ---------- */

function loadAssetSlot(slot) {
  const base = slot.dataset.src;
  const label = slot.dataset.label || "Visual asset";
  const size = slot.dataset.size || "";
  const hasExt = /\.[a-z0-9]{2,4}$/i.test(base);
  const candidates = hasExt ? [base] : ASSET_EXTENSIONS.map((ext) => `${base}.${ext}`);

  const img = new Image();
  img.alt = slot.dataset.alt || label;
  img.decoding = "async";
  let i = 0;

  img.onload = () => {
    slot.classList.add("is-loaded");
    slot.replaceChildren(img);
  };
  img.onerror = () => {
    i += 1;
    if (i < candidates.length) img.src = candidates[i];
    else showAssetPlaceholder(slot, label, size, base);
  };
  img.src = candidates[0];
}

function showAssetPlaceholder(slot, label, size, base) {
  const file = base.replace(/^(\.\.\/)+/, "");
  slot.classList.add("is-empty");
  slot.innerHTML = `
    <div class="asset-slot__inner">
      <strong>${escapeHtml(label)}</strong>
      ${size ? `<span>${escapeHtml(size)}</span>` : ""}
      <code>${escapeHtml(file)}.png / .jpg / .svg</code>
    </div>`;
}

/* ---------- Charts ---------- */

async function loadChart(figure) {
  const url = figure.dataset.chart;
  let spec;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    spec = await res.json();
  } catch (err) {
    return showChartError(figure, url, err);
  }

  if (typeof Chart === "undefined") {
    return showChartError(figure, url, new Error("Chart.js did not load"));
  }

  figure.innerHTML = `
    <figcaption class="chart__head">
      <span class="chart__title">${escapeHtml(spec.title || "")}</span>
      ${spec.placeholder ? '<span class="badge">Sample data</span>' : ""}
      ${spec.subtitle ? `<span class="chart__subtitle">${escapeHtml(spec.subtitle)}</span>` : ""}
    </figcaption>
    <div class="chart__canvas"><canvas role="img" aria-label="${escapeHtml(spec.title || "Chart")}"></canvas></div>
    ${spec.source ? `<p class="chart__source">Source: ${escapeHtml(spec.source)}</p>` : ""}`;

  new Chart(figure.querySelector("canvas"), toChartConfig(spec));
}

function toChartConfig(spec) {
  const css = getComputedStyle(document.documentElement);
  const v = (name) => css.getPropertyValue(name).trim();
  const palette = [1, 2, 3, 4, 5, 6].map((n) => v(`--chart-${n}`));
  const text = v("--muted");
  const grid = v("--border");

  const kind = spec.type || "bar";
  const isPie = kind === "pie" || kind === "doughnut";
  const chartType = isPie ? kind : kind === "line" ? "line" : "bar";
  const series = spec.series || [];

  const datasets = isPie
    ? [{
        label: series[0]?.name || "",
        data: series[0]?.values || [],
        backgroundColor: palette,
        borderColor: v("--bg"),
        borderWidth: 2,
      }]
    : series.map((s, i) => ({
        label: s.name,
        data: s.values,
        backgroundColor: palette[i % palette.length],
        borderColor: palette[i % palette.length],
        borderWidth: kind === "line" ? 2 : 0,
        borderRadius: kind === "line" ? 0 : 4,
        pointRadius: kind === "line" ? 3 : 0,
        tension: 0.25,
      }));

  const axis = (title) => ({
    title: { display: !!title, text: title, color: text },
    ticks: { color: text },
    grid: { color: grid },
  });

  return {
    type: chartType,
    data: { labels: spec.labels || [], datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: kind === "hbar" ? "y" : "x",
      plugins: {
        legend: {
          display: isPie || series.length > 1,
          position: "bottom",
          labels: { color: text, usePointStyle: true },
        },
      },
      scales: isPie ? {} : {
        x: { ...axis(kind === "hbar" ? spec.y_label : spec.x_label), stacked: kind === "stacked" },
        y: { ...axis(kind === "hbar" ? spec.x_label : spec.y_label), stacked: kind === "stacked", beginAtZero: true },
      },
    },
  };
}

function showChartError(figure, url, err) {
  const local = location.protocol === "file:";
  figure.classList.add("chart--error");
  figure.innerHTML = `
    <div class="asset-slot__inner">
      <strong>Chart couldn't load</strong>
      <code>${escapeHtml(url.replace(/^(\.\.\/)+/, ""))}</code>
      <span>${local
        ? "Open the site through a local server (python3 -m http.server) — browsers block JSON on file://."
        : escapeHtml(err.message)}</span>
    </div>`;
}

/* ---------- Headline stats ---------- */

async function loadStats(container) {
  try {
    const res = await fetch(container.dataset.stats);
    const data = await res.json();
    container.innerHTML = (data.stats || [])
      .map((s) => `
        <div class="stat">
          <span class="stat__value">${escapeHtml(s.value)}</span>
          <span class="stat__label">${escapeHtml(s.label)}</span>
        </div>`)
      .join("");
    if (data.placeholder) container.insertAdjacentHTML("beforeend", '<span class="badge stats__badge">Sample data</span>');
  } catch {
    container.innerHTML = '<p class="muted">Stats couldn\'t load — see data/charts/headline-stats.json.</p>';
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
