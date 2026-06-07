// Fractional SEO ROI projection model.
// Conservative S-curve over 12 months — most of the lift lands months 4-9.

export type Industry = 'saas' | 'ecommerce' | 'publishing' | 'local' | 'b2b' | 'other';
export type Scenario = 'conservative' | 'expected' | 'ambitious';

export interface RoiInputs {
  monthlyOrganicTraffic: number;
  conversionRatePct: number; // 0-100
  avgOrderValue: number;
  monthlyInvestment: number;
  industry: Industry;
  email?: string;
}

export interface RoiMonth {
  month: number;
  traffic: number;
  conversions: number;
  revenue: number;
  cumulativeRevenue: number;
  cumulativeInvestment: number;
  cumulativeNet: number;
}

export interface RoiScenario {
  scenario: Scenario;
  trafficLiftPct: number;
  months: RoiMonth[];
  totalRevenue: number;
  totalInvestment: number;
  netGain: number;
  roiMultiple: number;
  paybackMonth: number | null;
  endTraffic: number;
}

export interface RoiReport {
  inputs: RoiInputs;
  baselineMonthlyRevenue: number;
  scenarios: Record<Scenario, RoiScenario>;
  comparisons: {
    fullTimeAnnual: number;
    agencyAnnual: number;
    fractionalAnnual: number;
  };
  generatedAt: string;
}

const INDUSTRY_MULT: Record<Industry, number> = {
  saas: 1.3,
  ecommerce: 1.0,
  publishing: 0.9,
  local: 1.1,
  b2b: 1.4,
  other: 1.0,
};

const SCENARIO_LIFT_BASE: Record<Scenario, number> = {
  conservative: 0.30,
  expected: 0.75,
  ambitious: 1.50,
};

// S-curve weights months 1-12 — slow start, mid-period acceleration, plateau
const RAMP = [0.03, 0.08, 0.16, 0.28, 0.42, 0.57, 0.70, 0.80, 0.87, 0.92, 0.96, 1.0];

export function buildScenario(
  inputs: RoiInputs,
  scenario: Scenario
): RoiScenario {
  const lift = SCENARIO_LIFT_BASE[scenario] * INDUSTRY_MULT[inputs.industry];
  const baseTraffic = Math.max(0, inputs.monthlyOrganicTraffic);
  const cvr = Math.max(0, inputs.conversionRatePct) / 100;
  const aov = Math.max(0, inputs.avgOrderValue);
  const monthly = Math.max(0, inputs.monthlyInvestment);
  const baselineRevenue = baseTraffic * cvr * aov;

  const months: RoiMonth[] = [];
  let cumulativeRevenue = 0;
  let cumulativeInvestment = 0;
  let paybackMonth: number | null = null;

  for (let m = 1; m <= 12; m++) {
    const liftAchieved = RAMP[m - 1] * lift;
    const traffic = baseTraffic * (1 + liftAchieved);
    const conversions = traffic * cvr;
    const revenue = conversions * aov;
    const incremental = Math.max(0, revenue - baselineRevenue);

    cumulativeRevenue += incremental;
    cumulativeInvestment += monthly;
    const cumulativeNet = cumulativeRevenue - cumulativeInvestment;

    if (paybackMonth === null && cumulativeNet >= 0 && cumulativeInvestment > 0) {
      paybackMonth = m;
    }

    months.push({
      month: m,
      traffic: Math.round(traffic),
      conversions: Math.round(conversions),
      revenue: Math.round(revenue),
      cumulativeRevenue: Math.round(cumulativeRevenue),
      cumulativeInvestment: Math.round(cumulativeInvestment),
      cumulativeNet: Math.round(cumulativeNet),
    });
  }

  const totalRevenue = months[months.length - 1].cumulativeRevenue;
  const totalInvestment = months[months.length - 1].cumulativeInvestment;
  const netGain = totalRevenue - totalInvestment;
  const roiMultiple = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;

  return {
    scenario,
    trafficLiftPct: Math.round(lift * 100),
    months,
    totalRevenue: Math.round(totalRevenue),
    totalInvestment: Math.round(totalInvestment),
    netGain: Math.round(netGain),
    roiMultiple: Math.round(roiMultiple * 10) / 10,
    paybackMonth,
    endTraffic: months[months.length - 1].traffic,
  };
}

