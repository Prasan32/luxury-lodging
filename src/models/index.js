import Listing from './Listing.js';
import ListingImage from './ListingImage.js';
import ListingAmenity from './ListingAmenity.js';
import PaymentInfo from './PaymentInfo.js';
import Subscriber from './Subscriber.js';
import Review from './Review.js';

// Define associations
Listing.hasMany(ListingImage, { foreignKey: 'listingId', as: 'images' });
ListingImage.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

Listing.hasMany(ListingAmenity, { foreignKey: 'listingId', as: 'amenities' });
ListingAmenity.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

export { Listing, ListingImage, ListingAmenity, PaymentInfo, Subscriber, Review };
