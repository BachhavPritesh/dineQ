import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function JoinNotification({ join, onDismiss, onViewDetails }) {
  const customerName = join.customer?.name || 'Guest';
  const partySize = join.partySize || 2;
  const position = join.position ?? 'N/A';
  const waitTime = join.estimatedWaitMinutes ?? 'N/A';
  const preOrders = join.preOrders || [];
  const notes = join.notes || '';

  const [showAll, setShowAll] = useState(false);
  const visiblePreOrders = showAll ? preOrders : preOrders.slice(0, 3);
  const hiddenCount = preOrders.length - 3;

  const totalPrice = preOrders.reduce((sum, item) => {
    const qty = item.quantity || 1;
    const price = item.price || 0;
    return sum + price * qty;
  }, 0);

  console.log('preOrders:', preOrders, 'totalPrice:', totalPrice);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: 'spring', damping: 20 }}
      role="alert"
      aria-live="polite"
      className="w-80 bg-card border border-border rounded-2xl shadow-lg p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
          <span className="text-sm font-semibold">New Join</span>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="cursor-pointer hover:opacity-60 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Customer Info */}
      <div>
        <p className="font-semibold">{customerName}</p>
        <span className="inline-flex px-2 py-0.5 rounded-full bg-surface text-xs font-medium mt-1">
          Party of {partySize}
        </span>
      </div>

      {/* Queue Info */}
      <div className="text-sm text-muted-foreground flex items-center gap-3">
        <span>Position #{position}</span>
        <span>{waitTime} min wait</span>
      </div>

      {/* Pre-orders */}
      {preOrders.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Pre-orders</p>
          {visiblePreOrders.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span>
                {item.name} x{item.quantity || 1}
              </span>
              <span style={{ color: '#DC2626' }}>
                ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
              </span>
            </div>
          ))}
          {hiddenCount > 0 && (
            <p
              className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show less' : `${hiddenCount} more`}
            </p>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-xs font-medium">Total</p>
            <p className="text-sm font-bold" style={{ color: '#DC2626' }}>
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No pre-orders</p>
      )}

      {/* Notes */}
      {notes.trim() && (
        <div>
          <p className="text-xs font-medium text-muted-foreground">Notes</p>
          <p className="text-sm italic text-muted-foreground truncate max-w-[280px]">
            {notes.length > 100 ? `${notes.slice(0, 100)}...` : notes}
          </p>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onViewDetails}
        className="w-full text-sm py-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition cursor-pointer"
      >
        View Full Details
      </button>
    </motion.div>
  );
}
