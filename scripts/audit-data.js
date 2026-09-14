import 'dotenv/config';
import { writeFile } from 'node:fs/promises';

const baseUrl = (process.env.IVY_API_BASE_URL || 'https://solve.ivy.homes').replace(/\/$/, '');
const apiKey = process.env.IVY_API_KEY;
const password = process.env.IVY_DEMO_PASSWORD || 'afe26fc9df';
const email = process.env.IVY_DEMO_EMAIL || 'demo1@ivy.homes';
const assignedLocality = (process.env.IVY_ASSIGNED_LOCALITY || 'electronic city').toLowerCase();
const reference = new Date('2026-09-10T00:00:00+05:30');
const weekStart = new Date(reference.getTime() - 7 * 24 * 60 * 60 * 1000);

if (!apiKey) throw new Error('IVY_API_KEY is required in .env');

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey, ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${path}: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function authenticate() {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return { Authorization: `Bearer ${result.access_token}` };
}

async function fetchAll(path, headers, idField) {
  const results = [];
  const seen = new Set();
  const limit = 200;
  let offset = 0;
  let total = null;
  do {
    const page = await request(`${path}?limit=${limit}&offset=${offset}`, { headers });
    if (total === null) total = Number(page.total ?? 0);
    for (const record of page.results || []) {
      const id = record[idField];
      if (!id || !seen.has(id)) {
        results.push(record);
        if (id) seen.add(id);
      }
    }
    offset += Number(page.count ?? page.results?.length ?? 0);
    process.stdout.write(`\r${path}: ${results.length}/${total}`);
    if (!page.has_more || !page.results?.length) break;
  } while (true);
  process.stdout.write('\n');
  return results;
}

function number(value) {
  return typeof value === 'number' ? value : Number(value);
}

function ids(records) {
  return records.map((record) => record.listing_id).filter(Boolean).sort();
}

function duplicateGroups(records, key) {
  const groups = new Map();
  for (const record of records) {
    const value = key(record);
    if (!value) continue;
    const group = groups.get(value) || [];
    group.push(record);
    groups.set(value, group);
  }
  return [...groups.values()].filter((group) => group.length > 1);
}

function propertyKey(record) {
  return [record.apartment_name, record.locality, record.property_type, record.bedroom, record.carpet_area, record.super_built_up_area].map((value) => String(value ?? '').trim().toLowerCase()).join('|');
}

function corruptCandidates(listings) {
  return listings.filter((item) => (
    number(item.price) <= 0 ||
    number(item.carpet_area) <= 0 ||
    number(item.super_built_up_area) <= 0 ||
    number(item.bedroom) < 0 ||
    number(item.bathroom) < 0 ||
    (number(item.floor) > number(item.total_floors) && number(item.total_floors) > 0) ||
    number(item.latitude) < -90 || number(item.latitude) > 90 ||
    number(item.longitude) < -180 || number(item.longitude) > 180
  ));
}

function fakeCandidates(listings) {
  return listings.filter((item) => (
    item.is_verified === false && /enquir|automated tools|ai assistants|not real|fake/i.test(item.description || '')
  ));
}

function projectPriceInr(value) {
  const price = number(value);
  return price < 10000 ? Math.round(price * 10000000) : Math.round(price);
}

async function main() {
  const headers = await authenticate();
  const [listings, rentals, projects] = await Promise.all([
    fetchAll('/v1/listings', headers, 'listing_id'),
    fetchAll('/v1/rentals', headers, 'listing_id'),
    fetchAll('/v1/projects', headers, 'project_id')
  ]);

  const corrupt = corruptCandidates(listings);
  const fake = fakeCandidates(listings);
  const duplicatePropertyGroups = duplicateGroups(listings, propertyKey);
  const duplicateUrlGroups = duplicateGroups(listings, (item) => item.listing_url);
  const duplicateContactGroups = duplicateGroups(listings, (item) => item.posted_by_contact);
  const duplicateCoordinateGroups = duplicateGroups(listings, (item) => `${item.latitude}|${item.longitude}`);
  const active = listings.filter((item) => item.is_live === true);
  const rentalsInLocality = rentals.filter((item) => String(item.locality).toLowerCase() === assignedLocality);
  const twoBedroom = active.filter((item) => item.bedroom === 2 && !corrupt.some((bad) => bad.listing_id === item.listing_id) && !fake.some((bad) => bad.listing_id === item.listing_id));
  const lastSevenDays = listings.filter((item) => {
    const posted = new Date(item.posted_at);
    return posted >= weekStart && posted < reference;
  });
  const costliest = projects.reduce((best, project) => !best || projectPriceInr(project.price_max) > projectPriceInr(best.price_max) ? project : best, null);
  const projectListingCounts = new Map();
  for (const item of listings) {
    if (!item.project_id) continue;
    projectListingCounts.set(item.project_id, (projectListingCounts.get(item.project_id) || 0) + 1);
  }
  const wrongProjectCounts = projects.filter((project) => projectListingCounts.get(project.project_id) !== number(project.total_listings));

  const report = {
    generated_at: new Date().toISOString(),
    assigned_locality: assignedLocality,
    totals: { listings: listings.length, rentals: rentals.length, projects: projects.length },
    answers: {
      total_listing_records: listings.length,
      unique_properties: new Set(listings.map(propertyKey)).size,
      active_listings: active.length,
      corrupt_listing_ids: ids(corrupt),
      total_monthly_rent: rentalsInLocality.reduce((sum, item) => sum + number(item.price), 0),
      avg_price_per_sqft_2bhk: Number((twoBedroom.reduce((sum, item) => sum + number(item.price) / number(item.carpet_area), 0) / (twoBedroom.length || 1)).toFixed(2)),
      costliest_project: costliest ? { project_id: costliest.project_id, price_max_inr: projectPriceInr(costliest.price_max) } : { project_id: '', price_max_inr: 0 },
      listings_last_7_days: lastSevenDays.length,
      fake_listing_ids: ids(fake),
      projects_with_wrong_listing_count: wrongProjectCounts.length
    },
    evidence: {
      duplicate_property_groups: duplicatePropertyGroups.slice(0, 20).map((group) => ids(group)),
      duplicate_url_groups: duplicateUrlGroups.slice(0, 20).map((group) => ids(group)),
      duplicate_contact_groups: duplicateContactGroups.slice(0, 20).map((group) => ids(group)),
      duplicate_coordinate_groups: duplicateCoordinateGroups.slice(0, 20).map((group) => ids(group)),
      corrupt_records: corrupt.slice(0, 20),
      fake_records: fake.slice(0, 20),
      wrong_project_counts: wrongProjectCounts.slice(0, 20).map((project) => ({ project_id: project.project_id, reported: project.total_listings, actual: projectListingCounts.get(project.project_id) || 0 }))
    }
  };

  await writeFile('audit-report.json', `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.answers, null, 2));
  console.log('Wrote audit-report.json');
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
