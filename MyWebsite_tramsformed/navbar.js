async function loadSharedNavbar() {
  // Find the container used to mount the shared navbar
  const mountPoint = document.getElementById('navbar-root');
  if (!mountPoint) return;

  try {
    // Request the shared navbar template
    const response = await fetch('navbar.html');
    if (!response.ok) return;

    // Insert navbar.html into the current page
    mountPoint.innerHTML = await response.text();

    // Extract the current page file name from the URL (e.g., design.html)
    const currentPage = decodeURIComponent(window.location.pathname.split('/').pop() || 'home.html');

    // Find the matching link by data-nav-page and add the active class
    mountPoint
      .querySelector(`[data-nav-page="${currentPage}"]`)
      ?.classList.add('is-active');
  } catch (error) {
    // Log errors in the console for debugging if loading fails
    console.error('Failed to load navbar:', error);
  }
}

// Run immediately on page load: inject navbar and highlight current page
loadSharedNavbar();