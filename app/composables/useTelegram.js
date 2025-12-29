import { ref, onMounted } from 'vue';

export const useTelegram = () => {
  const initData = ref(null);
  const webApp = ref(null);

  const init = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      webApp.value = window.Telegram.WebApp;
      
      const user = webApp.value.initDataUnsafe?.user;
      if (user) {
        initData.value = { user };
      }
    }
  };

  const getAvatarFallback = (user) => {
    if (!user?.firstName) return '?';
    return user.firstName.charAt(0).toUpperCase();
  };

  onMounted(() => {
    init();
  });

  return {
    initData,
    webApp,
    init,
    getAvatarFallback
  };
};