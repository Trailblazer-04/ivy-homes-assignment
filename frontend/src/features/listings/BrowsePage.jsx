import { useEffect, useMemo, useState } from 'react';
import { apiRequest, authHeaders } from '../../api/client.js';
import { getSession } from '../../shared/session.js';
import { useSaved } from '../../shared/hooks/useSaved.js';
import { ListingCard } from './ListingCard.jsx';

const emptyFilters = { locality: '', bedroom: '', furnishing: '', min_price: '', max_price: '' };

function priceMatches(item, filters) {
  const price = Number(item.price);
  const minimum = filters.min_price === '' ? 0 : Number(filters.min_price);
  const maximum = filters.max_price === '' ? Infinity : Number(filters.max_price);
  return Number.isFinite(price) && price >= minimum && price <= maximum;
}

export function BrowsePage({ type = 'listings' }) {
  const session = getSession();
  const { saved, toggleSaved } = useSaved();
  const [data, setData] = useState({ results: [], total: 0 });
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load(nextFilters = appliedFilters) {
    setLoading(true);
    setError('');
    const query = new URLSearchParams({ page: 1, limit: 200, ...Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value)) });
    if (nextFilters.bedroom) { query.delete('bedroom'); query.set('bhk', nextFilters.bedroom); }
    try { setData(await apiRequest(`/v1/${type}?${query}`, { headers: authHeaders(session) })); }
    catch (requestError) { setError(requestError.message); setData({ results: [], total: 0 }); }
    finally { setLoading(false); }
  }

  useEffect(() => { setFilters(emptyFilters); setAppliedFilters(emptyFilters); load(emptyFilters); }, [type]);

  const visibleHomes = useMemo(() => (data.results || []).filter((item) => priceMatches(item, appliedFilters)), [data.results, appliedFilters]);
  const hasFilters = Object.values(appliedFilters).some(Boolean);

  function updateFilter(name, value) { setFilters((currentFilters) => ({ ...currentFilters, [name]: value })); }

  function applyFilters() {
    const minimum = filters.min_price === '' ? 0 : Number(filters.min_price);
    const maximum = filters.max_price === '' ? Infinity : Number(filters.max_price);
    if (minimum > maximum) { setError('Minimum price cannot be greater than maximum price.'); return; }
    setAppliedFilters(filters);
    load(filters);
  }

  function resetFilters() { setFilters(emptyFilters); setAppliedFilters(emptyFilters); load(emptyFilters); }

  return <section className="content"><header className="page-header"><div><p className="eyebrow">{type === 'listings' ? 'Curated for you' : 'Live market view'}</p><h1>{type === 'listings' ? 'Find your next chapter.' : 'Rentals'}</h1><p className="muted">{visibleHomes.length.toLocaleString('en-IN')} matching homes in Bangalore · updated just now</p></div><button className="filter-button" onClick={() => load()}>↻ Refresh</button></header><div className="filter-bar"><input placeholder="Locality" value={filters.locality} onChange={(event) => updateFilter('locality', event.target.value)} /><select value={filters.bedroom} onChange={(event) => updateFilter('bedroom', event.target.value)}><option value="">Bedrooms</option><option value="1">1 BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option><option value="4">4 BHK</option></select><select value={filters.furnishing} onChange={(event) => updateFilter('furnishing', event.target.value)}><option value="">Furnishing</option><option>unfurnished</option><option>semi-furnished</option><option>fully-furnished</option></select><input inputMode="numeric" type="number" min="0" placeholder="Min price" value={filters.min_price} onChange={(event) => updateFilter('min_price', event.target.value)} /><input inputMode="numeric" type="number" min="0" placeholder="Max price" value={filters.max_price} onChange={(event) => updateFilter('max_price', event.target.value)} /><button className="primary" onClick={applyFilters}>Apply filters</button>{hasFilters && <button className="clear-filters" onClick={resetFilters}>Reset filters</button>}</div>{error && <p className="error filter-error">{error}</p>}{loading && <div className="loading">Loading live homes...</div>}{!loading && !error && visibleHomes.length === 0 && <div className="empty-state"><span>⌂</span><h2>No homes match these filters.</h2><p>Try widening your price range or choosing a different locality.</p>{hasFilters && <button className="primary" onClick={resetFilters}>Show all homes</button>}</div>}{!loading && !error && visibleHomes.length > 0 && <div className="listing-grid">{visibleHomes.map((item) => <ListingCard item={item} saved={saved.some((savedItem) => savedItem.listing_id === item.listing_id)} onToggle={toggleSaved} key={item.listing_id} />)}</div>}</section>;
}