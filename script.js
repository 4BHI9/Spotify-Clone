console.log("ajj javascript likhna hai");
let currentSong = new Audio()
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


async function GetSongs() {

    let a = await fetch(("http://127.0.0.1:5500/songs/"));
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let lis = div.getElementsByTagName("li")
    // console.log(lis)
    let as = div.getElementsByTagName("a")
    // console.log(as)
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs


}
const playMusic = (track) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = ("/songs/" + track)
    currentSong.play()
    play.src = '/images/pause.svg'
    document.querySelector(".songinfo").innerHTML = track.split(".mp3")[0].fontcolor("gray")
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00".fontcolor("gray")



}

async function Main() {

    // get the song from above function
    let songs = await GetSongs()
    // console.log(songs)


    let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML +
            `
        <li>
        <div class="card-left border flex items-center">
            <img src="/images/music.svg" alt="">
            <div class="info">
                <div class="songName">${song.split("-")[1].replaceAll("%20", " ").replace(".mp3", " ")}</div>
                <div class="artist">${song.split("-")[0].replaceAll("%20", " ")}</div>
            </div>

            <img class="playNow" src="/images/play.svg" alt="">
        </div>
    </li>`
    }

    // attach event listner to each song 
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {

        e.addEventListener('click', element => {
            console.log(((e.querySelector(".info > .artist").innerHTML) + "-" + (e.querySelector(".info > .songName").innerHTML) + ".mp3").trim().replace(" .mp3", ".mp3"))
            playMusic(((e.querySelector(".info > .artist").innerHTML) + "-" + (e.querySelector(".info > .songName").innerHTML) + ".mp3").trim().replace(" .mp3", ".mp3"))
        })
    })

    // ATTAch an event listner to play , next , prev
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = '/images/pause.svg'

        }
        else {
            currentSong.pause()
            play.src = '/images/play.svg'
        }
    })

    // make time update using the global function
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}}`.fontcolor("gray")
        document.querySelector(".plug").style.left = ((currentSong.currentTime / currentSong.duration) * 100 + "%")
    })

    // add an eventlistner to seekbar
    document.querySelector(".bar").addEventListener("click", e => {
        console.log((e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%")
        let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100)
        document.querySelector(".plug").style.left = percent + "%"
        console.log(((currentSong.duration) * percent) / 100)
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })
}
Main()