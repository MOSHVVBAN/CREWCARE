window.SpaceCareAPI = (() => {
  const endpoint = 'api/index.php';

  async function request(action, method = 'GET', payload = null) {
    const options = { method, credentials: 'same-origin', headers: { 'Accept': 'application/json' } };
    if (payload !== null) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(payload);
    }
    const response = await fetch(`${endpoint}?action=${encodeURIComponent(action)}`, options);
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) throw new Error(result.message || 'Request failed.');
    return result;
  }

  return {
    request,
    register: data => request('register', 'POST', data),
    login: data => request('login', 'POST', data),
    logout: () => request('logout', 'POST', {}),
    me: () => request('me'),
    saveMeasurement: data => request('measurements', 'POST', data),
    getMeasurements: () => request('measurements'),
    saveDailyCheck: data => request('daily-check', 'POST', data),
    getDailyChecks: () => request('daily-check'),
    predictRisk: data => request('predict-risk', 'POST', data),
    saveWellness: data => request('wellness', 'POST', data),
    getWellness: () => request('wellness'),
    getTasks: () => request('tasks'),
    addTask: data => request('tasks', 'POST', data),
    updateTask: data => request('tasks', 'PATCH', data),
    getAlerts: () => request('alerts'),
    addAlert: data => request('alerts', 'POST', data),
    reviewAlert: data => request('alerts-review', 'PATCH', data),
    getSettings: () => request('settings'),
    saveSettings: data => request('settings', 'PUT', data),
    updateProfile: data => request('profile', 'PUT', data),
  };
})();