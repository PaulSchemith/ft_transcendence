let connectedFrom_mobile = false;
let connectedFrom_desktop = false;
let two_fa = false;
let sessionUsername;
let connected = false;



//****** DOMAIN URLS *********************
const domainPath = "https://10.12.5.4:8002";
// const domainPath = 'https://transcendence42.ddns.net:8002';

if ('ontouchstart' in window || navigator.maxTouchPoints) {
    // console.log("The user is connecting from a mobile phone.");
    connectedFrom_mobile = true;
    const ctrlLeft = document.getElementById('mobileCtrlLeft');
    ctrlLeft.classList.remove('hidden-element');
    const ctrlRight = document.getElementById('mobileCtrlRight');
    ctrlRight.classList.remove('hidden-element');
} else {
    // console.log("The user is connecting from a desktop.");
    connectedFrom_desktop = true;
}

// function isLandscapeMode() {
//     return window.innerWidth < window.innerHeight;
// }

// function handleOrientationChange() {

//     const gameDiv = document.getElementById('gameDiv');
//     const navbar = document.getElementById('navbar');
//     const footer = document.getElementById('footer');

//     if (isLandscapeMode() && connectedFrom_mobile) {
//         // Code to execute when the device is in landscape mode
//         console.log('In landscape mode');
//         gameDiv.style.maxWidth = '300px';
//         navbar.classList.add('hidden-element');
//         footer.classList.add('hidden-element');


//     } else {
//         // Code to execute when the device is not in landscape mode
//         console.log('Not in landscape mode');
//         gameDiv.style.maxWidth = '900px';
//         navbar.classList.remove('hidden-element');
//         footer.classList.remove('hidden-element');



//     }

// }
//   // Add an event listener for the orientationchange event
//   window.addEventListener('orientationchange', handleOrientationChange);

//   // Execute the handler on the initial page load
//   handleOrientationChange();