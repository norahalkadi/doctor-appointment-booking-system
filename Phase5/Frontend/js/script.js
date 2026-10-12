

const BASE_URL = 'http://localhost:3000';

const API = {

  get: async function(url) {
    try {
      const response = await fetch(BASE_URL + url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('GET Error:', error);
      return null;
    }
  },

  post: async function(url, body) {
    try {
      const response = await fetch(BASE_URL + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('POST Error:', error);
      return null;
    }
  },

  put: async function(url, body) {
    try {
      const response = await fetch(BASE_URL + url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('PUT Error:', error);
      return null;
    }
  },

  delete: async function(url) {
    try {
      const response = await fetch(BASE_URL + url, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('DELETE Error:', error);
      return null;
    }
  }

};


function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  alertDiv.style.zIndex = '9999';
  alertDiv.style.minWidth = '300px';
  alertDiv.innerHTML = `${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}


function showLoading(show) {
  let spinner = document.getElementById('loadingSpinner');
  if (show && !spinner) {
    spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center';
    spinner.style.backgroundColor = 'rgba(0,0,0,0.5)';
    spinner.style.zIndex = '9998';
    spinner.innerHTML = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>';
    document.body.appendChild(spinner);
  } else if (!show && spinner) {
    spinner.remove();
  }
}


function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  highlightCurrentPage();
});

console.log('ClinicBook script.js ready');