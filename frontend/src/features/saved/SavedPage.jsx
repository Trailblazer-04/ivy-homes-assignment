import { ListingCard } from '../listings/ListingCard.jsx';
import { useSaved } from '../../shared/hooks/useSaved.js';

export function SavedPage() { const { saved, toggleSaved } = useSaved(); return <section className="content"><header className="page-header"><div><p className="eyebrow">Your shortlist</p><h1>Saved homes.</h1><p className="muted">{saved.length} places to come back to</p></div></header><div className="listing-grid">{saved.map((item) => <ListingCard key={item.listing_id} item={item} saved onToggle={toggleSaved} />)}</div></section>; }