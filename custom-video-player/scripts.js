/* Get the elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip');
const ranges = player.querySelectorAll('.player__slider');
const fullScreen = player.querySelector('.fullscreen');

let isUpdating = false;
let isFullScreen = false;
let mousedown = false;

/* Build the functions */

// Function for the Play Btn
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

// Function when clicking the video
function toggleVideoPlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip(){
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

// challenge - make video go full screen after adding fullscreen button
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (video.requestFullscreen) { 
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { 
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { 
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { 
            video.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { 
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { 
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { 
            document.msExitFullscreen();
        }
    }
}


/* Hook up the event listeners */
video.addEventListener('click', toggleVideoPlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
//ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

// challenge - set up for when the mouse is down to update
ranges.forEach(range => range.addEventListener('mousedown', (e) => isUpdating = true));
ranges.forEach(range => range.addEventListener('mouseup', (e) => isUpdating = false));

progress.addEventListener('click', scrub);
// if clicking down, returns true, does nothing if false
progress.addEventListener('mousemove', (e) => mousedown && scrub(e)); 
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);


// Challenge - get into full screen
fullScreen.addEventListener('click', toggleFullScreen );

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        console.log("Entered fullscreen");
        video.addEventListener("click", togglePlay); // Ensure click works in fullscreen
    } else {
        console.log("Exited fullscreen");
        video.removeEventListener("click", togglePlay); // Remove listener when exiting fullscreen
    }
});