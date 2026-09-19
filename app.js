// DriveShare - Peer-to-Peer Car Rental App

const STORAGE_KEY = 'driveshare_cars';
const OWNER_KEY = 'driveshare_owner_id';

// Default placeholder images (Unsplash car photos)
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583121274602-3e282f38bc1f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop',
];

// Seed data - South African cities
const SEED_CARS = [
  {
    id: 'seed1',
    make: 'Toyota',
    model: 'Corolla',
    year: 2021,
    price: 450,
    location: 'Johannesburg, Sandton',
    description: 'Reliable and fuel-efficient. Perfect for city driving. Automatic transmission, Bluetooth, reverse camera.',
    image: PLACEHOLDER_IMAGES[0],
    owner: 'Thabo M.',
    ownerId: 'seed',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'seed2',
    make: 'Volkswagen',
    model: 'Polo',
    year: 2020,
    price: 380,
    location: 'Cape Town, Sea Point',
    description: 'Compact and stylish. Great for coastal drives. Aircon, USB charging, low mileage.',
    image: PLACEHOLDER_IMAGES[1],
    owner: 'Sarah K.',
    ownerId: 'seed',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'seed3',
    make: 'BMW',
    model: '3 Series',
    year: 2019,
    price: 850,
    location: 'Johannesburg, Rosebank',
    description: 'Luxury sedan with full leather interior, sunroof, and premium sound system. Ideal for business trips.',
    image: PLACEHOLDER_IMAGES[2],
    owner: 'James N.',
    ownerId: 'seed',
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'seed4',
    make: 'Ford',
    model: 'Ranger',
    year: 2022,
    price: 650,
    location: 'Durban, Umhlanga',
    description: 'Powerful bakkie perfect for adventures or moving. 4x4 capable, spacious cabin, tow bar included.',
    image: PLACEHOLDER_IMAGES[3],
    owner: 'Lerato P.',
    ownerId: 'seed',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'seed5',
    make: 'Hyundai',
    model: 'i20',
    year: 2023,
    price: 320,
    location: 'Pretoria, Centurion',
    description: 'Brand new hatchback. Super economical, touchscreen infotainment, reverse sensors.',
    image: PLACEHOLDER_IMAGES[4],
    owner: 'Aisha R.',
    ownerId: 'seed',
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 'seed6',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2020,
    price: 950,
    location: 'Cape Town, Camps Bay',
    description: 'Elegant and powerful. Premium comfort for special occasions or longer trips along the coast.',
    image: PLACEHOLDER_IMAGES[5],
    owner: 'David L.',
    ownerId: 'seed',
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'seed7',
    make: 'Nissan',
    model: 'Qashqai',
    year: 2021,
    price: 520,
    location: 'Johannesburg, Midrand',
    description: 'Spacious SUV crossover. High seating position, large boot, perfect for families.',
    image: PLACEHOLDER_IMAGES[0],
    owner: 'Nomsa D.',
    ownerId: 'seed',
    createdAt: Date.now() - 86400000 * 6
  },
  {
    id: 'seed8',
    make: 'Kia',
    model: 'Picanto',
    year: 2022,
    price: 280,
    location: 'Durban, Berea',
    description: 'Tiny and cheap to run. Ideal for students or short city hops. Surprisingly roomy inside.',
    image: PLACEHOLDER_IMAGES[1],
    owner: 'Sipho B.',
    ownerId: 'seed',
    createdAt: Date.now() - 86400000 * 8
  }
];

let currentCar = null;
let currentSearch = '';

// Initialize
function init() {
  // Ensure owner ID
  if (!localStorage.getItem(OWNER_KEY)) {
    localStorage.setItem(OWNER_KEY, 'user_' + Math.random().toString(36).slice(2, 11));
  }

  // Seed if empty
  let cars = getCars();
  if (cars.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CARS));
    cars = SEED_CARS;
  }

  // Mobile menu
  document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobile);

  // Form submit
  document.getElementById('list-form').addEventListener('submit', handleListCar);

  // Search on Enter
  document.getElementById('search-location').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCars();
  });

  // Show all cars initially
  renderCars(cars);
  updateResultsTitle(cars.length, '');
}

function getCars() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCars(cars) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
}

function getOwnerId() {
  return localStorage.getItem(OWNER_KEY);
}

function toggleMobile() {
  document.getElementById('mobile-menu').classList.toggle('hidden');
}

function showView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('view-' + view).classList.remove('hidden');
  window.scrollTo(0, 0);

  if (view === 'my') {
    renderMyCars();
  }
  if (view === 'home' && currentSearch) {
    // keep current results
  } else if (view === 'home') {
    const cars = getCars();
    renderCars(cars);
    updateResultsTitle(cars.length, '');
  }
}

function quickSearch(city) {
  document.getElementById('search-location').value = city;
  searchCars();
}

function searchCars() {
  const query = document.getElementById('search-location').value.trim().toLowerCase();
  currentSearch = query;
  const cars = getCars();
  
  let filtered = cars;
  if (query) {
    filtered = cars.filter(c => 
      c.location.toLowerCase().includes(query) ||
      c.make.toLowerCase().includes(query) ||
      c.model.toLowerCase().includes(query)
    );
  }

  renderCars(filtered);
  updateResultsTitle(filtered.length, query);
  showView('home');
}

