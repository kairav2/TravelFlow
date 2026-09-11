import React, { useState } from 'react';
import { X, Plus, Clock, IndianRupee, MapPin, Tag, FileText, Check } from 'lucide-react';

export default function AddActivityModal({ isOpen, onClose, onSave, dayNumber = 1, initialData = null }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [time, setTime] = useState(initialData?.time || '11:00 AM – 12:30 PM');
  const [cost, setCost] = useState(initialData?.cost || 500);
  const [category, setCategory] = useState(initialData?.category || 'attraction');
  const [location, setLocation] = useState(initialData?.location || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [buffer, setBuffer] = useState(initialData?.buffer || '20 mins buffer');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialData?.id || `act-${Date.now()}`,
      title: title.trim(),
      time,
      cost: Number(cost) || 0,
      category,
      location: location.trim() || 'Local Area',
      notes: notes.trim(),
      buffer
    });

    onClose();
  };

  return (
    <div className="overlay animate-fade-in" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="add-act-modal card-luxury" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e0e7e4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#faf3e5] text-[#c4963d] flex items-center justify-center font-bold">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0b221d]">
                {initialData ? 'Edit Activity' : `Add Experience to Day ${dayNumber}`}
              </h3>
              <p className="text-xs text-[#6f807c]">Customize your hour-by-hour schedule</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          
          <div>
            <label className="block text-xs font-bold text-[#0b221d] uppercase mb-1">Activity Title *</label>
            <input 
              type="text"
              required
              placeholder="e.g., Fontainhas Heritage Photography Walk"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] focus:border-[#0b221d] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b221d] uppercase mb-1 flex items-center gap-1">
                <Clock size={12} /> Time Window
              </label>
              <input 
                type="text"
                placeholder="e.g., 03:30 PM – 05:00 PM"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b221d] uppercase mb-1 flex items-center gap-1">
                <IndianRupee size={12} /> Estimated Cost (₹)
              </label>
              <input 
                type="number"
                min="0"
                step="50"
                value={cost}
                onChange={e => setCost(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0b221d] uppercase mb-1 flex items-center gap-1">
                <Tag size={12} /> Category
              </label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] outline-none bg-white"
              >
                <option value="attraction">Attraction / Sights</option>
                <option value="food">Culinary / Cafe / Dining</option>
                <option value="transit">Transit / Drive</option>
                <option value="buffer">Relaxed Buffer / Leisure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0b221d] uppercase mb-1 flex items-center gap-1">
                <MapPin size={12} /> Location
              </label>
              <input 
                type="text"
                placeholder="e.g., Panjim Latin Quarter"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b221d] uppercase mb-1 flex items-center gap-1">
              <FileText size={12} /> Insider Notes / Advice
            </label>
            <input 
              type="text"
              placeholder="e.g., Best light for photos, buy coconut water near chapel"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b221d] uppercase mb-1">Transit Buffer Time</label>
            <input 
              type="text"
              placeholder="e.g., 20 mins buffer for parking"
              value={buffer}
              onChange={e => setBuffer(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e0e7e4] outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e0e7e4]">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-gold px-5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>{initialData ? 'Save Changes' : 'Add Experience'}</span>
            </button>
          </div>

        </form>

      </div>

      <style>{`
        .add-act-modal {
          width: min(480px, 94vw);
          background: #ffffff;
          border-radius: var(--radius-xl);
          padding: 24px;
          box-shadow: var(--shadow-xl);
        }
      `}</style>
    </div>
  );
}
