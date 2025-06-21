'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Calendar, Clock, ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMobile, useMobileAnimation } from '@/hooks/useMobile';

export default function TaskFilters({ onFilter, totalTasks, overdueTasks, todayTasks, completedTasks, pendingTasks, inProgressTasks }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const { isMobile, isTablet, screenSize } = useMobile();
  const { getVariants, getHoverProps } = useMobileAnimation();

  const filters = [
    { 
      key: 'all', 
      label: 'All Tasks', 
      count: totalTasks || 0,
      color: 'from-blue-500 to-purple-600'
    },
    { 
      key: 'overdue', 
      label: 'Overdue', 
      count: overdueTasks || 0, 
      icon: Clock,
      color: 'from-red-500 to-red-600'
    },
    { 
      key: 'today', 
      label: 'Due Today', 
      count: todayTasks || 0, 
      icon: Calendar,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      key: 'pending', 
      label: 'Pending', 
      count: pendingTasks || 0, 
      color: 'from-orange-500 to-red-500'
    },
    { 
      key: 'in-progress', 
      label: 'In Progress', 
      count: inProgressTasks || 0, 
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      key: 'completed', 
      label: 'Completed', 
      count: completedTasks || 0, 
      color: 'from-green-500 to-emerald-600'
    },
  ];

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    onFilter({ filter: filterKey, search: searchTerm });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilter({ filter: activeFilter, search: value });
  };

  const clearSearch = () => {
    setSearchTerm('');
    onFilter({ filter: activeFilter, search: '' });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Mobile-first responsive design
  const containerClasses = `
    bg-white rounded-xl shadow-sm border border-gray-200 
    ${isMobile ? 'p-4 mx-2' : isTablet ? 'p-5 mx-4' : 'p-6'}
    ${isMobile ? 'sticky top-2 z-20' : ''}
  `;

  const searchContainerClasses = `
    relative 
    ${isMobile ? 'mb-3' : 'mb-0 flex-1 max-w-md'}
  `;

  const searchInputClasses = `
    w-full pl-11 pr-10 py-3 border border-gray-200 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
    transition-all duration-200 placeholder:text-gray-400
    ${isMobile ? 'text-base' : 'text-sm'}
    ${isSearchFocused ? 'bg-blue-50/50' : 'bg-white'}
  `;

  return (
    <motion.div
      {...getVariants('default')}
      className={containerClasses}
    >
      {/* Mobile: Compact Header with Search */}
      {isMobile ? (
        <div className="space-y-3">
          {/* Search Bar */}
          <div className={searchContainerClasses}>
            <div className="relative group">
              <Search className={`
                absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors
                ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}
              `} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={searchInputClasses}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {filters.find(f => f.key === activeFilter)?.label}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {filters.find(f => f.key === activeFilter)?.count || 0}
              </span>
            </div>
            <motion.button
              onClick={toggleFilters}
              {...getHoverProps()}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>

          {/* Collapsible Filter Pills */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {filters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter === filter.key;
                    
                    return (
                      <motion.button
                        key={filter.key}
                        onClick={() => {
                          handleFilterChange(filter.key);
                          setShowFilters(false);
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex items-center justify-between p-3 rounded-lg font-medium text-sm transition-all duration-200
                          ${isActive 
                            ? `bg-gradient-to-r text-white shadow-md ${filter.color}`
                            : 'bg-gray-50 text-gray-700 active:bg-gray-100'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-2">
                          {Icon && <Icon className="w-4 h-4" />}
                          <span className="truncate">{filter.label}</span>
                        </div>
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center
                          ${isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white text-gray-700'
                          }
                        `}>
                          {filter.count}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Desktop/Tablet Layout */
        <div className={`
          flex flex-col space-y-4
          ${isTablet ? 'lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-6' : 'lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-6'}
        `}>
          {/* Search Section */}
          <div className={searchContainerClasses}>
            <div className="relative group">
              <Search className={`
                absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors
                ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}
              `} />
              <input
                type="text"
                placeholder="Search tasks by name or description..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={searchInputClasses}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className={`
            flex flex-wrap gap-2
            ${isTablet ? 'justify-center' : ''}
          `}>
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.key;
              
              return (
                <motion.button
                  key={filter.key}
                  onClick={() => handleFilterChange(filter.key)}
                  {...getHoverProps()}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? `bg-gradient-to-r text-white shadow-lg ${filter.color}`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{filter.label}</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white text-gray-700'
                    }
                  `}>
                    {filter.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {searchTerm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`border-t border-gray-200 ${isMobile ? 'mt-3 pt-3' : 'mt-4 pt-4'}`}
        >
          <p className="text-sm text-gray-600">
            Searching for &quot;<span className="font-medium text-gray-900">{searchTerm}</span>&quot;
            {activeFilter !== 'all' && (
              <span> in {filters.find(f => f.key === activeFilter)?.label.toLowerCase()}</span>
            )}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
