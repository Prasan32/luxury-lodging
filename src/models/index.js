import Listing from './Listing.js';
import ListingImage from './ListingImage.js';

// Define associations
Listing.hasMany(ListingImage, { foreignKey: 'listingId', as: 'images' });
ListingImage.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

export { Listing, ListingImage };
