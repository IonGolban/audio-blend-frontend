import { Store } from "pullstate";

const MusicStore = new Store({
    queue: [],
    currentSong: null,
    isPlaying: false,
    isMuted: false,
    volume: 1,
    isLooping: false,
    songInfo: {},
});

export default MusicStore;