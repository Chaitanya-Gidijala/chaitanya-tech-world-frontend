import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Play, BookOpen, Filter, X, ArrowRight, TrendingUp, SlidersHorizontal,
  ChevronRight, ChevronDown, List as ListIcon, Grid as GridIcon, Lock, CheckCircle2,
  GitBranch, Box, Code2, Blocks, Cpu
} from 'lucide-react';
import { 
  getAllAlgorithms, CATEGORIES, TOPIC_GROUPS, PROBLEM_GROUPS, SYSTEM_DESIGN_GROUPS, DSA_PROBLEMS, SYSTEM_DESIGN_TOPICS 
} from '../algorithms/index.js';
import './Catalogue.css';

const difficultyColor = { beginner: 'success', intermediate: 'warning', advanced: 'error' };
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const TABS = [
  { id: 'algorithms', label: 'Algorithms', icon: GitBranch },
  { id: 'problems', label: 'Problems', icon: Code2 },
  { id: 'system-design', label: 'System Design', icon: Blocks },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeTab = searchParams.get('tab') || 'algorithms';
  const activeTopic = searchParams.get('topic') || '';
  const activeDiff = searchParams.get('diff') || '';

  // Data fetching based on active tab
  const getItemsForTab = () => {
    switch (activeTab) {
      case 'problems': return DSA_PROBLEMS;
      case 'system-design': return SYSTEM_DESIGN_TOPICS;
      case 'algorithms':
      default:
        return getAllAlgorithms();
    }
  };

  const allItems = getItemsForTab();

  const filtered = useMemo(() => {
    return allItems.filter(item => {
      const matchQuery = !query || item.name?.toLowerCase().includes(query.toLowerCase()) || item.title?.toLowerCase().includes(query.toLowerCase()) || (item.tags && item.tags.some(t => t.includes(query.toLowerCase())));
      
      const matchTopic = !activeTopic || item.category === activeTopic;
      const matchDiff = !activeDiff || item.difficulty === activeDiff;
      return matchQuery && matchTopic && matchDiff;
    });
  }, [query, activeTopic, activeDiff, allItems, activeTab]);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    setSearchParams(p);
  };

  const setTab = (tabId) => {
    const p = new URLSearchParams(searchParams);
    p.set('tab', tabId);
    p.delete('topic'); // Reset topic on tab change
    setSearchParams(p);
  };

  const clearAll = () => { 
    setQuery(''); 
    const p = new URLSearchParams();
    p.set('tab', activeTab);
    setSearchParams(p);
  };
  
  const hasFilters = query || activeTopic || activeDiff;

    let currentGroups = TOPIC_GROUPS;
  if (activeTab === 'problems') currentGroups = PROBLEM_GROUPS;
  if (activeTab === 'system-design') currentGroups = SYSTEM_DESIGN_GROUPS;

  // Render Sidebar Topic Tree
  const SidebarTree = () => {
    return (
      <div className="tf-catalogue__sidebar">
        <div className="tf-sidebar-section">
          <h3 className="tf-sidebar-title">Topic Groups</h3>
          <div className="tf-sidebar-tree">
            {currentGroups.map(group => (
              <div key={group.id} className="tf-tree-group">
                <div className="tf-tree-group-header">
                  <div className="tf-tree-group-icon" style={{ backgroundColor: `${group.color}20`, color: group.color }}>
                    <Box size={14} />
                  </div>
                  <span className="tf-tree-group-label">{group.label}</span>
                </div>
                <div className="tf-tree-group-items">
                  {group.topics.map(topic => (
                    <button
                      key={topic.id}
                      className={`tf-tree-item ${activeTopic === topic.id ? 'tf-tree-item--active' : ''} ${topic.comingSoon ? 'tf-tree-item--disabled' : ''}`}
                      onClick={() => !topic.comingSoon && setFilter('topic', activeTopic === topic.id ? '' : topic.id)}
                      disabled={topic.comingSoon}
                    >
                      <span className="tf-tree-item-label">{topic.label}</span>
                      {topic.comingSoon && <Lock size={12} className="tf-tree-item-lock" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAlgorithmRow = (algo, index) => (
    <motion.div variants={itemVariants} key={algo.slug} className="tf-list-row tf-list-row--link" onClick={() => window.location.href = `/traceflow/algorithm/${algo.slug}`}>
      <div className="tf-list-col tf-list-col--id">{index + 1}</div>
      <div className="tf-list-col tf-list-col--status">
        <CheckCircle2 size={16} style={{ color: 'var(--tf-text-muted)', opacity: 0.3 }} />
      </div>
      <div className="tf-list-col tf-list-col--title">
        <span className="tf-list-title">{algo.name}</span>
      </div>
      <div className="tf-list-col tf-list-col--diff">
        <span className={`tf-badge tf-badge--sm tf-badge--${difficultyColor[algo.difficulty]}`}>{algo.difficulty}</span>
      </div>
      <div className="tf-list-col tf-list-col--meta hide-mobile">
        <span className="tf-text-mono">{algo.timeComplexity}</span>
      </div>
      <div className="tf-list-col tf-list-col--meta hide-tablet">
        <span className="tf-text-mono">{algo.spaceComplexity || '—'}</span>
      </div>
    </motion.div>
  );

  const renderProblemRow = (item, index) => (
    <motion.div variants={itemVariants} key={item.id} className="tf-list-row tf-list-row--link" onClick={() => window.location.href = `/traceflow/problem/${item.id}`}>
      <div className="tf-list-col tf-list-col--id">{index + 1}</div>
      <div className="tf-list-col tf-list-col--status">
        <Lock size={14} style={{ color: 'var(--tf-text-muted)', opacity: 0.2 }} />
      </div>
      <div className="tf-list-col tf-list-col--title">
        <span className="tf-list-title">{item.title}</span>
      </div>
      <div className="tf-list-col tf-list-col--diff">
        <span className={`tf-badge tf-badge--sm tf-badge--${difficultyColor[item.difficulty]}`}>{item.difficulty}</span>
      </div>
      <div className="tf-list-col tf-list-col--meta hide-mobile">
        {item.acceptance ? <span className="tf-text-muted">{item.acceptance}</span> : <span className="tf-text-muted">—</span>}
      </div>
      <div className="tf-list-col tf-list-col--meta hide-tablet">
        <span className="tf-text-muted">—</span>
      </div></motion.div>
  );

  // Mobile Filter Sheet
  const MobileFilterSheet = () => (
    <AnimatePresence>
      {filterOpen && (
        <motion.div 
          className="tf-filter-sheet tf-filter-sheet--open"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="tf-filter-sheet__overlay" onClick={() => setFilterOpen(false)} />
          <motion.div 
            className="tf-filter-sheet__content"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="tf-filter-sheet__header">
              <h3>Filters</h3>
              <button className="tf-btn tf-btn--icon tf-btn--ghost" onClick={() => setFilterOpen(false)}><X size={18}/></button>
            </div>
            <div className="tf-filter-sheet__body">
              <div className="tf-filter-group">
                <h4>Difficulty</h4>
                <div className="tf-filter-chips">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      className={`tf-filter-chip tf-filter-chip--${d} ${activeDiff === d ? 'tf-filter-chip--active' : ''}`}
                      onClick={() => setFilter('diff', activeDiff === d ? '' : d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="tf-filter-group">
                <h4>Topic</h4>
                <div className="tf-sidebar-tree">
                  {currentGroups.map(group => (
                    <div key={group.id} className="tf-tree-group">
                      <div className="tf-tree-group-header">
                        <span className="tf-tree-group-label">{group.label}</span>
                      </div>
                      <div className="tf-tree-group-items">
                        {group.topics.map(topic => (
                          <button
                            key={topic.id}
                            className={`tf-tree-item ${activeTopic === topic.id ? 'tf-tree-item--active' : ''} ${topic.comingSoon ? 'tf-tree-item--disabled' : ''}`}
                            onClick={() => { if(!topic.comingSoon) { setFilter('topic', activeTopic === topic.id ? '' : topic.id); setFilterOpen(false); } }}
                            disabled={topic.comingSoon}
                          >
                            <span className="tf-tree-item-label">{topic.label}</span>
                            {topic.comingSoon && <Lock size={12} className="tf-tree-item-lock" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {hasFilters && (
              <div className="tf-filter-sheet__footer">
                <button className="tf-btn tf-btn--secondary" onClick={() => { clearAll(); setFilterOpen(false); }} style={{width: '100%'}}>
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="tf-catalogue">
      
      {/* Hero Header */}
      <div className="tf-catalogue-hero">
        <div className="tf-container">
          <motion.h1 
            className="tf-catalogue-hero__title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Explore & Master
          </motion.h1>
          <motion.p 
            className="tf-catalogue-hero__sub"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            The ultimate library for algorithms, DSA problems, and system design concepts.
          </motion.p>
          
          {/* Tabs */}
          <div className="tf-catalogue-tabs-wrapper">
            <div className="tf-catalogue-tabs">
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id}
                    className={`tf-tab-btn ${isActive ? 'tf-tab-btn--active' : ''}`}
                    onClick={() => setTab(tab.id)}
                  >
                    <tab.icon size={16} /> 
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabIndicator" 
                        className="tf-tab-indicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="tf-container tf-catalogue-main">
        
        {/* Left Sidebar */}
        <div className="tf-catalogue-layout">
          <SidebarTree />
          
          {/* Content Area */}
          <div className="tf-catalogue-content">
            
            {/* Toolbar */}
            <div className="tf-catalogue-toolbar">
              <div className="tf-search-bar tf-search-bar--compact">
                <Search size={15} className="tf-search-bar__icon" />
                <input
                  className="tf-input tf-search-bar__input"
                  placeholder={`Search ${activeTab.replace('-', ' ')}…`}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                {query && <button className="tf-btn tf-btn--icon tf-btn--ghost tf-search-bar__clear" onClick={() => setQuery('')}><X size={14}/></button>}
              </div>

              <div className="tf-toolbar-actions">
                {/* Desktop Difficulty Filter */}
                <div className="tf-toolbar-filters hide-mobile">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      className={`tf-filter-chip tf-filter-chip--sm tf-filter-chip--${d} ${activeDiff === d ? 'tf-filter-chip--active' : ''}`}
                      onClick={() => setFilter('diff', activeDiff === d ? '' : d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div className="tf-toolbar-divider hide-mobile" />
                
                {/* View Toggle */}
                <div className="tf-view-toggle hide-mobile">
                  <button className={`tf-btn tf-btn--icon tf-btn--ghost ${viewMode === 'list' ? 'tf-btn--active' : ''}`} onClick={() => setViewMode('list')} title="List View"><ListIcon size={16}/></button>
                  <button className={`tf-btn tf-btn--icon tf-btn--ghost ${viewMode === 'grid' ? 'tf-btn--active' : ''}`} onClick={() => setViewMode('grid')} title="Grid View" disabled={activeTab !== 'algorithms'}><GridIcon size={16}/></button>
                </div>

                {/* Mobile Filter Button */}
                <button 
                  className={`tf-btn tf-btn--secondary tf-btn--sm show-mobile ${hasFilters ? 'tf-btn--active' : ''}`}
                  onClick={() => setFilterOpen(true)}
                >
                  <Filter size={14} /> Filters {hasFilters && <span className="tf-filter-badge" />}
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="tf-catalogue-results">
              {filtered.length === 0 ? (
                <div className="tf-catalogue__empty">
                  <Search size={28} />
                  <p>No {activeTab.replace('-', ' ')} match your filters.</p>
                  <button className="tf-btn tf-btn--secondary" onClick={clearAll}>Clear filters</button>
                </div>
              ) : (
                <>
                  {viewMode === 'list' || activeTab !== 'algorithms' || isMobile ? (
                    <div className="tf-list-view">
                      <div className="tf-list-header">
                        <div className="tf-list-col tf-list-col--id">#</div>
                        <div className="tf-list-col tf-list-col--status">Status</div>
                        <div className="tf-list-col tf-list-col--title">Title</div>
                        <div className="tf-list-col tf-list-col--diff">Difficulty</div>
                        <div className="tf-list-col tf-list-col--meta hide-mobile">{activeTab === 'algorithms' ? 'Time' : 'Acceptance'}</div>
                        <div className="tf-list-col tf-list-col--meta hide-tablet">{activeTab === 'algorithms' ? 'Space' : '—'}</div>
                      </div>
                      <motion.div 
                        className="tf-list-body"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        key={activeTab} // re-trigger animation on tab change
                      >
                        {activeTab === 'algorithms' 
                          ? filtered.map((item, i) => renderAlgorithmRow(item, i))
                          : filtered.map((item, i) => renderProblemRow(item, i))
                        }
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div 
                      className="tf-algo-grid"
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      key={activeTab + viewMode}
                    >
                      {filtered.map(algo => (
                        <motion.div variants={itemVariants} key={algo.slug} className="tf-algo-card tf-card">
                          <div className="tf-algo-card__header">
                            <div className="tf-algo-card__badges">
                              <span className={`tf-badge tf-badge--${difficultyColor[algo.difficulty]}`}>{algo.difficulty}</span>
                            </div>
                          </div>
                          <h2 className="tf-algo-card__name">{algo.name}</h2>
                          <p className="tf-algo-card__summary">{algo.summary}</p>
                          <div className="tf-algo-card__actions">
                            <Link to={`/traceflow/algorithm/${algo.slug}`} className="tf-btn tf-btn--secondary tf-btn--sm">
                              <BookOpen size={13} /> Learn
                            </Link>
                            <Link to={`/traceflow/visualizer/${algo.slug}`} className="tf-btn tf-btn--primary tf-btn--sm">
                              <Play size={13} /> Visualize
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </div>
      
      <MobileFilterSheet />
    </div>
  );
}
