const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

async function submitRating({ restaurantId, score }) {
  const res = await fetch(`${API_URL}/ratings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ restaurantId, score }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to submit rating');
  return result;
}

export const ratingService = { submitRating };
