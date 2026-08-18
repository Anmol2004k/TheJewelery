import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../data';
import type { Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: Category[] = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];
const SORTS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'];

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as Category) || 'All';
  
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const [activeSort, setActiveSort] = useState<string>('Featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let result = PRODUCTS;

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Sort
    switch (activeSort) {
      case 'Price: Low to High':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'Newest':
        result = [...result].sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      case 'Featured':
      default:
        result = [...result].sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
        break;
    }

    return result;
  }, [activeCategory, activeSort]);

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setSearchParams(cat === 'All' ? {} : { category: cat });
    setIsFilterOpen(false);
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white py-16 border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">
            {activeCategory === 'All' ? 'Complete Collection' : activeCategory}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            Explore our meticulously curated selection of fine jewellery, designed to capture the essence of elegance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center gap-2 uppercase tracking-widest text-sm font-semibold text-charcoal"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            <span className="text-sm text-gray-500 hidden md:block">
              Showing {filteredAndSortedProducts.length} Results
            </span>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Desktop Categories */}
            <div className="hidden md:flex items-center gap-6 mr-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-sm uppercase tracking-widest font-semibold transition-colors ${
                    activeCategory === cat ? 'text-gold border-b-2 border-gold pb-1' : 'text-gray-400 hover:text-charcoal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative group">
              <button className="flex items-center gap-2 uppercase tracking-widest text-sm font-semibold text-charcoal bg-white px-4 py-2 border border-gray-200">
                Sort By <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                {SORTS.map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setActiveSort(sort)}
                    className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                      activeSort === sort ? 'bg-cream text-gold' : 'text-charcoal hover:bg-gray-50'
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden mb-8"
            >
              <div className="bg-white p-4 border border-gray-200 grid grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-left text-sm uppercase tracking-widest py-2 ${
                      activeCategory === cat ? 'text-gold font-semibold' : 'text-gray-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h3 className="font-playfair text-2xl text-charcoal mb-4">No products found.</h3>
            <p className="text-gray-500 mb-8">We couldn't find any pieces matching your current filters.</p>
            <button
              onClick={() => handleCategoryChange('All')}
              className="text-gold uppercase tracking-widest font-semibold border-b border-gold pb-1"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
