import { Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Check,
  Store,
  MapPin,
  Image,
  Plus,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { RoleToggle } from '@/components/auth/RoleToggle';
import { setStoredRole } from '@/lib/role';
import { authService } from '@/services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [restaurant, setRestaurant] = useState({
    name: '',
    address: '',
    cuisine: '',
    image: '',
    avgSeatingTimeMinutes: 15,
    menu: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (v) => setForm({ ...form, [k]: v });
  const setRest = (k) => (v) => setRestaurant({ ...restaurant, [k]: v });

  const addMenuItem = () => {
    setRestaurant({
      ...restaurant,
      menu: [...restaurant.menu, { name: '', price: '', category: 'Main' }],
    });
  };

  const removeMenuItem = (index) => {
    setRestaurant({ ...restaurant, menu: restaurant.menu.filter((_, i) => i !== index) });
  };

  const updateMenuItem = (index, field, value) => {
    const newMenu = [...restaurant.menu];
    newMenu[index] = { ...newMenu[index], [field]: value };
    setRestaurant({ ...restaurant, menu: newMenu });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = { ...form, role: role === 'owner' ? 'staff' : 'customer' };
      if (role === 'owner') {
        if (!form.name) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        if (!restaurant.name) {
          setError('Please enter restaurant name');
          setLoading(false);
          return;
        }
        userData.restaurant = {
          name: restaurant.name,
          address: restaurant.address,
          cuisine: restaurant.cuisine,
          image: restaurant.image || '',
          avgSeatingTimeMinutes: parseInt(restaurant.avgSeatingTimeMinutes) || 15,
          menu: restaurant.menu
            .filter((m) => m.name && m.price)
            .map((m) => ({ ...m, price: parseFloat(m.price) })),
        };
      }
      await authService.register(userData);
      setStoredRole(role);
      navigate(role === 'owner' ? '/dashboard' : '/restaurants');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const isOwner = role === 'owner';

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12 sm:px-12 order-2 lg:order-1 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="h-9 w-9 rounded-lg gradient-gold grid place-items-center shadow-gold transition group-hover:scale-105">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              Dine<span className="text-gold">Q</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-muted-foreground">Pick your role to get started.</p>

          <div className="mt-6">
            <RoleToggle value={role} onChange={setRole} />
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}
            <Field
              label={isOwner ? 'Your Name' : 'Full name'}
              icon={User}
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder={isOwner ? 'John Smith' : 'Jane Doe'}
            />
            <Field
              label="Email"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
            />
            <Field
              label="Phone"
              icon={Phone}
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+1 555 0102"
            />
            <Field
              label="Password"
              icon={Lock}
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="At least 6 characters"
            />

            {isOwner && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-lg">Restaurant Details</h3>
                <Field
                  label="Restaurant Name"
                  icon={Store}
                  type="text"
                  value={restaurant.name}
                  onChange={setRest('name')}
                  placeholder="Ember & Oak"
                />
                <Field
                  label="Address"
                  icon={MapPin}
                  type="text"
                  value={restaurant.address}
                  onChange={setRest('address')}
                  placeholder="123 Main St, City"
                />
                <Field
                  label="Cuisine Type"
                  icon={Store}
                  type="text"
                  value={restaurant.cuisine}
                  onChange={setRest('cuisine')}
                  placeholder="Italian, Japanese, etc."
                />
                <Field
                  label="Image URL"
                  icon={Image}
                  type="url"
                  value={restaurant.image}
                  onChange={setRest('image')}
                  placeholder="https://example.com/image.jpg"
                />
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Avg. Seating Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={restaurant.avgSeatingTimeMinutes}
                    onChange={(e) => setRest('avgSeatingTimeMinutes')(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-input border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Menu Items (Optional)</label>
                    <button
                      type="button"
                      onClick={addMenuItem}
                      className="text-xs text-gold hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add Dish
                    </button>
                  </div>
                  {restaurant.menu.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-end">
                      <input
                        type="text"
                        placeholder="Dish name"
                        value={item.name}
                        onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-input border border-border focus:border-gold focus:outline-none text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => updateMenuItem(index, 'price', e.target.value)}
                        className="w-20 px-3 py-2 rounded-lg bg-input border border-border focus:border-gold focus:outline-none text-sm"
                      />
                      <select
                        value={item.category}
                        onChange={(e) => updateMenuItem(index, 'category', e.target.value)}
                        className="px-2 py-2 rounded-lg bg-input border border-border focus:border-gold focus:outline-none text-xs"
                      >
                        <option>Main</option>
                        <option>Appetizer</option>
                        <option>dessert</option>
                        <option>Drink</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeMenuItem(index)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-border bg-input accent-[var(--gold)]"
                defaultChecked
              />
              I agree to the{' '}
              <a href="#" className="text-gold hover:underline">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-gold hover:underline">
                Privacy Policy
              </a>
              .
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : `Create ${isOwner ? 'owner' : 'customer'} account`}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block overflow-hidden order-1 lg:order-2">
        <img
          src="https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-background/95 via-background/70 to-background/30" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <div />
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-semibold leading-tight max-w-md">
              Join the new way to dine.
            </h2>
            <ul className="space-y-3 text-sm">
              {[
                'Live wait times across 2,400+ restaurants',
                'Pre-order meals before you sit down',
                'Get notified the moment your table is ready',
                'Build a history of favorites you love',
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 z-10 h-4 w-4 text-muted-foreground pointer-events-none shrink-0" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border/60 bg-surface/50 backdrop-blur-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition text-sm shadow-sm"
        />
      </div>
    </div>
  );
}
