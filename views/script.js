var isDomReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

let subscription;
isDomReady((e) =>{

   
    const publicVapidKey = 'BLW96EBxdwHd2AQQoQSlc4DFd2_mQb8ff3vIF-9bgCn4NcNqn6MBL3sXVeG-6eqh-hCVFyj2D-2p2p3f_VB8P_w';

    document.getElementById('subscribe').addEventListener('click', async (e)=> {
        const registration = await navigator.serviceWorker.register('worker.js');

        if(subscription)
        {console.log('already subsribed')
            return;
        }
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        console.log(subscription);

        await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        });
    });



    function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
      
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }
});