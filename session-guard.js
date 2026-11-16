document.addEventListener('DOMContentLoaded', async () => {
  try {
    const result = await SpaceCareAPI.me();
    const userName = result.user?.name?.trim();
    if (!userName) return;

    const parts = userName.split(/\s+/);
    const firstName = parts[0];
    const shortName = parts.slice(0, 2).join(' ');
    const initials = parts
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const welcomeHeading = document.querySelector('.welcome-section h1');
    if (welcomeHeading) welcomeHeading.textContent = `Welcome back, ${firstName}.`;

    const profileName = document.querySelector('.profile-text-details h3');
    if (profileName) profileName.textContent = userName;

    const profileStrong = document.querySelector('.profile strong');
    if (profileStrong) profileStrong.textContent = shortName;

    const sidebarCrewName = document.querySelector('.crew-card h4');
    if (sidebarCrewName) {
      sidebarCrewName.textContent = shortName;
      sidebarCrewName.title = userName;
    }

    const sidebarCrewAvatar = document.querySelector('.crew-card .avatar');
    if (sidebarCrewAvatar) sidebarCrewAvatar.textContent = initials;

    document.querySelectorAll('.profile-avatar, .profile-avatar-large').forEach(el => {
      el.textContent = initials;
    });

    // Calculate real Mission Day from account creation date
    if (result.user?.created_at) {
      const createdDate = new Date(result.user.created_at.replace(' ', 'T'));
      if (!isNaN(createdDate.getTime())) {
        const diffMs = Math.max(0, Date.now() - createdDate.getTime());
        const missionDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
        const formattedDay = String(missionDay).padStart(3, '0');

        const sidebarDay = document.querySelector('.crew-card p');
        if (sidebarDay) sidebarDay.textContent = `Mission Day ${formattedDay}`;

        const eyebrowDay = document.querySelector('.welcome-section .eyebrow');
        if (eyebrowDay) {
          const envTag = typeof getActiveEnvironmentConfig === 'function'
            ? getActiveEnvironmentConfig().eyebrowTag
            : 'SPACECRAFT';
          eyebrowDay.textContent = `MISSION DAY ${formattedDay} · ${envTag}`;
        }

        const routineSub = document.querySelector('#routine .routine-title-area p');
        if (routineSub) {
          const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
          routineSub.textContent = `${dayName}, Mission Day ${formattedDay} · visible in-app reminders for this prototype.`;
        }
      }
    }
  } catch (_) {
    if (!location.pathname.endsWith('login.php')) location.href = 'login.php';
  }
});