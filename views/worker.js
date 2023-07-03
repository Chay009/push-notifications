self.addEventListener('push', e => {
    const data = e.data.json();
    if(data.title && data.body)
    {
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'favicon.png',
        image: data.image
      });
    }
    
});