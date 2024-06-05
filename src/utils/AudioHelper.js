import MusicStore from "../stores/MusicStore";

const playSong = (song) => {

    MusicStore.update(s => {
        s.currentSong = song.audioUrl;
        s.isPlaying = true;
        s.songInfo = song;

        

    });
}

const addToQueue = (song) => {
    MusicStore.update(s => {
        s.queue.push(song);
    });
}

const removeFromQueue = (index) => {

    const newQueue = [...queue];
    newQueue.splice(index, 1);
    MusicStore.update(s => {
        s.queue = newQueue;
    });
}

export { playSong, addToQueue };