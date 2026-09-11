import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Utensils, 
  Car, 
  Camera, 
  Coffee, 
  IndianRupee, 
  CheckCircle, 
  Circle, 
  Printer, 
  CalendarDays,
  Layers,
  Plus,
  Trash2,
  Bot
} from 'lucide-react';
import AddActivityModal from './AddActivityModal';

export default function ItineraryView({ 
  destination, 
  tripParams = {}, 
  customActivities = [], 
  onAddCustomActivity,
  onDeleteCustomActivity,
  onOpenAIChat
}) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');
  const [completedActivities, setCompletedActivities] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletedIds, setDeletedIds] = useState({});

  const days = destination.itineraryDays || [];
  const currentDay = days[activeDayIndex] || days[0] || { day: 1, activities: [] };

  const toggleActivity = (id) => {
    setCompletedActivities(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDelete = (id) => {
    setDeletedIds(prev => ({ ...prev, [id]: true }));
    if (onDeleteCustomActivity) {
      onDeleteCustomActivity(id);
    }
  };

  const handleSaveNewActivity = (newAct) => {
    if (onAddCustomActivity) {
      onAddCustomActivity({
        ...newAct,
        day: currentDay.day
      });
    }
  };

  // Combine standard activities and custom additions for current day
  const baseDayActivities = (currentDay.activities || []).filter(a => !deletedIds[a.id]);

  const customForThisDay = (customActivities || [])
    .filter(a => !deletedIds[a.id] && (!a.day || a.day === currentDay.day))
    .map((act, idx) => ({
      id: act.id || `custom-${idx}`,
      time: act.time || '04:30 PM',
      title: act.title || 'Curated Experience',
      category: act.category || 'attraction',
      cost: Number(act.cost) || 800,
      notes: act.notes || act.desc || 'Customized with TravelFlow AI.',
      location: act.location || destination.name,
      buffer: act.buffer || '20 mins buffer'
    }));

  const rawActivities = [...baseDayActivities, ...customForThisDay];

  const activities = rawActivities.filter(act => {
    if (filterCategory === 'all') return true;
    return act.category === filterCategory;
  });

  // Calculate day total cost
  const dayTotalCost = rawActivities.reduce((sum, act) => sum + (Number(act.cost) || 0), 0);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'attraction': return <Camera size={14} />;
      case 'food': return <Utensils size={14} />;
      case 'transit': return <Car size={14} />;
      case 'buffer': return <Coffee size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'attraction': return 'badge-attraction';
      case 'food': return 'badge-food';
      case 'transit': return 'badge-transit';
      case 'buffer': return 'badge-buffer';
      default: return '';
    }
  };

  return (
    <section className="section-spacing itinerary-section" id="itinerary">
      <div className="container">
        
        {/* Header with Title & Action */}
        <div className="itinerary-header">
          <div>
            <span className="eyebrow">
              <CalendarDays size={15} /> HOUR-BY-HOUR ITINERARY
            </span>
            <h2 className="section-title">Bespoke Schedule for {destination.name}</h2>
            <p className="section-desc">
              Carefully timed activities for {tripParams.travelers || 2} traveler{(tripParams.travelers || 2) > 1 ? 's' : ''} ({tripParams.startDate || 'Day 1'} to {tripParams.endDate || 'Day 4'}), including scenic buffers, curated local food stops, and realistic transit buffers.
            </p>
          </div>

          <div className="itinerary-actions flex items-center gap-2.5">
            <button 
              type="button" 
              className="btn-gold text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={15} />
              <span>Add Experience</span>
            </button>

            {onOpenAIChat && (
              <button 
                type="button" 
                className="btn-outline text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 text-[#075E54] border-[#075E54]/30 hover:bg-[#075E54]/10"
                onClick={onOpenAIChat}
              >
                <Bot size={15} className="text-[#25D366]" />
                <span>Modify via AI</span>
              </button>
            )}

            <button 
              type="button" 
              className="btn-outline print-btn"
              onClick={() => window.print()}
            >
              <Printer size={15} />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Day Tabs Navigation */}
        <div className="day-tabs-scroller">
          <div className="day-tabs">
            {days.map((d, idx) => (
              <button
                key={d.day}
                type="button"
                className={`day-tab ${activeDayIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveDayIndex(idx)}
              >
                <span className="day-number">DAY {d.day}</span>
                <span className="day-title-preview">{d.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Day Summary Card */}
        <div className="day-summary-banner card-luxury">
          <div className="day-summary-left">
            <span className="day-badge">DAY {currentDay.day} OVERVIEW</span>
            <h3 className="day-headline">{currentDay.title}</h3>
            <p className="day-blurb">{currentDay.summary}</p>
          </div>

          <div className="day-stats-box">
            <div className="day-stat-item">
              <span className="stat-label">DAY ESTIMATED SPEND</span>
              <span className="stat-val">₹{dayTotalCost.toLocaleString()}</span>
            </div>
            <div className="day-stat-item">
              <span className="stat-label">ACTIVITIES</span>
              <span className="stat-val">{rawActivities.length} Stops</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="category-filters">
          {[
            { key: 'all', label: 'All Items', icon: <Layers size={14} /> },
            { key: 'attraction', label: 'Attractions', icon: <Camera size={14} /> },
            { key: 'food', label: 'Dining & Cafes', icon: <Utensils size={14} /> },
            { key: 'transit', label: 'Local Transit', icon: <Car size={14} /> },
            { key: 'buffer', label: 'Buffer & Leisure', icon: <Coffee size={14} /> }
          ].map(cat => (
            <button
              key={cat.key}
              type="button"
              className={`cat-filter-btn ${filterCategory === cat.key ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat.key)}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Timeline Activities List */}
        <div className="timeline-container">
          {activities.length === 0 ? (
            <div className="empty-category-notice">
              <p>No scheduled activities in this category for Day {currentDay.day}.</p>
              <button 
                type="button" 
                className="btn-ghost" 
                onClick={() => setFilterCategory('all')}
              >
                Reset Filter
              </button>
            </div>
          ) : (
            activities.map((act) => {
              const isDone = completedActivities[act.id];

              return (
                <div key={act.id} className={`timeline-item ${isDone ? 'completed-item' : ''}`}>
                  
                  {/* Timeline Column with Time & Dot */}
                  <div className="timeline-meta-col">
                    <div className="timeline-time-badge">
                      <Clock size={13} />
                      <span>{act.time}</span>
                    </div>
                    <div className="timeline-connector"></div>
                  </div>

                  {/* Activity Card */}
                  <div className="activity-card card-luxury">
                    <div className="activity-top-row">
                      <div className="activity-badges">
                        <span className={`cat-tag ${getCategoryBadgeClass(act.category)}`}>
                          {getCategoryIcon(act.category)}
                          <span>{(act.category || 'ATTRACTION').toUpperCase()}</span>
                        </span>
                        <span className="location-tag">
                          <MapPin size={12} />
                          <span>{act.location}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="activity-cost-badge">
                          <IndianRupee size={13} />
                          <span>{(Number(act.cost) || 0).toLocaleString()}</span>
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(act.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                          title="Remove activity from day"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <h4 className="activity-title">{act.title}</h4>
                    <p className="activity-notes">{act.notes}</p>

                    {/* Buffer and Transit information */}
                    <div className="activity-meta-footer">
                      {act.buffer && (
                        <div className="buffer-badge">
                          <Coffee size={12} />
                          <span>Buffer: {act.buffer}</span>
                        </div>
                      )}
                      
                      <button 
                        type="button" 
                        className={`check-toggle-btn ${isDone ? 'checked' : ''}`}
                        onClick={() => toggleActivity(act.id)}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle size={16} />
                            <span>Visited</span>
                          </>
                        ) : (
                          <>
                            <Circle size={16} />
                            <span>Mark as Visited</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Add Activity Modal */}
      <AddActivityModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        dayNumber={currentDay.day}
        onSave={handleSaveNewActivity}
      />

      <style>{`
        .itinerary-section {
          background: #ffffff;
        }

        .itinerary-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .print-btn {
          font-size: 0.88rem;
          padding: 9px 18px;
        }

        /* Day Tabs */
        .day-tabs-scroller {
          overflow-x: auto;
          margin-bottom: 24px;
          padding-bottom: 6px;
        }

        .day-tabs {
          display: flex;
          gap: 12px;
          min-width: max-content;
        }

        .day-tab {
          padding: 14px 22px;
          border-radius: var(--radius-md);
          background: var(--color-surface-muted);
          border: 1.5px solid var(--color-border);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
          text-align: left;
          min-width: 200px;
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        .day-tab:hover {
          border-color: var(--color-primary-light);
        }

        .day-tab.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(20, 56, 49, 0.2);
        }

        .day-number {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--color-accent);
        }

        .day-tab.active .day-number {
          color: #f7dfa5;
        }

        .day-title-preview {
          font-size: 0.92rem;
          font-weight: 700;
          line-height: 1.25;
        }

        /* Day Summary Banner */
        .day-summary-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 30px;
          margin-bottom: 28px;
          gap: 24px;
          background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-accent-subtle) 100%);
          border-left: 4px solid var(--color-accent);
          flex-wrap: wrap;
        }

        .day-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--color-accent);
          margin-bottom: 6px;
        }

        .day-headline {
          font-size: 1.3rem;
          margin-bottom: 6px;
        }

        .day-blurb {
          font-size: 0.9rem;
          max-width: 600px;
          color: var(--color-text-secondary);
        }

        .day-stats-box {
          display: flex;
          gap: 24px;
        }

        .day-stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
        }

        .stat-val {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--color-primary-dark);
        }

        /* Category Filter Buttons */
        .category-filters {
          display: flex;
          gap: 10px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .cat-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          background: var(--color-surface-muted);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        .cat-filter-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .cat-filter-btn.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: #ffffff;
        }

        /* Timeline Items */
        .timeline-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .timeline-item {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 24px;
          position: relative;
        }

        .timeline-meta-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          position: relative;
          padding-top: 14px;
        }

        .timeline-time-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-primary);
          background: var(--color-primary-soft);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          white-space: nowrap;
        }

        .timeline-connector {
          position: absolute;
          right: -13px;
          top: 24px;
          bottom: -24px;
          width: 2px;
          background: var(--color-border);
        }

        .timeline-connector::before {
          content: '';
          position: absolute;
          top: 0;
          left: -4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 2px solid #ffffff;
        }

        .timeline-item:last-child .timeline-connector {
          display: none;
        }

        /* Activity Card */
        .activity-card {
          padding: 20px 24px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .activity-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .activity-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .activity-badges {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .cat-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .badge-attraction { background: #e0f2fe; color: #0369a1; }
        .badge-food { background: #fef3c7; color: #b45309; }
        .badge-transit { background: #f1f5f9; color: #475569; }
        .badge-buffer { background: #f3e8ff; color: #7e22ce; }

        .location-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .activity-cost-badge {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--color-primary);
        }

        .activity-title {
          font-size: 1.05rem;
          margin-bottom: 6px;
        }

        .activity-notes {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin-bottom: 14px;
        }

        .activity-meta-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--color-border-light);
          flex-wrap: wrap;
          gap: 10px;
        }

        .buffer-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-style: italic;
          color: var(--color-text-muted);
        }

        .check-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .check-toggle-btn:hover {
          color: var(--color-primary);
        }

        .check-toggle-btn.checked {
          color: var(--color-success);
        }

        .completed-item .activity-card {
          opacity: 0.65;
          background: var(--color-surface-muted);
        }

        .completed-item .activity-title {
          text-decoration: line-through;
        }

        .empty-category-notice {
          padding: 40px;
          text-align: center;
          color: var(--color-text-muted);
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .timeline-item {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .timeline-meta-col {
            align-items: flex-start;
            padding-top: 0;
          }

          .timeline-connector {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