function updateResultsTitle(count, query) {
  const title = document.getElementById('results-title');
  const countEl = document.getElementById('results-count');
  if (query) {
    title.textContent = `Cars in "${query}"`;
    countEl.textContent = `${count} car${count !== 1 ? 's' : ''} found`;
  } else {
    title.textContent = 'Available Cars';
    countEl.textContent = `${count} car${count !== 1 ? 's' : ''} listed`;
  }
}

function renderCars(cars) {
  const grid = document.getElementById('cars-grid');
  const noResults = document.getElementById('no-results');

  if (cars.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  grid.innerHTML = cars.map(car => carCardHTML(car)).join('');
}

function carCardHTML(car) {
  const img = car.image || PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
  return `
    <div class="car-card bg-white rounded-2xl shadow-md overflow-hidden transition duration-300 cursor-pointer" onclick="openModal('${car.id}')">
      <div class="relative h-48">
        <img src="${img}" alt="${car.make} ${car.model}" class="w-full h-full object-cover" onerror="this.src='${PLACEHOLDER_IMAGES[0]}'">
        <span class="absolute top-3 right-3 bg-white/90 backdrop-blur text-blue-700 font-bold text-sm px-3 py-1 rounded-full">
          R${car.price}/day
        </span>
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg text-gray-900">${car.year} ${car.make} ${car.model}</h3>
        <p class="text-gray-500 text-sm mt-1"><i class="fas fa-map-marker-alt mr-1 text-blue-500"></i>${car.location}</p>
        <p class="text-gray-600 text-sm mt-2 line-clamp-2">${car.description || 'No description provided.'}</p>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-xs text-gray-400"><i class="fas fa-user mr-1"></i>${car.owner}</span>
          <button class="text-blue-600 text-sm font-medium hover:underline">View details →</button>
        </div>
      </div>
    </div>
  `;
}

function openModal(id) {
  const cars = getCars();
  const car = cars.find(c => c.id === id);
  if (!car) return;
  currentCar = car;

  document.getElementById('modal-image').src = car.image || PLACEHOLDER_IMAGES[0];
  document.getElementById('modal-title').textContent = `${car.year} ${car.make} ${car.model}`;
  document.getElementById('modal-location').innerHTML = `<i class="fas fa-map-marker-alt mr-1"></i>${car.location}`;
  document.getElementById('modal-price').textContent = `R${car.price} / day`;
  document.getElementById('modal-desc').textContent = car.description || 'No description provided.';
  document.getElementById('modal-owner').textContent = `Listed by ${car.owner}`;

  const modal = document.getElementById('car-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  const modal = document.getElementById('car-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  currentCar = null;
}

function requestRent() {
  if (!currentCar) return;
  showToast(`Request sent to ${currentCar.owner} for the ${currentCar.make} ${currentCar.model}! They will contact you soon.`);
  closeModal();
}

function handleListCar(e) {
  e.preventDefault();

  const make = document.getElementById('car-make').value.trim();
  const model = document.getElementById('car-model').value.trim();
  const year = parseInt(document.getElementById('car-year').value);
  const price = parseInt(document.getElementById('car-price').value);
  const location = document.getElementById('car-location').value.trim();
  const description = document.getElementById('car-desc').value.trim();
  const image = document.getElementById('car-image').value.trim();
  const owner = document.getElementById('owner-name').value.trim();

  const newCar = {
    id: 'car_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    make,
    model,
    year,
    price,
    location,
    description,
    image: image || PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)],
    owner,
    ownerId: getOwnerId(),
    createdAt: Date.now()
  };

  const cars = getCars();
  cars.unshift(newCar);
  saveCars(cars);

  // Reset form
  e.target.reset();
  showToast('Your car has been listed successfully!');
  showView('my');
}

function renderMyCars() {
  const cars = getCars().filter(c => c.ownerId === getOwnerId());
  const grid = document.getElementById('my-cars-grid');
  const noCars = document.getElementById('no-my-cars');

  if (cars.length === 0) {
    grid.innerHTML = '';
    noCars.classList.remove('hidden');
    return;
  }

  noCars.classList.add('hidden');
  grid.innerHTML = cars.map(car => `
    <div class="bg-white rounded-2xl shadow-md overflow-hidden">
      <div class="relative h-48">
        <img src="${car.image}" alt="${car.make} ${car.model}" class="w-full h-full object-cover" onerror="this.src='${PLACEHOLDER_IMAGES[0]}'">
        <span class="absolute top-3 right-3 bg-white/90 text-blue-700 font-bold text-sm px-3 py-1 rounded-full">R${car.price}/day</span>
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg">${car.year} ${car.make} ${car.model}</h3>
        <p class="text-gray-500 text-sm mt-1"><i class="fas fa-map-marker-alt mr-1 text-blue-500"></i>${car.location}</p>
        <button onclick="deleteCar('${car.id}')" class="mt-3 text-red-600 text-sm font-medium hover:underline">
          <i class="fas fa-trash mr-1"></i> Remove listing
        </button>
      </div>
    </div>
  `).join('');
}

function deleteCar(id) {
  if (!confirm('Remove this listing?')) return;
  let cars = getCars().filter(c => c.id !== id);
  saveCars(cars);
  renderMyCars();
  showToast('Listing removed.');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3500);
}

// Close modal on outside click
document.getElementById('car-modal').addEventListener('click', (e) => {
  if (e.target.id === 'car-modal') closeModal();
});

// Start
init();