export function buildReport(inputs: RoiInputs): RoiReport {
  const baselineMonthlyRevenue =
    inputs.monthlyOrganicTraffic * (inputs.conversionRatePct / 100) * inputs.avgOrderValue;

  const scenarios: Record<Scenario, RoiScenario> = {
    conservative: buildScenario(inputs, 'conservative'),
    expected: buildScenario(inputs, 'expected'),
    ambitious: buildScenario(inputs, 'ambitious'),
  };

  return {
    inputs,
    baselineMonthlyRevenue: Math.round(baselineMonthlyRevenue),
    scenarios,
    comparisons: {
      fullTimeAnnual: 165_000, // industry midpoint for senior SEO hire (salary + benefits + tax)
      agencyAnnual: 144_000, // ~$12k/mo midpoint
      fractionalAnnual: inputs.monthlyInvestment * 12,
    },
    generatedAt: new Date().toISOString(),
  };
}

function fmtUsd(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toLocaleString('en-US')}`;
}

function fmtNum(n: number): string {
  return n.toLocaleString('en-US');
}

export function renderRoiHtml(report: RoiReport): string {
  const { scenarios, inputs, baselineMonthlyRevenue, comparisons } = report;
  const e = scenarios.expected;

  const scenarioCard = (s: RoiScenario, title: string, color: string) => `
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-left:4px solid ${color};border-radius:10px;padding:18px;margin-bottom:14px;">
      <div style="font-weight:800;font-size:15px;color:#0b1220;">${title} <span style="font-weight:500;color:#6b7280;">· +${s.trafficLiftPct}% organic traffic over 12 mo</span></div>
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:10px;font-size:13px;">
        <tr><td style="color:#6b7280;padding:4px 0;">Year-1 revenue lift</td><td style="text-align:right;font-weight:700;color:#0b1220;">${fmtUsd(s.totalRevenue)}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Year-1 investment</td><td style="text-align:right;color:#0b1220;">${fmtUsd(s.totalInvestment)}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Net gain</td><td style="text-align:right;font-weight:700;color:${s.netGain >= 0 ? '#10b981' : '#ef4444'};">${fmtUsd(s.netGain)}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">ROI multiple</td><td style="text-align:right;font-weight:700;color:#0b1220;">${s.roiMultiple}×</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Payback period</td><td style="text-align:right;color:#0b1220;">${s.paybackMonth ? `Month ${s.paybackMonth}` : 'Not in 12 mo'}</td></tr>
      </table>
    </div>
  `;

  const monthRow = (m: RoiMonth) => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #eef0f4;font-variant-numeric:tabular-nums;">${m.month}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eef0f4;text-align:right;font-variant-numeric:tabular-nums;">${fmtNum(m.traffic)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eef0f4;text-align:right;font-variant-numeric:tabular-nums;">${fmtNum(m.conversions)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eef0f4;text-align:right;font-variant-numeric:tabular-nums;">${fmtUsd(m.revenue)}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eef0f4;text-align:right;font-variant-numeric:tabular-nums;color:${m.cumulativeNet >= 0 ? '#10b981' : '#ef4444'};">${fmtUsd(m.cumulativeNet)}</td>
    </tr>
  `;

  return `
    <p style="font-size:15px;line-height:1.7;">Here is the full 12-month projection for a fractional SEO engagement at <strong>${fmtUsd(inputs.monthlyInvestment)}/mo</strong>, based on your inputs.</p>

    <div style="background:#0b1220;color:#fff;border-radius:12px;padding:20px 22px;margin:18px 0;">
      <div style="font-size:13px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">Expected case — year 1</div>
      <div style="font-size:34px;font-weight:900;line-height:1.1;margin-top:4px;">${fmtUsd(e.netGain)} <span style="font-size:18px;font-weight:600;color:#9ca3af;">net gain</span></div>
      <div style="margin-top:6px;font-size:14px;color:#cbd5e1;">${e.roiMultiple}× ROI · payback ${e.paybackMonth ? `month ${e.paybackMonth}` : '>12 mo'} · end-state ${fmtNum(e.endTraffic)} monthly visits</div>
    </div>

    <h2 style="margin:22px 0 8px;font-size:18px;">Three scenarios</h2>
    ${scenarioCard(scenarios.conservative, 'Conservative', '#f59e0b')}
    ${scenarioCard(scenarios.expected, 'Expected', '#3b82f6')}
    ${scenarioCard(scenarios.ambitious, 'Ambitious', '#10b981')}

    <h2 style="margin:22px 0 8px;font-size:18px;">Your inputs</h2>
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;">
      <tr><td style="color:#6b7280;padding:4px 0;">Current monthly organic traffic</td><td style="text-align:right;">${fmtNum(inputs.monthlyOrganicTraffic)}</td></tr>
      <tr><td style="color:#6b7280;padding:4px 0;">Conversion rate</td><td style="text-align:right;">${inputs.conversionRatePct}%</td></tr>
      <tr><td style="color:#6b7280;padding:4px 0;">Average order value</td><td style="text-align:right;">${fmtUsd(inputs.avgOrderValue)}</td></tr>
      <tr><td style="color:#6b7280;padding:4px 0;">Industry</td><td style="text-align:right;text-transform:capitalize;">${inputs.industry}</td></tr>
      <tr><td style="color:#6b7280;padding:4px 0;">Baseline monthly organic revenue</td><td style="text-align:right;font-weight:700;">${fmtUsd(baselineMonthlyRevenue)}</td></tr>
      <tr><td style="color:#6b7280;padding:4px 0;">Fractional investment</td><td style="text-align:right;font-weight:700;">${fmtUsd(inputs.monthlyInvestment)}/mo</td></tr>
    </table>

    <h2 style="margin:22px 0 8px;font-size:18px;">Month-by-month projection (expected case)</h2>
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border:1px solid #e5e7eb;border-radius:8px;border-collapse:separate;overflow:hidden;font-size:13px;">
      <thead><tr style="background:#f9fafb;">
        <th style="text-align:left;padding:8px;font-weight:700;">Mo</th>
        <th style="text-align:right;padding:8px;font-weight:700;">Traffic</th>
        <th style="text-align:right;padding:8px;font-weight:700;">Conv.</th>
        <th style="text-align:right;padding:8px;font-weight:700;">Revenue</th>
        <th style="text-align:right;padding:8px;font-weight:700;">Cum. net</th>
      </tr></thead>
      <tbody>${e.months.map(monthRow).join('')}</tbody>
    </table>

    <h2 style="margin:22px 0 8px;font-size:18px;">Cost vs the alternatives</h2>
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;">
      <tr><td style="color:#6b7280;padding:4px 0;">Full-time senior SEO hire (salary + benefits)</td><td style="text-align:right;">${fmtUsd(comparisons.fullTimeAnnual)}/yr</td></tr>
      <tr><td style="color:#6b7280;padding:4px 0;">Mid-tier agency retainer</td><td style="text-align:right;">${fmtUsd(comparisons.agencyAnnual)}/yr</td></tr>
      <tr><td style="color:#6b7280;padding:4px 0;font-weight:700;">Fractional (your scenario)</td><td style="text-align:right;font-weight:700;color:#0b1220;">${fmtUsd(comparisons.fractionalAnnual)}/yr</td></tr>
    </table>

    <p style="margin-top:24px;font-size:15px;line-height:1.7;">These projections assume engaged execution — schema, content, technical, and authority work done on the schedule that produces the ramp curve above. Want to walk through the assumptions for your specific situation? The free 60-minute consultation is exactly that conversation.</p>
  `;
}
