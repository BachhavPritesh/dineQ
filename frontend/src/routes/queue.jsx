import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { Bell, MapPin, Users, Clock, ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { restaurantService } from '@/services/restaurantService';
import { queueService } from '@/services/queueService';
import { connectSocket } from '@/socket/socketClient';
import { motion } from 'framer-motion';

const defaultImage =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80';

export default function QueuePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const restaurantId = searchParams.get('id');

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [partySize, setPartySize] = useState(2);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [cart, setCart] = useState({});
  const [joined, setJoined] = useState(false);
  const [queueEntry, setQueueEntry] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId) {
        setLoading(false);
        return;
      }
      try {
        const res = await restaurantService.getById(restaurantId);
        const data = res.data || res;
        setRestaurant(data);

        const queueRes = await queueService.getMyQueue(restaurantId);
        const queueData = queueRes.data || queueRes;
        if (queueData && queueData.status === 'waiting') {
          setQueueEntry(queueData);
          setJoined(true);
        }
      } catch (e) {
        console.error('Failed to fetch restaurant', e);
        setError('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  const handleJoinQueue = async () => {
    setJoining(true);
    setError('');
    try {
      const preOrderItems = Object.entries(cart)
        .map(([id, qty]) => {
          const menuItem = findMenuItem(id);
          if (!menuItem) return null;
          return {
            name: menuItem.name,
            price: menuItem.price,
            category: menuItem.category,
            image: menuItem.image,
            quantity: qty,
          };
        })
        .filter(Boolean);

      const res = await queueService.join(restaurantId, partySize, preOrderItems);
      const data = res.data || res;
      setQueueEntry(data);
      setJoined(true);
      setShowJoinModal(false);
      setCart({});
      toast.success('Joined the queue!');
    } catch (e) {
      setError(e.message || 'Failed to join queue');
    } finally {
      setJoining(false);
    }
  };

  const add = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  };
  const sub = (id) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });

  const menu = restaurant?.menu || [];
  const findMenuItem = (id) => {
    if (!id) return null;
    const prefix = 'menu-';
    if (id.startsWith(prefix)) {
      const idx = parseInt(id.slice(prefix.length), 10);
      if (!isNaN(idx) && idx >= 0 && idx < menu.length) return menu[idx];
    }
    const strId = String(id);
    return menu.find((m, idx) => {
      const mId = String(m._id || m.id || `menu-${idx}`);
      return mId === strId;
    });
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, q]) => {
    const item = findMenuItem(id);
    const price = Number(item?.price) || 0;
    return sum + price * Number(q);
  }, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const image = restaurant?.image || defaultImage;
  const waitMinutes = restaurant?.avgWaitTime || restaurant?.avgSeatingTimeMinutes || 15;

  if (loading) {
    return (
      <PageShell>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-56 bg-surface rounded-3xl" />
            <div className="h-64 bg-surface rounded-3xl" />
          </div>
        </section>
      </PageShell>
    );
  }

  if (!restaurantId || (error && !restaurant)) {
    return (
      <PageShell>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h2 className="text-2xl font-bold">Restaurant not found</h2>
          <p className="text-muted-foreground mt-2">Please select a restaurant from the list.</p>
          <Link
            to="/restaurants"
            className="mt-4 inline-flex items-center gap-2 text-gold hover:underline"
          >
            ← Browse restaurants
          </Link>
        </section>
      </PageShell>
    );
  }

  if (joined && queueEntry) {
    return (
      <PageShell>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-gold/50 bg-gold/10 backdrop-blur-sm p-6 text-center">
            <Bell className="h-10 w-10 mx-auto text-gold" />
            <h2 className="mt-4 text-xl font-display font-bold">You're already in queue</h2>
            <p className="mt-2 text-muted-foreground">
              Position #{queueEntry.position || 1} · ~{queueEntry.estimatedWaitMinutes || 0} min
              wait
            </p>
            <button
              onClick={() => navigate('/my-queue')}
              className="mt-4 px-6 py-2.5 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 text-sm"
            >
              View My Queue
            </button>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-gold/20 bg-card overflow-hidden">
              <div className="relative h-48 sm:h-56">
                <img src={image} alt={restaurant?.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.16_145)] animate-pulse" />{' '}
                    Open now
                  </span>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-display font-bold">
                    {restaurant?.name}
                  </h1>
                  <p className="text-sm text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {restaurant?.address} · {restaurant?.cuisine}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <Stat icon={Clock} label="Avg. Wait" value={`${waitMinutes} min`} />
                  <Stat
                    icon={Users}
                    label="In Queue"
                    value={`${restaurant?.queueCount || 0} parties`}
                  />
                  <Stat icon={Bell} label="Party Size" value={`Up to ${partySize}`} />
                </div>

                <button
                  onClick={() => setShowJoinModal(true)}
                  className="mt-6 w-full px-4 py-3 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 text-sm"
                >
                  Join Virtual Queue
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-display text-2xl font-semibold">Menu</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Preview dishes. Pre-order after joining the queue.
                  </p>
                </div>
              </div>

              {menu.length === 0 ? (
                <p className="mt-6 text-sm text-muted-foreground">No menu available yet.</p>
              ) : (
                <ul className="mt-6 space-y-3">
                  {menu.map((m, idx) => {
                    const itemId = `menu-${idx}`;
                    const qty = cart[itemId] ?? 0;
                    return (
                      <li
                        key={itemId}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-surface/30 hover:border-gold/30 transition-all"
                      >
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 text-muted-foreground/40 text-xl">
                            🍽
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{m.name}</p>
                          {m.description && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {m.description}
                            </p>
                          )}
                          <p className="text-sm text-gold font-semibold mt-1">
                            ${m.price.toFixed(2)}
                          </p>
                        </div>
                        {qty === 0 ? (
                          <button
                            onClick={() => add(itemId)}
                            className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-border hover:border-gold hover:text-gold text-sm inline-flex items-center gap-1 transition"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add
                          </button>
                        ) : (
                          <div className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/5 px-1">
                            <button
                              onClick={() => sub(itemId)}
                              className="p-1.5 hover:text-gold transition"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{qty}</span>
                            <button
                              onClick={() => add(itemId)}
                              className="p-1.5 hover:text-gold transition"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold" /> Your pre-order
                {cartCount > 0 && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold font-medium">
                    {cartCount} item{cartCount > 1 ? 's' : ''}
                  </span>
                )}
              </h3>

              {cartCount === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  No items yet. Add dishes from the menu to skip the kitchen wait.
                </p>
              ) : (
                <ul className="mt-4 space-y-2 text-sm">
                  {Object.entries(cart).map(([id, q]) => {
                    const menuItem = findMenuItem(id);
                    return (
                      <li key={id} className="flex justify-between gap-2">
                        <span className="text-muted-foreground truncate">
                          {q}× {menuItem?.name}
                        </span>
                        <span className="font-medium">
                          ${((menuItem?.price || 0) * q).toFixed(2)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-xl font-bold gradient-text-gold">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <p className="mt-3 text-xs text-muted-foreground text-center">
                You can confirm your order after joining the queue.
              </p>
            </div>

            <Link to="/restaurants" className="block text-center text-sm text-gold hover:underline">
              ← Browse other restaurants
            </Link>
          </aside>
        </div>
      </section>

      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-md mx-4 shadow-elegant">
            <h3 className="font-display text-xl font-bold">Join the queue</h3>
            <p className="text-sm text-muted-foreground mt-2">How many people in your party?</p>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                className="p-3 rounded-full border border-border hover:border-gold hover:text-gold transition"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="font-display text-4xl font-bold w-16 text-center">{partySize}</span>
              <button
                onClick={() => setPartySize((p) => Math.min(20, p + 1))}
                className="p-3 rounded-full border border-border hover:border-gold hover:text-gold transition"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {cartCount > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-gold/5 border border-gold/20">
                <p className="text-xs font-medium text-gold mb-1">
                  Pre-order included ({cartCount} items)
                </p>
                <p className="text-xs text-muted-foreground">Total: ${cartTotal.toFixed(2)}</p>
              </div>
            )}

            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-surface transition"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinQueue}
                disabled={joining}
                className="flex-1 px-4 py-2.5 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 disabled:opacity-50 transition"
              >
                {joining ? 'Joining...' : 'Join Queue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <div className="text-xs text-muted-foreground inline-flex items-center gap-1 justify-center">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
