import React from "react";
import './styles.css';

export default function Summary({ tracks, artists, genreList, image }) {
    return (
        <div class='summary'>
            <img src={image} alt='' />
            <div class='summary-genres'>
                <div class='summary-subtitle'>Top Genres</div>
                <h2>{genreList[0]}</h2>
                <h2>{genreList[1]}</h2>
                <h2>{genreList[2]}</h2>
            </div>
            <p>&nbsp;</p>
            <div class='summary-artists'>
                <div class='summary-subtitle'>Top Artists</div>
                {artists.map((artist, key) =>
                    <h3>
                        {key + 1}.&nbsp;{artist}
                    </h3>)}
            </div>
            <p>&nbsp;</p>
            <div class='summary-tracks'>
                <div class='summary-subtitle'>Top Tracks</div>
                {tracks.map((track, key) =>
                    <h3>
                        {key + 1}.&nbsp;{track}
                    </h3>)}
            </div>
        </div >
    )
}