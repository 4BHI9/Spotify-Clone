// console.log("ajj javascript likhna hai");
let currentSong = new Audio()
let songs = [];
let currFolder;

function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Use padStart to add leading zero if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function GetSongs(folder) {
    currFolder = folder;
    let a = await fetch((`${folder}/`));
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}/`)[1])
        }

    }

    let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {

        songUl.innerHTML = songUl.innerHTML +
            `
        <li>
        <div class="card-left border flex items-center">
            <img src="images/music.svg" alt="">
            <div class="info">
                <div class="songName">${song.split("-")[1].replaceAll("%20", " ").replace(".mp3", " ")}</div>
                <div class="artist">${song.split("-")[0].replaceAll("%20", " ")}</div>
            </div>

            <img class="playNow" src="images/play.svg" alt="">
        </div>
    </li>`
    }
    // attach event listner to each song 
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {

        e.addEventListener('click', element => {
            // console.log(((e.querySelector(".info > .artist").innerHTML) + "-" + (e.querySelector(".info > .songName").innerHTML) + ".mp3").trim().replace(" .mp3", ".mp3"))
            playMusic(((e.querySelector(".info > .artist").innerHTML) + "-" + (e.querySelector(".info > .songName").innerHTML) + ".mp3").trim().replace(" .mp3", ".mp3"))
        })
    })

    return songs



}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = (`${currFolder}/` + track)

    if (!pause) {
        currentSong.play()
        play.src = 'images/pause.svg'
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track).split(".mp3")[0].fontcolor("gray")
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00".fontcolor("gray")



}
// DISPLAY ALL THE ALBUMS ON THE PAGE
async function displayAlbums() {
    // console.log("displayAlbums")
    let a = await fetch((`songs/`));
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let x = div.getElementsByTagName("a")
    // console.log(x)
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(x)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.title.includes("s")) {
            let folder = e.title
            // console.log((e.title))
            // get metadata for the folder
            let a = await fetch((`songs/${folder}/info.json`));
            let response = await a.json();
            // console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div data-folder="${folder}" id="sp1" class="card border ">
            <img src='songs/${folder}/cover.jpg' alt="">
            <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24"
                height="24" color="#9b9b9b" fill="none">
                <path
                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
            <h1 class="undr">${response.title}</h1>
            <p class="undr">${response.description}</p>
        </div>`
        }
    }
    // load the playlist whenever the card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e)
        e.addEventListener("click", async item => {
            // console.log("fetching songs")
            // console.log(item.currentTarget.dataset.folder)

            songs = await GetSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })

}


async function Main() {

    // get the song from above function
    await GetSongs("songs/sp1")
    // console.log(songs)

    //play the  first song
    playMusic(songs);


    await displayAlbums()



    // ATTAch an event listner to play , next , prev
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = 'images/pause.svg'

        }
        else {
            currentSong.pause()
            play.src = 'images/play.svg'
        }
    })

    // make time update using the global function
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}`.fontcolor("gray")
        document.querySelector(".plug").style.left = ((currentSong.currentTime / currentSong.duration) * 100 + "%")
    })

    // add an eventlistner to seekbar
    document.querySelector(".bar").addEventListener("click", e => {
        // console.log((e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%")
        let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100)
        document.querySelector(".plug").style.left = percent + "%"
        // console.log(((currentSong.duration) * percent) / 100)
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    // next and previous button functiions
    next.addEventListener("click", () => {
        // console.log(songs.indexOf(currentSong.src.split("/").slice(-1)[0]))
        const index = songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1])
        // console.log(index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }


    })
    prev.addEventListener("click", () => {
        const index = songs.indexOf(currentSong.src.split(`/${currFolder}/`)[1])
        // console.log(index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }


    }
    )

    document.querySelector(".lft").addEventListener("click", () => {
        document.querySelector(".left").style.position = 'absolute'
        document.querySelector(".left").style.left = ("-" + 100 + "%")
        document.querySelector(".right").style.width = (98.8 + "vw")
        document.querySelector(".play-buttons").style.left = (47 + "vw")

        // document.querySelector(".left").style.width = document.querySelector(".if-left").style
        // console.log(document.querySelector(".left").style)

    })
    document.querySelector(".rht").addEventListener("click", () => {
        document.querySelector(".left").style.position = 'static'
        document.querySelector(".right").style.width = (77.8 + "vw")
        document.querySelector(".play-buttons").style.left = (34 + "vw")

        // document.querySelector(".left").style.width = document.querySelector(".if-left").style
        // console.log(document.querySelector(".left").style)

    })




}
Main()