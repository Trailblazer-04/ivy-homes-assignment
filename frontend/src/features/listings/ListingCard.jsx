import { Link } from 'react-router-dom';
import { formatArea, formatMoney } from '../../shared/formatters.js';
import { getPropertyImage } from '../../shared/propertyImages.js';

export function ListingCard({ item, saved, onToggle }) {
  const image = getPropertyImage(item.listing_id);
  return <article className="listing-card"><div className="image-placeholder" style={{ '--property-image': `url(${image})` }} role="img" aria-label={`${item.apartment_name} property photo`}><span>{item.property_type}</span><button className={`heart ${saved ? 'saved' : ''}`} onClick={() => onToggle(item.listing_id)}>{saved ? '♥' : '♡'}</button></div><div className="listing-content"><div className="card-top"><span className="tag">{item.is_verified ? 'Verified' : 'Reviewing'}</span><small>{item.locality}</small></div><h3>{item.apartment_name}</h3><p className="muted">{item.bedroom} BHK · {formatArea(item.carpet_area)} · {item.furnishing}</p><div className="card-bottom"><strong>{formatMoney(item.price)}</strong><Link to={`/listing/${item.listing_id}`}>View home <span>↗</span></Link></div></div></article>;
}