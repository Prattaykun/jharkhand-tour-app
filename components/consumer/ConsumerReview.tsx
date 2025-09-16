// components/ConsumerReview.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSessionContext, useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

interface Review {
  id: string;
  user_id: string;
  type: 'place' | 'hotel' | 'event';
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  place_id: string | null;
  hotel_id: string | null;
  event_id: string | null;
  item_name: string;
  item_image?: string;
}
interface ConsumerReviewProps {
  user: any; // or the proper Supabase user type
}

interface SearchResult {
  id: string;
  type: 'place' | 'hotel' | 'event';
  name: string;
  image: string | null;
  rating?: number;
  location?: string;
  description?: string;
  [key: string]: any;
}

export default function ConsumerReview({ user }: ConsumerReviewProps) { 
   const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    places: true,
    hotels: true,
    events: true
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [userImage, setUserImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  // add after other useState hooks
const [browseItems, setBrowseItems] = useState<SearchResult[]>([]);
const [browsePage, setBrowsePage] = useState(1);
const browsePerPage = 12;
const [browseLoading, setBrowseLoading] = useState(false);

  const { isLoading: sessionLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const resultsPerPage = 12;

  // Fetch user reviews on component mount
  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user reviews:', error);
        return;
      }
      
      if (data) {
        setUserReviews(data);
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    }
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchQuery, 
          filters,
          limit: 50 
        })
      });
      
      if (!searchResponse.ok) throw new Error('Search failed');
      
      const { results } = await searchResponse.json();
      
      const filteredResults = results.filter((result: SearchResult) => {
        if (result.type === 'place' && filters.places) return true;
        if (result.type === 'hotel' && filters.hotels) return true;
        if (result.type === 'event' && filters.events) return true;
        return false;
      });
      
      setSearchResults(filteredResults);
      setCurrentPage(1);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters]);
  // Fetch browse items on component mount and when browsePage changes
  useEffect(() => {
  const fetchBrowseItems = async () => {
    setBrowseLoading(true);
    try {
      const res = await fetch(`/api/browse?page=${browsePage}&limit=${browsePerPage}`);
      if (!res.ok) throw new Error('Failed to load browse items');
      const { results } = await res.json();
      setBrowseItems(results);
    } catch (err) {
      console.error(err);
    } finally {
      setBrowseLoading(false);
    }
  };
  fetchBrowseItems();
}, [browsePage]);

  // Debounced search effect
  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (searchQuery.trim()) {
      setTypingTimeout(
        setTimeout(() => {
          handleSearch();
        }, 1000)
      );
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [searchQuery, filters, handleSearch]);

  const handleFilterToggle = (filterType: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = async () => {
    // Check if user is available
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }
    
    if (!selectedItem || userRating === 0) {
      console.log('Missing required data:', { user, selectedItem, userRating });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const reviewData: Record<string, any> = {
        user_id: user.id,
        type: selectedItem.type,
        rating: userRating,
        comment: userComment,
        item_name: selectedItem.name,
        item_image: selectedItem.image,
        updated_at: new Date().toISOString(),
      };

      // Set the correct foreign key based on type
      if (selectedItem.type === 'place') reviewData.place_id = selectedItem.id;
      if (selectedItem.type === 'hotel') reviewData.hotel_id = selectedItem.id;
      if (selectedItem.type === 'event') reviewData.event_id = selectedItem.id;

      let data;
      let error;

      if (selectedReview) {
        // Update existing review
        ({ data, error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', selectedReview.id)
          .select());
      } else {
        // Create new review
        reviewData.created_at = new Date().toISOString();
        ({ data, error } = await supabase
          .from('reviews')
          .insert([reviewData])
          .select());
      }
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Update local state
      if (data && data.length > 0) {
        if (selectedReview) {
          setUserReviews(prev => prev.map(review => 
            review.id === selectedReview.id ? data[0] : review
          ));
        } else {
          setUserReviews(prev => [...prev, data[0]]);
        }
      }
      
      // Reset form
      setSelectedItem(null);
      setSelectedReview(null);
      setUserRating(0);
      setUserComment('');
      setUserImage(null);
      setImagePreview(null);
      
      alert(selectedReview ? 'Review updated successfully!' : 'Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemSelect = (item: SearchResult) => {
    setSelectedItem(item);
    setSelectedReview(null);
    
    // Check if user has already reviewed this item
    const existingReview = userReviews.find(review => {
      if (item.type === 'place') return review.place_id === item.id;
      if (item.type === 'hotel') return review.hotel_id === item.id;
      if (item.type === 'event') return review.event_id === item.id;
      return false;
    });

    if (existingReview) {
      setSelectedReview(existingReview);
      setUserRating(existingReview.rating);
      setUserComment(existingReview.comment);
    } else {
      setUserRating(0);
      setUserComment('');
      setUserImage(null);
      setImagePreview(null);
    }
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setUserRating(review.rating);
    setUserComment(review.comment);
    
    // Find the corresponding item from search results
    const itemId = review.place_id || review.hotel_id || review.event_id;
    const itemType = review.type;
    
    const item = searchResults.find(result => 
      result.id === itemId && result.type === itemType
    );
    
    if (item) {
      setSelectedItem(item);
    } else {
      // If item not in search results, create a mock item
      setSelectedItem({
        id: itemId || '',
        type: itemType,
        name: review.item_name,
        image: review.item_image || null,
      } as SearchResult);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) {
        console.error('Error deleting review:', error);
        return;
      }
      
      // Update local state
      setUserReviews(prev => prev.filter(review => review.id !== reviewId));
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('There was an error deleting your review. Please try again.');
    }
  };

  // Calculate paginated results
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  // Check if user has reviewed an item
  const hasUserReviewed = (itemId: string, itemType: string) => {
    return userReviews.some(review => {
      if (itemType === 'place') return review.place_id === itemId;
      if (itemType === 'hotel') return review.hotel_id === itemId;
      if (itemType === 'event') return review.event_id === itemId;
      return false;
    });
  };

  // Add a loading state for session
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Add a check for authenticated user
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
            Rate & Review Experiences
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Share your experiences with places, hotels, and events
          </p>
        </div>
        
        {/* Modern Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search places, hotels, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleFilterToggle('places')}
              className={`px-4 py-2 rounded-full transition-all flex items-center ${filters.places ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              <svg className={`w-4 h-4 mr-2 ${filters.places ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Places
              {filters.places && (
                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
            
            <button
              onClick={() => handleFilterToggle('hotels')}
              className={`px-4 py-2 rounded-full transition-all flex items-center ${filters.hotels ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              <svg className={`w-4 h-4 mr-2 ${filters.hotels ? 'text-purple-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Hotels
              {filters.hotels && (
                <span className="ml-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
            
            <button
              onClick={() => handleFilterToggle('events')}
              className={`px-4 py-2 rounded-full transition-all flex items-center ${filters.events ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              <svg className={`w-4 h-4 mr-2 ${filters.events ? 'text-green-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Events
              {filters.events && (
                <span className="ml-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Search Results */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!isLoading && searchResults.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Search Results</h2>
              <p className="text-gray-600">{searchResults.length} results found</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentResults.map((item) => {
                const userHasReviewed = hasUserReviewed(item.id, item.type);
                
                return (
                  <div 
                    key={`${item.type}-${item.id}`} 
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => handleItemSelect(item)}
                  >
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                        {userHasReviewed && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Reviewed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 capitalize">{item.type}</p>
                      {item.rating && (
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {'★'.repeat(Math.round(item.rating))}
                            {'☆'.repeat(5 - Math.round(item.rating))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{item.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {item.description && (
                        <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === pageNum 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                            : 'bg-white border border-gray-300 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <span className="px-2 py-2 text-gray-500">...</span>
                  )}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 flex items-center"
                  >
                    Next
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
        
        {/* Review Modal */}
        {(selectedItem || selectedReview) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedReview ? 'Edit Review' : 'Review'} {selectedItem?.name || selectedReview?.item_name}
                  </h2>
                  <button 
                    onClick={() => {
                      setSelectedItem(null);
                      setSelectedReview(null);
                      setUserImage(null);
                      setImagePreview(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="text-3xl focus:outline-none transition-transform hover:scale-110"
                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                      >
                        {star <= userRating ? 
                          <span className="text-yellow-400">★</span> : 
                          <span className="text-gray-300">☆</span>
                        }
                      </button>
                    ))}
                  </div>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    Add Your Photo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  {selectedReview && (
                    <button
                      onClick={() => handleDeleteReview(selectedReview.id)}
                      className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setSelectedReview(null);
                      setUserImage(null);
                      setImagePreview(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={userRating === 0 || isSubmitting}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {selectedReview ? 'Updating...' : 'Submitting...'}
                      </>
                    ) : selectedReview ? 'Update Review' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* User Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Reviews</h2>
          
          {userReviews.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-gray-600">You haven't submitted any reviews yet.</p>
              <p className="text-gray-500 text-sm mt-2">Search for places, hotels, or events to add your first review!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg capitalize">{review.item_name}</h3>
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  <p className="text-sm text-gray-500">
                    Reviewed on {new Date(review.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  {review.updated_at !== review.created_at && (
                    <p className="text-sm text-gray-500 mt-1">
                      Updated on {new Date(review.updated_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Browse & Review Section */}
<div className="mt-16">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
    Explore & Review
  </h2>

  {browseLoading && (
    <div className="flex justify-center my-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )}

  {!browseLoading && browseItems.length > 0 && (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {browseItems.map((item) => {
          const userHasReviewed = hasUserReviewed(item.id, item.type);
          return (
            <div
              key={`browse-${item.type}-${item.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleItemSelect(item)}
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                  {userHasReviewed && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Reviewed
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2 capitalize">{item.type}</p>
                {item.rating && (
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.round(item.rating))}
                      {'☆'.repeat(5 - Math.round(item.rating))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{item.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setBrowsePage(p => Math.max(p - 1, 1))}
            disabled={browsePage === 1}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 flex items-center"
          >
            ‹ Prev
          </button>
          <button
            onClick={() => setBrowsePage(p => p + 1)}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 flex items-center"
          >
            Next ›
          </button>
        </nav>
      </div>
    </>
  )}
</div>

      </div>
    </div>
  );
}