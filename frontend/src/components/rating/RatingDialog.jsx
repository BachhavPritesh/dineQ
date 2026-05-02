import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RatingDialog({ restaurantName, restaurantId, onSubmit, onSkip }) {
  const [selectedRating, setSelectedRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);

  const displayRating = hoverRating || selectedRating;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="mx-4 max-w-md w-full rounded-3xl border border-gold/30 bg-card p-8 text-center shadow-elegant relative"
        >
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="h-16 w-16 mx-auto rounded-full gradient-gold flex items-center justify-center mb-5">
            <Star className="h-8 w-8 text-primary-foreground fill-current" />
          </div>

          <h2 className="text-2xl font-display font-bold">Rate your experience</h2>
          <p className="mt-2 text-muted-foreground">
            How was your visit to{' '}
            <span className="text-foreground font-medium">{restaurantName}</span>?
          </p>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(null)}
                className="transition-transform hover:scale-110 cursor-pointer"
              >
                <Star
                  className={`h-10 w-10 ${
                    i < displayRating ? 'fill-gold text-gold' : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
          </div>

          {selectedRating && (
            <p className="mt-3 text-sm font-medium text-gold">
              {selectedRating <= 2
                ? selectedRating === 1
                  ? 'Poor'
                  : 'Fair'
                : selectedRating === 3
                  ? 'Good'
                  : selectedRating === 4
                    ? 'Great'
                    : 'Excellent!'}
            </p>
          )}

          <button
            onClick={() => onSubmit(restaurantId, selectedRating)}
            disabled={!selectedRating}
            className="mt-6 w-full px-4 py-2.5 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Submit rating
          </button>

          <button
            onClick={onSkip}
            className="mt-3 text-sm text-muted-foreground hover:text-foreground transition"
          >
            Not now
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
