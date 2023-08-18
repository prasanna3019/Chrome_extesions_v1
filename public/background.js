let notificationCount=0;
// Function to show a Chrome notification with an error message
function showErrorNotification(message) {
  const notificationOptions = {
    type: "basic",
    title: "Chrome_extensions_error",
    message: message,
    iconUrl: "datalake16.png", 
  };
  const notificationId = `errorNotification_${Date.now()}_${notificationCount}`;
  chrome.notifications.create(notificationId, notificationOptions);
  notificationCount++;
}
let loginpage = false;
// let logout    = false;
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message == "login") {
      if (loginpage) {
        console.log("Authentication page is already open");
        const errorMessage = "Authentication page is already open";
        showErrorNotification(errorMessage);
        return;
      }
      loginpage = true;
      console.log(chrome.identity.getRedirectURL());
      const ionapi = JSON.parse(request.file);
      const TenatID = ionapi.ti;
      const HOST = ionapi.pu;
      const AUTH_EP = ionapi.oa;
      const CLIENT_ID = encodeURIComponent(ionapi.ci);
      const RESPONSE_TYPE = 'token';
      const REDIRECT_URL = ionapi.ru;

      let url = `
${HOST}
${AUTH_EP}
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URL}
&state=abc
&scope=email
&nonce=ssss`;

      console.log(TenatID);

      try {
        const redirect_uri = chrome.identity.launchWebAuthFlow({
          url,
          interactive: true,
        },async function (redirect_uri) {
          loginpage = false;
          try {
            if (redirect_uri != undefined) {
              if (redirect_uri.includes("access_token=")) {
                console.log(redirect_uri);
                const ret = redirect_uri.split('access_token=')[1];
                const token = ret.split('&state')[0];
                console.log("token ", token);
                sendResponse({ message: token });
              } else if (redirect_uri.includes("error_description=")) {
                const errorMessage = "something went worng when login";
                showErrorNotification(errorMessage);
                return;
              }
            } else if (redirect_uri === undefined) {
              const errorMessage = "something went worng when login";
              showErrorNotification(errorMessage);
              return;
            } else {
              console.log("please check the redirect uri");
              const errorMessage = "please check the redirect uri";
              showErrorNotification(errorMessage);
              return;
            }
          } catch (error) {
            const errorMessage = "An error occurred: " + error.message;
            showErrorNotification(errorMessage);
            console.log("error when authorizing: " + error);
          }
        });
      // } catch (error) {
      //   console.log(error);
      //   const errorMessage = "An error occurred: " + error.message;
      //   showErrorNotification(errorMessage);
      // }
    } catch (error) {
      console.log(error);
      const errorMessage = "An error occurred: " + error.message;
      showErrorNotification(errorMessage);
      if (error.message.includes("The user did not approve access")) {
        console.log("The user did not approve access");
      }
    }

      return true;
    } else if (request.message == "logout") {
      const logoutUrl = "https://mingle-sso.inforcloudsuite.com/idp/startSLO.ping?TargetResource=https%3a%2f%2fmingle-portal.inforcloudsuite.com%2fetc%2fsignoutSuccess";
      chrome.identity.launchWebAuthFlow(
        {
          url: logoutUrl,
          interactive: true,
        }
      );
    }
  }
);
